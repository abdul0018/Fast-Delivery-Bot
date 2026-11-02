/**
 * Xarita "dvigateli": bir xil interfeys — Yandex Maps (asosiy) yoki Leaflet + OpenStreetMap (zaxira).
 * MapPicker faqat shu interfeys bilan ishlaydi: markaz, uchish, masshtab, aniqlik doirasi, hodisalar.
 */
import { brand } from '@/config/brand';
import type { GeoPoint, Lang } from '@/types';
import { loadYandexMaps } from './yandexMaps';

export interface MapEngine {
  kind: 'yandex' | 'osm';
  getCenter(): GeoPoint;
  flyTo(point: GeoPoint, zoom: number): void;
  zoomBy(delta: number): void;
  /** Aniqlik doirasi (metr); null — olib tashlash */
  setCircle(point: GeoPoint | null, radius?: number): void;
  /** Konteyner o'lchami o'zgarganda */
  resize(): void;
  destroy(): void;
}

export interface MapHandlers {
  onMoveStart(): void;
  onMoveEnd(center: GeoPoint): void;
  /** Foydalanuvchi xaritani o'zi sura boshladi (dasturiy uchish emas) */
  onUserDrag(): void;
}

async function createYandex(element: HTMLElement, start: GeoPoint, zoom: number, handlers: MapHandlers, lang: Lang): Promise<MapEngine | null> {
  const ymaps = await loadYandexMaps(lang);
  if (!ymaps) return null;
  const map = new ymaps.Map(
    element,
    { center: [start.latitude, start.longitude], zoom, controls: [] },
    { suppressMapOpenBlock: true, yandexMapDisablePoiInteractivity: true, maxZoom: 19 },
  );
  let circle: unknown = null;
  const center = (): GeoPoint => {
    const [latitude, longitude] = map.getCenter();
    return { latitude, longitude };
  };
  map.events.add('actionbegin', handlers.onMoveStart);
  map.events.add('boundschange', () => handlers.onMoveEnd(center()));
  map.events.add(['mousedown', 'touchstart', 'multitouchstart', 'wheel'], handlers.onUserDrag);

  return {
    kind: 'yandex',
    getCenter: center,
    flyTo: (point, z) => {
      handlers.onMoveStart();
      void map.setCenter([point.latitude, point.longitude], z, { duration: 500 }).then(() => handlers.onMoveEnd(center()));
    },
    zoomBy: (delta) => void map.setZoom(map.getZoom() + delta, { duration: 200 }),
    setCircle: (point, radius) => {
      if (circle) map.geoObjects.remove(circle);
      circle = null;
      if (!point || !radius) return;
      circle = new ymaps.Circle([[point.latitude, point.longitude], radius], {}, {
        fillColor: `${brand.colors.brand}1F`,
        strokeColor: brand.colors.brand,
        strokeWidth: 1.5,
        interactivityModel: 'default#transparent',
      });
      map.geoObjects.add(circle);
    },
    resize: () => map.container.fitToViewport(),
    destroy: () => map.destroy(),
  };
}

const OSM_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

async function createLeaflet(element: HTMLElement, start: GeoPoint, zoom: number, handlers: MapHandlers): Promise<MapEngine> {
  const L = (await import('leaflet')).default;
  const map = L.map(element, { zoomControl: false, attributionControl: true }).setView([start.latitude, start.longitude], zoom);
  L.tileLayer(OSM_TILES, { maxZoom: 19, attribution: OSM_ATTRIBUTION }).addTo(map);
  map.attributionControl.setPrefix(false);
  const center = (): GeoPoint => {
    const c = map.getCenter();
    return { latitude: c.lat, longitude: c.lng };
  };
  map.on('movestart', handlers.onMoveStart);
  map.on('moveend', () => handlers.onMoveEnd(center()));
  map.on('dragstart', handlers.onUserDrag);
  let circle: ReturnType<typeof L.circle> | null = null;

  return {
    kind: 'osm',
    getCenter: center,
    flyTo: (point, z) => map.flyTo([point.latitude, point.longitude], z, { duration: 0.7 }),
    zoomBy: (delta) => map.setZoom(map.getZoom() + delta),
    setCircle: (point, radius) => {
      circle?.remove();
      circle = null;
      if (!point || !radius) return;
      circle = L.circle([point.latitude, point.longitude], {
        radius,
        color: brand.colors.brand,
        weight: 1.5,
        fillColor: brand.colors.brand,
        fillOpacity: 0.1,
        interactive: false,
      }).addTo(map);
    },
    resize: () => map.invalidateSize({ animate: false }),
    destroy: () => map.remove(),
  };
}

/** Yandex ishlasa — Yandex, aks holda OpenStreetMap */
export async function createMapEngine(element: HTMLElement, start: GeoPoint, zoom: number, handlers: MapHandlers, lang: Lang): Promise<MapEngine> {
  try {
    const yandex = await createYandex(element, start, zoom, handlers, lang);
    if (yandex) return yandex;
  } catch {
    element.innerHTML = '';
  }
  return createLeaflet(element, start, zoom, handlers);
}
