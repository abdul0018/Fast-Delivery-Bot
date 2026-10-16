---
name: Fast Delivery
description: A rebrandable Telegram Mini App for local fast-food ordering, dressed as a loud burger-joint poster in cream, tomato red, mustard and brown ink.
colors:
  brand: "#e8392b"
  brand-fill: "#c53325"
  brand-ink: "#c53325"
  brand-soft: "#fcddcc"
  on-brand: "#fff3e2"
  accent: "#ffbf2e"
  on-accent: "#3a1d0f"
  sale: "#d62d20"
  ok: "#2b8a50"
  ink: "#3a1d0f"
  ink-2: "#86664f"
  outline: "#3a1d0f"
  hair: "rgb(58 29 15 / 0.14)"
  ground: "#fff3e2"
  surface: "#ffffff"
  muted: "#f8e7cf"
  bar: "#3a1d0f"
  bar-ink: "#d8c1ad"
  scrim: "rgb(28 17 10 / 0.6)"
  ground-dark: "#1c110a"
  surface-dark: "#2a1b11"
  ink-dark: "#fff3e2"
  ink-2-dark: "#c9ad95"
  outline-dark: "rgb(255 243 226 / 0.82)"
  hair-dark: "rgb(255 243 226 / 0.14)"
  muted-dark: "#3a271a"
  sale-dark: "#ff6a5a"
  ok-dark: "#4cc27e"
  brand-ink-dark: "#ee7066"
  brand-soft-dark: "#511b13"
  bar-dark: "#2a1b11"
  bar-ink-dark: "#b89c86"
typography:
  display:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "52px"
    fontWeight: 900
    lineHeight: 0.85
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  item:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Rubik Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 800
    letterSpacing: "0.01em"
  caption:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
  nav:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
  price:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 900
    lineHeight: 1.25
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\" 1"
rounded:
  field: "18px"
  panel: "24px"
  card: "26px"
  bar: "28px"
  block: "30px"
  sheet: "32px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  gutter: "16px"
  section: "20px"
  stack: "28px"
components:
  button-primary:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-primary-lg:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "54px"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.brand-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-outline:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-outline-on-brand:
    textColor: "{colors.on-brand}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-inverse:
    backgroundColor: "{colors.on-brand}"
    textColor: "{colors.brand-fill}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-ghost:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.muted}"
  icon-button-add:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    size: "40px"
  chip-category:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  chip-category-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  tag-discount:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  card-product:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "8px"
  panel-list:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "14px 16px"
  card-promo:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.block}"
    padding: "16px"
  card-bump:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.card}"
    padding: "14px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
  stepper:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "2px"
  stamp:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    typography: "{typography.price}"
    rounded: "{rounded.pill}"
    size: "36px"
  switch-on:
    backgroundColor: "{colors.ok}"
    rounded: "{rounded.pill}"
    width: "56px"
    height: "32px"
  toast:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  nav-bar:
    backgroundColor: "{colors.bar}"
    textColor: "{colors.bar-ink}"
    typography: "{typography.nav}"
    rounded: "{rounded.bar}"
  nav-item-active:
    textColor: "{colors.accent}"
  sheet:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.sheet}"
---

# Design System: Fast Delivery

## Overview

**Creative North Star: "The Burger-Joint Poster"**

The app reads like the printed poster taped inside a loud neighbourhood burger joint, then lets you order from it. A warm cream ground carries white cards; every object is drawn with a fat 2px brown-ink outline and round, generous corners; offers are shouted in heavy uppercase Rubik; tomato red owns promotions, primary actions and new prices, and mustard marks the things you tap to add. It is appetite and fun first, but it is a working tool: prices are legible at a glance, the next action is always one thumb away, and the total is trusted before confirming.

Density is comfortable, not airy: a single 512px column, 16px gutters, two-up product cards, and stacked outlined panels. Depth comes from outline and colour, never from shadow; motion is quick expo ease-out where sheets rise and nothing bounces. The one memorable moment is the stamp: adding a dish presses a red quantity disc onto the card's corner like an ink stamp.

The system is a rebrandable template. Brand red, cream on-brand, mustard and brown on-accent are written to `<html>` at runtime from `frontend/src/config/brand.ts`; every red surface that carries text uses a fill darkened 20% toward ink so a restaurant's lighter brand colour still holds cream text. Confirmed rejections: the earlier "national ornament" ikat world (rejected by the user as "too traditional"), and the grey-card delivery-app default. All product photography currently shipped is an AI-generated placeholder (`frontend/public/images/products/*.jpg`) for each restaurant to replace.

**Key Characteristics:**
- Cream ground, white cards, brown ink type and 2px brown outlines on everything.
- Tomato red for promotions, primary CTAs and prices; mustard for add buttons, discount tags, active nav and toasts.
- One typeface, Rubik Variable; weight does the hierarchy (900 shout, 800 labels, 500 body).
- Pills and circles; no corner under 18px.
- No shadows. Outline and colour fill are the only depth.
- Signature: the quantity stamp disc, animated by the `stamp` keyframes.
- Full Telegram dark theme: brown-black ground, cream ink, cream outlines.

## Colors

A three-voice poster palette (tomato, mustard, brown ink) on cream, with green reserved for "ok" and every value re-derived for Telegram dark mode.

### Primary
- **Tomato Red** (#e8392b, `brand`): the restaurant's colour, set in `brand.ts`. Used raw only where no text sits on it: onboarding ring and active pager dot, unseen story rings, the input caret, the browser theme colour.
- **Fired Tomato** (#c53325, `brand-fill`, canonical `color-mix(in srgb, var(--brand) 80%, #3a1d0f)`): every red surface that carries text. The primary button, hero promo card, story viewer, profile banner, order-success card, cart badge, quantity stamp, selected radio dot and the "new" order status. Cream on it measures about 5:1.
- **Tomato Ink** (#c53325 light, #ee7066 dark, `brand-ink`): red as text on cream: the wordmark, the second line of the home headline, profile icons, secondary-button text.
- **Tomato Blush** (#fcddcc light, #511b13 dark, `brand-soft`): 12% brand on ground; the secondary button fill only.
- **Poster Cream** (#fff3e2, `on-brand`): text and rings on red. The inverse button is a cream pill with Fired Tomato text in both themes.

### Secondary
- **Mustard** (#ffbf2e, `accent`): the "touch to add" colour. Round "+" buttons, the stepper's plus, discount tags, active bottom-nav item, selected payment icon, toast, order bump card, ingredient bullets, step numbers, the switch thumb at rest, text selection and the global focus outline. On red it is reserved for display numerals, which always carry the ink stroke.
- **Bun Brown** (#3a1d0f, `on-accent`): text on mustard, and the 4px stroke behind mustard numerals on red.

### Tertiary
- **Sale Red** (#d62d20 light, #ff6a5a dark, `sale`): new prices on cards, sheet and cart lines; field errors; the "clear cart" hover. About 4.9:1 on white.
- **Halal Green** (#2b8a50 light, #4cc27e dark, `ok`): trust icons in the product sheet, "free" delivery fee, switch track when on, completed status.

### Neutral
- **Brown Ink** (#3a1d0f light, #fff3e2 dark, `ink`): all primary text; the filled state of category chips and the language switcher.
- **Toasted Crust** (#86664f light, #c9ad95 dark, `ink-2`): secondary text, struck old prices, field labels, subtitles, inactive language option.
- **Outline** (#3a1d0f light, cream at 82% dark, `outline`): every 2px border and divider.
- **Hair** (brown or cream at 14%, `hair`): the seen story ring only.
- **Cream Ground** (#fff3e2 light, #1c110a dark, `ground`): page, sheet and sticky footer background.
- **Card White** (#ffffff light, #2a1b11 dark, `surface`): cards, panels, inputs, stepper capsule.
- **Muted Dough** (#f8e7cf light, #3a271a dark, `muted`): image wells, skeletons, ghost and outline hover, selected payment row.
- **Bar Brown** (#3a1d0f light, #2a1b11 dark, `bar`) with **Bar Ink** (#d8c1ad light, #b89c86 dark, `bar-ink`): the bottom navigation panel and its inactive labels.
- **Scrim** (brown-black at 60%): bottom sheet backdrop.

### Named Rules
**The Fired Fill Rule.** Any red area that carries text uses `brand-fill`, never raw `brand`. Raw brand is for rings, dots and carets only. This is what lets any restaurant's red pass with cream text; still check `onBrand` contrast when rebranding.

**The Mustard Means Add Rule.** Mustard marks what you touch to add, choose or be told: add buttons, the stepper plus, discount tags, the active tab, the selected payment method, the toast. Do not spend it on decoration.

**The Honest Price Rule.** The new price is Sale Red, 900, tabular; the old price is Toasted Crust, 500, struck through with a 1.5px line, set above it. A price never appears without the currency label beside it in `ink-2`.

## Typography

**Display Font:** Rubik Variable (with system-ui, sans-serif)
**Body Font:** Rubik Variable (with system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif)

**Character:** One rounded grotesque with full Latin and Cyrillic coverage, pushed to 900 uppercase to shout offers and dropped to 500 to read calmly. The single family keeps Uzbek and Russian strings looking like the same voice.

### Hierarchy
- **Display** (900, 52px, 0.85, uppercase): the promo numeral on the hero card and the story-viewer title; mustard with ink stroke on red.
- **Headline** (900, 26–36px, 0.98, uppercase): page titles (32px), home headline (30px), onboarding slides (34–36px), product name in the sheet (28px), empty and success states.
- **Title** (900, 20–24px, 0.98, uppercase): section heads ("Ommabop" 24px, cart sections 22px, profile sections 20px, cart total label 20px); 16–17px for the promo line and ingredient heading.
- **Item** (800, 15px, 1.25, normal tracking, sentence case): dish names on cards and cart lines, payment method names.
- **Body** (500, 15px, 1.45): descriptions, greetings, hints. Onboarding body runs at 17px. Inputs set 16px to stop iOS zoom.
- **Label** (800, 13–15px, 0.01em, uppercase): all buttons (sm 13px, md 14px, lg 15px), "see all" link, "clear" action.
- **Caption** (700, 12–13px): field labels (uppercase, `ink-2`), promise rows, story names, status chips.
- **Nav** (700, 11px): bottom navigation labels.
- **Price** (900, tabular figures, -0.01em): 19px on cards (16px when six digits), 26px in the sheet, 28px cart total, 32px order success, 17px cart lines.

### Named Rules
**The Shout Rule.** Headings use the `shout` treatment: Rubik 900, uppercase, -0.025em, line-height 0.98, balanced wrapping. Dish names are the exception and stay sentence case at 800 so a two-line name stays readable.

**The Ink-Stroke Rule.** Mustard display numerals on red always carry a 4px Bun Brown stroke painted behind the fill (`-webkit-text-stroke` with `paint-order: stroke fill`). Mustard text never sits on red without it.

**The Tabular Price Rule.** Every number that is a price, count or order id uses tabular figures so columns and totals do not jitter.

## Layout

A single phone column, centred at a 512px maximum, with a 16px side gutter on every screen. Home stacks its sections 20px apart; cart and profile stack 28px apart. Products sit in a two-column grid with 12px gaps. Horizontal rows (stories, category chips) bleed to the screen edge with the gutter as inner padding and a hidden scrollbar.

Chrome is fixed to the bottom for one-handed use: the brown navigation bar sits at the foot with safe-area padding, the cart's sticky confirm button floats directly above it, and the catalog's category row sticks to the top. The product detail is a bottom sheet (max 92% of the dynamic viewport) with a sticky footer CTA divided by a 2px ink rule. There are no breakpoints: wider screens get the same centred column.

## Elevation & Depth

The system is flat by doctrine. There are no drop shadows anywhere; depth is drawn, not lit. Layers separate by a 2px ink outline, by fill colour (white card on cream, red block on cream, mustard on red) and by the scrim behind sheets. The only two `box-shadow` declarations are zero-blur lines doing an outline's job: the 4px mustard focus ring on inputs, and in dark mode an inset 2px cream line along the top edge of the bottom bar (#2a1b11) so it separates from the brown-black ground.

### Named Rules
**The Drawn Depth Rule.** If a layer needs to stand out, give it an outline or a different fill. A blurred shadow is never the answer, in either theme.

## Shapes

Everything is round. Controls, chips, tags, toasts, the stepper and buttons are full pills; icon buttons, photos in rings, radio dots and the stamp are circles. Containers use a fat corner ladder: inputs and cart thumbnails 18px, history rows and skeletons 24px, cards and grouped lists 26px (the card's inner image well is 19px so the curves stay concentric), the bottom bar 28px on its top corners, promo and profile blocks 30px, sheets 32px on their top corners.

Every object carries a 2px ink outline; dividers inside grouped lists are 2px ink too, and the cart total is split off by a 2px dashed ink rule. Photography is either a rounded-square well inside a card or a circle wearing a ring: a 5px cream ring on the hero dish (which bleeds off the card's right edge), a 2px outline inside a coloured ring on onboarding, a 3px red ring on unseen stories.

Icons are Lucide line icons at a 2.25 stroke; glyphs inside small filled controls (the "+", the stepper, the toast check, the cart-line remove) go to 2.5–3 so they hold their weight against the fill.

### Named Rules
**The Fat Corner Rule.** No square corners and nothing under 18px. If it is interactive and small, it is a pill or a circle.

**The 2px Ink Rule.** Outlines and dividers are 2px in the outline colour. Not 1px, not grey.

## Components

### Buttons
Chunky, loud and pressable: full pills in 800 uppercase that shrink to 97% on press.
- **Shape:** full pill (9999px); heights 36px (sm), 44px (md), 54px (lg).
- **Primary:** Fired Tomato with cream text; the default for every main action (add to cart with price, confirm or pay with total, start, go to catalogue). Hover brightens 5%, active dims 5%.
- **Accent:** mustard with brown text and a 2px ink outline.
- **Secondary:** Tomato Blush with Tomato Ink text.
- **Outline:** transparent with a 2px ink outline and ink text; hover fills Muted Dough.
- **Outline on brand:** transparent with a 2px cream outline and cream text, for use on red blocks; hover tints cream at 10%.
- **Inverse:** a cream pill with Fired Tomato text in both themes; the main action on red surfaces (hero card, story viewer).
- **Ghost:** transparent ink text; hover Muted Dough.
- **States:** transitions on transform, filter and background at 200ms expo; disabled at 45% opacity; loading shows a 16px spinning ring in the current colour.
- **On red, pair with a link:** the hero card's action row is a cream inverse pill plus an underlined 800-weight text link (2px underline, 4px offset), not two pills.

### Chips
- **Category tabs:** 40px pills with a 2px ink outline, 17px icon and 800 label. Unselected transparent with ink text (hover Muted Dough); selected fills solid ink with cream (ground) text.
- **Language switcher:** a 2px-outlined pill segmented control; active option fills ink with ground text, inactive is Toasted Crust.
- **Discount tag:** a mustard pill with a 2px ink outline and a 900 tabular "−20%", pinned to the image corner.
- **Status chip:** a 2px-outlined pill; new is Fired Tomato, confirmed is mustard, delivering is solid ink, cancelled is Muted Dough.

### Cards / Containers
- **Corner Style:** 26px for cards and grouped lists, 24px for history rows, 30px for red blocks.
- **Background:** Card White on Cream Ground; red blocks in Fired Tomato; the order bump in mustard.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 2px ink on every white or mustard container; red blocks go borderless and let the colour do the work.
- **Internal Padding:** 8px on product cards (image well inset), 14–16px on panels and blocks.
- **Product card:** square image well, two-line dish name, struck old price over the red new price, a 40px round mustard "+" in the bottom-right corner, and the stamp in the top-right when the dish is in the cart.
- **Grouped list:** cart lines, payment methods and profile contacts share one outlined 26px panel divided by 2px ink rules.
- **Hero promo:** Fired Tomato block, ink-stroked mustard numeral, uppercase promo line, mustard-iconed promise row (only promises the restaurant enables in `brand.ts`), and a ringed circular dish photo bleeding off the right edge.
- **Order bump:** a mustard card with a circular product photo, the offer sentence, struck and new price, and a switch.

### Inputs / Fields
- **Style:** Card White, 2px ink outline, 18px corners, 12px by 16px padding, 16px text; placeholder in Toasted Crust at 70%. Labels sit above in 13px 700 uppercase Toasted Crust with a 15px icon.
- **Focus:** a 4px mustard ring around the outline, eased in over 200ms.
- **Error:** the outline turns Sale Red and a 13px 700 Sale Red message appears below with `role="alert"`.

### Navigation
- **Bottom bar:** a fixed Bar Brown panel with 28px top corners, four equal tabs (Home, Catalog, Cart, Profile), 24px Lucide icons over 11px 700 labels. Inactive tabs are Bar Ink; the active tab turns mustard. In dark mode the bar is #2a1b11 with an inset 2px cream line along its top.
- **Cart badge:** a 20px Fired Tomato disc with a 2px bar-coloured ring and 900 tabular count, stamped in with the `stamp` animation every time the count changes.
- **Headers:** the home header is the two-line uppercase red wordmark plus the compact UZ/RU switch, a 30px shout headline with its second line in Tomato Ink, and a greeting. Inner pages use a 32px shout title with an optional subtitle and a right-aligned action.

### Bottom Sheet
Cream sheet with 32px top corners rising from the bottom over a 60% brown-black scrim; drag handle at the top, dismiss by drag past 110px, backdrop tap, Escape or Telegram's Back button. Sticky footer separated by a 2px ink rule holds the full-width primary CTA.

### Switch
56 by 32px pill with a 2px ink outline. Off: white track with a mustard thumb on the left. On: Halal Green track with a white thumb slid right. 300ms expo.

### Quantity Stepper
A white pill with a 2px ink outline: a plain ink minus, a 900 tabular count, and a mustard circular plus. 32px or 40px buttons that shrink to 90% on press.

### Toast
A mustard pill with a 2px ink outline, check icon and 800 uppercase message, rising in at the top of the screen for 2.2 seconds.

### The Stamp (signature)
When a dish is added, a 36px Fired Tomato disc with a 2px ink outline and the 900 tabular quantity is stamped onto the card's top-right corner. The `stamp` keyframes scale it from 1.6 to 1 and rotate it from −12° to 0 while it fades in, over 340ms on the expo ease `cubic-bezier(0.16, 1, 0.3, 1)`. It re-stamps on every quantity change. The same motion stamps the cart badge and the order-success check.

## Do's and Don'ts

### Do:
- **Do** fill every text-bearing red surface with `brand-fill` and keep raw `brand` for rings, dots and the caret.
- **Do** outline every card, chip, control, photo and divider in 2px of the outline colour.
- **Do** set headings in the `shout` treatment (Rubik 900 uppercase, -0.025em, 0.98) and dish names in 800 sentence case.
- **Do** give mustard numerals on red the 4px Bun Brown `ink-stroke`.
- **Do** show prices as struck Toasted Crust old price over a Sale Red 900 tabular new price with the currency label.
- **Do** use mustard for add, choose and confirm signals: "+" buttons, discount tags, active tab, selected payment, toast.
- **Do** use Lucide icons at a 2.25 stroke, raising glyphs inside small filled controls to 2.5–3.
- **Do** keep motion on the expo ease `cubic-bezier(0.16, 1, 0.3, 1)`: sheets rise in 360ms, content rises 10px in 420ms, the stamp lands in 340ms, presses scale to 0.97 (pills) or 0.9 (round buttons); respect reduced motion.
- **Do** fade only a disabled row's content (icon, text, radio) to 45%, leaving its divider and panel outline intact.
- **Do** keep every brand-coloured value flowing from `brand.ts` so a restaurant can rebrand with four colours, and check `onBrand` contrast against the derived fill.

### Don't:
- **Don't** use drop shadows or blurred glows, in either theme; depth is outline and colour.
- **Don't** put cream or white text on raw `brand`, or mustard text on red without the ink stroke.
- **Don't** use square corners or radii under 18px on containers.
- **Don't** draw 1px or grey outlines and dividers.
- **Don't** bring back the rejected "national ornament" look: no ikat bands, abr silk patterns or traditional ornament.
- **Don't** fall back to the grey-card delivery-app default: no grey surfaces, borderless floating cards or blue system accents.
- **Don't** add a second typeface; hierarchy comes from Rubik's weights and the uppercase shout.
- **Don't** make anything bounce or overshoot.
