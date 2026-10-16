---
version: 1
slug: "frontend-src-app-layout-tsx"
primary_target: "frontend/src/app/layout.tsx"
related_targets: ["frontend/src/app/page.tsx","frontend/src/app/catalog/page.tsx","frontend/src/app/cart/page.tsx","frontend/src/app/profile/page.tsx"]
---

# Surface brief: Telegram Mini App (all five screens)

Scope: the whole Mini App shell — Onboarding, Home, Catalog, Product sheet, Cart, Profile. Visitor mode: **Operate** (a hungry customer completes an order inside Telegram, one-handed, in Uzbek or Russian).

Audience & job: see PRODUCT.md. Task: pick dishes → confirm address → choose payment → confirm in one tap. Proof/content: seed menu (12 dishes), AI-generated placeholder photos (to be replaced by each restaurant). Constraints: universal template (brand colours are tokens), Telegram light/dark theme, safe areas, native Back button, standard controls only.

History: Atlas Silk (ikat bands) was built first and rejected by the user ("colours", "too traditional"); a re-roll was presented as three rendered home-screen sketches (Fresh / Night / Pop) and the user chose **Pop**.

Memorable moment: adding a dish stamps its quantity onto the card like an ink stamp.

Unresolved: real restaurant photography and logo; real proof numbers (10 000+, 4.9) per restaurant.

## Direction contract

THESIS: Loud, modern burger-joint brand energy as a working app: cream ground, tomato red and mustard, brown ink, every object outlined in 2px ink with fat round corners, uppercase heavy type that shouts the offer. Refuses the grey-card delivery-app default and the "national ornament" look.

OWN-WORLD: Cream #FFF3E2 ground, white cards, brown ink #3A1D0F for type and 2px outlines, tomato red #E8392B (brand: CTAs, promo blocks, prices), mustard #FFBF2E (accent: round "+" buttons, discount tags, active nav), green #2B8A50 for ok/halal; dark: ground #1C110A, surface #2A1B11, cream ink and cream outlines. Rubik variable, 900 uppercase for headlines, 800 for labels/buttons, 500 body. Pill buttons, round icon buttons, Lucide icons at 2.25 stroke. No shadows: depth is outline and colour.

STORY: The visitor feels the restaurant's appetite and fun immediately, reads prices at a glance (struck old, red new), adds with one tap and trusts the total before confirming.

FIRST VIEWPORT: Home: two-line red wordmark + UZ/RU pill top; "OCH QOLDINGIZMI? / BIZ YETKAZAMIZ!" 34px uppercase (second line red); "Xush kelibsiz, {name}!"; story rings (red outline, dish photos); red promo card with mustard −20%, round photo with cream ring, promises row and two pill CTAs (cream "Katalogni ko'rish", outlined "Yangi buyurtma"); then OMMABOP 2-column outlined cards. Brown rounded bottom bar, active item mustard.

FORM: Pop (fast-food brand identity), chosen by the user from three rendered sketches after a re-roll; seed: none (unavailable). Signature interaction: the quantity stamp — on add, a red count disc stamps onto the card corner (scale 1.6→1, −12°→0, 340ms expo). Motion grammar: expo ease-out, sheets rise, nothing bounces.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
