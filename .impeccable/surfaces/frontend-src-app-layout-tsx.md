---
version: 1
slug: "frontend-src-app-layout-tsx"
primary_target: "frontend/src/app/layout.tsx"
related_targets: ["frontend/src/app/page.tsx","frontend/src/app/catalog/page.tsx","frontend/src/app/cart/page.tsx","frontend/src/app/profile/page.tsx"]
---

# Surface brief: Telegram Mini App (all five screens)

Scope: the whole Mini App shell — Onboarding, Home ("Menyu"), Catalog, Product sheet, Cart, Profile. Visitor mode: **Operate** (a hungry customer completes an order inside Telegram, one-handed, in Uzbek or Russian).

Audience & job: see PRODUCT.md. Constraints: universal template (brand colours are tokens), Telegram light/dark theme, safe areas, native Back button, standard controls only.

History: Atlas Silk (rejected: colours, too traditional) → Pop (user-chosen from sketches) → **user-pinned reference** (a "food delivery app" Dribbble-style mockup the user supplied: "I want same design colors and icons"). The pinned reference wins over every earlier roll. Only its style is used; its sample brand name and logo are not copied.

Memorable moment: the full-red "Rahmat!" thank-you screen after one-tap confirm.

Unresolved: real restaurant photography and logo; real proof numbers (10 000+, 4.9) per restaurant.

## Direction contract

THESIS: A clean, bright delivery app exactly in the user's reference: white ground, one loud red, light-grey food cards, small green add buttons, simple line icons. Refuses the earlier ornamental/brutal looks in favour of the reference's friendly commerce clarity.

OWN-WORLD: Reference palette sampled from the user's image: red #F00000 (fills; text-bearing red derives #E00000 for 4.5:1), orange-red #F12E00, pink #FCDED4 (soft fills), taupe #887D77 (secondary text darkened to #756B66 for contrast), greys #C1C1C1 / #F5F5F5, green #006D1A (add buttons, switch, ok). Red Hat Display (Manrope for Cyrillic). Pills, 16–24px card radii, red rounded-square category tile and steppers, Lucide line icons (house, search, cart, user in an icon-only bottom bar with a red dot for active). Dark: #121212 ground, #1F1F1F cards.

STORY: The visitor opens a red splash with the restaurant mark, lands on "Menyu", finds food via search or category tiles, adds with the green +, and confirms in one tap to a red "Rahmat!".

FIRST VIEWPORT: Home: "Xush kelibsiz, {name}!" over a bold "Menyu" with avatar right; grey search field; category tiles (All as red square with dots when active, others photo tiles with labels); "Aksiyalar" promo cards (stories); red banner with headline, promises, white "Katalogni ko'rish" pill, link, and food on a white plate; "Ommabop" grey cards with red prices and green +. White icon-only bottom bar.

FORM: User-pinned reference design (brief-pinned, beats the roll); seed: none (unavailable). Signature interaction: confirm → full-red thank-you screen; add → count pops onto the card. Motion grammar: expo ease-out, sheets rise, nothing bounces.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
