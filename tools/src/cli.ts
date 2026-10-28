/**
 * atrium-bundle — scaffold, pack and validate Atrium site bundles (the zip accepted by
 * "New website → Import" and `atrium import-site`). Bundled into one dependency-free file by
 * tools/build.mjs, using Atrium's own schema, component registry, normalizer and unzip code so
 * validation matches the importer exactly.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { registry } from '@atrium/component-registry';
import { normalizeWebsite } from '@atrium/builder-core/normalize';
import { THEME_PRESETS } from '@atrium/design-tokens';
import { BUNDLE_FORMAT, BUNDLE_VERSION, parseSiteBundle } from '@atrium/exporter/bundle';
import { unzip } from '@atrium/exporter/zip';
import { WebsiteInputSchema, walkNodes, type Node, type WebsiteDefinition } from '@atrium/schema';
import { RENDERER_CSS } from '@atrium/renderer-core/styles';

declare const __ATRIUM_COMMIT__: string;
declare const __RENDERER_SOURCE_CLASSES__: string[];

// ── Importer limits (apps/api: websites.controller, export.service, bundle-assets.service, media) ──
const LIMITS = {
  uploadBytes: 300 * 1024 * 1024, // Multer fileSize on POST /organizations/:orgId/websites/import
  unzippedBytes: 400 * 1024 * 1024, // unzip maxTotalBytes
  files: 2000, // unzip maxFiles
  assets: 500, // BundleAssetsService MAX_ASSETS
  assetBytes: 100 * 1024 * 1024, // UPLOAD_MAX_MB default
  componentErrors: 20, // createFromInput rejects more than 20 component errors
};
const ASSET_PREFIX = 'asset:';
const PLACEHOLDER = 'https://assets.atrium.invalid/';

// ── tiny helpers ──
type Json = unknown;
type Files = Map<string, Buffer>;
const color = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code: number) => (s: string) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
const red = c(31), yellow = c(33), green = c(32), dim = c(2), bold = c(1);
const mb = (n: number) => `${(n / 1024 / 1024).toFixed(n < 10 * 1024 * 1024 ? 2 : 1)} MB`;
const kb = (n: number) => (n < 1024 * 1024 ? `${(n / 1024).toFixed(0)} KB` : mb(n));
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
const has = (bin: string) => spawnSync(process.platform === 'win32' ? 'where' : 'which', [bin], { stdio: 'ignore' }).status === 0;

function die(msg: string): never {
  console.error(red(`error: ${msg}`));
  process.exit(2);
}

const VALUE_FLAGS = new Set(['out', 'name', 'preset', 'max-image', 'quality', 'video-crf', 'max-video-width', 'audio-bitrate']);
function parseArgs(argv: string[]) {
  const pos: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=', 2) as [string, string | undefined];
      if (v !== undefined) flags[k] = v;
      else if (VALUE_FLAGS.has(k) && argv[i + 1] !== undefined) flags[k] = argv[++i]!;
      else flags[k] = true;
    } else if (a === '-o') flags.out = argv[++i] ?? '';
    else pos.push(a);
  }
  return { pos, flags };
}
const num = (v: unknown, d: number) => (v === undefined || v === true ? d : Number(v));

// ── file sniffing (mirrors apps/api/src/common/file-safety.ts MEDIA_TYPES) ──
interface Sniffed {
  mime: string;
  ext: string;
}
function sniff(buf: Buffer, name: string): Sniffed | null {
  const s = (a: number, b: number) => buf.toString('latin1', a, b);
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' };
  if (s(0, 8) === '\x89PNG\r\n\x1a\n') return { mime: 'image/png', ext: 'png' };
  if (s(0, 6) === 'GIF87a' || s(0, 6) === 'GIF89a') return { mime: 'image/gif', ext: 'gif' };
  if (s(0, 4) === 'RIFF' && s(8, 12) === 'WEBP') return { mime: 'image/webp', ext: 'webp' };
  if (s(4, 8) === 'ftyp') {
    const brand = s(8, 12);
    if (brand === 'avif' || brand === 'avis') return { mime: 'image/avif', ext: 'avif' };
    if (brand === 'qt  ') return { mime: 'video/quicktime', ext: 'mov' };
    return { mime: 'video/mp4', ext: 'mp4' };
  }
  if (buf.length >= 4 && buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return { mime: 'video/webm', ext: 'webm' };
  if (s(0, 5) === '%PDF-') return { mime: 'application/pdf', ext: 'pdf' };
  if (s(0, 4) === 'wOFF') return { mime: 'font/woff', ext: 'woff' };
  if (s(0, 4) === 'wOF2') return { mime: 'font/woff2', ext: 'woff2' };
  if (s(0, 4) === 'OTTO') return { mime: 'font/otf', ext: 'otf' };
  if (buf.length >= 4 && buf.readUInt32BE(0) === 0x00010000) return { mime: 'font/ttf', ext: 'ttf' };
  const head = buf.toString('utf8', 0, Math.min(buf.length, 1024)).replace(/^﻿/, '').trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(head) || (/\.svg$/i.test(name) && /<svg[\s>]/i.test(head))) return { mime: 'image/svg+xml', ext: 'svg' };
  return null;
}
const RASTER = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const VIDEO = new Set(['video/mp4', 'video/quicktime', 'video/webm']);
/** Already-compressed formats: stored, not deflated (deflate gains ~0% and wastes time). */
const PRECOMPRESSED = /\.(jpe?g|png|gif|webp|avif|mp4|m4v|mov|webm|woff2?|zip|gz|br|zst)$/i;

function imageSize(buf: Buffer, mime: string): { width: number; height: number } | null {
  try {
    if (mime === 'image/png') return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    if (mime === 'image/gif') return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
    if (mime === 'image/jpeg') {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) return null;
        const marker = buf[i + 1]!;
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        i += 2 + len;
      }
    }
    if (mime === 'image/webp') {
      const chunk = buf.toString('ascii', 12, 16);
      if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
      if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      if (chunk === 'VP8L') {
        const b = buf.readUInt32LE(21);
        return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
      }
    }
  } catch {
    /* fall through */
  }
  return null;
}

// ── bundle directory / zip loading ──
function walk(dir: string, base = dir, out: Files = new Map()): Files {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === '__MACOSX' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else if (entry.isFile()) out.set(path.relative(base, full).split(path.sep).join('/'), readFileSync(full));
  }
  return out;
}

async function load(input: string): Promise<{ files: Files; zipBytes?: number; problems: string[] }> {
  if (!existsSync(input)) die(`${input} does not exist`);
  if (statSync(input).isDirectory()) return { files: walk(input), problems: [] };
  const buf = readFileSync(input);
  try {
    return { files: await unzip(buf, { maxFiles: LIMITS.files, maxTotalBytes: LIMITS.unzippedBytes }), zipBytes: buf.length, problems: [] };
  } catch (err) {
    return { files: new Map(), zipBytes: buf.length, problems: [`The importer cannot read this archive: ${(err as Error).message}`] };
  }
}

const isJsonDoc = (k: string) => k.endsWith('.json') && !k.startsWith('assets/');

function mapStrings(value: Json, fn: (s: string) => string): Json {
  if (typeof value === 'string') return fn(value);
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, fn));
  if (value && typeof value === 'object') {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(value)) out[k] = mapStrings(v, fn);
    return out;
  }
  return value;
}
function eachString(value: Json, fn: (s: string, key: string | undefined) => void, key?: string): void {
  if (typeof value === 'string') fn(value, key);
  else if (Array.isArray(value)) value.forEach((v) => eachString(v, fn, key));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) eachString(v, fn, k);
}

const MEDIA_KEYS = new Set(['src', 'poster', 'image', 'images', 'ogImage', 'logo', 'logoDark', 'logoLight', 'favicon', 'appleTouchIcon', 'thumbnail', 'thumbnailUrl', 'avatar', 'photo', 'backgroundImage', 'blurDataUrl']);
const MEDIA_EXT = /\.(jpe?g|png|gif|webp|avif|svg|mp4|m4v|mov|webm|woff2?|ttf|otf|pdf)$/i;
const IMAGE_HOSTS = /^(images\.unsplash\.com|plus\.unsplash\.com|images\.pexels\.com|videos\.pexels\.com|cdn\.pixabay\.com|picsum\.photos|res\.cloudinary\.com|lh3\.googleusercontent\.com|i\.imgur\.com|fonts\.gstatic\.com)$/i;
/** Hotlinked media worth bundling (not page links, social profiles or embeds). */
function looksLikeMedia(url: string, key: string | undefined): boolean {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (key === 'href' || key === 'link' || key === 'embedUrl') return false;
  if (MEDIA_EXT.test(u.pathname) || IMAGE_HOSTS.test(u.hostname)) return true;
  return key !== undefined && MEDIA_KEYS.has(key);
}

// ── validation ──
interface Report {
  errors: string[];
  warnings: string[];
  info: string[];
  stats: { pages: number; sections: number; forms: number; collections: number; assets: number; assetBytes: number; jsonBytes: number; zipBytes?: number };
}

async function validate(input: string): Promise<Report> {
  const { files, zipBytes, problems } = await load(input);
  const r: Report = { errors: [...problems], warnings: [], info: [], stats: { pages: 0, sections: 0, forms: 0, collections: 0, assets: 0, assetBytes: 0, jsonBytes: 0, zipBytes } };
  if (problems.length) return r;

  // Archive limits.
  const total = [...files.values()].reduce((n, b) => n + b.length, 0);
  if (files.size > LIMITS.files) r.errors.push(`${files.size} files; the importer accepts at most ${LIMITS.files}.`);
  if (total > LIMITS.unzippedBytes) r.errors.push(`Unzipped size ${mb(total)} exceeds ${mb(LIMITS.unzippedBytes)}.`);
  if (zipBytes !== undefined && zipBytes > LIMITS.uploadBytes) r.errors.push(`Zip is ${mb(zipBytes)}; uploads are limited to ${mb(LIMITS.uploadBytes)}.`);
  if (!files.has('site.json')) {
    r.errors.push('Missing site.json at the root of the bundle (one top-level folder is fine; the importer strips it).');
    return r;
  }

  // JSON documents.
  const docs = new Map<string, Json>();
  for (const [name, buf] of files) {
    if (!isJsonDoc(name)) continue;
    r.stats.jsonBytes += buf.length;
    try {
      docs.set(name, JSON.parse(buf.toString('utf8').replace(/^﻿/, '')));
    } catch (err) {
      r.errors.push(`${name} is not valid JSON: ${(err as Error).message}`);
    }
  }
  for (const name of files.keys()) {
    if (!name.startsWith('assets/') && !isJsonDoc(name) && !/(^|\/)readme[^/]*$/i.test(name)) r.warnings.push(`${name} is ignored by the importer (it only reads *.json documents and assets/).`);
  }
  if (r.errors.length) return r;

  // Bundled media.
  const refs = new Set<string>();
  const remote = new Set<string>();
  for (const [name, doc] of docs)
    eachString(doc, (s, key) => {
      if (s.startsWith(ASSET_PREFIX)) refs.add(s.slice(ASSET_PREFIX.length));
      else if (/^https?:\/\//i.test(s) && looksLikeMedia(s, key)) remote.add(`${s} (${name})`);
    });
  r.stats.assets = refs.size;
  if (refs.size > LIMITS.assets) r.errors.push(`${refs.size} referenced assets; bundles may reference at most ${LIMITS.assets}.`);
  for (const ref of refs) {
    const buf = files.get(`assets/${ref}`);
    if (!buf) {
      r.errors.push(`asset:${ref} is referenced but assets/${ref} is not in the bundle.`);
      continue;
    }
    r.stats.assetBytes += buf.length;
    if (buf.length > LIMITS.assetBytes) r.errors.push(`assets/${ref} is ${mb(buf.length)}; media uploads are limited to ${mb(LIMITS.assetBytes)} per file.`);
    const t = sniff(buf, ref);
    if (!t) r.errors.push(`assets/${ref}: file type not accepted by the media library (jpg/png/gif/webp/avif/svg, mp4/webm/mov, pdf, woff/woff2/ttf/otf).`);
    else if (RASTER.has(t.mime) && buf.length > 1.5 * 1024 * 1024) r.warnings.push(`assets/${ref} is ${mb(buf.length)}; \`pack\` converts and resizes images.`);
  }
  const unused = [...files.keys()].filter((k) => k.startsWith('assets/') && !refs.has(k.slice(7)));
  if (unused.length) r.warnings.push(`${unused.length} file(s) in assets/ are not referenced and would be ignored: ${unused.slice(0, 8).join(', ')}${unused.length > 8 ? ', …' : ''}`);
  if (remote.size) r.warnings.push(`${remote.size} media URL(s) are hotlinked, not bundled (\`pack\` downloads them unless --keep-remote): ${[...remote].slice(0, 5).join('; ')}${remote.size > 5 ? '; …' : ''}`);

  // Same pipeline as the importer: rewrite asset refs → parseSiteBundle → WebsiteInputSchema → normalizeWebsite.
  const substituted: Files = new Map();
  for (const [name, doc] of docs) substituted.set(name, Buffer.from(JSON.stringify(mapStrings(doc, (s) => (s.startsWith(ASSET_PREFIX) ? PLACEHOLDER + s.slice(ASSET_PREFIX.length) : s)))));
  let parsed: ReturnType<typeof parseSiteBundle>;
  try {
    parsed = parseSiteBundle(substituted);
  } catch (err) {
    // The importer reports strict-schema issues (missing ids…), which hide the real cause. Ids are
    // optional for imports, so explain with the loose schema the importer actually falls back to.
    const loose = WebsiteInputSchema.safeParse(assemble(substituted));
    if (!loose.success) for (const i of loose.error.issues.slice(0, 25)) r.errors.push(`${i.path.join('.') || '(root)'}: ${i.message}`);
    else r.errors.push((err as Error).message);
    return r;
  }
  r.warnings.push(...parsed.warnings.filter((w) => !w.startsWith('Bundle did not match the strict schema')));
  const loose = WebsiteInputSchema.safeParse(parsed.definition);
  if (!loose.success) {
    for (const i of loose.error.issues.slice(0, 25)) r.errors.push(`${i.path.join('.') || '(root)'}: ${i.message}`);
    return r;
  }
  let def: WebsiteDefinition;
  try {
    const res = normalizeWebsite(loose.data, registry);
    def = res.value;
    const errs = res.issues.filter((i) => i.severity === 'error');
    for (const i of errs) r.errors.push(`${i.path} (${i.type}): ${i.message} — the importer drops or resets this.`);
    // The importer only warns about these, but it silently resets the props or removes the
    // children, so content is lost: report them as errors.
    const lossy = /^(Invalid props|.* does not accept children|.* is not allowed inside|.* cannot bind)/;
    for (const i of res.issues.filter((x) => x.severity === 'warning')) {
      const msg = `${i.path} (${i.type}): ${i.message.replace(/\s*\n\s*/g, ' ')}`;
      if (lossy.test(i.message)) r.errors.push(`${msg} — lost on import (props reset to defaults / children removed).`);
      else r.warnings.push(msg);
    }
    if (errs.length > LIMITS.componentErrors) r.errors.unshift(`${errs.length} component errors: the importer rejects the whole site above ${LIMITS.componentErrors}.`);
  } catch (err) {
    r.errors.push(`Normalization failed: ${(err as Error).message}`);
    return r;
  }
  sampleDefaults(loose.data, r);
  crossCheck(def, r);
  designChecks(def, r, files);
  r.stats.pages = def.pages.length;
  r.stats.sections = def.pages.reduce((n, p) => n + p.sections.length, 0);
  r.stats.forms = def.forms.length;
  r.stats.collections = def.collections.length;
  return r;
}

/** Every class the renderer styles: custom CSS that targets anything else is probably a typo. */
const RENDERER_CLASSES = new Set<string>([
  ...[...RENDERER_CSS.matchAll(/\.(a-[a-z0-9_-]+)/g)].map((m) => m[1]!),
  ...__RENDERER_SOURCE_CLASSES__,
  ...registry.list().flatMap((d) => [`a-${d.type}`, ...(d.variants ?? []).map((v) => `a-${d.type}--${v.id}`)]),
]);
/** Classes built from template strings (`a-hero--${variant}`, `a-tone-${tone}`…) are matched by prefix. */
const knownClass = (c: string) => RENDERER_CLASSES.has(c) || [...RENDERER_CLASSES].some((k) => k.endsWith('-') && c.startsWith(k)) || /^a-(n|tone|pt|pb|r|text|gap|cols|aspect)-/.test(c);

/** Design-bridge and site-script checks (see references/design-fidelity.md). */
function designChecks(def: WebsiteDefinition, r: Report, files: Map<string, Buffer>) {
  const sheets: Array<[string, string]> = [['site customCss', def.customCss ?? '']];
  for (const p of def.pages) if (p.customCss) sheets.push([`pages.${p.slug || 'home'}.customCss`, p.customCss]);
  for (const [where, css] of sheets) {
    if (!css.trim()) continue;
    if (where === 'site customCss' && css.length > 100_000) r.errors.push(`${where} is ${css.length} characters; the limit is 100,000.`);
    if (/asset:/.test(css)) r.errors.push(`${where} references asset: inside CSS; asset references are only rewritten when they are a whole JSON string. Use a component image prop, style.backgroundImage, or an https media URL.`);
    if (/@import/i.test(css)) r.warnings.push(`${where}: @import is removed by Atrium's CSS sanitizer (load fonts through the theme).`);
    for (const m of css.matchAll(/url\(\s*["']?([^"')\s]+)/gi)) {
      const u = m[1]!;
      if (!/^(https:\/\/|\/(?!\/)|\.{0,2}\/|data:image\/(png|jpe?g|webp|gif|avif|svg\+xml)[;,])/i.test(u) && !u.startsWith('#')) r.warnings.push(`${where}: url(${u.slice(0, 60)}) is not allowed (https, relative or data:image only) and will be replaced with none.`);
    }
    const unknown = [...new Set([...css.matchAll(/\.(a-[a-z0-9_-]+)/g)].map((x) => x[1]!))].filter((c) => !knownClass(c));
    if (unknown.length) r.warnings.push(`${where}: ${unknown.length} class(es) the renderer never outputs (typo?): ${unknown.slice(0, 10).map((c) => `.${c}`).join(' ')}. See references/renderer-classes.md.`);
  }
  const site = def.customCss ?? '';
  const { baseSize, scale } = def.theme.typography;
  if (!/--a-text-(xs|sm|4xl|6xl)\s*:/.test(site)) {
    const px = (power: number) => Math.round(baseSize * scale ** power * 10) / 10;
    r.info.push(`No design bridge in site customCss: Atrium's modular type scale gives labels ${px(-2)}px, nav/buttons ${px(-1)}px, h3 ${px(3)}px, h2 ${px(5)}px, hero h1 ${px(7)}px. If the source uses fixed sizes, override --a-text-* (references/design-fidelity.md).`);
  }
  // Logos are shown through <img>, which cannot load web fonts: live <text> renders in a fallback font.
  // Read the raw site.json: the normalized URL schema does not keep asset: references.
  const rawSite = [...files].find(([n]) => n === 'site.json' || n.endsWith('/site.json'))?.[1];
  let branding: Record<string, unknown> = {};
  try { branding = (JSON.parse(rawSite?.toString('utf8') ?? '{}') as { settings?: { branding?: Record<string, unknown> } }).settings?.branding ?? {}; } catch { /* reported elsewhere */ }
  for (const key of ['logo', 'logoInverse']) {
    const ref = branding[key];
    const src = typeof ref === 'string' ? ref : (ref as { src?: string } | undefined)?.src;
    if (!src?.startsWith('asset:') || !/\.svg$/i.test(src)) continue;
    const buf = [...files].find(([n]) => n.endsWith('assets/' + src.slice(6)))?.[1];
    if (buf && /<text[\s>]/.test(buf.toString('utf8'))) r.errors.push(`settings.branding.${key} (${src}) contains <text>: an SVG shown through <img> cannot use the site's web fonts, so the wordmark renders in a fallback font at the wrong size. Convert the text to outlines with scripts/logo-outline.py.`);
  }
  for (const s of def.settings.scripts ?? []) {
    if (!s.code) continue;
    if (s.code.length > 50_000) r.errors.push(`Script "${s.name}" is ${s.code.length} characters; the limit is 50,000.`);
    if (/requestAnimationFrame/.test(s.code) && !/setTimeout/.test(s.code)) r.warnings.push(`Script "${s.name}": requestAnimationFrame does not fire in hidden or embedded views; schedule DOM work with setTimeout (rAF only for canvas render loops).`);
    if (/<script[^>]+src=|import\(\s*['"]https?:|https?:\/\/(cdn\.|unpkg\.com|cdnjs\.|esm\.sh|skypack)/i.test(s.code)) r.errors.push(`Script "${s.name}" loads code from a CDN. Port the code into the script itself (references/exact-reproduction.md §1).`);
    if (/document\.(body|querySelector)/.test(s.code) && !/__reactFiber/.test(s.code)) r.warnings.push(`Script "${s.name}" changes the DOM without waiting for hydration; check for __reactFiber keys first (references/design-fidelity.md §4).`);
  }
}

/**
 * Omitted props are filled from the component's defaultProps, and many defaults are sample content
 * (demo headings, Unsplash images). Warn so the converted site never shows placeholder copy.
 */
function sampleDefaults(input: { header: unknown; footer: unknown; pages: Array<{ slug?: string; sections?: unknown[] }>; globalSections?: Array<{ name: string; node: unknown }> }, r: Report) {
  const isSample = (v: unknown): boolean =>
    (typeof v === 'string' && (/\s/.test(v.trim()) || /^https?:\/\//.test(v))) ||
    (Array.isArray(v) && v.length > 0) ||
    (!!v && typeof v === 'object' && !Array.isArray(v) && Object.values(v as Record<string, unknown>).some(isSample));
  const visit = (n: unknown, where: string) => {
    if (!n || typeof n !== 'object') return;
    const node = n as { type?: string; props?: Record<string, unknown>; children?: unknown[] };
    const def = node.type ? registry.get(node.type) : undefined;
    const props = node.props ?? {};
    const filled = Object.entries(def?.defaultProps ?? {})
      .filter(([k, v]) => !(k in props) && isSample(v))
      .map(([k]) => k);
    if (filled.length) {
      const sample = filled.map((k) => `${k} = ${JSON.stringify(def!.defaultProps![k as never]).slice(0, 70)}`).join('; ');
      r.warnings.push(`${where} (${node.type}): not set, so sample defaults show: ${sample}. Set real values; text can be "" and lists []; media objects cannot be emptied (use a variant that does not show them).`);
    }
    (node.children ?? []).forEach((c, i) => visit(c, `${where}.children[${i}]`));
  };
  visit(input.header, 'header');
  visit(input.footer, 'footer');
  input.globalSections?.forEach((g) => visit(g.node, `global.${g.name}`));
  input.pages.forEach((p) => (p.sections ?? []).forEach((s, i) => visit(s, `pages.${p.slug || 'home'}.sections[${i}]`)));
}

/** The definition object parseSiteBundle builds (manifest order, else sorted), without validating it. */
function assemble(files: Files): Record<string, Json> {
  const json = (k: string) => JSON.parse(files.get(k)!.toString('utf8')) as Json;
  const { bundle, ...site } = json('site.json') as Record<string, Json> & { bundle?: Record<string, string[] | undefined> };
  const listed = (prefix: string, names: string[] | undefined) => (names?.length ? names : [...files.keys()].filter((k) => k.startsWith(prefix) && k.endsWith('.json')).sort()).filter((n) => files.has(n));
  return {
    ...site,
    theme: files.has('theme.json') ? json('theme.json') : site.theme,
    pages: listed('pages/', bundle?.pages).map(json),
    collections: listed('collections/', bundle?.collections).map(json),
    forms: listed('forms/', bundle?.forms).map(json),
  };
}

/** References the schema cannot see: page links, form ids, collections, anchors, menus. */
function crossCheck(def: WebsiteDefinition, r: Report) {
  const pageIds = new Set(def.pages.map((p) => p.id));
  const norm = (p: string) => p.replace(/\/+$/, '') || '/';
  const paths = new Set(def.pages.map((p) => norm(`/${p.slug}`)));
  const formIds = new Set(def.forms.map((f) => f.id));
  const collections = new Set(def.collections.map((x) => x.slug));
  const anchors = new Set<string>();
  const all: Array<{ where: string; nodes: Node[] }> = [
    { where: 'header', nodes: [def.header] },
    { where: 'footer', nodes: [def.footer] },
    ...def.globalSections.map((g) => ({ where: `global.${g.name}`, nodes: [g.node] })),
    ...def.pages.map((p) => ({ where: `pages.${p.slug || 'home'}`, nodes: p.sections })),
  ];
  for (const { nodes } of all) walkNodes(nodes, (n) => void (n.anchor && anchors.add(n.anchor)));
  const checkPath = (where: string, link: string) => {
    if (link.startsWith('//')) return;
    const m = /^(\/[^?#]*)/.exec(link);
    if (m) {
      const p = norm(m[1]!);
      if (!paths.has(p) && !collections.has(p.split('/')[1] ?? '')) r.warnings.push(`${where}: link "${link}" does not match any page.`);
    }
    const anchor = /#([A-Za-z][\w-]*)$/.exec(link)?.[1];
    if (anchor && !anchors.has(anchor)) r.warnings.push(`${where}: link "${link}" points to #${anchor}, but no node has "anchor": "${anchor}".`);
  };
  for (const { where, nodes } of all)
    walkNodes(nodes, (n) => {
      const formId = n.props.formId;
      if (typeof formId === 'string' && formId && !formIds.has(formId)) r.errors.push(`${where}: ${n.type} uses formId "${formId}" but no form has that id (set "id" in forms/<slug>.json).`);
      if (['form', 'newsletter'].includes(n.type) && !formId) r.warnings.push(`${where}: ${n.type} has no formId, so it shows no fields.`);
      const col = n.binding?.collection ?? (n.type === 'collection-list' ? n.props.collection : undefined);
      if (typeof col === 'string' && col && !collections.has(col)) r.errors.push(`${where}: ${n.type} uses collection "${col}" which is not in collections/.`);
      eachLink(n.props, (link) => {
        if (typeof link === 'string') checkPath(where, link);
        else if (link.type === 'page' && !pageIds.has(String(link.pageId))) r.errors.push(`${where}: page link to unknown pageId "${String(link.pageId)}" (prefer path strings like "/about").`);
      });
    });
  const usedMenus = new Set<string>();
  walkNodes([def.header, def.footer], (n) => {
    for (const [k, v] of Object.entries(n.props)) if (/menu$/i.test(k) && typeof v === 'string' && v) usedMenus.add(v);
  });
  for (const m of usedMenus) if (!def.navigation.menus[m]) r.warnings.push(`Menu "${m}" is used by the header/footer but navigation.menus.${m} is missing.`);
  for (const [name, items] of Object.entries(def.navigation.menus))
    eachLink({ items }, (link) => {
      if (typeof link === 'string') checkPath(`menu "${name}"`, link);
    });
  if (!def.pages.some((p) => p.isHomepage)) r.errors.push('No homepage (set "isHomepage": true on one page, slug "").');
  const unpublished = def.pages.filter((p) => p.status !== 'published' && p.kind === 'page');
  if (unpublished.length) r.info.push(`${unpublished.length} page(s) are not "published", so they stay hidden after publishing: ${unpublished.map((p) => p.slug || 'home').join(', ')}.`);
}

function eachLink(props: Json, fn: (link: string | Record<string, unknown>) => void) {
  const visit = (v: Json, key?: string) => {
    if (Array.isArray(v)) v.forEach((x) => visit(x, key));
    else if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>;
      if ((key === 'link' || key === 'href') && typeof o.type === 'string') fn(o);
      else for (const [k, x] of Object.entries(o)) visit(x, k);
    } else if (typeof v === 'string' && (key === 'link' || key === 'href')) fn(v);
  };
  visit(props);
}

function printReport(r: Report, label: string) {
  const s = r.stats;
  console.log(bold(`\n${label}`));
  console.log(dim(`  ${s.pages} pages · ${s.sections} sections · ${s.forms} forms · ${s.collections} collections · ${s.assets} assets (${mb(s.assetBytes)}) · JSON ${kb(s.jsonBytes)}${s.zipBytes !== undefined ? ` · zip ${mb(s.zipBytes)} of ${mb(LIMITS.uploadBytes)}` : ''}`));
  for (const e of r.errors) console.log(red(`  ✗ ${e}`));
  for (const w of r.warnings) console.log(yellow(`  ! ${w}`));
  for (const i of r.info) console.log(dim(`  · ${i}`));
  console.log(r.errors.length ? red(`  ${r.errors.length} error(s): fix these before importing.`) : green(`  ✓ Valid: the importer will accept this bundle${r.warnings.length ? ` (${r.warnings.length} warning(s) to review)` : ''}.`));
}

// ── zip writer: STORE or DEFLATE (level 9), the only methods Atrium's importer (JSZip) reads ──
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let v = n;
    for (let k = 0; k < 8; k++) v = v & 1 ? 0xedb88320 ^ (v >>> 1) : v >>> 1;
    t[n] = v >>> 0;
  }
  return t;
})();
function crc32(buf: Buffer): number {
  let v = 0xffffffff;
  for (let i = 0; i < buf.length; i++) v = CRC_TABLE[(v ^ buf[i]!) & 0xff]! ^ (v >>> 8);
  return (v ^ 0xffffffff) >>> 0;
}
function zip(entries: Array<{ name: string; data: Buffer }>): Buffer {
  const parts: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  // Fixed timestamp (2026-01-01) keeps archives reproducible.
  const dosTime = 0;
  const dosDate = ((2026 - 1980) << 9) | (1 << 5) | 1;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const crc = crc32(data);
    let method = 0;
    let body = data;
    if (!PRECOMPRESSED.test(name) && data.length > 64) {
      const d = deflateRawSync(data, { level: 9, memLevel: 9 });
      if (d.length < data.length * 0.97) {
        method = 8;
        body = d;
      }
    }
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    parts.push(local, nameBuf, body);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(0x0314, 4); // made by UNIX, v2.0
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt16LE(method, 10);
    cen.writeUInt16LE(dosTime, 12);
    cen.writeUInt16LE(dosDate, 14);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(body.length, 20);
    cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28);
    cen.writeUInt32LE((0o100644 << 16) >>> 0, 38);
    cen.writeUInt32LE(offset, 42);
    central.push(cen, nameBuf);
    offset += 30 + nameBuf.length + body.length;
  }
  if (offset > 0xffffffff || entries.length > 0xffff) die('Archive too large for a standard zip.');
  const cenBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cenBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, cenBuf, end]);
}

// ── media optimization ──
interface OptimizeOpts {
  maxImage: number;
  quality: number;
  videoCrf: number;
  maxVideoWidth: number;
  audioBitrate: string;
  mute: boolean;
  cacheDir: string;
}
interface Tools {
  magick?: string;
  cwebp: boolean;
  ffmpeg: boolean;
  woff2: boolean;
}
function detectTools(): Tools {
  return { magick: has('magick') ? 'magick' : has('convert') ? 'convert' : undefined, cwebp: has('cwebp'), ffmpeg: has('ffmpeg'), woff2: has('woff2_compress') };
}

const tmpBase = path.join(tmpdir(), `atrium-bundle-${process.pid}`);
let tmpCounter = 0;
function tmpWrite(buf: Buffer, ext: string): string {
  mkdirSync(tmpBase, { recursive: true });
  const p = path.join(tmpBase, `in-${tmpCounter++}.${ext}`);
  writeFileSync(p, buf);
  return p;
}

/** Optimized outputs are cached per input hash + settings, so re-packing after edits is fast. */
function cached(key: string, ext: string, o: OptimizeOpts, make: (out: string) => void): Buffer | null {
  mkdirSync(o.cacheDir, { recursive: true });
  const out = path.join(o.cacheDir, `${key}.${ext}`);
  if (!existsSync(out)) {
    try {
      make(out);
    } catch {
      rmSync(out, { force: true });
      return null;
    }
  }
  return existsSync(out) ? readFileSync(out) : null;
}

/** A smaller replacement (possibly in another format), or null to keep the original. */
function optimize(buf: Buffer, t: Sniffed, o: OptimizeOpts, tools: Tools): { data: Buffer; ext: string; resized: boolean } | null {
  const key = sha(buf).slice(0, 24);
  if (RASTER.has(t.mime)) {
    const dims = imageSize(buf, t.mime);
    const tooBig = !!dims && Math.max(dims.width, dims.height) > o.maxImage;
    // Small icons and logos are already tiny; modern formats under 400 KB are already efficient.
    if (!tooBig && buf.length < 60 * 1024) return null;
    if (!tooBig && (t.mime === 'image/webp' || t.mime === 'image/avif') && buf.length < 400 * 1024) return null;
    const tag = `${key}-w${o.maxImage}-q${o.quality}`;
    let out: Buffer | null = null;
    if (tools.magick) {
      out = cached(tag, 'webp', o, (dst) => execFileSync(tools.magick!, [`${tmpWrite(buf, t.ext)}[0]`, '-auto-orient', '-strip', '-resize', `${o.maxImage}x${o.maxImage}>`, '-quality', String(o.quality), '-define', 'webp:method=6', dst], { stdio: 'ignore' }));
    } else if (tools.cwebp && t.mime !== 'image/avif') {
      const scale = dims && tooBig ? (dims.width >= dims.height ? ['-resize', String(o.maxImage), '0'] : ['-resize', '0', String(o.maxImage)]) : [];
      out = cached(tag, 'webp', o, (dst) => execFileSync('cwebp', ['-quiet', '-q', String(o.quality), '-m', '6', '-metadata', 'none', ...scale, tmpWrite(buf, t.ext), '-o', dst], { stdio: 'ignore' }));
    }
    if (out && (out.length < buf.length * 0.95 || tooBig)) return { data: out, ext: 'webp', resized: tooBig };
    return null;
  }
  if (VIDEO.has(t.mime) && tools.ffmpeg) {
    const tag = `${key}-crf${o.videoCrf}-w${o.maxVideoWidth}-${o.mute ? 'mute' : o.audioBitrate}`;
    const out = cached(tag, 'mp4', o, (dst) =>
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', tmpWrite(buf, t.ext), '-vf', `scale='min(${o.maxVideoWidth},iw)':-2`, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(o.videoCrf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', ...(o.mute ? ['-an'] : ['-c:a', 'aac', '-b:a', o.audioBitrate]), dst], { stdio: 'ignore' }),
    );
    if (out && (out.length < buf.length * 0.95 || t.mime === 'video/quicktime')) return { data: out, ext: 'mp4', resized: false };
    return null;
  }
  if (t.mime === 'image/svg+xml') {
    const min = Buffer.from(buf.toString('utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim());
    return min.length < buf.length * 0.95 ? { data: min, ext: 'svg', resized: false } : null;
  }
  if ((t.mime === 'font/ttf' || t.mime === 'font/otf') && tools.woff2) {
    const out = cached(`${key}-woff2`, 'woff2', o, (dst) => {
      const src = tmpWrite(buf, t.ext);
      execFileSync('woff2_compress', [src], { stdio: 'ignore' });
      writeFileSync(dst, readFileSync(src.replace(/\.[a-z0-9]+$/, '.woff2')));
    });
    return out ? { data: out, ext: 'woff2', resized: false } : null;
  }
  return null;
}

async function download(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(60_000), headers: { 'user-agent': 'atrium-bundle (site import packer)' } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length > LIMITS.assetBytes ? null : buf;
  } catch {
    return null;
  }
}

// ── commands ──
async function cmdPack(dir: string, flags: Record<string, string | boolean>) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) die(`pack expects a bundle directory (got ${dir})`);
  const out = path.resolve(typeof flags.out === 'string' ? flags.out : `${path.resolve(dir).replace(/\/+$/, '')}.zip`);
  const files = walk(dir);
  if (!files.has('site.json')) die(`${dir}/site.json not found — run \`atrium-bundle init ${dir}\` first.`);
  const docs = new Map<string, Json>();
  for (const [name, buf] of files)
    if (isJsonDoc(name)) {
      try {
        docs.set(name, JSON.parse(buf.toString('utf8').replace(/^﻿/, '')));
      } catch (err) {
        die(`${name} is not valid JSON: ${(err as Error).message}`);
      }
    }
  const assets = new Map<string, Buffer>([...files].filter(([k]) => k.startsWith('assets/')).map(([k, v]) => [k.slice(7), v]));
  const log = (s: string) => console.log(dim(`  ${s}`));
  console.log(bold(`Packing ${dir}`));

  // 1. Bundle hotlinked media so the site does not depend on someone else's CDN.
  if (!flags['keep-remote']) {
    const urls = new Map<string, string | null>();
    for (const doc of docs.values()) eachString(doc, (s, key) => void (/^https?:\/\//i.test(s) && looksLikeMedia(s, key) && urls.set(s, null)));
    let fetched = 0;
    for (const url of urls.keys()) {
      const buf = await download(url);
      const t = buf && sniff(buf, url);
      if (!buf || !t) {
        log(yellow(`! kept remote (could not download a supported file): ${url}`));
        continue;
      }
      const stem = (new URL(url).pathname.split('/').pop() ?? '').replace(/\.[a-z0-9]+$/i, '').replace(/[^\w-]+/g, '-').slice(0, 40) || 'file';
      const ref = `remote/${sha(buf).slice(0, 10)}-${stem}.${t.ext}`;
      assets.set(ref, buf);
      urls.set(url, ref);
      fetched++;
    }
    if (fetched) {
      for (const [name, doc] of docs) docs.set(name, mapStrings(doc, (s) => (urls.get(s) ? ASSET_PREFIX + urls.get(s) : s)));
      log(`downloaded ${fetched} remote media file(s) into assets/remote/`);
    }
  }

  // 2. Keep only referenced assets.
  const refs = new Set<string>();
  for (const doc of docs.values()) eachString(doc, (s) => void (s.startsWith(ASSET_PREFIX) && refs.add(s.slice(ASSET_PREFIX.length))));
  const missing = [...refs].filter((ref) => !assets.has(ref));
  if (missing.length) die(`referenced but missing in assets/: ${missing.slice(0, 10).join(', ')}`);
  const dropped = [...assets.keys()].filter((k) => !refs.has(k));
  for (const k of dropped) assets.delete(k);
  if (dropped.length) log(`left out ${dropped.length} unreferenced asset(s)`);
  const origBytes = [...assets.values()].reduce((n, b) => n + b.length, 0);

  // 3. Optimize media.
  const rename = new Map<string, string>();
  const touched = new Set<string>();
  if (!flags['no-optimize']) {
    const tools = detectTools();
    const o: OptimizeOpts = {
      maxImage: num(flags['max-image'], 2560),
      quality: num(flags.quality, 80),
      videoCrf: num(flags['video-crf'], 27),
      maxVideoWidth: num(flags['max-video-width'], 1920),
      audioBitrate: typeof flags['audio-bitrate'] === 'string' ? flags['audio-bitrate'] : '96k',
      mute: !!flags['mute-videos'],
      cacheDir: path.join(dir, '.atrium-cache'),
    };
    if (!tools.magick && !tools.cwebp) log(yellow('! ImageMagick/cwebp not found: images are packed as-is (macOS: brew install imagemagick webp)'));
    if (!tools.ffmpeg && [...assets.values()].some((b) => VIDEO.has(sniff(b, '')?.mime ?? ''))) log(yellow('! ffmpeg not found: videos are packed as-is (macOS: brew install ffmpeg)'));
    let n = 0;
    for (const [ref, buf] of [...assets]) {
      const t = sniff(buf, ref);
      if (!t) continue;
      const res = optimize(buf, t, o, tools);
      if (!res) continue;
      n++;
      const sameExt = path.extname(ref).slice(1).toLowerCase() === res.ext;
      const next = sameExt ? ref : `${ref.replace(/\.[a-z0-9]+$/i, '')}.${res.ext}`;
      let target = next;
      for (let i = 2; target !== ref && assets.has(target); i++) target = next.replace(/(\.[a-z0-9]+)$/i, `-${i}$1`);
      assets.delete(ref);
      assets.set(target, res.data);
      if (target !== ref) rename.set(ref, target);
      if (res.resized || target !== ref) touched.add(target);
    }
    log(`optimized ${n} media file(s)`);
  }

  // 4. Deduplicate identical files.
  const byHash = new Map<string, string>();
  for (const [ref, buf] of [...assets]) {
    const h = sha(buf);
    const first = byHash.get(h);
    if (!first) {
      byHash.set(h, ref);
      continue;
    }
    assets.delete(ref);
    for (const [k, v] of rename) if (v === ref) rename.set(k, first);
    rename.set(ref, first);
  }

  // 5. Rewrite references. Media objects whose file changed lose stale width/height/mimeType (the importer fills them in).
  const changed = new Set([...rename.values(), ...touched]);
  const fix = (v: Json): Json => {
    if (typeof v === 'string') return v.startsWith(ASSET_PREFIX) && rename.has(v.slice(6)) ? ASSET_PREFIX + rename.get(v.slice(6)) : v;
    if (Array.isArray(v)) return v.map(fix);
    if (v && typeof v === 'object') {
      const obj: Record<string, Json> = {};
      for (const [k, x] of Object.entries(v)) obj[k] = fix(x);
      if (typeof obj.src === 'string' && obj.src.startsWith(ASSET_PREFIX) && changed.has(obj.src.slice(6))) {
        delete obj.width;
        delete obj.height;
        delete obj.mimeType;
      }
      return obj;
    }
    return v;
  };
  if (changed.size) for (const [name, doc] of docs) docs.set(name, fix(doc));

  // 6. Manifest: keep the listed order when given, otherwise homepage first.
  const site = docs.get('site.json') as Record<string, Json>;
  const prev = (site.bundle ?? {}) as Record<string, Json>;
  const list = (prefix: string, given: Json) => {
    const all = [...docs.keys()].filter((k) => k.startsWith(prefix)).sort((a, b) => (a === 'pages/_home.json' ? -1 : b === 'pages/_home.json' ? 1 : a.localeCompare(b)));
    const order = Array.isArray(given) ? (given as string[]).filter((g) => all.includes(g)) : [];
    return [...order, ...all.filter((a) => !order.includes(a))];
  };
  const { bundle: _old, ...siteRest } = site;
  const manifest = {
    format: BUNDLE_FORMAT,
    version: BUNDLE_VERSION,
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    generator: 'atrium-import-skill',
    ...(prev.website ? { website: prev.website } : {}),
    pages: list('pages/', prev.pages),
    collections: list('collections/', prev.collections),
    forms: list('forms/', prev.forms),
  };
  docs.set('site.json', { bundle: manifest, ...siteRest });

  // 7. Zip: minified JSON (deflate 9) + media (stored when already compressed).
  const entries = [
    ...[...docs].map(([name, doc]) => ({ name, data: Buffer.from(JSON.stringify(doc)) })),
    ...[...assets].sort(([a], [b]) => a.localeCompare(b)).map(([ref, data]) => ({ name: `assets/${ref}`, data })),
  ];
  const buf = zip(entries);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, buf);
  const newBytes = [...assets.values()].reduce((n, b) => n + b.length, 0);
  log(`media ${mb(origBytes)} → ${mb(newBytes)} in ${assets.size} file(s)`);
  console.log(green(`  wrote ${out} (${mb(buf.length)})`));
  const report = await validate(out);
  if (flags.json) console.log(JSON.stringify({ out, bytes: buf.length, ...report }, null, 2));
  else printReport(report, 'Validation');
  process.exitCode = report.errors.length ? 1 : 0;
}

async function cmdValidate(input: string, flags: Record<string, string | boolean>) {
  const report = await validate(input);
  if (flags.json) console.log(JSON.stringify(report, null, 2));
  else printReport(report, `Validating ${input}`);
  process.exitCode = report.errors.length ? 1 : 0;
}

async function cmdInspect(input: string) {
  const buf = readFileSync(input);
  const files = await unzip(buf, { maxFiles: 100_000, maxTotalBytes: 4 * 1024 * 1024 * 1024, stripCommonRoot: false });
  const rows = [...files].sort(([a], [b]) => a.localeCompare(b));
  for (const [name, data] of rows) console.log(`${kb(data.length).padStart(10)}  ${name}`);
  console.log(dim(`${rows.length} files, ${mb(rows.reduce((n, [, d]) => n + d.length, 0))} unzipped, ${mb(buf.length)} zipped`));
}

function cmdInit(dir: string, flags: Record<string, string | boolean>) {
  if (existsSync(path.join(dir, 'site.json')) && !flags.force) die(`${dir}/site.json exists (use --force to overwrite)`);
  const name = typeof flags.name === 'string' ? flags.name : 'New website';
  const presetKey = typeof flags.preset === 'string' ? flags.preset : 'editorial-warm';
  const theme = THEME_PRESETS[presetKey];
  if (!theme) die(`unknown preset "${presetKey}". Presets: ${Object.keys(THEME_PRESETS).join(', ')}`);
  const write = (rel: string, v: Json) => {
    mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    writeFileSync(path.join(dir, rel), `${JSON.stringify(v, null, 2)}\n`);
  };
  write('site.json', {
    schemaVersion: 1,
    settings: {
      name,
      business: { name },
      seo: { siteTitle: name, titleTemplate: `%s — ${name}` },
    },
    navigation: { menus: { primary: [{ id: 'nav-home', label: 'Home', link: '/' }], footer: [{ id: 'footer-home', label: 'Home', link: '/' }], legal: [] } },
    header: { type: 'site-header', variant: 'classic', props: { menu: 'primary', cta: { label: 'Get in touch', link: '/', style: 'primary' } } },
    footer: { type: 'site-footer', variant: 'columns', props: {} },
    globalSections: [],
    redirects: [],
  });
  write('theme.json', theme);
  write('pages/_home.json', {
    title: 'Home',
    slug: '',
    isHomepage: true,
    status: 'published',
    seo: { title: name },
    sections: [{ type: 'section', props: {}, children: [{ type: 'heading', props: { text: name, level: 'h1' } }, { type: 'text', props: { text: 'Replace with the real content.' } }] }],
  });
  mkdirSync(path.join(dir, 'assets'), { recursive: true });
  console.log(green(`Scaffolded ${dir} (theme preset "${presetKey}"). Fill it in, then: atrium-bundle pack ${dir}`));
}

function help() {
  console.log(`atrium-bundle — build Atrium site-import zips (built from Atrium ${__ATRIUM_COMMIT__})

Usage:
  atrium-bundle init <dir> [--name "Site"] [--preset editorial-warm] [--force]
      Scaffold a bundle directory (site.json, theme.json, pages/_home.json, assets/).
  atrium-bundle pack <dir> [-o site.zip] [options]
      Download hotlinked media, optimize and dedupe media, leave out unused files, write the
      manifest, zip (deflate level 9; media stored), then validate the zip.
        --keep-remote          leave http(s) media URLs as they are
        --no-optimize          pack media untouched
        --max-image <px>       longest image edge (default 2560)
        --quality <0-100>      WebP quality (default 80)
        --video-crf <n>        H.264 CRF, higher = smaller (default 27)
        --max-video-width <px> (default 1920)
        --mute-videos          drop audio (background/hero loops)
        --audio-bitrate <b>    (default 96k)
        --json                 machine-readable report
  atrium-bundle validate <dir|zip> [--json]
      The importer's checks: limits, assets, schema, component props (Atrium's normalizer),
      page/form/collection/anchor/menu references. Exit code 1 on errors.
  atrium-bundle inspect <zip>
      List the files inside a zip.
  atrium-bundle presets
      List theme presets for init.

Limits: upload ${mb(LIMITS.uploadBytes)}, unzipped ${mb(LIMITS.unzippedBytes)}, ${LIMITS.files} files, ${LIMITS.assets} assets,
${mb(LIMITS.assetBytes)} per asset; more than ${LIMITS.componentErrors} component errors and the import is rejected.`);
}

const [cmd, ...rest] = process.argv.slice(2);
const { pos, flags } = parseArgs(rest);
const need = (what: string) => pos[0] ?? die(`missing ${what}. Run \`atrium-bundle help\`.`);
try {
  switch (cmd) {
    case 'init':
      cmdInit(need('<dir>'), flags);
      break;
    case 'pack':
      await cmdPack(need('<dir>'), flags);
      break;
    case 'validate':
      await cmdValidate(need('<dir|zip>'), flags);
      break;
    case 'inspect':
      await cmdInspect(need('<zip>'));
      break;
    case 'presets':
      for (const [k, t] of Object.entries(THEME_PRESETS)) console.log(`${k.padEnd(22)} ${t.name} (${t.colorScheme})`);
      break;
    case undefined:
    case 'help':
    case '--help':
    case '-h':
      help();
      break;
    default:
      die(`unknown command "${cmd}". Run \`atrium-bundle help\`.`);
  }
} finally {
  rmSync(tmpBase, { recursive: true, force: true });
}
