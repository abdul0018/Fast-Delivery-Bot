'use client';

/**
 * Xaritadan manzil tanlash — to'liq ekran.
 *  - Pin uchi aynan xarita markazida — saqlanadigan nuqta shu (oldin pin markazdan biroz siljigan edi)
 *  - Qidiruv: ko'cha, uy, mahalla yoki mo'ljal (Toshkent bo'yicha)
 *  - Xarita ochilganda joylashuv avtomatik aniqlanadi; taxminiy bo'lsa — aniqlik doirasi va maslahat
 *  - Telegram oynasi o'lchami o'zgarsa xarita qayta o'lchanadi (aks holda markaz noto'g'ri hisoblanardi)
 * Xarita: MapLibre + OpenFreeMap vektor xaritasi (bepul, kalitsiz); WebGL bo'lmasa — Leaflet + OpenStreetMap (lib/mapEngine.ts).
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, MapPin, Navigation, Search } from 'lucide-react';
// Xarita uslublari: asosiy (MapLibre) va zaxira (Leaflet)
import 'maplibre-gl/dist/maplibre-gl.css';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import {
  ACCURATE_ENOUGH_METERS,
  DEFAULT_CENTER,
  formatPoint,
  getCurrentLocation,
  reverseGeocode,
  searchAddress,
  type AddressResult,
  type GeoError,
  type GeoFix,
} from '@/lib/geo';
import { createMapEngine, type MapEngine } from '@/lib/mapEngine';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import type { GeoPoint } from '@/types';

export function MapPicker() {
  const request = useUiStore((state) => state.mapRequest);
  if (!request || typeof document === 'undefined') return null;
  return createPortal(
    <MapPickerView initial={request.initial} initialAccuracy={request.accuracy ?? null} onPick={request.onPick} />,
    document.body,
  );
}

/** Pin: dumaloq bosh + ingichka igna; igna uchi SVG ning eng pastki nuqtasida — pastki chetini markazga qo'yamiz */
function Pin() {
  return (
    <svg width="46" height="70" viewBox="0 0 46 70" aria-hidden className="drop-shadow-[0_6px_8px_rgba(23,24,26,0.3)]">
      <rect x="21.5" y="38" width="3" height="32" rx="1.5" fill="var(--brand)" />
      <circle cx="23" cy="23" r="23" fill="var(--brand)" />
      <circle cx="23" cy="23" r="9" fill="none" stroke="white" strokeWidth="5" />
    </svg>
  );
}

function MapPickerView({
  initial,
  initialAccuracy,
  onPick,
}: {
  initial: GeoPoint | null;
  initialAccuracy: number | null;
  onPick: (picked: { point: GeoPoint; address: string | null }) => void;
}) {
  const { t, lang } = useI18n();
  const { haptic } = useTelegram();
  const closeMap = useUiStore((state) => state.closeMap);
  const showToast = useUiStore((state) => state.showToast);
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapEngine | null>(null);
  const [ready, setReady] = useState(false);
  const [center, setCenter] = useState<GeoPoint>(initial ?? DEFAULT_CENTER);
  const [moving, setMoving] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [resolving, setResolving] = useState(true);
  const [locating, setLocating] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(initialAccuracy);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AddressResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  /** Aniqlik doirasi: nuqta taxminiy bo'lsa foydalanuvchi qaysi hudud ichida ekanini ko'radi */
  const showAccuracy = useCallback((point: GeoPoint, meters: number | null) => {
    setAccuracy(meters);
    const lowAccuracy = meters != null && meters > ACCURATE_ENOUGH_METERS;
    mapRef.current?.setCircle(lowAccuracy ? point : null, lowAccuracy ? Math.min(meters, 3000) : undefined);
  }, []);

  const flyTo = useCallback((point: GeoPoint, meters: number | null = null) => {
    const map = mapRef.current;
    if (!map) return;
    // Taxminiy joylashuvda — butun aniqlik doirasi ko'rinadigan masshtab
    const zoom = meters && meters > ACCURATE_ENOUGH_METERS ? Math.max(14, 18 - Math.ceil(Math.log2(meters / 60))) : 18;
    map.flyTo(point, zoom);
  }, []);

  const locate = useCallback(
    async (silent = false) => {
      if (!silent) haptic.impact('light');
      setLocating(true);
      try {
        const fix: GeoFix = await getCurrentLocation();
        flyTo(fix, fix.accuracy);
        showAccuracy(fix, fix.accuracy);
      } catch (error) {
        if (!silent) showToast(t((error as GeoError) === 'denied' ? 'location.denied' : 'location.unavailable'));
      } finally {
        setLocating(false);
      }
    },
    [flyTo, haptic, showAccuracy, showToast, t],
  );

  // Xaritani yaratish: vektor xarita (MapLibre) yoki zaxira OpenStreetMap
  useEffect(() => {
    let cancelled = false;
    let engine: MapEngine | null = null;
    let observer: ResizeObserver | null = null;
    void (async () => {
      if (!container.current) return;
      const start = initial ?? DEFAULT_CENTER;
      const zoom = initial ? (initialAccuracy && initialAccuracy > ACCURATE_ENOUGH_METERS ? 16 : 18) : 12;
      engine = await createMapEngine(
        container.current,
        start,
        zoom,
        {
          onMoveStart: () => setMoving(true),
          onMoveEnd: (point) => {
            setMoving(false);
            // Markaz amalda o'zgarmagan bo'lsa (masalan, faqat masshtab) — manzilni qayta so'ramaymiz
            setCenter((current) =>
              Math.abs(current.latitude - point.latitude) < 1e-7 && Math.abs(current.longitude - point.longitude) < 1e-7 ? current : point,
            );
          },
          // Foydalanuvchi xaritani o'zi surdi — nuqtani aniqlashtirdi, maslahat endi kerak emas
          onUserDrag: () => setAccuracy(null),
        },
        lang,
      );
      if (cancelled) {
        engine.destroy();
        return;
      }
      // Telegram oynasi kengaysa / klaviatura ochilsa — xarita o'lchamini yangilaymiz, markaz joyida qoladi
      observer = new ResizeObserver(() => engine?.resize());
      observer.observe(container.current!);
      mapRef.current = engine;
      setCenter(engine.getCenter());
      setReady(true);
    })();
    return () => {
      cancelled = true;
      observer?.disconnect();
      engine?.destroy();
      mapRef.current = null;
    };
  }, [initial, initialAccuracy]); // eslint-disable-line react-hooks/exhaustive-deps

  // Xarita tayyor bo'lgach: oldingi nuqta taxminiy bo'lsa — doira; nuqta bo'lmasa — joylashuvni o'zimiz aniqlaymiz
  useEffect(() => {
    if (!ready) return;
    if (initial) showAccuracy(initial, initialAccuracy);
    else void locate(true);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // Orqa fondagi sahifa skroll bo'lmasin
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Markaz o'zgarganda manzilni aniqlash (xarita to'xtagach, biroz kutib)
  useEffect(() => {
    if (moving) return;
    let cancelled = false;
    setResolving(true);
    const timer = setTimeout(async () => {
      const label = await reverseGeocode(center, lang);
      if (cancelled) return;
      setAddress(label);
      setResolving(false);
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [center, moving, lang]);

  const search = async (event: FormEvent) => {
    event.preventDefault();
    if (query.trim().length < 3) return;
    (document.activeElement as HTMLElement | null)?.blur();
    setSearching(true);
    try {
      setResults(await searchAddress(query, lang));
    } catch {
      setResults(null);
      showToast(t('location.searchFailed'));
    } finally {
      setSearching(false);
    }
  };

  const chooseResult = (result: AddressResult) => {
    haptic.select();
    setResults(null);
    setQuery(result.title);
    showAccuracy(result.point, null);
    flyTo(result.point);
  };

  const confirm = async () => {
    haptic.notify('success');
    // Manzil hali aniqlanayotgan bo'lsa — eski nuqtaning manzili saqlanib qolmasin
    const label = resolving ? await reverseGeocode(center, lang) : address;
    onPick({ point: center, address: label });
    closeMap();
  };

  const lowAccuracy = accuracy != null && accuracy > ACCURATE_ENOUGH_METERS;
  const busy = resolving || moving || !ready;

  return (
    <div role="dialog" aria-modal="true" aria-label={t('location.newAddress')} className="fixed inset-0 z-[65] mx-auto flex max-w-lg animate-fade-in flex-col bg-ground">
      <header className="relative flex h-14 shrink-0 items-center justify-center px-14">
        <button
          type="button"
          onClick={closeMap}
          aria-label={t('common.back')}
          className="absolute left-2 flex size-11 items-center justify-center rounded-full text-ink hover:bg-tile"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <h2 className="truncate text-[19px] font-semibold">{t('location.newAddress')}</h2>
      </header>

      {/* Manzilni yozib qidirish */}
      <form onSubmit={search} role="search" className="shrink-0 px-4 pb-3">
        <div className="flex h-14 items-center gap-2 rounded-[18px] border border-line bg-surface pr-2 pl-4 focus-within:border-ink/60">
          <input
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (!event.target.value) setResults(null);
            }}
            placeholder={t('location.searchPlaceholder')}
            aria-label={t('location.searchPlaceholder')}
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-2"
          />
          {query.trim().length >= 3 && (
            <button
              type="submit"
              aria-label={t('location.search')}
              disabled={searching}
              className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-brand text-on-brand"
            >
              {searching ? (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Search size={18} strokeWidth={2.4} />
              )}
            </button>
          )}
        </div>
      </form>

      <div className="relative min-h-0 flex-1">
        {/* Inline uslub: xarita kutubxonalarining CSS'i (position: relative) konteynerni siljitib, markazni buzmasin */}
        <div ref={container} className="bg-tile" style={{ position: 'absolute', inset: 0 }} />

        {/* Qidiruv natijalari */}
        {results && (
          <div className="absolute inset-x-4 top-2 z-[600] max-h-[65%] overflow-y-auto rounded-[18px] bg-surface shadow-(--shadow-float)">
            {results.length === 0 ? (
              <p className="p-4 text-[14px] text-ink-2">{t('location.noResults')}</p>
            ) : (
              <ul className="divide-y divide-line">
                {results.map((result) => (
                  <li key={`${result.point.latitude},${result.point.longitude}`}>
                    <button type="button" onClick={() => chooseResult(result)} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-tile">
                      <MapPin size={18} className="mt-0.5 shrink-0 text-ink-2" />
                      <span className="min-w-0">
                        <span className="block text-[15px] font-medium">{result.title}</span>
                        {result.subtitle && <span className="mt-0.5 block text-[13px] text-ink-2">{result.subtitle}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Pin: ignasining uchi aynan xarita markazida; surilayotganda boshi ko'tariladi */}
        <div
          className={cn(
            'pointer-events-none absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 transition-transform duration-200 ease-out-expo',
            moving ? '-translate-y-[calc(100%+10px)]' : '-translate-y-full',
          )}
        >
          <Pin />
        </div>
        <span
          className={cn(
            'pointer-events-none absolute top-1/2 left-1/2 z-[499] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/40 transition-all duration-200',
            moving ? 'h-1.5 w-3.5' : 'h-1 w-2',
          )}
        />

        {/* Joriy joylashuv */}
        <div className="absolute inset-x-0 bottom-10 z-[500] flex justify-center px-6">
          <button
            type="button"
            onClick={() => locate()}
            disabled={locating}
            className="flex h-12 max-w-full items-center gap-2.5 rounded-full bg-surface px-6 text-[16px] font-semibold text-brand-ink shadow-(--shadow-float) transition-transform active:scale-[0.98]"
          >
            {locating ? (
              <span className="size-[18px] shrink-0 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            ) : (
              <Navigation size={18} strokeWidth={2.25} className="shrink-0 fill-brand text-brand" />
            )}
            <span className="truncate">{locating ? t('location.locatingShort') : t('location.useMyLocation')}</span>
          </button>
        </div>
      </div>

      <div className="shrink-0 bg-ground px-4 pt-4 pb-safe">
        {lowAccuracy && (
          <p className="mb-3 rounded-[14px] bg-brand-soft px-3 py-2.5 text-center text-[13px] leading-snug font-medium text-brand-ink">
            {t('location.lowAccuracy', { m: Math.round(accuracy!) })}
          </p>
        )}
        {/* Balandlik qat'iy — matn uzunligi o'zgarsa ham xarita o'lchami o'zgarmaydi */}
        <p className="line-clamp-2 h-[2.75em] text-center text-[17px] leading-snug font-semibold" aria-live="polite">
          {busy ? <span className="text-ink-2">{t('location.resolving')}</span> : (address ?? formatPoint(center))}
        </p>
        <Button size="lg" fullWidth className="mt-3 mb-2" disabled={busy} onClick={confirm}>
          {busy ? t('location.resolvingButton') : t('location.confirm')}
        </Button>
      </div>
    </div>
  );
}
