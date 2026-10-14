'use client';

/**
 * Savatcha: Order Stack, Order Bump, yetkazib berish ma'lumotlari, to'lov usuli va jami summa.
 * "Tasdiqlash" tugmasi bitta bosishda buyurtma yaratadi (onlayn to'lovda — Telegram invoice ochiladi).
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartList } from '@/components/features/CartList';
import { OrderBump } from '@/components/features/OrderBump';
import { OrderSuccess } from '@/components/features/OrderSuccess';
import { PaymentMethods } from '@/components/features/PaymentMethods';
import { PageHeader } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useCart } from '@/hooks/useCart';
import { useCatalog } from '@/hooks/useCatalog';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { api, ApiError, canAuthenticate } from '@/lib/api';
import type { TranslationKey } from '@/lib/i18n';
import { useUiStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';
import type { Order } from '@/types';

const MIN_ADDRESS_LENGTH = 5;

export default function CartPage() {
  const router = useRouter();
  const { t, price } = useI18n();
  const { webApp, haptic } = useTelegram();
  const { config } = useCatalog();
  const cart = useCart();
  const me = useUserStore((state) => state.me);
  const showToast = useUiStore((state) => state.showToast);

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [addressError, setAddressError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Oldingi buyurtmadagi manzil va telefonni avtomatik to'ldirish
  useEffect(() => {
    if (!me) return;
    setAddress((current) => current || me.address || '');
    setPhone((current) => current || me.phone || '');
  }, [me]);

  // Tanlangan to'lov usuli o'chirilgan bo'lsa — naqd pulga qaytamiz
  const available = config?.paymentMethods ?? ['cash'];
  useEffect(() => {
    if (config && !config.paymentMethods.includes(cart.paymentMethod)) cart.setPaymentMethod('cash');
  }, [config, cart]);

  const errorText = (code: string) => {
    const key = `errors.${code}` as TranslationKey;
    const text = t(key);
    return text === key ? t('errors.generic') : text;
  };

  const onSuccess = (order: Order) => {
    haptic.notify('success');
    cart.clear();
    setSuccessOrder(order);
  };

  /** Telegram ichida invoice'ni ochish (Stars / Payme / Click) */
  const openInvoice = (url: string, order: Order) => {
    if (!webApp || !webApp.isVersionAtLeast('6.1')) {
      window.open(url, '_blank');
      return;
    }
    webApp.openInvoice(url, (status) => {
      if (status === 'paid') onSuccess({ ...order, paymentStatus: 'paid' });
      else if (status === 'cancelled' || status === 'failed') {
        haptic.notify('warning');
        showToast(t('cart.paymentCancelled'));
      }
    });
  };

  const submit = async () => {
    if (!canAuthenticate()) {
      haptic.notify('error');
      showToast(t('errors.UNAUTHORIZED'));
      return;
    }
    if (address.trim().length < MIN_ADDRESS_LENGTH) {
      haptic.notify('error');
      setAddressError(t('errors.INVALID_ADDRESS'));
      document.getElementById('address')?.focus();
      return;
    }

    setSubmitting(true);
    haptic.impact('heavy');
    try {
      const { order, invoiceUrl } = await api.createOrder({
        items: cart.items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        bump: cart.bump,
        paymentMethod: cart.paymentMethod,
        address: address.trim(),
        phone: phone.trim() || undefined,
        comment: comment.trim() || undefined,
      });
      if (invoiceUrl) openInvoice(invoiceUrl, order);
      else onSuccess(order);
    } catch (error) {
      haptic.notify('error');
      showToast(errorText(error instanceof ApiError ? error.code : 'generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccess = () => {
    setSuccessOrder(null);
    router.push('/');
  };

  if (cart.isEmpty) {
    return (
      <>
        <PageHeader title={t('cart.title')} />
        <div className="flex flex-col items-center px-8 pt-16 text-center">
          <div className="flex size-28 items-center justify-center rounded-full bg-brand-soft text-6xl">🛒</div>
          <h2 className="mt-6 text-xl font-bold">{t('cart.empty')}</h2>
          <p className="mt-2 text-hint">{t('cart.emptyText')}</p>
          <Link href="/catalog" className="mt-6 w-full">
            <Button size="lg" fullWidth>
              {t('cart.goCatalog')}
            </Button>
          </Link>
        </div>
        <OrderSuccess order={successOrder} onClose={closeSuccess} />
      </>
    );
  }

  const ctaLabel = cart.paymentMethod === 'cash' ? 'cart.confirm' : 'cart.pay';

  return (
    <>
      <PageHeader
        title={t('cart.title')}
        action={
          <button type="button" onClick={cart.clear} className="text-sm font-semibold text-sale">
            {t('cart.clear')}
          </button>
        }
      />

      <div className="space-y-6 px-4">
        {/* 1. Order Stack */}
        <CartList />

        {/* 2. Order Bump */}
        <OrderBump />

        {/* 3. Yetkazib berish */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold">📍 {t('cart.delivery')}</h2>
          <Textarea
            id="address"
            label={t('cart.address')}
            placeholder={t('cart.addressPlaceholder')}
            value={address}
            error={addressError}
            onChange={(event) => {
              setAddress(event.target.value);
              setAddressError(undefined);
            }}
          />
          <Input
            label={t('cart.phone')}
            type="tel"
            inputMode="tel"
            placeholder={t('cart.phonePlaceholder')}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <Input
            label={t('cart.comment')}
            placeholder={t('cart.commentPlaceholder')}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </section>

        {/* 4. To'lov usuli */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold">💳 {t('cart.payment')}</h2>
          <PaymentMethods available={available} starsRate={config?.starsRateUzs ?? 200} total={cart.total} />
        </section>

        {/* 5. Jami */}
        <section className="space-y-2 rounded-3xl bg-surface p-4 text-[15px]">
          <div className="flex justify-between">
            <span className="text-hint">{t('cart.subtotal')}</span>
            <span>{price(cart.subtotal)}</span>
          </div>
          {cart.bumpPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-hint">{t('cart.bump')}</span>
              <span>{price(cart.bumpPrice)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-hint">{t('cart.deliveryFee')}</span>
            <span className="font-semibold text-success">{t('cart.free')}</span>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3">
            <span className="text-lg font-bold">{t('cart.total')}</span>
            <span className="text-2xl font-extrabold">{price(cart.total)}</span>
          </div>
        </section>
      </div>

      {/* Sticky CTA — pastki navigatsiya ustida */}
      <div
        className="fixed inset-x-0 z-30 mx-auto max-w-lg px-4 pb-2"
        style={{ bottom: 'calc(60px + max(env(safe-area-inset-bottom), 0.5rem))' }}
      >
        <Button size="lg" fullWidth loading={submitting} onClick={submit} className="shadow-xl">
          {submitting ? t('cart.processing') : t(ctaLabel, { price: price(cart.total) })}
        </Button>
      </div>
      <div className="h-20" />

      <OrderSuccess order={successOrder} onClose={closeSuccess} />
    </>
  );
}
