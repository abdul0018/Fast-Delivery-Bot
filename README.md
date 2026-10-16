# 🍔 Fast Delivery — Telegram Bot + Mini App (UZ / RU)

O'zbekistondagi fast-food restoranlari uchun ikki tilli Telegram bot va to'laqonli Telegram Mini App.

| Qism | Texnologiyalar | Papka |
|---|---|---|
| Bot + REST API | Node.js, Telegraf, Express, Sequelize, PostgreSQL (Neon) | [`backend/`](backend) |
| Mini App | Next.js (App Router), TypeScript, Tailwind CSS v4, Zustand, Lucide, Red Hat Display | [`frontend/`](frontend) |

## Imkoniyatlar

**Bot**
- `/start` da til tanlash (🇺🇿 O'zbekcha / 🇷🇺 Русский), barcha matnlar `backend/src/locales/*.json` da
- Chat "Menyu" tugmasi (Menu Button) va inline tugma orqali Mini App ochiladi
- Buyurtmalarim, aloqa, telefon raqamni yuborish, tilni o'zgartirish
- Har bir yangi buyurtma admin/guruhga yuboriladi: mijoz ismi, telefon, manzil, mahsulotlar, jami summa
- Admin tugmalari: ✅ Qabul qilish → 🚴 Yo'lga chiqdi → 🏁 Yetkazildi / ❌ Bekor qilish (mijozga uning tilida xabar boradi)
- To'lovlar: naqd pul, Telegram Stars (XTR), Payme/Click (Telegram Payments provider token orqali)

**Mini App**
1. **Onboarding** — 3 ta swipe slayd, faqat birinchi kirishda
2. **Bosh sahifa** — ism bilan salomlashish, stories, hero vidjet, ommabop mahsulotlar
3. **Katalog** — gorizontal kategoriyalar, eski (chizilgan) va yangi (qizil) narx, tezkor "+" tugmasi
4. **Mahsulot** — Bottom Sheet: katta rasm, tarkibi, ishonch bloki, sticky "Savatchaga qo'shish — narx"
5. **Savatcha** — Order Stack, Order Bump (Switch), manzil, to'lov usullari, jami summa, bitta bosishda tasdiqlash

### Dizayn

UI foydalanuvchi bergan namuna asosida va [Impeccable](https://impeccable.style) (`.claude/skills/impeccable`) yordamida:
oq fon, yorqin qizil (#F00000), och kulrang kartochkalar, yashil "+" tugmalar, pushti yumshoq fon,
oddiy chiziqli ikonkalar (Lucide), Red Hat Display shrifti (kirill harflari uchun Manrope).
Qizil splash/onboarding, "Menyu" sahifasi qidiruv va kategoriya plitkalari bilan, qizil "Rahmat!" ekrani.
Mahsulot konteksti: [`PRODUCT.md`](PRODUCT.md), yo'nalish shartnomasi: `.impeccable/surfaces/`, dizayn tizimi: [`DESIGN.md`](DESIGN.md).

**Boshqa restoranga moslashtirish:** faqat [`frontend/src/config/brand.ts`](frontend/src/config/brand.ts) ni o'zgartiring —
`name`, `brand` (asosiy qizil), `onBrand` (uning ustidagi matn), `accent` / `onAccent` ("+" tugmalari rangi), `soft` (yumshoq fon),
hamda `promises` (30 daqiqa, halol, bepul yetkazish — bajarilmaydiganini o'chiring).
Butun interfeys va Telegram sarlavha rangi shu tokenlardan olinadi; tungi (dark) mavzu avtomatik.

**Rasmlar:** `frontend/public/images/products/*.jpg` — Pollinations.ai (bepul) orqali yaratilgan **namuna** rasmlar
(har bir faylga prompt va manba JPEG izohi sifatida yozilgan). Restoranning haqiqiy fotosuratlari bilan shu nomlarda almashtiring.
Onboarding'dagi "10,000+" va "4.9" raqamlari ham namuna — haqiqiy ko'rsatkichlar bilan almashtiring.

Xavfsizlik: Mini App so'rovlari Telegram `initData` imzosi (HMAC-SHA256) bilan tekshiriladi, narxlar faqat serverda hisoblanadi.

## O'rnatish

### 1. Backend

```bash
cd backend
cp .env.example .env      # BOT_TOKEN, DATABASE_URL, WEBAPP_URL, ADMIN_CHAT_ID ni to'ldiring
npm install
npm run db:seed           # jadvallarni yaratadi va 12 ta mahsulot qo'shadi
npm run dev               # API: http://localhost:4000/api + bot (long polling)
```

Jadvallarni SQL orqali qo'lda yaratish ham mumkin: `psql "$DATABASE_URL" -f src/database/schema.sql`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=https://<backend-domeni>/api
npm install
npm run dev                  # http://localhost:3000
```

Brauzerda (Telegramsiz) buyurtma berishni sinash uchun: backend `.env` da `ALLOW_DEV_AUTH=true`,
frontend `.env.local` da `NEXT_PUBLIC_DEV_AUTH=true` qiling (faqat lokal; production'da o'chiq bo'lishi shart).

### 3. Telegram sozlamalari

1. **WEBAPP_URL** — Mini App HTTPS manzili (masalan, Vercel). Bot ishga tushganda Menu Button'ni shu manzilga o'zi bog'laydi.
2. **ADMIN_CHAT_ID** — botni admin guruhiga qo'shing, guruh ID sini oling (`-100...` ko'rinishida) va `.env` ga yozing.
3. **Payme / Click** — BotFather → `/mybots` → Payments → provider tanlang, tokenni `PAYMENT_PROVIDER_TOKEN` ga yozing.
   Token bo'lmasa Mini App'da bu usul "Tez orada" deb ko'rsatiladi.
4. **Telegram Stars** — qo'shimcha sozlash shart emas; kurs `STARS_RATE_UZS` (1 ⭐ = necha so'm).

### 4. Deploy

- **Frontend** → Vercel (Root Directory: `frontend`), `NEXT_PUBLIC_API_URL` ni sozlang.
- **Backend** → Render / Railway / VPS (`npm start`), `CORS_ORIGINS` ga frontend domenini yozing.
  Bot long polling ishlatadi — bir vaqtda faqat bitta nusxa ishga tushirilsin.

## Struktura

```
backend/src/
├── config/default.js            # .env dan sozlamalar
├── core/bot.js                  # Telegraf instansiyasi
├── database/                    # connection.js, schema.sql, sync.js, seed.js
├── models/                      # User.js, Product.js, Order.js, index.js (bog'lanishlar)
├── controllers/                 # startController, cartController, adminController, paymentController
├── routes/                      # bot.routes.js, api.routes.js
├── middlewares/auth.middleware.js  # botAuth + Mini App initData tekshiruvi
├── locales/                     # uz.json, ru.json
├── utils/                       # keyboards.js, logger.js, i18n.js, format.js
├── server.js                    # Express
└── index.js                     # ishga tushirish

frontend/src/
├── app/                         # layout.tsx, page.tsx, catalog/, cart/, profile/
├── config/brand.ts              # restoran nomi va brend ranglari (rebrend shu yerda)
├── components/ui/               # Button, Input, BottomSheet, Switch, QuantityStepper, Toast, Skeleton
├── components/features/         # Onboarding, Stories, HeroWidget, ProductCard, ProductSheet, CartList, OrderBump ...
├── components/layout/           # Header, BottomNavigation, AppShell
├── hooks/                       # useTelegram, useCart, useI18n, useCatalog
├── lib/                         # api.ts, i18n.ts, utils.ts
├── providers/TelegramProvider.tsx
├── store/                       # cartStore, settingsStore, catalogStore, userStore, uiStore (Zustand)
├── locales/                     # uz.json, ru.json
└── styles/globals.css           # Tailwind + dizayn tokenlari (yorug' / tungi)
```

> ⚠️ `.env` va `.env.local` fayllari `.gitignore` da — maxfiy kalitlar repozitoriyga yuklanmaydi.
