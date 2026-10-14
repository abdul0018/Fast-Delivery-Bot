---
version: 1
slug: "frontend-src-app-layout-tsx"
primary_target: "frontend/src/app/layout.tsx"
related_targets: ["frontend/src/app/page.tsx","frontend/src/app/catalog/page.tsx","frontend/src/app/cart/page.tsx","frontend/src/app/profile/page.tsx"]
---

# Surface brief: Telegram Mini App (all five screens)

Scope: the whole Mini App shell — Onboarding, Home, Catalog, Product sheet, Cart, Profile. Visitor mode: **Operate** (a hungry customer completes an order inside Telegram, one-handed, in Uzbek or Russian).

Audience & job: see PRODUCT.md. Task: pick dishes → confirm address → choose payment → confirm in one tap. Proof/content: seed menu (12 dishes), AI-generated placeholder photos (to be replaced by each restaurant). Constraints: universal template (brand colours are tokens), Telegram light/dark theme, safe areas, native Back button, standard controls only.

Memorable moment: the ikat band under the category tabs shifts like silk when the category changes.

Unresolved: real restaurant photography and logo; real proof numbers (10 000+, 4.9) per restaurant.

## Direction contract

THESIS: The menu is dressed in abr (ikat) atlas silk: the restaurant's colour arrives as full-width silk bands with feathered, dye-bled edges on the header, tab rail and hero, while the food stays on calm, photo-first cards. Refuses the category default of a grey ground with one orange accent and emoji icons.

OWN-WORLD: Three silk tokens — indigo #2A2C9B (brand), pomegranate magenta #D11D6B, saffron #FFB31A — plus ink #17142A and warm cotton ground #F7F3EC (dark: #13111C ground, #1E1B2A surface). Bands are SVG stripes with stepped, irregular abr edges generated from a seed. Geologica variable for display and prices (tabular), system UI for body. Lucide line icons at 1.75 stroke. Sale price red #E0182D only for the new price.

STORY: The visitor sees the restaurant's colour and its food immediately, understands prices at a glance (struck old, red new), adds with one tap and trusts the total before confirming.

FIRST VIEWPORT: Home: an indigo silk field fills the top ~42%: name + greeting in white, story rings (dish photos) on the field, feathered band edge as the field's lower boundary. Below on cotton: hero order card (photo spread, primary "Katalogni ko'rish" + secondary "Yangi buyurtma"), then popular dishes rail. Bottom nav: white bar, Lucide icons, active item indigo with a 3px band thread.

FORM: Atlas Silk (Uzbek abr/ikat textile), position 1 of own grounded list (Impeccable's pick); seed: none (unavailable). Signature interaction: category change ripples the ikat band under the tabs (stripes slide one motif cell with an ease-out skew). Motion grammar: ease-out-expo 320ms, sheets rise, nothing bounces.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
