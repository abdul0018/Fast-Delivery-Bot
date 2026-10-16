'use client';

/** Profil: foydalanuvchi ma'lumotlari, til tanlash va buyurtmalar tarixi */
import { MapPin, Phone } from 'lucide-react';
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';
import { OrderHistory } from '@/components/features/OrderHistory';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { useUserStore } from '@/store/userStore';

export default function ProfilePage() {
  const { t } = useI18n();
  const { user } = useTelegram();
  const me = useUserStore((state) => state.me);

  const name =
    [user?.first_name ?? me?.firstName, user?.last_name ?? me?.lastName].filter(Boolean).join(' ') || t('profile.guest');
  const username = user?.username ?? me?.username;

  const rows = [
    { icon: Phone, label: t('profile.phone'), value: me?.phone },
    { icon: MapPin, label: t('profile.address'), value: me?.address },
  ];

  return (
    <div>
      <header className="flex flex-col items-center px-4 pt-6 pb-2 text-center">
        {user?.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photo_url} alt="" className="size-20 rounded-full object-cover ring-4 ring-soft" />
        ) : (
          <span className="flex size-20 items-center justify-center rounded-full bg-soft font-display text-[30px] font-bold text-brand-ink">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <h1 className="mt-3 text-[22px] leading-tight font-bold">{name}</h1>
        {username && <p className="text-sm font-medium text-ink-2">@{username}</p>}
      </header>

      <div className="space-y-6 px-4 pt-4">
        <section className="space-y-2.5">
          <h2 className="text-[17px] font-bold">{t('profile.language')}</h2>
          <LanguageSwitcher />
        </section>

        <section className="space-y-2.5">
          <h2 className="text-[17px] font-bold">{t('profile.contacts')}</h2>
          <dl className="divide-y divide-line rounded-[20px] bg-surface">
            {rows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                <Icon size={19} strokeWidth={2} className="shrink-0 text-brand-ink" />
                <dt className="shrink-0 font-medium text-ink-2">{label}</dt>
                <dd className={value ? 'min-w-0 flex-1 truncate text-right font-bold' : 'flex-1 text-right font-medium text-ink-2'}>
                  {value || t('profile.notSet')}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-[17px] font-bold">{t('profile.orders')}</h2>
          <OrderHistory />
        </section>
      </div>
    </div>
  );
}
