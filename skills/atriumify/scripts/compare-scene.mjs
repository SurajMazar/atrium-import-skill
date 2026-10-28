#!/usr/bin/env node
/**
 * compare-scene — capture the source's WebGL/canvas animation and the Atrium port at the SAME simulated time
 * (Playwright fake clock), so a port can be checked frame against frame instead of by eye.
 *
 *   node compare-scene.mjs <source-url> <atrium-url> --src-sel "header.relative" --at-sel "main .a-hero" --out shots/hero [--ms 6000] [--js site-ui.js] [--css bridge.css]
 *
 * --js replaces the saved site script in the Atrium HTML (the executable <script> whose code contains --marker,
 * default "site UI"; never the escaped copy inside the Next.js RSC payload) with a local version, so you can test a port before saving it. Writes <out>-source.png / -atrium.png.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { loadPlaywright, launchOpts, parseArgs } from './_pw.mjs';
const { chromium } = loadPlaywright();
const { args: [SRC, AT], flags } = parseArgs(process.argv);
if (!SRC || !AT || !flags.out) { console.error('usage: compare-scene.mjs <source-url> <atrium-url> --src-sel s --at-sel s --out prefix [--ms 6000] [--js f] [--css f]'); process.exit(2); }
const js = flags.js ? readFileSync(flags.js, 'utf8') : '', css = flags.css ? readFileSync(flags.css, 'utf8') : '', marker = flags.marker || 'site UI';
const b = await chromium.launch(launchOpts({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }));
for (const [name, url, sel] of [['source', SRC, flags['src-sel'] || 'main'], ['atrium', AT, flags['at-sel'] || 'main']]) {
  const ctx = await b.newContext({ viewport: { width: +(flags.width || 1440), height: 900 }, deviceScaleFactor: +(flags.dpr || 2) });
  const p = await ctx.newPage();
  await p.clock.install({ time: new Date('2026-01-01T12:00:00Z') });
  if (name === 'atrium' && js) await p.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const r = await route.fetch(); const body = (await r.text()).replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/g, (m, a, code, z) => (code.includes(marker) && !code.includes('__next_f') ? a + js + z : m));
    await route.fulfill({ response: r, body });
  });
  await p.goto(url, { waitUntil: 'load', timeout: 90_000 });
  if (name === 'atrium' && css) await p.addStyleTag({ content: css });
  const box = await p.locator(sel).first().evaluate((e) => { e.scrollIntoView({ block: 'start' }); const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 900) }; });
  await p.clock.runFor(+(flags.ms || 6000));
  // page.screenshot waits for an animation frame, which the fake clock never delivers: capture through CDP.
  const cdp = await ctx.newCDPSession(p);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 }, captureBeyondViewport: false });
  writeFileSync(`${flags.out}-${name}.png`, Buffer.from(data, 'base64'));
  await ctx.close();
}
await b.close();
console.log(`wrote ${flags.out}-source.png and ${flags.out}-atrium.png`);
