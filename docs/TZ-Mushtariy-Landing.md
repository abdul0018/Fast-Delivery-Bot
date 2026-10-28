# Texnik topshiriq (TZ)
## «Mushtariy Premium Restaurant» — landing sayt va Telegram orqali buyurtma qabul qilish

| | |
|---|---|
| Hujjat versiyasi | 1.0 (qoralama) |
| Sana | 28.10.2026 |
| Buyurtmachi | Mushtariy Premium Restaurant — [Instagram](https://www.instagram.com/mushtariy_premium_restaurant) |
| Ijrochi | — |
| Holati | Buyurtmachi bilan kelishish uchun |

> Belgilar: **[MVP]** — 1-bosqichda albatta bo'ladi, **[2-bosqich]** — keyinroq, **[?]** — buyurtmachi tasdiqlashi kerak.

---

## 1. Loyihaning maqsadi

1. Restoranning Instagram'dan tashqaridagi rasmiy sayti bo'lishi: restoran haqida, menyu, narxlar, manzil, ish vaqti, aloqa.
2. Mijoz saytdan ro'yxatdan o'tmasdan, 1–2 daqiqada taom buyurtma qila olishi.
3. Har bir buyurtma **darhol restoran menejerlarining Telegram guruhiga** tushishi va menejer uni Telegram'dan turib boshqarishi
   (qabul qilish → yo'lga chiqarish → yetkazildi / bekor qilish). Restoran uchun alohida murakkab CRM shart emas.
4. Instagram bio'dagi havola, Google/Yandex xaritalar va qidiruvdan keladigan mijozlarni buyurtmaga aylantirish.

### O'lchanadigan natijalar (KPI)
- Mobil telefonda sahifa 2,5 soniyadan tez ochiladi (LCP < 2,5 s, Lighthouse Mobile ≥ 90).
- Saytga kirgandan buyurtma tasdiqlanguncha — 60 soniyadan kam (oddiy buyurtma uchun).
- Buyurtma saytda tasdiqlangandan Telegram guruhga tushguncha — 5 soniyadan kam.
- Bitta ham buyurtma yo'qolmasligi: Telegram ishlamay qolsa ham buyurtma bazada saqlanadi va qayta yuboriladi.

---

## 2. Atamalar

| Atama | Ma'nosi |
|---|---|
| Landing / sayt | Restoranning bir sahifali (va bir nechta yordamchi sahifali) veb-sayti |
| Mijoz | Saytdan buyurtma beruvchi odam |
| Menejer | Restoran xodimi, buyurtmalarni Telegram guruhda qabul qiladi |
| Menejerlar guruhi | Telegram guruh, unda bot va restoran menejerlari bor |
| Bot | Restoranning Telegram boti — buyurtmalarni guruhga yuboradi, tugmalarni qayta ishlaydi |
| Admin panel | Menyu, narx, rasm, ish vaqtini tahrirlash uchun himoyalangan sahifa |
| Stop-list | Vaqtincha tugagan, buyurtma qilib bo'lmaydigan taomlar ro'yxati |

---

## 3. Foydalanuvchilar

1. **Mijoz** — asosan telefondan (80%+ trafik mobil bo'ladi deb hisoblanadi), Instagram bio'dagi havoladan yoki xaritadan
   keladi, o'zbek yoki rus tilida. Uyga/ofisga yetkazib berish yoki olib ketish uchun buyurtma qiladi.
2. **Menejer** — Telegram'da ishlaydi, buyurtmani ko'radi, mijozga qo'ng'iroq qilib tasdiqlaydi, oshxona va kuryerga uzatadi.
3. **Restoran egasi / administrator** — menyu, narx va ish vaqtini o'zgartiradi, buyurtmalar statistikasini ko'radi.

---

## 4. Loyiha doirasi

### Kiradi
- Landing sayt (UZ/RU) — bo'limlar 5-bandda.
- Onlayn menyu, savatcha va buyurtma formasi.
- Buyurtmani Telegram menejerlar guruhiga yuborish va statuslarni tugmalar bilan boshqarish.
- Menyuni boshqarish uchun oddiy admin panel.
- SEO, analitika, domen va hostingga joylash.

### Kirmaydi (alohida kelishiladi)
- Mobil ilova (iOS/Android).
- Kuryerlar uchun alohida ilova, kuryerni xaritada kuzatish.
- Onlayn to'lov (Payme/Click/Uzum) — **[2-bosqich]**.
- Kassa / POS (iiko, R-Keeper, Poster va h.k.) bilan integratsiya — **[2-bosqich, ?]**.
- Sodiqlik dasturi, bonuslar, promokodlar — **[2-bosqich]**.

---

## 5. Sayt tuzilmasi (sitemap)

```
/                 — Bosh sahifa (landing, barcha asosiy bo'limlar)
/menu             — To'liq menyu (kategoriyalar bo'yicha) — SEO uchun alohida sahifa
/menu/<taom>      — Taom sahifasi (ixtiyoriy, SEO uchun) [2-bosqich]
/checkout         — Buyurtmani rasmiylashtirish
/order/<kod>      — "Buyurtmangiz qabul qilindi" sahifasi
/privacy          — Maxfiylik siyosati (shaxsiy ma'lumotlar)
/admin            — Admin panel (parol bilan)
/ru/...           — Rus tilidagi versiya (yoki ?lang=ru)
```

### 5.1. Bosh sahifa bo'limlari (yuqoridan pastga)

| # | Bo'lim | Tarkibi | Bosqich |
|---|---|---|---|
| 1 | **Header** (yopishqoq) | Logotip, menyu havolalari (Menyu, Biz haqimizda, Aloqa), til almashtirgich UZ/RU, telefon raqami (bosilganda qo'ng'iroq), savatcha ikonkasi soni bilan | MVP |
| 2 | **Hero** | Restoran interyeri yoki eng mashhur taomning sifatli surati/qisqa video, sarlavha (masalan, «Mushtariy — premium ta'm, uyingizgacha»), 2 ta tugma: «Buyurtma berish» (menyuga scroll) va «Qo'ng'iroq qilish». Ish vaqti va «Hozir ochiq / yopiq» belgisi | MVP |
| 3 | **Afzalliklar** | 3–4 ta qisqa blok: yetkazib berish vaqti, halol, oshpaz, zal sig'imi va h.k. (faqat restoran haqiqatda bajaradiganlari) | MVP |
| 4 | **Menyu** | Kategoriya tablari (gorizontal, scroll), taom kartochkalari, «Savatga qo'shish» | MVP |
| 5 | **Biz haqimizda** | Qisqa tarix, interyer suratlari, oshpaz | MVP |
| 6 | **Galereya** | Interyer va taomlar suratlari (Instagram'dan tanlab olinadi) | MVP |
| 7 | **Banket / stol band qilish** | Zal haqida, sig'imi, «Stol band qilish» formasi (ism, telefon, sana, vaqt, mehmonlar soni) → so'rov ham Telegram guruhga tushadi | **[?]** |
| 8 | **Sharhlar** | Haqiqiy mijozlar sharhlari (Google/Yandex xaritadan yoki Instagram'dan, ruxsat bilan). Soxta sharh yozilmaydi | MVP |
| 9 | **Yetkazib berish shartlari** | Hudud, narx, minimal buyurtma summasi, taxminiy vaqt, to'lov usullari | MVP |
| 10 | **Aloqa** | Manzil, mo'ljal, xarita (Yandex yoki Google, embed), telefon, Instagram, Telegram, ish vaqti | MVP |
| 11 | **Footer** | Logotip, ijtimoiy tarmoqlar, maxfiylik siyosati, © | MVP |
| — | **Suzuvchi savatcha paneli** (mobil) | Ekran pastida: «Savatcha · 3 ta · 245 000 so'm → Rasmiylashtirish» | MVP |

### 5.2. Taom kartochkasi
- Surat (kvadrat yoki 4:3, WebP/AVIF, lazy-load).
- Nomi (UZ/RU), qisqa tavsifi yoki tarkibi, porsiya hajmi/og'irligi (g, ml, dona).
- Narxi (so'mda, «85 000 so'm» formatida), chegirma bo'lsa eski narx chizilgan holda.
- Belgilar (ixtiyoriy): «Xit», «Yangi», «Achchiq», «Vegetarian».
- «+» tugmasi → savatga qo'shadi va o'sha joyda «− 1 +» boshqaruviga aylanadi.
- Kartochka bosilsa — kattaroq oyna (modal / bottom sheet): katta surat, to'liq tarkibi, miqdor, «Savatga qo'shish — narx».
- Stop-listdagi taom: kulrang, «Vaqtincha mavjud emas», qo'shib bo'lmaydi.
- **[?]** Modifikatorlar (masalan, porsiya o'lchami: 0,5 / 1 / 1,5; garnir tanlash) — menyuda bunday taomlar bo'lsa kerak bo'ladi.

---

## 6. Buyurtma berish jarayoni (mijoz tomoni)

```
Menyu → Savatga qo'shish → Savatcha → Rasmiylashtirish formasi → Tasdiqlash
      → "Buyurtma #1024 qabul qilindi" sahifasi
      → (ixtiyoriy) "Telegram'da kuzatish" tugmasi
```

### 6.1. Savatcha
- Taomlar ro'yxati, miqdorni o'zgartirish, o'chirish.
- Mahsulotlar summasi, yetkazib berish narxi, **jami** — doim ko'rinib turadi.
- Minimal buyurtma summasidan kam bo'lsa: «Yana 35 000 so'mlik taom qo'shing» va tugma faol emas.
- Savatcha brauzerda saqlanadi (sahifa yangilansa yoki qayta kirilsa yo'qolmaydi).
- **[2-bosqich]** Qo'shimcha taklif (masalan, «Non va salat qo'shasizmi?»).

### 6.2. Rasmiylashtirish formasi

| Maydon | Majburiy | Tekshiruv / izoh |
|---|---|---|
| Ism | ha | 2–50 belgi |
| Telefon | ha | `+998 XX XXX XX XX` niqobi, 9 ta raqam, O'zbekiston kodlari |
| Olish usuli | ha | «Yetkazib berish» / «Olib ketish» **[?]** |
| Manzil | yetkazishda ha | Ko'cha, uy; alohida maydonlar: podyezd, qavat, xonadon, mo'ljal |
| Xaritada nuqta | yo'q | **[2-bosqich]** Yandex Maps orqali joyni belgilash, koordinata menejerga havola bo'lib boradi |
| Vaqt | ha | «Imkon qadar tez» yoki «Belgilangan vaqtga» (bugun/ertaga, 30 daqiqa qadam bilan, faqat ish vaqti ichida) |
| To'lov usuli | ha | MVP: «Naqd pul», «Karta orqali kuryerga (terminal)» **[?]**. 2-bosqich: Payme/Click |
| Izoh | yo'q | 300 belgigacha (masalan, «domofon ishlamaydi») |
| Shaxsiy ma'lumotlarga rozilik | ha | Belgi + `/privacy` havolasi |

- Forma xatolari o'sha maydon yonida, tushunarli tilda («Telefon raqami to'liq emas»).
- «Buyurtmani tasdiqlash — 245 000 so'm» tugmasi; bosilgach ikki marta yuborilmasligi uchun bloklanadi.
- Ism, telefon va manzil keyingi buyurtma uchun brauzerda eslab qolinadi (mijoz rozi bo'lsa).

### 6.3. Tasdiqlangandan keyin
- Sahifa: «Rahmat! Buyurtma #1024 qabul qilindi. Menejer 5 daqiqa ichida siz bilan bog'lanadi.» + buyurtma tarkibi va jami summa.
- **«Telegram'da kuzatish»** tugmasi — `t.me/<bot>?start=order_<maxfiy_kod>` havolasi. Mijoz botni ochsa, buyurtma
  uning Telegram akkauntiga bog'lanadi va status o'zgarganda bot unga xabar yozadi («Buyurtmangiz yo'lga chiqdi 🚴»).
  Bu ixtiyoriy, majburiy emas.
- **[2-bosqich]** SMS xabarnoma (Eskiz.uz yoki shunga o'xshash provayder orqali).

### 6.4. Restoran yopiq bo'lganda
- Ish vaqtidan tashqarida sayt ochiq qoladi, menyu ko'rinadi, lekin: «Hozir yopiqmiz. Buyurtmalar 10:00 dan qabul qilinadi»
  va faqat «belgilangan vaqtga» buyurtma beriladi **[?]** yoki buyurtma tugmasi o'chiriladi.
- Menejer guruhdan buyurtma qabulini qo'lda to'xtatishi mumkin (8.4-band) — saytda shu xabar chiqadi.

---

## 7. Buyurtma berish jarayoni (menejer tomoni — Telegram)

### 7.1. Sozlash
- Restoran nomidan Telegram bot yaratiladi (@BotFather), masalan `@mushtariy_order_bot` (nom buyurtmachi bilan kelishiladi).
- «Mushtariy — Buyurtmalar» nomli yopiq guruh yaratiladi, unga bot va menejerlar qo'shiladi.
- Tugmalarni faqat shu guruh a'zolari bosa oladi; boshqa joydan kelgan bosishlar rad etiladi.
- **[?]** Banket/stol band qilish so'rovlari uchun alohida guruh yoki shu guruhda alohida mavzu (topic).

### 7.2. Yangi buyurtma xabari (namuna)

```
🆕 Buyurtma #1024 · 🌐 Sayt
🕐 28.10.2026, 19:42 · ⏱ Imkon qadar tez

👤 Aziz
📞 +998 90 123 45 67
🚚 Yetkazib berish
📍 Chilonzor 9-kvartal, 12-uy, 3-podyezd, 4-qavat, 45-xonadon
🧭 Mo'ljal: Korzinka yonida
🗺 Xaritada ochish            ← (nuqta belgilangan bo'lsa havola)

🍽 Tarkibi:
• Qozon kabob × 1 = 120 000
• Mastava × 2 = 70 000
• Non × 2 = 8 000

Mahsulotlar: 198 000 so'm
Yetkazib berish: 15 000 so'm
💰 Jami: 213 000 so'm
💵 To'lov: naqd

💬 Izoh: domofon ishlamaydi, qo'ng'iroq qiling

[ ✅ Qabul qilish ]  [ ❌ Bekor qilish ]
```

- Telefon raqami bosiladigan (`tel:`) bo'ladi — menejer bir bosishda qo'ng'iroq qiladi.
- Til: guruhdagi xabarlar bitta tilda (UZ yoki RU, sozlamada tanlanadi), taom nomlari ham shu tilda.

### 7.3. Statuslar va tugmalar

| Status | Kim o'zgartiradi | Tugmalar | Guruhdagi xabarda nima o'zgaradi |
|---|---|---|---|
| 🆕 Yangi | — | ✅ Qabul qilish · ❌ Bekor qilish | — |
| ✅ Qabul qilindi | menejer | 👨‍🍳 Tayyorlanmoqda **[?]** · 🚴 Yo'lga chiqdi · ❌ Bekor qilish | «✅ Qabul qildi: Dilshod, 19:44» |
| 🚴 Yo'lda | menejer | 🏁 Yetkazildi · ❌ Bekor qilish | «🚴 Yo'lga chiqdi: 20:05» |
| 🏁 Yetkazildi | menejer | — | «🏁 Yetkazildi: 20:31» — tugmalar olib tashlanadi |
| ❌ Bekor qilindi | menejer | — | Sabab so'raladi (tugmalar: «Mijoz rad etdi», «Javob bermadi», «Taom tugagan», «Boshqa») |

- Olib ketish (pickup) buyurtmalari uchun «Yo'lga chiqdi» o'rniga «🛍 Tayyor, olib ketish mumkin».
- Har bir o'zgarish xabarning o'zida tahrirlanadi (yangi xabar tashlanmaydi) — guruh toza turadi.
- Har o'zgarish bazaga yoziladi: kim, qachon, qaysi statusdan qaysiga.
- Mijoz Telegram'ni bog'lagan bo'lsa, unga status haqida xabar boradi (uning tilida).
- 5 daqiqa ichida hech kim «Qabul qilish»ni bosmasa — guruhga eslatma: «⚠️ #1024 hali qabul qilinmadi» **[?]**.

### 7.4. Guruhdagi bot buyruqlari
| Buyruq | Vazifasi |
|---|---|
| `/id` | Guruh ID sini ko'rsatadi (sozlash uchun) |
| `/pause` · `/resume` | Saytda buyurtma qabulini vaqtincha to'xtatish / qayta yoqish (masalan, oshxona band) |
| `/stop <taom>` · `/unstop <taom>` | Taomni stop-listga qo'shish / chiqarish (yoki tugmali ro'yxat orqali) |
| `/today` | Bugungi buyurtmalar soni va summasi, statuslar bo'yicha |

### 7.5. Ishonchlilik
- Buyurtma **avval bazaga yoziladi**, keyin Telegram'ga yuboriladi. Telegram javob bermasa — 3 marta qayta urinadi,
  baribir bo'lmasa xato logga yoziladi va zaxira kanalga (ikkinchi guruh yoki e-mail) yuboriladi.
- Bot tokeni faqat serverda saqlanadi, sayt kodida (brauzerda) **hech qachon** bo'lmaydi.
- Bitta bot tokeni bilan faqat bitta server nusxasi ishlaydi (webhook rejimi).

---

## 8. Admin panel

**[MVP]** minimal, **[2-bosqich]** kengaytirilgan.

| Funksiya | Bosqich |
|---|---|
| Kirish: login + parol (yoki Telegram Login faqat ruxsat etilgan akkauntlar uchun) | MVP |
| Kategoriyalar: qo'shish, tahrirlash, tartibini o'zgartirish, yashirish | MVP |
| Taomlar: nom UZ/RU, tavsif UZ/RU, narx, eski narx, porsiya, surat yuklash, belgilar, faol/stop-list | MVP |
| Sozlamalar: ish vaqti (hafta kunlari bo'yicha), yetkazib berish narxi, minimal summa, telefon, manzil, buyurtma qabuli yoqilgan/o'chirilgan | MVP |
| Buyurtmalar ro'yxati: filtr (sana, status), qidiruv (telefon, raqam), batafsil ko'rish | MVP |
| Hisobot: kunlik/oylik buyurtmalar soni, summa, eng ko'p sotilgan taomlar, Excel'ga eksport | 2-bosqich |
| Bir nechta menejer roli (admin / operator) | 2-bosqich |
| Bannerlar va aksiyalar | 2-bosqich |

Yuklangan suratlar avtomatik siqiladi va WebP/AVIF formatiga o'giriladi (bir nechta o'lchamda).

---

## 9. Dizayn talablari

- **Mobile-first**: avval 360–430 px telefon ekrani, keyin planshet va kompyuter (≥ 1280 px).
- Uslub: **premium restoran** — xotirjam, keng bo'sh joy, sifatli taom suratlari asosiy o'rinda. Ranglar va shrift
  restoranning logotipi va Instagram uslubidan olinadi (brendbuk bo'lmasa — dizayner taklif qiladi va kelishiladi).
- Shrift lotin va kirill harflarini to'liq qo'llab-quvvatlashi shart (o'zbekcha `oʻ`, `gʻ` belgilari ham).
- Narxlar va «Buyurtma berish» tugmasi har doim ko'zga tashlanib turadi; mobilda tugmalar bosh barmoq bilan bosishga qulay (≥ 44 px).
- Matn kontrasti WCAG AA (≥ 4,5:1).
- Animatsiyalar yengil, `prefers-reduced-motion` hurmat qilinadi.
- Dizayn bosqichi: Figma'da maket — mobil + desktop, bosh sahifa, menyu, savatcha, checkout, «rahmat» sahifasi, admin panel.
  Buyurtmachi maketni tasdiqlagach dasturlash boshlanadi.
- Soxta ma'lumot ishlatilmaydi: «10 000+ mijoz», «4.9 reyting» kabi raqamlar faqat haqiqiy bo'lsa yoziladi.

---

## 10. Funksional bo'lmagan talablar

### 10.1. Tezlik
- Lighthouse (Mobile): Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 95.
- LCP < 2,5 s, CLS < 0,1, INP < 200 ms (4G tarmoqda).
- Sahifalar statik generatsiya qilinadi (SSG/ISR), suratlar CDN orqali, lazy-load.

### 10.2. SEO
- Har bir sahifada `title`, `description`, Open Graph (Instagram/Telegram'da ulashganda chiroyli ko'rinish).
- `schema.org` mikrorazmetka: `Restaurant` (manzil, telefon, ish vaqti, narx darajasi), `Menu`.
- `sitemap.xml`, `robots.txt`, `hreflang` (uz/ru).
- Google Business Profile va Yandex Biznes kartochkalariga sayt havolasi qo'yiladi.

### 10.3. Ko'p tillilik
- O'zbek (lotin, asosiy) va rus tillari. Barcha matnlar alohida fayllarda/bazada, kodga yozilmaydi.
- **[?]** Ingliz tili (turistlar uchun).
- Til tanlovi eslab qolinadi; birinchi kirishda brauzer tiliga qarab taklif qilinadi.

### 10.4. Xavfsizlik
- Faqat HTTPS.
- **Narx va jami summa faqat serverda hisoblanadi** — brauzerdan kelgan narxga ishonilmaydi.
- Spamdan himoya: bitta IP/telefondan 10 daqiqada 3 tadan ortiq buyurtma yo'q; ko'rinmas «honeypot» maydon;
  Cloudflare Turnstile (yoki reCAPTCHA v3) — foydalanuvchiga ko'rinmaydigan rejimda.
- Barcha kiritilgan matnlar Telegram'ga yuborishdan oldin tozalanadi (HTML-escape).
- Admin panel: parollar hash'langan, kirishga urinishlar soni cheklangan, sessiya muddati bor.
- `.env` dagi maxfiy kalitlar (bot tokeni, baza paroli) repozitoriyga yuklanmaydi.
- Bazaning kunlik avtomatik zaxira nusxasi (backup), kamida 7 kun saqlanadi.

### 10.5. Shaxsiy ma'lumotlar (huquqiy)
- Saytda maxfiylik siyosati sahifasi va checkout'da rozilik belgisi.
- O'zbekistonning «Shaxsiy ma'lumotlar to'g'risida»gi qonuni (ZRU-547) O'zbekiston fuqarolarining shaxsiy ma'lumotlarini
  respublika hududidagi serverlarda saqlashni talab qiladi. Shu sababli bazani **O'zbekistondagi hostingda**
  (masalan, mahalliy VPS) joylashtirish tavsiya etiladi. Yakuniy qarorni buyurtmachi yurist bilan maslahatlashib qabul qiladi.

### 10.6. Brauzerlar
- Chrome, Safari (iOS 15+), Samsung Internet, Firefox, Edge — oxirgi 2 versiya.
- Instagram va Telegram ichidagi brauzerda (in-app browser) to'g'ri ishlashi **majburiy** — mijozlar asosan shu yerdan keladi.

### 10.7. Analitika
- Google Analytics 4 va/yoki Yandex Metrika, Meta Pixel (Instagram reklamasi uchun) **[?]**.
- Hodisalar: `view_menu`, `add_to_cart`, `begin_checkout`, `purchase` (buyurtma raqami va summa bilan), `click_call`, `click_instagram`.
- UTM belgilari buyurtma bilan birga saqlanadi — qaysi reklama/postdan buyurtma kelgani ko'rinadi.

---

## 11. Texnik yechim (arxitektura)

Repozitoriyda allaqachon ishlaydigan backend bor (Node.js, Express, Telegraf, PostgreSQL): mahsulotlar, buyurtmalar,
narxni serverda hisoblash, admin guruhga buyurtma yuborish va statuslar tugmalari tayyor. Landing uchun **shu backendni
qayta ishlatish va kengaytirish** tavsiya etiladi — noldan yozishdan tezroq va arzonroq.

```
 Mijoz (brauzer)                Server (Node.js + Express)              Telegram
 ┌────────────────┐  HTTPS  ┌─────────────────────────────┐  Bot API  ┌──────────────────┐
 │ Landing sayt   │────────▶│ REST API                    │──────────▶│ Menejerlar guruhi│
 │ Next.js (SSG)  │◀────────│ Buyurtma, menyu, sozlamalar │◀──────────│ (tugmalar)       │
 └────────────────┘         │ Telegraf bot (webhook)      │           └──────────────────┘
 ┌────────────────┐         │            │                │           ┌──────────────────┐
 │ Admin panel    │────────▶│            ▼                │──────────▶│ Mijoz (ixtiyoriy,│
 └────────────────┘         │      PostgreSQL             │           │ bot orqali)      │
                            └─────────────────────────────┘           └──────────────────┘
```

| Qism | Texnologiya |
|---|---|
| Landing + admin panel | Next.js (App Router, SSG/ISR), TypeScript, Tailwind CSS |
| Backend API + bot | Node.js, Express, Telegraf (mavjud kod kengaytiriladi) |
| Baza | PostgreSQL |
| Suratlar | Obyekt saqlash (S3-mos) + CDN, yoki serverda + Cloudflare |
| Hosting | Sayt: Vercel yoki VPS; backend + baza: O'zbekistondagi VPS (10.5-bandga qarang). «Uxlab qoladigan» bepul tariflar ishlatilmaydi — buyurtma kechikmasligi kerak |
| Domen | `mushtariy.uz` yoki shunga o'xshash **[?]**, SSL — Let's Encrypt |

### 11.1. Mavjud kodga kiritiladigan o'zgarishlar
1. Hozir har bir buyurtma Telegram foydalanuvchisiga bog'langan (`orders.user_id` majburiy, `users.telegram_id` majburiy).
   Saytdan kelgan buyurtmada Telegram akkaunt yo'q, shuning uchun:
   - `orders.user_id` ixtiyoriy (nullable) qilinadi;
   - `orders` ga yangi maydonlar: `source` (`telegram` | `web`), `customer_name`, `delivery_type` (`delivery` | `pickup`),
     `address_details` (JSONB: podyezd, qavat, xonadon, mo'ljal), `location` (lat/lng), `scheduled_at`, `delivery_fee`,
     `public_code` (buyurtmani kuzatish uchun tasodifiy kod), `utm` (JSONB), `cancel_reason`, `ip_hash`.
   - Status tarixi uchun yangi `order_events` jadvali: `order_id`, `from_status`, `to_status`, `actor_telegram_id`, `actor_name`, `created_at`.
2. Mahsulot kategoriyalari hozir qattiq ro'yxat (`burgers`, `pizza`, `drinks`, `premium`) — restoran menyusi uchun
   alohida `categories` jadvaliga o'tkaziladi (nom UZ/RU, tartib, faol).
3. `products` ga: `weight` / `portion`, `badges`, `is_in_stop_list`.
4. `settings` jadvali: ish vaqti, yetkazib berish narxi, minimal summa, buyurtma qabuli yoqilgan/o'chirilgan.
5. Admin guruh xabari formatiga sayt buyurtmasi maydonlari qo'shiladi (7.2-band).
6. Mavjud Telegram Mini App bilan bitta baza va bitta menyu ishlatiladi — restoran xohlasa, bot ichida ham buyurtma qabul qilinadi.

### 11.2. API (yangi va o'zgaradigan)

| Metod | Yo'l | Vazifasi | Himoya |
|---|---|---|---|
| GET | `/api/config` | Ish vaqti, hozir ochiqmi, yetkazish narxi, minimal summa, to'lov usullari | ochiq |
| GET | `/api/categories` | Kategoriyalar | ochiq |
| GET | `/api/products` | Faol taomlar (stop-list belgisi bilan) | ochiq |
| POST | `/api/web-orders` | Saytdan yangi buyurtma | Turnstile + rate limit |
| GET | `/api/web-orders/:publicCode` | Buyurtma holati («rahmat» sahifasi uchun) | maxfiy kod |
| POST | `/api/reservations` | Stol band qilish so'rovi **[?]** | Turnstile + rate limit |
| * | `/api/admin/*` | Admin panel CRUD | sessiya / JWT |

`POST /api/web-orders` so'rovi (namuna):

```json
{
  "items": [{ "productId": 12, "quantity": 2 }],
  "customer": { "name": "Aziz", "phone": "+998901234567" },
  "deliveryType": "delivery",
  "address": {
    "street": "Chilonzor 9-kvartal, 12-uy",
    "entrance": "3", "floor": "4", "apartment": "45",
    "landmark": "Korzinka yonida",
    "location": { "lat": 41.28, "lng": 69.20 }
  },
  "scheduledAt": null,
  "paymentMethod": "cash",
  "comment": "Domofon ishlamaydi",
  "lang": "uz",
  "consent": true,
  "utm": { "source": "instagram", "campaign": "bio" },
  "captchaToken": "..."
}
```

Javob `201`:

```json
{ "order": { "id": 1024, "publicCode": "k7Fq2xP9", "total": 213000, "status": "new" },
  "telegramTrackUrl": "https://t.me/mushtariy_order_bot?start=order_k7Fq2xP9" }
```

Xato kodlari: `CART_EMPTY`, `PRODUCT_UNAVAILABLE`, `BELOW_MIN_ORDER`, `RESTAURANT_CLOSED`, `ORDERS_PAUSED`,
`INVALID_PHONE`, `INVALID_ADDRESS`, `INVALID_TIME`, `CAPTCHA_FAILED`, `TOO_MANY_ORDERS` (429). Sayt har bir kod uchun
tushunarli xabar ko'rsatadi.

---

## 12. Buyurtmachidan kerakli materiallar

- [ ] Logotip (vektor: SVG/AI/PDF), brend ranglari, shriftlar (bo'lsa).
- [ ] To'liq menyu: kategoriyalar, taom nomlari (UZ va RU), tarkibi, porsiya/og'irligi, narxlari.
- [ ] Har bir taomning sifatli surati (yoki professional fotosessiya tashkil qilish **[?]**). Instagram'dagi suratlar sifati yetarli bo'lsa, ulardan foydalanish.
- [ ] Interyer suratlari / video, restoran haqida qisqa matn.
- [ ] Manzil, mo'ljal, xaritadagi nuqta, telefon raqam(lar), ish vaqti (hafta kunlari bo'yicha).
- [ ] Yetkazib berish shartlari: hudud, narx (qat'iy yoki masofaga qarab), minimal summa, taxminiy vaqt.
- [ ] To'lov usullari (naqd, kuryerda karta terminali).
- [ ] Menejerlar ro'yxati (Telegram akkauntlari) — guruhga qo'shish uchun.
- [ ] Domen (bor bo'lsa — kirish ma'lumotlari; bo'lmasa — nom tanlash).
- [ ] Haqiqiy mijozlar sharhlari (ruxsat bilan).
- [ ] Yuridik ma'lumotlar (maxfiylik siyosati uchun: kompaniya nomi, STIR).

---

## 13. Qabul qilish mezonlari (test ssenariylari)

| # | Ssenariy | Kutilgan natija |
|---|---|---|
| 1 | Telefondan (Instagram in-app browser) saytni ochish | 2,5 s ichida ochiladi, matn va tugmalar to'g'ri, gorizontal scroll yo'q |
| 2 | Til almashtirish UZ ↔ RU | Barcha matnlar, taom nomlari, xatolar tarjima qilingan; tanlov eslab qolinadi |
| 3 | 3 ta taomni savatga qo'shib, yetkazib berish bilan naqd buyurtma berish | «Rahmat» sahifasi raqam bilan; 5 s ichida guruhda 7.2-banddagi formatda xabar |
| 4 | Menejer «Qabul qilish → Yo'lga chiqdi → Yetkazildi» ni bosadi | Xabar tahrirlanadi, kim va qachon bosgani yoziladi, bazada tarix bor |
| 5 | Mijoz «Telegram'da kuzatish»ni bosib botni ochadi | Har status o'zgarishida unga xabar keladi |
| 6 | Brauzerda narxni o'zgartirib (DevTools) buyurtma yuborish | Server bazadagi narx bo'yicha hisoblaydi |
| 7 | Minimal summadan kam savatcha | Tugma faol emas, qancha qo'shish kerakligi yoziladi; server ham `BELOW_MIN_ORDER` qaytaradi |
| 8 | Stop-listdagi taom | Saytda «mavjud emas», savatda bo'lsa checkout'da ogohlantirish |
| 9 | Ish vaqtidan tashqarida buyurtma | Kelishilgan xatti-harakat (6.4) ishlaydi |
| 10 | Bir telefondan ketma-ket 4 ta buyurtma | 4-si rad etiladi (`TOO_MANY_ORDERS`) |
| 11 | Telegram API vaqtincha ishlamaydi | Buyurtma bazada saqlanadi, qayta yuboriladi, mijoz buni sezmaydi |
| 12 | Begona odam guruhdan tashqarida callback yuboradi | Rad etiladi |
| 13 | Admin panelda narx/surat o'zgartiriladi | 1 daqiqa ichida saytda yangilanadi |
| 14 | Lighthouse Mobile | 10.1-banddagi ko'rsatkichlar |

---

## 14. Bosqichlar va taxminiy muddatlar

| Bosqich | Ish | Muddat (taxminiy) |
|---|---|---|
| 0 | Materiallarni yig'ish, ochiq savollarni yopish (15-band) | 2–3 kun |
| 1 | Dizayn: Figma maketlar (mobil + desktop), kelishish | 5–7 kun |
| 2 | Frontend: landing, menyu, savatcha, checkout, UZ/RU | 7–10 kun |
| 3 | Backend: baza o'zgarishlari, `web-orders` API, Telegram xabari va statuslar, himoya | 4–6 kun |
| 4 | Admin panel (MVP) | 4–6 kun |
| 5 | SEO, analitika, domen, hosting, test (13-band), tuzatishlar | 3–4 kun |
| 6 | Ishga tushirish + 2 hafta kuzatuv va kafolatli tuzatishlar | — |
| | **Jami MVP** | **≈ 4–5 hafta** |

**2-bosqich** (MVP'dan keyin, alohida baholanadi): onlayn to'lov (Payme/Click), SMS xabarnomalar, xaritada manzil tanlash va
yetkazish narxini masofaga qarab hisoblash, promokodlar, hisobotlar va Excel eksport, POS integratsiyasi, taomlarning alohida SEO sahifalari.

---

## 15. Buyurtmachi uchun ochiq savollar

1. Yetkazib berish o'zingizdami (o'z kuryerlaringiz) yoki taksi/servis orqali? Olib ketish (pickup) ham kerakmi?
2. Yetkazib berish hududi va narxi qanday? Minimal buyurtma summasi bormi?
3. To'lov: faqat naqdmi yoki kuryerda karta terminali ham bormi? Onlayn to'lov qachon kerak?
4. Stol band qilish / banket so'rovlari saytda bo'lsinmi? Ular ham shu Telegram guruhga tushsinmi?
5. Menyuda porsiya tanlash yoki qo'shimchalar (modifikatorlar) bormi?
6. Filiallar nechta? Har birining alohida menyusi/guruhi kerakmi?
7. Ish vaqtidan tashqarida oldindan buyurtma qabul qilinsinmi?
8. Menejer 5 daqiqada javob bermasa eslatma kerakmi?
9. Domen bormi? Brendbuk (logotip, ranglar) bormi?
10. Kassa dasturi (iiko, R-Keeper, Poster, ...) ishlatiladimi?
11. Ingliz tili kerakmi?
12. Reklama (Instagram/Facebook Ads) uchun Meta Pixel o'rnatilsinmi?
