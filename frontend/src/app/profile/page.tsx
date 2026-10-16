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
      <header className="px-4 pt-5">
        <div className="flex items-center gap-4 rounded-[30px] bg-brand-fill p-4 text-on-brand">
          {user?.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photo_url} alt="" className="size-16 rounded-full border-[3px] border-on-brand object-cover" />
          ) : (
            <span className="shout flex size-16 shrink-0 items-center justify-center rounded-full border-[3px] border-on-brand bg-accent text-[28px] text-on-accent">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="shout truncate text-[26px]">{name}</h1>
            {username && <p className="text-sm font-bold opacity-85">@{username}</p>}
          </div>
        </div>
      </header>

      <div className="space-y-7 px-4 pt-6">
        <section className="space-y-2.5">
          <h2 className="shout text-[20px]">{t('profile.language')}</h2>
          <LanguageSwitcher />
        </section>

        <section className="space-y-2.5">
          <h2 className="shout text-[20px]">{t('profile.contacts')}</h2>
          <dl className="divide-y-2 divide-outline rounded-[24px] border-2 border-outline bg-surface">
            {rows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                <Icon size={19} strokeWidth={2.25} className="shrink-0 text-brand-ink" />
                <dt className="shrink-0 font-bold text-ink-2">{label}</dt>
                <dd className={value ? 'min-w-0 flex-1 truncate text-right font-extrabold' : 'flex-1 text-right font-medium text-ink-2'}>
                  {value || t('profile.notSet')}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-2.5">
          <h2 className="shout text-[20px]">{t('profile.orders')}</h2>
          <OrderHistory />
        </section>
      </div>
    </div>
  );
}
