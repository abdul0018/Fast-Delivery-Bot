'use client';

/**
 * Xaritadan manzil tanlash — to'liq ekran. Xarita markazidagi pin — yetkazish nuqtasi:
 * foydalanuvchi xaritani suradi, manzil avtomatik aniqlanadi, "Shu yerga yetkazish" — tasdiqlash.
 * Xarita: Leaflet + OpenStreetMap plitkalari (bepul, kalitsiz; atributsiya majburiy).
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LocateFixed, MapPin, X } from 'lucide-react';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { DEFAULT_CENTER, formatPoint, getCurrentLocation, reverseGeocode, type GeoError } from '@/lib/geo';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import type { GeoPoint } from '@/types';

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export function MapPicker() {
  const request = useUiStore((state) => state.mapRequest);
  if (!request || typeof document === 'undefined') return null;
  return createPortal(<MapPickerView initial={request.initial} onPick={request.onPick} />, document.body);
}

function MapPickerView({ initial, onPick }: { initial: GeoPoint | null; onPick: (picked: { point: GeoPoint; address: string | null }) => void }) {
  const { t, lang } = useI18n();
  const { haptic } = useTelegram();
  const closeMap = useUiStore((state) => state.closeMap);
  const showToast = useUiStore((state) => state.showToast);
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [center, setCenter] = useState<GeoPoint>(initial ?? DEFAULT_CENTER);
  const [moving, setMoving] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [resolving, setResolving] = useState(true);
  const [locating, setLocating] = useState(false);

  // Xaritani yaratish (faqat brauzerda, Leaflet dinamik yuklanadi)
  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;
    void (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !container.current) return;
      const start = initial ?? DEFAULT_CENTER;
      map = L.map(container.current, { zoomControl: false, attributionControl: true }).setView(
        [start.latitude, start.longitude],
        initial ? 17 : 13,
      );
      L.tileLayer(TILES, { maxZoom: 19, attribution: ATTRIBUTION }).addTo(map);
      map.attributionControl.setPrefix(false);
      map.on('movestart', () => setMoving(true));
      map.on('moveend', () => {
        const c = map!.getCenter();
        setMoving(false);
        setCenter({ latitude: c.lat, longitude: c.lng });
      });
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
    };
  }, [initial]);

  // Orqa fondagi sahifa skroll bo'lmasin
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Markaz o'zgarganda manzilni aniqlash (biroz kutib — xarita surilayotganda so'rov yubormaymiz)
  useEffect(() => {
    if (moving) return;
    let cancelled = false;
    setResolving(true);
    const timer = setTimeout(async () => {
      const label = await reverseGeocode(center, lang);
      if (cancelled) return;
      setAddress(label);
      setResolving(false);
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [center, moving, lang]);

  const locate = async () => {
    haptic.impact('light');
    setLocating(true);
    try {
      const point = await getCurrentLocation();
      mapRef.current?.flyTo([point.latitude, point.longitude], 17, { duration: 0.8 });
    } catch (error) {
      showToast(t((error as GeoError) === 'denied' ? 'location.denied' : 'location.unavailable'));
    } finally {
      setLocating(false);
    }
  };

  const confirm = () => {
    haptic.notify('success');
    onPick({ point: center, address });
    closeMap();
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={t('location.title')} className="fixed inset-0 z-[65] mx-auto flex max-w-lg animate-fade-in flex-col bg-ground">
      <header className="flex items-center gap-3 px-4 pt-3 pb-3">
        <button
          type="button"
          onClick={closeMap}
          aria-label={t('common.close')}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink"
        >
          <X size={20} strokeWidth={2.25} />
        </button>
        <h2 className="text-[19px] font-semibold">{t('location.title')}</h2>
      </header>

      <div className="relative min-h-0 flex-1">
        <div ref={container} className="absolute inset-0 bg-tile" />

        {/* Markaziy pin — nuqta xarita markazida */}
        <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
          <div className={cn('flex flex-col items-center transition-transform duration-200 ease-out-expo', moving ? '-translate-y-6' : '-translate-y-4')}>
            <MapPin size={44} strokeWidth={1.75} className="fill-brand text-on-brand drop-shadow-[0_6px_8px_rgba(23,24,26,0.35)]" />
          </div>
        </div>
        <span className="pointer-events-none absolute top-1/2 left-1/2 z-[499] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/40" />

        <button
          type="button"
          onClick={locate}
          disabled={locating}
          aria-label={t('location.useMyLocation')}
          className="absolute right-4 bottom-4 z-[500] flex size-12 items-center justify-center rounded-full bg-surface text-ink shadow-(--shadow-float) disabled:opacity-60"
        >
          {locating ? (
            <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <LocateFixed size={22} strokeWidth={2} />
          )}
        </button>
      </div>

      <div className="rounded-t-[24px] bg-surface px-4 pt-4 pb-safe">
        <p className="text-[13px] text-ink-2">{t('location.deliverHere')}</p>
        <p className="mt-0.5 min-h-[2.6em] text-[16px] leading-snug font-medium">
          {resolving || moving ? <span className="text-ink-2">{t('location.resolving')}</span> : (address ?? formatPoint(center))}
        </p>
        <Button size="lg" fullWidth className="mt-3 mb-2" disabled={moving} onClick={confirm}>
          {t('location.confirm')}
        </Button>
      </div>
    </div>
  );
}
