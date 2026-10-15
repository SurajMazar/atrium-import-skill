# Atrium schemas

Generated from `@atrium/schema` of Atrium `e00b89c` by `tools/build.mjs`. Do not edit by hand.
`?` = optional, `= x` = default (omit defaulted keys unless you need another value).
`R<T>` = `T` or a responsive object `{ "base"?: T, "laptop"?: T, "tablet"?: T, "mobile"?: T }`.

## Site settings

Used in `site.json` → `settings`.

```ts
{
  name: string /* ≥1 chars */;
  business: {
    name: string;
    legalName?: string;
    type?: string;
    tagline?: string;
    description?: string;
    phone?: string;
    mobile?: string;
    whatsapp?: string;
    email?: string;
    address?: {
      street?: string;
      locality?: string;
      region?: string;
      postalCode?: string;
      country?: string;
      formatted?: string;
    } = {};
    geo?: {
      lat: number;
      lng: number;
    };
    mapsUrl?: string /* ≤8192 chars */;
    openingHours?: {
      days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
      opens: string;
      closes: string;
      label?: string;
    }[] = [];
    contactPerson?: string;
    priceRange?: string;
    foundedYear?: int /* -9007199254740991..9007199254740991 */;
  };
  social?: {
    id: string;
    network: "facebook" | "instagram" | "tiktok" | "linkedin" | "youtube" | "x" | "pinterest" | "whatsapp" | "messenger" | "telegram" | "tripadvisor" | "github" | "threads" | "custom";
    url: string /* ≤8192 chars */;
    label?: string;
    icon?: string;
    visible?: boolean = true;
    newTab?: boolean = true;
  }[];
  branding?: {
    logo?: string /* ≤8192 chars */;
    logoInverse?: string /* ≤8192 chars */;
    logoWidth?: number;
    favicon?: string /* ≤8192 chars */;
    wordmark?: string;
  };
  seo: {
    siteTitle: string;
    titleTemplate?: string = "%s — {site}";
    description?: string = "";
    ogImage?: string /* ≤8192 chars */;
    robots?: {
      index?: boolean = true;
      follow?: boolean = true;
    } = {"index":true,"follow":true};
    canonicalBase?: string /* ≤8192 chars */;
    twitterHandle?: string;
    structuredData?: {
      type: "Organization" | "LocalBusiness" | "Hotel" | "Resort" | "Restaurant" | "EventVenue" | "Event" | "Article" | "FAQPage" | "BreadcrumbList" | "Product" | "WebSite" | "Service" | "Custom";
      auto?: boolean = true;
      data?: Record<string, any>;
    }[] = [];
    verification?: {
      google?: string;
      bing?: string;
    } = {};
  };
  localization?: {
    defaultLocale?: string = "en";
    locales?: string[] = ["en"];
    strategy?: "prefix-except-default" | "prefix-all" = "prefix-except-default";
  } = {"defaultLocale":"en","locales":["en"],"strategy":"prefix-except-default"};
  scripts?: {
    id: string;
    name: string;
    placement: "head" | "body-start" | "body-end";
    src?: string /* ≤8192 chars */;
    code?: string /* ≤50000 chars */;
    consentCategory?: "necessary" | "analytics" | "marketing" | "preferences" = "necessary";
    enabled?: boolean = true;
    async?: boolean;
    defer?: boolean;
  }[];
  cookieConsent?: {
    enabled?: boolean = false;
    title?: string = "We value your privacy";
    message?: string = "We use cookies to improve your experience and measure site performance.";
    policyUrl?: string /* ≤8192 chars */;
    categories?: ("necessary" | "analytics" | "marketing" | "preferences")[] = ["necessary","analytics","marketing"];
    position?: "bottom" | "bottom-left" | "bottom-right" = "bottom-left";
  };
  analytics?: {
    builtIn?: boolean = true;
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    metaPixelId?: string;
  } = {"builtIn":true};
  performance?: {
    cachePages?: boolean = true;
    progressBar?: boolean = true;
  } = {"cachePages":true,"progressBar":true};
  variables?: Record<string, string> = {};
  notFoundPageId?: string;
}
```

## Theme tokens

Used in `theme.json`.

```ts
{
  name?: string = "Custom";
  colorScheme?: "light" | "dark" = "light";
  colors: {
    primary: string /* ≤64 chars; ≥1 chars */;
    primaryContrast: string /* ≤64 chars; ≥1 chars */;
    secondary: string /* ≤64 chars; ≥1 chars */;
    accent: string /* ≤64 chars; ≥1 chars */;
    background: string /* ≤64 chars; ≥1 chars */;
    surface: string /* ≤64 chars; ≥1 chars */;
    surfaceAlt: string /* ≤64 chars; ≥1 chars */;
    text: string /* ≤64 chars; ≥1 chars */;
    muted: string /* ≤64 chars; ≥1 chars */;
    border: string /* ≤64 chars; ≥1 chars */;
    inverse: string /* ≤64 chars; ≥1 chars */;
    inverseText: string /* ≤64 chars; ≥1 chars */;
    success: string /* ≤64 chars; ≥1 chars */;
    warning: string /* ≤64 chars; ≥1 chars */;
    danger: string /* ≤64 chars; ≥1 chars */;
    [key: string]: string;
  };
  typography: {
    heading: {
      family: string;
      source?: "google" | "local" | "custom" | "system" = "google";
      weights?: int[] = [400,700];
      italic?: boolean = false;
      files?: {
        url: string;
        weight: string;
        style?: "normal" | "italic" = "normal";
        format?: string;
      }[];
      fallback?: string = "system-ui, sans-serif";
      variable?: boolean;
    };
    body: {
      family: string;
      source?: "google" | "local" | "custom" | "system" = "google";
      weights?: int[] = [400,700];
      italic?: boolean = false;
      files?: {
        url: string;
        weight: string;
        style?: "normal" | "italic" = "normal";
        format?: string;
      }[];
      fallback?: string = "system-ui, sans-serif";
      variable?: boolean;
    };
    accent?: {
      family: string;
      source?: "google" | "local" | "custom" | "system" = "google";
      weights?: int[] = [400,700];
      italic?: boolean = false;
      files?: {
        url: string;
        weight: string;
        style?: "normal" | "italic" = "normal";
        format?: string;
      }[];
      fallback?: string = "system-ui, sans-serif";
      variable?: boolean;
    };
    baseSize?: number = 17 /* 12..22 */;
    scale?: number = 1.25 /* 1.05..1.8 */;
    headingWeight?: int = 500 /* -9007199254740991..9007199254740991 */;
    bodyWeight?: int = 400 /* -9007199254740991..9007199254740991 */;
    headingLineHeight?: number = 1.1;
    bodyLineHeight?: number = 1.6;
    headingLetterSpacing?: string = "-0.01em";
    headingTransform?: "none" | "uppercase" = "none";
    eyebrowLetterSpacing?: string = "0.16em";
  };
  spacing: {
    unit?: number = 4;
    sectionY?: "compact" | "regular" | "airy" = "regular";
  };
  radius: {
    none?: string = "0";
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full?: string = "9999px";
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    [key: string]: string;
  };
  borders: {
    width?: string = "1px";
    style?: "solid" | "dashed" = "solid";
  };
  containerWidths: {
    narrow: string;
    default: string;
    wide: string;
    full?: string = "100%";
  };
  buttons?: {
    radius?: string;
    textTransform?: "none" | "uppercase" = "none";
    letterSpacing?: string = "0";
    paddingY?: string = "0.85em";
    paddingX?: string = "1.6em";
    weight?: int = 500 /* -9007199254740991..9007199254740991 */;
  } = {"textTransform":"none","letterSpacing":"0","paddingY":"0.85em","paddingX":"1.6em","weight":500};
  motion?: {
    intensity?: "none" | "subtle" | "moderate" | "expressive" = "subtle";
    ease?: string = "power3.out";
    duration?: number = 0.9;
  } = {"intensity":"subtle","ease":"power3.out","duration":0.9};
}
```

## Navigation

Used in `site.json` → `navigation` (menus referenced by `site-header` / `site-footer`).

```ts
{
  menus: Record<string, {
    id: string;
    label: string /* ≤80 chars; ≥1 chars */;
    link?: string | Link;
    description?: string /* ≤200 chars */;
    icon?: string;
    image?: string /* ≤8192 chars */;
    mega?: boolean;
    highlight?: boolean;
    children?: {
      id: string;
      label: string /* ≤80 chars; ≥1 chars */;
      link?: string | Link;
      description?: string /* ≤200 chars */;
      icon?: string;
      image?: string /* ≤8192 chars */;
      mega?: boolean;
      highlight?: boolean;
      children?: __schema0[];
    }[];
  }[]>;
}
```

## Page

Used in `pages/*.json` (plus `sections: Node[]`).

```ts
{
  id?: string;
  title: string /* ≤200 chars; ≥1 chars */;
  slug: string /* ≤200 chars; pattern ^$|^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$ */;
  kind?: "page" | "collection-template" | "not-found" = "page";
  collection?: string;
  status?: "draft" | "published" | "scheduled" | "archived" = "draft";
  publishAt?: string /* pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z))$ */;
  isHomepage?: boolean = false;
  seo?: {
    title?: string /* ≤200 chars */;
    description?: string /* ≤400 chars */;
    keywords?: string[];
    canonical?: string /* ≤8192 chars */;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string /* ≤8192 chars */;
    twitterCard?: "summary" | "summary_large_image";
    robots?: {
      index?: boolean = true;
      follow?: boolean = true;
    };
    structuredData?: {
      type: "Organization" | "LocalBusiness" | "Hotel" | "Resort" | "Restaurant" | "EventVenue" | "Event" | "Article" | "FAQPage" | "BreadcrumbList" | "Product" | "WebSite" | "Service" | "Custom";
      auto?: boolean = true;
      data?: Record<string, any>;
    }[];
    excludeFromSitemap?: boolean;
  };
  layout?: {
    header?: "default" | "transparent" | "hidden" = "default";
    footer?: "default" | "hidden" = "default";
  } = {"header":"default","footer":"default"};
  customCss?: string /* ≤50000 chars */;
  scripts?: {
    head?: string /* ≤50000 chars */;
    body?: string /* ≤50000 chars */;
  };
  translations?: Record<string, {
    title?: string;
    slug?: string;
    seo?: {
      title?: string /* ≤200 chars */;
      description?: string /* ≤400 chars */;
      keywords?: string[];
      canonical?: string /* ≤8192 chars */;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string /* ≤8192 chars */;
      twitterCard?: "summary" | "summary_large_image";
      robots?: {
        index?: boolean = true;
        follow?: boolean = true;
      };
      structuredData?: {
        type: "Organization" | "LocalBusiness" | "Hotel" | "Resort" | "Restaurant" | "EventVenue" | "Event" | "Article" | "FAQPage" | "BreadcrumbList" | "Product" | "WebSite" | "Service" | "Custom";
        auto?: boolean = true;
        data?: Record<string, any>;
      }[];
      excludeFromSitemap?: boolean;
    };
  }>;
}
```

## Page SEO

Used in `page.seo`.

```ts
{
  title?: string /* ≤200 chars */;
  description?: string /* ≤400 chars */;
  keywords?: string[];
  canonical?: string /* ≤8192 chars */;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string /* ≤8192 chars */;
  twitterCard?: "summary" | "summary_large_image";
  robots?: {
    index?: boolean = true;
    follow?: boolean = true;
  };
  structuredData?: {
    type: "Organization" | "LocalBusiness" | "Hotel" | "Resort" | "Restaurant" | "EventVenue" | "Event" | "Article" | "FAQPage" | "BreadcrumbList" | "Product" | "WebSite" | "Service" | "Custom";
    auto?: boolean = true;
    data?: Record<string, any>;
  }[];
  excludeFromSitemap?: boolean;
}
```

## MediaRef

Used in every image/video prop.

```ts
{
  src: string /* ≤8192 chars */;
  mediaId?: string;
  alt?: string;
  width?: number;
  height?: number;
  focalPoint?: {
    x: number /* 0..1 */;
    y: number /* 0..1 */;
  };
  blurDataUrl?: string /* ≤8192 chars */;
  mimeType?: string;
  poster?: string /* ≤8192 chars */;
}
```

## Link

Used in every link prop.

```ts
string | Link
```

## Node style

Used in node.style. `R<T>` = a plain value or a responsive object `{ "base"?: T, "laptop"?: T, "tablet"?: T, "mobile"?: T }` (max-widths: laptop 1279px, tablet 991px, mobile 767px; smaller breakpoints inherit from larger ones).

```ts
{
  padding?: R<string>;
  margin?: R<string>;
  gap?: R<string>;
  width?: R<string>;
  maxWidth?: R<string>;
  minHeight?: R<string>;
  height?: R<string>;
  aspectRatio?: R<string>;
  display?: R<"block" | "flex" | "grid" | "inline-flex" | "none">;
  flexDirection?: R<"row" | "column" | "row-reverse" | "column-reverse">;
  flexWrap?: R<"wrap" | "nowrap">;
  alignItems?: R<"start" | "center" | "end" | "stretch" | "baseline">;
  justifyContent?: R<"start" | "center" | "end" | "between" | "around" | "evenly">;
  gridColumns?: R<int>;
  textAlign?: R<"left" | "center" | "right" | "justify">;
  order?: R<number>;
  background?: R<string>;
  backgroundImage?: {
    src: string /* ≤2000 chars */;
    mediaId?: string;
    position?: string /* ≤60 chars */;
    size?: "cover" | "contain" | "auto";
    attachment?: "scroll" | "fixed";
    overlay?: string /* ≤120 chars */;
    overlayOpacity?: number /* 0..1 */;
  };
  color?: R<string>;
  borderRadius?: R<string>;
  border?: R<string>;
  boxShadow?: R<string>;
  opacity?: R<number>;
  fontFamily?: R<string>;
  fontSize?: R<string>;
  fontWeight?: R<number | string>;
  lineHeight?: R<number | string>;
  letterSpacing?: R<string>;
  textTransform?: R<"none" | "uppercase" | "lowercase" | "capitalize">;
  position?: R<"static" | "relative" | "absolute" | "sticky" | "fixed">;
  inset?: R<string>;
  zIndex?: R<int>;
  overflow?: R<"visible" | "hidden" | "clip" | "auto">;
}
```

## Node animation

Used in `node.animation`.

```ts
{
  preset: string;
  duration?: number /* 0..10 */;
  delay?: number /* 0..10 */;
  ease?: string;
  distance?: number;
  stagger?: number /* 0..2 */;
  trigger?: "load" | "scroll" | "hover";
  start?: string;
  end?: string;
  scrub?: number;
  target?: "self" | "children" | "words" | "chars" | "lines";
  once?: boolean;
}
```

## Node visibility

Used in `node.visibility`.

```ts
{
  hidden?: R<boolean>;
  from?: string /* pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z))$ */;
  until?: string /* pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z))$ */;
  locales?: string[];
}
```

## Form

Used in `forms/<slug>.json`.

```ts
{
  id: string;
  name: string /* ≤120 chars; ≥1 chars */;
  slug: string /* pattern ^[a-z0-9-]+$ */;
  fields: {
    id: string;
    type: "text" | "email" | "phone" | "number" | "textarea" | "select" | "multiselect" | "radio" | "checkbox" | "date" | "time" | "datetime" | "file" | "hidden" | "consent" | "rating" | "url" | "heading" | "paragraph" | "custom";
    name: string /* pattern ^[a-zA-Z][a-zA-Z0-9_]*$ */;
    label: string /* ≤200 chars */;
    placeholder?: string /* ≤200 chars */;
    helpText?: string /* ≤500 chars */;
    required?: boolean = false;
    defaultValue?: any;
    options?: {
      label: string;
      value: string;
    }[];
    validation?: {
      min?: number;
      max?: number;
      minLength?: int /* -9007199254740991..9007199254740991 */;
      maxLength?: int /* -9007199254740991..9007199254740991 */;
      pattern?: string;
      patternMessage?: string;
      accept?: string[];
      maxFileSizeMb?: number;
      maxFiles?: int /* -9007199254740991..9007199254740991 */;
    };
    showIf?: {
      match: "all" | "any";
      conditions: {
        field: string;
        op: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "notContains" | "in" | "notIn" | "empty" | "notEmpty" | "matches";
        value?: any;
      } | __schema0[];
    };
    width?: "full" | "half" | "third" = "full";
    component?: string;
  }[];
  settings?: {
    submitLabel?: string = "Send";
    successMessage?: string = "Thank you — we will be in touch shortly.";
    redirectUrl?: string /* ≤8192 chars */;
    storeSubmissions?: boolean = true;
    honeypot?: boolean = true;
    captcha?: {
      provider?: "none" | "recaptcha-v2" | "recaptcha-v3" | "turnstile" | "hcaptcha" = "none";
      integrationId?: string;
      minScore?: number = 0.5 /* 0..1 */;
      action?: string = "submit";
    } = {"provider":"none","minScore":0.5,"action":"submit"};
    rateLimitPerMinute?: int = 5 /* 1..120 */;
    layout?: "stacked" | "grid" = "grid";
    consentText?: string;
  };
  rules?: {
    id: string;
    name: string;
    enabled?: boolean = true;
    when?: {
      match: "all" | "any";
      conditions: {
        field: string;
        op: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "notContains" | "in" | "notIn" | "empty" | "notEmpty" | "matches";
        value?: any;
      } | __schema0[];
    };
    then: {
      type: "email";
      to: string[] /* min 1 */;
      cc?: string[];
      bcc?: string[];
      replyTo?: string;
      subject: string;
      body?: string;
      html?: string;
      providerId?: string;
    } | {
      type: "autoresponder";
      subject: string;
      html: string;
      emailField?: string = "email";
      providerId?: string;
    } | {
      type: "sms";
      to: string[] /* min 1 */;
      body: string /* ≤1600 chars */;
      providerId?: string;
    } | {
      type: "webhook";
      webhookId?: string;
      url?: string;
    } | {
      type: "tag";
      tags: string[] /* min 1 */;
    } | {
      type: "assign";
      userId: string;
    } | {
      type: "status";
      status: string;
    }[];
    otherwise?: {
      type: "email";
      to: string[] /* min 1 */;
      cc?: string[];
      bcc?: string[];
      replyTo?: string;
      subject: string;
      body?: string;
      html?: string;
      providerId?: string;
    } | {
      type: "autoresponder";
      subject: string;
      html: string;
      emailField?: string = "email";
      providerId?: string;
    } | {
      type: "sms";
      to: string[] /* min 1 */;
      body: string /* ≤1600 chars */;
      providerId?: string;
    } | {
      type: "webhook";
      webhookId?: string;
      url?: string;
    } | {
      type: "tag";
      tags: string[] /* min 1 */;
    } | {
      type: "assign";
      userId: string;
    } | {
      type: "status";
      status: string;
    }[];
    stopProcessing?: boolean = false;
  }[];
}
```

## Collection (CMS)

Used in `collections/<slug>.json`.

```ts
{
  id: string;
  slug: string /* pattern ^[a-z0-9-]+$ */;
  name: string;
  singularName?: string;
  description?: string;
  fields: {
    key: string /* pattern ^[a-zA-Z][a-zA-Z0-9_]*$ */;
    label: string;
    type: "text" | "textarea" | "richtext" | "number" | "boolean" | "date" | "datetime" | "image" | "video" | "media" | "gallery" | "relation" | "multirelation" | "select" | "multiselect" | "color" | "url" | "email" | "location" | "slug" | "json";
    required?: boolean = false;
    helpText?: string;
    options?: {
      label: string;
      value: string;
    }[];
    relation?: string;
    unique?: boolean;
    localized?: boolean;
  }[];
  titleField?: string = "name";
  routePrefix?: string;
  items?: {
    id: string;
    slug: string;
    status?: "draft" | "published" | "archived" = "published";
    data: Record<string, any>;
    position?: int = 0 /* -9007199254740991..9007199254740991 */;
    translations?: Record<string, Record<string, any>>;
  }[] = [];
}
```

## Redirect

Used in `site.json` → `redirects[]`.

```ts
{
  id: string;
  source: string /* pattern ^\/.* */;
  destination: string /* ≤8192 chars */;
  statusCode?: 301 | 302 | 307 | 308 = 301;
  enabled?: boolean = true;
}
```

## Animation presets

Values for `node.animation.preset` (scroll-triggered by default). Prefer each component's recommended animations.

| preset | category | description | best for |
| --- | --- | --- | --- |
| `fade` | entrance | Simple opacity fade | any content, minimal sites |
| `fade-up` | entrance | Fade in while rising slightly | headings, cards, paragraphs |
| `fade-down` | entrance | Fade in while dropping slightly | navigation, badges |
| `slide-left` | entrance | Slide in toward the left | split layouts, images |
| `slide-right` | entrance | Slide in toward the right | split layouts, text columns |
| `scale-in` | entrance | Grow subtly from 94% | cards, images, CTAs |
| `blur-reveal` | entrance | Sharpen from a soft blur | hero text, luxury brands |
| `reveal` | entrance | Rise from behind a mask line | headings, eyebrows |
| `clip-reveal` | media | Wipe in from bottom using clip-path | images, galleries, feature blocks |
| `image-mask` | media | Clip reveal while the image settles from a zoom | hero images, room photography, editorial imagery |
| `parallax` | scroll | Scroll-linked vertical drift | background images, decorative media |
| `stagger` | layout | Children fade up one after another | card grids, feature lists, stats |
| `text-reveal` | text | Lines rise from masks | large headings, quotes |
| `word-reveal` | text | Words fade and rise in sequence | hero headings, statements |
| `character-reveal` | text | Characters cascade in — use sparingly | short display words, logotypes |
| `editorial-reveal` | layout | Hero choreography: eyebrow, heading lines, body, actions in sequence | editorial heroes, hospitality, luxury |
| `cinematic-reveal` | media | Background settles from a slow zoom while content fades in | fullscreen heroes, video heroes, resorts |
| `pin-section` | scroll | Pin while scrolling through content (sticky storytelling) | sticky storytelling, process steps |
| `horizontal-scroll` | scroll | Vertical scroll drives a horizontal track | galleries, experiences, timelines |

## Icon names

Valid values for every `icon` prop (267 names; lucide-style kebab-case). Anything else renders nothing.

`accessibility` `ai` `airport` `alert-circle` `alert-triangle` `analytics` `anchor` `armchair` `arrow-down` `arrow-left` `arrow-right` `arrow-up-right` `arrow-up-right-from-square` `award` `baby` `badge-check` `bank` `banknote` `bar` `bar-chart` `bar-chart-3` `bath` `beach` `bed` `bed-double` `beer` `bike` `binoculars` `book-open` `breakfast` `briefcase` `building` `building-2` `bus` `cake` `calendar` `calendar-check` `calendar-days` `camera` `car` `chart-column` `chart-line` `chart-no-axes-column` `chart-pie` `chat` `check` `check-circle` `check-circle-2` `chevron-down` `chevron-left` `chevron-right` `chevron-up` `chevrons-down` `church` `cigarette-off` `circle-alert` `circle-check` `circle-dollar-sign` `circle-help` `circle-parking` `circle-play` `clipboard-check` `clock` `clock-3` `close` `cloud` `cloud-sun` `code` `coffee` `compass` `concierge-bell` `cpu` `credit-card` `crown` `custom` `data` `database` `date` `dining` `dog` `dollar-sign` `download` `drink` `droplets` `dumbbell` `ellipsis` `email` `event` `external-link` `facebook` `factory` `family` `fast` `feather` `file-text` `finance` `fish` `fitness` `flame` `flower` `flower-2` `food` `footprints` `gem` `gift` `github` `glass-water` `globe` `graduation-cap` `growth` `gym` `hamburger` `hand-heart` `handshake` `heart` `heart-handshake` `help-circle` `hike` `hiking` `home` `hotel` `hours` `house` `idea` `image` `info` `instagram` `key` `key-round` `lake` `lamp` `landmark` `launch` `layers` `layout-grid` `leaf` `lightbulb` `line-chart` `linkedin` `list-checks` `loader-2` `loader-circle` `location` `lock` `mail` `map` `map-pin` `martini` `maximize-2` `medal` `meditation` `menu` `message-circle` `message-square` `messenger` `mic` `minus` `money` `monitor` `moon` `more-horizontal` `mountain` `mountain-snow` `mountains` `move-right` `music` `navigation` `newspaper` `package` `palette` `palm-tree` `palmtree` `parking` `parking-circle` `partner` `party-popper` `pause` `payments` `pen-tool` `people` `percent` `pets` `phone` `pie-chart` `piggy-bank` `pin` `pinterest` `plane` `play` `play-circle` `plus` `pool` `presentation` `quote` `restaurant` `ring` `rocket` `route` `sailboat` `salad` `scale` `search` `security` `send` `settings` `shield` `shield-check` `ship` `shopping-bag` `shower-head` `smartphone` `snowflake` `sofa` `soup` `spa` `sparkle` `sparkles` `speed` `sprout` `star` `store` `strategy` `sun` `sunrise` `sunset` `support` `swimming` `target` `team` `telegram` `telephone` `tent` `thermometer` `threads` `ticket` `tiktok` `time` `timer` `transfer` `tree-palm` `tree-pine` `trees` `trending-up` `triangle-alert` `tripadvisor` `trophy` `truck` `tv` `umbrella` `user` `users` `utensils` `utensils-crossed` `view` `wallet` `waves` `wedding` `whatsapp` `wifi` `wind` `wine` `wrench` `x` `yoga` `youtube` `zap` `zoom-in`
