#!/usr/bin/env node
/**
 * side-by-side — full-page screenshots of the same path on the source and the Atrium site, cut into strips
 * with the source on the left and Atrium on the right, for a one-to-one visual audit. Look at EVERY strip.
 *
 *   node side-by-side.mjs <source-base> <atrium-base> --paths /,/about --out shots/ [--width 1440] [--inject bridge.css] [--js site-ui.js]
 *
 * Writes <out>/<slug>-<width>-NN.jpg. Run at 1440 and 390. Fixed elements (header, floating buttons) are
 * hidden in full-page captures; check those separately at the top and scrolled.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { loadPlaywright, launchOpts, parseArgs, join, settle } from './_pw.mjs';
const { chromium } = loadPlaywright();
const { args: [SRC, AT], flags } = parseArgs(process.argv);
if (!SRC || !AT || !flags.out) { console.error('usage: side-by-side.mjs <source> <atrium> --paths /,/x --out dir [--width 1440] [--inject css] [--js file]'); process.exit(2); }
const W = +(flags.width || 1440), css = flags.inject ? readFileSync(flags.inject, 'utf8') : '', js = flags.js ? readFileSync(flags.js, 'utf8') : '';
mkdirSync(flags.out, { recursive: true });
const b = await chromium.launch(launchOpts());
const shot = async (url, add) => {
  const p = await b.newPage({ viewport: { width: W, height: 900 }, reducedMotion: 'reduce', isMobile: W < 768, hasTouch: W < 768 });
  await settle(p, url, add ? css : '');
  if (add && js) { await p.addScriptTag({ content: js }); await p.waitForTimeout(800); }
  await p.addStyleTag({ content: '*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important} [style*="position: fixed"],.fixed,#pg-wa,#pg-cursor{visibility:hidden!important}' });
  const buf = await p.screenshot({ fullPage: true, type: 'png' }); const h = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.close(); return { data: buf.toString('base64'), h };
};
const comp = await b.newPage({ viewport: { width: W, height: 1000 } });
for (const path of (flags.paths || '/').split(',')) {
  const [a, z] = [await shot(join(SRC, path)), await shot(join(AT, path), true)];
  const H = Math.max(a.h, z.h), strip = 1200, slug = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '_');
  await comp.setViewportSize({ width: W * 2 + 16, height: strip });
  for (let y = 0, n = 0; y < H; y += strip, n++) {
    await comp.setContent(`<body style="margin:0;background:#f0f;display:flex;gap:16px;height:${strip}px;overflow:hidden">
      <div style="width:${W}px;height:${strip}px;background:url(data:image/png;base64,${a.data}) 0 -${y}px no-repeat"></div>
      <div style="width:${W}px;height:${strip}px;background:url(data:image/png;base64,${z.data}) 0 -${y}px no-repeat"></div></body>`);
    await comp.screenshot({ path: `${flags.out}/${slug}-${W}-${String(n).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 70, scale: 'css' });
  }
  console.log(`${path}: source ${a.h}px, atrium ${z.h}px${Math.abs(a.h - z.h) > 40 ? '  ← height differs: spacing/layout is off' : ''}`);
}
await b.close();
