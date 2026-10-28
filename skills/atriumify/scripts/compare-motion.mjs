#!/usr/bin/env node
// Which blocks animate on scroll, in the source vs the Atrium site, and does anything stay invisible.
//
//   node compare-motion.mjs <sourceBase> <atriumBase> <path>... [--js site-script.js] [--css bridge.css] [--width 1440]
//
// A block counts as animated when, right after load and before any scrolling, it is hidden by an inline
// style (opacity 0 / visibility hidden / a clip-path) or holds word pieces that sit translated behind a
// mask. GSAP, Framer Motion, AOS and the bridge script all leave these marks, so the same detector works on
// both sides. Each block is keyed by its text (or its image's alt) and the kinds are compared:
//   R reveal (fade/slide)   W word/line mask   M image clip mask   S item of a staggered group
// It then scrolls the whole page and lists anything still invisible: content a reveal never released.
// --js / --css inject an unsaved site script / bridge CSS into the Atrium page (test before saving); the
// Atrium runtime's own [data-a-anim] presets are stripped when --js is given, as with theme motion "Off".
import { readFileSync } from 'node:fs';
import { loadPlaywright, launchOpts, parseArgs, join } from './_pw.mjs';

const { args, flags } = parseArgs(process.argv);
const [srcBase, atrBase, ...paths] = args;
if (!srcBase || !atrBase || !paths.length) { console.error('usage: compare-motion.mjs <sourceBase> <atriumBase> <path>... [--js file] [--css file] [--width 1440]'); process.exit(2); }
const width = +(flags.width || 1440);
const js = flags.js ? readFileSync(flags.js, 'utf8') : null, css = flags.css ? readFileSync(flags.css, 'utf8') : null;
const { chromium } = loadPlaywright();
const browser = await chromium.launch(launchOpts());

const DETECT = () => {
  const hidden = (e) => { const s = e.style; return s.opacity === '0' || s.visibility === 'hidden' || /inset/.test(s.clipPath || ''); };
  const key = (e) => {
    const img = e.textContent.trim() ? null : (e.matches('img') ? e : e.querySelector('img'));
    if (img) return 'IMG ' + (img.alt || '').slice(0, 40);
    return (e.getAttribute('aria-label') || e.textContent).replace(/\s+/g, ' ').trim().slice(0, 48);
  };
  // A word/line-masked heading: two or more overflow-hidden spans, each wrapping one moving span.
  const masked = (e) => [...e.children].filter((k) => k.tagName === 'SPAN' && k.children.length === 1 && getComputedStyle(k).overflow === 'hidden').length >= 2;
  const out = [];
  const main = document.querySelector('main') || document.body;
  for (const e of main.querySelectorAll('*')) {
    if (e.closest('footer, .a-header, body > header, [role="banner"], [role="dialog"]') || e.parentElement.closest('[data-cm]')) continue;
    if (masked(e)) { e.setAttribute('data-cm', ''); out.push('W ' + key(e)); continue; }
    if (!hidden(e)) continue;
    e.setAttribute('data-cm', '');
    const sibs = [...e.parentElement.children].filter((k) => k !== e && hidden(k)).length;
    out.push((/inset/.test(e.style.clipPath || '') ? 'M ' : sibs >= 1 ? 'S ' : 'R ') + key(e));
  }
  return out;
};

async function collect(url, inject) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  if (inject && js) await page.addInitScript(() => { new MutationObserver(() => document.querySelectorAll('[data-a-anim]').forEach((e) => e.removeAttribute('data-a-anim'))).observe(document, { subtree: true, childList: true }); });
  await page.goto(url, { waitUntil: 'load', timeout: 90_000 });
  if (inject && css) await page.addStyleTag({ content: css });
  if (inject && js) await page.addScriptTag({ content: js });
  await page.waitForTimeout(2000);
  const found = await page.evaluate(DETECT);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(110); }
  await page.waitForTimeout(2500);
  const stuck = await page.evaluate(() => [...document.querySelectorAll('[data-cm]')].filter((e) => { const c = getComputedStyle(e); return c.opacity === '0' || c.visibility === 'hidden' || /inset/.test(c.clipPath); }).map((e) => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) || e.className.toString().slice(0, 40)));
  await page.close();
  return { found, stuck };
}

const norm = (s) => s.slice(2).toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/^\d+/, '').trim().slice(0, 28);
let problems = 0;
for (const p of paths) {
  const src = await collect(join(srcBase, p), false), atr = await collect(join(atrBase, p), true);
  const a = new Map(atr.found.map((s) => [norm(s), s])), o = new Map(src.found.map((s) => [norm(s), s]));
  const missing = src.found.filter((s) => !a.has(norm(s))), extra = atr.found.filter((s) => !o.has(norm(s)));
  const kind = src.found.filter((s) => a.has(norm(s)) && a.get(norm(s))[0] !== s[0]).map((s) => `${s}  ->  ${a.get(norm(s)).slice(0, 1)}`);
  console.log(`##### ${p}   source ${src.found.length} animated blocks, atrium ${atr.found.length}`);
  if (missing.length) console.log('  MISSING (source animates, Atrium does not):\n    ' + missing.join('\n    '));
  if (extra.length) console.log('  EXTRA (Atrium animates, source does not):\n    ' + extra.join('\n    '));
  if (kind.length) console.log('  DIFFERENT KIND:\n    ' + kind.join('\n    '));
  if (atr.stuck.length) console.log('  STUCK INVISIBLE after a full scroll (Atrium):\n    ' + atr.stuck.join('\n    '));
  problems += missing.length + extra.length + atr.stuck.length;
}
await browser.close();
console.log(problems ? `\n${problems} difference(s): keys that differ only by text order or numbering are noise; everything else is a fix.` : '\nMotion matches.');
