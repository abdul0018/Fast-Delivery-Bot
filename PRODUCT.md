# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Hungry customers of local fast-food restaurants in Uzbekistan who order from inside Telegram on their phone, usually one-handed, often in the evening or at work, in Uzbek or Russian. Secondary: the restaurant operator who receives orders in a Telegram admin group and moves them through statuses.

## Product Purpose
A reusable Telegram Mini App + bot template that a local fast-food restaurant can rebrand and launch to take delivery orders without building its own app. Success: a first-time visitor goes from opening the bot to a confirmed order in under a minute, and repeat customers reorder with their saved address in a few taps.

## Positioning
Ordering lives entirely inside Telegram, the messenger Uzbek customers already use daily: no app install, no account, language chosen once in the bot and shared with the Mini App, and the restaurant's admin group is the order desk.

## Operating Context
- Opened from the bot's Menu Button or an inline "open menu" button; rendered in Telegram's WebView on iOS/Android/desktop, which supplies a native Back button and light or dark theme colours (the app deliberately ignores the dark theme; see Brand Commitments).
- Bilingual UI (Uzbek Latin default, Russian), every string from `frontend/src/locales/*.json`.
- Prices in so'm (UZS), formatted with spaces (32 000 so'm).
- Flow: onboarding (first run only) → home → catalog → product bottom sheet → cart with order bump → payment (cash, Payme/Click via Telegram Payments, Telegram Stars) → admin group notification.

## Capabilities and Constraints
- Next.js App Router + Tailwind v4 + Zustand frontend; Node.js/Telegraf/Express/PostgreSQL backend. Existing codebase answers the stack.
- Universal template: restaurant name, logo, brand colour and imagery must be swappable per restaurant; the design must hold up with any brand colour and stay light when Telegram is in dark mode.
- Required surfaces (from the brief): Onboarding (3 swipe slides + Start), Home (greeting header, stories, hero widget, bottom navigation Home/Catalog/Cart/Profile), Catalog (horizontal categories All/Burgers/Pizza/Drinks/Premium, card with image, name, struck old price, red new price, quick "+"), Product bottom sheet (large image, ingredient bullets, risk-reversal block, sticky "Add to cart – price"), Cart (order stack, order-bump switch "+Cola for 5 000 so'm", total, payment methods, one-tap confirm).
- Payme/Click is only available when a provider token is configured; otherwise shown as unavailable.

## Brand Commitments
- Working name "Fast Delivery" is a placeholder; each restaurant rebrands.
- Visual direction is a standing preference: the category standard of food-delivery apps, played straight with a premium feel, benchmarked against Yandex Eda and Uzum Tezkor / Express24. No themed or ornamental worlds.
- Always light: the app renders light surfaces even in Telegram dark mode (the user asked for no black surfaces).
- Onboarding copy is fixed by the brief: "Och qoldingizmi? Biz eng mazali fast-foodlarni yetkazib beramiz.", "Qanday ishlaydi? 1. Tanlang 2. Buyurtma bering 3. Kutib oling.", "10,000+ mijozlarimiz safiga qo'shiling!", button "Boshlash".

## Evidence on Hand
- Seed menu of 12 products with UZ/RU names, ingredients and prices in `backend/src/database/seed.js`.
- No real restaurant photos, logo, reviews or ratings exist. Product imagery is AI-generated placeholder and must be labelled as such for restaurants to replace. The "10,000+" and "4.9" figures are template copy from the brief, to be replaced by each restaurant's real numbers. Service promises ("30 daqiqa" delivery time, "100% halol", free delivery, fresh ingredients daily) are per-restaurant placeholders set in `frontend/src/config/brand.ts` (`promises`), where a restaurant turns off any it cannot keep; story copy (e.g. "faqat shu hafta") is demonstration promo content to replace.

## Product Principles
1. Speed to order beats browsing: every screen keeps the next action one tap away.
2. Prices are honest and unmissable: old vs new price, totals and fees always visible before confirming.
3. Native to Telegram: respect its theme, Back button, haptics and safe areas; never feel like a website in a frame.
4. Bilingual by construction: Uzbek and Russian strings both fit every layout.
5. Rebrandable: identity comes from a few tokens and assets, not hard-coded styling.

## Accessibility & Inclusion
Readable at small phone sizes, body contrast ≥ 4.5:1 on the app's always-light surfaces (whatever Telegram's theme), large tap targets for one-handed use, Cyrillic and Latin glyph coverage.
