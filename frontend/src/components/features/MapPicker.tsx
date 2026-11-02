'use client';

/**
 * Xaritadan manzil tanlash — to'liq ekran.
 *  - Pin uchi aynan xarita markazida — saqlanadigan nuqta shu (oldin pin markazdan biroz siljigan edi)
 *  - Qidiruv: ko'cha, uy, mahalla yoki mo'ljal (Toshkent bo'yicha)
 *  - Xarita ochilganda joylashuv avtomatik aniqlanadi; taxminiy bo'lsa — aniqlik doirasi va maslahat
 *  - Telegram oynasi o'lchami o'zgarsa xarita qayta o'lchanadi (aks holda markaz noto'g'ri hisoblanardi)
 * Xarita: Yandex Maps (O'zbekistonda eng aniq manzillar); kalit ishlamasa — Leaflet + OpenStreetMap (lib/mapEngine.ts).
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { LocateFixed, Minus, Plus, Search, X } from 'lucide-react';
// Zaxira xarita (OpenStreetMap) uslublari
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

/** Pin: uchi SVG ning eng pastki nuqtasida — shuning uchun pastki chetini markazga qo'yamiz */
function Pin() {
  return (
    <svg width="40" height="52" viewBox="0 0 40 52" aria-hidden className="drop-shadow-[0_6px_8px_rgba(23,24,26,0.35)]">
      <path d="M20 52C20 52 40 31.5 40 20C40 8.95 31.05 0 20 0C8.95 0 0 8.95 0 20C0 31.5 20 52 20 52Z" fill="var(--brand)" />
      <circle cx="20" cy="20" r="7.5" fill="white" />
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

  // Xaritani yaratish: Yandex (kalit ishlasa) yoki OpenStreetMap
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
            setCenter(point);
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

  const zoom = (delta: number) => {
    haptic.select();
    mapRef.current?.zoomBy(delta);
  };

  const confirm = async () => {
    haptic.notify('success');
    // Manzil hali aniqlanayotgan bo'lsa — eski nuqtaning manzili saqlanib qolmasin
    const label = resolving ? await reverseGeocode(center, lang) : address;
    onPick({ point: center, address: label });
    closeMap();
  };

  const lowAccuracy = accuracy != null && accuracy > ACCURATE_ENOUGH_METERS;
  const roundButton =
    'flex size-12 items-center justify-center rounded-full bg-surface text-ink shadow-(--shadow-float) transition-transform active:scale-95 disabled:opacity-60';

  return (
    <div role="dialog" aria-modal="true" aria-label={t('location.title')} className="fixed inset-0 z-[65] mx-auto flex max-w-lg animate-fade-in flex-col bg-ground">
      <header className="flex items-center gap-2 px-3 pt-3 pb-2">
        <button
          type="button"
          onClick={closeMap}
          aria-label={t('common.close')}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-ink"
        >
          <X size={20} strokeWidth={2.25} />
        </button>
        <form onSubmit={search} role="search" className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full bg-surface pr-1 pl-4">
          <Search size={17} className="shrink-0 text-ink-2" />
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
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-2"
          />
          {query.trim().length >= 3 && (
            <button type="submit" className="h-9 shrink-0 rounded-full bg-ink px-3.5 text-[13px] font-semibold text-white" disabled={searching}>
              {searching ? <span className="block size-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : t('location.search')}
            </button>
          )}
        </form>
      </header>

      <div className="relative min-h-0 flex-1">
        <div ref={container} className="absolute inset-0 bg-tile" />

        {/* Qidiruv natijalari */}
        {results && (
          <div className="absolute inset-x-3 top-1 z-[600] max-h-[60%] overflow-y-auto rounded-[18px] bg-surface shadow-(--shadow-float)">
            {results.length === 0 ? (
              <p className="p-4 text-[14px] text-ink-2">{t('location.noResults')}</p>
            ) : (
              <ul className="divide-y divide-line">
                {results.map((result) => (
                  <li key={`${result.point.latitude},${result.point.longitude}`}>
                    <button type="button" onClick={() => chooseResult(result)} className="w-full px-4 py-3 text-left hover:bg-tile">
                      <span className="block text-[15px] font-medium">{result.title}</span>
                      {result.subtitle && <span className="mt-0.5 block text-[13px] text-ink-2">{result.subtitle}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Pin: pastki uchi aynan markazda; surilayotganda biroz ko'tariladi */}
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
            'pointer-events-none absolute top-1/2 left-1/2 z-[499] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/45 transition-all duration-200',
            moving ? 'h-1.5 w-3' : 'h-1 w-2',
          )}
        />

        <div className="absolute right-3 bottom-4 z-[500] flex flex-col gap-2">
          <button type="button" onClick={() => zoom(1)} aria-label={t('location.zoomIn')} className={roundButton}>
            <Plus size={20} strokeWidth={2.25} />
          </button>
          <button type="button" onClick={() => zoom(-1)} aria-label={t('location.zoomOut')} className={roundButton}>
            <Minus size={20} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={() => locate()}
            disabled={locating}
            aria-label={t('location.useMyLocation')}
            className={cn(roundButton, 'mt-2')}
          >
            {locating ? (
              <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <LocateFixed size={22} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      <div className="rounded-t-[24px] bg-surface px-4 pt-4 pb-safe">
        {lowAccuracy && (
          <p className="mb-3 rounded-[14px] bg-brand-soft px-3 py-2.5 text-[13px] leading-snug font-medium text-brand-ink">
            {t('location.lowAccuracy', { m: Math.round(accuracy!) })}
          </p>
        )}
        <p className="text-[13px] text-ink-2">{t('location.deliverHere')}</p>
        <p className="mt-0.5 min-h-[2.6em] text-[16px] leading-snug font-medium">
          {resolving || moving ? <span className="text-ink-2">{t('location.resolving')}</span> : (address ?? formatPoint(center))}
        </p>
        <Button size="lg" fullWidth className="mt-3 mb-2" disabled={moving || !ready} onClick={confirm}>
          {t('location.confirm')}
        </Button>
      </div>
    </div>
  );
}
