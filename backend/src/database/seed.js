/**
 * Boshlang'ich mahsulotlar: `npm run db:seed`
 * slug bo'yicha upsert qiladi — qayta ishga tushirish xavfsiz.
 */
const { sequelize, connectDatabase } = require('./connection');
const { syncDatabase } = require('./sync');
const { Product } = require('../models');
const logger = require('../utils/logger');

const img = (slug) => `/images/products/${slug}.svg`;

const products = [
  // ---------- Burgerlar / Бургеры ----------
  {
    slug: 'classic-burger',
    category: 'burgers',
    nameUz: 'Klassik burger',
    nameRu: 'Классический бургер',
    descriptionUz: "Sershira mol go'shti kotleti va yangi sabzavotlar bilan.",
    descriptionRu: 'Сочная говяжья котлета со свежими овощами.',
    ingredientsUz: ["Mol go'shti kotleti 150 g", 'Kunjutli bulochka', 'Pomidor, bodring, salat', 'Maxsus sous'],
    ingredientsRu: ['Говяжья котлета 150 г', 'Булочка с кунжутом', 'Томат, огурец, салат', 'Фирменный соус'],
    price: 32000,
    oldPrice: 38000,
    sortOrder: 1,
  },
  {
    slug: 'cheeseburger',
    category: 'burgers',
    nameUz: 'Chizburger',
    nameRu: 'Чизбургер',
    descriptionUz: "Ikki qavat cheddar pishlog'i bilan klassika.",
    descriptionRu: 'Классика с двойным слоем чеддера.',
    ingredientsUz: ["Mol go'shti kotleti 150 g", 'Cheddar pishlog\'i ×2', 'Tuzlangan bodring', 'Ketchup va gorchitsa'],
    ingredientsRu: ['Говяжья котлета 150 г', 'Сыр чеддер ×2', 'Маринованный огурец', 'Кетчуп и горчица'],
    price: 35000,
    oldPrice: 42000,
    sortOrder: 2,
  },
  {
    slug: 'double-burger',
    category: 'burgers',
    nameUz: 'Dabl burger',
    nameRu: 'Дабл бургер',
    descriptionUz: 'Juda och qolganlar uchun — ikki kotlet!',
    descriptionRu: 'Для самых голодных — две котлеты!',
    ingredientsUz: ["Ikki mol go'shti kotleti 300 g", 'Cheddar pishlog\'i', 'Karamellangan piyoz', 'BBQ sous'],
    ingredientsRu: ['Две говяжьи котлеты 300 г', 'Сыр чеддер', 'Карамелизированный лук', 'Соус BBQ'],
    price: 48000,
    oldPrice: 55000,
    sortOrder: 3,
  },
  {
    slug: 'chicken-burger',
    category: 'burgers',
    nameUz: 'Chiken burger',
    nameRu: 'Чикен бургер',
    descriptionUz: "Qarsildoq tovuq filesi va sarimsoqli sous.",
    descriptionRu: 'Хрустящее куриное филе и чесночный соус.',
    ingredientsUz: ['Qarsildoq tovuq filesi', 'Aysberg salati', 'Pomidor', 'Sarimsoqli sous'],
    ingredientsRu: ['Хрустящее куриное филе', 'Салат айсберг', 'Томат', 'Чесночный соус'],
    price: 30000,
    oldPrice: 36000,
    sortOrder: 4,
  },

  // ---------- Pitsalar / Пиццы ----------
  {
    slug: 'margherita',
    category: 'pizza',
    nameUz: 'Margarita',
    nameRu: 'Маргарита',
    descriptionUz: "Pomidor sousi, motsarella va rayhon. 30 sm.",
    descriptionRu: 'Томатный соус, моцарелла и базилик. 30 см.',
    ingredientsUz: ['Pomidor sousi', 'Motsarella', 'Yangi rayhon', "Zaytun moyi"],
    ingredientsRu: ['Томатный соус', 'Моцарелла', 'Свежий базилик', 'Оливковое масло'],
    price: 65000,
    oldPrice: 79000,
    sortOrder: 1,
  },
  {
    slug: 'pepperoni',
    category: 'pizza',
    nameUz: 'Pepperoni',
    nameRu: 'Пепперони',
    descriptionUz: "Achchiqroq mol go'shti pepperonisi bilan. 30 sm.",
    descriptionRu: 'С пикантной говяжьей пепперони. 30 см.',
    ingredientsUz: ['Pomidor sousi', 'Motsarella', "Mol go'shti pepperonisi", 'Oregano'],
    ingredientsRu: ['Томатный соус', 'Моцарелла', 'Говяжья пепперони', 'Орегано'],
    price: 75000,
    oldPrice: 89000,
    sortOrder: 2,
  },
  {
    slug: 'four-cheese',
    category: 'pizza',
    nameUz: "To'rt pishloq",
    nameRu: 'Четыре сыра',
    descriptionUz: "Pishloq ishqibozlari uchun. 30 sm.",
    descriptionRu: 'Для любителей сыра. 30 см.',
    ingredientsUz: ['Motsarella', 'Cheddar', 'Parmezan', "Ko'k pishloq"],
    ingredientsRu: ['Моцарелла', 'Чеддер', 'Пармезан', 'Голубой сыр'],
    price: 82000,
    oldPrice: 95000,
    sortOrder: 3,
  },

  // ---------- Ichimliklar / Напитки ----------
  {
    slug: 'coca-cola',
    category: 'drinks',
    nameUz: 'Coca-Cola 0.5 L',
    nameRu: 'Coca-Cola 0,5 л',
    descriptionUz: 'Muzdek klassik ichimlik.',
    descriptionRu: 'Ледяной классический напиток.',
    ingredientsUz: ['0.5 litr', 'Muzdek holda yetkaziladi'],
    ingredientsRu: ['0,5 литра', 'Доставляется охлаждённой'],
    price: 9000,
    oldPrice: 12000,
    isUpsell: true, // Order Bump taklifi
    sortOrder: 1,
  },
  {
    slug: 'fanta',
    category: 'drinks',
    nameUz: 'Fanta 0.5 L',
    nameRu: 'Fanta 0,5 л',
    descriptionUz: "Apelsin ta'mli gazli ichimlik.",
    descriptionRu: 'Газированный напиток со вкусом апельсина.',
    ingredientsUz: ['0.5 litr', 'Muzdek holda yetkaziladi'],
    ingredientsRu: ['0,5 литра', 'Доставляется охлаждённой'],
    price: 9000,
    oldPrice: null,
    sortOrder: 2,
  },
  {
    slug: 'lemonade',
    category: 'drinks',
    nameUz: 'Uy limonadi',
    nameRu: 'Домашний лимонад',
    descriptionUz: 'Yalpiz va limondan tayyorlangan.',
    descriptionRu: 'Из мяты и свежего лимона.',
    ingredientsUz: ['Yangi limon', 'Yalpiz', 'Muz', '0.4 litr'],
    ingredientsRu: ['Свежий лимон', 'Мята', 'Лёд', '0,4 литра'],
    price: 15000,
    oldPrice: 18000,
    sortOrder: 3,
  },

  // ---------- Premium ----------
  {
    slug: 'black-angus',
    category: 'premium',
    nameUz: 'Black Angus burger',
    nameRu: 'Бургер Black Angus',
    descriptionUz: "Mramorli Angus go'shti, trufel sousi va brioshli bulochka.",
    descriptionRu: 'Мраморная говядина Ангус, трюфельный соус и бриошь.',
    ingredientsUz: ["Angus mol go'shti 200 g", 'Brioshli bulochka', 'Trufel sousi', 'Raklet pishlog\'i'],
    ingredientsRu: ['Говядина Ангус 200 г', 'Булочка бриошь', 'Трюфельный соус', 'Сыр раклет'],
    price: 89000,
    oldPrice: 110000,
    sortOrder: 1,
  },
  {
    slug: 'family-combo',
    category: 'premium',
    nameUz: 'Oilaviy kombo',
    nameRu: 'Семейное комбо',
    descriptionUz: '4 kishilik: 2 burger, 1 pitsa, kartoshka fri va 4 ichimlik.',
    descriptionRu: 'На 4 персоны: 2 бургера, 1 пицца, картофель фри и 4 напитка.',
    ingredientsUz: ['2 × Klassik burger', '1 × Pepperoni', 'Kartoshka fri (katta)', '4 × Coca-Cola 0.5 L'],
    ingredientsRu: ['2 × Классический бургер', '1 × Пепперони', 'Картофель фри (большой)', '4 × Coca-Cola 0,5 л'],
    price: 159000,
    oldPrice: 199000,
    sortOrder: 2,
  },
];

async function seedProducts() {
  for (const product of products) {
    await Product.upsert({ ...product, image: img(product.slug), isActive: true });
  }
  logger.info(`✅ ${products.length} ta mahsulot qo'shildi/yangilandi`);
}

if (require.main === module) {
  connectDatabase()
    .then(() => syncDatabase())
    .then(() => seedProducts())
    .then(() => sequelize.close())
    .catch((error) => {
      logger.error('Seed xatoligi:', error);
      process.exit(1);
    });
}

module.exports = { seedProducts, products };
