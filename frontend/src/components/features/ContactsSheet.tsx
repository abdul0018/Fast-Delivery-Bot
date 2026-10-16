'use client';

/** Yetkazish manzili va telefonni tahrirlash paneli (bosh sahifadagi manzil tugmasi va profildan ochiladi) */
import { useEffect, useState } from 'react';
import { MapPin, Phone } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { canAuthenticate } from '@/lib/api';
import { useUiStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';

export function ContactsSheet() {
  const open = useUiStore((state) => state.contactsOpen);
  const close = useUiStore((state) => state.closeContacts);
  const showToast = useUiStore((state) => state.showToast);
  const me = useUserStore((state) => state.me);
  const updateMe = useUserStore((state) => state.updateMe);
  const { t } = useI18n();
  const { haptic } = useTelegram();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAddress(me?.address ?? '');
    setPhone(me?.phone ?? '');
  }, [open, me]);

  const save = async () => {
    if (!canAuthenticate()) {
      haptic.notify('error');
      showToast(t('errors.UNAUTHORIZED'));
      return;
    }
    setSaving(true);
    await updateMe({ address: address.trim(), phone: phone.trim() });
    setSaving(false);
    haptic.notify('success');
    showToast(t('profile.saved'));
    close();
  };

  return (
    <BottomSheet
      open={open}
      onClose={close}
      ariaLabel={t('profile.contacts')}
      footer={
        <Button size="lg" fullWidth className="mb-1" loading={saving} onClick={save}>
          {t('profile.save')}
        </Button>
      }
    >
      <div className="space-y-3 px-5 pt-8 pb-6">
        <h2 className="mb-1 text-[22px] font-semibold">{t('profile.contacts')}</h2>
        <Textarea
          id="contacts-address"
          icon={<MapPin size={15} strokeWidth={2} />}
          label={t('cart.address')}
          placeholder={t('cart.addressPlaceholder')}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <Input
          id="contacts-phone"
          icon={<Phone size={15} strokeWidth={2} />}
          label={t('cart.phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t('cart.phonePlaceholder')}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>
    </BottomSheet>
  );
}
