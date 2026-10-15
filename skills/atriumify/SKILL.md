---
name: atriumify
description: Atriumify a website. Converts a website project (plain HTML/CSS/JS, React, Next.js, Vue, Svelte, Astro, Vite, Tailwind, a template or a vibe-coded prototype) into an Atrium site-import zip that includes all its media, is compressed to fit the upload limit, and is validated against Atrium's own importer rules. Use when the user says "atriumify" (any form, e.g. "atriumify this", "atriumify ./my-site"), runs /atriumify, or wants to deploy, import, port or "make importable" a site or template in Atrium, or asks for an Atrium bundle, site.json or import zip.
argument-hint: "[source-dir] [output.zip]"
---

# Atriumify: turn a website project into an Atrium import zip

**Trigger:** `/atriumify [source-dir] [output.zip]`, or any request to "atriumify" a project.
Arguments received: `$ARGUMENTS`
- No source given: use the current working directory, after confirming it is a website project.
- No output given: write `<source-folder-name>-atrium.zip` next to the source folder, and build it from
  the bundle folder `<source-folder-name>-atrium/`.

Atrium does not host arbitrary code. It renders sites from a JSON **site definition** made of its own
components. Your job is to rebuild the source project as that definition, with its media bundled, so a
user can upload one zip at **New website → Import** (or `atrium import-site site.zip`) and get an
editable site that looks like the original.

Everything you need is in this skill folder:

| Path | Use it for |
| --- | --- |
| `scripts/atrium-bundle.mjs` | The CLI: `init`, `pack`, `validate`, `inspect`, `presets`. Node 18+, no install. |
| `references/bundle-format.md` | Zip layout, manifest, `asset:` media references, limits. Read first. |
| `references/conversion-guide.md` | How to map HTML/React patterns, styles, fonts, forms and content onto Atrium. Read before mapping. |
| `references/components.md` | Every component type with exact props (generated from Atrium). Read the index, then look up types with `grep -n "^### <type>$"`. Do not read it whole. |
| `references/schemas.md` | Exact shapes of settings, theme, navigation, page, SEO, MediaRef, Link, style, animation, forms, collections. |
| `examples/rosewood-courtyard/` | A complete, valid bundle (Atrium demo site) to copy patterns from. |

Run the CLI as `node <this-skill-dir>/scripts/atrium-bundle.mjs <command>`; below it is written as `atrium-bundle`.

## Workflow

Copy this checklist into your todo list and work through it in order.

1. **Survey the source** (read-only). Identify the framework, the routes/pages, the shared header and
   footer, every section on every page, design tokens (Tailwind config, CSS variables, fonts, colours),
   forms, repeated content (blog posts, team, listings) and all media (local files, imports, CSS
   backgrounds, remote URLs). For React/Vue/Svelte, read the **source** components and their data, not the
   build output. If the dev server can run, open each page and take screenshots for comparison later.
   Write a short page-by-page inventory: page, slug, sections in order, media used.
2. **Scaffold**: `atrium-bundle init <out-dir> --name "<Site name>"` (`atrium-bundle presets` lists theme
   presets). Put the output **outside** the source project (`../<project>-atrium/`, as above) unless the
   user says otherwise.
3. **Theme** (`theme.json`): translate the source design tokens: colours to `colors.*`, fonts to
   `typography.heading/body` (Google family names, or bundled font files), radii, shadows, container
   widths. See the conversion guide for the mapping and the CSS variables.
4. **Media**: copy every local image, video, font and PDF the site uses into `<out-dir>/assets/`, keeping
   readable names (`assets/images/hero.jpg`). Reference them as `"asset:images/hero.jpg"`. Remote URLs may
   stay as they are: `pack` downloads them into the bundle.
5. **Site** (`site.json`): `settings` (name, business details, SEO defaults, social links, logo and favicon
   as `asset:` URLs), `navigation.menus` (every item needs an `id`), `header` (`site-header`) and `footer`
   (`site-footer`).
6. **Pages** (`pages/_home.json`, `pages/<slug>.json`): one file per route. Map each source section onto
   the most specific component (conversion guide → "Choosing components"), keep the real copy word for
   word, set `anchor` on nodes that in-page links target, and fill `seo` (title, description, ogImage).
   Use plain path links (`"/about"`, `"/#pricing"`). Contact forms become `forms/<slug>.json` with an
   explicit `id`, referenced by `formId`. Repeated content can become `collections/<slug>.json`.
7. **Pack and validate**: `atrium-bundle pack <out-dir> -o <name>.zip`. It downloads remote media,
   converts and resizes images (WebP, longest edge 2560 px), re-encodes video (H.264), removes duplicate
   and unused files, compresses everything (deflate level 9) and then runs the validator. **Fix every
   ✗ error**, and review every ! warning (broken links, missing anchors, menu gaps, sample defaults that would show). Repeat
   until the report says *Valid*. Use `atrium-bundle validate <out-dir>` for quick checks while editing.
8. **Report** to the user (template below).

## Rules that prevent broken imports

- Only **section-level** components may sit directly in `page.sections` (hero, section, features,
  gallery…). Headings, text, images, buttons and grids go inside a `section` (or another container).
- Set every content prop a component displays. Omitted props fall back to the component's **sample
  defaults** (demo copy, Unsplash photos), and `validate` warns about each one.
- Every prop must match `components.md` exactly. Invalid props are **silently reset to defaults** on
  import, so the validator reports them as errors. Respect max lengths and enum values.
- Page `slug`: lowercase, digits and hyphens (`about`, `services/web-design`). The homepage is
  `pages/_home.json` with `"slug": ""` and `"isHomepage": true`. Set `"status": "published"` on pages
  that should go live.
- Ids are optional everywhere **except** navigation items (`id`), forms (`id`, `fields[].id`) and anything
  you reference by id (`formId`). Ids use only `A-Z a-z 0-9 _ -` (≤64 chars).
- Media go in `{ "src": "asset:…", "alt": "…" }` objects (MediaRef). Always write real `alt` text.
  `asset:` references are rewritten only when they are the **whole** JSON string, so they never work inside
  CSS `url()`. Use `style.backgroundImage` or a component's image prop for background images.
- There is no JavaScript runtime for the site's own code: no React state, no custom scripts for layout.
  Rebuild behaviour with components (tabs, accordion, carousel, modal, drawer, marquee, animations). Use
  `embed` only for third-party widgets (booking, maps, reviews). It requires the `code.manage` permission,
  and HTML mode strips scripts.
- Tailwind classes and component-library classes do not exist in Atrium. Express styling through the theme
  first, then variants and props, then `node.style`, then `customCss` (conversion guide → "Styling").
- Keep the original text, prices, phone numbers and links exactly. Do not invent content, testimonials or
  addresses. If something cannot be reproduced, say so in the report.

## Size and compression

The import limit is **300 MB per upload** (400 MB unzipped, 2,000 files, 500 media files, 100 MB per
file). `pack` keeps bundles far below that: media dominate the size, and converting and resizing them often cuts a
site to a fraction of its original size. Pass `--video-crf 30`, `--max-video-width 1280` or `--mute-videos` (for background
loops) if a bundle is still too big.

The zip uses standard deflate (JSON at level 9; already-compressed media stored as-is) because Atrium's
importer reads only *stored* and *deflate* zip entries. A zstd-compressed zip would be rejected, and zstd
would save almost nothing anyway: images and video are already compressed. Do not use zstd, 7z or tar
archives.

## Report template

```
Atrium bundle ready: <path>.zip (<size> MB, limit 300 MB)
- Pages: <n> (<list of slugs>)
- Media: <n> files, <before> MB → <after> MB
- Forms / collections: <…>
- Not reproduced exactly: <list, with what was used instead>
- Warnings left: <none | list>

Import: Atrium admin → New website → Import → choose the zip (or `atrium import-site <zip> --org <org>`).
Then review the site in the editor and publish.
```
