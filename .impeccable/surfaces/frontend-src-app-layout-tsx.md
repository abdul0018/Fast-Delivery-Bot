---
version: 1
slug: "frontend-src-app-layout-tsx"
primary_target: "frontend/src/app/layout.tsx"
related_targets: ["frontend/src/app/page.tsx","frontend/src/app/catalog/page.tsx","frontend/src/app/cart/page.tsx","frontend/src/app/profile/page.tsx"]
---

# Surface brief: Telegram Mini App (all six screens)

Scope: the whole Mini App shell — Onboarding, Home, Catalog, Product sheet, Cart (+ success), Profile. Visitor mode: **Operate** (a hungry customer orders inside Telegram, one-handed, in Uzbek or Russian).

Audience & job: see PRODUCT.md. Constraints: universal template (brand colours are tokens in `config/brand.ts`), always light even in Telegram dark mode (user rule: no black surfaces), safe areas, native Back button, standard controls only.

History: Atlas Silk (rejected, too ornamental) → Pop (rejected) → red reference mockup (replaced by user's full-redesign request) → direction round: user declined the roll (Tashkent Metro), the pick (Pakhta porcelain) and the boarding-pass challenger, and took **the category standard**, benchmarked against **Yandex Eda** and **Uzum Tezkor / Express24**, with a **premium** feel and a new palette.

Memorable moment: the sticky cart bar that always shows count and total, and the white success screen with the saffron check after one-tap confirm.

Unresolved: real restaurant photography and logo; real proof numbers (10 000+, 4.9) per restaurant.

## Direction contract

THESIS: The category standard played straight at Yandex Eda / Uzum Tezkor craft: a calm, premium delivery app where food photography and prices lead and chrome recedes. Refuses the red-and-green discount-flyer look and every themed costume.

OWN-WORLD: Warm-neutral grey ground (#f4f4f2), white 20–24px cards with no outlines, food on soft grey photo tiles, near-black ink type, one saffron brand fill (#ffc21a, ink text on it) for primary actions and the cart bar, red only for discounted prices, green for success. Onest Variable (Latin + Cyrillic) with a strict scale. Lucide icons, labelled four-tab bottom bar.

STORY: The visitor sees their name and address, a promo banner and stories, finds food by chips or search, adds with "+" that turns into a stepper in place, watches the cart bar update, and confirms in one tap.

FIRST VIEWPORT: Home: top row address pill + avatar; greeting; search field; rounded-square stories row; full-width photo promo banner with "Katalogni ko'rish" and "Yangi buyurtma berish"; category tiles; "Ommabop" product row. Sticky saffron cart bar above the labelled bottom nav when the cart is non-empty.

FORM: the category standard (canon exit, user-chosen), benchmarks Yandex Eda + Uzum Tezkor/Express24; seed: 5a02550d. Signature interaction: "+" morphs into an in-place stepper and the cart bar's total ticks. Motion grammar: expo ease-out, sheets rise, nothing bounces.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
