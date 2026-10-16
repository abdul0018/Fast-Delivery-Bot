'use client';

/**
 * Savatcha: Order Stack, Order Bump, yetkazib berish ma'lumotlari, to'lov usuli va jami summa.
 * "Tasdiqlash" tugmasi bitta bosishda buyurtma yaratadi (onlayn to'lovda — Telegram invoice ochiladi).
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, MessageSquareText, Phone, ShoppingBag, Trash2 } from 'lucide-react';
import { CartList } from '@/components/features/CartList';
import { OrderBump } from '@/components/features/OrderBump';
import { OrderSuccess } from '@/components/features/OrderSuccess';
import { PaymentMethods } from '@/components/features/PaymentMethods';
import { PageHeader } from '@/components/layout/Header';
import { Button, buttonClasses } from '@/components/ui/Button';
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

  /** Telegram ichida invoice'ni ochish (Payme / Click) */
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

  // Buyurtma qabul qilingach: savatcha tozalangan, lekin "bo'sh savatcha" holatini panel ortida ko'rsatmaymiz
  if (successOrder) {
    return (
      <>
        <PageHeader title={t('cart.title')} />
        <OrderSuccess order={successOrder} onClose={closeSuccess} />
      </>
    );
  }

  if (cart.isEmpty) {
    return (
      <>
        <PageHeader title={t('cart.title')} />
        <div className="mx-4 flex flex-col items-center rounded-[24px] bg-surface px-6 pt-10 pb-6 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-tile text-ink-2">
            <ShoppingBag size={36} strokeWidth={1.6} />
          </div>
          <h2 className="mt-5 text-[22px] font-semibold">{t('cart.empty')}</h2>
          <p className="mt-1.5 text-ink-2">{t('cart.emptyText')}</p>
          <Link href="/catalog" className={buttonClasses({ size: 'lg', fullWidth: true, className: 'mt-6' })}>
            {t('cart.goCatalog')}
          </Link>
        </div>
      </>
    );
  }

  const ctaLabel = cart.paymentMethod === 'cash' ? 'cart.confirm' : 'cart.pay';

  return (
    <>
      <PageHeader
        title={t('cart.title')}
        subtitle={t('cart.itemsInCart', { count: cart.count })}
        action={
          <button
            type="button"
            onClick={() => {
              haptic.impact('rigid');
              cart.clear();
            }}
            aria-label={t('cart.clear')}
            className="flex h-10 items-center gap-1.5 rounded-[12px] bg-surface px-3 text-[14px] font-medium text-ink-2"
          >
            <Trash2 size={16} strokeWidth={2} />
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
        <section>
          <h2 className="mb-3 text-[20px] font-semibold">{t('cart.delivery')}</h2>
          <div className="space-y-3 rounded-[20px] bg-surface p-4">
            <Textarea
              id="address"
              icon={<MapPin size={15} strokeWidth={2} />}
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
              id="phone"
              icon={<Phone size={15} strokeWidth={2} />}
              label={t('cart.phone')}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t('cart.phonePlaceholder')}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <Input
              id="comment"
              icon={<MessageSquareText size={15} strokeWidth={2} />}
              label={t('cart.comment')}
              placeholder={t('cart.commentPlaceholder')}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
        </section>

        {/* 4. To'lov usuli */}
        <section>
          <h2 className="mb-3 text-[20px] font-semibold">{t('cart.payment')}</h2>
          <PaymentMethods available={available} />
        </section>

        {/* 5. Jami */}
        <section className="rounded-[20px] bg-surface p-4 text-[15px]">
          <dl className="space-y-2.5">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-2">{t('cart.subtotal')}</dt>
              <dd className="price">{price(cart.subtotal)}</dd>
            </div>
            {cart.bumpPrice > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-ink-2">{t('cart.bump')}</dt>
                <dd className="price">{price(cart.bumpPrice)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <dt className="text-ink-2">{t('cart.deliveryFee')}</dt>
              <dd className="font-medium text-ok">{t('cart.free')}</dd>
            </div>
          </dl>
          <div className="mt-3.5 flex items-baseline justify-between border-t border-line pt-3.5">
            <span className="text-[17px] font-semibold">{t('cart.total')}</span>
            <span className="price text-[22px] font-semibold">{price(cart.total)}</span>
          </div>
        </section>
      </div>

      {/* Sticky CTA — pastki navigatsiya ustida */}
      <div
        className="fixed inset-x-0 z-30 mx-auto max-w-lg bg-ground px-4 pt-2 pb-2 before:pointer-events-none before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-gradient-to-t before:from-ground before:to-transparent"
        style={{ bottom: 'calc(62px + max(env(safe-area-inset-bottom), 0.5rem))' }}
      >
        <Button size="lg" fullWidth loading={submitting} onClick={submit}>
          {submitting ? t('cart.processing') : t(ctaLabel, { price: price(cart.total) })}
        </Button>
      </div>
    </>
  );
}
