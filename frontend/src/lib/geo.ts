/**
 * Joylashuv yordamchilari:
 *  - getCurrentLocation — Telegram LocationManager (Bot API 8.0+), bo'lmasa brauzer geolokatsiyasi
 *  - reverseGeocode     — nuqtadan ko'cha manzili (OpenStreetMap Nominatim, bepul, kalitsiz)
 */
import type { GeoPoint, Lang } from '@/types';

export type GeoError = 'denied' | 'unavailable';

/** Toshkent markazi — xarita standart holati */
export const DEFAULT_CENTER: GeoPoint = { latitude: 41.3111, longitude: 69.2797 };

function browserLocation(): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject('unavailable' satisfies GeoError);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      (error) => reject((error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable') satisfies GeoError),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  });
}

/** Bir bosishda joriy joylashuvni olish */
export function getCurrentLocation(): Promise<GeoPoint> {
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
        if (data) resolve({ latitude: data.latitude, longitude: data.longitude });
        else reject((manager.isAccessRequested && !manager.isAccessGranted ? 'denied' : 'unavailable') satisfies GeoError);
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

const cache = new Map<string, string | null>();

/** Nuqta → "Ko'cha, uy, mahalla, shahar". Topilmasa null. */
export async function reverseGeocode(point: GeoPoint, lang: Lang): Promise<string | null> {
  const key = `${point.latitude.toFixed(5)},${point.longitude.toFixed(5)},${lang}`;
  if (cache.has(key)) return cache.get(key) ?? null;

  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1` +
    `&lat=${point.latitude}&lon=${point.longitude}&accept-language=${lang === 'uz' ? 'uz,ru' : 'ru'}`;
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    const data = await response.json();
    const a = data.address ?? {};
    const street = [a.road ?? a.pedestrian ?? a.footway ?? a.neighbourhood, a.house_number].filter(Boolean).join(', ');
    const area = a.suburb ?? a.city_district ?? a.quarter ?? a.residential;
    const city = a.city ?? a.town ?? a.village;
    const label = [street, area, city].filter(Boolean).join(', ') || data.display_name || null;
    cache.set(key, label);
    return label;
  } catch {
    return null;
  }
}

/** Manzil topilmaganda nuqtaning o'zi */
export const formatPoint = (point: GeoPoint) => `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
