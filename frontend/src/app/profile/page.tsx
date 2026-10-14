'use client';

/** Profil: foydalanuvchi ma'lumotlari, til tanlash va buyurtmalar tarixi */
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';
import { OrderHistory } from '@/components/features/OrderHistory';
import { PageHeader } from '@/components/layout/Header';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { useUserStore } from '@/store/userStore';

export default function ProfilePage() {
  const { t } = useI18n();
  const { user } = useTelegram();
  const me = useUserStore((state) => state.me);

  const name = [user?.first_name ?? me?.firstName, user?.last_name ?? me?.lastName].filter(Boolean).join(' ') || t('profile.guest');
  const username = user?.username ?? me?.username;

  return (
    <div>
      <PageHeader title={t('profile.title')} />

      <div className="space-y-6 px-4">
        <section className="flex items-center gap-4 rounded-3xl bg-surface p-4">
          {user?.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photo_url} alt="" className="size-16 rounded-full object-cover" />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-sale text-2xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold">{name}</h2>
            {username && <p className="text-sm text-hint">@{username}</p>}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="px-1 text-sm font-semibold text-hint uppercase">🌐 {t('profile.language')}</h3>
          <LanguageSwitcher />
        </section>

        <section className="space-y-2">
          <h3 className="px-1 text-sm font-semibold text-hint uppercase">{t('profile.contacts')}</h3>
          <div className="divide-y divide-line rounded-3xl bg-surface">
            <div className="flex items-center justify-between gap-4 p-4">
              <span className="text-hint">📱 {t('profile.phone')}</span>
              <span className="truncate font-medium">{me?.phone || t('profile.notSet')}</span>
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <span className="shrink-0 text-hint">📍 {t('profile.address')}</span>
              <span className="truncate text-right font-medium">{me?.address || t('profile.notSet')}</span>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="px-1 text-sm font-semibold text-hint uppercase">🧾 {t('profile.orders')}</h3>
          <OrderHistory />
        </section>
      </div>
    </div>
  );
}
