'use client';

/**
 * Sozlamalar: kartaga o'tkazma uchun karta (raqam, egasi, bank).
 * Raqam saqlansa — Mini App'da "Karta orqali" to'lov usuli paydo bo'ladi; bo'sh qoldirilsa — yashiriladi.
 */
import { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { adminApi, adminErrorText, type ShopSettings } from '@/lib/adminApi';
import { ListSkeleton, useAdminToast } from './adminUi';

const formatCard = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

export function SettingsView() {
  const toast = useAdminToast();
  const [form, setForm] = useState<ShopSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    adminApi
      .getSettings()
      .then((settings) => setForm({ ...settings, cardNumber: formatCard(settings.cardNumber) }))
      .catch((err) => {
        toast(adminErrorText(err), 'error');
        setForm({ cardNumber: '', cardHolder: '', cardBank: '' });
      });
  }, [toast]);

  if (!form) return <ListSkeleton rows={2} height="h-40" />;

  const digits = form.cardNumber.replace(/\D/g, '');
  const enabled = digits.length === 16;

  const save = async () => {
    if (digits && digits.length !== 16) {
      setError('Номер карты — 16 цифр');
      return;
    }
    setSaving(true);
    try {
      const saved = await adminApi.saveSettings({ cardNumber: digits, cardHolder: form.cardHolder, cardBank: form.cardBank });
      setForm({ ...saved, cardNumber: formatCard(saved.cardNumber) });
      toast(digits ? 'Карта сохранена — оплата картой включена' : 'Оплата картой выключена');
    } catch (err) {
      toast(adminErrorText(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Настройки</h1>

      <section className="rounded-[20px] bg-surface p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-brand-soft text-brand-ink">
            <CreditCard size={20} />
          </span>
          <div>
            <h2 className="text-[17px] font-semibold">Оплата картой (перевод)</h2>
            <p className="mt-0.5 text-[13px] text-ink-2">
              Покупатель переводит сумму на эту карту и отправляет скриншот чека в бот. Чек придёт вам в Telegram — подтвердите или
              отклоните.
            </p>
          </div>
        </div>

        <p className={`mt-3 rounded-[12px] px-3 py-2 text-[13px] font-medium ${enabled ? 'bg-brand-soft text-brand-ink' : 'bg-tile text-ink-2'}`}>
          {enabled ? '✓ Включено — покупатели видят «Картой» в корзине' : 'Выключено — укажите номер карты, чтобы включить'}
        </p>

        <div className="mt-4 space-y-3">
          <Input
            id="card-number"
            label="Номер карты (Uzcard / Humo)"
            inputMode="numeric"
            autoComplete="off"
            placeholder="8600 0000 0000 0000"
            value={form.cardNumber}
            error={error}
            onChange={(event) => {
              setForm({ ...form, cardNumber: formatCard(event.target.value) });
              setError(undefined);
            }}
            className="price tracking-[0.04em]"
          />
          <Input
            id="card-holder"
            label="Получатель (как на карте)"
            placeholder="ABDULBOSIT S."
            value={form.cardHolder}
            maxLength={60}
            onChange={(event) => setForm({ ...form, cardHolder: event.target.value })}
          />
          <Input
            id="card-bank"
            label="Банк (необязательно)"
            placeholder="Kapitalbank"
            value={form.cardBank}
            maxLength={60}
            onChange={(event) => setForm({ ...form, cardBank: event.target.value })}
          />
        </div>

        <Button size="lg" fullWidth className="mt-4" loading={saving} onClick={save}>
          Сохранить
        </Button>
      </section>
    </div>
  );
}
