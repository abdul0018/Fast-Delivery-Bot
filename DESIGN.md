---
name: Fast Delivery
description: A rebrandable Telegram Mini App for local fast-food ordering, dressed in Uzbek abr (ikat) atlas silk.
colors:
  brand: "#2A2C9B"
  on-brand: "#FFFFFF"
  silk-magenta: "#D11D6B"
  silk-saffron: "#FFB31A"
  brand-ink: "#2A2C9B"
  brand-soft: "#EAEAF5"
  sale: "#E0182D"
  ok: "#138A4B"
  ink: "#17142A"
  ink-2: "#5D5870"
  ground: "#F7F3EC"
  surface: "#FFFFFF"
  line: "#E7E0D4"
  muted: "#EFE9DF"
  scrim: "#0B0A14"
  ground-dark: "#13111C"
  surface-dark: "#1E1B2A"
  ink-dark: "#F4F1FA"
  ink-2-dark: "#AAA4BD"
  line-dark: "#2F2B3F"
  muted-dark: "#2A2638"
  brand-ink-dark: "#AEAFD9"
  brand-soft-dark: "#22214E"
  sale-dark: "#FF4D5E"
  ok-dark: "#3CCF7F"
typography:
  display:
    fontFamily: "Geologica Variable, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geologica Variable, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  page-title:
    fontFamily: "Geologica Variable, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geologica Variable, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
  body-strong:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.25
  label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.35
  nav-label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
  button:
    fontFamily: "Geologica Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
  price:
    fontFamily: "Geologica Variable, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\""
  price-total:
    fontFamily: "Geologica Variable, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\""
  price-old:
    fontFamily: "Geologica Variable, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\""
rounded:
  tag: "8px"
  step: "10px"
  control: "12px"
  field: "14px"
  button-lg: "16px"
  panel: "18px"
  card: "20px"
  hero: "24px"
  sheet: "26px"
  photo: "28px"
  pill: "9999px"
spacing:
  hair: "4px"
  tight: "6px"
  sm: "8px"
  md: "12px"
  gutter: "16px"
  sheet: "20px"
  lg: "24px"
  section: "28px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "44px"
  button-primary-lg:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.button-lg}"
    padding: "0 24px"
    height: "54px"
  button-primary-sm:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "36px"
  button-secondary:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.brand-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "44px"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "44px"
  button-inverse:
    backgroundColor: "{colors.on-brand}"
    textColor: "{colors.brand}"
    typography: "{typography.button}"
    rounded: "{rounded.button-lg}"
    padding: "0 24px"
    height: "54px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
  category-tab:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "40px"
  category-tab-active:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "40px"
  product-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.card}"
    padding: "10px 12px 12px"
  quick-add:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.control}"
    size: "40px"
  discount-tag:
    backgroundColor: "{colors.silk-saffron}"
    textColor: "{colors.ink}"
    typography: "{typography.price-old}"
    rounded: "{rounded.tag}"
    padding: "2px 6px"
  quantity-stepper:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.price}"
    rounded: "{rounded.field}"
    padding: "2px"
    height: "46px"
  switch:
    backgroundColor: "{colors.brand}"
    rounded: "{rounded.pill}"
    width: "52px"
    height: "30px"
  payment-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.card}"
    padding: "14px 16px"
  bottom-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    typography: "{typography.nav-label}"
    padding: "4px 8px"
  bottom-nav-active:
    textColor: "{colors.brand-ink}"
  bottom-sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  trust-block:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.panel}"
    padding: "14px 16px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.field}"
    padding: "10px 16px"
---

# Design System: Fast Delivery

## Overview

**Creative North Star: "Dressed in Abr Silk"**

The menu is dressed in abr (ikat) atlas silk. The restaurant's colour never shows up as a lone accent on grey: it arrives as full-width silk fields (the Home header, onboarding slides, the story viewer, the order-success sheet) that end in a feathered, dye-bled band edge, and as thin ikat rails under the category tabs, product photos and the order bump. Below the silk, the food sits on warm cotton (`ground`) in calm, photo-first white cards. The silk carries identity; the cards carry appetite and price.

The system is dense and one-handed: a single column no wider than 512px, 16px gutters, primary actions stacked at thumb height, sticky CTAs above the bottom navigation. It lives inside Telegram's WebView, so it follows Telegram's light or dark scheme (`<html class="dark">`), safe areas and native Back button, and it never reads as a website in a frame. Because this is a universal template, all identity colour flows from four tokens written from `config/brand.ts` (`--brand`, `--on-brand`, `--silk-2`, `--silk-3`); the indigo, pomegranate and saffron values recorded here are the default restaurant, not a constant.

Confirmed rejection: the category default of a grey ground with one orange accent and emoji icons.

**Key Characteristics:**
- Full-width brand silk fields with a low-contrast satin sheen, always bounded by a seeded, stepped abr edge.
- Warm cotton ground, white photo-first cards, ink-tinted soft shadows.
- Geologica Variable for headings, buttons and every price (tabular numerals); system UI for body and product names.
- Honest pricing: struck grey old price, red new price, saffron discount tag.
- Lucide line icons at 1.75 stroke; heavier 2.25 only for action glyphs in filled controls.
- Expo ease-out motion; sheets rise, the rail ripples on category change, nothing bounces.

## Colors

Three dye colours of atlas silk on undyed cotton, with ink for text and one honest red for prices.

### Primary
- **Atlas Indigo** (`brand`): the silk field itself, primary buttons, quick-add "+", active category tab, selected payment icon, switch track when on, the focus outline and the text caret. Rebrandable: components reference `var(--brand)`, never the hex.
- **White Weft** (`on-brand`): text and glyphs on any brand surface; also the inverse button fill on the story viewer. A restaurant with a pale brand colour sets this to dark.
- **Indigo Ink** (`brand-ink`, dark `brand-ink-dark`): brand-coloured text and icons on surfaces ("See all" links, active nav item, trust-row icons, ingredient lozenges). Light mode equals `brand`; dark mode lifts it to `color-mix(in srgb, var(--brand) 38%, #fff)` so it stays legible on `surface-dark`.
- **Indigo Wash** (`brand-soft`, dark `brand-soft-dark`): `color-mix(in srgb, var(--brand) 10%, var(--surface))` (32% in dark). Secondary buttons, the product-sheet trust block, empty-state icon discs.

### Secondary
- **Pomegranate Silk** (`silk-magenta`): the middle dye band of every abr edge, one lozenge tone in rails, the active-nav thread's second segment, the cart count badge and one arc of the unseen story ring.

### Tertiary
- **Saffron Silk** (`silk-saffron`): the lowest dye band of every abr edge, rail lozenges, the discount tag, the initial avatar disc, the toast check, the bump's new price when the bump is on, and the text-selection highlight (55% mix).

### Neutral
- **Undyed Cotton** (`ground`, dark `ground-dark`): page background, sticky tab bar and sticky CTA backing; also passed to Telegram as the WebView background colour.
- **Bleached Cotton** (`surface`, dark `surface-dark`): cards, grouped lists, inputs, the bottom sheet and the bottom navigation bar.
- **Loom Ink** (`ink`, dark `ink-dark`): primary text; the toast fill (with `ground` text).
- **Faded Ink** (`ink-2`, dark `ink-2-dark`): secondary text, labels, struck old prices, inactive nav, off-switch track (30%).
- **Selvedge Line** (`line`, dark `line-dark`): 1px borders on inputs, outline buttons, inactive tabs and steppers; list dividers; the dashed rule above the cart total.
- **Raw Cotton** (`muted`, dark `muted-dark`): image placeholders, skeletons, ghost and outline hover, unselected payment icon wells.
- **Night Scrim** (`scrim` at 55%): the backdrop behind bottom sheets.
- **Price Red** (`sale`, dark `sale-dark`): the new price, and error text / error borders. Nothing else.
- **Leaf Green** (`ok`, dark `ok-dark`): "free" delivery fee and positive order states.

### Named Rules
**The Four-Token Rebrand Rule.** All identity colour flows from `--brand`, `--on-brand`, `--silk-2` and `--silk-3`, set in `config/brand.ts`. `brand-ink` and `brand-soft` are derived with `color-mix`, never typed. A component that hard-codes the default indigo breaks every other restaurant.

**The Silk Field Rule.** Brand colour arrives as a full-width field or band, not as a tinted chip on grey. Small brand fills (buttons, quick-add, the active tab) are the field's threads, not substitutes for it.

**The One Red Rule.** `sale` marks the new price and errors only. Old prices are `ink-2` struck through (1.5px decoration); discounts are saffron tags, never red.

**The Saffron Carries Ink Rule.** Saffron surfaces (discount tag, avatar disc) always carry fixed ink `#17142A`, in dark mode too, because saffron stays light in both schemes.

## Typography

**Display Font:** Geologica Variable (with system-ui, sans-serif), loaded from `@fontsource-variable/geologica`
**Body Font:** system-ui (with -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif)

**Character:** Geologica's geometric, slightly condensed variable sans gives headings and prices a confident, signage-like voice with full Cyrillic and Latin coverage; the platform's own UI face keeps body copy and dish names native to Telegram on every device.

### Hierarchy
- **Display** (700, 30px, 1.05): onboarding slide titles. The story viewer pushes it to 44px at line-height 1.
- **Headline** (700, 26px, 1.1): the Home offer on the silk field and the order-success title. The Home greeting sits just below at 22px / 1.15.
- **Page Title** (700, 28px, 1): inner-page headers (Catalog, Cart, Profile).
- **Title** (700, 20px): section headings (Popular, Delivery, Payment); the product sheet name runs at 24px.
- **Body** (400, 15px, 1.45): the base size on `html`; descriptions at 15px, onboarding body at 17px. Inputs are 16px to stop iOS zoom.
- **Body Strong** (600, 15px): product names on cards (system face, normal tracking, clamped to two lines), payment method names, tab labels (14px).
- **Label** (500, 13px): field labels, fact rows, hints under payment methods, error text.
- **Nav Label** (500, 11px): bottom navigation captions; story captions at 12px.
- **Button** (Geologica 600, 15px, -0.01em): every button and button-styled link; 16px at the large size.
- **Price** (Geologica 700, 17px, tabular): card prices; 22px in the product sheet, 26px for the cart total, 28px on success. Old price 12px regular, struck.

### Named Rules
**The Tabular Price Rule.** Every number a customer pays, counts or compares (prices, quantities, badges, step numerals) uses the `price` treatment: Geologica, `tabular-nums`, -0.01em. Prices are formatted with spaces (`32 000 so'm`) and the currency word drops to 12px semibold.

**The Plain Dish Rule.** Headings h1-h3 are Geologica by default with -0.02em tracking and balanced wrapping, but dish names on cards are set back to the system face at normal tracking. The menu reads like food, not a poster.

## Layout

A single phone column: `max-width: 512px`, centred, with a 16px side gutter on pages, 20px inside the product sheet and 24px on onboarding. Main content reserves 112px at the bottom for the fixed navigation. Vertical rhythm is 24px between Home sections and 28px between Cart sections; cards in grids and rails sit 12px apart; tabs 8px apart. The catalogue is a two-column grid; Home's popular rail is a horizontal snap scroller of 158px cards with `scroll-padding` matching the gutter.

The Home first viewport is the silk field: avatar, 22px greeting and the quiet restaurant name, the story rings, then the offer headline and text, all on the field, ended by a full-width 32px abr edge. The hero photo card sits on cotton just below that edge, inset by the gutter. Inner pages use a cotton page header; the catalogue's tabs and rail stick to the top on a `ground` backing.

Primary actions sit at thumb height: bottom sheets keep their CTA in a bordered sticky footer; the cart's confirm button is fixed just above the bottom navigation with a 20px cotton fade above it. Every fixed bottom element pads by `max(env(safe-area-inset-bottom), 0.5rem)`.

**The Thumb Column Rule.** One column, 512px maximum, and the next action is always a full-width button within reach of the thumb.

## Elevation & Depth

A hybrid system. The silk fields and abr bands carry hierarchy by colour; shadows are reserved for objects that hold food or float over content, and they are soft, long and ink-tinted (`rgba(23,20,42,…)`) so they read as cotton on cotton, never as grey haze. Brand-filled buttons cast a short glow in their own colour. The silk field adds depth by sheen alone: a 1px-every-4px warp thread at 2.8% white and a 100° satin wave peaking at ±7%, keeping the field's luminance shift around 6%.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 1px 2px rgba(23,20,42,0.06), 0 8px 24px -16px rgba(23,20,42,0.25)`): product cards.
- **Hero lift** (`box-shadow: 0 2px 4px rgba(23,20,42,0.06), 0 18px 36px -18px rgba(23,20,42,0.4)`): the Home hero photo card.
- **Brand glow** (`box-shadow: 0 8px 18px -10px var(--brand)`): primary buttons; quick-add uses `0 6px 14px -8px var(--brand)`.
- **Sheet rise** (`box-shadow: 0 -12px 40px -12px rgba(0,0,0,0.35)`): bottom sheets.
- **Toast float** (`box-shadow: 0 10px 30px -12px rgba(0,0,0,0.5)`): the toast.
- **Photo on silk** (`box-shadow: 0 24px 48px -24px rgba(0,0,0,0.6)`): onboarding photos on the field.
- **Thumb** (`box-shadow: 0 2px 6px rgba(0,0,0,0.22)`): the switch knob.
- **Focus halo** (`box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand) 14%, transparent)`): focused inputs, with a brand border.

### Named Rules
**The Silk Over Shadow Rule.** Brand surfaces are flat and never get a drop shadow; only cotton objects (cards, sheets, the toast) and brand buttons lift. Depth on silk comes from sheen, not elevation.

## Shapes

Generous, soft rectangles: corners grow with the object (8px tags, 10px step numerals and stepper buttons, 12px tabs and icon wells, 14px fields and medium buttons, 16px large buttons, 18px panels, 20px cards and grouped lists, 24px hero card, 26px sheet top, 28px onboarding photos). Circles are reserved for avatars, story rings, badges, the switch and radio dots. Borders are a single 1px `line`.

The signature form is the abr edge, drawn by `AtlasBand` from a seed. The **edge** variant is a 520px tile (wide enough not to repeat on a phone) of six stepped layers: brand, pomegranate and saffron bands, each preceded by a partial-opacity bleed row (55%, 50%, 45%) so the dye appears to have run along the warp. Threads vary between 2 and 4px; the boundary is cut into irregular almond "tongues" 34-80px wide. The **rail** variant is a short 64px tile (48px in the product sheet and bump) of two stepped lozenges on brand, each shadowed by a 40% copy offset 1.5px. Ingredient bullets reuse a 10px stepped lozenge in `brand-ink`. The story viewer flips the edge (rotated 180°) where the photo meets the field.

**The Stepped Edge Rule.** A brand field never ends in a straight line, a CSS wave or a curve. It ends in a full-width AtlasBand edge (32px tall at standard size), and the field above it carries the `silk-field` sheen.

## Components

Tactile and confident: big, rounded, one-tap controls in brand fills, with prices that never hide.

### Buttons
- **Shape:** gently rounded (14px at medium, 12px small, 16px large); heights 36 / 44 / 54px.
- **Primary:** `brand` fill, `on-brand` text in Geologica 600 15px, brand glow beneath. Hover lifts brightness 110%, active 95% and scales to 0.98 over 200ms on the silk ease.
- **Secondary:** `brand-soft` wash with `brand-ink` text ("New order", retry).
- **Outline / Ghost:** `surface` with a 1px `line` border, or transparent; both hover to `muted`.
- **Inverse:** `on-brand` fill with `brand` text, used on silk (story viewer CTA).
- **Disabled / Loading:** 45% opacity, no pointer events; loading adds a 16px spinning ring in the current colour and sets `aria-busy`.

### Chips (category tabs)
- **Style:** 40px tall, 12px corners, 1px `line` border on `surface`, 14px semibold label with a 17px Lucide icon.
- **State:** active fills with `brand` and `on-brand` text; inactive hovers to `muted`. The active tab scrolls itself to centre.

### Cards / Containers
- **Corner Style:** 20px (product cards, payment group, totals, order bump); 24px for the Home hero card.
- **Background:** `surface` on `ground`; photos sit edge-to-edge on top (square on cards, 16:8 on the hero, 5:4 in the sheet) over a `muted` placeholder.
- **Shadow Strategy:** card rest and hero lift (see Elevation & Depth); grouped lists are flat.
- **Border:** none on cards; grouped lists use 1px `line` dividers.
- **Internal Padding:** 12px on product cards, 14-16px on lists and panels.

### Inputs / Fields
- **Style:** `surface` fill, 1px `line` border, 14px corners, 12px by 16px padding, 16px text; a 13px `ink-2` label above with a 15px Lucide icon.
- **Focus:** border shifts to `brand` and a 4px brand halo at 14% fades in over 200ms.
- **Error:** border and a 13px message in `sale`, announced with `role="alert"`.

### Navigation
- **Bottom bar:** fixed `surface` bar with a top `line` border, four equal tabs (Home, Catalog, Cart, Profile), 23px Lucide icons over 11px labels in `ink-2`.
- **Active:** label and icon turn `brand-ink`, and a 3px by 32px tri-colour thread (brand 3 : pomegranate 1 : saffron 1) fades in at the top edge.
- **Cart badge:** an 18px pomegranate pill in white tabular numerals that pops in (scale 0.6 to 1, 360ms) whenever the count changes.

### Product Card
Photo-first: square image (scales to 1.03 on press over 500ms), optional saffron `−N%` tag top-left, two-line dish name, struck old price above the red new price, and a 40px brand quick-add "+" pinned bottom-right. Once in the cart, a brand quantity badge with a `surface` ring appears top-right. Tapping the card opens the product sheet; the "+" adds without leaving.

### Bottom Sheet
Rises from the bottom (360ms, silk ease) over a 55% night scrim; 26px top corners, max 92dvh, a white drag handle over the photo, drag-down past 110px or Escape to close (240ms ease-in). The CTA lives in a bordered sticky footer. The product sheet stacks photo, a 12px rail, name and price, ingredient lozenges, a `brand-soft` trust block (only promises the restaurant enabled in `brand.ts`), the quantity stepper, then "Add to cart — price".

### Order Bump
A 20px-cornered card topped by a 12px rail: 60px photo, offer sentence, struck and new price, and a 52 by 30px switch. Switching on floods the whole card with `brand` (300ms), turns the new price saffron and the old price `on-brand` at 70%.

### Payment Methods
A radio group in one flat `surface` card with `line` dividers: a 40px icon well (`muted`, or `brand` when selected), name and hint, and a 22px ring that fills with a brand dot. Unavailable providers sit at 45% opacity with a "soon" hint.

### Atlas Band (signature)
The `AtlasBand` component (see Shapes). The category rail under the tabs is the signature interaction: on category change the rail translates by half a motif cell per index (320ms, silk ease) and re-mounts with a travelling ripple: the motif flows in from one full 64px lozenge cell on the side of the newly chosen tab, with a ±22deg skew and 0.6px blur easing to rest (320ms). It never animates on its own.

### Motion
One curve, `cubic-bezier(0.16, 1, 0.3, 1)` (expo ease-out, `--ease-silk`), for sheets (360ms), rail ripple (320ms), badges (360ms), list rise (420ms, 10px up with fade), switches (300ms) and button press (200ms). Fades are 200ms ease-out. Reduced-motion collapses every animation and transition to 0.01ms.

**The Silk Ease Rule.** Everything decelerates on the expo curve and comes to rest; nothing bounces or overshoots.

**The Two Strokes Rule.** Lucide line icons render at 1.75 stroke everywhere (nav, tabs, fields, facts, payment, empty states). Only action glyphs inside filled controls (stepper −/+, quick-add +, story close and arrow, success check) step up to 2.25.

## Do's and Don'ts

### Do:
- **Do** reference colour through the tokens (`var(--brand)`, `--silk-2`, `--silk-3`, `--on-brand`, `--brand-ink`, `--brand-soft`) so a restaurant can rebrand from `config/brand.ts` alone.
- **Do** end every full-width brand field with an AtlasBand edge (32px, 520px seeded tile) and give the field the `silk-field` sheen.
- **Do** show price as struck `ink-2` old price above a red tabular new price, with a saffron `−N%` tag on the photo.
- **Do** set every price, quantity and badge in Geologica with tabular numerals.
- **Do** keep the primary action full-width at thumb height and pad fixed bottom elements by the safe-area inset.
- **Do** use Lucide line icons at 1.75 stroke, and 2.25 only for action glyphs inside filled controls.
- **Do** animate on `cubic-bezier(0.16, 1, 0.3, 1)`: sheets 360ms, the rail ripple 320ms.
- **Do** verify both Telegram light and dark schemes; body text holds at least 4.5:1 in each.

### Don't:
- **Don't** fall back to the category default: a grey ground with one orange accent and emoji icons.
- **Don't** hard-code the default indigo, pomegranate or saffron hex in a component.
- **Don't** use `sale` red for anything but the new price and errors.
- **Don't** end a brand field with a straight edge, a CSS wave or a rounded bottom.
- **Don't** animate the atlas band continuously or on scroll; it moves only when the category changes.
- **Don't** use bounce, spring overshoot or elastic easing.
- **Don't** put drop shadows on silk fields or bands.
- **Don't** add uppercase kickers or eyebrow labels above headings, or emoji and text-glyph icons.
