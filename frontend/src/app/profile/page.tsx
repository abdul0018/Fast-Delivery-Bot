'use client';

/** Profil: foydalanuvchi ma'lumotlari, til tanlash va buyurtmalar tarixi */
import { MapPin, Phone } from 'lucide-react';
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';
import { OrderHistory } from '@/components/features/OrderHistory';
import { AtlasBand } from '@/components/ui/AtlasBand';
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
      <header className="text-on-brand">
        <div className="silk-field flex items-center gap-4 px-4 pt-6 pb-4">
          {user?.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photo_url} alt="" className="size-16 rounded-full object-cover ring-2 ring-on-brand/40" />
          ) : (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-silk-3 font-display text-2xl font-bold text-[#17142a]">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-[24px] leading-tight font-bold">{name}</h1>
            {username && <p className="text-sm text-on-brand/75">@{username}</p>}
          </div>
        </div>
        <AtlasBand variant="edge" height={32} seed={11} />
      </header>

      <div className="space-y-7 px-4 pt-2">
        <section className="space-y-2.5">
          <h2 className="text-[17px] font-semibold">{t('profile.language')}</h2>
          <LanguageSwitcher />
        </section>

        <section className="space-y-2.5">
          <h2 className="text-[17px] font-semibold">{t('profile.contacts')}</h2>
          <dl className="divide-y divide-line rounded-[20px] bg-surface">
            {rows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                <Icon size={18} strokeWidth={1.75} className="shrink-0 text-brand-ink" />
                <dt className="shrink-0 text-ink-2">{label}</dt>
                <dd className={value ? 'min-w-0 flex-1 truncate text-right font-medium' : 'flex-1 text-right text-ink-2'}>
                  {value || t('profile.notSet')}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-[17px] font-semibold">{t('profile.orders')}</h2>
          <OrderHistory />
        </section>
      </div>
    </div>
  );
}
