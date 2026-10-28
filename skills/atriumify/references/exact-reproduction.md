# Exact reproduction: rules and gates

The user expects the Atrium site to be **indistinguishable** from the source. "Same sections and headings"
is not done. "Close enough" is not done. A real conversion took more than three hours of the user
pointing out differences one at a time, because each of the lessons below was learned only when the user
noticed it. Read this before writing any page, and do not report the site as finished until every gate in
§4 passes.

## 1. Never invent, never approximate

- **Reproduce the source's UI exactly, or say it is missing.** Do not substitute an Atrium default ("View
  room →" links where the source shows amenity chips, a category tag where it shows a duration, a single
  form where it has a multi-step flow, a social-icon row where it lists text links, a "Load map" facade
  where it embeds the map). If Atrium has no component for it, build it (bridge CSS + site script),
  otherwise list it under "Not reproduced" in the report.
- **No new UI.** No decorations, rules, badges, icons, shadows or animations that the source does not have.
- **No CDN libraries.** Ports run as site scripts (≤ 50,000 characters each), in plain JS, with no
  external requests. Do not load three.js, GSAP, etc. from a CDN.
- **Values come from measurement**, not from eyeballing or from Atrium's scale. Every size, colour,
  spacing, column span and aspect ratio is read from the source code or the computed style.

## 2. Inventory before you build (write it down, port each item)

During the survey, list every item below that appears in the source, with the file it comes from and how
you will reproduce it. Search the source for each one; do not rely on screenshots.

| Look for | Where it hides | How to port |
| --- | --- | --- |
| Custom cursor | `CustomCursor`, `cursor: none`, `mix-blend-mode` | site script + CSS; copy sizes, labels ("View"/"Explore"), `data-cursor` targets |
| WebGL / canvas scenes | `three`, `@react-three/fiber`, `<canvas>`, `ogl`, `pixi` | port the exact maths into a 2D canvas or raw WebGL (§3.8); verify with `compare-scene.mjs` |
| Scroll cues, bouncing arrows | hero components | site script inserts the element; CSS keyframes copied |
| Breadcrumbs | page hero components | site script (labels per path) |
| Floating buttons (WhatsApp/chat/back-to-top) | layout | site script + CSS |
| Rotating badges / seals / stamps | `Seal`, `Badge`, `animate-spin`, SVG `textPath` | site script inserts at the same positions and breakpoints |
| Card internals: chips, meta lines, corner icons, durations | `*Card.tsx` and their data files | CSS for icons; site script for data the component has no field for (chips) |
| Button variants per call site | `CTAButton`/`Button` props: `variant`, `size`, `withArrow`, icon | bridge CSS (§3.1); list every call site |
| Section heading + action button on the right | `SectionHeading action=` | bridge CSS grid (§3.3) |
| Header states | overlay vs scrolled vs solid; the CTA variant per state; active link; mobile menu | bridge CSS (§3.2) |
| Logo lockup | `Logo.tsx` (live text in web fonts) | outlined SVG (§3.7) |
| Multi-step forms, summary panels, steppers | `*Flow.tsx`, `step` state | reproduce steps and the side panel; never flatten into one form without telling the user |
| Maps | `iframe` embeds, map facades | match: embed directly (`facade: false`) if the source does |
| Reveal / parallax / magnetic / hover zoom | `Reveal`, `useParallax`, `useMagnetic`, `group-hover:scale` | Atrium animations or CSS; same durations and easing |
| Footer contact rows, icons, order | `SiteFooter` | bridge CSS + small script if the order spans containers |

## 3. Lessons (each one was a real miss)

### 3.1 Buttons
- Read **every call site** of the button component: `size` (sm/md/lg paddings), `variant`, `withArrow`.
  The arrow, the size and the shadow differ per call site; Atrium's buttons are all `md` with no arrow.
- Box model: filled variants often have **no border** (md 44px, lg 52px), outlines add 1px (46/54px).
  Atrium draws a 1px border on every variant, so set `border-width: 0` on filled ones.
- Gap between label and icon (`gap-2` = 8px), and the **exact glyph**: Atrium's `arrow-right` (lucide) is
  not the source's arrow. Hide `.a-btn__icon` and draw the source glyph with `::after` +
  `mask: url("data:image/svg+xml,…")`, including its hover translate.
- A common rule: the first button of a pair has the arrow, the second does not
  (`.a-btn:not(.a-actions > .a-btn ~ .a-btn)::after`).
- Light variants usually carry a shadow token; hover colours differ per variant and per surface.
- Text-link CTAs: the source's underline is usually a real `border-bottom` (stone/30) with `pb-1`, not
  Atrium's gradient underline.
- Verify with `compare-controls.mjs`: it reports padding, height, width, border, shadow and icon per button.

### 3.2 Header
- Measure **both states** (over the hero and scrolled) and the inner-page state: link colour and the active
  link (Tailwind class-order bugs in the source are what the user sees: copy the computed value), the
  active underline, the CTA variant (often light over the hero, solid when scrolled) and its shadow, the
  logo (light/dark), the menu button, the backdrop blur and border.
- Mobile: the menu button, the drawer's links (font, size, colour), its CTA (label, size, full width, arrow).
- Layout: the source bar is usually `justify-between` with a gap: logo, nav and actions spread evenly
  (Atrium pushes the nav right). Bar height = padding + logo height (Atrium sets a 76px `min-height`).
  The CTA's own breakpoint (often visible from `sm`, Atrium hides it below 768px).
- **Never put `backdrop-filter`, `filter` or `transform` on `.a-header` without excluding `.is-open`**:
  any of them makes the header the containing block of the fixed mobile drawer, which then opens squeezed
  inside the 72px bar. Open the menu at 390px and compare it element by element (drawer background, link
  size/opacity/dividers/icons, secondary links, CTA).

### 3.3 Section headings with an action
`SectionHeading action={…}` puts the button at the right of the intro (`md:flex-row md:items-end
justify-between`, intro `max-w-xl`), hidden below md and repeated full width under the grid. In Atrium the
button is `.a-section__actions` after the grid: from md, make the container a 2-column grid, put the intro
in row 1 col 1 and the actions in row 1 col 2. **`.a-intro` has a bottom margin that does not collapse
inside a grid**: zero it and put the source's `mt-16` on the grid instead, or the button floats below the
intro and every section grows by ~70px.

### 3.4 Grids and splits
- Text/image splits in hand-built sites are usually **12-column** (`md:grid-cols-12 gap-gutter`, copy
  `col-span-5`, image `col-span-6 col-start-7`, or mirrored with `col-start-8`). Atrium's split is 50/50.
  Re-grid `.a-split__grid` and place copy/media per `.a-split--right`.
- Aspect ratios per image (`aspect-[16/10]` on the first gallery item, `5/4`, `4/3`, `16/9`), grid gaps
  (`gap-6`, `gap-8`, `gap-12`), `gap-px` hairline grids (no outer border, rounded, `overflow: hidden`).
- Section padding: `py-20 md:py-section-gap` means 80px then 120px, not a fluid clamp.
- CTA bands: the source's own padding (`py-32 md:py-48`), column width (`max-w-3xl`), overlay colour and
  opacity, heading size and `text-shadow`. Zero Atrium's inner container padding.

### 3.5 Cards and repeated items
Copy each card component's internals: spacing (`mt-6`, `mt-2`, `mt-4`), title size, the corner icon (size,
colour, hover colour), chips (background, radius, padding, label style) and data such as tags or durations
from the source's data files. Testimonials: quote size and quote marks, byline on one line
(`author · origin`), card background, padding, shadow, and where disclaimers sit.

### 3.6 Footer
Rows, their order and their icons (email, address, Instagram handle, phone → WhatsApp), link underline
style, column grid, bottom bar, seal. Don't accept Atrium's social-icon row when the source lists text rows.

### 3.7 Logos
An SVG shown through `<img>` **cannot load web fonts**: `<text>` renders in a fallback font at the wrong
size. Always convert the wordmark to outlines with `scripts/logo-outline.py` (fontTools + HarfBuzz, the
source's own font files, from `.next/static/media`, `public/fonts` or Google Fonts), at the measured sizes,
tracking and line positions, for the dark and the inverse logo. The printed line widths must match the
browser's text widths (to ~0.1px).
If the media upload does not work, the lockup can be drawn by the bridge CSS instead: hide
`.a-header__brand .a-brand__logo` and use background layers (mark URL + one outlined
`data:image/svg+xml` per text line). Atrium drops any `url()` longer than **8,192 characters**: write the
paths as relative commands in integer 0.1px units (≈5.6KB for an 11-letter Garamond line). Set the site logo width to the lockup width, and the website **name** to
the brand name (it is used in "<name> — home" labels and titles), not the slug.

### 3.8 WebGL / three.js scenes
Port the scene's maths exactly, then verify with `compare-scene.mjs` (frozen clock). Traps:
- `PointsMaterial` `alphaMap` uses the texture's **green** channel. A radial-gradient sprite whose colour
  is constant gives a **solid disc**, not a soft glow. `map` multiplies colour. Size with `sizeAttenuation`
  is `size × (canvasHeight / 2) / depth` CSS pixels.
- Colours: hex colours are sRGB in and out; additive blending onto a transparent canvas then composites
  over the page like `globalCompositeOperation = 'lighter'` on a 2D canvas.
- `wireframe: true` draws each triangle's three edges, so **shared edges are drawn twice** (darker), and
  WebGL lines are **1 device pixel** wide (`lineWidth = 1 / dpr` on a 2D canvas).
- react-three-fiber pointer events only reach the canvas's own container. If an overlay sits above the
  canvas (most heroes), the scene **never reacts to the mouse**. Don't add parallax the source doesn't have.
- Euler order XYZ (`v' = Rx·Ry·Rz·v`), scale before rotation, camera fov/position/near, DPR caps and device
  tiers (counts per tier), `IntersectionObserver` start, reduced-motion/no-WebGL fallbacks.
- Layer order: still image → canvas → overlay(s) → copy.

### 3.9 Admin and verification mechanics
- Edit live sites in the admin UI (Settings → Custom CSS / Scripts / Branding, the page editor). Don't call
  the API with the admin's session token. Confirm each save: the "unsaved changes" bar must be gone.
- Uploads through the media picker must come from a path the session can read (the scratchpad works). If an
  upload sits at "0/1" with no `media/upload` request, it is the queue bug fixed in atrium-contabo fcf4d74
  (deploy it) — meanwhile use the CSS fallback above for logos.
- Test CSS and scripts **before saving** by injecting them into the preview (`--inject`, `--js`).
- `requestAnimationFrame` does not run in hidden/embedded browser panes; schedule site-script work with
  `setTimeout` (scene render loops may use rAF).

### 3.10 Page heroes (inner pages)
- Copy the hero's own height variants per page (e.g. `tall` 78svh / py-40, `standard` 62svh / py-32, `short`
  48svh / py-28) and the vertical rhythm between crumbs, eyebrow, title and description (mt-6, mt-4, mt-6).
  Atrium's `h-tall`/`h-auto` heights and its `gap` on `.a-hero__copy` are different. Detail pages that share
  Atrium's `h-auto` can be told apart in CSS by their breadcrumb depth (`:has(.pg-crumbs li:nth-child(3))`).
- `.a-eyebrow` is `inline-flex`: inside a block container it sits on the parent's line box and adds 3–5px.
  Make it `display: flex` (or block) wherever you rebuild spacing with margins.

### 3.11 Scroll motion
Atrium's animation presets (`data-a-anim`) work per section (fade-up a whole section, stagger its direct
children). Hand-built sites animate per element: eyebrow fade, word-masked title, lede +0.1s, action +0.2s,
staggered cards 0.1s apart, clip-masked images settling from a zoom, parallax backgrounds, pinned
horizontal rails, magnetic buttons. Port the source's motion vocabulary instead of picking presets:
- Read the motion tokens (durations, eases, stagger, distances, trigger such as `top 82%`) and every
  wrapper (`Reveal`, `RevealText`, `RevealImage`, `StaggerReveal`, `ParallaxImage`, `useMagnetic`, hero
  timelines). Map each to Atrium markup by rule (section intros, split copy columns, grids, CTA bands,
  feature rows) and list per-page exceptions the source has (e.g. one page reveals each line of a row).
- Run it as a site script on the Web Animations API (no GSAP from a CDN). GSAP eases: power3.out =
  `cubic-bezier(.215,.61,.355,1)`, expo.out = `cubic-bezier(.19,1,.22,1)`, power2.out =
  `cubic-bezier(.25,.46,.45,.94)`. Animate the independent `translate` / `scale` properties, not
  `transform`, so you never clobber a centring transform or a hover/bounce animation.
- Switch the theme's motion intensity to **Off** so Atrium's presets don't animate the same sections twice.
- Hidden-until-revealed content must never stay hidden: verify with `compare-motion.mjs` (it scrolls the
  page and lists anything still invisible) on every page, and after client-side navigation.
- ParallaxImage layers are over-sized (e.g. `-inset-y-[12%]`): give the Atrium image the same over-size,
  or the drift exposes an edge.

### 3.12 Horizontal rails
A pinned rail (`useHorizontalScroll`) = sticky full-height panel + the track translated by the scroll
distance `track.scrollWidth - innerWidth`. A flex track's `scrollWidth` excludes its end padding: match the
source's padding so the pin length (section height = 100vh + distance) is identical. Copy the card widths per
breakpoint (82vw / 60vw / 38vw / 32vw), overlays such as step numbers on the photo, caption order (title, caps
line, body) and the swipe/scroll hint.

### 3.13 Interactive UI is content too
Filters with live counts ("Showing 3 of 3 sanctuaries"), FAQ topic filters, gallery filters with counts,
multi-step booking flows with a summary aside, guest/date booking panels and contact panels are part of the
site. Port them (site script + CSS, driving the Atrium form underneath so submissions keep working) before
the first import. Find them with a text diff: render every source page, collect all text, alt and
aria-label strings and compare with every string in the bundle; anything missing is UI you have not ported.

### 3.14 Re-importing
- Never reference the site's own media by absolute URL in custom CSS or scripts (e.g. a logo mark in
  `background: url(https://…/storage/media/…)`): a re-import or media clean-up breaks it. Inline small SVGs as
  `data:image/svg+xml` (≤ 8,192 characters) or use the branding fields.
- The importer reuses identical files already in the organization's library (checksum match), so
  re-importing the same bundle does not duplicate media in storage.
- Deleting media in the admin deletes the files from storage (permanent); deleting a website archives it
  (soft delete) and removes its domain records — re-add the custom domain to the new site.

## 4. Gates: the site is not done until all pass, at 1440px and 390px, on every page

1. `compare-typography.mjs`: no family/size/weight/line-height differences left except noted noise.
2. `compare-controls.mjs`: every button and link matches padding, height, border, shadow, icon, colours.
3. `compare-layout.mjs`: no x/width/height/gap differences above tolerance except inline-vs-block widths.
   Page heights within ~1%.
4. `side-by-side.mjs`: **look at every strip of every page** and list each visible difference; fix or report it.
   Also capture the header over the hero, scrolled, and the mobile menu open.
5. `compare-scene.mjs` for each animated scene: same density, size, colour and motion at the same time.
   `compare-motion.mjs` on every page: same animated blocks and kinds, nothing stuck invisible.
   A text diff of every source page against the bundle: no missing strings except intended edits.
6. Interactions checked by hand: cursor states, hover states, header scroll change, mobile menu, forms
   (each step), maps, carousels, accordions, tabs.

Report the gate results in the final report. If the user finds a difference you did not, add it to this
file.
