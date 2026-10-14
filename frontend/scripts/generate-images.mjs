/**
 * public/images/products/*.svg — mahsulotlar uchun yengil placeholder rasmlar.
 * Haqiqiy fotosuratlar bilan almashtirish uchun shu nomdagi .jpg/.png/.webp faylni qo'ying
 * va backend'dagi products.image ustunini yangilang.
 *
 *   node scripts/generate-images.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '../public/images/products');
mkdirSync(outDir, { recursive: true });

// slug: [asosiy emoji, yordamchi emoji, gradient boshi, gradient oxiri]
const products = {
  'classic-burger': ['🍔', '🥬', '#ffb347', '#ff6b00'],
  cheeseburger: ['🍔', '🧀', '#ffd56b', '#ff9500'],
  'double-burger': ['🍔', '🔥', '#ff8a5b', '#d7263d'],
  'chicken-burger': ['🍔', '🍗', '#ffe29a', '#ffa94d'],
  margherita: ['🍕', '🌿', '#ffcf9f', '#e8590c'],
  pepperoni: ['🍕', '🌶️', '#ff9a8b', '#c92a2a'],
  'four-cheese': ['🍕', '🧀', '#fff3b0', '#f08c00'],
  'coca-cola': ['🥤', '🧊', '#ff8787', '#c92a2a'],
  fanta: ['🥤', '🍊', '#ffd8a8', '#fd7e14'],
  lemonade: ['🍋', '🌿', '#d8f5a2', '#40c057'],
  'black-angus': ['🍔', '👑', '#868e96', '#212529'],
  'family-combo': ['🍱', '🍟', '#e599f7', '#862e9c'],
};

const svg = ([main, extra, from, to]) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.45" r="0.5">
      <stop offset="0" stop-color="#fff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <circle cx="330" cy="70" r="90" fill="#fff" opacity="0.12"/>
  <circle cx="60" cy="350" r="70" fill="#fff" opacity="0.1"/>
  <circle cx="200" cy="190" r="150" fill="url(#glow)"/>
  <ellipse cx="200" cy="318" rx="110" ry="16" fill="#000" opacity="0.15"/>
  <text x="200" y="250" font-size="190" text-anchor="middle">${main}</text>
  <text x="318" y="330" font-size="70" text-anchor="middle">${extra}</text>
</svg>
`;

for (const [slug, spec] of Object.entries(products)) {
  writeFileSync(join(outDir, `${slug}.svg`), svg(spec));
}
console.log(`✅ ${Object.keys(products).length} ta rasm yaratildi: ${outDir}`);
