#!/usr/bin/env node
/**
 * compare-typography — measure every text element on the source site and the Atrium site and report
 * differences in font family, size, weight, line height, letter spacing, case, style and colour, plus
 * horizontal overflow, at desktop and mobile widths.
 *
 *   node compare-typography.mjs <source-base-url> <atrium-base-url> [--paths /,/about,...] [--out report.json]
 *
 * Elements are matched by their own text. Needs Playwright with Chromium: run it from a project that has
 * `playwright` installed (or `npm i -D playwright && npx playwright install chromium`), or point
 * PLAYWRIGHT_MODULE at a playwright package directory and PW_EXE at a Chromium binary.
 */
import { createRequire } from 'node:module';
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
const pathsArg = flag('paths');
const outFile = flag('out');
const [sourceBase, atriumBase] = args;
if (!sourceBase || !atriumBase) {
  console.error('usage: node compare-typography.mjs <source-base-url> <atrium-base-url> [--paths /,/about] [--out report.json]');
  process.exit(2);
}

function loadPlaywright() {
  const candidates = [process.env.PLAYWRIGHT_MODULE, path.join(process.cwd(), 'noop.js'), path.join(process.cwd(), 'node_modules/.pnpm/node_modules/noop.js')].filter(Boolean);
  for (const c of candidates) {
    try {
      const req = createRequire(c.endsWith('.js') ? c : path.join(c, 'noop.js'));
      return req(c.endsWith('.js') ? 'playwright' : c);
    } catch { /* try next */ }
  }
  console.error('Playwright not found. Run from a project with `playwright` installed, or set PLAYWRIGHT_MODULE.');
  process.exit(2);
}
const { chromium } = loadPlaywright();

async function discoverPaths(page, base) {
  await page.goto(base, { waitUntil: 'load', timeout: 90_000 });
  const origin = new URL(base).origin;
  const prefix = new URL(base).pathname.replace(/\/$/, '');
  const hrefs = await page.$$eval('header a[href], nav a[href], footer a[href]', (as) => as.map((a) => a.getAttribute('href')));
  const out = new Set(['/']);
  for (const h of hrefs) {
    if (!h || h.startsWith('#') || /^(mailto|tel|https?:)/.test(h) && !h.startsWith(origin)) continue;
    const u = new URL(h, base);
    if (u.origin !== origin) continue;
    out.add((u.pathname.startsWith(prefix) ? u.pathname.slice(prefix.length) : u.pathname) || '/');
  }
  return [...out].slice(0, 40);
}

function extract() {
  const norm = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  const items = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('script,style,svg,noscript')) continue;
    let own = '';
    for (const n of el.childNodes) if (n.nodeType === 3) own += n.textContent;
    own = norm(own);
    if (own.length < 2) continue;
    const key = own.slice(0, 70);
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const isVisible = r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden';
    // Keep the first visible element for each text (hidden copies such as a closed mobile menu are noise).
    if (seen.has(key)) {
      if (!isVisible) continue;
      const prev = items.findIndex((i) => i.key === key);
      if (prev >= 0 && items[prev].visible) continue;
      if (prev >= 0) items.splice(prev, 1);
    }
    seen.add(key);
    items.push({
      key, tag: el.tagName.toLowerCase(),
      family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      size: parseFloat(cs.fontSize), weight: cs.fontWeight,
      lh: cs.lineHeight === 'normal' ? null : parseFloat(cs.lineHeight),
      ls: cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing),
      tt: cs.textTransform, fs: cs.fontStyle, color: cs.color,
      visible: isVisible,
    });
  }
  return { items, overflow: document.documentElement.scrollWidth - window.innerWidth };
}

async function scrape(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 90_000 });
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600));
  });
  return page.evaluate(extract);
}

const near = (a, b, tol) => a === b || (a != null && b != null && Math.abs(a - b) <= tol);
const join = (base, p) => base.replace(/\/$/, '') + (p === '/' ? '/' : p);
const browser = await chromium.launch(process.env.PW_EXE && existsSync(process.env.PW_EXE) ? { executablePath: process.env.PW_EXE } : {});
const report = [];
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
let paths = pathsArg ? pathsArg.split(',') : null;
for (const [vp, size] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({ viewport: size, isMobile: vp === 'mobile', hasTouch: vp === 'mobile' });
  const page = await ctx.newPage();
  if (!paths) paths = await discoverPaths(page, sourceBase);
  for (const p of paths) {
    const s = await scrape(page, join(sourceBase, p));
    const a = await scrape(page, join(atriumBase, p));
    const amap = new Map(a.items.map((i) => [i.key, i]));
    const diffs = [];
    let matched = 0;
    for (const si of s.items) {
      const ai = amap.get(si.key);
      if (!ai || !si.visible || !ai.visible) continue;
      matched++;
      const d = [];
      if (si.family !== ai.family) d.push(`family ${si.family} → ${ai.family}`);
      if (!near(si.size, ai.size, 0.5)) d.push(`size ${si.size} → ${ai.size}`);
      if (si.weight !== ai.weight) d.push(`weight ${si.weight} → ${ai.weight}`);
      if (!near(si.lh, ai.lh, 1)) d.push(`line-height ${si.lh} → ${ai.lh}`);
      if (!near(si.ls, ai.ls, 0.3)) d.push(`letter-spacing ${si.ls} → ${ai.ls}`);
      if (si.tt !== ai.tt) d.push(`case ${si.tt} → ${ai.tt}`);
      if (si.fs !== ai.fs) d.push(`style ${si.fs} → ${ai.fs}`);
      if (si.color !== ai.color) d.push(`colour ${si.color} → ${ai.color}`);
      if (d.length) diffs.push({ text: si.key.slice(0, 60), tag: `${si.tag} → ${ai.tag}`, diffs: d });
    }
    const missing = s.items.filter((i) => i.visible && !amap.has(i.key)).map((i) => i.key.slice(0, 60));
    report.push({ viewport: vp, path: p, sourceTexts: s.items.length, matched, diffs, missing, overflow: { source: s.overflow, atrium: a.overflow } });
    console.log(`${vp.padEnd(7)} ${p.padEnd(32)} matched ${String(matched).padStart(3)}/${String(s.items.length).padEnd(3)} style diffs ${String(diffs.length).padStart(3)}  missing ${String(missing.length).padStart(3)}${a.overflow > 0 ? `  OVERFLOW ${a.overflow}px` : ''}`);
    for (const d of diffs.slice(0, 6)) console.log(`          · "${d.text}" (${d.tag}): ${d.diffs.join('; ')}`);
  }
  await ctx.close();
}
await browser.close();
if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 1));
