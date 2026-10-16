# 🍔 Fast Delivery — Telegram Bot + Mini App (UZ / RU)

O'zbekistondagi fast-food restoranlari uchun ikki tilli Telegram bot va to'laqonli Telegram Mini App.

| Qism | Texnologiyalar | Papka |
|---|---|---|
| Bot + REST API | Node.js, Telegraf, Express, Sequelize, PostgreSQL (Neon) | [`backend/`](backend) |
| Mini App | Next.js (App Router), TypeScript, Tailwind CSS v4, Zustand, Lucide, Onest | [`frontend/`](frontend) |

## Imkoniyatlar

**Bot**
- `/start` da til tanlash (🇺🇿 O'zbekcha / 🇷🇺 Русский), barcha matnlar `backend/src/locales/*.json` da
- Chat "Menyu" tugmasi (Menu Button) va inline tugma orqali Mini App ochiladi
- Buyurtmalarim, aloqa, telefon raqamni yuborish, tilni o'zgartirish
- Har bir yangi buyurtma admin/guruhga yuboriladi: mijoz ismi, telefon, manzil, mahsulotlar, jami summa
- Admin tugmalari: ✅ Qabul qilish → 🚴 Yo'lga chiqdi → 🏁 Yetkazildi / ❌ Bekor qilish (mijozga uning tilida xabar boradi)
- To'lovlar: hozircha faqat naqd pul; Payme/Click provider token qo'shilganda yoqiladi

**Mini App**
1. **Onboarding** — 3 ta swipe slayd, faqat birinchi kirishda
2. **Bosh sahifa** — ism bilan salomlashish, stories, hero vidjet, ommabop mahsulotlar
3. **Katalog** — gorizontal kategoriyalar, eski (chizilgan) va yangi (qizil) narx, tezkor "+" tugmasi
4. **Mahsulot** — Bottom Sheet: katta rasm, tarkibi, ishonch bloki, sticky "Savatchaga qo'shish — narx"
5. **Savatcha** — Order Stack, Order Bump (Switch), manzil, to'lov usullari, jami summa, bitta bosishda tasdiqlash

### Dizayn

UI [Impeccable](https://impeccable.style) (`.claude/skills/impeccable`) yordamida: yetkazib berish ilovalarining standarti
(Yandex Eda / Uzum Tezkor darajasida), premium va xotirjam. Iliq-neytral kulrang fon, oq kartochkalar, taom suratlari va narxlar
oldinda, bitta za'faron rangli brend (#FFC21A, ustida to'q matn), chegirmadagi narx qizil, Lucide ikonkalar, Onest shrifti
(lotin va kirill). "+" tugmasi o'sha joyda "− 1 +" boshqaruviga aylanadi, pastki menyu ustida suzuvchi savatcha paneli
(soni va jami summa), oq "Rahmat!" ekrani. Ilova doim yorug' mavzuda (Telegram tungi rejimida ham).
Mahsulot konteksti: [`PRODUCT.md`](PRODUCT.md), yo'nalish shartnomasi: `.impeccable/surfaces/`, dizayn tizimi: [`DESIGN.md`](DESIGN.md).

**Boshqa restoranga moslashtirish:** faqat [`frontend/src/config/brand.ts`](frontend/src/config/brand.ts) ni o'zgartiring —
`name`, `brand` (asosiy rang), `onBrand` (uning ustidagi matn, kontrast ≥ 4.5:1), `brandSoft` / `brandInk` (och fon va undagi matn),
`chrome` (Telegram sarlavha/fon rangi) hamda `promises` (30 daqiqa, halol, bepul yetkazish — bajarilmaydiganini o'chiring).
Butun interfeys shu tokenlardan olinadi.

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

### 3. Production'ga chiqarish (hozircha faqat naqd pul)

Tavsiya etilgan sxema: **Neon** (baza, allaqachon bor) + **Render** (bot + API, `render.yaml`) + **Vercel** (Mini App).

**0. Xavfsizlik.** Bot tokeni va baza paroli ochiq yozilgan bo'lsa, avval almashtiring:
BotFather → `/mybots` → bot → *API Token* → *Revoke*; Neon → *Roles* → parolni yangilang.

**1. Mini App — GitHub Pages (bepul).** Repozitoriyda `.github/workflows/pages.yml` bor: har bir push'da frontend
statik fayllarga yig'iladi va `https://abdul0018.github.io/Fast-Delivery-Bot/` ga joylanadi. Bir martalik sozlash:
*Settings → Pages → Source: GitHub Actions*; *Settings → Secrets and variables → Actions → Variables* → `API_URL` =
`https://<backend-manzil>/api`, so'ng *Actions → Deploy Mini App to GitHub Pages → Run workflow*.
Backend'da: `WEBAPP_URL=https://abdul0018.github.io/Fast-Delivery-Bot/`, `CORS_ORIGINS=https://abdul0018.github.io`.
GitHub Pages faqat statik fayllar uchun — bot va API baribir alohida serverda (2-qadam) ishlashi kerak.

**1b. Yoki Mini App — Vercel.** vercel.com → *Add New Project* → shu repozitoriy → *Root Directory*: `frontend`.
Environment: `NEXT_PUBLIC_API_URL=https://<render-manzil>/api`, `NEXT_PUBLIC_DEV_AUTH=false`. Deploy →
`https://<loyiha>.vercel.app` manzilini oling (bu **WEBAPP_URL**).

**2. Bot + API (Render).** render.com → *New* → *Blueprint* → shu repozitoriy (`render.yaml` o'qiladi). O'zgaruvchilar:

| Kalit | Qiymat |
|---|---|
| `BOT_TOKEN` | BotFather tokeni |
| `DATABASE_URL` | Neon ulanish satri (`?sslmode=verify-full`) |
| `WEBAPP_URL` | `https://<loyiha>.vercel.app` |
| `CORS_ORIGINS` | `https://<loyiha>.vercel.app` |
| `WEBHOOK_DOMAIN` | `https://fast-delivery-api.onrender.com` (Render bergan manzil) |
| `ADMIN_CHAT_ID` | hozircha bo'sh — 3-qadamda to'ldiriladi |

Birinchi ishga tushishda jadvallar yaratiladi va menyu bo'sh bo'lsa 12 ta namuna mahsulot qo'shiladi.
Vercel'dagi `NEXT_PUBLIC_API_URL` ni Render manziliga moslab, frontend'ni qayta deploy qiling.

**3. Admin guruh.** Telegram'da guruh yarating, botni qo'shing, guruhda `/id` yuboring — bot chat ID ni yozadi
(`-100...`). Uni Render'da `ADMIN_CHAT_ID` ga yozing (servis qayta ishga tushadi). Shu paytgacha bot
buyurtma qabul qilmaydi — mijozga "vaqtincha to'xtatilgan" deb ko'rsatiladi, hech bir buyurtma yo'qolmaydi.

**4. Tekshirish.** Botga `/start` → til → "🍔 Menyu" → mahsulot → savatcha → manzil va telefon → *Tasdiqlash*.
Guruhga buyurtma tushadi; "✅ Qabul qilish → 🚴 Yo'lga chiqdi → 🏁 Yetkazildi" tugmalari mijozga xabar yuboradi.
`https://<render-manzil>/api/health` → `{"ok":true}` (baza bilan aloqa ham tekshiriladi).

**Muhim:**
- Render bepul tarifida servis 15 daqiqa ishlatilmasa "uxlaydi"; webhook uni uyg'otadi, lekin birinchi javob ~30–50 soniya
  kechikadi. Haqiqiy restoran uchun pullik (Starter) tarif tavsiya etiladi.
- VPS'da Docker bilan: `docker build -t fast-delivery backend && docker run -d --env-file backend/.env -p 4000:4000 fast-delivery`
  (`WEBHOOK_DOMAIN` bo'sh — long polling). Bitta token bilan faqat **bitta** nusxa ishlasin.
- Production himoyasi: `ALLOW_DEV_AUTH` o'chiq, `WEBAPP_URL`/`CORS_ORIGINS` noto'g'ri bo'lsa server ishga tushmaydi,
  telefon majburiy, bitta foydalanuvchi 10 daqiqada 5 tadan ortiq buyurtma bera olmaydi, admin xabari 3 marta qayta yuboriladi.
- **Payme / Click** keyinroq: BotFather → *Payments* → provider token → `PAYMENT_PROVIDER_TOKEN`. Token qo'shilishi bilan
  savatchada avtomatik paydo bo'ladi.

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
└── styles/globals.css           # Tailwind + dizayn tokenlari (doim yorug')
```

> ⚠️ `.env` va `.env.local` fayllari `.gitignore` da — maxfiy kalitlar repozitoriyga yuklanmaydi.
