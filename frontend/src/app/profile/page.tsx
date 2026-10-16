'use client';

/** Profil: foydalanuvchi ma'lumotlari, til tanlash va buyurtmalar tarixi */
import { ChevronRight, MapPin, Phone } from 'lucide-react';
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';
import { OrderHistory } from '@/components/features/OrderHistory';
import { Avatar, PageHeader } from '@/components/layout/Header';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { useUiStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';

export default function ProfilePage() {
  const { t } = useI18n();
  const { user } = useTelegram();
  const me = useUserStore((state) => state.me);
  const openContacts = useUiStore((state) => state.openContacts);

  const name =
    [user?.first_name ?? me?.firstName, user?.last_name ?? me?.lastName].filter(Boolean).join(' ') || t('profile.guest');
  const username = user?.username ?? me?.username;

  const rows = [
    { icon: Phone, label: t('profile.phone'), value: me?.phone },
    { icon: MapPin, label: t('profile.address'), value: me?.address },
  ];

  return (
    <div>
      <PageHeader title={t('profile.title')} />

      <div className="space-y-6 px-4">
        <section className="flex items-center gap-4 rounded-[20px] bg-surface p-4">
          <Avatar name={name} photo={user?.photo_url} size="lg" />
          <div className="min-w-0">
            <h2 className="truncate text-[20px] leading-tight font-semibold">{name}</h2>
            {username && <p className="mt-0.5 truncate text-[14px] text-ink-2">@{username}</p>}
          </div>
        </section>

        <section>
          <h2 className="mb-2.5 text-[17px] font-semibold">{t('profile.language')}</h2>
          <LanguageSwitcher />
        </section>

        <section>
          <h2 className="mb-2.5 text-[17px] font-semibold">{t('profile.contacts')}</h2>
          <ul className="divide-y divide-line overflow-hidden rounded-[20px] bg-surface">
            {rows.map(({ icon: Icon, label, value }) => (
              <li key={label}>
                <button type="button" onClick={openContacts} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-tile">
                    <Icon size={17} strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] text-ink-2">{label}</span>
                    <span className={value ? 'block truncate text-[15px]' : 'block text-[15px] text-ink-2'}>
                      {value || t('profile.notSet')}
                    </span>
                  </span>
                  <ChevronRight size={18} strokeWidth={2} className="shrink-0 text-ink-2" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2.5 text-[17px] font-semibold">{t('profile.orders')}</h2>
          <OrderHistory />
        </section>
      </div>
    </div>
  );
}
