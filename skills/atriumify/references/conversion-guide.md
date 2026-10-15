# Converting a website project to Atrium

The aim is a site that **looks like the original and stays editable** in Atrium's visual editor. Atrium
renders its own components from JSON, so you rebuild the site from those components rather than shipping
the original code. Prefer native components: they are editable, responsive, accessible and SEO-ready.
Reach for custom CSS only to close visual gaps, and use `embed` only for third-party widgets.

## 1. Survey the source

| Project | Where pages live | Where content lives |
| --- | --- | --- |
| Static HTML | `*.html` files (one per page) | the markup itself |
| Vite + React / Vue / Svelte | router config (`createBrowserRouter`, `routes.ts`, `<Route>`), `src/pages` | components, plus arrays/JSON in `src/data`, `src/content`, constants files |
| Next.js | `app/**/page.tsx` or `pages/**` | components, `content/`, MDX, CMS fetches (copy the fetched content if you can run it) |
| Astro | `src/pages/**` | `.astro`/MDX files, content collections |
| Single-page "landing" | one route with `#anchors` | sections of one component tree |

Read the source, not `dist/`. Resolve imports: `import hero from './hero.jpg'` means `src/.../hero.jpg`
is a media file to bundle; `public/` files are referenced as `/file.jpg`. Collect text exactly, including
`alt` texts, button labels, prices, phone numbers, addresses and links.

A single-page site with anchor navigation can stay one page (menu links `"/#services"` plus matching
`anchor` values). Split it into several pages only if the user asks.

## 2. Choosing components

Map each visual section to the **most specific** component, and choose its `variant` to match the layout.
Look up exact props in `components.md` (`grep -n "^### features$" components.md`).

| Source pattern | Atrium component |
| --- | --- |
| Top navigation bar (logo, links, CTA) | `site-header` in `site.json` + `navigation.menus.primary` |
| Footer (columns, contact, social, legal links) | `site-footer` + menus (`footer`, `legal`…) + `settings.business` / `settings.social` |
| First big banner with headline / image / video / slideshow | `hero` (variants: fullscreen-image, fullscreen-video, split, centered, minimal, editorial, carousel, cinematic, text-overlay) |
| Intro paragraph or statement band | `text-section` |
| Image + text side by side ("About us", alternating rows) | `content-split` (one per row; alternate the image side via variant/props) |
| Grid of cards with icons or images (services, features, "why us") | `features` (or `benefits` for short perks) |
| Numbers ("15+ years", "800 guests") | `stats` |
| Logos of clients / press | `logo-cloud` |
| Testimonials, reviews, quotes | `testimonials` (one pull quote: `quote` inside a `section`) |
| Pricing plans / packages | `pricing` (`offers` for hospitality packages) |
| FAQ / accordion list | `faq` (emits FAQPage structured data). An accordion inside a custom layout: `accordion` |
| Photo grid / masonry / lightbox | `gallery`. A slider: `carousel` |
| Team members | `team` |
| History / process steps | `timeline`, `sticky-story` or `horizontal-scroll` |
| Comparison table | `comparison-table` |
| Final "Book now / Contact us" band | `cta` |
| Contact details block | `contact-info` (reads `settings.business`, so fill that in) |
| Contact / booking form | `form` + `forms/<slug>.json` |
| Newsletter sign-up | `newsletter` + a form with an email field |
| Google Map | `map` inside a `section` (or `contact-info`) |
| Embedded YouTube / Vimeo / MP4 | `video` (block inside a section). Ambient footage band: `background-video` |
| Full-width image band | `parallax-band` |
| Scrolling ticker text / logos | `marquee` |
| Tabs | `tabs` |
| Restaurant menu | `menu`. Rooms / venues / dining / experiences / attractions / events: the hospitality sections |
| Blog / case studies / listings | a collection + `collection-list` (+ a `collection-template` page for item details) |
| Booking engine, calendar, review widget, any third-party script widget | `embed` (iframe URL preferred; `sandbox` mode for script snippets) |
| Anything else | `section` → `columns` / `grid` / `stack` / `container` → elements (`heading`, `text`, `rich-text`, `image`, `button`, `button-group`, `list`, `icon`, `badge`, `divider`, `spacer`) |

**Omitted props get the component's default, and many defaults are sample content** (demo headings,
Unsplash photos, a "Property film" title). Set every content prop the component displays: text, images,
buttons, items. `validate` warns about each sample default that would show. Text can be `""` and lists
`[]`; a default media object cannot be removed, so pick a variant that does not display it.

Composition rules:
- `page.sections` holds section-level nodes only. Custom layouts are `section` → layout block → elements.
- One `hero` per page, normally first. Headings: one `h1` per page (the hero heading is the h1).
- `heading` and many section headings support `*emphasis*`: words wrapped in asterisks render in the
  italic/accent style. Use it only where the source emphasises words (italic, a different colour or font).
- Long formatted copy (articles, policies) goes in `rich-text` as sanitized HTML (`<h2>`, `<p>`, `<ul>`,
  `<a>`, `<strong>`, `<em>`, `<blockquote>`).
- Repeated identical bands (the same CTA on every page) can be a `globalSections` entry referenced with
  `{ "type": "global-section", "ref": "<id>" }`.

## 3. Theme and design tokens

`theme.json` drives every component, so get it right first. Start from the `init` preset and overwrite:

- **Colours** (`colors.*`): `primary` = main brand/button colour, `primaryContrast` = text on primary,
  `secondary`/`accent` = second and highlight colours, `background` = page background, `surface` and
  `surfaceAlt` = card and alternate band backgrounds, `text`, `muted` (secondary text), `border`,
  `inverse`/`inverseText` = dark bands. Take them from Tailwind `theme.extend.colors`, CSS custom
  properties (`:root { --brand: … }`) or the most-used colours in the CSS. Dark sites: `"colorScheme": "dark"`.
- **Fonts** (`typography.heading`, `typography.body`, optional `accent`):
  - Google Fonts: `{ "family": "Playfair Display", "source": "google", "weights": [400, 600] }`.
  - Self-hosted or commercial files: bundle them and use
    `{ "family": "Brand Sans", "source": "custom", "weights": [400, 700], "files": [{ "url": "asset:fonts/brand-400.woff2", "weight": 400 }, { "url": "asset:fonts/brand-700.woff2", "weight": 700 }] }`.
  - System stacks: `"source": "system"`.
  - Also set `baseSize`, `scale`, `headingWeight`, `headingTransform` ("uppercase" if all headings are
    uppercase) and `headingLetterSpacing` to match.
- **Shape**: `radius.sm/md/lg/xl` (Tailwind `rounded-*`), `shadows`, `buttons` (shape/style), `containerWidths`
  (Tailwind `max-w-*` / container width), `spacing.sectionY` (compact / regular / airy).
- See `schemas.md` → "Theme tokens" for every field.

## 4. Styling: closing the visual gap

Work down this list and stop as soon as the result matches:

1. **Theme tokens** (above).
2. **Component variant and props**: `variant`, `tone` (default / surface / surface-alt / inverse / primary /
   transparent band colour), `containerWidth`, `spacingTop`/`spacingBottom`, `columns`, `aspect`, `align`…
3. **`node.style`**: padding, margin, gap, maxWidth, minHeight, background, backgroundImage, color,
   fontSize, fontWeight, letterSpacing, textAlign, borderRadius, border, boxShadow… Values can be
   responsive (`{ "base": "96px 0", "mobile": "48px 0" }`). Only the keys listed under each component's
   "Style keys" are applied. Prefer theme variables: `"color": "var(--a-color-accent)"`.
4. **`node.customCss`**: CSS scoped to that node. `&` is the node's root element:
   `"& { letter-spacing: .2em } & img { filter: grayscale(1) } @media (max-width: 767px) { & { padding: 24px } }"`.
   Without `&`, the text is treated as declarations for the root.
5. **`page.customCss`** / site `customCss`: global rules (keyframes, small utilities). Keep them small.

CSS rules enforced by Atrium's sanitizer: comments and `@import` are removed; `url()` only allows https,
relative or `data:image/…` URLs; `expression()`, `image-set()`, `behavior` and `javascript:` are blocked.
`asset:` does **not** work inside CSS. Put background images in `style.backgroundImage`
(`{ "src": "asset:images/bg.jpg", … }`, see schemas.md) or a component image prop.

Theme CSS variables you can use in style values and custom CSS:
`--a-color-{primary,primary-contrast,secondary,accent,background,surface,surface-alt,text,muted,border,inverse,inverse-text,danger}`,
`--a-font-{heading,body,accent}`, `--a-radius-{sm,md,lg,full}`, `--a-shadow-{sm,md,lg}`,
`--a-space-{1,2,3,4,5,6,8,12,20,32,section}`, `--a-text-{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl,6xl}`,
`--a-container-{narrow,default,wide}`.

Tailwind → Atrium quick map: `bg-*`/`text-*` colours → theme colours or `tone`; `py-24` → `spacingTop/Bottom`
or `style.padding`; `max-w-*` → `containerWidth`/`style.maxWidth`; `grid-cols-3 md:grid-cols-2` →
`grid` `columns`/`tabletColumns`/`mobileColumns`; `rounded-2xl` → theme radius or `style.borderRadius`;
`uppercase tracking-widest` → `style.textTransform`/`letterSpacing` or the theme's eyebrow settings.

## 5. Media

- Copy every used file into `assets/` (images, posters, videos, fonts, downloadable PDFs). Keep folder
  structure readable: `assets/images/`, `assets/video/`, `assets/fonts/`, `assets/docs/`.
- Image: `{ "src": "asset:images/x.jpg", "alt": "Describe the photo" }`. Add `focalPoint`
  (`{ "x": 0.5, "y": 0.3 }`) when the source crops with `object-position`.
- Video component: a bundled file needs `"source": "file"` (the default is `"youtube"`), e.g.
  `{ "type": "video", "props": { "source": "file", "video": { "src": "asset:video/tour.mp4" }, "poster": { "src": "asset:images/tour.jpg", "alt": "…" }, "title": "Venue tour" } }`.
  YouTube/Vimeo: `"source": "youtube"` / `"vimeo"` with `"url"`.
- Inline SVG icons → nearest name from `schemas.md` → "Icon names". Inline SVG logos/illustrations → save
  as `.svg` files in `assets/` and use them as images.
- CSS background images → `style.backgroundImage` or the component's image prop.
- Logo, favicon, social share image: `settings.branding.logo` (+ `logoInverse` for dark headers),
  `settings.branding.favicon`, `settings.seo.ogImage`, all as `asset:` strings.
- You do not need to resize or convert anything: `pack` does it. Do not reference files you did not copy.

## 6. Links and navigation

- Internal links are path strings: `"/"`, `"/about"`, `"/services/web-design"`, `"/#contact"`, `"#faq"`
  (same page). Give the target node `"anchor": "contact"`.
- External: `"https://…"`, or `{ "type": "url", "href": "https://…", "newTab": true }`.
- `{ "type": "email", "email": "…" }`, `{ "type": "tel", "phone": "…" }`,
  `{ "type": "whatsapp", "phone": "…", "message": "…" }`, or the `mailto:`/`tel:` string forms.
- Menus: `navigation.menus.<name>` arrays of `{ "id", "label", "link", "children"? }`. The header uses
  `props.menu` (default `"primary"`); check the `site-footer` props for its menu names.
- Old URLs that change (`/about.html` → `/about`) can get `redirects` in `site.json`:
  `{ "source": "/about.html", "destination": "/about", "statusCode": 301 }`.

## 7. Forms

Create `forms/<slug>.json` with an explicit id, and reference it from a `form` (or `newsletter`) section:

```json
{
  "id": "form-contact",
  "name": "Contact",
  "slug": "contact",
  "fields": [
    { "id": "f-name", "type": "text", "name": "name", "label": "Your name", "required": true },
    { "id": "f-email", "type": "email", "name": "email", "label": "Email", "required": true },
    { "id": "f-message", "type": "textarea", "name": "message", "label": "Message" }
  ]
}
```

```json
{ "type": "form", "props": { "formId": "form-contact", "heading": "Get in touch" } }
```

Copy the original fields (labels, placeholders, options, required). Submissions land in Atrium's inbox;
email notifications and other actions can be configured after import (see schemas.md → Form → `actions`).
Do not put secrets (API keys, webhook tokens) in the bundle.

## 8. Repeated content (CMS)

Use a collection when the source has many items with the same shape that the client will keep adding to
(blog posts, projects, team, listings). Write `collections/<slug>.json` with `fields` and `items`, list it
with `collection-list` (or bind a section's list prop via `binding`), and add a page with
`"kind": "collection-template"`, `"collection": "<slug>"` for the item detail page. For a handful of
static items, plain component lists are simpler.

## 9. Motion

Map scroll animations (AOS, Framer Motion, GSAP, `animate-*`) to `node.animation`:
`{ "preset": "fade-up" }`, optionally `delay`, `duration`, `stagger` and `target: "children"` for staggered
cards. Use the presets recommended for each component. The site's overall intensity is the theme's `motion`
setting. Do not animate everything. Match what the source actually does.

## 10. SEO

- Per page: `seo.title` (≤60 chars, unique), `seo.description` (120–160 chars), `seo.ogImage`.
- Site: `settings.seo.siteTitle`, `titleTemplate` (`"%s — Brand"`), `description`, `ogImage`;
  `settings.business` (name, phone, email, address, geo, opening hours) feeds LocalBusiness structured data
  and `contact-info`.
- Keep the source's existing titles and meta descriptions if it has them.

## 11. What cannot be carried over

Say so in the report rather than faking it:
- Application logic: authentication, carts and checkout, dashboards, client-side data fetching, search
  over custom data, calculators. Suggest an `embed` of a hosted tool, or an Atrium form.
- Bespoke JavaScript effects (canvas, WebGL/3D, custom cursor, physics): approximate with an animation
  preset or `background-video`, or leave them out.
- Third-party scripts (analytics, chat widgets): `settings.analytics` for GA/GTM/Meta Pixel; others go in
  `settings.scripts` (needs the code permission). Do not copy tracking IDs you are unsure about.

## 12. Before you pack

- Every page from the inventory exists, in the right order, with real copy and media.
- Header menu and footer links all resolve (`validate` warns about broken ones).
- `pack` → zero errors. Then compare against the source screenshots, section by section, if you have them.
