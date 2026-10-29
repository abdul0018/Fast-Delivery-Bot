/*
 * Mushtariy Premium Restaurant — landing logikasi
 *
 * Buyurtma serversiz ishlaydi: savatcha va forma tayyor xabarga aylanadi va menejerning
 * Telegram chati shu xabar bilan ochiladi (https://t.me/<username>?text=...). Mijoz faqat «Yuborish»ni bosadi.
 *
 * ⚠️ RESTORAN MA'LUMOTLARI — ishga tushirishdan oldin haqiqiylari bilan almashtiring.
 */
const CONFIG = {
  managerTelegram: 'mushtariy_manager', // menejerning Telegram username'i, @ belgisisiz
  phone: '+998000000000', // tel: havolasi uchun
  phoneText: '+998 00 000 00 00', // sahifada ko'rinadigan ko'rinishi
  address: { uz: 'Manzil kiritiladi', ru: 'Адрес будет указан' },
  hours: '10:00 – 23:00',
};

/* Menyu — NAMUNA: nomlar, tavsiflar va narxlar restoran menyusi bilan almashtiriladi. */
const CATEGORIES = [
  { id: 'all', uz: 'Barchasi', ru: 'Все' },
  { id: 'milliy', uz: 'Milliy taomlar', ru: 'Национальные блюда' },
  { id: 'kabob', uz: 'Kabob va tandir', ru: 'Кабоб и тандыр' },
  { id: 'shirin', uz: 'Salat, shirinlik va choy', ru: 'Салаты, десерты и чай' },
];

const DISHES = [
  { id: 'osh', cat: 'milliy', price: 65000, img: 'osh',
    uz: ['Toshkent oshi', "Qo'y go'shti, sariq sabzi, no'xat, bedana tuxumi", '1 porsiya · 450 g'],
    ru: ['Ташкентский плов', 'Баранина, жёлтая морковь, нут, перепелиное яйцо', '1 порция · 450 г'] },
  { id: 'lagmon', cat: 'milliy', price: 48000, img: 'lagmon',
    uz: ["Lag'mon", "Qo'lda cho'zilgan xamir, mol go'shti, qalampir, sabzavotlar", '1 kosa · 500 g'],
    ru: ['Лагман', 'Тянутая вручную лапша, говядина, перец, овощи', '1 пиала · 500 г'] },
  { id: 'manti', cat: 'milliy', price: 42000, img: 'manti',
    uz: ['Manti', "Qo'y go'shti va piyoz, qaymoq bilan", '5 dona'],
    ru: ['Манты', 'Баранина и лук, со сметаной', '5 штук'] },
  { id: 'qozon', cat: 'kabob', price: 85000, img: 'qozon-kabob',
    uz: ['Qozon kabob', "Qovurilgan qo'y qovurg'asi, kartoshka, piyoz", '1 porsiya · 400 g'],
    ru: ['Казан-кабоб', 'Жареные бараньи рёбра, картофель, лук', '1 порция · 400 г'] },
  { id: 'tandir', cat: 'kabob', price: 95000, img: 'tandir',
    uz: ["Tandir go'sht", "Tandirda sekin pishgan qo'y go'shti", '1 porsiya · 350 g'],
    ru: ['Тандыр-гошт', 'Баранина томлёная в тандыре', '1 порция · 350 г'] },
  { id: 'shashlik', cat: 'kabob', price: 32000, img: 'shashlik',
    uz: ["Qo'y go'shtidan shashlik", 'Piyoz va ko\'katlar bilan', '1 six'],
    ru: ['Шашлык из баранины', 'С луком и зеленью', '1 шампур'] },
  { id: 'salat', cat: 'shirin', price: 22000, img: 'salat',
    uz: ['Achchiq-chuchuk', 'Pomidor, piyoz, rayhon', '1 porsiya'],
    ru: ['Аччик-чучук', 'Помидоры, лук, базилик', '1 порция'] },
  { id: 'chakchak', cat: 'shirin', price: 30000, img: 'desert',
    uz: ['Chak-chak va paxlava', 'Asal, yong\'oq, yalpiz', '1 porsiya'],
    ru: ['Чак-чак и пахлава', 'Мёд, орехи, мята', '1 порция'] },
  { id: 'choy', cat: 'shirin', price: 10000, img: 'choy',
    uz: ["Ko'k choy", 'Choynakda, quritilgan meva bilan', '1 choynak'],
    ru: ['Зелёный чай', 'В чайнике, с сухофруктами', '1 чайник'] },
];

const I18N = {
  ru: {
    skip: 'Перейти к меню',
    'nav.menu': 'Меню', 'nav.about': 'О нас', 'nav.how': 'Как заказать', 'nav.banquet': 'Банкет', 'nav.contact': 'Контакты',
    'cta.order': 'Заказать', 'cta.reserve': 'Забронировать стол', 'cta.call': 'Позвонить',
    'hero.l1': 'Национальный вкус.', 'hero.l2': 'Премиальный сервис.', 'hero.l3': 'Незабываемые моменты',
    'hero.lead': 'От ташкентского плова до тандыр-гошта — блюда наших поваров привезём к вам домой или подадим за столом в уютном зале.',
    'hero.pick': 'Сегодня на столе', 'hero.alt': 'Ташкентский плов на блюде с золотым ободком',
    'facts.hours': 'Время работы', 'facts.order': 'Заказ', 'facts.orderv': 'через Telegram', 'facts.phone': 'Телефон',
    'pr.1t': 'Свежие продукты каждый день', 'pr.1d': 'Мясо, овощи и специи выбираем каждое утро',
    'pr.2t': 'В казане и тандыре', 'pr.2d': 'Национальные блюда по-настоящему, без спешки',
    'pr.3t': 'Уютный зал', 'pr.3d': 'Для семейных вечеров, свадеб и дней рождения',
    'pr.4t': 'До вашей двери', 'pr.4d': 'Привезём горячим или заберите сами',
    'pain.h1': 'Ждать гостей — радость.', 'pain.h2': 'А не хлопоты',
    'pain.beforeT': 'Обычно бывает так',
    'pain.b1': 'С утра базар, потом часы у плиты', 'pain.b2': 'Гости уже пришли — а плов ещё не готов',
    'pain.b3': 'Вы не за столом, а на кухне', 'pain.b4': 'А ночью — гора посуды',
    'pain.afterT': 'С Mushtariy',
    'pain.a1': 'Выбираете из меню за пару минут', 'pain.a2': 'Менеджер перезванивает и всё подтверждает',
    'pain.a3': 'Блюда горячими и вовремя у вашей двери', 'pain.a4': 'А вы — с гостями, за столом',
    'pain.cta': 'Открыть меню',
    'story.s': 'Наша история', 'story.h': 'С нашей кухни — на ваш стол',
    'story.p1': 'Mushtariy — ресторан под золотой короной, которую вечером видно издалека. Здесь национальные блюда готовят по семейным рецептам, в казане и тандыре, без спешки.',
    'story.p2': 'В нашем зале проходят семейные вечера и большие торжества. А если вы дома — привезём те же блюда горячими к вашей двери.',
    'story.cta': 'Банкеты и мероприятия', 'story.alt': 'Здание Mushtariy Premium Restaurant вечером',
    'menu.s': 'Из меню', 'menu.h': 'Стол Mushtariy',
    'menu.note': 'Цены указаны за порцию. Стоимость доставки менеджер назовёт при подтверждении заказа.',
    'how.h': 'Заказ — напрямую менеджеру', 'how.s': 'через Telegram',
    'how.lead': 'Без регистрации и приложений. Наполняете корзину — заказ готовым сообщением уходит в Telegram нашего менеджера.',
    'how.1t': 'Выберите блюда', 'how.1d': 'Добавьте в корзину кнопкой «+»',
    'how.2t': 'Оставьте данные', 'how.2d': 'Имя, телефон, адрес и удобное время',
    'how.3t': 'Отправьте в Telegram', 'how.3d': 'Сообщение откроется готовым — нажмите «Отправить»',
    'how.4t': 'Менеджер подтвердит', 'how.4d': 'Перезвонит, уточнит детали и отправит заказ',
    'how.tgName': 'Менеджер Mushtariy', 'how.tgStatus': 'обычно отвечает быстро',
    'how.hint': 'Добавьте блюда в корзину — сообщение обновится здесь вживую.', 'how.cta': 'Оформить заказ',
    'proof.s': 'Наши гости', 'proof.h': 'Что говорят после ужина',
    'proof.note': 'Примеры отзывов — после запуска заменим настоящими отзывами гостей (Google, Яндекс, Instagram).',
    'proof.q1': 'Отмечали здесь день рождения всей семьёй. Плов и тандыр-гошт понравились всем, обслуживание очень внимательное.',
    'proof.r1': 'семейный вечер',
    'proof.q2': 'Заказали обед в офис на 12 человек. Менеджер сразу перезвонил, всё привезли горячим и вовремя.',
    'proof.r2': 'корпоративный заказ',
    'proof.q3': 'Заказывать через Telegram очень удобно: никаких приложений, выбрала в меню — и всё.',
    'proof.r3': 'доставка домой',
    'proof.insta': 'Зал, блюда и наши мероприятия — в Instagram',
    'bq.s': 'Для любого торжества', 'bq.h': 'Свадьба, день рождения, корпоратив',
    'bq.p': 'Зал, меню и оформление продумаем вместе с вами. Напишите дату и число гостей — менеджер перезвонит с предложениями.',
    'close.h': 'Сегодняшний ужин —', 'close.s': 'от Mushtariy',
    'close.g1t': 'Без предоплаты', 'close.g1d': 'Оплата при получении — наличными или картой.',
    'close.g2t': 'До подтверждения — никаких обязательств', 'close.g2d': 'Передумали — скажите менеджеру по телефону, отмена бесплатна.',
    'close.g3t': 'Всё письменно, в Telegram', 'close.g3d': 'Состав заказа и сумма остаются в переписке.',
    'close.cta': 'Выбрать из меню',
    'faq.h': 'Частые вопросы',
    'faq.q1': 'Как подтверждается заказ?', 'faq.a1': 'Ваше сообщение приходит менеджеру. Он перезванивает и уточняет состав, адрес и время. Только после этого блюда начинают готовить.',
    'faq.q2': 'А если нет Telegram?', 'faq.a2': 'Позвоните по номеру на странице — менеджер примет заказ по телефону.',
    'faq.q3': 'Сколько стоит доставка?', 'faq.a3': 'Цена и время зависят от адреса — менеджер точно скажет по телефону. Можно забрать заказ самостоятельно.',
    'faq.q4': 'Можно заказать к определённому времени?', 'faq.a4': 'Да. При оформлении выберите «К определённому времени» и укажите час.',
    'faq.q5': 'За сколько бронировать банкет?', 'faq.a5': 'Чем раньше, тем лучше: зал и меню согласуем заранее. Оставьте заявку через «Забронировать стол».',
    'ct.s': 'Ждём вас', 'ct.h': 'Давайте накроем стол вместе', 'ct.addr': 'Адрес', 'ct.map': 'Открыть на карте', 'ct.daily': ', ежедневно',
    'ft.tag': 'Национальный вкус, премиальный сервис и незабываемые моменты.',
    'ft.nav': 'Страница', 'ft.order': 'Заказ', 'ft.cart': 'Корзина', 'ft.social': 'Соцсети',
    'ft.note': 'Фото блюд и зала, цены и отзывы — примеры; будут заменены настоящими данными ресторана.',
    'bar.label': 'Корзина',
    'cart.title': 'Корзина', 'cart.empty': 'Корзина пока пуста. Выберите блюда в меню.', 'cart.total': 'Итого',
    'cart.feeNote': 'Доставка оплачивается отдельно — сумму скажет менеджер', 'cart.next': 'Оформить',
    'co.title': 'Оформление', 'co.type': 'Способ получения', 'co.delivery': 'Доставка', 'co.pickup': 'Самовывоз',
    'co.name': 'Ваше имя', 'co.phone': 'Телефон', 'co.address': 'Адрес', 'co.addressPh': 'Улица, дом, квартира',
    'co.landmark': 'Ориентир <span class="opt">(необязательно)</span>', 'co.landmarkPh': 'Например, рядом со школой',
    'co.when': 'Когда', 'co.asap': 'Как можно скорее', 'co.time': 'К определённому времени', 'co.timeL': 'Время',
    'co.pay': 'Оплата', 'co.cash': 'Наличные', 'co.card': 'Картой',
    'co.comment': 'Комментарий <span class="opt">(необязательно)</span>', 'co.commentPh': 'Например, не работает домофон',
    'co.send': 'Отправить в Telegram', 'co.back': '← Вернуться в корзину',
    'err.name': 'Напишите ваше имя', 'err.phone': 'Номер неполный: +998 и 9 цифр', 'err.address': 'Укажите адрес для доставки',
    'err.time': 'Выберите время', 'err.date': 'Выберите дату', 'err.guests': 'От 1 до 500',
    'sent.title': 'Заказ готов', 'sent.h': 'Telegram открыт', 'sent.p': 'Сообщение готово — нажмите «Отправить» в Telegram. Менеджер перезвонит и подтвердит заказ.',
    'sent.again': 'Открыть Telegram ещё раз', 'sent.copy': 'Скопировать сообщение', 'sent.call': 'Нет Telegram? Позвоните нам',
    'sent.new': 'Новый заказ', 'sent.copied': 'Сообщение скопировано',
    'rs.title': 'Бронирование стола', 'rs.lead': 'Заявка уйдёт менеджеру в Telegram. Он перезвонит и согласует зал и меню.',
    'rs.date': 'Дата', 'rs.guests': 'Количество гостей', 'rs.occasion': 'Повод',
    'rs.o1': 'Семейный ужин', 'rs.o2': 'День рождения', 'rs.o3': 'Свадьба / никах', 'rs.o4': 'Корпоратив', 'rs.o5': 'Другое',
    'rs.send': 'Отправить через Telegram',
    'toast.added': 'добавлено в корзину', 'add': 'Добавить в корзину', 'more': 'Ещё', 'less': 'Меньше',
    'sum': 'сум', 'tg.empty': 'Здесь появится ваш заказ: блюда, количество и итоговая сумма.',
  },
  uz: {
    'co.title': 'Rasmiylashtirish', 'co.send': "Telegram'da yuborish",
    'sent.title': 'Buyurtma tayyor', 'sent.copied': 'Xabar nusxalandi', 'toast.added': "savatchaga qo'shildi", add: "Savatchaga qo'shish",
    more: "Ko'paytirish", less: 'Kamaytirish', sum: "so'm",
    'tg.empty': "Bu yerda buyurtmangiz paydo bo'ladi: taomlar, soni va jami summa.",
    'ct.daily': ', har kuni',
  },
};

/* ------------------------------------------------------------------ holat */
const storage = {
  get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* xususiy rejim */ } },
};

const state = {
  lang: storage.get('mushtariy.lang', 'uz') === 'ru' ? 'ru' : 'uz',
  cart: storage.get('mushtariy.cart', {}),
  cat: 'all',
  step: 'cart',
};
const uzDefaults = new Map(); // HTML'dagi o'zbekcha matnlar (asl nusxa)

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const dishById = (id) => DISHES.find((d) => d.id === id);
const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) ?? I18N.uz[key] ?? uzDefaults.get(key) ?? key;
const money = (n, lang = state.lang) => `${n.toLocaleString('ru-RU').replace(/ /g, ' ')} ${lang === 'ru' ? 'сум' : "so'm"}`;
const dishText = (d, lang = state.lang) => d[lang];

/* ------------------------------------------------------------------ tarjima */
function applyLang() {
  document.documentElement.lang = state.lang;
  $$('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!uzDefaults.has(key)) uzDefaults.set(key, el.innerHTML);
    el.innerHTML = state.lang === 'uz' ? uzDefaults.get(key) : t(key);
  });
  $$('[data-i18n-ph]').forEach((el) => {
    const key = `ph:${el.dataset.i18nPh}`;
    if (!uzDefaults.has(key)) uzDefaults.set(key, el.placeholder);
    el.placeholder = state.lang === 'uz' ? uzDefaults.get(key) : t(el.dataset.i18nPh);
  });
  $$('[data-i18n-alt]').forEach((el) => {
    const key = `alt:${el.dataset.i18nAlt}`;
    if (!uzDefaults.has(key)) uzDefaults.set(key, el.alt);
    el.alt = state.lang === 'uz' ? uzDefaults.get(key) : t(el.dataset.i18nAlt);
  });
  $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
  $$('.js-address').forEach((el) => { el.textContent = CONFIG.address[state.lang]; });
  $$('.js-hours').forEach((el) => { el.textContent = CONFIG.hours + (el.dataset.i18nSuffix ? t(el.dataset.i18nSuffix) : ''); });
  renderTabs();
  renderMenu(false);
  renderHeroPick();
  renderCart();
  setStep(state.step);
}

/* ------------------------------------------------------------------ menyu */
function controlFor(id) {
  const qty = state.cart[id] || 0;
  const name = dishText(dishById(id))[0];
  if (!qty) {
    return `<button class="add-btn" type="button" data-add="${id}" aria-label="${t('add')}: ${name}"><svg aria-hidden="true"><use href="#i-plus"/></svg></button>`;
  }
  return `<div class="stepper" role="group" aria-label="${name}">
      <button type="button" data-dec="${id}" aria-label="${t('less')}"><svg aria-hidden="true"><use href="#i-minus"/></svg></button>
      <output aria-live="polite">${qty}</output>
      <button type="button" data-inc="${id}" aria-label="${t('more')}"><svg aria-hidden="true"><use href="#i-plus"/></svg></button>
    </div>`;
}

function renderTabs() {
  const box = $('[data-tabs]');
  box.innerHTML = CATEGORIES.map((c) =>
    `<button class="tab" type="button" role="tab" data-cat="${c.id}" aria-selected="${c.id === state.cat}">${c[state.lang]}</button>`).join('');
}

function renderMenu(animate = true) {
  const list = DISHES.filter((d) => state.cat === 'all' || d.cat === state.cat);
  $('[data-dish-grid]').innerHTML = list.map((d, i) => {
    const [name, desc, meta] = dishText(d);
    return `<article class="dish${animate ? ' enter' : ''}" style="${animate ? `animation-delay:${i * 40}ms` : ''}">
      <div class="dish-img"><img src="assets/img/${d.img}.jpg" width="900" height="900" loading="lazy" alt="${name}"></div>
      <div class="dish-body">
        <h3 class="dish-name">${name}</h3>
        <p class="dish-desc">${desc}</p>
        <span class="dish-meta">${meta}</span>
        <div class="dish-foot">
          <span class="price">${money(d.price)}</span>
          <span data-control="${d.id}">${controlFor(d.id)}</span>
        </div>
      </div>
    </article>`;
  }).join('');
}

function renderHeroPick() {
  const box = $('.hero-pick');
  const d = dishById(box.dataset.dish);
  $('[data-dish-name]', box).textContent = dishText(d)[0];
  $('[data-dish-price]', box).textContent = money(d.price);
  const ctl = box.querySelector('.add-btn, .stepper');
  const wrap = document.createElement('span');
  wrap.innerHTML = controlFor(d.id);
  ctl.replaceWith(wrap.firstElementChild);
}

function refreshControls(id) {
  $$(`[data-control="${id}"]`).forEach((el) => { el.innerHTML = controlFor(id); });
  renderHeroPick();
}

/* ------------------------------------------------------------------ savatcha */
const cartEntries = () => Object.entries(state.cart).filter(([id, q]) => q > 0 && dishById(id));
const cartCount = () => cartEntries().reduce((s, [, q]) => s + q, 0);
const cartTotal = () => cartEntries().reduce((s, [id, q]) => s + dishById(id).price * q, 0);

function changeQty(id, delta) {
  const next = Math.max(0, Math.min(50, (state.cart[id] || 0) + delta));
  if (next) state.cart[id] = next; else delete state.cart[id];
  storage.set('mushtariy.cart', state.cart);
  refreshControls(id);
  renderCart();
  if (delta > 0) {
    const btn = $('.cart-btn');
    btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
    if (next === 1) toast(`${dishText(dishById(id))[0]} ${t('toast.added')}`);
  }
}

function renderCart() {
  const entries = cartEntries();
  const count = cartCount();
  const total = cartTotal();
  $$('[data-cart-count]').forEach((el) => { el.textContent = count; el.hidden = !count && el.classList.contains('cart-count'); });
  $$('[data-cart-total]').forEach((el) => { el.textContent = money(total); });
  $('.cart-bar').hidden = !count;
  $('[data-cart-empty]').hidden = !!count;
  $('[data-cart-list]').innerHTML = entries.map(([id, q]) => {
    const d = dishById(id);
    const name = dishText(d)[0];
    return `<li class="cart-item">
      <img src="assets/img/${d.img}-160.jpg" width="64" height="64" alt="">
      <div class="cart-item-info"><b>${name}</b><span class="line-sum">${money(d.price)} × ${q}</span><span class="price">${money(d.price * q)}</span></div>
      <span data-control="${id}">${controlFor(id)}</span>
    </li>`;
  }).join('');
  const next = $('[data-next]');
  next.disabled = !count;
  renderPreview();
}

/* ------------------------------------------------------------------ Telegram xabari (menejer uchun, o'zbekcha) */
function orderMessage(form) {
  const lines = ['🆕 Yangi buyurtma · mushtariy sayti', ''];
  if (form) {
    lines.push(`👤 ${form.name}`, `📞 ${form.phone}`);
    if (form.type === 'pickup') lines.push('🛍 Olib ketish');
    else {
      lines.push('🚚 Yetkazib berish', `📍 ${form.address}`);
      if (form.landmark) lines.push(`🧭 Mo'ljal: ${form.landmark}`);
    }
    lines.push(form.when === 'time' ? `⏰ ${form.time} ga` : '⏱ Imkon qadar tez', '');
  }
  lines.push('🍽 Buyurtma:');
  cartEntries().forEach(([id, q]) => {
    const d = dishById(id);
    lines.push(`• ${d.uz[0]} × ${q} = ${money(d.price * q, 'uz')}`);
  });
  lines.push('', `💰 Jami: ${money(cartTotal(), 'uz')}`);
  if (form) {
    lines.push(`💵 To'lov: ${form.pay === 'card' ? 'karta orqali' : 'naqd'}`);
    if (form.comment) lines.push(`💬 Izoh: ${form.comment}`);
  }
  return lines.join('\n');
}

function renderPreview() {
  const bubble = $('[data-tg-preview]');
  const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const empty = !cartCount();
  bubble.classList.toggle('empty', empty);
  bubble.textContent = empty ? t('tg.empty') : orderMessage(null);
  const stamp = document.createElement('span');
  stamp.className = 'tg-time';
  stamp.textContent = `${time} ✓✓`;
  bubble.append(stamp);
}

const telegramUrl = (text) => `https://t.me/${CONFIG.managerTelegram}?text=${encodeURIComponent(text)}`;

/* ------------------------------------------------------------------ forma */
function normalizePhone(value) {
  let digits = String(value).replace(/\D/g, '');
  if (digits.length === 9) digits = `998${digits}`;
  if (digits.length !== 12 || !digits.startsWith('998')) return null;
  return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
}

function formatPhoneInput(input) {
  input.addEventListener('input', () => {
    let d = input.value.replace(/\D/g, '');
    if (d.startsWith('998')) d = d.slice(3);
    d = d.slice(0, 9);
    const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
    input.value = d.length ? `+998 ${parts.join(' ')}` : '';
  });
  input.addEventListener('focus', () => { if (!input.value) input.value = '+998 '; });
  input.addEventListener('blur', () => { if (input.value.trim() === '+998') input.value = ''; });
}

function setInvalid(input, bad) {
  input.closest('.field').classList.toggle('invalid', bad);
  input.setAttribute('aria-invalid', String(bad));
  return bad;
}

function readCheckout() {
  const f = $('.checkout[data-step="checkout"]');
  const data = Object.fromEntries(new FormData(f));
  Object.keys(data).forEach((k) => { data[k] = String(data[k]).trim(); });
  let firstBad = null;
  const check = (name, bad) => { const el = f.elements[name]; if (setInvalid(el, bad) && !firstBad) firstBad = el; };
  check('name', data.name.length < 2);
  const phone = normalizePhone(data.phone);
  check('phone', !phone);
  if (data.type === 'delivery') check('address', data.address.length < 5); else setInvalid(f.elements.address, false);
  if (data.when === 'time') check('time', !data.time); else setInvalid(f.elements.time, false);
  if (firstBad) { firstBad.focus(); return null; }
  storage.set('mushtariy.customer', { name: data.name, phone: data.phone, address: data.address, landmark: data.landmark });
  return { ...data, phone };
}

function syncCheckoutVisibility() {
  const f = $('.checkout[data-step="checkout"]');
  const delivery = f.elements.type.value === 'delivery';
  $$('[data-when="delivery"]', f).forEach((el) => { el.hidden = !delivery; });
  $('[data-when-time]', f).hidden = f.elements.when.value !== 'time';
}

/* ------------------------------------------------------------------ qadamlar */
function setStep(step) {
  state.step = step;
  $$('#cart [data-step]').forEach((el) => { el.hidden = el.dataset.step !== step; });
  $('[data-cart-title]').innerHTML = step === 'checkout' ? t('co.title') : step === 'sent' ? t('sent.title') : uzOr('cart.title');
  const foot = $('[data-foot]');
  foot.hidden = step === 'sent';
  $('[data-back]').hidden = step !== 'checkout';
  $('[data-next-label]').innerHTML = step === 'checkout' ? t('co.send') : uzOr('cart.next');
  const icon = $('[data-next] use');
  icon.setAttribute('href', step === 'checkout' ? '#i-telegram' : '#i-arrow');
}
const uzOr = (key) => (state.lang === 'uz' ? uzDefaults.get(key) ?? key : t(key));

let lastMessage = '';
function sendOrder() {
  const form = readCheckout();
  if (!form) return;
  lastMessage = orderMessage(form);
  const url = telegramUrl(lastMessage);
  window.open(url, '_blank', 'noopener');
  $('[data-sent-open]').href = url;
  setStep('sent');
}

/* ------------------------------------------------------------------ drawer */
let lastFocus = null;
function openDrawer(id) {
  const drawer = document.getElementById(id);
  const scrim = $('[data-scrim]');
  lastFocus = document.activeElement;
  $$('.drawer.open').forEach((d) => closeDrawer(d, true));
  scrim.hidden = false; drawer.hidden = false;
  requestAnimationFrame(() => { scrim.classList.add('open'); drawer.classList.add('open'); });
  document.body.classList.add('locked');
  if (id === 'cart' && state.step === 'sent' && !cartCount()) setStep('cart');
  setTimeout(() => (drawer.querySelector('input, button:not([data-close])') || drawer).focus({ preventScroll: true }), 60);
}
function closeDrawer(drawer = $('.drawer.open'), keepScrim = false) {
  if (!drawer) return;
  drawer.classList.remove('open');
  setTimeout(() => { drawer.hidden = true; }, 450);
  if (!keepScrim) {
    const scrim = $('[data-scrim]');
    scrim.classList.remove('open');
    setTimeout(() => { scrim.hidden = true; }, 400);
    document.body.classList.remove('locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
}

let toastTimer;
function toast(text) {
  const el = $('[data-toast]');
  el.textContent = text; el.hidden = false;
  el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
}

/* ------------------------------------------------------------------ hodisalar */
function bind() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-add],[data-inc],[data-dec],[data-open],[data-close],[data-cat],[data-lang],[data-scrim]');
    if (!el) return;
    if (el.dataset.add) changeQty(el.dataset.add, 1);
    else if (el.dataset.inc) changeQty(el.dataset.inc, 1);
    else if (el.dataset.dec) changeQty(el.dataset.dec, -1);
    else if (el.dataset.open) { e.preventDefault(); closeMobileNav(); openDrawer(el.dataset.open); }
    else if (el.hasAttribute('data-close') || el.hasAttribute('data-scrim')) closeDrawer();
    else if (el.dataset.cat) { state.cat = el.dataset.cat; renderTabs(); renderMenu(true); }
    else if (el.dataset.lang) { state.lang = el.dataset.lang; storage.set('mushtariy.lang', state.lang); applyLang(); }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab') {
      const drawer = $('.drawer.open');
      if (!drawer) return;
      const items = $$('a[href], button:not([disabled]), input, select, textarea', drawer).filter((x) => x.offsetParent);
      if (!items.length) return;
      const [first, last] = [items[0], items[items.length - 1]];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  $('[data-next]').addEventListener('click', () => {
    if (state.step === 'cart') { setStep('checkout'); $('#co-name').focus(); }
    else if (state.step === 'checkout') sendOrder();
  });
  $('[data-back]').addEventListener('click', () => setStep('cart'));
  $('[data-new-order]').addEventListener('click', () => {
    state.cart = {}; storage.set('mushtariy.cart', {});
    renderMenu(false); renderHeroPick(); renderCart(); setStep('cart'); closeDrawer();
  });
  $('[data-copy]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(lastMessage); toast(t('sent.copied')); } catch { /* ruxsat yo'q */ }
  });

  const checkout = $('.checkout[data-step="checkout"]');
  checkout.addEventListener('change', syncCheckoutVisibility);
  checkout.addEventListener('submit', (e) => { e.preventDefault(); sendOrder(); });
  checkout.addEventListener('input', (e) => { if (e.target.closest('.field.invalid')) setInvalid(e.target, false); });

  const reserve = $('[data-reserve-form]');
  reserve.addEventListener('input', (e) => { if (e.target.closest('.field.invalid')) setInvalid(e.target, false); });
  reserve.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(reserve));
    let firstBad = null;
    const check = (name, bad) => { const el = reserve.elements[name]; if (setInvalid(el, bad) && !firstBad) firstBad = el; };
    const phone = normalizePhone(data.phone);
    const guests = Number(data.guests);
    check('name', String(data.name).trim().length < 2);
    check('phone', !phone);
    check('date', !data.date);
    check('time', !data.time);
    check('guests', !(guests >= 1 && guests <= 500));
    if (firstBad) { firstBad.focus(); return; }
    const occasion = reserve.elements.occasion;
    const occasionUz = uzDefaults.get(occasion.selectedOptions[0].dataset.i18n) || occasion.value;
    const [y, m, d] = data.date.split('-');
    const text = [
      '📅 Stol band qilish so\'rovi · mushtariy sayti', '',
      `👤 ${String(data.name).trim()}`, `📞 ${phone}`,
      `🗓 ${d}.${m}.${y}, ${data.time}`, `👥 ${guests} kishi`, `🎉 ${occasionUz}`,
      data.comment ? `💬 ${String(data.comment).trim()}` : '',
    ].filter(Boolean).join('\n');
    window.open(telegramUrl(text), '_blank', 'noopener');
    closeDrawer();
  });

  [$('#co-phone'), $('#rs-phone')].forEach(formatPhoneInput);
  const today = new Date();
  $('#rs-date').min = today.toISOString().slice(0, 10);

  const saved = storage.get('mushtariy.customer', null);
  if (saved) Object.entries(saved).forEach(([k, v]) => { if (checkout.elements[k] && v) checkout.elements[k].value = v; });
  if (saved?.name) $('#rs-name').value = saved.name;
  if (saved?.phone) $('#rs-phone').value = saved.phone;

  const burger = $('.burger');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    $('#mobile-nav').hidden = !open;
  });
  $$('#mobile-nav a').forEach((a) => a.addEventListener('click', closeMobileNav));

  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function closeMobileNav() {
  $('.burger').setAttribute('aria-expanded', 'false');
  $('#mobile-nav').hidden = true;
}

function applyConfig() {
  $$('.js-phone-link').forEach((a) => { a.href = `tel:${CONFIG.phone}`; });
  $$('.js-phone-text').forEach((a) => { a.textContent = CONFIG.phoneText; });
  $$('.js-tg-link').forEach((a) => {
    a.href = `https://t.me/${CONFIG.managerTelegram}`;
    if (a.closest('.contact-list')) a.textContent = `@${CONFIG.managerTelegram}`;
  });
  $$('.js-year').forEach((el) => { el.textContent = new Date().getFullYear(); });
}

document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded', () => {
  // O'zbekcha asl matnlarni bir marta eslab qolamiz, keyin tanlangan tilni qo'llaymiz
  $$('[data-i18n]').forEach((el) => uzDefaults.set(el.dataset.i18n, el.innerHTML));
  applyConfig();
  bind();
  syncCheckoutVisibility();
  applyLang();
});
