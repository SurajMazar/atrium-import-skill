# atriumify — a Claude skill for Atrium site imports

Turns any website project (plain HTML, React, Next.js, Vue, Svelte, Astro, Tailwind, a template or a
vibe-coded prototype) into **one zip you can import into Atrium**: all pages rebuilt from Atrium components,
all media bundled and optimized, and the whole thing checked against Atrium's own importer rules before
you upload it.

## Use it

In Claude Code, inside (or next to) the website project:

```
/atriumify                       # convert the current folder
/atriumify ./my-site             # convert another folder
/atriumify ./my-site leela.zip   # choose the zip name
```

Or just ask: *"atriumify this site"*.

Claude surveys the project, writes the Atrium bundle next to it (`<project>-atrium/`), packs it into
`<project>-atrium.zip` and reports what it converted and anything it could not reproduce. Then:

1. Open the Atrium admin → **New website** → **Import**.
2. Choose the zip.
3. Review the new site in the editor, then publish.

From a terminal you can also run `pnpm atrium import-site <zip> --org <org>` in the Atrium repo.

## Install

**As a personal skill** (gives the short `/atriumify` command):

```bash
git clone https://github.com/SurajMazar/atrium-import-skill.git ~/atrium-import-skill
```

```bash
mkdir -p ~/.claude/skills && ln -s ~/atrium-import-skill/skills/atriumify ~/.claude/skills/atriumify
```

**As a plugin** (command becomes `/atriumify:atriumify`): in Claude Code run
`/plugin marketplace add SurajMazar/atrium-import-skill`, then `/plugin install atriumify@atrium-import-skill`.

Requirements: Node 18+. For media optimization, ImageMagick (or `cwebp`) and `ffmpeg`
(macOS: `brew install imagemagick ffmpeg`). Without them, media are packed unchanged.

## What's inside

```
skills/atriumify/
├── SKILL.md                     the instructions Claude follows
├── scripts/atrium-bundle.mjs    self-contained CLI (generated; no npm install needed)
├── references/
│   ├── bundle-format.md         zip layout, asset references, importer limits
│   ├── conversion-guide.md      how to map HTML/React designs onto Atrium
│   ├── components.md            every Atrium component and its exact props (generated)
│   └── schemas.md               settings, theme, page, SEO, style, forms, icons, animations (generated)
└── examples/rosewood-courtyard/ a complete valid bundle (Atrium demo site)
tools/                           sources and build script for the generated files
```

The CLI works on its own too:

| Command | What it does |
| --- | --- |
| `node skills/atriumify/scripts/atrium-bundle.mjs init <dir> --name "Site"` | Scaffold a bundle folder |
| `… pack <dir> -o site.zip` | Download hotlinked media, convert images to WebP (max 2560 px), re-encode video (H.264), remove duplicates and unused files, zip, then validate |
| `… validate <dir or zip>` | Run the importer's checks: limits, media, schema, component props, links, forms, menus |
| `… inspect <zip>` | List what is inside a zip |
| `… presets` | List the theme presets |

## Size and compression

Atrium accepts uploads up to **300 MB** (400 MB unzipped, 2,000 files, 500 media files, 100 MB per
file). Almost all of a site's size is images and video, so `pack` shrinks the media themselves (often to a
fraction of their original size) and then zips with deflate level 9.

**Why not zstd?** Atrium's importer reads zips with JSZip, which only understands *stored* and *deflate*
entries, so a zstd zip would be rejected. zstd would also gain almost nothing here, because images and
video are already compressed. Supporting it would need a change to Atrium's importer first.

## Keeping it in sync with Atrium

The CLI's validator and the component and schema references are generated from an Atrium checkout, so
they match the importer exactly. After Atrium changes its components or schema, rebuild and commit:

```bash
ATRIUM_ROOT=~/personal/atrium-contabo node tools/build.mjs
```

The checkout needs its dependencies installed (`pnpm install`). The generated files record the Atrium
commit they were built from (`atrium-bundle help` shows it).
