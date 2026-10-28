#!/usr/bin/env node
/**
 * compare-controls — every link and button (matched by text) on the source vs the Atrium site: padding, height,
 * width, border, radius, shadow, colours, font, case, and whether it has a trailing/leading icon (svg or a
 * masked ::after). Catches missing arrows, wrong sizes (md vs lg), borders on filled buttons, wrong variants.
 *
 *   node compare-controls.mjs <source-base> <atrium-base> --paths /,/about [--inject bridge.css] [--width 1440] [--out r.json]
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { loadPlaywright, launchOpts, parseArgs, join, settle } from './_pw.mjs';
const { chromium } = loadPlaywright();
const { args: [SRC, AT], flags } = parseArgs(process.argv);
if (!SRC || !AT) { console.error('usage: compare-controls.mjs <source> <atrium> --paths /,/x [--inject css] [--width 1440] [--out f]'); process.exit(2); }
const css = flags.inject ? readFileSync(flags.inject, 'utf8') : '';

function extract() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const col = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return d[3] === 0 ? 'none' : `${d[0]},${d[1]},${d[2]},${(d[3] / 255).toFixed(2)}`; };
  const bdr = (w, c) => (parseFloat(w) ? w + ' ' + col(c) : '0');
  const out = [];
  for (const el of document.querySelectorAll('main a, main button, header a, header button, footer a')) {
    const t = (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    if (!t || !r.width || cs.visibility === 'hidden' || cs.display === 'none') continue;
    const af = getComputedStyle(el, '::after');
    const svgs = [...el.querySelectorAll('svg')].filter((s) => s.getBoundingClientRect().width > 0);
    const icon = af.content !== 'none' && af.content !== 'normal' && (af.maskImage || af.webkitMaskImage || 'none') !== 'none' ? 'end'
      : svgs.length ? (svgs[svgs.length - 1].nextSibling ? 'start' : 'end') : '';
    out.push({ t: t.slice(0, 60), zone: el.closest('header') ? 'header' : el.closest('footer') ? 'footer' : 'main', w: Math.round(r.width), h: Math.round(r.height),
      pad: cs.padding, fs: cs.fontSize, ls: cs.letterSpacing, tt: cs.textTransform, fw: cs.fontWeight, bg: col(cs.backgroundColor), color: col(cs.color),
      bd: bdr(cs.borderTopWidth, cs.borderTopColor), bdb: bdr(cs.borderBottomWidth, cs.borderBottomColor), radius: cs.borderRadius, shadow: cs.boxShadow === 'none' ? '' : 'shadow', icon });
  }
  return out;
}

const b = await chromium.launch(launchOpts());
const page = await b.newPage({ viewport: { width: +(flags.width || 1440), height: 900 } });
const report = {};
for (const p of (flags.paths || '/').split(',')) {
  await settle(page, join(SRC, p)); const a = await page.evaluate(extract);
  await settle(page, join(AT, p), css); const z = await page.evaluate(extract);
  const used = new Set(), diffs = [], missing = [];
  for (const x of a) {
    const i = z.findIndex((y, j) => !used.has(j) && y.zone === x.zone && y.t.toLowerCase() === x.t.toLowerCase());
    if (i < 0) { missing.push(`${x.zone}: ${x.t}`); continue; }
    used.add(i); const y = z[i], d = {};
    for (const k of ['pad', 'fs', 'ls', 'tt', 'fw', 'radius', 'shadow', 'icon', 'bd', 'bdb', 'bg', 'color']) if (String(x[k]) !== String(y[k])) d[k] = [x[k], y[k]];
    if (Math.abs(x.h - y.h) > 2) d.h = [x.h, y.h];
    if (Math.abs(x.w - y.w) > 4) d.w = [x.w, y.w];
    if (Object.keys(d).length) diffs.push({ t: `${x.zone}: ${x.t}`, ...d });
  }
  const extra = z.filter((_, j) => !used.has(j)).map((y) => `${y.zone}: ${y.t}`);
  report[p] = { diffs, missing, extra };
  console.log(`\n## ${p}  diffs ${diffs.length}  missing ${missing.length}  extra ${extra.length}`);
  for (const d of diffs) { const { t, ...r } = d; console.log(`  ${t.slice(0, 48).padEnd(48)} ${JSON.stringify(r)}`); }
  if (missing.length) console.log('  MISSING', JSON.stringify(missing));
  if (extra.length) console.log('  EXTRA  ', JSON.stringify(extra));
}
await b.close();
if (flags.out) writeFileSync(flags.out, JSON.stringify(report, null, 1));
