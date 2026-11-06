/** Backend API bilan bir xil tiplar / Типы, совпадающие с backend API */

export type Lang = 'uz' | 'ru';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export type Localized<T = string> = Record<Lang, T>;

/** Katalog bo'limi (brand.ts → categories) */
export type Category = string;

export interface Product {
  id: number;
  slug: string;
  category: Category;
  name: Localized;
  description: Localized;
  ingredients: Localized<string[]>;
  price: number;
  oldPrice: number | null;
  /** Narx nimaga: "1 кг", "100 г", "4 шт" */
  unit: Localized;
  image: string;
  isUpsell: boolean;
}

/** card — kartaga o'tkazma: mijoz chekni botga yuboradi, admin tasdiqlaydi */
export type PaymentMethod = 'cash' | 'card' | 'payme_click';
export type OrderStatus = 'new' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderLine {
  productId: number;
  nameUz: string;
  nameRu: string;
  unitUz?: string | null;
  unitRu?: string | null;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  items: OrderLine[];
  subtotal: number;
  bumpPrice: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  address: string;
  /** Kartaga o'tkazma: chek yuborilganmi (tekshirilmoqda) */
  hasReceipt?: boolean;
  createdAt: string;
}

export interface AppUser {
  id: number;
  telegramId: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  language: Lang | null;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface AppConfig {
  currency: 'UZS';
  paymentMethods: PaymentMethod[];
  bump: { product: Product; price: number } | null;
  /** Kartaga o'tkazma rekvizitlari (admin panelda saqlangan bo'lsa) */
  card?: { number: string; holder: string; bank: string } | null;
}

export interface CreateOrderPayload {
  items: { productId: number; quantity: number }[];
  bump: boolean;
  paymentMethod: PaymentMethod;
  address: string;
  /** Xaritadan / geolokatsiyadan tanlangan nuqta */
  location?: GeoPoint | null;
  phone?: string;
  comment?: string;
}
