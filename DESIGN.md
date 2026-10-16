---
name: Fast Delivery
description: A rebrandable Telegram Mini App for local fast-food delivery, built to the category standard of Yandex Eda and Uzum Tezkor, with a warm-grey ground, white cards, food and prices up front, and one saffron action colour.
colors:
  brand: "#ffc21a"
  on-brand: "#1c1a14"
  brand-soft: "#fff4d6"
  brand-ink: "#8a5a00"
  sale: "#d92d27"
  ok: "#127a42"
  ink: "#17181a"
  ink-2: "#6b6c70"
  ground: "#f4f4f2"
  surface: "#ffffff"
  tile: "#f1f0ec"
  line: "#e6e5e1"
  track: "#cfcec9"
  scrim: "rgb(23 24 26 / 0.42)"
typography:
  display:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  section:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  subsection:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
  item:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.3
  button:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  label:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
  caption:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
  nav:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 500
  price:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
    fontFeature: "\"pnum\" 1"
  price-lg:
    fontFamily: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
    fontFeature: "\"pnum\" 1"
rounded:
  segment: "9px"
  well: "12px"
  field: "14px"
  inner: "16px"
  tray: "18px"
  card: "20px"
  banner: "24px"
  slide: "28px"
  pill: "9999px"
spacing:
  inset: "6px"
  tile-gap: "8px"
  grid-gap: "10px"
  row: "12px"
  gutter: "16px"
  sheet: "20px"
  stack: "24px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.field}"
    padding: "0 20px"
    height: "48px"
  button-primary-lg:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.inner}"
    padding: "0 24px"
    height: "56px"
  button-secondary:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.field}"
    padding: "0 20px"
    height: "48px"
  button-ghost:
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.inner}"
    height: "56px"
  button-ghost-hover:
    backgroundColor: "{colors.tile}"
  add-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "40px"
  stepper-brand:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.pill}"
    height: "40px"
  stepper-neutral:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "40px"
  stepper-neutral-sm:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "32px"
  cart-bar:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.tray}"
    padding: "0 16px 0 8px"
    height: "56px"
  badge-count:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    height: "18px"
  category-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.item}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 4px"
    height: "40px"
  category-chip-active:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.item}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 4px"
    height: "40px"
  category-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.tray}"
    padding: "8px 4px 10px"
  story-tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.surface}"
    rounded: "{rounded.card}"
    width: "88px"
    height: "112px"
  card-product:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.inset}"
  card-list:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.row}"
  banner-hero:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.banner}"
    padding: "16px"
  fact-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  order-bump:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.row}"
  order-bump-on:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.row}"
  input-field:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
  input-field-focus:
    backgroundColor: "{colors.surface}"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "48px"
  segment:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.well}"
    padding: "3px"
  segment-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.segment}"
  switch-off:
    backgroundColor: "{colors.track}"
    rounded: "{rounded.pill}"
    width: "50px"
    height: "30px"
  switch-on:
    backgroundColor: "{colors.brand}"
    rounded: "{rounded.pill}"
    width: "50px"
    height: "30px"
  status-pending:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.brand-ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  status-done:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  avatar-initial:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.pill}"
    size: "40px"
  nav-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    typography: "{typography.nav}"
  nav-item-active:
    textColor: "{colors.ink}"
  sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.banner}"
  toast:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.inner}"
    padding: "10px 16px 10px 10px"
---

# Design System: Fast Delivery

## Overview

**Creative North Star: "The Quiet Counter"**

The app is a calm, premium delivery counter that sets the food out and gets out of the way. It is the category standard played straight, at the craft level of Yandex Eda and Uzum Tezkor / Express24. Food photography and prices lead. Chrome recedes into a warm-grey ground, white cards with no outlines, near-black type and one saffron colour that marks the thing to press. The whole flow is built for a hungry person ordering one-handed inside Telegram: find food by chips or search, tap "+", watch it turn into a stepper in place, watch the floating cart bar update, confirm in one tap.

Density is comfortable and phone-first, inside a single 512px column. The type is one face, Onest, set in sentence case at three weights. Depth is tonal: white on warm grey, with photographs sitting on soft grey tiles. Shadows appear only under things that genuinely float. Motion is an expo ease-out. Sheets rise, the stepper pops in where the "+" was, the cart bar slides up, and nothing bounces.

The app is always light, including inside Telegram's dark mode, because the user asked for no black surfaces. The Telegram header and WebView background are painted the same warm grey as the ground (`brand.chrome`, #F4F4F2), so the app reads as stitched into Telegram rather than framed by it. Identity is four tokens in `config/brand.ts` (brand, on-brand, brand-soft, brand-ink), which restaurants rebrand. Three earlier worlds are rejected and survive only as anti-references. **"The White Plate on Red"** was a red reference look: a loud #f00000 field, green circular add buttons, red rounded-square steppers, Red Hat Display / Manrope type, pink blush offer cards and food on white plates. **Pop** used a cream ground, a mustard accent, Rubik caps, 2px brown outlines and hard stamps. **Atlas Silk** was ornamental and traditional.

**Key Characteristics:**
- Always light: a warm-grey ground (#f4f4f2) and white cards in every Telegram theme, with no dark tokens.
- One saffron brand fill with ink text on it, reserved for the primary action, the cart bar, the live stepper and the current selection.
- Red appears only as a discounted current price (and errors), and green only as "Bepul" free delivery and success.
- Food is shown in rounded photo tiles on soft grey, and prices sit above names.
- A white "+" on the photo morphs into a saffron stepper in place, and a floating saffron cart bar sits above the labelled bottom nav.
- One discount signal: a red current price plus a struck grey old price, with no percentage badges.
- Onest Variable for Latin and Cyrillic, at weights 400 / 500 / 600 only, in sentence case.
- Only two shadows, for floating elements and small controls. Motion is expo ease-out, and nothing bounces.

## Colors

A quiet warm-neutral palette (ground, white, tile, ink) carries almost every pixel. One saffron fill marks action and selection, and red and green each have a single, narrow job.

### Primary
- **Saffron** (`brand`): the restaurant's colour, written to `<html>` as `--brand` from `config/brand.ts`. It fills the primary button, the floating cart bar, the active stepper on a product photo, the active category chip, the logo mark, the selected payment radio, the switch's on track, the selected order-bump border, the unseen-story ring, the onboarding step-number discs and the success check disc. It is never used as text.
- **Saffron Ink-on** (`on-brand`): the warm near-black for all text and icons on saffron (10.75:1). Saffron never carries white text.
- **Saffron Cream** (`brand-soft`): a pale tint for the unselected order-bump card, the avatar initial disc, the "new" and "confirmed" status pills and text selection.
- **Saffron Ink** (`brand-ink`): a deep amber-brown for text on Saffron Cream: the avatar initial and pending status labels (5.41:1 on cream).

### Secondary
- **Discount Red** (`sale`): the current price, only when the product is discounted. It is used on card prices, the sheet price and cart-row line totals. It is also the colour of field errors (border and message) and the cancelled-order status. A full-price product's price is ink. It measures 4.82:1 on white.

### Tertiary
- **Done Green** (`ok`): used for the "Bepul" free-delivery fee in the cart total, the toast's check disc and the "delivering" status pill. It means "good news, nothing to pay or do". It measures 5.40:1 on white.

### Neutral
- **Counter Grey** (`ground`): the page background, the sticky catalog-chip band (at 95% with blur), the success screen and the cart's sticky CTA band. It is also `brand.chrome`, the Telegram header and background colour.
- **White** (`surface`): every card, the hero banner, the bottom bar, sheets, the search field on the ground, the toast and the add button.
- **Photo Tile** (`tile`): the soft grey behind every food photograph, plus the secondary button, input fill, neutral stepper, icon wells, the language segment track and skeletons. It is the "inside a white card" tone.
- **Ink** (`ink`): headings, names, full prices, active nav and the focus ring (16.13:1 on ground). It also fills the count badge on the cart bar, and it is never used as a surface larger than a badge.
- **Graphite** (`ink-2`): secondary text: greetings, subtitles, descriptions, struck old prices, inactive nav, field labels and placeholders (5.24:1 on white, 4.76:1 on ground).
- **Hairline** (`line`): dividers between rows inside a white card, the bottom bar's top edge, the sheet footer's top edge and the total rule.
- **Track Grey** (`track`): the switch's off track and the scrollbar thumb.
- **Scrim** (`scrim`): ink at 42% behind bottom sheets.

### Named Rules
**The Single Saffron Rule.** Saffron is the one colour that says "press this" or "this is chosen". Use it for the main action, the cart bar, the live stepper and the selected state, and nowhere else. Ink is always the text on top of it.

**The Red Means Cheaper Rule.** Red appears on a price only when that price is discounted, always paired with the struck old price in Graphite. Outside prices, red is reserved for errors and cancelled orders.

**The Green Means Done Rule.** Green appears only for free delivery and for success (the toast check, the delivering status). It is never used for an action button.

**The Always Light Rule.** There is one theme. No `.dark` class, no `dark:` variants, no dark tokens. The app paints Counter Grey and white even in Telegram's dark mode, and Telegram's header and background are set to `brand.chrome`.

**The Four Tokens Rule.** A restaurant rebrands by editing `config/brand.ts` only. Brand, on-brand, brand-soft and brand-ink must keep on-brand and brand-ink at 4.5:1 or better against their grounds.

## Typography

**Display Font:** Onest Variable (with system-ui, -apple-system, Segoe UI, Roboto, Arial)
**Body Font:** Onest Variable (same stack)

**Character:** One contemporary grotesque covers both Uzbek Latin and Russian Cyrillic, so a bilingual screen reads as one voice. Headings tighten (-0.02em, balanced wrapping) and carry weight 600. Body text stays at 400, so names and descriptions read calm and prices stand out by size and colour, not by heaviness.

### Hierarchy
- **Display** (600, 40px, line-height 1, -0.03em): the "Rahmat!" thank-you on the success screen. The story viewer title uses 34px at the same tracking.
- **Headline** (600, 28px, line-height 1.15): the home greeting and page titles (Katalog, Savatcha, Profil). Onboarding slide titles use 30px at -0.03em.
- **Title** (600, 24px): the product name in the sheet. Sheet and empty-state headings use 22px, and the hero banner headline uses 21px.
- **Section** (600, 20px): section heads such as "Katalog", "Ommabop", delivery and payment, plus the profile name.
- **Subsection** (600, 17px): headings inside sheets and the profile ("Tarkibi", language, contacts, orders), and the "Jami" total label.
- **Body** (400, 15px, line-height 1.45): base text, descriptions and list rows. Inputs render at 16px to stop iOS zoom.
- **Item** (400, 14px, line-height 1.3): product names on cards (clamped to two lines), the order-bump text and toast text (500).
- **Button** (600, 15px; 16px large, 13px small): sentence case.
- **Label** (500, 13px): field labels, the language segment and the "so'm" unit beside a card price.
- **Caption** (500, 12px): category tile labels, hero fact chips, status pills and the address-pill "Yetkazish manzili" line.
- **Nav** (500, 11px): the bottom-bar labels and count badges.
- **Price** (600, 17px on cards; **Price Large** 22px in the sheet and cart total): set in the price utility.

### Named Rules
**The Proportional Price Rule.** Every price, total and count uses the `price` utility, which applies proportional numerals plus -0.01em tracking. This is deliberate: Onest's tabular "1" is wide enough to split numbers ("1 79 000"), so tabular figures are never switched on.

**The Three Weights Rule.** Use only 400, 500 and 600. Emphasis comes from size, ink versus Graphite, and saffron, never from bold or black weights.

**The Sentence Case Rule.** Buttons, chips, tabs and headings are sentence case. There are no uppercase labels, eyebrows or letter-spaced kickers.

## Layout

The app is a single phone column capped at 512px (`max-w-lg`), centred on wide Telegram desktop windows, with a 16px gutter. Home sections stack 24px apart: the address pill with avatar, greeting and search, the stories row, the photo hero banner, a four-up category tile grid with 8px gaps, and a horizontal "Ommabop" row of 164px product cards. The catalog is a two-column product grid with a 10px gap, under a category chip row that sticks to the top on a blurred 95% ground band. The cart stacks white cards 24px apart: the order stack, the order bump, delivery fields, payment and totals.

Horizontal rows (stories, chips, popular) scroll with hidden scrollbars and bleed to the screen edge while their first item stays on the gutter. The active chip scrolls itself to the centre. Sheets use 20px side padding. Card interiors use 6px around photos and 12–16px for rows and panels.

Fixed chrome respects Telegram safe areas. The labelled bottom bar pads by `max(env(safe-area-inset-bottom), 0.5rem)`. The floating cart bar and the cart's sticky confirm button sit 62px plus that inset above the bottom, so they float over the nav. The main column reserves 160px at the foot. The cart's confirm band is solid ground with a 24px upward fade, so content scrolls under it cleanly.

## Elevation & Depth

Depth is tonal first: white cards on Counter Grey, and photographs on Photo Tile inside white cards. Nothing at rest is lifted. Two shadows exist, both ink-tinted rather than black. The first is for elements that genuinely float over scrolling content. The second is a tiny contact shadow that keeps small white or saffron controls legible on top of photographs. Sheets separate from the page by the 42% ink scrim, not by a shadow.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 10px 30px -12px rgb(23 24 26 / 0.28), 0 2px 6px -2px rgb(23 24 26 / 0.08)`): the floating cart bar and the toast.
- **Thumb** (`box-shadow: 0 1px 3px rgb(23 24 26 / 0.16), 0 1px 1px rgb(23 24 26 / 0.06)`): the "+" add button and the live stepper on a photo, the add-on "+" buttons, the switch knob, the sheet's drag handle, the white close buttons over photos and the active language segment.

### Named Rules
**The Only-What-Floats Rule.** Cards, banners, tiles, chips, inputs and the bottom bar have no shadow. Float is for things that hover above scrolling content; Thumb is for small controls sitting on a photo or a track.

## Shapes

The form language is softly rounded rectangles that step up with size, with full pills for everything small and tappable inside a card. The scale runs: the language segment 9px; icon wells and the segment track 12px; inputs, search, default buttons and list thumbnails 14px; photo tiles inside cards, large buttons, toasts and inner panels 16px; the cart bar, category tiles and onboarding step cards 18px; product, list and totals cards 20px; the hero banner, sheet tops and the empty-cart panel 24px; onboarding photographs 28px. Chips, steppers, the add button, badges, fact chips, status pills, switches, avatars and progress dots are full pills. Stories are 88x112 rounded rectangles (17.5px inner, 20px with the ring), never circles.

Food photography is always clipped: rounded squares in cards (16px), rounded thumbnails in cart rows (14px), circles only inside category chips and tiles, and a full-width photo top on the hero banner and the product sheet.

### Named Rules
**The Tone-Not-Stroke Rule.** A card on the ground never carries an outline. Hairlines appear only as dividers inside a white surface (list rows, the totals rule, the sheet footer, the bottom bar's top edge, and the trust panel inside the product sheet). A coloured border is a state: ink at 70% on a focused field, red on an errored field, saffron on the selected order bump and payment radio.

## Components

### Buttons
Calm, solid and thumb-sized, with softly squared corners rather than pills.
- **Shape:** 14px radius at the default 48px height, 16px at the large 56px height, and 12px at the small 36px height.
- **Primary:** Saffron with an Ink-on 600 label. It carries "Katalogni ko'rish", "Savatchaga qo'shish — 64 000 so'm", the cart's confirm-with-total and "Boshlash". Large buttons fill the width at a sheet or screen foot.
- **Hover / Focus / Active:** hover brightens to 1.04 and press darkens to 0.95 with a 0.98 scale, over 200ms on the expo ease-out. Focus is the global 2px ink outline offset by 2px. Disabled drops to 45% opacity. Loading shows a 16px spinning ring in the current colour.
- **Secondary:** a Photo Tile fill with an ink label, used for "Yangi buyurtma berish" under the primary in the hero banner and for retry.
- **Ghost:** transparent with an ink label and a Photo Tile fill on hover. Its one use, "O'tkazib yuborish" in onboarding, sets the label in Graphite.
- The button API also has outline and inverse variants, but no shipped surface uses them.

### Add Button and Stepper (signature)
The "+" is a 40px white circle with an ink 2.25-stroke Lucide plus and the Thumb shadow, pinned 8px inside the bottom-right of the product photo. The first tap replaces it in place with a saffron pill stepper ("− 2 +", 40px tall, 600 count), which pops in over 280ms. The stepper keeps the Thumb shadow, so it still reads over the photo. In the sheet, the quantity stepper is neutral (Photo Tile). In cart rows it is a 32px neutral pill whose "−" becomes a trash icon at quantity 1. Press scales icon buttons to 0.9.

### Floating Cart Bar (signature)
Whenever the cart is not empty, and on any page except the cart, a 56px saffron bar with an 18px radius floats 12px in from the column edges, above the bottom nav, with the Float shadow. It holds a 40px translucent-white bag well with an ink count badge, a "Savatcha" label and the total at the right. It enters with bar-in. The count badge pops and the total re-fades on every change, so adding food is visible from anywhere. Tapping it goes to the cart, and press scales it to 0.985.

### Discount Display (signature)
The only discount signal is the price pair. The current price is in Discount Red, with the struck old price in Graphite on the line below on cards (or beside it in the sheet and cart). There are no "−20%" badges, ribbons or percentage tags. On cards the price comes first and the old-price line is always reserved (18px), so product names align across the grid.

### Chips
- **Category chip (catalog):** a 40px white pill with a 32px round food photo (or a Lucide grid icon for "Barchasi") and a 14px 500 label. The active chip fills saffron with ink text. The row sticks to the top on a blurred ground band.
- **Category tile (home):** four up, white with an 18px radius, a 52px round photo on Photo Tile and a 12px label. Tapping one opens the catalog filtered.
- **Fact chip:** a 92% white blurred pill on the hero photo with a 14px Lucide icon and a 12px label (for example "30 daqiqa", "100% halol", "Bepul yetkazish"). Only the promises the restaurant switched on in `brand.ts` appear.
- **Status pill:** a 12px label in a pill. Pending statuses use Saffron Cream with Saffron Ink. Delivering uses green at 10% with green text, completed uses Photo Tile with Graphite, and cancelled uses red at 10% with red text.

### Cards / Containers
- **Corner Style:** 20px for product, list and totals cards, and 24px for the hero banner.
- **Background:** white on Counter Grey. Photographs sit on Photo Tile.
- **Shadow Strategy:** none (see The Only-What-Floats Rule).
- **Border:** none. Rows inside a card are divided by Hairlines.
- **Internal Padding:** 6px around a product photo, then 6px text inset; 12px for cart rows; 16px for list rows, form panels and totals.
- **Product card:** a square 16px-rounded photo, then the price line (17px), the struck old-price line and a two-line 14px name, with the add button or stepper on the photo corner.
- **Hero banner:** a white card with a 2:1 photo top carrying the fact chips, then a 21px headline, a Graphite line, and a stacked primary and secondary pair.

### Stories
These are 88x112 rounded-rectangle photo tiles with a dark bottom gradient and a 13px white 600 caption. Unseen stories carry a 2.5px saffron ring separated by a 2px ground gap, and seen stories drop the ring. The viewer is full-screen: the photo on top, with white progress bars over a light top gradient and a white 40px close button. A white 24px-radius panel overlaps the photo by 24px and carries a 34px title, a 17px Graphite line and a large primary CTA.

### Inputs / Fields
- **Style:** a Photo Tile fill with a 14px radius, 12px 16px padding and a transparent 1px border. Above it sits a 13px 500 Graphite label with a 15px Lucide icon. The caret is ink.
- **Focus:** the fill turns white and the border turns ink at 70%, over 200ms. The search field (white on ground) gains the same ink border on focus-within.
- **Error / Disabled:** a red border on a white fill, a 13px 500 red message below (`role="alert"`) and `aria-invalid`.

### Navigation
A fixed white bar with a Hairline top edge, holding four labelled tabs: Bosh sahifa, Katalog, Savatcha, Profil. Each tab is a 24px Lucide icon over an 11px 500 label. Inactive tabs are Graphite at 1.75 stroke. The active tab is ink at 2.1 stroke, with no pill or dot. The cart tab carries an 18px count badge with a 2px white ring that pops in on every change. The badge is filled with ink, like the cart bar's, because red is reserved for cheaper prices and errors. Selection fires Telegram haptics. Telegram's native Back button closes the open sheet first, then navigates back.

### Bottom Sheet (Product Sheet)
The sheet rises from the bottom (sheet-up, 380ms) with a 24px top radius over the ink scrim, at most 92dvh tall. It closes by backdrop tap, Escape, a 110px drag on the white handle, or Telegram Back, and falls away over 200ms ease-in. The product sheet opens on a full-width 4:3 photo with a white close button. Below it come the 24px name, a 22px price (red only if discounted, with the struck old price), the neutral stepper, the description, the ingredient list on a 60% Photo Tile panel, a three-up add-on drinks row with white "+" buttons, and a Hairline-framed trust panel with icon discs. A sticky large primary "Savatchaga qo'shish — price" sits in a footer with a Hairline top edge.

### Order Bump
A 20px card offering a drink at a special price, with a 60px rounded photo, 14px offer text, the offer price beside the struck regular price, and a switch. When off, the card is Saffron Cream. When on, it turns white with a saffron border. The colour change runs over 300ms expo.

### Switch
A 50x30 pill: Track Grey when off and Saffron when on, with a 26px white knob carrying the Thumb shadow. The knob slides over 300ms expo.

### Payment Options
A single white 20px card with Hairline-divided radio rows. Each row has a 40px Photo Tile icon well, a 15px 500 name, a 13px Graphite hint, and a 24px radio ring that fills saffron with an ink check when selected. Unavailable methods sit at 45% opacity with a "soon" hint.

### Toast
A white 16px-radius card near the top of the screen with the Float shadow, holding a 24px green check disc and 14px 500 ink text. It rises in and leaves after 2.2s.

### Success Screen
A full-screen Counter Grey layer showing a 96px saffron disc with an ink check (pop-in), a 40px "Rahmat!", a 17px on-the-way line, a Graphite order line, a white details card (order number, total), and a large primary "home" button at the foot.

### Onboarding
Three swipeable slides on Counter Grey, with the logo and a compact UZ / RU segment on top. Each slide has a large 28px-rounded food photograph on Photo Tile and a 30px headline. The "how it works" slide uses three white step cards with saffron number discs. The foot carries ink progress dots (the active dot stretches to 24px), a ghost "skip" and a large primary "next" or "Boshlash".

### Motion
All motion uses expo ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`).
- sheet-up: sheets rise 100% over 380ms.
- pop-in: steppers, badges and the success disc grow from 0.6 scale with a fade over 280ms.
- bar-in: the cart bar rises 16px from 0.98 scale over 420ms.
- rise: toasts, cart rows and the re-filtered catalog grid rise 10px over 420ms.
- fade-in: backdrops and total changes fade over 200ms.
- Story progress fills linearly over 5s.

Press feedback is a 0.9–0.985 scale. Nothing overshoots, springs or bounces, and `prefers-reduced-motion` collapses everything to near-instant.

### Imagery
The product, hero, story and onboarding photographs in `public/images/products/` are AI-generated placeholders for each restaurant to replace with its own. The user waived regenerating them. Treat them as replaceable content, not as part of the system. Any replacement must sit on Photo Tile, be cropped to the shapes above, and carry no text baked into the image.

## Do's and Don'ts

### Do:
- **Do** put saffron (#ffc21a by default, from `config/brand.ts`) only on the primary action, the cart bar, the live stepper and the selected state, always with Saffron Ink-on (#1c1a14) text.
- **Do** separate surfaces by tone: white (#ffffff) cards on Counter Grey (#f4f4f2), and photos on Photo Tile (#f1f0ec).
- **Do** show a discount as a red current price (#d92d27) plus a struck Graphite old price, and show full prices in ink.
- **Do** set every price, total and count in the `price` utility with proportional numerals.
- **Do** use the white "+" that morphs in place into a saffron pill stepper, and keep the floating cart bar visible whenever the cart has items.
- **Do** use Lucide line icons (1.75–2.25 stroke) and the labelled four-tab bottom bar.
- **Do** keep type at Onest 400 / 500 / 600, in sentence case.
- **Do** reserve the Float shadow for the cart bar and toast, and the Thumb shadow for small controls on photos or tracks.
- **Do** animate with expo ease-out only: sheets rise, steppers and badges pop, lists rise 10px.
- **Do** paint Telegram's header and background with `brand.chrome` (#F4F4F2) and stay light in every Telegram theme.
- **Do** show only the promises a restaurant has switched on in `brand.ts`.

### Don't:
- **Don't** add a dark theme, `.dark` tokens or `dark:` variants, or use black as a surface. The user asked for no black.
- **Don't** put white text on saffron, or use saffron as a text colour. Use Saffron Ink on Saffron Cream instead.
- **Don't** add "−20%" badges, ribbons or percentage tags. The red price and struck old price are the single discount signal.
- **Don't** use red for anything but a discounted current price, errors and cancelled status, and don't use green for anything but free delivery and success.
- **Don't** outline cards on the ground, or add shadows to cards, banners, chips or the bottom bar.
- **Don't** switch prices to tabular figures. Onest's tabular "1" splits numbers.
- **Don't** use bold or black weights, uppercase labels, eyebrows or letter-spaced kickers.
- **Don't** show star ratings or review counts on products. No real ones exist.
- **Don't** use emoji or glyph characters as icons.
- **Don't** let anything bounce, overshoot or spring.
- **Don't** return to "The White Plate on Red": no #f00000 red field, green circular add buttons, red square steppers, pink blush cards, food on white plates, or Red Hat Display / Manrope.
- **Don't** return to Pop (cream ground, mustard accent, Rubik caps, 2px brown outlines, hard stamps) or to Atlas Silk (ornamental, traditional, silk-pattern decoration).
