/**
 * Boshlang'ich mahsulotlar: `npm run db:seed`
 * slug bo'yicha upsert qiladi — qayta ishga tushirish xavfsiz.
 */
const { sequelize, connectDatabase } = require('./connection');
const { syncDatabase } = require('./sync');
const { Op } = require('sequelize');
const { Product } = require('../models');
const logger = require('../utils/logger');

const img = (slug) => `/images/products/${slug}.jpg`;

// MoreFish katalogi — narxlar do'kon narx yorliqlari va Telegram postlaridan olingan.
// unit — narx nimaga: "1 кг", "100 г", "4 шт". Narxi noma'lum mahsulot isActive: false (katalogda ko'rinmaydi).
const products = [
  // ---------- Dudlangan baliq / Копчёная рыба ----------
  {
    slug: 'tolstolobik-hot-smoked',
    category: 'smoked',
    nameUz: "Issiq dudlangan do'ngpeshona (tolstolobik)",
    nameRu: 'Толстолобик горячего копчения',
    descriptionUz: "Aksiya! 4 dona — 100 000 so'm.",
    descriptionRu: 'Акция! 4 штуки — 100 000 сум.',
    ingredientsUz: ['Issiq dudlangan', "To'plamda 4 dona"],
    ingredientsRu: ['Горячее копчение', 'В наборе 4 штуки'],
    price: 100000,
    unitUz: '4 dona',
    unitRu: '4 шт',
    isUpsell: true, // savatchadagi taklif (aksiya)
    sortOrder: 1,
  },
  {
    slug: 'sazan-large',
    category: 'smoked',
    nameUz: "Yirik zog'ora baliq (sazan)",
    nameRu: 'Сазан крупный',
    descriptionUz: 'Yirik sazan — 1 dona narxi.',
    descriptionRu: 'Крупный сазан — цена за 1 штуку.',
    ingredientsUz: [],
    ingredientsRu: [],
    price: 65000,
    unitUz: '1 dona',
    unitRu: '1 шт',
    sortOrder: 2,
  },
  {
    slug: 'dorado-cold-smoked',
    category: 'smoked',
    nameUz: 'Sovuq dudlangan dorado',
    nameRu: 'Дорадо холодного копчения',
    descriptionUz: "Sovuq dudlangan dorado, 1 kg narxi.",
    descriptionRu: 'Дорадо холодного копчения, цена за 1 кг.',
    ingredientsUz: ['Sovuq dudlangan'],
    ingredientsRu: ['Холодное копчение'],
    price: 350000,
    unitUz: '1 kg',
    unitRu: '1 кг',
    sortOrder: 3,
  },
  {
    slug: 'butterfish-cold-smoked',
    category: 'smoked',
    nameUz: 'Sovuq dudlangan moyli baliq',
    nameRu: 'Масляная рыба холодного копчения',
    descriptionUz: 'Sovuq dudlangan moyli baliq, vakuum qadoqda.',
    descriptionRu: 'Масляная рыба холодного копчения в вакуумной упаковке.',
    ingredientsUz: ['Sovuq dudlangan', 'Vakuum qadoq'],
    ingredientsRu: ['Холодное копчение', 'Вакуумная упаковка'],
    price: 275000,
    unitUz: '1 kg',
    unitRu: '1 кг',
    sortOrder: 4,
  },
  {
    slug: 'catfish-smoked',
    category: 'smoked',
    nameUz: 'Dudlangan laqqa baliq (som)',
    nameRu: 'Сом копчёный',
    descriptionUz: 'Dudlangan som filesi, vakuum qadoqda.',
    descriptionRu: 'Копчёный сом в вакуумной упаковке.',
    ingredientsUz: ['Dudlangan', 'Vakuum qadoq'],
    ingredientsRu: ['Копчёный', 'Вакуумная упаковка'],
    price: 560000,
    unitUz: '1 kg',
    unitRu: '1 кг',
    sortOrder: 5,
  },
  {
    slug: 'mackerel-cold-smoked',
    category: 'smoked',
    nameUz: 'Sovuq dudlangan skumbriya',
    nameRu: 'Скумбрия холодного копчения',
    descriptionUz: 'Sovuq dudlangan skumbriya.',
    descriptionRu: 'Скумбрия холодного копчения.',
    ingredientsUz: ['Sovuq dudlangan'],
    ingredientsRu: ['Холодное копчение'],
    price: 0, // narxi hali berilmagan — narx qo'yilgach isActive: true qiling
    unitUz: '1 kg',
    unitRu: '1 кг',
    isActive: false,
    sortOrder: 6,
  },

  // ---------- Losos / Лосось ----------
  {
    slug: 'salmon-yukola',
    category: 'salmon',
    nameUz: 'Losos yukola',
    nameRu: 'Лосось юкола',
    descriptionUz: "Losos Norvegiyadan muzlatilmagan holda keladi. Nozik tuzilish, to'yingan ta'm va dudlangan lososning ishtahaochar hidi.",
    descriptionRu: 'Лосось поступает к нам из Норвегии в незамороженном виде. Нежная текстура, насыщенный вкус и аппетитный аромат копчёного лосося.',
    ingredientsUz: ['Norvegiya lososi', 'Muzlatilmagan holda keladi', 'Dudlangan'],
    ingredientsRu: ['Норвежский лосось', 'Поступает незамороженным', 'Копчёный'],
    price: 350000,
    unitUz: '1 kg',
    unitRu: '1 кг',
    sortOrder: 1,
  },
  {
    slug: 'salmon-lightly-salted',
    category: 'salmon',
    nameUz: 'Yengil tuzlangan losos',
    nameRu: 'Лосось слабосолёный',
    descriptionUz: "Yengil tuzlangan losos filesi, vakuum qadoqda. Narx 100 g uchun.",
    descriptionRu: 'Филе слабосолёного лосося в вакуумной упаковке. Цена за 100 г.',
    ingredientsUz: ['Yengil tuzlangan', 'File', 'Vakuum qadoq'],
    ingredientsRu: ['Слабая соль', 'Филе', 'Вакуумная упаковка'],
    price: 65000,
    unitUz: '100 g',
    unitRu: '100 г',
    sortOrder: 2,
  },

  // ---------- Delikateslar / Деликатесы ----------
  {
    slug: 'chess-roll',
    category: 'delicacy',
    nameUz: 'Shaxmat rulet',
    nameRu: 'Шахматный рулет',
    descriptionUz: "4 xil baliqdan ta'sirli delikates. Istalgan miqdorda kesib beramiz!",
    descriptionRu: 'Эффектный деликатес из 4 видов рыбы. Нарежем любое количество по вашему желанию!',
    ingredientsUz: ['Tunets', 'Losos', 'Forel', 'Paltus'],
    ingredientsRu: ['Тунец', 'Лосось', 'Форель', 'Палтус'],
    price: 750000,
    unitUz: '1 kg',
    unitRu: '1 кг',
    sortOrder: 1,
  },
  {
    slug: 'tuna-cold-smoked',
    category: 'delicacy',
    nameUz: 'Sovuq dudlangan tunets',
    nameRu: 'Тунец холодного копчения',
    descriptionUz: 'Sovuq dudlangan tunets, vakuum qadoqda.',
    descriptionRu: 'Тунец холодного копчения в вакуумной упаковке.',
    ingredientsUz: ['Sovuq dudlangan', 'Vakuum qadoq'],
    ingredientsRu: ['Холодное копчение', 'Вакуумная упаковка'],
    price: 360000,
    unitUz: '1 kg',
    unitRu: '1 кг',
    sortOrder: 2,
  },

  // ---------- Ikra / Икра ----------
  {
    slug: 'trout-caviar',
    category: 'caviar',
    nameUz: 'Forel ikrasi',
    nameRu: 'Икра форели',
    descriptionUz: 'Forel ikrasi, 200 g idishda.',
    descriptionRu: 'Икра форели, банка 200 г.',
    ingredientsUz: ['Forel ikrasi', '200 g'],
    ingredientsRu: ['Икра форели', '200 г'],
    price: 190000,
    unitUz: '200 g',
    unitRu: '200 г',
    sortOrder: 1,
  },
];

async function seedProducts() {
  // Katalogda yo'q eski mahsulotlarni o'chirib qo'yamiz (buyurtmalar tarixi saqlanadi — u nusxada)
  await Product.update({ isActive: false }, { where: { slug: { [Op.notIn]: products.map((product) => product.slug) } } });
  for (const product of products) {
    await Product.upsert({ isUpsell: false, oldPrice: null, ...product, image: img(product.slug), isActive: product.isActive ?? true });
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
