// Shared Playwright loader for the comparison scripts. Run them from a folder that has `playwright`
// installed, or set PLAYWRIGHT_MODULE (a playwright package directory) and PW_EXE (a Chromium binary).
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import path from 'node:path';

export function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_MODULE, process.cwd(), path.join(process.cwd(), 'node_modules/.pnpm/node_modules')].filter(Boolean);
  for (const t of tries) {
    try { return createRequire(path.join(t, 'noop.js'))(t === process.env.PLAYWRIGHT_MODULE ? t : 'playwright'); } catch { /* next */ }
  }
  console.error('Playwright not found. Run from a project with `playwright` installed, or set PLAYWRIGHT_MODULE.');
  process.exit(2);
}

export const launchOpts = (extra = {}) => ({ ...(process.env.PW_EXE && existsSync(process.env.PW_EXE) ? { executablePath: process.env.PW_EXE } : {}), ...extra });

export function parseArgs(argv) {
  const args = argv.slice(2), flags = {};
  for (let i = 0; i < args.length; i++) if (args[i].startsWith('--')) { flags[args[i].slice(2)] = args[i + 1]; args.splice(i, 2); i--; }
  return { args, flags };
}

export const join = (base, p) => base.replace(/\/$/, '') + (p === '/' ? '/' : p);

/** Load a page, apply optional bridge CSS, scroll through it so lazy content and reveals settle. */
export async function settle(page, url, css) {
  await page.goto(url, { waitUntil: 'load', timeout: 90_000 });
  if (css) await page.addStyleTag({ content: css });
  await page.waitForTimeout(1500);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(800);
}
