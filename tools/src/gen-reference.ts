/**
 * Generates references/components.md and references/schemas.md from the Atrium component registry
 * and schema package. Run through tools/build.mjs (needs ATRIUM_ROOT).
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { ANIMATION_PRESETS } from '@atrium/animations';
import { registry } from '@atrium/component-registry';
import { ICON_ALIASES, ICON_DATA } from '@atrium/renderer-core/icons-data';
import {
  AnimationSchema, CollectionDefinitionSchema, DEFAULT_BREAKPOINT_WIDTHS, FormDefinitionSchema, LinkSchema, MediaRefSchema, NavigationSchema,
  PageSeoSchema, RedirectSchema, SiteSettingsSchema, StyleSchema, ThemeTokensSchema, VisibilitySchema, PageInputSchema,
} from '@atrium/schema';
import { z } from 'zod';

type JS = Record<string, any>;
const [outDir, commit] = process.argv.slice(2) as [string, string];

/** Compact TypeScript-like rendering of a JSON Schema (good enough for an agent to write valid props). */
/** Shapes repeated in almost every component: named once in schemas.md instead of inlined. */
function sharedName(s: JS): string | undefined {
  const alts: JS[] | undefined = s.anyOf ?? s.oneOf;
  if (alts?.some((a) => a.properties?.type?.const === 'page' && a.properties?.pageId)) return 'Link';
  if (s.properties?.src && s.properties?.mediaId && s.properties?.focalPoint) return 'MediaRef';
  return undefined;
}

/** `T | { base?: T; laptop?: T; tablet?: T; mobile?: T }` → `R<T>`. */
function responsiveInner(s: JS): JS | undefined {
  const alts: JS[] | undefined = s.anyOf ?? s.oneOf;
  if (alts?.length !== 2) return undefined;
  const obj = alts.find((a) => a.properties?.base && a.properties?.mobile && a.properties?.tablet);
  return obj ? alts.find((a) => a !== obj) : undefined;
}

function sig(s: JS | undefined, defs: JS, indent = '', depth = 0): string {
  if (!s || Object.keys(s).length === 0) return 'any';
  if (s.$ref) {
    const name = String(s.$ref).split('/').pop()!;
    return depth > 6 ? name : sig(defs[name], defs, indent, depth + 1);
  }
  const shared = depth > 0 ? sharedName(s) : undefined;
  if (shared) return shared;
  const inner = responsiveInner(s);
  if (inner) return `R<${sig(inner, defs, indent, depth + 1)}>`;
  if (s.const !== undefined) return JSON.stringify(s.const);
  if (s.enum) return s.enum.map((v: unknown) => JSON.stringify(v)).join(' | ');
  const alts = s.anyOf ?? s.oneOf;
  if (alts) {
    const parts = [...new Set(alts.map((a: JS) => sig(a, defs, indent, depth + 1)))];
    return parts.length > 1 ? parts.join(' | ') : (parts[0] as string);
  }
  if (s.allOf) return s.allOf.map((a: JS) => sig(a, defs, indent, depth + 1)).join(' & ');
  const t = Array.isArray(s.type) ? s.type : [s.type];
  if (t.includes('array')) {
    const item = sig(s.items, defs, indent, depth + 1);
    const lim = [s.minItems !== undefined ? `min ${s.minItems}` : '', s.maxItems !== undefined ? `max ${s.maxItems}` : ''].filter(Boolean).join(', ');
    return `${/[|&]/.test(item) && !item.startsWith('{') ? `(${item})` : item}[]${lim ? ` /* ${lim} */` : ''}`;
  }
  if (t.includes('object') || s.properties || s.additionalProperties) {
    const props = s.properties ?? {};
    const keys = Object.keys(props);
    const extra = s.additionalProperties && typeof s.additionalProperties === 'object' ? sig(s.additionalProperties, defs, indent, depth + 1) : null;
    if (!keys.length) return extra ? `Record<string, ${extra}>` : 'object';
    if (depth > 7) return 'object';
    const req = new Set<string>(s.required ?? []);
    const inner = `${indent}  `;
    const lines = keys.map((k) => {
      const p = props[k] as JS;
      const def = p.default !== undefined ? ` = ${JSON.stringify(p.default)}` : '';
      const opt = req.has(k) && p.default === undefined ? '' : '?';
      const note = constraint(p);
      return `${inner}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}${opt}: ${sig(p, defs, inner, depth + 1)}${def}${note}`;
    });
    if (extra) lines.push(`${inner}[key: string]: ${extra}`);
    return `{\n${lines.join(';\n')};\n${indent}}`;
  }
  if (t.includes('string')) return 'string';
  if (t.includes('integer')) return 'int';
  if (t.includes('number')) return 'number';
  if (t.includes('boolean')) return 'boolean';
  if (t.includes('null')) return 'null';
  return 'any';
}

function constraint(p: JS): string {
  const c: string[] = [];
  if (p.maxLength !== undefined) c.push(`≤${p.maxLength} chars`);
  if (p.minLength) c.push(`≥${p.minLength} chars`);
  if (p.minimum !== undefined || p.maximum !== undefined) c.push(`${p.minimum ?? ''}..${p.maximum ?? ''}`);
  if (p.pattern) c.push(`pattern ${p.pattern}`);
  if (p.description) c.push(String(p.description).replace(/\s+/g, ' ').slice(0, 140));
  return c.length ? ` /* ${c.join('; ')} */` : '';
}

function render(schema: z.ZodType): string {
  const js = z.toJSONSchema(schema, { io: 'input', unrepresentable: 'any', reused: 'inline' }) as JS;
  return sig(js, js.$defs ?? js.definitions ?? {});
}

// ── components.md ──
const defs = registry.list().filter((d) => !d.hidden);
const levels: Record<string, string> = {
  site: 'Site chrome (exactly one header and one footer per site, in site.json)',
  section: 'Sections — the only types allowed at a page root (`page.sections[]`)',
  block: 'Blocks — composites placed inside sections/containers',
  element: 'Elements — leaf primitives placed inside sections/containers/blocks',
};
let md = `# Atrium component reference

Generated from the component registry of Atrium \`${commit}\` by \`tools/build.mjs\`. Do not edit by hand.

Every node is \`{ "type", "props", "children"?, "variant"?, "style"?, "animation"?, "customCss"?, "anchor"?, "name"? }\`.
Props are validated against the schemas below; **invalid props are silently replaced by defaults on import**,
so always run \`atrium-bundle validate\`. \`?\` = optional, \`= x\` = default. Media props take a MediaRef
(\`{ "src": "asset:images/x.webp", "alt": "…" }\`, see schemas.md); link props take a Link (a URL string such as
\`"/contact"\`, \`"#rooms"\`, \`"https://…"\`, or a link object).

## Index

| Type | Level | Use when |
| --- | --- | --- |
${defs.map((d) => `| [\`${d.type}\`](#${d.type}) | ${d.level} | ${(d.ai?.useWhen ?? d.description).replace(/\|/g, '\\|')} |`).join('\n')}
`;

for (const level of ['site', 'section', 'block', 'element']) {
  const group = defs.filter((d) => d.level === level);
  if (!group.length) continue;
  md += `\n## ${levels[level]}\n`;
  for (const d of group) {
    md += `\n### ${d.type}\n\n**${d.name}** (${d.category}). ${d.description}\n`;
    if (d.ai?.useWhen) md += `\n- Use when: ${d.ai.useWhen}`;
    if (d.ai?.avoidWhen) md += `\n- Avoid when: ${d.ai.avoidWhen}`;
    if (d.variants?.length) md += `\n- Variants (\`variant\`): ${d.variants.map((v) => `\`${v.id}\`${v.id === d.defaultVariant ? ' (default)' : ''} — ${v.description}`).join('; ')}`;
    md += `\n- Children: ${d.children ? (d.children.allowed === 'any' ? 'any' : d.children.allowed.map((c) => `\`${c}\``).join(', ')) + (d.children.min ? `, min ${d.children.min}` : '') + (d.children.max ? `, max ${d.children.max}` : '') : 'none'}`;
    if (d.bindable) md += `\n- CMS-bindable: list prop \`${d.bindable.listProp}\` (item fields: ${d.bindable.itemFields.join(', ')})`;
    if (d.animations?.recommended?.length) md += `\n- Recommended animations: ${d.animations.recommended.join(', ')}`;
    md += `\n- Style keys: ${registry.styleKeys(d.type).join(', ')}\n`;
    md += `\n\`\`\`ts\nprops: ${render(d.props)}\n\`\`\`\n`;
    if (d.ai?.example) md += `\nExample:\n\n\`\`\`json\n${JSON.stringify({ type: d.type, ...d.ai.example })}\n\`\`\`\n`;
    else if (d.defaultProps && Object.keys(d.defaultProps).length) md += `\nDefault props: \`${JSON.stringify(d.defaultProps).slice(0, 600)}\`\n`;
  }
}
writeFileSync(path.join(outDir, 'components.md'), md);

// ── schemas.md ──
const bp = DEFAULT_BREAKPOINT_WIDTHS;
const RESPONSIVE_NOTE = `\`R<T>\` = a plain value or a responsive object \`{ "base"?: T, "laptop"?: T, "tablet"?: T, "mobile"?: T }\` (max-widths: laptop ${bp.laptop}px, tablet ${bp.tablet}px, mobile ${bp.mobile}px; smaller breakpoints inherit from larger ones)`;
const { sections: _s, ...pageShape } = (PageInputSchema as unknown as z.ZodObject).shape;
const sections: Array<[string, string, z.ZodType]> = [
  ['Site settings', '`site.json` → `settings`', SiteSettingsSchema],
  ['Theme tokens', '`theme.json`', ThemeTokensSchema],
  ['Navigation', '`site.json` → `navigation` (menus referenced by `site-header` / `site-footer`)', NavigationSchema],
  ['Page', '`pages/*.json` (plus `sections: Node[]`)', z.object(pageShape)],
  ['Page SEO', '`page.seo`', PageSeoSchema],
  ['MediaRef', 'every image/video prop', MediaRefSchema],
  ['Link', 'every link prop', LinkSchema],
  ['Node style', 'node.style. ' + RESPONSIVE_NOTE, StyleSchema],
  ['Node animation', '`node.animation`', AnimationSchema],
  ['Node visibility', '`node.visibility`', VisibilitySchema],
  ['Form', '`forms/<slug>.json`', FormDefinitionSchema],
  ['Collection (CMS)', '`collections/<slug>.json`', CollectionDefinitionSchema],
  ['Redirect', '`site.json` → `redirects[]`', RedirectSchema],
];
let sm = `# Atrium schemas

Generated from \`@atrium/schema\` of Atrium \`${commit}\` by \`tools/build.mjs\`. Do not edit by hand.
\`?\` = optional, \`= x\` = default (omit defaulted keys unless you need another value).
\`R<T>\` = \`T\` or a responsive object \`{ "base"?: T, "laptop"?: T, "tablet"?: T, "mobile"?: T }\`.
`;
for (const [title, where, schema] of sections) sm += `\n## ${title}\n\nUsed in ${where}.\n\n\`\`\`ts\n${render(schema)}\n\`\`\`\n`;

sm += `\n## Animation presets\n\nValues for \`node.animation.preset\` (scroll-triggered by default). Prefer each component's recommended animations.\n\n| preset | category | description | best for |\n| --- | --- | --- | --- |\n${ANIMATION_PRESETS.map((a) => `| \`${a.id}\` | ${a.category} | ${a.description} | ${(a.bestFor ?? []).join(', ')} |`).join('\n')}\n`;

// Brand glyphs live in the icon component itself (lucide ships none).
const iconSrc = readFileSync(process.argv[4]!, 'utf8');
const brands = [...(/const SOCIAL[^=]*=\s*\{([\s\S]*?)\n\};/.exec(iconSrc)?.[1] ?? '').matchAll(/^\s{2}([a-z0-9-]+):/gm)].map((m) => m[1]);
const icons = [...new Set([...Object.keys(ICON_DATA), ...Object.keys(ICON_ALIASES), ...brands])].sort();
sm += `\n## Icon names\n\nValid values for every \`icon\` prop (${icons.length} names; lucide-style kebab-case). Anything else renders nothing.\n\n${icons.map((i) => `\`${i}\``).join(' ')}\n`;
writeFileSync(path.join(outDir, 'schemas.md'), sm);
console.log(`references: ${defs.length} components, ${sections.length} schemas`);
