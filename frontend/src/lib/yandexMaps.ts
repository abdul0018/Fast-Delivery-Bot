/**
 * Yandex Maps JS API 2.1: xarita va manzil aniqlash (geokoder) — O'zbekistonda eng aniq manzillar.
 * Kalit: brand.yandexMapsKey (NEXT_PUBLIC_YANDEX_MAPS_KEY bilan almashtirish mumkin).
 * Kalit ishlamasa (noto'g'ri, limit tugagan, tarmoq) — null qaytadi va ilova OpenStreetMap'ga o'tadi.
 */
import { brand } from '@/config/brand';
import type { GeoPoint, Lang } from '@/types';

/* Yandex API'ning bizga kerakli qismi (to'liq tiplar shart emas) */
interface YGeoObject {
  properties: { get(key: string): unknown };
  geometry: { getCoordinates(): [number, number] };
  getAddressLine(): string;
}
interface YGeocodeResult {
  geoObjects: { get(index: number): YGeoObject | null; each(callback: (object: YGeoObject) => void): void; getLength(): number };
}
export interface YMap {
  getCenter(): [number, number];
  getZoom(): number;
  setCenter(center: [number, number], zoom?: number, options?: { duration?: number }): Promise<void>;
  setZoom(zoom: number, options?: { duration?: number }): Promise<void>;
  events: { add(types: string | string[], callback: () => void): void };
  geoObjects: { add(object: unknown): void; remove(object: unknown): void };
  container: { fitToViewport(): void };
  destroy(): void;
}
export interface YMaps {
  ready(): Promise<void>;
  Map: new (element: HTMLElement, state: Record<string, unknown>, options?: Record<string, unknown>) => YMap;
  Circle: new (geometry: [[number, number], number], properties?: Record<string, unknown>, options?: Record<string, unknown>) => unknown;
  geocode(request: string | [number, number], options?: Record<string, unknown>): Promise<YGeocodeResult>;
}

declare global {
  interface Window {
    ymaps?: YMaps;
  }
}

const KEY = (process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY ?? brand.yandexMapsKey ?? '').trim();
/** Toshkent va atrofi: [[janubi-g'arb], [shimoli-sharq]] */
const TASHKENT_BOUNDS = [
  [41.15, 69.05],
  [41.5, 69.55],
];

let loading: Promise<YMaps | null> | null = null;
/** Kalit ishlamay qoldi (masalan, kunlik limit) — shu sessiyada boshqa urinmaymiz */
let broken = !KEY;

const withTimeout = <T,>(promise: Promise<T>, ms: number) =>
  Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

/** Skriptni bir marta yuklash va kalitni bitta geokod so'rovi bilan tekshirish */
export function loadYandexMaps(lang: Lang): Promise<YMaps | null> {
  if (broken) return Promise.resolve(null);
  if (loading) return loading;
  loading = (async () => {
    try {
      if (!window.ymaps) {
        await withTimeout(
          new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(KEY)}&lang=${lang === 'uz' ? 'uz_UZ' : 'ru_RU'}`;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('script'));
            document.head.appendChild(script);
          }),
          10000,
        );
      }
      const ymaps = window.ymaps;
      if (!ymaps) throw new Error('no ymaps');
      await withTimeout(ymaps.ready(), 10000);
      // Noto'g'ri kalitda skript yuklanadi, lekin geokod xato beradi — shuni tekshiramiz
      await withTimeout(ymaps.geocode([41.3111, 69.2797], { results: 1 }), 8000);
      return ymaps;
    } catch {
      broken = true;
      return null;
    }
  })();
  return loading;
}

const markBroken = () => {
  broken = true;
};

/** Yandex manzili: "улица Навои, 30, Шайхантахурский район, Ташкент" (mamlakat nomisiz) */
function formatYandex(object: YGeoObject): string {
  const name = String(object.properties.get('name') ?? '');
  const description = String(object.properties.get('description') ?? '');
  const parts = [name, ...description.split(', ')]
    .map((part) => part.trim())
    .filter((part) => part && !/^(Узбекистан|O'zbekiston|Oʻzbekiston|Uzbekistan)$/i.test(part));
  return [...new Set(parts)].join(', ') || object.getAddressLine();
}

export async function yandexReverse(point: GeoPoint, lang: Lang): Promise<string | null | undefined> {
  const ymaps = await loadYandexMaps(lang);
  if (!ymaps) return undefined; // undefined — Yandex ishlamayapti, boshqa manbaga o'tamiz
  try {
    const result = await withTimeout(ymaps.geocode([point.latitude, point.longitude], { results: 1, kind: 'house' }), 8000);
    let object = result.geoObjects.get(0);
    if (!object) {
      // Yaqinda uy topilmasa — ko'cha / mahalla
      const wider = await withTimeout(ymaps.geocode([point.latitude, point.longitude], { results: 1 }), 8000);
      object = wider.geoObjects.get(0);
    }
    return object ? formatYandex(object) : null;
  } catch {
    markBroken();
    return undefined;
  }
}

export interface YandexSearchResult {
  point: GeoPoint;
  title: string;
  subtitle: string;
}

export async function yandexSearch(query: string, lang: Lang): Promise<YandexSearchResult[] | undefined> {
  const ymaps = await loadYandexMaps(lang);
  if (!ymaps) return undefined;
  try {
    const result = await withTimeout(
      ymaps.geocode(query, { results: 6, boundedBy: TASHKENT_BOUNDS, strictBounds: true }),
      8000,
    );
    const items: YandexSearchResult[] = [];
    result.geoObjects.each((object) => {
      const [latitude, longitude] = object.geometry.getCoordinates();
      const full = formatYandex(object).split(', ');
      items.push({ point: { latitude, longitude }, title: full[0], subtitle: full.slice(1).join(', ') });
    });
    return items;
  } catch {
    markBroken();
    return undefined;
  }
}

export const isYandexConfigured = () => Boolean(KEY);
