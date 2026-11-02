/**
 * Admin panel API klienti: parol bilan kirish -> token (localStorage) -> "Authorization: Bearer <token>".
 */
import type { Category, Localized, OrderLine, OrderStatus, PaymentMethod } from '@/types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const TOKEN_KEY = 'morefish-admin-token';

export interface AdminProduct {
  id: number;
  slug: string;
  category: Category;
  name: Localized;
  description: Localized;
  ingredients: Localized<string[]>;
  price: number;
  oldPrice: number | null;
  unit: Localized;
  image: string | null;
  isUpsell: boolean;
  isActive: boolean;
  sortOrder: number;
}

/** Saqlash uchun yuboriladigan maydonlar (backend: parseProduct) */
export interface ProductInput {
  category: Category;
  nameRu: string;
  nameUz: string;
  descriptionRu: string;
  descriptionUz: string;
  ingredientsRu: string[];
  ingredientsUz: string[];
  price: number | null;
  oldPrice: number | null;
  unitRu: string;
  unitUz: string;
  image: string | null;
  isActive: boolean;
  isUpsell: boolean;
  sortOrder: number;
}

export interface AdminOrder {
  id: number;
  items: OrderLine[];
  subtotal: number;
  bumpPrice: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  comment: string | null;
  createdAt: string;
  next: OrderStatus[];
  customer: { name: string | null; username: string | null; telegramId: string } | null;
}

export interface AdminStats {
  days: number;
  summary: {
    orders: number;
    cancelled: number;
    revenue: number;
    averageCheck: number;
    customers: number;
    previousOrders: number;
    previousRevenue: number;
    todayOrders: number;
    todayRevenue: number;
    pending: number;
    totalUsers: number;
    newUsers: number;
  };
  daily: { date: string; orders: number; revenue: number }[];
  statuses: Partial<Record<OrderStatus, number>>;
  topProducts: { productId: number; name: string; quantity: number; revenue: number }[];
}

export class AdminApiError extends Error {
  constructor(
    public code: string,
    public status: number,
    public field?: string,
  ) {
    super(code);
  }
}

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string | null) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* xususiy rejim — token faqat shu sahifa uchun */
    }
  },
};

/** Token eskirsa yoki parol almashtirilsa — kirish ekraniga qaytarish uchun */
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (typeof init.body === 'string') headers.set('Content-Type', 'application/json');
  const token = tokenStore.get();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/admin${path}`, { ...init, headers });
  } catch {
    throw new AdminApiError('NETWORK', 0);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && path !== '/login' && path !== '/telegram') onUnauthorized?.();
    throw new AdminApiError(data.error || 'generic', response.status, data.field);
  }
  return data as T;
}

const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) });

export const adminApi = {
  info: () => request<{ passwordEnabled: boolean; telegramEnabled: boolean; botUsername: string | null }>('/info'),
  /** Telegram ichida parolsiz kirish — Telegram imzolagan initData */
  telegramLogin: (initData: string) => request<{ token: string; name: string | null }>('/telegram', json('POST', { initData })),
  login: (password: string) => request<{ token: string }>('/login', json('POST', { password })),

  getProducts: () => request<{ products: AdminProduct[]; categories: string[] }>('/products'),
  createProduct: (input: Partial<ProductInput>) =>
    request<{ product: AdminProduct }>('/products', json('POST', input)).then((res) => res.product),
  updateProduct: (id: number, input: Partial<ProductInput>) =>
    request<{ product: AdminProduct }>(`/products/${id}`, json('PATCH', input)).then((res) => res.product),
  deleteProduct: (id: number) => request<{ ok: true }>(`/products/${id}`, { method: 'DELETE' }),

  uploadImage: (blob: Blob) =>
    request<{ path: string }>('/images', { method: 'POST', body: blob, headers: { 'Content-Type': blob.type } }).then(
      (res) => res.path,
    ),

  getOrders: (params: { status?: OrderStatus; offset?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.offset) query.set('offset', String(params.offset));
    query.set('limit', String(params.limit ?? 20));
    return request<{ orders: AdminOrder[]; total: number }>(`/orders?${query}`);
  },
  updateOrderStatus: (id: number, status: OrderStatus) =>
    request<{ order: AdminOrder }>(`/orders/${id}`, json('PATCH', { status })).then((res) => res.order),

  getStats: (days: number) => request<AdminStats>(`/stats?days=${days}`),
};

/** Xato kodlari — admin uchun tushunarli matn */
export function adminErrorText(error: unknown): string {
  const code = error instanceof AdminApiError ? error.code : 'generic';
  const messages: Record<string, string> = {
    WRONG_PASSWORD: 'Неверный пароль',
    TOO_MANY_ATTEMPTS: 'Слишком много попыток. Подождите 15 минут.',
    PASSWORD_DISABLED: 'Вход по паролю выключен — откройте панель через бота командой /admin.',
    NOT_ADMIN: 'Нет доступа: админ-панель открывается только у владельца магазина.',
    NO_ADMIN_CHAT: 'Владелец магазина не настроен на сервере.',
    INVALID_INIT_DATA: 'Telegram не подтвердил вход. Закройте панель и откройте снова через /admin.',
    NOT_FOUND: 'Сервер ещё не обновлён — сделайте Manual Deploy на Render.',
    NETWORK: 'Нет связи с сервером. Если он спал, подождите 30–50 секунд и повторите.',
    UNAUTHORIZED: 'Сессия истекла — войдите снова.',
    REQUIRED: 'Заполните обязательное поле',
    INVALID_PRICE: 'Цена должна быть целым числом в сумах',
    INVALID_CATEGORY: 'Выберите категорию',
    INVALID_IMAGE: 'Не удалось загрузить фото (JPEG, PNG или WebP, до 3 МБ)',
    TOO_LONG: 'Слишком длинный текст',
    INVALID_STATUS: 'Статус уже изменён — обновите список',
  };
  return messages[code] ?? 'Что-то пошло не так. Попробуйте ещё раз.';
}
