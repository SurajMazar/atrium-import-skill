# Atrium site bundle format

What Atrium's importer (`POST /v1/organizations/:orgId/websites/import`) accepts, and what
`atrium-bundle pack` produces. Source of truth: `packages/exporter/src/bundle.ts`,
`apps/api/src/modules/websites/bundle-assets.service.ts` and `websites.controller.ts` in the Atrium repo.

## Layout

```
my-site-atrium/
├── site.json              settings, navigation, header, footer, globalSections, redirects, customCss (+ "bundle" manifest)
├── theme.json             theme tokens
├── pages/
│   ├── _home.json         the homepage ("slug": "", "isHomepage": true)
│   ├── about.json         one file per page; nested slugs become folders: pages/services/web.json
│   └── …
├── forms/<slug>.json      optional: form definitions (contact, booking, newsletter)
├── collections/<slug>.json optional: CMS collections (blog posts, team, listings) with their items
└── assets/                every bundled media file (images, video, fonts, PDFs), any sub-folders
```

- A single top-level folder inside the zip is fine (it is stripped).
- `.DS_Store`, `__MACOSX/` and directories are ignored. Any other file outside `assets/` that is not a
  `.json` document is ignored too.
- `media-manifest.json` (written by Atrium's own exporter) is optional and ignored on import.

## The manifest (`site.json` → `bundle`)

`pack` writes it for you. If you write it yourself:

```json
{
  "bundle": {
    "format": "atrium-site-bundle",
    "version": 1,
    "schemaVersion": 1,
    "exportedAt": "2026-01-01T00:00:00.000Z",
    "generator": "atrium-import-skill",
    "pages": ["pages/_home.json", "pages/about.json"],
    "collections": [],
    "forms": ["forms/contact.json"]
  },
  "schemaVersion": 1,
  "settings": { … },
  "navigation": { "menus": { … } },
  "header": { "type": "site-header", … },
  "footer": { "type": "site-footer", … }
}
```

Listed files must exist. Unlisted `pages/*.json` are ignored with a warning when a list is given. The order
of `pages` is the page order in the editor. Without a manifest, all files are read in alphabetical order.

## How the importer builds the site

1. Unzip (stored or deflate entries only; at most 2,000 files and 400 MB unzipped).
2. **Bundled media:** collect every JSON string that **starts with** `asset:` (anywhere in any document).
   Each one must have a matching `assets/<path>` file. Each referenced file is uploaded to the
   organization's media library, which detects the real type from the bytes, sanitizes SVGs, generates
   responsive variants for jpg/png/webp/avif and reuses files that are already in the library. The string
   is then replaced by the media URL. Media objects `{ "src": "asset:…" }` also get `mediaId`, `width`,
   `height` and `mimeType` filled in, unless you set them.
3. Assemble the definition: `site.json` (minus `bundle`) + `theme` + `pages[]` + `collections[]` + `forms[]`.
4. Validate it with the strict schema; on failure, fall back to the loose input schema (ids optional).
5. **Normalize** with the component registry: assign ids, apply default props, check each node's type,
   variant, props and children. Problems are logged, not fatal:
   - an unknown component type is **dropped**;
   - invalid props are **replaced by the defaults** (your text is lost);
   - disallowed children are **removed**;
   - an element placed at a page root is wrapped in a `section`.
   More than 20 error-level problems rejects the whole import.
6. Create the website as a draft. Nothing is published until a user publishes it.

`atrium-bundle validate` runs steps 1–5 with Atrium's own code, and reports the silent losses in step 5 as
errors.

## Media references

```json
{ "type": "image", "props": { "image": { "src": "asset:images/terrace.jpg", "alt": "Terrace at dusk" } } }
```

- Use `asset:<path relative to assets/>` as the **entire** string value. A string that merely contains it
  (CSS, HTML, markdown) is not rewritten.
- Works for any string field: MediaRef `src` and `poster`, `settings.branding.logo` and `favicon`,
  `settings.seo.ogImage`, `page.seo.ogImage`, theme font `files[].url`, `style.backgroundImage.src`,
  structured data, and so on.
- Accepted types (detected from the bytes): jpg, png, gif, webp, avif, svg, mp4, webm, mov, pdf, woff,
  woff2, ttf, otf, plus txt, csv, zip and Office documents. Unknown types fail the import.
- Remote `https://` media URLs are allowed (hotlinking), but `pack` downloads them into `assets/remote/`
  by default, so the site does not break when the other host changes.

## Limits

| Limit | Value | Where |
| --- | --- | --- |
| Upload (zip) size | 300 MB | Multer `fileSize` on the import route; nginx allows 310 MB |
| Unzipped size | 400 MB | `unzip maxTotalBytes` |
| Files in the zip | 2,000 | `unzip maxFiles` |
| Referenced assets | 500 | `BundleAssetsService` `MAX_ASSETS` |
| Size of one media file | 100 MB (default `UPLOAD_MAX_MB`) | `MediaService` |
| Organization storage | plan's `storageMb` | the import fails with "Storage limit reached for your plan" |
| Component errors | 20 | above this the import is rejected |
| Text limits | per prop (see components.md) | invalid → reset to default |
| `customCss` | site 100,000 chars · page 50,000 · node 20,000 | schema |
| Page scripts | head and body 50,000 chars each | schema |

## Compression

Atrium's importer reads zips with JSZip, which supports only **stored** and **deflate** entries.
zstd (zip method 93), bzip2, LZMA, 7z and tar are rejected. `pack` deflates JSON at level 9 and stores
already-compressed media (jpg, png, webp, avif, mp4, webm, woff2…), because deflating them saves ~0%.
Real savings come from the media themselves: `pack` resizes images to 2560 px and converts them to
WebP, and re-encodes video to H.264, which often shrinks a site to a fraction of its size.
