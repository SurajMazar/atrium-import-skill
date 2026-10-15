# Examples

`rosewood-courtyard/` is one of Atrium's demo websites as an **unzipped bundle** in the loose input form
an agent writes (ids optional), generated from Atrium's own templates by `tools/build.mjs`. It validates
cleanly: `node ../scripts/atrium-bundle.mjs validate rosewood-courtyard`.

Use it to copy patterns: `site.json` (settings, menus, header and footer), `theme.json`, page files with
real section compositions, and forms referenced by `formId`.

One difference from what you should produce: its images are hotlinked Unsplash URLs. In your bundles,
copy media into `assets/` and reference them as `"asset:images/…"`. `pack` would also download these
URLs into the bundle.
