# Design fidelity: making the Atrium site look exactly like the source

> Read `exact-reproduction.md` first: rules against inventing UI, the component inventory, every lesson
> from real misses, and the gates that must pass before the site is done.

Mapping sections onto components gets the structure right. It does **not** make the site look like the
source: Atrium renders every component with its own design system, and its defaults differ from almost
every hand-built site. Without the steps below, a converted site has the right fonts but the wrong sizes,
widths, spacing, header, buttons and footer. These lessons come from a real conversion (Next.js +
Tailwind 4 resort site) where every one of them showed up.

Work in this order: **measure → theme → design bridge CSS → missing UI (script) → verify**.

## 1. Measure the source first

Read the exact values, don't eyeball them. Sources, in order of reliability:
- Tailwind 4 `@theme { … }` blocks / Tailwind 3 `tailwind.config.*` (`fontSize`, `spacing`, `maxWidth`,
  `borderRadius`, `letterSpacing`), CSS custom properties, `next/font` calls (family + weights).
- The components themselves: the class lists on the header, nav links, buttons (all variants and sizes),
  section heading block, eyebrow/label, card titles, footer, breadcrumb, floating widgets.
- If the dev server runs: the computed styles (`scripts/compare-typography.mjs` measures every text element).

Write down, at minimum: body size/line height; every heading level (size/line height/weight/letter
spacing/colour) at desktop **and** mobile; eyebrow/label style; nav link style; each button variant
(colours, border, radius, padding, size, case, tracking, hover); container max width **including or
excluding** padding; side padding per breakpoint; vertical section spacing; image radius; header heights
and scrolled state; footer layout.

## 2. Why Atrium's defaults look different

| Atrium default | Typical source | Effect if not overridden |
| --- | --- | --- |
| Modular type scale: `size = baseSize × scale^n`, fluid `clamp()` per step (`--a-text-xs … --a-text-6xl`) | Fixed sizes (12/14/16/18/24/32/64 px) | Headings 20–60% too big, labels/buttons/nav 15–30% too small (scale 1.26 makes `xs` 10px) |
| `--a-container-default: 80rem` **plus** `--a-gutter` on each side | Tailwind `max-w-7xl` / 1280px **including** padding | Content ~130px wider |
| `--a-space-section`: 160px for `airy`, 112 regular | 96–120px | Page 20–40% taller |
| Section headings inherit body text colour | Brand-coloured headings | Headings look black |
| Eyebrows have a rule line (`a-eyebrow--rule`, `.a-intro--left .a-eyebrow::before`) | Plain label | Extra decoration |
| `secondary` button = theme `secondary` colour | Usually a light/white button | Wrong colour (e.g. brown instead of white) |
| Variant layouts (collage offset, 4:5 media, list dividers, centred feature cells, bordered testimonial cards) | Whatever the source does | Layouts look "templated" |
| Footer `columns` variant: logo, description, social, link columns, separate Contact column | Bespoke footers | Different structure |
| No breadcrumb, no floating chat/WhatsApp button | Common on hospitality sites | Missing UI |

The theme cannot express a flat type scale or exact paddings, so a **design bridge** in the site's
`customCss` is required for every conversion.

## 3. The design bridge (site `customCss`)

Put it in `site.json` → `customCss` (max 100,000 characters). Rules:

- **Prefix every selector with `body.atrium-site`.** Theme tokens are declared on `.atrium-site` (the
  `<body>`); renderer rules are `.atrium-site .a-…`. `body.atrium-site` beats both regardless of order.
- **Override tokens, not every component.** Most components read `--a-text-*`, `--a-container-*`,
  `--a-gutter`, `--a-space-section`, `--a-leading-heading`, `--a-button-*`. Setting them fixes dozens of
  elements at once:

```css
body.atrium-site {
  --a-text-xs: .75rem;   --a-text-sm: .875rem;  --a-text-base: 1rem;   --a-text-lg: 1.125rem;
  --a-text-xl: 1.25rem;  --a-text-2xl: 1.5rem;  --a-text-3xl: 1.75rem; --a-text-4xl: 2rem;
  --a-text-5xl: clamp(2.5rem, 1.6rem + 3vw, 4rem);
  --a-text-6xl: clamp(2.5rem, 1.6rem + 3vw, 4rem);
  --a-leading-heading: 1.25;
  --a-container-default: 72rem;   /* source content width (1280 - 2×64) */
  --a-container-wide: 72rem;      /* the header and footer use the wide container */
  --a-gutter: 1.25rem;            /* mobile side padding */
  --a-space-section: clamp(5rem, 3.4rem + 4vw, 7.5rem);
}
@media (min-width: 48rem) { body.atrium-site { --a-gutter: 4rem; } }
```

  Which token drives what: `h1` in heroes → `--a-text-6xl` (fullscreen) / `5xl`; section `h2` →
  `4xl`; `h3`/card titles → `2xl`/`xl`; `.a-lead` intro text → `lg`; nav links and buttons → `sm`;
  small buttons, eyebrows, tags → `xs`. Read `references/renderer-classes.md` for every class and the
  token it uses.
- **Then style the shared pieces** to the measured values: `.a-heading` colour (and `color: inherit`
  inside `.a-tone-inverse, .a-tone-primary, .a-hero, .a-on-media`), `.a-hero__heading` (size, line
  height, tracking, `max-width` in `em` to reproduce the source's line break — only for centred heroes,
  `.a-hero--pos-center`), `.a-hero__sub`, `.a-intro__sub.a-lead`, `.a-eyebrow` (+ `::before { content:none }`
  to drop the rule), `.a-nav__link` (size, weight, tracking, `text-transform`, colours for
  `.a-header--overlay:not(.is-scrolled)` and `.a-header.is-scrolled`), `.a-header.is-scrolled`
  background/blur/border, `.a-btn` and each `--primary/--secondary/--outline/--link` variant via the
  `--b-bg / --b-fg / --b-bd` variables, plus their on-dark versions.
- **Map button styles deliberately.** When writing pages, choose the Atrium `style` whose *role* matches,
  then restyle it in the bridge: dark/solid → `primary`; light/white → `secondary` (and restyle
  `.a-btn--secondary` as the light button); bordered → `outline`; underlined text → `link`.
- **Variant-specific rules need `!important`.** Rules such as `.a-split__collage { padding: 0 18% 14% 0 }`,
  `.a-split__secondary { position: absolute !important }`, media `aspect-ratio` set per variant, and grid
  gaps on `.a-exp__grid` are more specific than a token override. Check the computed style after a change;
  if it did not apply, add `!important` to that declaration only.
- **Restructure with CSS, not HTML.** Grids can be re-laid out: `display: contents` on a wrapper lifts its
  children into the parent grid, then `grid-column/grid-row/order` place them (this is how a footer gets a
  brand column with contact details under the description). Pseudo-elements can add text or images
  (`::before { content: ""; background: url("https://…/mark.svg") }` for a stacked logo,
  `::after { content: "BRAND" }`). Icons can be `mask: url("data:image/svg+xml,…")` with
  `background: currentColor`.
- **Sanitizer limits** (applied on render): comments and `@import` are removed; `url()` accepts only
  https, relative, or `data:image/(png|jpeg|webp|gif|avif|svg+xml)`. **`asset:` is not rewritten inside
  CSS** — for a bundled image in CSS, use a media URL after import (e.g. the favicon/logo URL the importer
  produced) or a `style.backgroundImage` / component image prop instead.

## 4. UI with no Atrium component: a site script

Breadcrumbs, floating WhatsApp/chat buttons, "back to top", small DOM tweaks: add an entry to
`site.json` → `settings.scripts`:

```json
{ "id": "site-ui", "name": "Breadcrumbs and WhatsApp button", "placement": "body-end",
  "consentCategory": "necessary", "code": "(function () { … })();" }
```

The script must follow these rules (each one caused a real bug):
1. **Wait for hydration before touching React-rendered DOM.** The site is server-rendered then hydrated;
   inserting nodes earlier causes a hydration mismatch and a full client re-render. Check
   `Object.keys(el).some(k => k.startsWith('__reactFiber'))` on the target before inserting.
2. **Re-apply after client-side navigation.** Pages change without a reload, so observe
   `document.documentElement` with a `MutationObserver` and re-run idempotently (mark inserted nodes,
   e.g. `data-path`, and skip when already correct).
3. **Schedule DOM work with `setTimeout`, not `requestAnimationFrame`.** rAF does not fire in hidden or
   embedded views; the feature then never appears. (A canvas render loop may use rAF.)
4. **Support preview URLs.** Previews live under `/_preview/<token>/…` (and dev under `/_site/<slug>/…`):
   strip that prefix before matching paths and add it back to generated links.
5. Wrap the work in `try/catch` so a mistake never breaks the page; no external requests; style the
   inserted elements in the bridge CSS (prefix ids/classes, e.g. `pg-`).
6. `consentCategory: "necessary"` so it runs when cookie consent is enabled.

## 5. Verify, then iterate

Before handing over, compare the result with the source at **desktop (1440px) and mobile (390px)**:
- `node scripts/compare-typography.mjs <source-url> <atrium-url>` (needs Playwright) matches every text
  element by its text and reports family/size/weight/line-height/tracking/case/colour differences and
  horizontal overflow per page. Aim for zero size/family/weight differences.
- Screenshot each section side by side (header over hero and scrolled, every home section, an inner page
  hero, the footer, mobile menu). Check: wrapping of the hero heading, image aspect ratios, button colours,
  link underlines, spacing between sections.
- After import, use the admin's **Preview** link (draft) for this, then fix in Settings → Custom CSS and
  Scripts, and copy the final CSS/scripts back into the bundle's `site.json` so re-imports keep them.
