# Mushtariy Premium Restaurant — landing sahifa

Statik sayt (HTML + CSS + JS, kutubxonasiz). Istalgan hostingga shu papkani yuklash kifoya: GitHub Pages, Netlify, Vercel,
oddiy VPS/nginx. Lokal ko'rish:

```bash
cd landing && python3 -m http.server 8080   # http://localhost:8080
```

## Buyurtma qanday ishlaydi

Server kerak emas. Mijoz savatchani to'ldiradi, ism, telefon va manzilni yozadi, «Telegram'da yuborish»ni bosadi —
menejerning Telegram chati tayyor xabar bilan ochiladi (`https://t.me/<username>?text=...`), mijoz faqat «Yuborish»ni bosadi.
Stol band qilish ham shunday ishlaydi. Telegram bo'lmasa — sahifadagi telefon raqami.

Keyingi bosqich (TZ, 7-bo'lim): buyurtma bot orqali menejerga to'g'ridan-to'g'ri tushishi va status tugmalari — buning uchun
`backend/` ga `POST /api/web-orders` qo'shiladi.

## Ishga tushirishdan oldin almashtiriladi

`app.js` boshidagi `CONFIG`:

| Maydon | Hozir (namuna) | Nima yoziladi |
|---|---|---|
| `managerTelegram` | `mushtariy_manager` | Menejerning haqiqiy Telegram username'i (@ belgisisiz) |
| `phone`, `phoneText` | `+998 00 000 00 00` | Restoran telefoni |
| `address` | «Manzil kiritiladi» | Manzil (UZ va RU) |
| `hours` | `10:00 – 23:00` | Haqiqiy ish vaqti |

Shuningdek:
- **Menyu** (`DISHES` / `CATEGORIES` — `app.js`): taomlar, tavsiflar va narxlar namuna.
- **Sharhlar** (`index.html`, «Mehmonlarimiz» bo'limi): namuna, haqiqiy sharhlar bilan almashtiriladi.
- **Va'dalar** (afzalliklar qatori, «Shinam zal», banket bo'limi): restoran bajara oladiganini qoldiring.
- **Xarita havolasi** (`index.html`, `.map-card`): restoranning Google/Yandex xaritadagi aniq havolasi.

## Rasmlar va ularning manbasi

| Fayl | Manba |
|---|---|
| `assets/img/logo-badge*.png` | Restoranning Instagram profilidagi logotip (skrinshotdan kesilgan). Asl vektor fayl bilan almashtirish tavsiya etiladi |
| `assets/img/facade.jpg` | Restoran binosi — Instagram'dagi videodan kadr (odamlar kesib tashlangan) |
| `assets/img/og.jpg` | Ulashish rasmi: logotip + `hero-osh.jpg` |
| `osh`, `hero-osh`, `lagmon`, `manti`, `tandir`, `qozon-kabob`, `shashlik`, `salat`, `desert`, `choy`, `zal` | **AI-generatsiya namuna** (Pollinations.ai, flux). Restoranning haqiqiy fotosuratlari bilan **shu nomlarda** almashtiriladi: taomlar 900×900 (+ 160×160 `*-160.jpg`), `hero-osh` 1200×1200, `zal` 1600 kenglik |

AI rasmlar uchun umumiy prompt: `<taom tavsifi>, professional food photography, premium Uzbek restaurant, dark charcoal
stone table, warm low key lighting, gold rimmed dark ceramic plate, shallow depth of field, 50mm, editorial, appetizing,
no text, no watermark`. Taom tavsiflari: osh — "Uzbek plov osh portion on plate, golden rice, carrots, lamb pieces, quail egg";
lagmon — "Uzbek lagman soup, hand pulled noodles in rich broth with beef, peppers and vegetables in a deep bowl";
manti — "Uzbek manti steamed dumplings on a plate with sour cream and black pepper"; tandir — "Uzbek tandir gosht, slow
roasted lamb leg from clay oven, crispy skin, with greens"; qozon-kabob — "Uzbek kazan kabob: golden fried lamb ribs pieces
with crispy fried potato wedges and raw red onion rings and fresh dill on a black plate"; shashlik — "Uzbek lamb shashlik
kebab skewers on a plate with sliced raw onions and herbs, flatbread"; salat — "Uzbek achichuk salad, thin sliced tomatoes
and onions with fresh basil in a bowl"; desert — "Uzbek chak chak honey dessert and baklava pieces on a plate with mint";
choy — "Uzbek green tea in traditional blue and white piyola cup with teapot, dried apricots and nuts"; zal — "elegant luxury
banquet hall interior of a premium Uzbek restaurant at evening, round tables with white tablecloths, crystal chandeliers,
warm golden light, black and gold decor, no people".

## Tuzilma

```
landing/
├── index.html     # bo'limlar: hero, afzalliklar, muammo→yechim, hikoya, menyu, Telegram orqali buyurtma,
│                  # sharhlar, banket, kafolatlar + FAQ, aloqa, footer; savatcha va stol band qilish oynalari
├── styles.css     # dizayn tokenlari (:root) va barcha stillar
├── app.js         # CONFIG, menyu, UZ/RU tarjimalar, savatcha, forma, Telegram xabari
└── assets/img/
```

Tillar: o'zbekcha (asosiy, HTML ichida) va ruscha (`app.js` → `I18N.ru`). Tanlangan til va savatcha brauzerda eslab qolinadi.
