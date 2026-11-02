/**
 * Xarita "dvigateli": bir xil interfeys —
 *  - asosiy: MapLibre + OpenFreeMap (zamonaviy vektor xarita, uy raqamlari, bepul, kalitsiz, limitsiz)
 *  - zaxira: Leaflet + OpenStreetMap (WebGL ishlamaydigan eski telefonlar uchun)
 * MapPicker faqat shu interfeys bilan ishlaydi: markaz, uchish, aniqlik doirasi, hodisalar.
 */
import { brand } from '@/config/brand';
import { asset } from '@/lib/utils';
import maplibrePackage from 'maplibre-gl/package.json';
import type { GeoPoint, Lang } from '@/types';

export interface MapEngine {
  kind: 'vector' | 'osm';
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

const VECTOR_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

/** Doira — 64 burchakli ko'pburchak (GeoJSON), metrda radius */
function circlePolygon(point: GeoPoint, radius: number) {
  const coordinates: [number, number][] = [];
  const latRadius = radius / 111320;
  const lngRadius = radius / (111320 * Math.cos((point.latitude * Math.PI) / 180));
  for (let index = 0; index <= 64; index += 1) {
    const angle = (index / 64) * 2 * Math.PI;
    coordinates.push([point.longitude + lngRadius * Math.cos(angle), point.latitude + latRadius * Math.sin(angle)]);
  }
  return { type: 'Feature' as const, properties: {}, geometry: { type: 'Polygon' as const, coordinates: [coordinates] } };
}

async function createVector(element: HTMLElement, start: GeoPoint, zoom: number, handlers: MapHandlers, lang: Lang): Promise<MapEngine> {
  const maplibregl = await import('maplibre-gl');
  // Worker fayli public/vendor/ da (scripts/copy-maplibre-worker.mjs) — bundler uni o'zi topa olmaydi
  maplibregl.setWorkerUrl(new URL(asset(`/vendor/maplibre-gl-worker-${maplibrePackage.version}.js`), window.location.href).href);
  const map = new maplibregl.Map({
    container: element,
    style: VECTOR_STYLE,
    center: [start.longitude, start.latitude],
    zoom,
    maxZoom: 19.5,
    attributionControl: { compact: true },
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
  });
  map.touchZoomRotate.disableRotation();

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), 15000);
    map.once('load', () => {
      clearTimeout(timer);
      resolve();
    });
    map.once('error', (event: unknown) => {
      clearTimeout(timer);
      reject((event as { error?: Error }).error ?? new Error('map error'));
    });
  }).catch((error) => {
    map.remove();
    throw error;
  });

  // Nomlar mijoz tilida: ruscha (yoki o'zbekcha), bo'lmasa — mahalliy nom. Uy raqamlariga tegmaymiz.
  const nameExpression: import('maplibre-gl').ExpressionSpecification = [
    'coalesce',
    ['get', `name:${lang}`],
    ['get', 'name:ru'],
    ['get', 'name'],
  ];
  for (const layer of map.getStyle().layers ?? []) {
    if (layer.type !== 'symbol') continue;
    const field = map.getLayoutProperty(layer.id, 'text-field');
    if (field && JSON.stringify(field).includes('name')) map.setLayoutProperty(layer.id, 'text-field', nameExpression);
  }

  map.addSource('accuracy', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addLayer({ id: 'accuracy-fill', type: 'fill', source: 'accuracy', paint: { 'fill-color': brand.colors.brand, 'fill-opacity': 0.1 } });
  map.addLayer({ id: 'accuracy-line', type: 'line', source: 'accuracy', paint: { 'line-color': brand.colors.brand, 'line-width': 1.5 } });

  const center = (): GeoPoint => {
    const c = map.getCenter();
    return { latitude: c.lat, longitude: c.lng };
  };
  // O'lcham o'zgarishi (map.resize) ham move hodisalarini chiqaradi — ularni "xarita surildi" deb hisoblamaymiz,
  // aks holda manzil qayta aniqlanadi → panel balandligi o'zgaradi → yana resize (cheksiz aylana)
  const fromResize = (event: object) => Boolean((event as { fromResize?: boolean }).fromResize);
  map.on('movestart', (event) => {
    if (!fromResize(event)) handlers.onMoveStart();
  });
  map.on('moveend', (event) => {
    if (!fromResize(event)) handlers.onMoveEnd(center());
  });
  map.on('dragstart', handlers.onUserDrag);

  return {
    kind: 'vector',
    getCenter: center,
    flyTo: (point, z) => map.flyTo({ center: [point.longitude, point.latitude], zoom: z, duration: 700 }),
    zoomBy: (delta) => map.zoomTo(map.getZoom() + delta, { duration: 200 }),
    setCircle: (point, radius) => {
      const source = map.getSource('accuracy') as { setData(data: unknown): void } | undefined;
      source?.setData({ type: 'FeatureCollection', features: point && radius ? [circlePolygon(point, radius)] : [] });
    },
    resize: () => map.resize({ fromResize: true }),
    destroy: () => map.remove(),
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
  let resizing = false;
  map.on('movestart', () => {
    if (!resizing) handlers.onMoveStart();
  });
  map.on('moveend', () => {
    if (!resizing) handlers.onMoveEnd(center());
  });
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
    resize: () => {
      resizing = true;
      map.invalidateSize({ animate: false });
      resizing = false;
    },
    destroy: () => map.remove(),
  };
}

/** Vektor xarita ishlasa — u, aks holda (WebGL yo'q, tarmoq xatosi) OpenStreetMap */
export async function createMapEngine(element: HTMLElement, start: GeoPoint, zoom: number, handlers: MapHandlers, lang: Lang): Promise<MapEngine> {
  try {
    return await createVector(element, start, zoom, handlers, lang);
  } catch (error) {
    console.warn('Vektor xarita ishlamadi, OpenStreetMap ishlatiladi:', error);
    element.innerHTML = '';
    return createLeaflet(element, start, zoom, handlers);
  }
}
