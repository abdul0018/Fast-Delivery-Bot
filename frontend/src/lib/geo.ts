/**
 * Joylashuv yordamchilari:
 *  - getCurrentLocation — Telegram LocationManager (Bot API 8.0+), bo'lmasa brauzer GPS (bir necha soniya
 *                         ichidagi eng aniq natija). Aniqlik (metr) ham qaytariladi — taxminiy bo'lsa xaritada tekshiramiz.
 *  - reverseGeocode     — nuqtadan manzil: ko'cha va uy, mahalla, tuman (OpenStreetMap Nominatim, bepul, kalitsiz)
 *  - searchAddress      — Toshkent bo'yicha manzil / joy qidirish (ko'cha, mahalla, mo'ljal)
 */
import type { GeoPoint, Lang } from '@/types';

export type GeoError = 'denied' | 'unavailable';

/** Nuqta + aniqlik (metr, noma'lum bo'lsa null) */
export interface GeoFix extends GeoPoint {
  accuracy: number | null;
}

/** Shu aniqlikdan yomon bo'lsa — nuqtani xaritada tasdiqlatamiz (Wi-Fi / IP bo'yicha taxmin) */
export const ACCURATE_ENOUGH_METERS = 80;

/** Toshkent markazi — xarita standart holati */
export const DEFAULT_CENTER: GeoPoint = { latitude: 41.3111, longitude: 69.2797 };

/** Toshkent va atrofi — qidiruv shu hudud bilan cheklanadi */
const TASHKENT_VIEWBOX = '69.05,41.50,69.55,41.15';

/**
 * Brauzer GPS: birinchi natija ko'pincha taxminiy bo'ladi, shuning uchun bir necha soniya kuzatib,
 * eng aniqini olamiz (25 m dan aniq bo'lsa darhol).
 */
function browserLocation(): Promise<GeoFix> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject('unavailable' satisfies GeoError);
      return;
    }
    let best: GeoFix | null = null;
    let settled = false;
    let watchId = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (settled) return;
      settled = true;
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
      if (best) resolve(best);
      else reject('unavailable' satisfies GeoError);
    };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const fix: GeoFix = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null,
        };
        if (!best || (fix.accuracy ?? Infinity) < (best.accuracy ?? Infinity)) best = fix;
        if ((fix.accuracy ?? Infinity) <= 25) finish();
        // Birinchi natijadan so'ng 4 soniya aniqroq natijani kutamiz
        else if (!timer) timer = setTimeout(finish, 4000);
      },
      (error) => {
        if (settled) return;
        if (best) return finish();
        settled = true;
        navigator.geolocation.clearWatch(watchId);
        clearTimeout(timer);
        reject((error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable') satisfies GeoError);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
    // Umuman javob bo'lmasa
    setTimeout(finish, 22000);
  });
}

/** Bir bosishda joriy joylashuvni olish */
export function getCurrentLocation(): Promise<GeoFix> {
  const webApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;
  const manager = webApp?.LocationManager;
  if (!webApp?.initData || !manager || !webApp.isVersionAtLeast('8.0')) return browserLocation();

  return new Promise((resolve, reject) => {
    const request = () => {
      if (!manager.isLocationAvailable) {
        browserLocation().then(resolve, reject);
        return;
      }
      manager.getLocation((data) => {
        if (data) {
          resolve({
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.horizontal_accuracy && data.horizontal_accuracy > 0 ? data.horizontal_accuracy : null,
          });
        } else {
          reject((manager.isAccessRequested && !manager.isAccessGranted ? 'denied' : 'unavailable') satisfies GeoError);
        }
      });
    };
    if (manager.isInited) request();
    else manager.init(request);
  });
}

/** Telegram'da joylashuv ruxsati o'chirilgan bo'lsa — sozlamalarni ochish (foydalanuvchi bosganda chaqiriladi) */
export function openLocationSettings(): boolean {
  const manager = typeof window !== 'undefined' ? window.Telegram?.WebApp?.LocationManager : undefined;
  if (!manager?.isInited) return false;
  manager.openSettings();
  return true;
}

// ------------------------------------------------------------------ Manzil (OpenStreetMap Nominatim)

interface NominatimAddress {
  road?: string;
  pedestrian?: string;
  footway?: string;
  house_number?: string;
  neighbourhood?: string;
  quarter?: string;
  residential?: string;
  suburb?: string;
  city_district?: string;
  district?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
}

const MAHALLA = /махал|mahal/i;
const DISTRICT = /район|tuman/i;

/**
 * Toshkentda OSM ma'lumotlari aralash: mahalla ba'zan "city", tuman — "district" sifatida keladi.
 * Shuning uchun maydonlarni nomiga qarab saralaymiz: ko'cha + uy → mahalla → tuman → shahar.
 */
function formatAddress(a: NominatimAddress, name: string | undefined, lang: Lang): string | null {
  const values = [a.neighbourhood, a.quarter, a.residential, a.suburb, a.city_district, a.district, a.city, a.town, a.village, a.county]
    .filter((value): value is string => Boolean(value));
  const unique = (list: (string | undefined)[]) => [...new Set(list.filter((value): value is string => Boolean(value)))];

  const road = a.road ?? a.pedestrian ?? a.footway;
  const street = road ? [road, a.house_number].filter(Boolean).join(', ') : null;
  const mahalla = values.find((value) => MAHALLA.test(value));
  const district = values.find((value) => DISTRICT.test(value)) ?? a.city_district ?? a.suburb;
  const city = values.find((value) => /ташкент|toshkent|tashkent/i.test(value)) ?? (lang === 'uz' ? 'Toshkent' : 'Ташкент');
  // Ko'cha nomi bo'lmasa — yaqindagi joy (bino, do'kon) nomi mo'ljal sifatida
  const landmark = !street && name ? (lang === 'uz' ? `${name} yonida` : `рядом с «${name}»`) : null;

  const parts = unique([street ?? landmark ?? undefined, mahalla, district, city]);
  return parts.length > 1 || street ? parts.join(', ') : null;
}

const reverseCache = new Map<string, string | null>();

/** Nuqta → "Ko'cha, uy, mahalla, tuman, shahar". Topilmasa null. */
export async function reverseGeocode(point: GeoPoint, lang: Lang): Promise<string | null> {
  const key = `${point.latitude.toFixed(5)},${point.longitude.toFixed(5)},${lang}`;
  if (reverseCache.has(key)) return reverseCache.get(key) ?? null;

  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&layer=address,poi` +
    `&lat=${point.latitude}&lon=${point.longitude}&accept-language=${lang === 'uz' ? 'uz,ru' : 'ru'}`;
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    const data = await response.json();
    const label = formatAddress(data.address ?? {}, data.name || undefined, lang);
    reverseCache.set(key, label);
    return label;
  } catch {
    return null;
  }
}

export interface AddressResult {
  point: GeoPoint;
  title: string;
  subtitle: string;
}

/** Manzil yoki joy nomi bo'yicha qidirish (Toshkent hududida). Nominatim qoidasi: faqat foydalanuvchi so'raganda. */
export async function searchAddress(query: string, lang: Lang): Promise<AddressResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&bounded=1` +
    `&viewbox=${TASHKENT_VIEWBOX}&q=${encodeURIComponent(q)}&accept-language=${lang === 'uz' ? 'uz,ru' : 'ru'}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('SEARCH_FAILED');
  const data: { lat: string; lon: string; name?: string; display_name: string; address?: NominatimAddress }[] = await response.json();
  const seen = new Set<string>();
  return data
    .map((item) => {
      const full = formatAddress(item.address ?? {}, undefined, lang);
      const title = item.name || full?.split(', ')[0] || item.display_name.split(', ')[0];
      const subtitle = (full ?? item.display_name)
        .split(', ')
        .filter((part) => part !== title)
        .join(', ');
      return { point: { latitude: Number(item.lat), longitude: Number(item.lon) }, title, subtitle };
    })
    // Bir joy bir necha OSM obyekti sifatida kelishi mumkin (bekat, bino) — takrorlarni olib tashlaymiz
    .filter((result) => {
      const key = `${result.title}|${result.subtitle}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/** Manzil topilmaganda nuqtaning o'zi */
export const formatPoint = (point: GeoPoint) => `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
