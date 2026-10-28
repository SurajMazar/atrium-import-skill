# Atrium component reference

Generated from the component registry of Atrium `19f8721` by `tools/build.mjs`. Do not edit by hand.

Every node is `{ "type", "props", "children"?, "variant"?, "style"?, "animation"?, "customCss"?, "anchor"?, "name"? }`.
Props are validated against the schemas below; **invalid props are silently replaced by defaults on import**,
so always run `atrium-bundle validate`. `?` = optional, `= x` = default. Media props take a MediaRef
(`{ "src": "asset:images/x.webp", "alt": "…" }`, see schemas.md); link props take a Link (a URL string such as
`"/contact"`, `"#rooms"`, `"https://…"`, or a link object).

## Index

| Type | Level | Use when |
| --- | --- | --- |
| [`site-header`](#site-header) | site | Exactly one per website (WebsiteDefinition.header). |
| [`site-footer`](#site-footer) | site | Exactly one per website (WebsiteDefinition.footer). |
| [`section`](#section) | section | No specialized section fits and you need a custom arrangement of blocks. |
| [`container`](#container) | block | Groups children with optional background, padding and max width. |
| [`grid`](#grid) | block | Responsive grid. Columns collapse automatically on tablet and mobile. |
| [`columns`](#columns) | block | Two or three columns with a chosen ratio; stacks on mobile. |
| [`stack`](#stack) | block | Vertical or horizontal stack of children with consistent spacing. |
| [`spacer`](#spacer) | element | Vertical whitespace. |
| [`divider`](#divider) | element | Horizontal rule, optionally with an ornament or label. |
| [`heading`](#heading) | element | Heading text (h1–h6). Supports *italic emphasis* with asterisks for editorial styling. |
| [`text`](#text) | element | Plain paragraph text. |
| [`rich-text`](#rich-text) | element | Formatted long-form content (sanitized HTML: headings, lists, links, emphasis, quotes). |
| [`button`](#button) | element | Call-to-action button or link. |
| [`button-group`](#button-group) | element | Row of buttons. |
| [`icon`](#icon) | element | Line icon from the icon set. |
| [`badge`](#badge) | element | Small label or pill. |
| [`quote`](#quote) | element | Pull quote with optional attribution. |
| [`list`](#list) | element | Bulleted, numbered, check or icon list. |
| [`hero`](#hero) | section | First section of almost every page. Choose fullscreen-image/cinematic for hospitality, editorial for refined brands, split for corporate/SaaS, minimal for portfolios. |
| [`image`](#image) | element | A standalone photograph inside a custom section or column. Always provide descriptive alt text. |
| [`video`](#video) | block | Showing a property film, interview or product demo. |
| [`background-video`](#background-video) | section | Mid-page mood break or secondary hero with ambient footage. |
| [`gallery`](#gallery) | section | Showcasing rooms, venues, food or projects with 4+ photos. Editorial suits hospitality; masonry suits portfolios. |
| [`carousel`](#carousel) | section | Sequential storytelling with large images where space is limited. |
| [`logo-cloud`](#logo-cloud) | section | Social proof: press mentions, clients, certifications, partners. |
| [`cta`](#cta) | section | End of most pages to drive the primary conversion (book, enquire, contact). |
| [`features`](#features) | section | Services, amenities overview, product features or reasons to choose the business. Alternating suits 3–4 rich items with photos. |
| [`stats`](#stats) | section | Credibility through numbers: years in business, capacity, ratings, results. |
| [`testimonials`](#testimonials) | section | Social proof near decision points (after rooms, before CTA). |
| [`faq`](#faq) | section | Practical questions (policies, logistics, pricing). Improves SEO via FAQPage schema. |
| [`pricing`](#pricing) | section | SaaS plans, service tiers, membership levels. |
| [`team`](#team) | section | About pages, agencies, consultancies, clinics. |
| [`timeline`](#timeline) | section | Company history, wedding-day schedule, onboarding or delivery process. |
| [`comparison-table`](#comparison-table) | section | Side-by-side comparison of 2–5 options. |
| [`content-split`](#content-split) | section | Introducing the business, a venue, a room type or a service with one strong photograph. |
| [`text-section`](#text-section) | section | Opening statement after a hero, chapter introductions, philosophy or manifesto copy. |
| [`benefits`](#benefits) | section | Inclusions, perks, membership benefits, reasons to book direct. |
| [`rooms`](#rooms) | section | Hotels, resorts, lodges and B&Bs. Bind to the "rooms" collection with map { name: "{{item.name}}", image: "{{item.image}}", price: "{{item.price}}", size: "{{item.size}}", guests: "{{item.guests}}", slug: "{{item.slug}}" }. |
| [`amenities`](#amenities) | section | Hotel/venue facilities overview. Use lucide icon names (waves, wifi, utensils, car, flower-2, dumbbell…). |
| [`offers`](#offers) | section | Hotel packages, seasonal offers, wedding packages, spa days. |
| [`dining`](#dining) | section | Hotel restaurants, bars, cafés; pair with menu on a dining page. |
| [`menu`](#menu) | section | Restaurants, cafés, bars and hotel dining pages. |
| [`experiences`](#experiences) | section | Resort activities, tours, workshops, local excursions. |
| [`venues`](#venues) | section | Wedding venues, conference centres, hotels with event spaces. |
| [`events`](#events) | section | Event calendars for venues, restaurants and resorts. Dates in ISO format (YYYY-MM-DD). Emits Event structured data. |
| [`attractions`](#attractions) | section | Location pages for hotels, venues and rentals. |
| [`booking-cta`](#booking-cta) | section | Hotels with an external booking engine; place directly after the hero or before the footer. |
| [`contact-info`](#contact-info) | section | Contact pages and footers of location-based businesses. Values come from settings.business — do not hard-code them. |
| [`map`](#map) | block | Contact and location pages. Place inside a section or columns. |
| [`form`](#form) | section | Contact, enquiry, booking request and RSVP pages. Requires an existing form id (WebsiteDefinition.forms). |
| [`newsletter`](#newsletter) | section | Mailing list sign-up near the end of the homepage or blog pages. Needs a form with an email field. |
| [`social-links`](#social-links) | element | Inside contact sections or custom footers. Links come from settings.social. |
| [`tabs`](#tabs) | block | Parallel options (seasons, menus, packages) where only one needs to be visible at a time. |
| [`accordion`](#accordion) | block | Policies, details and secondary information inside a custom section. |
| [`modal`](#modal) | block | Secondary content on demand: terms, floor plans, booking forms, videos. |
| [`drawer`](#drawer) | block | Filters, booking details or long supporting text without leaving the page. |
| [`marquee`](#marquee) | section | Decorative rhythm between sections on expressive brands. |
| [`before-after`](#before-after) | block | Renovations, restorations, design transformations. |
| [`horizontal-scroll`](#horizontal-scroll) | section | Narrative sequences: a day at the resort, project timelines, collections. |
| [`sticky-story`](#sticky-story) | section | Step-by-step stories: the guest journey, a process, a wedding day. |
| [`parallax-band`](#parallax-band) | section | Breathing space between content-heavy sections; one evocative image. |
| [`animated-text`](#animated-text) | element | Playful hero or section headings for events and creative brands. |
| [`embed`](#embed) | block | Booking engines, calendars, review widgets that provide an embed code. |
| [`global-section`](#global-section) | section | Repeating the same CTA, newsletter or booking bar across pages — set node.ref to the global section id. |
| [`collection-list`](#collection-list) | section | Blogs, case studies, portfolios, property listings, team directories — any CMS collection. |

## Site chrome (exactly one header and one footer per site, in site.json)

### site-header

**Header** (site). Global site header with logo, navigation menu, optional CTA, contact and social links.

- Use when: Exactly one per website (WebsiteDefinition.header).
- Variants (`variant`): `classic` (default) — Logo left, menu right, CTA at the end.; `centered` — Logo centered with menu split on both sides.; `minimal` — Logo and a menu button that opens a fullscreen overlay menu on all devices.; `stacked` — Utility bar with contact info above the main bar.
- Children: none
- Style keys: padding, background, color, border

```ts
props: {
  menu?: string = "primary";
  cta?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  };
  sticky?: boolean = true;
  transparentOnHero?: boolean = true;
  hideOnScroll?: boolean = false;
  showSocial?: boolean = false;
  showContact?: boolean = false;
  showLanguageSwitcher?: boolean = false;
  logoText?: string;
  width?: "default" | "wide" | "full" = "wide";
}
```

Default props: `{"menu":"primary","cta":{"label":"Enquire","link":"/contact","style":"primary","iconPosition":"end"}}`

### site-footer

**Footer** (site). Global footer with brand description, link columns, contact details, newsletter, social and legal links.

- Use when: Exactly one per website (WebsiteDefinition.footer).
- Variants (`variant`): `columns` (default) — Brand column plus link groups and contact.; `centered` — Centered logo, menu, social, copyright.; `statement` — Oversized closing headline and CTA above compact columns.
- Children: none
- Style keys: padding, background, color, border

```ts
props: {
  description?: string /* ≤500 chars */;
  statement?: string /* ≤200 chars */;
  cta?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  };
  columns?: {
    title: string;
    menu?: string;
    links?: {
      label: string;
      link: string /* ≤8192 chars */;
    }[];
  }[] /* max 5 */;
  showContact?: boolean = true;
  showSocial?: boolean = true;
  showNewsletter?: boolean = false;
  newsletterFormId?: string;
  newsletterHeading?: string = "Stay in touch";
  showMap?: boolean = false;
  legalMenu?: string = "legal";
  copyright?: string = "© {{year}} {{business.name}}. All rights reserved.";
  tone?: "default" | "surface" | "inverse" | "primary" = "inverse";
}
```

Default props: `{"description":"{{business.description}}","columns":[],"tone":"inverse"}`

## Sections — the only types allowed at a page root (`page.sections[]`)

### section

**Section** (structure). Generic full-width page band with a container. Use to compose custom layouts from blocks and elements.

- Use when: No specialized section fits and you need a custom arrangement of blocks.
- Children: any
- Recommended animations: fade-up, stagger
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  minHeight?: "auto" | "half" | "screen" = "auto";
  verticalAlign?: "start" | "center" | "end" = "start";
}
```

Default props: `{"tone":"default","containerWidth":"default","spacingTop":"lg","spacingBottom":"lg"}`

### hero

**Hero** (marketing). Opening section of a page: headline, supporting copy, calls to action and primary imagery or video.

- Use when: First section of almost every page. Choose fullscreen-image/cinematic for hospitality, editorial for refined brands, split for corporate/SaaS, minimal for portfolios.
- Avoid when: Never use more than one hero per page.
- Variants (`variant`): `editorial` — Large serif headline with offset imagery; magazine-like and refined.; `fullscreen-image` (default) — Edge-to-edge photograph with overlaid text. Best for hospitality and venues.; `fullscreen-video` — Muted looping background video with overlaid text.; `split` — Text on one side, image on the other.; `minimal` — Typography only with generous whitespace.; `centered` — Centered headline with image below.; `carousel` — Crossfading slideshow of images behind the text.; `text-overlay` — Framed image with a text panel overlapping one corner.; `cinematic` — Letterboxed full-bleed media, oversized type at the bottom edge, scroll cue.
- Children: none
- Recommended animations: editorial-reveal, cinematic-reveal, blur-reveal, image-mask, fade
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤100 chars */;
  heading: string /* ≤300 chars */;
  subheading?: string /* ≤800 chars */;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
  image?: MediaRef;
  images?: MediaRef[] /* max 10 */;
  video?: MediaRef;
  overlayOpacity?: number = 0.35 /* 0..0.9 */;
  contentPosition?: "bottom-left" | "center" | "bottom-center" | "left" | "top-left" = "bottom-left";
  height?: "auto" | "tall" | "screen" = "screen";
  imageSide?: "left" | "right" = "right";
  showScrollCue?: boolean = false;
  meta?: {
    label: string;
    value: string;
  }[] /* max 4 */ = [];
}
```

Default props: `{"eyebrow":"Welcome","heading":"A quiet place, *beautifully* considered","subheading":"Introduce the essence of the business in one or two sentences.","buttons":[{"label":"Explore","link":"#about","style":"primary","iconPosition":"end"}],"image":{"src":"https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2400&q=80&auto=format&fit=crop","alt":"Calm lake framed by forested mountains"},"tone":"inverse","spacingTop":"none","spacingBottom":"none"}`

### background-video

**Background video** (media). Full-width section with a muted, looping ambient video behind a headline and actions. Falls back to the poster on mobile and for reduced motion.

- Use when: Mid-page mood break or secondary hero with ambient footage.
- Avoid when: Do not stack with another video section; prefer parallax-band for still imagery.
- Children: none
- Recommended animations: cinematic-reveal, fade, editorial-reveal
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  video?: MediaRef;
  poster: MediaRef;
  eyebrow?: string /* ≤100 chars */;
  heading?: string /* ≤300 chars */;
  subheading?: string /* ≤800 chars */;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
  overlayOpacity?: number = 0.4 /* 0..0.9 */;
  height?: "auto" | "half" | "tall" | "screen" = "tall";
  contentPosition?: "center" | "bottom-left" | "bottom-center" = "center";
  mobilePosterOnly?: boolean = true;
}
```

Default props: `{"tone":"inverse","spacingTop":"none","spacingBottom":"none","poster":{"src":"https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=2400&q=80&auto=format&fit=crop","alt":"Still lake with a timber jetty at sunrise"},"eyebrow":"Slow mornings","heading":"Where the water sets the *pace*","buttons":[{"label":"Plan your stay","link":"/contact","style":"primary","iconPosition":"end"}]}`

### gallery

**Gallery** (media). Collection of photographs as a grid, masonry, editorial layout, carousel or stacked sequence, with an accessible lightbox.

- Use when: Showcasing rooms, venues, food or projects with 4+ photos. Editorial suits hospitality; masonry suits portfolios.
- Avoid when: Fewer than 3 images — use image or content-split.
- Variants (`variant`): `grid` — Even grid with a consistent aspect ratio.; `masonry` — Natural aspect ratios in staggered columns.; `editorial` (default) — Magazine rhythm of large and small images.; `carousel` — Swipeable row of images with arrows.; `stacked` — Full-width images one after another with captions.
- Children: none
- CMS-bindable: list prop `images` (item fields: src, alt, caption, category)
- Recommended animations: stagger, clip-reveal, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  images?: MediaRef[] /* max 60 */;
  columns?: int = 3 /* 1..5 */;
  gap?: "none" | "sm" | "md" | "lg" = "md";
  aspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "4:3";
  lightbox?: boolean = true;
  showCaptions?: boolean = false;
  fromItemField?: string /* ≤60 chars */;
}
```

Default props: `{"eyebrow":"Gallery","heading":"A closer *look*","images":[{"src":"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=2400&q=80&auto=format&fit=crop","alt":"Timber boathouse on a mountain lake","caption":"The boathouse at first light"},{"src":"https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=2400&q=80&auto=format&fit=crop","alt":"Warm timber suite opening onto a garden","caption":"Garden suite"},{"src":"https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=2400&q=80&auto=format&fit=crop","alt":"Hot stone massage with white orchids","caption":"The spa"},{"src"`

### carousel

**Carousel** (media). Swipeable slides of imagery with optional titles and links. Keyboard and touch accessible; never autoplays in the editor.

- Use when: Sequential storytelling with large images where space is limited.
- Avoid when: Critical information — content in later slides is often missed.
- Variants (`variant`): `full` — One large slide at a time.; `peek` (default) — Large slide with neighbours peeking in.; `cards` — Several captioned cards per view.
- Children: none
- CMS-bindable: list prop `slides` (item fields: image, eyebrow, title, text, link)
- Recommended animations: fade-up, fade
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  slides?: {
    image: MediaRef;
    eyebrow?: string /* ≤80 chars */;
    title?: string /* ≤160 chars */;
    text?: string /* ≤400 chars */;
    link?: string | Link;
  }[] /* max 20 */;
  aspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "16:9";
  autoplay?: boolean = false;
  interval?: number = 6 /* 2..20 */;
  showArrows?: boolean = true;
  showDots?: boolean = true;
  loop?: boolean = true;
}
```

Default props: `{"eyebrow":"Moments","heading":"Days that *unfold* slowly","slides":[{"image":{"src":"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=2400&q=80&auto=format&fit=crop","alt":"Wooden boat on a turquoise mountain lake"},"title":"Morning on the water"},{"image":{"src":"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=2400&q=80&auto=format&fit=crop","alt":"Guest receiving an oil massage"},"title":"Afternoon rituals"},{"image":{"src":"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=2400&q=80&auto=format&fit=crop","alt":"Friends toasting under string lights"},"`

### logo-cloud

**Logo cloud** (media). Row of client, partner or press logos — a static grid or a slow continuous marquee. Logos without images render as typeset wordmarks.

- Use when: Social proof: press mentions, clients, certifications, partners.
- Variants (`variant`): `grid` (default) — Evenly spaced logos.; `marquee` — Continuous slow scroll (pauses on hover, static for reduced motion).
- Children: none
- Recommended animations: fade, stagger
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  logos?: {
    name: string /* ≤80 chars */;
    image?: MediaRef;
    link?: string | Link;
  }[] /* max 40 */;
  columns?: int = 6 /* 1..8 */;
  grayscale?: boolean = true;
  speed?: number = 40 /* 10..120 */;
}
```

Default props: `{"eyebrow":"As featured in","align":"center","spacingTop":"md","spacingBottom":"md","logos":[{"name":"Wanderlore"},{"name":"The Quiet Traveller"},{"name":"Atlas Journal"},{"name":"Northfield"},{"name":"Maison Verde"},{"name":"Halcyon"}]}`

### cta

**Call to action** (marketing). Focused closing prompt with a headline, short supporting line and one or two actions.

- Use when: End of most pages to drive the primary conversion (book, enquire, contact).
- Avoid when: More than two per page.
- Variants (`variant`): `banner` — Compact horizontal band: text left, actions right.; `split` — Text beside a photograph.; `centered` (default) — Centered statement with actions below.; `image-background` — Text over a full-bleed photograph.
- Children: none
- Recommended animations: fade-up, editorial-reveal, blur-reveal
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤800 chars */;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
  image?: MediaRef;
  imageSide?: "left" | "right" = "right";
  overlayOpacity?: number = 0.45 /* 0..0.9 */;
}
```

Default props: `{"tone":"surface","eyebrow":"Plan your visit","heading":"Your table by the lake is *waiting*","subheading":"Tell us your dates and we will shape the stay around you.","buttons":[{"label":"Enquire now","link":"/contact","style":"primary","iconPosition":"end"},{"label":"View rooms","link":"/rooms","style":"outline","iconPosition":"end"}],"image":{"src":"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2400&q=80&auto=format&fit=crop","alt":"Starry sky over snow-covered mountains"}}`

### features

**Features** (marketing). Set of features, services or highlights with icons or images — as a grid, list, alternating rows, compact icon row or cards.

- Use when: Services, amenities overview, product features or reasons to choose the business. Alternating suits 3–4 rich items with photos.
- Variants (`variant`): `grid` (default) — Icon, title and text in an airy grid.; `list` — Numbered list with hairline dividers; editorial.; `alternating` — Image and text rows that alternate sides.; `icon-row` — Compact single row of icons with short labels.; `cards` — Image cards with title, text and link.
- Children: none
- CMS-bindable: list prop `items` (item fields: title, text, image, icon, eyebrow, link)
- Recommended animations: stagger, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    icon?: string /* ≤40 chars */;
    image?: MediaRef;
    eyebrow?: string /* ≤60 chars */;
    title: string /* ≤160 chars */;
    text?: string /* ≤800 chars */;
    link?: string | Link;
    linkLabel?: string /* ≤60 chars */;
  }[] /* max 24 */;
  columns?: int = 3 /* 1..4 */;
  iconStyle?: "plain" | "circle" | "square" = "plain";
  imageAspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "4:3";
  numbered?: boolean = false;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
}
```

Default props: `{"eyebrow":"Why guests return","heading":"Considered in every *detail*","items":[{"icon":"mountain","title":"Himalayan views","text":"Every suite faces the water and the snow peaks beyond."},{"icon":"leaf","title":"Garden to table","text":"Our kitchen cooks with what the valley grows each season."},{"icon":"sparkles","title":"Quiet luxury","text":"Thoughtful service that is present when needed and never in the way."}]}`

### stats

**Stats** (marketing). Key figures (years, guests, ratings, outcomes) displayed inline, as cards or as oversized numerals.

- Use when: Credibility through numbers: years in business, capacity, ratings, results.
- Avoid when: Numbers you cannot substantiate.
- Variants (`variant`): `inline` (default) — Row of figures divided by hairlines.; `cards` — Figures in subtle cards with descriptions.; `large` — Oversized display numerals; editorial.
- Children: none
- Recommended animations: stagger, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    value: string /* ≤20 chars */;
    label: string /* ≤80 chars */;
    description?: string /* ≤300 chars */;
    prefix?: string /* ≤4 chars */;
    suffix?: string /* ≤6 chars */;
  }[] /* max 8 */ = [];
  columns?: int = 4 /* 1..6 */;
  dividers?: boolean = true;
}
```

Default props: `{"spacingTop":"md","spacingBottom":"md","items":[{"value":"24","label":"Lakeside suites"},{"value":"1","suffix":"km","label":"Private shoreline"},{"value":"4.9","label":"Average guest rating"},{"value":"2009","label":"Welcoming guests since"}]}`

### testimonials

**Testimonials** (marketing). Guest or client reviews with attribution, optional rating and source — as a carousel, grid or a single large quote.

- Use when: Social proof near decision points (after rooms, before CTA).
- Avoid when: Never invent reviews for real businesses; use placeholders the owner will replace.
- Variants (`variant`): `carousel` (default) — One quote at a time with controls.; `grid` — Several reviews side by side.; `single` — One large editorial quote.
- Children: none
- CMS-bindable: list prop `items` (item fields: quote, author, role, avatar, rating, source)
- Recommended animations: fade-up, text-reveal, stagger
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    quote: string /* ≤1200 chars */;
    author: string /* ≤120 chars */;
    role?: string /* ≤160 chars */;
    avatar?: MediaRef;
    rating?: number /* 0..5 */;
    source?: string /* ≤60 chars */;
  }[] /* max 24 */;
  columns?: int = 3 /* 1..4 */;
  showRating?: boolean = true;
  autoplay?: boolean = false;
}
```

Default props: `{"eyebrow":"Guest words","align":"center","items":[{"quote":"We woke to the mountains turning pink over the lake and never wanted to leave. Every detail felt quietly anticipated.","author":"Clara & Tomás","role":"Stayed in the Lake Suite","rating":5,"source":"Google"},{"quote":"The kind of calm that only comes from people who truly care. The food alone is worth the journey.","author":"Priya Raman","role":"Wellness retreat guest","rating":5}]}`

### faq

**FAQ** (marketing). Frequently asked questions as an accessible accordion (native details/summary). Emits FAQPage structured data for search engines.

- Use when: Practical questions (policies, logistics, pricing). Improves SEO via FAQPage schema.
- Variants (`variant`): `accordion` — Centered list of expandable questions.; `two-column` (default) — Intro and contact prompt on the left, questions on the right.
- Children: none
- CMS-bindable: list prop `items` (item fields: question, answer)
- Recommended animations: fade-up, stagger
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    question: string /* ≤300 chars */;
    answer: string /* ≤3000 chars */;
  }[] /* max 60 */ = [];
  allowMultiple?: boolean = true;
  openFirst?: boolean = false;
  emitSchema?: boolean = true;
  cta?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  };
}
```

Default props: `{"eyebrow":"Good to know","heading":"Questions, *answered*","subheading":"Anything else? Our team replies within a few hours.","cta":{"label":"Contact us","link":"/contact","style":"link","iconPosition":"end"},"items":[{"question":"What time are check-in and check-out?","answer":"Check-in is from 2pm and check-out until 11am. Early arrival and late departure can be arranged on request."},{"question":"Do you arrange airport transfers?","answer":"Yes — private transfers from Pokhara International Airport take around 25 minutes and can be added to any booking."},{"question":"Is breakfast included`

### pricing

**Pricing** (marketing). Plans or packages with price, inclusions and action — as cards or a comparison table.

- Use when: SaaS plans, service tiers, membership levels.
- Avoid when: Hospitality packages — use offers.
- Variants (`variant`): `cards` (default) — Plan cards side by side; one can be highlighted.; `table` — Comparison table of features across plans.
- Children: none
- Recommended animations: stagger, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  plans?: {
    name: string /* ≤80 chars */;
    price: string /* ≤40 chars */;
    period?: string /* ≤40 chars */;
    description?: string /* ≤400 chars */;
    features?: string[] /* max 30 */ = [];
    cta?: {
      label: string /* ≤80 chars */;
      link?: string | Link;
      style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
      icon?: string;
      iconPosition?: "start" | "end" = "end";
    };
    highlighted?: boolean = false;
    badge?: string /* ≤40 chars */;
  }[] /* max 6 */;
  comparisonRows?: {
    label: string /* ≤160 chars */;
    values?: string[] = [];
  }[] /* max 40 */ = [];
  footnote?: string /* ≤400 chars */;
}
```

Default props: `{"eyebrow":"Pricing","heading":"Simple, transparent *plans*","align":"center","plans":[{"name":"Essential","price":"$29","period":"per month","description":"For small teams getting started.","features":["Up to 5 users","Core reporting","Email support"],"cta":{"label":"Start free trial","link":"/contact","style":"outline","iconPosition":"end"},"highlighted":false},{"name":"Growth","price":"$79","period":"per month","description":"Everything a growing team needs.","features":["Up to 25 users","Advanced reporting","Priority support","Integrations"],"cta":{"label":"Start free trial","link":"/conta`

### team

**Team** (marketing). People behind the business with portrait, role, short bio and links.

- Use when: About pages, agencies, consultancies, clinics.
- Variants (`variant`): `grid` (default) — Portrait grid with name and role.; `list` — Rows with portrait, bio and links; suits leadership.
- Children: none
- CMS-bindable: list prop `members` (item fields: name, role, bio, photo)
- Recommended animations: stagger, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  members?: {
    name: string /* ≤120 chars */;
    role?: string /* ≤160 chars */;
    bio?: string /* ≤1200 chars */;
    photo?: MediaRef;
    links?: {
      label: string /* ≤40 chars */;
      url: string /* ≤500 chars */;
    }[] /* max 5 */;
  }[] /* max 60 */;
  columns?: int = 4 /* 1..5 */;
  portraitAspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "4:5";
}
```

Default props: `{"eyebrow":"Our people","heading":"The team","members":[{"name":"Maya Gurung","role":"General Manager","photo":{"src":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80&auto=format&fit=crop","alt":"Portrait of Maya Gurung"},"links":[]},{"name":"Daniel Okafor","role":"Executive Chef","photo":{"src":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop","alt":"Portrait of Daniel Okafor"},"links":[]},{"name":"Sofia Lindqvist","role":"Spa Director","photo":{"src":"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80&a`

### timeline

**Timeline** (marketing). Chronological milestones or process steps with date labels.

- Use when: Company history, wedding-day schedule, onboarding or delivery process.
- Variants (`variant`): `vertical` (default) — Single column with a hairline spine.; `alternating` — Entries alternate either side of the spine.; `steps` — Horizontal numbered steps; suits processes.
- Children: none
- Recommended animations: stagger, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    date?: string /* ≤40 chars */;
    title: string /* ≤160 chars */;
    text?: string /* ≤800 chars */;
    image?: MediaRef;
  }[] /* max 30 */;
}
```

Default props: `{"eyebrow":"Our story","heading":"From a lakeside farmhouse to a *retreat*","items":[{"date":"2009","title":"A family home opens its doors","text":"Six rooms, one kitchen and a garden that ran to the water."},{"date":"2016","title":"The spa and terrace","text":"A wellness pavilion built in local stone and reclaimed timber."},{"date":"2024","title":"A new chapter","text":"Twenty-four suites, a farm-to-table restaurant and a private jetty."}]}`

### comparison-table

**Comparison table** (marketing). Accessible table comparing options (rooms, plans, venues) across attributes. Use "yes"/"no" for check marks.

- Use when: Side-by-side comparison of 2–5 options.
- Children: none
- Recommended animations: fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  columns?: {
    label: string /* ≤80 chars */;
    highlighted?: boolean = false;
  }[] /* max 6 */ = [];
  rows?: {
    label: string /* ≤160 chars */;
    values?: string[] = [];
    note?: string /* ≤200 chars */;
  }[] /* max 60 */ = [];
  caption?: string /* ≤200 chars */;
  stickyHeader?: boolean = true;
}
```

Default props: `{"eyebrow":"Compare","heading":"Find the right *fit*","columns":[{"label":"Garden Room","highlighted":false},{"label":"Lake Suite","highlighted":true},{"label":"Villa","highlighted":false}],"rows":[{"label":"Size","values":["38 m²","62 m²","140 m²"]},{"label":"Guests","values":["2","3","6"]},{"label":"Private terrace","values":["no","yes","yes"]},{"label":"Plunge pool","values":["no","no","yes"]}]}`

### content-split

**Image & text** (marketing). The classic "about" block: photograph beside a heading, body copy, facts and actions. Variants change composition, not content.

- Use when: Introducing the business, a venue, a room type or a service with one strong photograph.
- Variants (`variant`): `standard` (default) — Image and text side by side.; `overlap` — Text panel overlaps a large image.; `collage` — Two offset images beside the text.; `full-bleed` — Image runs to the edge of the screen.
- Children: none
- Recommended animations: fade-up, image-mask, clip-reveal, editorial-reveal
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  body?: string /* ≤5000 chars */;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
  image: MediaRef;
  secondaryImage?: MediaRef;
  imageSide?: "left" | "right" = "left";
  imageAspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "4:5";
  facts?: {
    label: string /* ≤60 chars */;
    value: string /* ≤120 chars */;
  }[] /* max 6 */ = [];
  signature?: string /* ≤120 chars */;
  verticalAlign?: "start" | "center" | "end" = "center";
}
```

Default props: `{"eyebrow":"Our story","heading":"Rooted in the valley, *open* to the world","body":"What began as a family farmhouse on the shore is now a retreat of twenty-four suites, each shaped by local craft and the shifting light on the water.\n\nWe believe in slow mornings, honest food and service that feels like being looked after by friends.","buttons":[{"label":"Discover more","link":"/about","style":"link","iconPosition":"end"}],"image":{"src":"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=2400&q=80&auto=format&fit=crop","alt":"Timber boathouse on a calm mountain lake"},"secondary`

### text-section

**Text section** (marketing). Typography-led section: a large statement, a centered introduction or a two-column heading/body layout.

- Use when: Opening statement after a hero, chapter introductions, philosophy or manifesto copy.
- Variants (`variant`): `statement` — Oversized serif statement; one or two sentences.; `intro` (default) — Heading with a lead paragraph in a narrow measure.; `two-column` — Heading on the left, body on the right.
- Children: none
- Recommended animations: text-reveal, word-reveal, fade-up, blur-reveal
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤600 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  body?: string /* ≤6000 chars */;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
  align?: "left" | "center" = "center";
}
```

Default props: `{"eyebrow":"Welcome","heading":"A retreat on the quiet shore of the lake, where days are measured by *light*, not hours.","body":"Wake to the peaks reflected in still water, spend afternoons between the spa and the garden, and end each day at a table set beside the lake."}`

### benefits

**Benefits** (marketing). Checklist of benefits or inclusions, optionally beside an image — ideal for "what is included" and "why us".

- Use when: Inclusions, perks, membership benefits, reasons to book direct.
- Variants (`variant`): `list` — Two-column checklist under an intro.; `grid` — Benefit tiles with icon, title and text.; `with-image` (default) — Checklist beside a photograph.
- Children: none
- Recommended animations: stagger, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    title: string /* ≤160 chars */;
    text?: string /* ≤500 chars */;
    icon?: string /* ≤40 chars */;
  }[] /* max 24 */ = [];
  image?: MediaRef;
  imageSide?: "left" | "right" = "right";
  columns?: int = 2 /* 1..4 */;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
}
```

Default props: `{"eyebrow":"Included with every stay","heading":"The little things, *taken care of*","items":[{"title":"Seasonal breakfast on the terrace"},{"title":"Sunrise boat ride across the lake"},{"title":"Daily yoga in the garden pavilion"},{"title":"Airport transfers on request"},{"title":"Late check-out when available"},{"title":"High-speed Wi-Fi throughout"}],"image":{"src":"https://images.unsplash.com/photo-1545389336-cf090694435e?w=2400&q=80&auto=format&fit=crop","alt":"Guest practising yoga above a misty valley"}}`

### rooms

**Rooms & suites** (hospitality). Room and suite showcase with photography, key facts (size, guests, bed, view) and price from. Bind to a "rooms" collection to list them automatically.

- Use when: Hotels, resorts, lodges and B&Bs. Bind to the "rooms" collection with map { name: "{{item.name}}", image: "{{item.image}}", price: "{{item.price}}", size: "{{item.size}}", guests: "{{item.guests}}", slug: "{{item.slug}}" }.
- Variants (`variant`): `cards` (default) — Grid of room cards.; `editorial-list` — Large alternating rows with generous imagery; luxury feel.; `carousel` — Swipeable row of rooms.
- Children: none
- CMS-bindable: list prop `items` (item fields: name, image, price, priceSuffix, size, guests, bed, view, summary, slug, href)
- Recommended animations: stagger, fade-up, clip-reveal
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    name: string /* ≤120 chars */;
    image?: MediaRef;
    price?: string /* ≤40 chars */;
    priceSuffix?: string /* ≤40 chars */;
    size?: string /* ≤40 chars */;
    guests?: string /* ≤40 chars */;
    bed?: string /* ≤60 chars */;
    view?: string /* ≤60 chars */;
    summary?: string /* ≤600 chars */;
    features?: string[] /* max 12 */ = [];
    slug?: string /* ≤120 chars */;
    href?: string | Link;
  }[] /* max 40 */;
  columns?: int = 3 /* 1..4 */;
  imageAspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "4:5";
  showPrice?: boolean = true;
  showFacts?: boolean = true;
  ctaLabel?: string = "View room" /* ≤40 chars */;
  collection?: string = "rooms" /* ≤60 chars */;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
}
```

Default props: `{"eyebrow":"Stay","heading":"Rooms & *suites*","subheading":"Twenty-four rooms, each opening to the lake or the garden.","items":[{"name":"Garden Room","image":{"src":"https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=80&auto=format&fit=crop","alt":"Timber garden room with a view to green foliage"},"price":"$240","priceSuffix":"/ night","size":"38 m²","guests":"2 guests","bed":"King bed","features":[],"slug":"garden-room"},{"name":"Lake Suite","image":{"src":"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=80&auto=format&fit=crop","alt":"Suite bed on a`

### amenities

**Amenities** (hospitality). Property amenities and services as an icon grid, image tiles or a compact list.

- Use when: Hotel/venue facilities overview. Use lucide icon names (waves, wifi, utensils, car, flower-2, dumbbell…).
- Variants (`variant`): `icon-grid` (default) — Line icons with labels.; `image-tiles` — Photo tiles with overlaid titles.; `list` — Compact multi-column list.
- Children: none
- CMS-bindable: list prop `items` (item fields: icon, title, text, image)
- Recommended animations: stagger, fade
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    icon?: string /* ≤40 chars */;
    title: string /* ≤120 chars */;
    text?: string /* ≤400 chars */;
    image?: MediaRef;
  }[] /* max 40 */;
  columns?: int = 4 /* 1..6 */;
}
```

Default props: `{"eyebrow":"Amenities","heading":"Everything you need, *nothing* you don’t","items":[{"icon":"waves","title":"Infinity pool"},{"icon":"flower-2","title":"Spa & hammam"},{"icon":"utensils","title":"Lakeside dining"},{"icon":"sailboat","title":"Private jetty"},{"icon":"dumbbell","title":"Fitness studio"},{"icon":"wifi","title":"Fast Wi-Fi"},{"icon":"car","title":"Airport transfers"},{"icon":"baby","title":"Family friendly"}]}`

### offers

**Packages & offers** (hospitality). Special offers and packages with price, inclusions, validity and a booking action.

- Use when: Hotel packages, seasonal offers, wedding packages, spa days.
- Variants (`variant`): `cards` (default) — Offer cards in a grid.; `list` — Wide rows with image, inclusions and price.; `featured` — First offer large, the rest compact.
- Children: none
- CMS-bindable: list prop `items` (item fields: title, image, badge, price, priceNote, description, inclusions, validity)
- Recommended animations: stagger, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    title: string /* ≤160 chars */;
    image?: MediaRef;
    badge?: string /* ≤40 chars */;
    price?: string /* ≤40 chars */;
    priceNote?: string /* ≤80 chars */;
    description?: string /* ≤800 chars */;
    inclusions?: string[] /* max 20 */ = [];
    validity?: string /* ≤120 chars */;
    cta?: {
      label: string /* ≤80 chars */;
      link?: string | Link;
      style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
      icon?: string;
      iconPosition?: "start" | "end" = "end";
    };
  }[] /* max 24 */;
  columns?: int = 3 /* 1..4 */;
  imageAspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "3:2";
}
```

Default props: `{"eyebrow":"Offers","heading":"Reasons to stay *longer*","items":[{"title":"Stay Longer","badge":"Save 20%","image":{"src":"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80&auto=format&fit=crop","alt":"Boat on a turquoise lake"},"price":"From $1,150","priceNote":"for 4 nights","description":"Four nights for the price of three, with breakfast and a sunset cruise.","inclusions":["Daily breakfast","Sunset boat cruise","Late check-out"],"validity":"Valid until 31 March","cta":{"label":"Book this offer","link":"/contact","style":"outline","iconPosition":"end"}},{"title":"Spa`

### dining

**Restaurant & dining** (hospitality). Restaurant or bar introduction: photography, story, highlights (cuisine, dress code) and opening hours, with reservation actions.

- Use when: Hotel restaurants, bars, cafés; pair with menu on a dining page.
- Variants (`variant`): `split` (default) — Image beside text with hours below.; `feature` — Large image with an overlapping information card.
- Children: none
- Recommended animations: fade-up, image-mask, editorial-reveal
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  body?: string /* ≤3000 chars */;
  image: MediaRef;
  secondaryImage?: MediaRef;
  highlights?: {
    label: string /* ≤60 chars */;
    value: string /* ≤160 chars */;
  }[] /* max 6 */ = [];
  hours?: {
    label: string /* ≤60 chars */;
    value: string /* ≤120 chars */;
  }[] /* max 8 */ = [];
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
  imageSide?: "left" | "right" = "left";
}
```

Default props: `{"eyebrow":"Dining","heading":"Lakeside, *seasonal*, unhurried","body":"Our kitchen cooks with what the valley grows — river fish, mountain greens, heritage grains — served on a terrace that hangs over the water.","image":{"src":"https://images.unsplash.com/photo-1559339352-11d035aa65de?w=2400&q=80&auto=format&fit=crop","alt":"Restaurant terrace beside the lake at dusk"},"highlights":[{"label":"Cuisine","value":"Modern Himalayan"},{"label":"Setting","value":"Terrace & fireside lounge"}],"hours":[{"label":"Breakfast","value":"7:00 – 10:30"},{"label":"Lunch","value":"12:30 – 15:00"},{"label":"Di`

### menu

**Food menu** (hospitality). Categorized food and drink menu with descriptions, prices and dietary tags.

- Use when: Restaurants, cafés, bars and hotel dining pages.
- Variants (`variant`): `classic` (default) — Elegant list with dotted leaders to the price.; `grid` — Categories as columns of items.; `tabs` — One category at a time behind tabs.
- Children: none
- Recommended animations: fade-up, stagger
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  categories?: {
    name: string /* ≤80 chars */;
    description?: string /* ≤300 chars */;
    items?: {
      name: string /* ≤120 chars */;
      description?: string /* ≤400 chars */;
      price?: string /* ≤30 chars */;
      tags?: string[] /* max 6 */ = [];
    }[] /* max 60 */ = [];
  }[] /* max 20 */ = [];
  columns?: int = 2 /* 1..2 */;
  note?: string /* ≤400 chars */;
}
```

Default props: `{"eyebrow":"The menu","heading":"From the *valley*","align":"center","categories":[{"name":"To begin","items":[{"name":"Smoked river trout","description":"Timur pepper, pickled radish, buckwheat crisp","price":"14","tags":[]},{"name":"Steamed momo","description":"Hand-folded, wild garlic, tomato achar","price":"11","tags":["V"]}]},{"name":"From the fire","items":[{"name":"Himalayan lamb","description":"Slow-roasted shoulder, mustard greens, gundruk jus","price":"32","tags":[]},{"name":"Heritage grain bowl","description":"Red rice, roasted squash, lentil dal, herbs","price":"22","tags":["VG","G`

### experiences

**Experiences** (hospitality). Activities and experiences (tours, classes, excursions) with photo, duration and price — as cards, a horizontal scroll or a list.

- Use when: Resort activities, tours, workshops, local excursions.
- Variants (`variant`): `cards` (default) — Grid of tall image cards.; `horizontal-scroll` — Cards scroll sideways as the page scrolls (pinned).; `list` — Rows with thumbnail, details and link.
- Children: none
- CMS-bindable: list prop `items` (item fields: title, image, tag, text, duration, price, link)
- Recommended animations: stagger, horizontal-scroll, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    title: string /* ≤160 chars */;
    image?: MediaRef;
    tag?: string /* ≤40 chars */;
    text?: string /* ≤600 chars */;
    duration?: string /* ≤40 chars */;
    price?: string /* ≤40 chars */;
    link?: string | Link;
  }[] /* max 30 */;
  columns?: int = 3 /* 1..4 */;
  imageAspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "3:4";
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
}
```

Default props: `{"eyebrow":"Experiences","heading":"Days worth *remembering*","items":[{"title":"Sunrise at Sarangkot","tag":"Guided","image":{"src":"https://images.unsplash.com/photo-1580424917967-a8867a6e676e?w=1600&q=80&auto=format&fit=crop","alt":"Snow peaks above layered hills at sunrise"},"duration":"4 hours","text":"Watch first light strike the Annapurna range."},{"title":"White-water rafting","tag":"Adventure","image":{"src":"https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1600&q=80&auto=format&fit=crop","alt":"Rafters paddling through white water"},"duration":"Full day","text":"Grade I`

### venues

**Venue spaces** (hospitality). Event spaces with photo, size and capacity per layout (banquet, theatre, cocktail…), plus a capacity comparison table.

- Use when: Wedding venues, conference centres, hotels with event spaces.
- Variants (`variant`): `cards` — Space cards with capacities.; `detailed` (default) — Alternating rows with full capacity breakdown.; `table` — Capacity chart comparing every space.
- Children: none
- CMS-bindable: list prop `items` (item fields: name, image, description, size, capacities, features, link)
- Recommended animations: fade-up, stagger, image-mask
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    name: string /* ≤120 chars */;
    image?: MediaRef;
    description?: string /* ≤1200 chars */;
    size?: string /* ≤40 chars */;
    capacities?: {
      layout: string /* ≤40 chars */;
      guests: string /* ≤20 chars */;
    }[] /* max 8 */ = [];
    features?: string[] /* max 12 */ = [];
    link?: string | Link;
  }[] /* max 20 */;
  showTable?: boolean = true;
  columns?: int = 3 /* 1..4 */;
}
```

Default props: `{"eyebrow":"Spaces","heading":"Rooms to *gather*","items":[{"name":"The Courtyard","image":{"src":"https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=2400&q=80&auto=format&fit=crop","alt":"Garden courtyard set for a ceremony with floral arches"},"size":"600 m²","description":"An open-air courtyard framed by climbing roses and a stone colonnade.","capacities":[{"layout":"Ceremony","guests":"220"},{"layout":"Banquet","guests":"180"},{"layout":"Cocktail","guests":"300"}],"features":["Natural light","Festoon lighting"]},{"name":"The Orangery","image":{"src":"https://images.unsplash.com`

### events

**Events** (hospitality). Upcoming events with dates, times and location. Past events are hidden automatically. Bind to an "events" collection.

- Use when: Event calendars for venues, restaurants and resorts. Dates in ISO format (YYYY-MM-DD). Emits Event structured data.
- Variants (`variant`): `list` (default) — Date-led rows; clean and scannable.; `cards` — Image cards with date badges.
- Children: none
- CMS-bindable: list prop `items` (item fields: title, date, endDate, time, location, category, image, summary, link, slug)
- Recommended animations: stagger, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    title: string /* ≤160 chars */;
    date: string /* ≤40 chars */;
    endDate?: string /* ≤40 chars */;
    time?: string /* ≤60 chars */;
    location?: string /* ≤160 chars */;
    category?: string /* ≤60 chars */;
    image?: MediaRef;
    summary?: string /* ≤800 chars */;
    link?: string | Link;
    slug?: string /* ≤120 chars */;
  }[] /* max 60 */;
  showPast?: boolean = false;
  limit?: int /* 1..60 */;
  columns?: int = 3 /* 1..4 */;
  emptyText?: string = "New dates are announced soon." /* ≤200 chars */;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
}
```

Default props: `{"eyebrow":"What’s on","heading":"Upcoming *events*","items":[{"title":"Full Moon Supper Club","date":"2027-01-14","time":"19:00","location":"Lakeside terrace","category":"Dining","summary":"A five-course dinner by candlelight with live sitar."},{"title":"Himalayan Yoga Week","date":"2027-02-08","endDate":"2027-02-14","location":"Garden pavilion","category":"Wellness","summary":"Seven days of practice, breathwork and nourishing food."}]}`

### attractions

**Nearby attractions** (hospitality). Places to explore nearby with distance or travel time, category and short description.

- Use when: Location pages for hotels, venues and rentals.
- Variants (`variant`): `list` (default) — Two-column list with distances.; `cards` — Image cards.
- Children: none
- CMS-bindable: list prop `items` (item fields: name, distance, category, text, image, link)
- Recommended animations: stagger, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    name: string /* ≤120 chars */;
    distance?: string /* ≤60 chars */;
    category?: string /* ≤60 chars */;
    text?: string /* ≤500 chars */;
    image?: MediaRef;
    link?: string | Link;
  }[] /* max 30 */;
  columns?: int = 2 /* 1..4 */;
}
```

Default props: `{"eyebrow":"The area","heading":"Explore *nearby*","items":[{"name":"World Peace Pagoda","distance":"25 min by boat & trail","category":"Landmark","text":"A white stupa above the lake with sweeping views of the Annapurnas."},{"name":"Sarangkot viewpoint","distance":"35 min drive","category":"Nature","text":"The classic sunrise viewpoint, and the launch site for paragliding."},{"name":"Lakeside old town","distance":"10 min","category":"Culture","text":"Cafés, bookshops and craft stores along the eastern shore."},{"name":"Davis Falls & Gupteshwor Cave","distance":"20 min drive","category":"Natur`

### booking-cta

**Booking bar** (hospitality). Availability search (arrival, departure, guests) that sends visitors to an external booking engine with the dates as URL parameters.

- Use when: Hotels with an external booking engine; place directly after the hero or before the footer.
- Variants (`variant`): `bar` (default) — Slim horizontal bar; works under a hero.; `card` — Boxed form with heading.; `inline` — Heading and text beside the form.
- Children: none
- Recommended animations: fade-up, fade
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤200 chars */;
  text?: string /* ≤500 chars */;
  bookingUrl?: string /* ≤500 chars */;
  arrivalParam?: string = "checkin" /* ≤40 chars */;
  departureParam?: string = "checkout" /* ≤40 chars */;
  guestsParam?: string = "adults" /* ≤40 chars */;
  childrenParam?: string = "children" /* ≤40 chars */;
  showChildren?: boolean = false;
  promoParam?: string /* ≤40 chars */;
  extraParams?: {
    key: string /* ≤40 chars */;
    value: string /* ≤200 chars */;
  }[] /* max 10 */ = [];
  maxGuests?: int = 6 /* 1..30 */;
  defaultNights?: int = 2 /* 1..30 */;
  buttonLabel?: string = "Check availability" /* ≤40 chars */;
  newTab?: boolean = false;
}
```

Default props: `{"spacingTop":"md","spacingBottom":"md","tone":"surface","heading":"Plan your stay","text":"Best rates guaranteed when you book direct."}`

### contact-info

**Contact details** (contact). Phone, email, WhatsApp, address and opening hours pulled live from the site’s business settings, plus optional extra contacts.

- Use when: Contact pages and footers of location-based businesses. Values come from settings.business — do not hard-code them.
- Variants (`variant`): `list` (default) — Labelled rows; pairs well beside a form.; `cards` — One card per contact method.; `split` — Details beside an embedded map.
- Children: none
- Recommended animations: fade-up, stagger
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  showPhone?: boolean = true;
  showEmail?: boolean = true;
  showWhatsapp?: boolean = true;
  showAddress?: boolean = true;
  showHours?: boolean = true;
  showSocial?: boolean = false;
  extra?: {
    label: string /* ≤60 chars */;
    value: string /* ≤200 chars */;
    link?: string /* ≤300 chars */;
  }[] /* max 8 */;
  mapZoom?: int = 14 /* 3..20 */;
}
```

Default props: `{"eyebrow":"Contact","heading":"Get in *touch*"}`

### form

**Form** (forms). Embeds a form built in the Forms module (enquiries, bookings, RSVPs). Validation, conditional fields, spam protection and success messages come from the form definition.

- Use when: Contact, enquiry, booking request and RSVP pages. Requires an existing form id (WebsiteDefinition.forms).
- Variants (`variant`): `stacked` — Heading above a narrow form.; `card` — Form inside a bordered card.; `split-with-text` (default) — Intro text, contact details or an image beside the form.
- Children: none
- Recommended animations: fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  formId?: string = "" /* ≤80 chars */;
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  image?: MediaRef;
  showContactDetails?: boolean = true;
  submitLabel?: string /* ≤60 chars */;
}
```

Default props: `{"eyebrow":"Enquire","heading":"Tell us about your *plans*","subheading":"Share a few details and our team will reply within one working day."}`

### newsletter

**Newsletter** (forms). Email sign-up powered by a form (its email field and consent are used), inline or as a card.

- Use when: Mailing list sign-up near the end of the homepage or blog pages. Needs a form with an email field.
- Variants (`variant`): `inline` (default) — Text left, field and button right.; `card` — Centered card.; `banner` — Full-width band over an image.
- Children: none
- Recommended animations: fade-up, fade
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  formId?: string = "" /* ≤80 chars */;
  eyebrow?: string /* ≤80 chars */;
  heading?: string = "Letters from the lake" /* ≤200 chars */;
  text?: string /* ≤500 chars */;
  image?: MediaRef;
  buttonLabel?: string = "Subscribe" /* ≤40 chars */;
  placeholder?: string = "Your email address" /* ≤80 chars */;
}
```

Default props: `{"tone":"surface","spacingTop":"md","spacingBottom":"md","text":"Seasonal news, offers and the occasional recipe. No more than once a month.","image":{"src":"https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=2400&q=80&auto=format&fit=crop","alt":"Calm lake with a jetty at dawn"}}`

### marquee

**Marquee** (advanced). Continuously scrolling band of words (pure CSS; static for reduced motion).

- Use when: Decorative rhythm between sections on expressive brands.
- Avoid when: Conveying essential information.
- Children: none
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  items?: {
    text: string /* ≤120 chars */;
  }[] /* max 20 */ = [];
  separator?: string = "✦" /* ≤4 chars */;
  speed?: number = 36 /* 8..120 */;
  direction?: "left" | "right" = "left";
  size?: "md" | "lg" | "xl" = "lg";
  italic?: boolean = true;
  pauseOnHover?: boolean = true;
}
```

Default props: `{"spacingTop":"sm","spacingBottom":"sm","items":[{"text":"Weddings"},{"text":"Celebrations"},{"text":"Garden dinners"},{"text":"Corporate retreats"}]}`

### horizontal-scroll

**Horizontal scroll** (advanced). Section that pins while vertical scrolling moves a track of cards sideways. Falls back to a swipeable row without animation.

- Use when: Narrative sequences: a day at the resort, project timelines, collections.
- Avoid when: More than one per page.
- Children: any
- Recommended animations: horizontal-scroll
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  items?: {
    image?: MediaRef;
    eyebrow?: string /* ≤60 chars */;
    title?: string /* ≤160 chars */;
    text?: string /* ≤500 chars */;
    link?: string | Link;
  }[] /* max 20 */;
  cardWidth?: "sm" | "md" | "lg" = "md";
  imageAspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "3:4";
  pin?: boolean = true;
}
```

Default props: `{"eyebrow":"A day here","heading":"From first light to *firelight*","items":[{"eyebrow":"06:00","title":"Sunrise paddle","image":{"src":"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80&auto=format&fit=crop","alt":"Boat on a turquoise lake"}},{"eyebrow":"09:00","title":"Breakfast on the terrace","image":{"src":"https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1600&q=80&auto=format&fit=crop","alt":"Breakfast of eggs and avocado"}},{"eyebrow":"14:00","title":"Spa rituals","image":{"src":"https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1600&q=8`

### sticky-story

**Sticky storytelling** (advanced). Media stays pinned on one side while story steps scroll past; the image changes with each step.

- Use when: Step-by-step stories: the guest journey, a process, a wedding day.
- Children: none
- Recommended animations: fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  steps?: {
    eyebrow?: string /* ≤60 chars */;
    title: string /* ≤200 chars */;
    text?: string /* ≤1500 chars */;
    image?: MediaRef;
  }[] /* max 12 */;
  mediaSide?: "left" | "right" = "left";
  mediaAspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "4:5";
}
```

Default props: `{"eyebrow":"The journey","heading":"How a day *unfolds*","steps":[{"eyebrow":"Arrive","title":"Met at the shore","text":"A wooden boat carries you across the lake to the retreat.","image":{"src":"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=80&auto=format&fit=crop","alt":"Wooden boat on a turquoise lake"}},{"eyebrow":"Settle","title":"A suite above the water","text":"Linen, timber and a terrace facing the peaks.","image":{"src":"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1800&q=80&auto=format&fit=crop","alt":"Bed on a deck overlooking the lake"}},{"`

### parallax-band

**Parallax image band** (advanced). Full-bleed photograph that drifts subtly as you scroll, with an optional overlaid statement.

- Use when: Breathing space between content-heavy sections; one evocative image.
- Children: none
- Recommended animations: fade, blur-reveal
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  image: MediaRef;
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  text?: string /* ≤600 chars */;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 2 */;
  height?: "sm" | "md" | "lg" | "screen" = "lg";
  overlayOpacity?: number = 0.3 /* 0..0.9 */;
  intensity?: "subtle" | "medium" | "strong" = "subtle";
}
```

Default props: `{"tone":"inverse","spacingTop":"none","spacingBottom":"none","image":{"src":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=80&auto=format&fit=crop","alt":"Mountain peaks above a sea of clouds at sunrise"},"heading":"Above the clouds, *below* the peaks"}`

### global-section

**Global section** (advanced). Places a reusable global section (edited once, shown everywhere). The node’s `ref` points at WebsiteDefinition.globalSections[].id.

- Use when: Repeating the same CTA, newsletter or booking bar across pages — set node.ref to the global section id.
- Children: none
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  label?: string /* ≤120 chars */;
}
```

### collection-list

**Collection list** (collection). Lists items from a CMS collection (articles, case studies, properties, projects) as cards or a list, each linking to its detail page.

- Use when: Blogs, case studies, portfolios, property listings, team directories — any CMS collection.
- Variants (`variant`): `grid` (default) — Image cards in a grid.; `list` — Rows with thumbnail, title, excerpt and meta.; `minimal` — Text-only list with hairlines; suits journals and press.; `featured` — First item large, the rest in a grid.
- Children: none
- CMS-bindable: list prop `items` (item fields: title, image, text, meta, tag, date, href, slug)
- Recommended animations: stagger, fade-up
- Style keys: padding, margin, background, backgroundImage, color, minHeight, border, textAlign

```ts
props: {
  tone?: "default" | "surface" | "surface-alt" | "inverse" | "primary" | "transparent" = "default";
  containerWidth?: "narrow" | "default" | "wide" | "full" = "default";
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl" = "lg";
  eyebrow?: string /* ≤80 chars */;
  heading?: string /* ≤300 chars */;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  subheading?: string /* ≤1200 chars */;
  align?: "left" | "center" | "right" = "left";
  collection?: string /* ≤80 chars */;
  items?: {
    title: string /* ≤200 chars */;
    image?: MediaRef;
    text?: string /* ≤800 chars */;
    meta?: string /* ≤120 chars */;
    tag?: string /* ≤60 chars */;
    date?: string /* ≤40 chars */;
    href?: string | Link;
    slug?: string /* ≤160 chars */;
  }[] /* max 200 */;
  columns?: int = 3 /* 1..4 */;
  imageAspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "3:2";
  limit?: int /* 1..200 */;
  linkLabel?: string = "Read more" /* ≤40 chars */;
  emptyText?: string = "Nothing here yet — check back soon." /* ≤200 chars */;
  excludeCurrent?: boolean = true;
  buttons?: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 3 */;
}
```

Example:

```json
{"type":"collection-list","variant":"grid","props":{"heading":"Case studies","collection":"case-studies"}}
```

## Blocks — composites placed inside sections/containers

### container

**Container** (structure). Groups children with optional background, padding and max width.

- Children: any
- Style keys: padding, margin, gap, background, backgroundImage, color, borderRadius, border, boxShadow, maxWidth, minHeight, textAlign, display, flexDirection, alignItems, justifyContent

```ts
props: {
  width?: "narrow" | "default" | "wide" | "full" | "auto" = "auto";
  tag?: "div" | "article" | "aside" | "header" | "footer" | "nav" = "div";
}
```

### grid

**Grid** (structure). Responsive grid. Columns collapse automatically on tablet and mobile.

- Children: any
- Recommended animations: stagger
- Style keys: padding, margin, gap, background, color, borderRadius, border, boxShadow, maxWidth, textAlign

```ts
props: {
  columns?: int = 3 /* 1..6 */;
  tabletColumns?: int = 2 /* 1..4 */;
  mobileColumns?: int = 1 /* 1..2 */;
  gap?: "none" | "sm" | "md" | "lg" | "xl" = "md";
  alignItems?: "start" | "center" | "end" | "stretch" = "stretch";
}
```

### columns

**Columns** (structure). Two or three columns with a chosen ratio; stacks on mobile.

- Children: any, min 2
- Style keys: padding, margin, gap, background, color, borderRadius, border, boxShadow, maxWidth, textAlign

```ts
props: {
  ratio?: "1:1" | "1:2" | "2:1" | "1:1:1" | "5:7" | "7:5" = "1:1";
  gap?: "sm" | "md" | "lg" | "xl" = "lg";
  alignItems?: "start" | "center" | "end" | "stretch" = "center";
  reverseOnMobile?: boolean = false;
}
```

### stack

**Stack** (structure). Vertical or horizontal stack of children with consistent spacing.

- Children: any
- Style keys: padding, margin, gap, background, color, borderRadius, border, boxShadow, maxWidth, textAlign

```ts
props: {
  direction?: "vertical" | "horizontal" = "vertical";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" = "md";
  align?: "start" | "center" | "end" | "stretch" = "stretch";
  justify?: "start" | "center" | "end" | "between" = "start";
  wrap?: boolean = false;
}
```

### video

**Video** (media). Embedded video from an uploaded file, YouTube or Vimeo. Third-party players load only after the visitor clicks the poster (privacy + performance).

- Use when: Showing a property film, interview or product demo.
- Avoid when: For ambient looping footage behind text use background-video.
- Children: none
- Recommended animations: fade, scale-in, clip-reveal
- Style keys: margin, maxWidth

```ts
props: {
  source?: "file" | "youtube" | "vimeo" = "youtube";
  url?: string /* ≤500 chars */;
  video?: MediaRef;
  poster?: MediaRef;
  title?: string = "Video" /* ≤200 chars */;
  aspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "16:9";
  autoplay?: boolean = false;
  loop?: boolean = false;
  muted?: boolean = false;
  controls?: boolean = true;
  caption?: string /* ≤300 chars */;
  rounded?: "none" | "sm" | "md" | "lg" = "sm";
}
```

Default props: `{"source":"youtube","title":"Property film","poster":{"src":"https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2400&q=80&auto=format&fit=crop","alt":"Lake framed by forested mountains at dawn"}}`

### map

**Map** (contact). Location map (Google Maps or OpenStreetMap). Shows a lightweight placeholder until the visitor chooses to load it — no third-party requests before consent.

- Use when: Contact and location pages. Place inside a section or columns.
- Children: none
- Recommended animations: fade
- Style keys: margin, maxWidth

```ts
props: {
  provider?: "google" | "osm" = "google";
  query?: string = "{{business.address}}" /* ≤300 chars */;
  lat?: number /* -90..90 */;
  lng?: number /* -180..180 */;
  zoom?: int = 14 /* 3..20 */;
  height?: "sm" | "md" | "lg" = "md";
  facade?: boolean = true;
  facadeImage?: MediaRef;
  title?: string = "Map showing our location" /* ≤120 chars */;
  rounded?: "none" | "sm" | "md" | "lg" = "sm";
}
```

Default props: `{"query":"{{business.address}}"}`

### tabs

**Tabs** (advanced). Content split into keyboard-accessible tabs. Each tab has text/image content, or child blocks (child N becomes panel N).

- Use when: Parallel options (seasons, menus, packages) where only one needs to be visible at a time.
- Children: any
- Recommended animations: fade-up
- Style keys: padding, margin, gap, background, color, borderRadius, border, boxShadow, maxWidth, textAlign

```ts
props: {
  items?: {
    label: string /* ≤60 chars */;
    heading?: string /* ≤200 chars */;
    text?: string /* ≤3000 chars */;
    image?: MediaRef;
    buttons?: {
      label: string /* ≤80 chars */;
      link?: string | Link;
      style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
      icon?: string;
      iconPosition?: "start" | "end" = "end";
    }[] /* max 2 */;
  }[] /* max 10 */;
  style?: "underline" | "pills" = "underline";
  align?: "left" | "center" = "left";
}
```

Default props: `{"items":[{"label":"Spring","heading":"Blossom and clear peaks","text":"March to May brings rhododendron in bloom and the clearest mountain mornings.","buttons":[]},{"label":"Monsoon","heading":"Green and dramatic","text":"June to August: lush valleys, waterfalls and quiet, reflective days.","buttons":[]},{"label":"Autumn","heading":"Festival season","text":"September to November — crisp air, golden light and Dashain celebrations.","buttons":[]}]}`

### accordion

**Accordion** (advanced). Expandable panels using native details/summary — accessible and works without JavaScript.

- Use when: Policies, details and secondary information inside a custom section.
- Avoid when: For page-level FAQs use the faq section (adds structured data).
- Children: none
- Recommended animations: fade-up
- Style keys: padding, margin, gap, background, color, borderRadius, border, boxShadow, maxWidth, textAlign

```ts
props: {
  items?: {
    title: string /* ≤200 chars */;
    content: string /* ≤4000 chars */;
  }[] /* max 40 */ = [];
  allowMultiple?: boolean = true;
  openFirst?: boolean = false;
  style?: "lines" | "boxed" = "lines";
}
```

Default props: `{"items":[{"title":"Cancellation policy","content":"Free cancellation up to 14 days before arrival."},{"title":"Children & extra beds","content":"Children of all ages are welcome; extra beds are available in suites."}]}`

### modal

**Modal** (advanced). Button that opens an accessible dialog containing text or child blocks (e.g. a form or video).

- Use when: Secondary content on demand: terms, floor plans, booking forms, videos.
- Children: any
- Style keys: padding, margin, gap, background, color, borderRadius, border, boxShadow, maxWidth, textAlign

```ts
props: {
  triggerLabel?: string = "Open" /* ≤60 chars */;
  triggerStyle?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
  title?: string /* ≤200 chars */;
  text?: string /* ≤4000 chars */;
  size?: "sm" | "md" | "lg" = "md";
}
```

Default props: `{"triggerLabel":"View details","triggerStyle":"outline","title":"Details","text":"Add content here or drop blocks inside the modal."}`

### drawer

**Drawer** (advanced). Button that slides in a side panel with text or child blocks.

- Use when: Filters, booking details or long supporting text without leaving the page.
- Children: any
- Style keys: padding, margin, gap, background, color, borderRadius, border, boxShadow, maxWidth, textAlign

```ts
props: {
  triggerLabel?: string = "Open" /* ≤60 chars */;
  triggerStyle?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
  title?: string /* ≤200 chars */;
  text?: string /* ≤4000 chars */;
  side?: "left" | "right" = "right";
}
```

Default props: `{"triggerLabel":"Open panel","triggerStyle":"outline","title":"More information","text":"Add content or drop blocks inside the drawer."}`

### before-after

**Before / after** (advanced). Draggable comparison slider between two images (keyboard accessible).

- Use when: Renovations, restorations, design transformations.
- Children: none
- Style keys: margin, maxWidth

```ts
props: {
  before: MediaRef;
  after: MediaRef;
  beforeLabel?: string = "Before" /* ≤40 chars */;
  afterLabel?: string = "After" /* ≤40 chars */;
  start?: number = 50 /* 0..100 */;
  aspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "16:9";
}
```

Default props: `{"before":{"src":"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=2400&q=80&auto=format&fit=crop","alt":"Mist over forested hills"},"after":{"src":"https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2400&q=80&auto=format&fit=crop","alt":"Clear lake view framed by mountains"}}`

### embed

**Embed** (advanced). Third-party widget via iframe URL, sanitized HTML, or a sandboxed HTML snippet. Requires the code.manage permission to edit.

- Use when: Booking engines, calendars, review widgets that provide an embed code.
- Avoid when: Anything achievable with a native component.
- Children: none
- Style keys: margin, maxWidth

```ts
props: {
  mode?: "iframe" | "html" | "sandbox" = "iframe";
  url?: string /* ≤1000 chars */;
  html?: string /* ≤50000 chars */;
  title?: string = "Embedded content" /* ≤120 chars */;
  aspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "16:9";
  height?: int /* 80..2000 */;
  allow?: string /* ≤200 chars */;
}
```

Default props: `{"mode":"iframe","title":"Embedded content"}`

## Elements — leaf primitives placed inside sections/containers/blocks

### spacer

**Spacer** (structure). Vertical whitespace.

- Children: none
- Style keys: height

```ts
props: {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" = "md";
}
```

### divider

**Divider** (structure). Horizontal rule, optionally with an ornament or label.

- Children: none
- Style keys: margin, color, maxWidth

```ts
props: {
  style?: "line" | "short" | "ornament" | "label" = "line";
  label?: string;
}
```

### heading

**Heading** (content). Heading text (h1–h6). Supports *italic emphasis* with asterisks for editorial styling.

- Children: none
- Recommended animations: fade-up, reveal, word-reveal, text-reveal
- Style keys: margin, padding, color, fontSize, fontWeight, lineHeight, letterSpacing, textTransform, textAlign, maxWidth, fontFamily

```ts
props: {
  text: string /* ≤400 chars */;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  size?: "auto" | "sm" | "md" | "lg" | "xl" | "display" = "auto";
  font?: "heading" | "body" | "accent" = "heading";
}
```

Default props: `{"text":"A considered heading","level":"h2"}`

### text

**Paragraph** (content). Plain paragraph text.

- Children: none
- Recommended animations: fade-up, fade
- Style keys: margin, padding, color, fontSize, fontWeight, lineHeight, letterSpacing, textTransform, textAlign, maxWidth, fontFamily

```ts
props: {
  text: string /* ≤5000 chars */;
  size?: "sm" | "base" | "lg" | "xl" = "base";
  muted?: boolean = false;
  eyebrow?: boolean = false;
}
```

Default props: `{"text":"Write something meaningful here."}`

### rich-text

**Rich text** (content). Formatted long-form content (sanitized HTML: headings, lists, links, emphasis, quotes).

- Children: none
- Style keys: margin, padding, color, fontSize, fontWeight, lineHeight, letterSpacing, textTransform, textAlign, maxWidth, fontFamily

```ts
props: {
  html: string /* ≤200000 chars */;
  measure?: "narrow" | "default" | "full" = "default";
  dropCap?: boolean = false;
}
```

Default props: `{"html":"<p>Start writing…</p>"}`

### button

**Button** (content). Call-to-action button or link.

- Children: none
- Style keys: margin

```ts
props: {
  label: string /* ≤80 chars */;
  link?: string | Link;
  style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
  icon?: string;
  iconPosition?: "start" | "end" = "end";
  size?: "sm" | "md" | "lg" = "md";
  fullWidth?: boolean = false;
}
```

Default props: `{"label":"Get in touch","link":"#contact","style":"primary"}`

### button-group

**Button group** (content). Row of buttons.

- Children: none
- Style keys: margin

```ts
props: {
  buttons: {
    label: string /* ≤80 chars */;
    link?: string | Link;
    style?: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
    icon?: string;
    iconPosition?: "start" | "end" = "end";
  }[] /* max 4 */;
  align?: "left" | "center" | "right" = "left";
}
```

Default props: `{"buttons":[{"label":"Book now","link":"#contact","style":"primary","iconPosition":"end"},{"label":"Explore","link":"#","style":"outline","iconPosition":"end"}]}`

### icon

**Icon** (content). Line icon from the icon set.

- Children: none
- Style keys: color, margin

```ts
props: {
  name?: string = "sparkle";
  size?: number = 28 /* 12..128 */;
  strokeWidth?: number = 1.25 /* 0.5..3 */;
  label?: string;
}
```

### badge

**Badge** (content). Small label or pill.

- Children: none
- Style keys: margin, padding, color, fontSize, fontWeight, lineHeight, letterSpacing, textTransform, textAlign, maxWidth, fontFamily

```ts
props: {
  text: string /* ≤60 chars */;
  style?: "subtle" | "outline" | "solid" = "subtle";
}
```

Default props: `{"text":"New"}`

### quote

**Quote** (content). Pull quote with optional attribution.

- Children: none
- Recommended animations: text-reveal, fade-up
- Style keys: margin, padding, color, fontSize, fontWeight, lineHeight, letterSpacing, textTransform, textAlign, maxWidth, fontFamily

```ts
props: {
  text: string /* ≤1200 chars */;
  author?: string;
  role?: string;
  size?: "md" | "lg" | "xl" = "lg";
}
```

Default props: `{"text":"An unforgettable stay — every detail was considered.","author":"Guest review"}`

### list

**List** (content). Bulleted, numbered, check or icon list.

- Children: none
- Recommended animations: stagger
- Style keys: margin, padding, color, fontSize, fontWeight, lineHeight, letterSpacing, textTransform, textAlign, maxWidth, fontFamily

```ts
props: {
  items: {
    text: string;
    icon?: string;
  }[] /* max 50 */;
  style?: "bullet" | "number" | "check" | "icon" | "none" = "check";
  columns?: int = 1 /* 1..3 */;
}
```

Default props: `{"items":[{"text":"First point"},{"text":"Second point"},{"text":"Third point"}]}`

### image

**Image** (media). A single responsive photograph with optional caption and link. Lazy-loaded with width/height to prevent layout shift.

- Use when: A standalone photograph inside a custom section or column. Always provide descriptive alt text.
- Avoid when: For several images use gallery; for full-bleed mood use parallax-band.
- Children: none
- Recommended animations: clip-reveal, image-mask, fade, scale-in, parallax
- Style keys: margin, maxWidth, width

```ts
props: {
  image: MediaRef;
  aspect?: "auto" | "1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "3:4" | "2:3" | "4:5" = "auto";
  fit?: "cover" | "contain" = "cover";
  rounded?: "none" | "sm" | "md" | "lg" | "full" = "sm";
  caption?: string /* ≤300 chars */;
  link?: string | Link;
  priority?: boolean = false;
  frame?: "none" | "border" | "inset" = "none";
}
```

Default props: `{"image":{"src":"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=2400&q=80&auto=format&fit=crop","alt":"Bed on a timber deck overlooking a misty lake and mountains","width":2400,"height":1600},"aspect":"4:3"}`

### social-links

**Social links** (contact). Icons or labelled links to the profiles configured in site settings.

- Use when: Inside contact sections or custom footers. Links come from settings.social.
- Children: none
- Style keys: margin, color

```ts
props: {
  style?: "icons" | "labels" | "pills" = "icons";
  size?: "sm" | "md" | "lg" = "md";
  align?: "left" | "center" | "right" = "left";
  networks?: ("facebook" | "instagram" | "tiktok" | "linkedin" | "youtube" | "x" | "pinterest" | "whatsapp" | "messenger" | "telegram" | "tripadvisor" | "github" | "threads" | "custom")[] = [];
  label?: string /* ≤80 chars */;
}
```

### animated-text

**Animated text** (advanced). Heading with a rotating word ("Celebrate your *wedding / anniversary / birthday*"). Screen readers hear the full sentence.

- Use when: Playful hero or section headings for events and creative brands.
- Avoid when: Formal corporate or legal contexts.
- Children: none
- Style keys: margin, padding, color, fontSize, fontWeight, lineHeight, letterSpacing, textTransform, textAlign, maxWidth, fontFamily

```ts
props: {
  prefix?: string = "Celebrate your" /* ≤200 chars */;
  words?: {
    text: string /* ≤60 chars */;
  }[] /* min 1, max 10 */ = [{"text":"wedding"},{"text":"anniversary"},{"text":"milestone"}];
  suffix?: string /* ≤200 chars */;
  interval?: number = 2.6 /* 1..10 */;
  effect?: "slide" | "fade" | "type" = "slide";
  level?: "h1" | "h2" | "h3" | "h4" | "p" = "h2";
  size?: "md" | "lg" | "xl" | "display" = "xl";
  italicWords?: boolean = true;
}
```
