---
name: Fast Delivery
description: A rebrandable Telegram Mini App for local fast-food ordering in a clean, bright commerce look of white ground, one loud red, light-grey food cards and small green add buttons.
colors:
  brand: "#f00000"
  brand-fill: "#df0000"
  brand-ink: "#df0000"
  on-brand: "#ffffff"
  accent: "#006d1a"
  on-accent: "#ffffff"
  soft: "#fcded4"
  sale: "#e00000"
  ok: "#006d1a"
  ink: "#1a1a1a"
  ink-2: "#756b66"
  ground: "#ffffff"
  surface: "#f5f5f5"
  raised: "#ffffff"
  muted: "#efefef"
  line: "#e7e3e1"
  scrim: "rgb(58 10 10 / 0.3)"
typography:
  display:
    fontFamily: "Red Hat Display Variable, Manrope Variable, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Red Hat Display Variable, Manrope Variable, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Red Hat Display Variable, Manrope Variable, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  section:
    fontFamily: "Red Hat Display Variable, Manrope Variable, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  item:
    fontFamily: "Red Hat Display Variable, Manrope Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Red Hat Display Variable, Manrope Variable, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.45
  button:
    fontFamily: "Red Hat Display Variable, Manrope Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
  label:
    fontFamily: "Red Hat Display Variable, Manrope Variable, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  caption:
    fontFamily: "Red Hat Display Variable, Manrope Variable, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
  price:
    fontFamily: "Red Hat Display Variable, Manrope Variable, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 800
    lineHeight: 1.25
    fontFeature: "\"tnum\" 1"
rounded:
  step: "9px"
  tile: "12px"
  field: "16px"
  panel: "18px"
  card: "20px"
  product: "22px"
  banner: "24px"
  sheet: "28px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  card: "10px"
  md: "12px"
  gutter: "16px"
  section: "20px"
  stack: "28px"
components:
  button-primary:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-primary-lg:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.brand-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-inverse:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.brand-fill}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-outline:
    textColor: "{colors.brand-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-ghost:
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.muted}"
  button-add:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    size: "32px"
  stepper-button:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.step}"
    size: "36px"
  stepper-button-sm:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.step}"
    size: "28px"
  category-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.field}"
    size: "60px"
  category-tile-active:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.field}"
    size: "60px"
  tag-discount:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  badge-count:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.pill}"
    height: "18px"
  card-product:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.product}"
    padding: "{spacing.card}"
  card-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "12px"
  card-bump:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "14px"
  card-promo:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "10px 12px 10px 10px"
    width: "210px"
  option-payment:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
  banner-hero:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.banner}"
    padding: "16px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "48px"
  nav-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-2}"
  nav-item-active:
    textColor: "{colors.brand-ink}"
  sheet:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  switch-on:
    backgroundColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    height: "30px"
    width: "52px"
  toast:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  screen-success:
    backgroundColor: "{colors.brand-fill}"
    textColor: "{colors.on-brand}"
    typography: "{typography.display}"
---

# Design System: Fast Delivery

## Overview

**Creative North Star: "The White Plate on Red"**

The system is a clean, bright delivery counter: a white ground, one loud red, light-grey food cards, small green add buttons and simple line icons. Its signature image is food sitting on a round white plate inside a red field. That image appears on the splash, the onboarding slides, the home banner and the product sheet. The ending repeats it: confirming an order turns the whole screen red and says "Rahmat!". The mood is friendly, appetizing, quick and plain-spoken. This is commerce clarity for a hungry person ordering one-handed inside Telegram, not decoration.

The visual source is pinned by the user: a food-delivery reference mockup. Its colours were sampled (red, orange-red, pink, taupe, greys, green) and its typeface family is Red Hat Display. Only the reference's style is used. Its sample brand name and logo are not part of this system, and neither is its star rating. Ratings are never shown on products because no real ones exist. Density is comfortable and phone-first. Each screen has one obvious next action, prices are always red and tabular, and the green "+" is never more than a thumb away.

The app is always light. It renders white and red even when Telegram is in dark mode, because the user explicitly asked for no black. Brand colour is a token, not a constant. The template is rebranded per restaurant through `config/brand.ts`, and every red surface that carries text is derived from the brand colour so that white text stays legible whatever red a restaurant picks. Two earlier worlds are rejected anti-references. **Atlas Silk** was ornamental and traditional. **Pop** was cream ground, mustard accent, Rubik caps and 2px brown outlines with hard stamps. Neither its outlines, its cream or its uppercase voice return.

**Key Characteristics:**
- Always light: white ground and red in every Telegram theme, with no dark palette.
- White ground, light-grey (#f5f5f5) cards, one red used loudly but in few places.
- Food on round white plates inside red fields; real product photos on grey tiles everywhere else.
- Pills for buttons, generous 16–28px rounding on containers, no outlines on cards.
- Green circular "+" for every add action; red rounded-square steppers.
- Lucide line icons only; an icon-only bottom bar with a red active dot.
- Red Hat Display for Latin, Manrope for Cyrillic, tabular figures on every price.
- Motion is expo ease-out: sheets rise, count badges pop in, nothing bounces.

## Colors

One saturated red does the talking against white and pale grey. A forest green handles "add" and "ok", and a blush pink softens offers and avatars.

### Primary
- **Signal Red** (`brand`): the restaurant's colour as sampled from the reference. It is used raw only where no text sits on it: the active category tile, the active-tab dot under the nav icon, ingredient bullets, the selected payment radio and border, the focus ring and the input caret. It is rebranded per restaurant.
- **Deep Signal Red** (`brand-fill`): the brand colour mixed 93% with black (`color-mix(in srgb, var(--brand) 93%, #000000)`). It fills every red surface that carries text or white glyphs: primary buttons, the home banner, the onboarding and stories screens, the product-sheet hero, steppers, discount tags, the count badge and the "Rahmat!" screen. White on it measures 5.08:1.
- **Red Ink** (`brand-ink`): red used as text, such as the "Barchasi" links, the active nav icon, the active category label, and the outline and secondary button labels. It equals Deep Signal Red, at 5.04:1 on white and 4.62:1 on Counter Grey.
- **On Red** (`on-brand`): white. It is the only colour that sits on red.

### Secondary
- **Add Green** (`accent`): forest green from the reference. It is used for the circular "+" add buttons, and the switch's on track, with white glyphs on it (6.56:1). It is rebrandable alongside the brand colour.
- **Ok Green** (`ok`): the same green used as text and icons for positive facts, such as "Bepul" delivery and the trust checklist icons in the product sheet, and the check mark inside the toast's white dot.

### Tertiary
- **Blush** (`soft`): pale pink from the reference. It is used for the order-bump card, the avatar initial disc, the empty-state icon discs, the secondary button, the outline button's hover fill and text selection.
- **Price Red** (`sale`): a fixed #e00000 for every current price and total, and for field errors. It is separate from the brand colour so prices stay red even if a restaurant rebrands to another hue.

### Neutral
- **Ground** (`ground`): white page, sheet and bottom-bar background, and the Telegram WebView background colour.
- **Counter Grey** (`surface`): the card colour for product cards, cart rows, promo cards, inputs, the search field, category tiles, payment options and the totals panel.
- **Raised** (`raised`): white icon wells inside grey payment options.
- **Ink** (`ink`): near-black body and heading text. It is used for text only, never as a filled surface.
- **Taupe** (`ink-2`): secondary text for greetings, descriptions, struck old prices, inactive nav icons and labels. The reference taupe #887D77 is darkened to #756b66 so it clears 4.5:1 on white (5.18:1) and on Counter Grey (4.75:1).
- **Muted** (`muted`): image-well placeholder and ghost-button hover.
- **Hairline** (`line`): the bottom bar's top border and the total divider. It is never used as a card outline.
- **Scrim** (`scrim`): a dark maroon (#3a0a0a) at 30% behind bottom sheets, a warm red-family veil rather than a black one.

### Named Rules
**The Always Light Rule.** The app has one theme. It always renders white ground and red, even inside Telegram's dark mode, and it never toggles a `.dark` class or swaps in dark tokens. The reason is the user's explicit request: no black.

**The Derived Red Rule.** Text never sits on the raw brand colour. Any red surface with text or white glyphs uses Deep Signal Red (the brand colour mixed 93% with black), and red text uses Red Ink. This is what keeps the template legible with any brand colour.

**The Two Reds Rule.** The brand red is the restaurant's identity; the price red (#e00000) is the price. Prices, totals and errors always use the price token, never the brand token.

**The Green Means Add Rule.** Green is reserved for adding and for good news, such as the "+" button, the bump switch, the toast's check mark and free delivery. Red handles navigation, steppers and commitment.

## Typography

**Display Font:** Red Hat Display Variable (with Manrope Variable, then system-ui)
**Body Font:** Red Hat Display Variable (with Manrope Variable, then system-ui, -apple-system, Segoe UI, Roboto, Arial)

**Character:** A single geometric-humanist sans in sentence case, bold for names and prices and medium for everything else. Red Hat Display has no Cyrillic, so Manrope sits second in every stack and takes over glyph by glyph for Russian. The two share a round, open shape, so a bilingual screen reads as one voice.

### Hierarchy
- **Display** (900, 56px, line-height 1): the "Rahmat!" thank-you word on the full-red success screen. Story titles use the same weight at 44px.
- **Headline** (700, 28px, line-height 1.25): the home "Menyu" title. Inner page headers use 26px at 700, and onboarding slide titles use 28–30px at 900 on red.
- **Title** (800, 24px, line-height 1.25): the product name in the sheet. The home banner headline uses 21px at 800.
- **Section** (700, 19px): section headings such as "Ommabop", delivery, payment and total.
- **Item** (700, 15px, line-height 1.25): product and cart-row names, clamped to two lines.
- **Body** (500, 15px, line-height 1.45): descriptions, ingredient bullets, list text. Inputs render at 16px to stop iOS zoom.
- **Button** (700, 14px; 13px small, 16px large): sentence case, never uppercase.
- **Label** (600, 13px): field labels, the greeting line, "Barchasi" links and toast text.
- **Caption** (600, 12px): category tile labels, banner promise facts, discount tags (11px) and struck old prices.
- **Price** (800, 16px, tabular figures): current prices on cards. The sheet price uses 22px, the cart total 24px and the success total 28px. A smaller taupe "so'm" unit follows the number.

Headings h1–h3 carry -0.015em tracking and balanced wrapping.

### Named Rules
**The Tabular Price Rule.** Every number a customer compares (prices, totals, counts, step numbers) uses the price utility with tabular figures, so columns of so'm amounts never jitter.

**The Sentence Case Rule.** Buttons, tabs and headings are written in sentence case. Weight carries the emphasis; capitals and letter-spacing do not.

**The Cyrillic Fallback Rule.** Never set a Red Hat Display stack without Manrope immediately behind it. Russian strings must render in a designed face, not the system font.

## Layout

The app is a single phone column capped at 512px (`max-w-lg`) and centred on wider Telegram desktop windows. The page gutter is 16px. Sections on home stack 20px apart, and the cart's sections stack 28px apart. Product grids are two columns with a 12px gap. Category tiles and promo cards scroll horizontally with hidden scrollbars, bleeding to the screen edge while staying aligned to the gutter.

Fixed chrome respects Telegram safe areas. The bottom bar and sheet footers pad by `max(env(safe-area-inset-bottom), 0.5rem)`, and the main column reserves 112px at the bottom. The cart's sticky "confirm, total" button floats above the bottom bar on a ground-coloured band that fades upward over 20px, so the content scrolls under it cleanly. Full-screen moments (splash, onboarding, stories, success) are fixed red layers inside the same 512px column.

The rhythm is 4 / 8 / 10 / 12 / 16 / 20 / 28px. Card interiors use 10–14px, and sheets use a 20px side padding.

## Elevation & Depth

The system is flat and tonal. Depth comes from grey-on-white layering (Counter Grey cards on a white ground) and from red fields against white. It does not come from lifting cards. Shadows exist in only two roles. The first is a soft, long, offset-down shadow under a white food plate on red, which makes the plate read as an object set on the field. The second is a 1–3px functional shadow on tiny controls that would otherwise vanish, namely the switch knob and the sheet's drag handle over a red hero. A third, rarer role is a red-tinted glow under the floating toast, so the red pill lifts off whatever red or white content scrolls beneath it. Bottom sheets separate by the 30% maroon scrim, not by shadow.

### Shadow Vocabulary
- **Plate on Red** (`box-shadow: 0 18px 40px -18px rgba(0,0,0,0.5)`): the white plate in the product-sheet hero. Onboarding plates use the slightly larger `0 20px 40px -20px rgba(0,0,0,0.45)`.
- **Knob** (`box-shadow: 0 1px 3px rgba(0,0,0,0.25)`): the switch's white thumb.
- **Handle** (`box-shadow: 0 1px 3px rgba(0,0,0,0.3)`): the white drag handle at the top of a bottom sheet.
- **Toast Glow** (`box-shadow: 0 8px 24px -10px rgba(224,0,0,0.6)`): the red-tinted glow under the floating toast pill.

### Named Rules
**The Plates Only Rule.** Soft shadows belong under white food plates, plus the red glow under the floating toast. Cards, buttons, tiles, banners and the bottom bar have no shadow at rest or on hover.

## Shapes

The form language is round and friendly, with one deliberate square. Every button, tag, badge, switch, toast and progress dot is a full pill. Containers step up in radius with their size: steppers 9px, icon wells 12px, fields, search and category tiles 16px, promo cards and payment options 18px, cart rows, the bump card and totals 20px, product cards 22px, the home banner 24px, and the sheet top 28px. Food is always clipped to a circle (cart rows, add-ons, the bump image, plates) or to a 16px rounded square inside a product card.

The one square-ish exception is red: the active category tile and the cart steppers are red rounded squares, echoing the reference. Cards have no outline. A 1.5px border appears only as a state: the brand border on the selected payment option, the brand border on a focused input, the price-red border on an errored field, and the outline button's brand border. Focus is a 2px brand outline offset by 2px with a 12px radius.

### Named Rules
**The No Outline Rule.** Containers separate by tone, never by stroke. A border on a card means "selected" or "error", and nothing else.

**The Round Food Rule.** Food photography is shown on a round plate or in a rounded tile, never as a hard-edged rectangle or a full-bleed card top.

## Components

### Buttons
Friendly, solid, thumb-sized pills.
- **Shape:** full pill (9999px). Heights are 36px small, 44px default and 52px large, with 16px / 20px / 24px horizontal padding.
- **Primary:** Deep Signal Red with white bold sentence-case label. It is used for "Savatchaga qo'shish — 64 000 so'm" and for confirm with the total. Large buttons fill the width at the screen foot.
- **Hover / Focus / Active:** hover brightens 10%, press scales to 0.97 and darkens 5%, over 200ms on the expo ease-out curve. Focus uses the global 2px brand outline. Disabled drops to 45% opacity. Loading shows a 16px spinning ring in the current colour.
- **Inverse:** a white pill with a Deep Signal Red label, used on red fields (onboarding "Boshlash", the banner's "Katalogni ko'rish", the stories CTA, "Bosh sahifaga" on success). On the banner it pairs with an underlined white text link.
- **Secondary:** a Blush pill with a Red Ink label.
- **Outline:** a transparent pill with a 1.5px brand border and a Red Ink label that fills Blush on hover. It is used only for the reference's "Bekor qilish" (cancel order).
- **Ghost:** transparent with an ink label, and a Muted fill on hover.

### Add Button (signature)
A 32px green circle with a white 2.75-stroke Lucide plus, pinned 10px from the bottom-right of a product card. The add-on tiles use a 28px version in the top-right corner. Press scales to 0.9. Adding pops a 28px Deep Signal Red count badge (white 2px ring) onto the card's image corner.

### Quantity Stepper
Red rounded squares (36px, or 28px in cart rows, 9px radius) with white Lucide minus and plus around a tabular bold count. In the sheet it is horizontal. In cart rows it stacks vertically, with plus on top, count, then minus, as in the reference. Press scales to 0.9.

### Category Tiles
A 60px square with a 16px radius over a 12px semibold label, scrolling horizontally. Inactive tiles show the category's food photo on Counter Grey with a Taupe label. The active tile turns raw Signal Red with a Red Ink label. "All" shows a white Lucide ellipsis, and an active photo tile tints its photo through luminosity blending. The active tile scrolls itself to centre.

### Chips / Tags
- **Discount tag:** a Deep Signal Red pill with white bold tabular "−20%" at 11px, set top-left on the product image. In the sheet it is a white pill with red text, sitting on the red hero.

### Cards / Containers
- **Corner Style:** product 22px, cart row and bump 20px, promo and payment 18px.
- **Background:** Counter Grey on white. The bump card is Blush. The banner is Deep Signal Red.
- **Shadow Strategy:** none (see The Plates Only Rule).
- **Border:** none at rest.
- **Internal Padding:** 10px for product cards, 12px for cart rows, 14px for the bump card, and 16px for the banner and totals.
- **Product card:** a square rounded photo, a two-line bold name, a struck Taupe old price and a red tabular price with a small "so'm", plus the green add button.
- **Promo cards ("Aksiyalar"):** 210px grey cards with a 48px round photo in a 2px brand ring (a hairline ring once seen), a bold title and a two-line description. They open full-screen red stories, closed by a 40px white pill button (90% opacity) with a red Lucide X.

### Home Banner (signature)
A Deep Signal Red block with a 24px radius and 16px padding. It carries an 800-weight 21px white headline, the restaurant's confirmed promises as small icon-led facts (only those switched on in `brand.ts`), and a white inverse pill with an underlined link. A 128px white plate with a round food photo hangs off the right edge.

### Inputs / Fields
- **Style:** Counter Grey fill, 16px radius, 12px 16px padding, a transparent 1.5px border, a 13px semibold Taupe label with a 15px line icon, and a brand caret.
- **Focus:** the border turns brand red over 200ms. The search field shows a 1.5px brand ring on focus-within.
- **Error:** the border turns price red, with a 13px semibold price-red message below and `aria-invalid`.

### Navigation
A fixed white bar with a hairline top border and four icon-only tabs: house, search, cart, user. Icons are 24px Lucide lines with an `aria-label` per tab. Inactive tabs are Taupe at 1.9 stroke. The active tab is Red Ink at 2.25 stroke with a faint 10% brand fill and a 6px red dot beneath. The cart tab carries an 18px Deep Signal Red count pill that pops in on every change. Selection fires Telegram haptics.

### Bottom Sheet (Product Sheet)
The sheet rises from the bottom with a 28px top radius over the 30% maroon scrim, at most 92dvh tall. It closes by backdrop tap, Escape, or a 110px drag on the white handle. The product sheet opens on a 5:4 Deep Signal Red hero with the food on a white plate (Plate on Red shadow). Below that come the name and a 22px red price, round ingredient bullets in brand red, and a three-up "Qo'shimcha" drinks row of grey tiles with green add buttons. Next is a grey trust panel with green icons, then the quantity stepper. A sticky large primary "add, price" button sits in the footer.

### Order Bump
A Blush card with a 20px radius: a 58px round drink photo, the bold offer text, the struck regular price beside the red offer price, and a green switch.

### Switch
A 52x30px pill track, green when on, with a 24px white thumb (Knob shadow) that slides over 300ms on the expo curve.

### Payment Options
Grey 18px rows, each with a 40px icon well (white, or Deep Signal Red with a white icon when selected), a bold name, a Taupe hint and a 22px radio ring. The selected row gains a 1.5px brand border. Unavailable methods sit at 45% opacity with a "soon" hint.

### Toast
A Deep Signal Red pill near the top of the screen with the Toast Glow shadow. It holds a 20px white dot with a green check and 14px semibold white text. It rises in and leaves after 2.2s.

### Success Screen (signature)
A full-screen Deep Signal Red layer. It shows the logo mark, an 18px "Buyurtmangiz qabul qilindi" line, a 56px 900-weight "Rahmat!" that pops in, the order number, the 28px tabular total, and a white inverse "home" pill at the foot. It is the memorable end of the flow.

### Motion
All motion uses expo ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`). Sheets rise over 360ms and fall away over 200ms ease-in. Count badges and the "Rahmat!" word pop from 0.5 scale over 300ms. Lists and the toast rise 10px over 420ms. Backdrops fade over 200ms. Press feedback is a 0.9–0.97 scale. Nothing overshoots or bounces, and `prefers-reduced-motion` collapses everything to near-instant.

## Do's and Don'ts

### Do:
- **Do** fill every text-bearing red surface with Deep Signal Red (brand mixed 93% with black, #df0000 for the default brand), and keep raw Signal Red for icon-only and text-free marks.
- **Do** colour every current price and total with the price token (#e00000) in tabular 800-weight figures, followed by a smaller Taupe "so'm".
- **Do** use the green circular "+" (32px) for every add action, and red rounded-square steppers (9px radius) for quantity.
- **Do** separate containers by tone: Counter Grey (#f5f5f5) cards on a white ground, Blush (#fcded4) for offers.
- **Do** present hero food on a round white plate inside a red field, with the soft Plate on Red shadow.
- **Do** use Lucide line icons at 1.9–2.75 stroke for every icon, and keep the bottom bar icon-only with a red active dot.
- **Do** keep Manrope directly behind Red Hat Display in every font stack, so Russian renders in a designed face.
- **Do** animate with expo ease-out only: sheets rise, badges pop, lists rise 10px.
- **Do** read brand colours from `config/brand.ts` and show only the promises a restaurant has switched on.
- **Do** render white and red in every Telegram theme, and set the WebView background to white (#ffffff).

### Don't:
- **Don't** add a dark theme, `.dark` tokens or `dark:` variants, and don't use black or near-black as a filled surface (the user asked for no black).
- **Don't** put white text on the raw brand red (#f00000 measures 4.46:1); use Deep Signal Red.
- **Don't** outline cards or tiles at rest; a 1.5px border means selected, focused or error.
- **Don't** add shadows to cards, buttons, banners or the bottom bar; soft shadows live only under food plates.
- **Don't** show star ratings or review counts on products; no real ratings exist and none may be invented.
- **Don't** copy the reference's sample brand name or its logo; each restaurant supplies its own.
- **Don't** uppercase buttons or headings, or letter-space them for emphasis.
- **Don't** use emoji or glyph characters as icons.
- **Don't** let anything bounce, overshoot or spring.
- **Don't** return to Pop: no cream ground, mustard accent, Rubik caps, 2px brown outlines or hard offset stamps.
- **Don't** return to Atlas Silk: no ornamental, traditional or silk-pattern decoration.
