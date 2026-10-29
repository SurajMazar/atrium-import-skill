# Atrium renderer classes

Generated from `RENDERER_CSS` of Atrium `dc4ce67` by `tools/build.mjs`. Do not edit by hand.

Use these to write the design bridge (site `customCss`, see design-fidelity.md). Renderer rules are
`.atrium-site .a-…`; prefix yours with `body.atrium-site` so they win. Classes ending in `__x` are parts,
`--x` are variants/modifiers. State classes: `.is-scrolled`, `.is-current`, `.is-open`, `.is-hidden`.
Tone wrappers: `.a-tone-default|surface|surface-alt|inverse|primary` set `--t-bg --t-text --t-muted
--t-border --t-btn-bg --t-btn-text`; buttons read `--b-bg --b-fg --b-bd`.

## Design tokens read by the renderer

`--a-button-px` `--a-button-py` `--a-button-radius` `--a-button-tracking` `--a-button-transform` `--a-button-weight` `--a-color-accent` `--a-color-background` `--a-color-border` `--a-color-danger` `--a-color-inverse` `--a-color-inverse-text` `--a-color-muted` `--a-color-primary` `--a-color-primary-contrast` `--a-color-secondary` `--a-color-surface` `--a-color-surface-alt` `--a-color-text` `--a-container-default` `--a-container-narrow` `--a-container-wide` `--a-ease` `--a-ease-out` `--a-font-accent` `--a-font-body` `--a-font-heading` `--a-gap` `--a-gutter` `--a-header-h` `--a-leading-body` `--a-leading-heading` `--a-radius-full` `--a-radius-lg` `--a-radius-md` `--a-radius-sm` `--a-shadow-lg` `--a-shadow-md` `--a-shadow-sm` `--a-space-1` `--a-space-12` `--a-space-2` `--a-space-20` `--a-space-3` `--a-space-32` `--a-space-4` `--a-space-5` `--a-space-6` `--a-space-8` `--a-space-section` `--a-text-2xl` `--a-text-3xl` `--a-text-4xl` `--a-text-5xl` `--a-text-6xl` `--a-text-base` `--a-text-lg` `--a-text-sm` `--a-text-xl` `--a-text-xs` `--a-tracking-eyebrow` `--a-tracking-heading` `--a-transform-heading` `--a-weight-body` `--a-weight-heading`

## Blocks

**`.a-accordion`** — `.a-accordion--boxed` `.a-accordion__body` `.a-accordion__icon` `.a-accordion__item` `.a-accordion__summary`
  tokens: --a-ease --a-font-heading --a-radius-md --a-text-xl --a-weight-heading

**`.a-actions`** — `.a-actions--center` `.a-actions--right`
  tokens: --a-space-3 --a-space-5

**`.a-amenities`** — `.a-amenities__grid` `.a-amenities__list`
  tokens: --a-text-sm

**`.a-amenity`** — `.a-amenity__icon` `.a-amenity__text` `.a-amenity__title`
  tokens: --a-font-heading --a-text-lg --a-text-sm

**`.a-animated-text`** — `.a-animated-text--display` `.a-animated-text--lg` `.a-animated-text--md` `.a-animated-text--xl`
  tokens: --a-text-3xl --a-text-4xl --a-text-5xl --a-text-6xl

**`.a-attraction`** — `.a-attraction__dist` `.a-attraction__head` `.a-attraction__name`
  tokens: --a-text-xl --a-text-xs

**`.a-attrlist`** — (no parts)

**`.a-ba`** — `.a-ba__before` `.a-ba__handle` `.a-ba__label` `.a-ba__label--after` `.a-ba__label--before` `.a-ba__layer` `.a-ba__range`
  tokens: --a-color-inverse --a-color-inverse-text --a-radius-full --a-radius-sm --a-shadow-md --a-text-xs

**`.a-background-video`** — (no parts)
  tokens: --a-color-inverse --a-color-inverse-text

**`.a-badge`** — `.a-badge--outline` `.a-badge--solid` `.a-badge--subtle`
  tokens: --a-radius-full --a-text-xs

**`.a-benefit`** — `.a-benefit__body` `.a-benefit__icon` `.a-benefit__text` `.a-benefit__title`
  tokens: --a-text-sm --a-text-xl

**`.a-bgvideo`** — `.a-bgvideo--h-auto` `.a-bgvideo--h-half` `.a-bgvideo--h-screen` `.a-bgvideo--h-tall` `.a-bgvideo--pos-bottom-center` `.a-bgvideo--pos-bottom-left` `.a-bgvideo__copy` `.a-bgvideo__heading` `.a-bgvideo__inner` `.a-bgvideo__media` `.a-bgvideo__video`
  tokens: --a-color-inverse-text --a-text-5xl

**`.a-blist`** — `.a-blist--grid` `.a-blist--list` `.a-blist--with-image`
  tokens: --a-text-xl

**`.a-booking`** — `.a-booking--bar` `.a-booking--card` `.a-booking--inline` `.a-booking__copy` `.a-booking__error` `.a-booking__field` `.a-booking__form` `.a-booking__heading` `.a-booking__submit`
  tokens: --a-color-danger --a-radius-md --a-radius-sm --a-shadow-sm --a-text-2xl --a-text-sm --a-text-xs

**`.a-box`** — `.a-box--default` `.a-box--narrow` `.a-box--wide`
  tokens: --a-container-default --a-container-narrow --a-container-wide --a-space-4

**`.a-brand`** — `.a-brand__logo` `.a-brand__logo--default` `.a-brand__logo--inverse` `.a-brand__word`
  tokens: --a-font-heading --a-text-2xl --a-text-xl --a-tracking-heading --a-weight-heading

**`.a-btn`** — `.a-btn--block` `.a-btn--ghost` `.a-btn--lg` `.a-btn--link` `.a-btn--outline` `.a-btn--primary` `.a-btn--secondary` `.a-btn--sm` `.a-btn__icon`
  tokens: --a-button-px --a-button-py --a-button-radius --a-button-tracking --a-button-transform --a-button-weight --a-color-background --a-color-inverse --a-color-primary-contrast --a-color-secondary --a-color-text --a-ease --a-font-body --a-text-base --a-text-sm --a-text-xs

**`.a-burger`** — (no parts)
  tokens: --a-ease

**`.a-button-group`** — (no parts)

**`.a-capacity`** — (no parts)
  tokens: --a-font-heading --a-text-xl --a-text-xs

**`.a-caption`** — (no parts)
  tokens: --a-text-sm

**`.a-card`** — `.a-card__body`

**`.a-card-title`** — (no parts)
  tokens: --a-font-heading --a-text-2xl --a-text-3xl --a-text-lg --a-text-xl --a-tracking-heading --a-weight-heading

**`.a-check-list`** — (no parts)

**`.a-choice`** — (no parts)
  tokens: --a-color-primary --a-radius-full --a-text-sm

**`.a-choices`** — (no parts)

**`.a-cinfo`** — `.a-cinfo__body` `.a-cinfo__col` `.a-cinfo__icon` `.a-cinfo__item` `.a-cinfo__label` `.a-cinfo__list` `.a-cinfo__list--cards` `.a-cinfo__social` `.a-cinfo__split` `.a-cinfo__value`
  tokens: --a-radius-md --a-text-lg --a-text-xs --a-tracking-eyebrow

**`.a-clist`** — `.a-clist__arrow` `.a-clist__empty` `.a-clist__featured` `.a-clist__grid` `.a-clist__lead` `.a-clist__line` `.a-clist__list` `.a-clist__minimal` `.a-clist__more` `.a-clist__row` `.a-clist__row--compact` `.a-clist__side` `.a-clist__text`
  tokens: --a-ease --a-text-2xl --a-text-3xl --a-text-lg

**`.a-columns`** — `.a-columns--reverse` `.a-columns--three`
  tokens: --a-gap

**`.a-consent`** — `.a-consent--bottom` `.a-consent--bottom-left` `.a-consent--bottom-right` `.a-consent__actions` `.a-consent__cats` `.a-consent__msg` `.a-consent__title`
  tokens: --a-color-background --a-color-border --a-color-muted --a-color-primary --a-color-primary-contrast --a-color-text --a-font-heading --a-radius-md --a-shadow-lg --a-text-lg --a-text-sm

**`.a-contact-details`** — (no parts)

**`.a-container`** — `.a-container--full` `.a-container--narrow` `.a-container--wide`
  tokens: --a-container-default --a-container-narrow --a-container-wide --a-gutter

**`.a-content-split`** — `.a-content-split--full-bleed`

**`.a-cta`** — `.a-cta--image-background` `.a-cta__banner` `.a-cta__bg` `.a-cta__center` `.a-cta__copy` `.a-cta__inner` `.a-cta__split` `.a-cta__split--left`
  tokens: --a-color-inverse --a-color-inverse-text --a-text-3xl --a-text-5xl

**`.a-dialog`** — `.a-dialog--drawer` `.a-dialog--left` `.a-dialog--lg` `.a-dialog--modal` `.a-dialog--sm` `.a-dialog__body` `.a-dialog__close` `.a-dialog__head` `.a-dialog__panel` `.a-dialog__title`
  tokens: --a-color-background --a-color-border --a-color-inverse --a-color-muted --a-color-text --a-ease --a-ease-out --a-font-heading --a-radius-md --a-shadow-lg --a-text-2xl --a-weight-heading

**`.a-dining`** — `.a-dining__card` `.a-dining__copy` `.a-dining__detail` `.a-dining__feature` `.a-dining__feature--right` `.a-dining__heading` `.a-dining__hero` `.a-dining__highlights` `.a-dining__hours` `.a-dining__hours-title` `.a-dining__media` `.a-dining__split` `.a-dining__split--right`
  tokens: --a-color-background --a-radius-sm --a-shadow-md --a-text-4xl --a-text-xs --a-tracking-eyebrow

**`.a-divider`** — `.a-divider--label` `.a-divider--line` `.a-divider--ornament` `.a-divider--short`
  tokens: --a-space-6 --a-text-sm --a-text-xs --a-tracking-eyebrow

**`.a-dropzone`** — (no parts)
  tokens: --a-radius-md --a-text-sm

**`.a-editor-notice`** — (no parts)
  tokens: --a-radius-sm --a-text-sm

**`.a-embed`** — `.a-embed--html` `.a-embed--placeholder` `.a-embed__frame` `.a-embed__placeholder` `.a-embed__placeholder-host` `.a-embed__placeholder-label` `.a-embed__placeholder-note`
  tokens: --a-radius-sm --a-text-sm --a-text-xs

**`.a-event-card`** — `.a-event-card__date` `.a-event-card__media`
  tokens: --a-color-background --a-color-text --a-font-heading --a-radius-sm --a-text-2xl --a-text-xs

**`.a-event-row`** — `.a-event-row__body` `.a-event-row__date` `.a-event-row__day` `.a-event-row__link` `.a-event-row__meta` `.a-event-row__month` `.a-event-row__title`
  tokens: --a-font-heading --a-text-4xl --a-text-xl --a-text-xs

**`.a-events`** — `.a-events__empty` `.a-events__list`

**`.a-exp`** — `.a-exp__grid` `.a-exp__list` `.a-exp__media` `.a-exp__tag`
  tokens: --a-color-background --a-color-text --a-radius-full --a-text-xs

**`.a-exp-row`** — `.a-exp-row__body` `.a-exp-row__meta`

**`.a-eyebrow`** — `.a-eyebrow--rule`
  tokens: --a-font-body --a-text-xs --a-tracking-eyebrow

**`.a-facts`** — (no parts)
  tokens: --a-font-heading --a-text-xl --a-text-xs --a-tracking-eyebrow

**`.a-faq`** — `.a-faq__aside` `.a-faq__cta` `.a-faq__split`
  tokens: --a-header-h

**`.a-feature`** — `.a-feature__more` `.a-feature__num` `.a-feature__title`
  tokens: --a-font-heading --a-text-sm --a-text-xl

**`.a-feature-chip`** — `.a-feature-chip__title`
  tokens: --a-text-sm

**`.a-feature-line`** — `.a-feature-line__body` `.a-feature-line__num` `.a-feature-line__title`
  tokens: --a-font-heading --a-text-2xl

**`.a-feature-row`** — `.a-feature-row--flip` `.a-feature-row__copy` `.a-feature-row__media` `.a-feature-row__title`
  tokens: --a-text-3xl

**`.a-features`** — `.a-features__alt` `.a-features__cards` `.a-features__grid` `.a-features__list` `.a-features__row`

**`.a-field`** — `.a-field--check` `.a-field--half` `.a-field--rating` `.a-field--third` `.a-field__error` `.a-field__help` `.a-field__label` `.a-field__req`
  tokens: --a-color-danger --a-color-inverse-text --a-radius-full --a-radius-sm --a-text-base --a-text-sm --a-text-xs

**`.a-flow`** — (no parts)
  tokens: --a-space-6

**`.a-fm`** — `.a-fm--grid` `.a-fm--inline` `.a-fm--stacked` `.a-fm__fields` `.a-fm__heading` `.a-fm__hp` `.a-fm__para` `.a-fm__status` `.a-fm__submit` `.a-fm__success` `.a-fm__success-title`
  tokens: --a-color-danger --a-font-heading --a-radius-md --a-space-2 --a-space-4 --a-space-5 --a-text-2xl --a-text-sm --a-text-xl --a-weight-heading

**`.a-fmsec`** — `.a-fmsec__aside` `.a-fmsec__card` `.a-fmsec__contact` `.a-fmsec__split`
  tokens: --a-header-h --a-radius-md

**`.a-font-accent`** — (no parts)
  tokens: --a-font-accent

**`.a-font-body`** — (no parts)
  tokens: --a-font-body

**`.a-footer`** — `.a-footer--centered` `.a-footer__about` `.a-footer__bottom` `.a-footer__brand` `.a-footer__col` `.a-footer__consent` `.a-footer__contact--inline` `.a-footer__desc` `.a-footer__grid` `.a-footer__inline` `.a-footer__legal` `.a-footer__map` `.a-footer__newsletter` `.a-footer__statement` `.a-footer__statement-text` `.a-footer__title`
  tokens: --a-text-2xl --a-text-base --a-text-sm --a-text-xs --a-tracking-eyebrow

**`.a-footnote`** — (no parts)
  tokens: --a-text-xs

**`.a-frame`** — `.a-frame--empty`
  tokens: --a-ease-out

**`.a-g-tall`** — (no parts)

**`.a-g-wide`** — (no parts)

**`.a-gallery`** — `.a-gallery__editorial` `.a-gallery__item` `.a-gallery__masonry` `.a-gallery__open` `.a-gallery__stacked`
  tokens: --a-gap

**`.a-gap-lg`** — (no parts)

**`.a-gap-md`** — (no parts)

**`.a-gap-none`** — (no parts)

**`.a-gap-sm`** — (no parts)
  tokens: --a-space-3

**`.a-gap-xl`** — (no parts)

**`.a-global`** — (no parts)

**`.a-grid`** — (no parts)
  tokens: --a-gap

**`.a-hcard`** — `.a-hcard__caption`

**`.a-header`** — `.a-header--centered` `.a-header--minimal` `.a-header--overlay` `.a-header--sticky` `.a-header__bar` `.a-header__brand` `.a-header__contact` `.a-header__contact--drawer` `.a-header__cta` `.a-header__drawer` `.a-header__drawer-foot` `.a-header__drawer-inner` `.a-header__end` `.a-header__langs` `.a-header__nav` `.a-header__nav--left` `.a-header__social` `.a-header__toggle` `.a-header__utility` `.a-header__utility-end` `.a-header__utility-inner`
  tokens: --a-color-background --a-color-border --a-color-inverse --a-color-inverse-text --a-color-primary --a-color-primary-contrast --a-color-text --a-container-default --a-ease --a-ease-out --a-gutter --a-header-h --a-text-sm --a-text-xs

**`.a-heading`** — `.a-heading--display` `.a-heading--lg` `.a-heading--md` `.a-heading--sm` `.a-heading--xl`
  tokens: --a-font-heading --a-leading-heading --a-text-2xl --a-text-3xl --a-text-4xl --a-text-5xl --a-text-6xl --a-text-lg --a-text-xl --a-tracking-heading --a-transform-heading --a-weight-heading

**`.a-hero`** — `.a-hero--centered` `.a-hero--cinematic` `.a-hero--editorial` `.a-hero--h-auto` `.a-hero--h-screen` `.a-hero--h-tall` `.a-hero--img-left` `.a-hero--immersive` `.a-hero--minimal` `.a-hero--pos-bottom-center` `.a-hero--pos-bottom-left` `.a-hero--pos-center` `.a-hero--pos-left` `.a-hero--pos-top-left` `.a-hero--split` `.a-hero--text-overlay` `.a-hero--under-header` `.a-hero__actions` `.a-hero__copy` `.a-hero__copy--center` `.a-hero__cue` `.a-hero__cue-line` `.a-hero__figure` `.a-hero__frame` `.a-hero__heading` `.a-hero__heading--cinematic` `.a-hero__inner` `.a-hero__media` `.a-hero__media--empty` `.a-hero__meta` `.a-hero__panel` `.a-hero__slide` `.a-hero__sub` `.a-hero__video`
  tokens: --a-color-inverse --a-color-inverse-text --a-color-primary --a-ease --a-font-heading --a-gutter --a-header-h --a-radius-md --a-radius-sm --a-shadow-lg --a-space-2 --a-space-4 --a-space-5 --a-text-5xl --a-text-6xl --a-text-lg --a-text-xl --a-text-xs --a-tracking-eyebrow

**`.a-hours`** — (no parts)

**`.a-hover-zoom`** — (no parts)

**`.a-hscroll`** — `.a-hscroll__card` `.a-hscroll__card--lg` `.a-hscroll__card--md` `.a-hscroll__card--sm` `.a-hscroll__track` `.a-hscroll__viewport`
  tokens: --a-container-wide --a-gap --a-gutter

**`.a-icon`** — (no parts)

**`.a-icon-badge`** — `.a-icon-badge--circle` `.a-icon-badge--square`
  tokens: --a-radius-md

**`.a-icon-el`** — (no parts)

**`.a-image`** — `.a-image__frame--border` `.a-image__frame--inset` `.a-image__link`

**`.a-img`** — (no parts)
  tokens: --a-ease-out

**`.a-info`** — `.a-info--rows`
  tokens: --a-font-body --a-font-heading --a-text-lg --a-text-sm --a-text-xs --a-tracking-eyebrow

**`.a-intro`** — `.a-intro--center` `.a-intro--left` `.a-intro--right` `.a-intro__heading` `.a-intro__sub`
  tokens: --a-space-1 --a-space-3 --a-space-4 --a-text-3xl --a-text-5xl

**`.a-langs`** — (no parts)
  tokens: --a-text-xs

**`.a-lead`** — (no parts)
  tokens: --a-color-inverse-text --a-text-lg

**`.a-lightbox`** — `.a-lightbox__btn` `.a-lightbox__caption` `.a-lightbox__close` `.a-lightbox__figure` `.a-lightbox__img` `.a-lightbox__next` `.a-lightbox__prev`
  tokens: --a-color-inverse --a-color-inverse-text --a-ease --a-text-sm

**`.a-lightbox-scope`** — (no parts)

**`.a-link`** — (no parts)
  tokens: --a-ease

**`.a-list`** — `.a-list--bullet` `.a-list--number` `.a-list__mark`
  tokens: --a-font-heading

**`.a-logos`** — `.a-logos--mono` `.a-logos__grid` `.a-logos__img` `.a-logos__intro` `.a-logos__item` `.a-logos__marquee` `.a-logos__word`
  tokens: --a-font-heading --a-text-xl

**`.a-main`** — (no parts)

**`.a-map`** — `.a-map--lg` `.a-map--md` `.a-map--sm` `.a-map__actions` `.a-map__address` `.a-map__card` `.a-map__facade` `.a-map__frame` `.a-map__img` `.a-map__note` `.a-map__pattern` `.a-map__pin`
  tokens: --a-color-accent --a-color-background --a-color-muted --a-color-primary --a-color-primary-contrast --a-color-surface --a-color-text --a-radius-md --a-shadow-md --a-text-sm

**`.a-mark`** — `.a-mark--no` `.a-mark--yes`

**`.a-member`** — `.a-member__bio` `.a-member__body` `.a-member__links` `.a-member__name`
  tokens: --a-text-2xl --a-text-lg --a-text-sm

**`.a-member-row`** — `.a-member-row__body`
  tokens: --a-text-2xl

**`.a-menu`** — `.a-menu__cat` `.a-menu__catname` `.a-menu__cats` `.a-menu__cats--grid` `.a-menu__desc` `.a-menu__dots` `.a-menu__item` `.a-menu__item--leader` `.a-menu__items` `.a-menu__line` `.a-menu__name` `.a-menu__note` `.a-menu__price` `.a-menu__tags`
  tokens: --a-font-heading --a-radius-full --a-radius-md --a-text-2xl --a-text-lg --a-text-sm

**`.a-meta`** — (no parts)
  tokens: --a-text-sm

**`.a-mnav`** — `.a-mnav__group` `.a-mnav__link`
  tokens: --a-font-heading --a-text-2xl --a-text-lg

**`.a-motion-ready`** — (no parts)

**`.a-muted`** — (no parts)

**`.a-nav`** — `.a-nav__caret` `.a-nav__desc` `.a-nav__item` `.a-nav__link` `.a-nav__panel` `.a-nav__sub` `.a-nav__sublabel` `.a-nav__sublink` `.a-nav__thumb`
  tokens: --a-color-background --a-color-border --a-color-muted --a-color-surface --a-color-text --a-ease --a-font-heading --a-radius-full --a-radius-md --a-radius-sm --a-shadow-md --a-text-lg --a-text-sm --a-text-xs

**`.a-newsletter`** — `.a-newsletter--banner` `.a-newsletter__bg` `.a-newsletter__card` `.a-newsletter__copy` `.a-newsletter__heading` `.a-newsletter__inner`
  tokens: --a-radius-md --a-text-3xl

**`.a-offer`** — `.a-offer--feature` `.a-offer--row` `.a-offer__badge` `.a-offer__body` `.a-offer__cta` `.a-offer__foot` `.a-offer__incl` `.a-offer__media` `.a-offer__title` `.a-offer__valid`
  tokens: --a-color-background --a-color-text --a-radius-full --a-text-3xl --a-text-sm --a-text-xs

**`.a-offers`** — `.a-offers__featured` `.a-offers__list` `.a-offers__rest`

**`.a-on-media`** — (no parts)
  tokens: --a-color-accent --a-color-inverse --a-color-inverse-text

**`.a-overlay`** — (no parts)
  tokens: --a-color-inverse

**`.a-overlay-block`** — `.a-overlay-block--editor` `.a-overlay-block__preview`
  tokens: --a-radius-md

**`.a-parallax`** — `.a-parallax--h-lg` `.a-parallax--h-md` `.a-parallax--h-screen` `.a-parallax--h-sm` `.a-parallax--medium` `.a-parallax--strong` `.a-parallax__heading` `.a-parallax__img` `.a-parallax__inner` `.a-parallax__media`
  tokens: --a-text-5xl

**`.a-parallax-band`** — (no parts)
  tokens: --a-color-inverse --a-color-inverse-text

**`.a-pb-lg`** — (no parts)

**`.a-pb-md`** — (no parts)

**`.a-pb-none`** — (no parts)

**`.a-pb-sm`** — (no parts)

**`.a-pb-xl`** — (no parts)

**`.a-pill`** — (no parts)
  tokens: --a-radius-full --a-text-xs

**`.a-pills`** — (no parts)

**`.a-plan`** — `.a-plan--highlight` `.a-plan__cta` `.a-plan__features` `.a-plan__head` `.a-plan__name` `.a-plan__price` `.a-plan__top`
  tokens: --a-color-accent --a-color-inverse --a-color-inverse-text --a-font-body --a-font-heading --a-radius-md --a-text-5xl --a-text-sm --a-text-xl

**`.a-price`** — (no parts)
  tokens: --a-font-body --a-font-heading --a-text-lg --a-text-xs

**`.a-pricing`** — `.a-pricing__table` `.a-pricing__tname`
  tokens: --a-font-heading --a-text-xl

**`.a-prose`** — (no parts)

**`.a-pt-lg`** — (no parts)

**`.a-pt-md`** — (no parts)

**`.a-pt-none`** — (no parts)

**`.a-pt-sm`** — (no parts)

**`.a-pt-xl`** — (no parts)

**`.a-quote`** — `.a-quote--lg` `.a-quote--md` `.a-quote--xl` `.a-quote__author` `.a-quote__by` `.a-quote__role`
  tokens: --a-font-heading --a-space-5 --a-text-3xl --a-text-4xl --a-text-sm --a-text-xl --a-tracking-heading --a-weight-heading

**`.a-r-full`** — (no parts)
  tokens: --a-radius-full

**`.a-r-lg`** — (no parts)
  tokens: --a-radius-lg

**`.a-r-md`** — (no parts)
  tokens: --a-radius-md

**`.a-r-none`** — (no parts)

**`.a-r-sm`** — (no parts)
  tokens: --a-radius-sm

**`.a-richtext`** — `.a-richtext--dropcap` `.a-richtext--full` `.a-richtext--narrow`
  tokens: --a-font-heading --a-radius-sm --a-text-2xl --a-text-3xl --a-text-sm --a-text-xl --a-tracking-heading --a-weight-heading

**`.a-room`** — `.a-room__body` `.a-room__cta` `.a-room__facts` `.a-room__from` `.a-room__head`
  tokens: --a-font-body --a-text-xs

**`.a-room-row`** — `.a-room-row--flip` `.a-room-row__copy` `.a-room-row__foot` `.a-room-row__media` `.a-room-row__name` `.a-room-row__num`
  tokens: --a-font-heading --a-text-4xl --a-text-sm

**`.a-rooms`** — `.a-rooms__grid` `.a-rooms__list`

**`.a-rotator`** — `.a-rotator--fade` `.a-rotator--italic` `.a-rotator--type` `.a-rotator__sizer` `.a-rotator__type` `.a-rotator__word`
  tokens: --a-ease --a-ease-out

**`.a-rule`** — (no parts)

**`.a-scrim`** — (no parts)
  tokens: --a-color-inverse

**`.a-section`** — `.a-section--h-half` `.a-section--h-screen` `.a-section--nested` `.a-section--v-center` `.a-section--v-end` `.a-section__actions`
  tokens: --a-radius-md --a-space-section

**`.a-select`** — (no parts)

**`.a-skip`** — (no parts)
  tokens: --a-color-inverse --a-color-inverse-text --a-radius-sm --a-text-sm

**`.a-slide`** — `.a-slide__caption` `.a-slide__link`

**`.a-slider`** — `.a-slider--cards` `.a-slider--full` `.a-slider--peek` `.a-slider__arrow` `.a-slider__arrows` `.a-slider__controls` `.a-slider__count` `.a-slider__dot` `.a-slider__dots` `.a-slider__slide` `.a-slider__track`
  tokens: --a-ease --a-gap --a-text-xs

**`.a-small`** — (no parts)
  tokens: --a-text-sm

**`.a-social`** — `.a-social--labels` `.a-social--pills`
  tokens: --a-radius-full --a-text-sm

**`.a-social-links`** — `.a-social-links--center` `.a-social-links--right`

**`.a-spacer`** — `.a-spacer--2xl` `.a-spacer--lg` `.a-spacer--md` `.a-spacer--sm` `.a-spacer--xl` `.a-spacer--xs`
  tokens: --a-space-12 --a-space-2 --a-space-20 --a-space-32 --a-space-4 --a-space-8

**`.a-split`** — `.a-split--right` `.a-split__bleed` `.a-split__bleed-copy` `.a-split__bleed-media` `.a-split__body` `.a-split__collage` `.a-split__copy` `.a-split__copy--end` `.a-split__copy--start` `.a-split__grid` `.a-split__grid--flip` `.a-split__heading` `.a-split__overlap` `.a-split__panel` `.a-split__secondary` `.a-split__signature`
  tokens: --a-color-background --a-font-heading --a-gutter --a-radius-sm --a-shadow-md --a-text-4xl --a-text-lg

**`.a-sr`** — (no parts)

**`.a-stack`** — `.a-stack--horizontal` `.a-stack--wrap`

**`.a-stack-gap-lg`** — (no parts)
  tokens: --a-space-8

**`.a-stack-gap-md`** — (no parts)
  tokens: --a-space-5

**`.a-stack-gap-none`** — (no parts)

**`.a-stack-gap-sm`** — (no parts)
  tokens: --a-space-3

**`.a-stack-gap-xl`** — (no parts)
  tokens: --a-space-12

**`.a-stack-gap-xs`** — (no parts)
  tokens: --a-space-1

**`.a-stars`** — (no parts)
  tokens: --a-color-accent

**`.a-stat`** — `.a-stat__affix` `.a-stat__desc` `.a-stat__label` `.a-stat__value`
  tokens: --a-font-heading --a-radius-md --a-text-2xl --a-text-5xl --a-text-sm --a-weight-heading

**`.a-statlist`** — `.a-statlist--cards` `.a-statlist--dividers` `.a-statlist--inline` `.a-statlist--large` `.a-statlist--text`
  tokens: --a-radius-md --a-text-2xl

**`.a-story`** — `.a-story--media-right` `.a-story__frame` `.a-story__grid` `.a-story__inline-media` `.a-story__media` `.a-story__stage` `.a-story__step` `.a-story__step-inner` `.a-story__steps` `.a-story__title`
  tokens: --a-ease --a-ease-out --a-header-h --a-text-3xl

**`.a-stretch`** — (no parts)

**`.a-table`** — `.a-table--sticky` `.a-table__note`
  tokens: --a-header-h --a-text-sm --a-text-xs --a-tracking-eyebrow

**`.a-table-wrap`** — (no parts)

**`.a-tabpanel`** — `.a-tabpanel--media` `.a-tabpanel__copy` `.a-tabpanel__heading`
  tokens: --a-text-3xl

**`.a-tabs`** — `.a-tabs--center` `.a-tabs--pills` `.a-tabs__list` `.a-tabs__panel` `.a-tabs__tab`
  tokens: --a-ease --a-radius-full --a-text-sm

**`.a-tag`** — (no parts)
  tokens: --a-text-xs

**`.a-team`** — `.a-team__list`

**`.a-testimonial`** — `.a-testimonial--large` `.a-testimonial__author` `.a-testimonial__avatar` `.a-testimonial__by` `.a-testimonial__quote` `.a-testimonial__role`
  tokens: --a-font-heading --a-radius-md --a-text-3xl --a-text-lg --a-text-sm --a-text-xl --a-text-xs --a-tracking-heading --a-weight-heading

**`.a-testimonials`** — `.a-testimonials__carousel` `.a-testimonials__grid`
  tokens: --a-radius-md --a-text-lg

**`.a-text`** — `.a-text--lg` `.a-text--sm` `.a-text--xl`
  tokens: --a-text-lg --a-text-sm --a-text-xl

**`.a-text2`** — `.a-text2__body` `.a-text2__head` `.a-text2__heading` `.a-text2__prose`
  tokens: --a-text-4xl --a-text-lg

**`.a-textsec`** — `.a-textsec--center` `.a-textsec--statement` `.a-textsec__body` `.a-textsec__heading` `.a-textsec__statement`
  tokens: --a-text-4xl --a-text-base --a-text-lg

**`.a-ticker`** — `.a-ticker--italic` `.a-ticker--lg` `.a-ticker--md` `.a-ticker--nopause` `.a-ticker--reverse` `.a-ticker--xl` `.a-ticker__item` `.a-ticker__sep` `.a-ticker__track`
  tokens: --a-font-heading --a-text-2xl --a-text-4xl --a-weight-heading

**`.a-tile`** — `.a-tile__caption` `.a-tile__text` `.a-tile__title`
  tokens: --a-color-inverse --a-color-inverse-text --a-font-heading --a-radius-sm --a-text-xl --a-text-xs

**`.a-tl`** — `.a-tl--alternating` `.a-tl--steps` `.a-tl--vertical` `.a-tl__body` `.a-tl__date` `.a-tl__dot` `.a-tl__img` `.a-tl__item` `.a-tl__title`
  tokens: --a-font-heading --a-text-2xl --a-text-sm --a-text-xl --a-text-xs --a-tracking-eyebrow

**`.a-tone-default`** — (no parts)
  tokens: --a-color-background --a-color-surface

**`.a-tone-inverse`** — (no parts)
  tokens: --a-color-accent --a-color-danger --a-color-inverse --a-color-inverse-text --a-radius-md

**`.a-tone-primary`** — (no parts)
  tokens: --a-color-primary --a-color-primary-contrast --a-radius-md

**`.a-tone-surface`** — (no parts)
  tokens: --a-color-background --a-color-surface --a-radius-md

**`.a-tone-surface-alt`** — (no parts)
  tokens: --a-color-background --a-color-surface-alt --a-radius-md

**`.a-tone-transparent`** — (no parts)

**`.a-unknown`** — (no parts)

**`.a-venue`** — `.a-venue__head`

**`.a-venue-row`** — `.a-venue-row--flip` `.a-venue-row__copy` `.a-venue-row__name`
  tokens: --a-text-4xl

**`.a-venues`** — `.a-venues__detailed` `.a-venues__table`

**`.a-video`** — `.a-video__blank` `.a-video__el` `.a-video__facade` `.a-video__frame` `.a-video__play` `.a-video__poster`
  tokens: --a-color-inverse --a-color-inverse-text --a-color-primary --a-ease --a-ease-out --a-shadow-lg

**`.a-video-block`** — (no parts)
