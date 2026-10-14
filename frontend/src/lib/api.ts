/**
 * Backend API klienti.
 * Har bir himoyalangan so'rovga Telegram initData "Authorization: tma <initData>" sarlavhasida yuboriladi —
 * backend uni bot tokeni bilan tekshiradi (auth.middleware.js).
 */
import type { AppConfig, AppUser, CreateOrderPayload, Lang, Order, Product } from '@/types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const DEV_AUTH = process.env.NEXT_PUBLIC_DEV_AUTH === 'true';

export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
  }
}

const getInitData = () => {
  if (typeof window === 'undefined') return '';
  return window.Telegram?.WebApp?.initData || (DEV_AUTH ? 'dev' : '');
};

/** Foydalanuvchi Telegram ichidami (yoki dev rejimdami) — buyurtma berish mumkinmi */
export const canAuthenticate = () => Boolean(getInitData());

async function request<T>(path: string, init: RequestInit = {}, auth = false): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('Content-Type', 'application/json');
  if (auth) {
    const initData = getInitData();
    if (!initData) throw new ApiError('UNAUTHORIZED', 401);
    headers.set('Authorization', `tma ${initData}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('NETWORK', 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.error || 'generic', response.status);
  return data as T;
}

export const api = {
  getConfig: () => request<AppConfig>('/config'),

  getProducts: () => request<{ products: Product[] }>('/products').then((res) => res.products),

  getMe: () => request<{ user: AppUser }>('/me', {}, true).then((res) => res.user),

  updateMe: (data: Partial<{ language: Lang; phone: string; address: string }>) =>
    request<{ user: AppUser }>('/me', { method: 'PATCH', body: JSON.stringify(data) }, true).then((res) => res.user),

  getOrders: () => request<{ orders: Order[] }>('/orders', {}, true).then((res) => res.orders),

  createOrder: (payload: CreateOrderPayload) =>
    request<{ order: Order; invoiceUrl: string | null }>(
      '/orders',
      { method: 'POST', body: JSON.stringify(payload) },
      true,
    ),
};
