/** Backend API bilan bir xil tiplar / Типы, совпадающие с backend API */

export type Lang = 'uz' | 'ru';

export type Localized<T = string> = Record<Lang, T>;

export type Category = 'burgers' | 'pizza' | 'drinks' | 'premium';

export interface Product {
  id: number;
  slug: string;
  category: Category;
  name: Localized;
  description: Localized;
  ingredients: Localized<string[]>;
  price: number;
  oldPrice: number | null;
  image: string;
  isUpsell: boolean;
}

export type PaymentMethod = 'cash' | 'payme_click';
export type OrderStatus = 'new' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderLine {
  productId: number;
  nameUz: string;
  nameRu: string;
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
}

export interface AppConfig {
  currency: 'UZS';
  paymentMethods: PaymentMethod[];
  bump: { product: Product; price: number } | null;
}

export interface CreateOrderPayload {
  items: { productId: number; quantity: number }[];
  bump: boolean;
  paymentMethod: PaymentMethod;
  address: string;
  phone?: string;
  comment?: string;
}
