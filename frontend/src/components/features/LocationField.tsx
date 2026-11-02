'use client';

/**
 * Yetkazish manzili: bir bosishda joriy joylashuv yoki xaritadan tanlash — qo'lda yozish shart emas.
 */
import { useState } from 'react';
import { LocateFixed, Map, MapPin } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { formatPoint, getCurrentLocation, openLocationSettings, reverseGeocode, type GeoError } from '@/lib/geo';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import type { GeoPoint } from '@/types';

export interface LocationValue {
  point: GeoPoint | null;
  address: string;
}

interface LocationFieldProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  error?: string;
  id?: string;
}

export function LocationField({ value, onChange, error, id }: LocationFieldProps) {
  const { t, lang } = useI18n();
  const { haptic } = useTelegram();
  const openMap = useUiStore((state) => state.openMap);
  const [locating, setLocating] = useState(false);
  const [denied, setDenied] = useState(false);
  const hasValue = Boolean(value.point || value.address);

  const useMyLocation = async () => {
    haptic.impact('light');
    setLocating(true);
    setDenied(false);
    try {
      const point = await getCurrentLocation();
      const address = await reverseGeocode(point, lang);
      onChange({ point, address: address ?? formatPoint(point) });
      haptic.notify('success');
    } catch (failure) {
      haptic.notify('warning');
      if ((failure as GeoError) === 'denied') setDenied(true);
      else useUiStore.getState().showToast(t('location.unavailable'));
    } finally {
      setLocating(false);
    }
  };

  const chooseOnMap = () => {
    haptic.impact('light');
    openMap({
      initial: value.point,
      onPick: ({ point, address }) => onChange({ point, address: address ?? formatPoint(point) }),
    });
  };

  return (
    <div id={id} tabIndex={-1} className="outline-none">
      <p className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-ink-2">
        <MapPin size={15} strokeWidth={2} />
        {t('cart.address')}
      </p>

      <div
        className={cn(
          'rounded-[14px] border bg-tile p-3 transition-colors',
          error ? 'border-sale bg-surface' : 'border-transparent',
        )}
      >
        <p className={cn('text-[15px] leading-snug', hasValue ? 'text-ink' : 'text-ink-2')}>
          {locating ? t('location.locating') : hasValue ? value.address : t('location.empty')}
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-brand px-2 text-[14px] font-semibold text-on-brand transition-transform duration-150 active:scale-[0.98] disabled:opacity-60"
          >
            {locating ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <LocateFixed size={17} strokeWidth={2} />
            )}
            <span className="truncate">{t('location.useMyLocation')}</span>
          </button>
          <button
            type="button"
            onClick={chooseOnMap}
            className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-surface px-2 text-[14px] font-semibold text-ink transition-transform duration-150 active:scale-[0.98]"
          >
            <Map size={17} strokeWidth={2} />
            <span className="truncate">{hasValue ? t('location.change') : t('location.chooseOnMap')}</span>
          </button>
        </div>
      </div>

      {denied && (
        <p className="mt-1.5 text-[13px] text-ink-2">
          {t('location.denied')}{' '}
          <button type="button" className="font-semibold text-brand-ink underline underline-offset-2" onClick={() => openLocationSettings() || chooseOnMap()}>
            {t('location.openSettings')}
          </button>
        </p>
      )}
      {error && (
        <p role="alert" className="mt-1.5 text-[13px] font-medium text-sale">
          {error}
        </p>
      )}
    </div>
  );
}
