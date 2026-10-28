#!/usr/bin/env node
/**
 * compare-layout — geometry of headings, paragraphs, list items, quotes and images (matched by text / alt)
 * on the source vs Atrium: x, width, height, plus the vertical distance to the previous matched element
 * (catches wrong column spans, 50/50 vs 5+6-of-12 splits, wrong aspect ratios, extra margins, padding).
 *
 *   node compare-layout.mjs <source-base> <atrium-base> --paths /,/about [--inject bridge.css] [--width 1440] [--out r.json]
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { loadPlaywright, launchOpts, parseArgs, join, settle } from './_pw.mjs';
const { chromium } = loadPlaywright();
const { args: [SRC, AT], flags } = parseArgs(process.argv);
if (!SRC || !AT) { console.error('usage: compare-layout.mjs <source> <atrium> --paths /,/x [--inject css] [--width 1440] [--out f]'); process.exit(2); }
const css = flags.inject ? readFileSync(flags.inject, 'utf8') : '';

function extract() {
  const out = [];
  for (const el of document.querySelectorAll('main h1, main h2, main h3, main h4, main p, main li, main img, main blockquote, main figcaption')) {
    const cs = getComputedStyle(el); let r = el.getBoundingClientRect();
    if (!r.width || !r.height || cs.visibility === 'hidden') continue;
    const img = el.tagName === 'IMG';
    const t = img ? 'img:' + (el.alt || '').slice(0, 50) : (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50);
    if (t.length < 3 || (!img && el.querySelector('h1,h2,h3,h4,p,li,img'))) continue;
    if (img) { let f = el.parentElement; while (f && f !== document.body && getComputedStyle(f).overflow === 'visible') f = f.parentElement; if (f) { const fr = f.getBoundingClientRect(); if (fr.width && fr.width <= r.width + 1) r = fr; } }
    out.push({ t, tag: el.tagName.toLowerCase(), x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.y + scrollY) });
  }
  return out;
}

const b = await chromium.launch(launchOpts());
const page = await b.newPage({ viewport: { width: +(flags.width || 1440), height: 900 } });
const report = {};
for (const p of (flags.paths || '/').split(',')) {
  await settle(page, join(SRC, p)); const a = await page.evaluate(extract);
  await settle(page, join(AT, p), css); const z = await page.evaluate(extract);
  const used = new Set(), diffs = [], missing = []; let prev = null;
  for (const x of a) {
    const i = z.findIndex((y, j) => !used.has(j) && y.t.toLowerCase() === x.t.toLowerCase());
    if (i < 0) { missing.push(`${x.tag}: ${x.t}`); continue; }
    used.add(i); const y = z[i], d = {};
    if (Math.abs(x.x - y.x) > 4) d.x = [x.x, y.x];
    if (Math.abs(x.w - y.w) > 6) d.w = [x.w, y.w];
    if (Math.abs(x.h - y.h) > 6) d.h = [x.h, y.h];
    if (prev) { const dy1 = x.y - prev[0].y, dy2 = y.y - prev[1].y; if (Math.abs(dy1 - dy2) > 8) d.gapAbove = [dy1, dy2]; }
    prev = [x, y];
    if (Object.keys(d).length) diffs.push({ t: `${x.tag}: ${x.t}`, y: x.y, ...d });
  }
  const extra = z.filter((_, j) => !used.has(j)).map((y) => `${y.tag}: ${y.t}`);
  report[p] = { diffs, missing, extra, height: [a.at(-1)?.y, z.at(-1)?.y] };
  console.log(`\n## ${p}  diffs ${diffs.length}  missing ${missing.length}  extra ${extra.length}`);
  for (const d of diffs) { const { t, y, ...r } = d; console.log(`  ${String(y).padStart(6)} ${t.slice(0, 46).padEnd(46)} ${JSON.stringify(r)}`); }
  if (missing.length) console.log('  MISSING', JSON.stringify(missing));
  if (extra.length) console.log('  EXTRA  ', JSON.stringify(extra));
}
await b.close();
if (flags.out) writeFileSync(flags.out, JSON.stringify(report, null, 1));
