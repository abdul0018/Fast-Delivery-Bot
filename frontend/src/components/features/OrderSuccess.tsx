'use client';

/**
 * Buyurtma qabul qilinganda — to'liq ekran.
 *  - Naqd: "Rahmat!", buyurtma raqami va summa
 *  - Kartaga o'tkazma: summa, karta raqami (nusxa olish), 3 qadam va "Chekni botga yuborish" —
 *    Mini App yopiladi, bot chatida karta rekvizitlari bilan xabar turibdi, mijoz chek skrinshotini yuboradi
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, CreditCard, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { brand } from '@/config/brand';
import { useCatalog } from '@/hooks/useCatalog';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import type { Order } from '@/types';

function CardPayment({ order, onClose }: { order: Order; onClose: () => void }) {
  const { t, price } = useI18n();
  const { webApp, haptic } = useTelegram();
  const { config } = useCatalog();
  const [copied, setCopied] = useState(false);
  const card = config?.card;

  const copy = async () => {
    if (!card) return;
    try {
      await navigator.clipboard.writeText(card.number.replace(/\s/g, ''));
      haptic.notify('success');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard ruxsati yo'q — raqam ekranda ko'rinib turibdi */
    }
  };

  // Bot chatiga qaytish: u yerda karta rekvizitlari bilan xabar bor, chek skrinshoti shu yerga yuboriladi
  const sendReceipt = () => {
    haptic.impact('medium');
    if (webApp?.initData) webApp.close();
    else window.open(`https://t.me/${brand.botUsername}`, '_blank');
  };

  return (
    <>
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-5 pt-10 text-center">
        <span className="flex size-20 animate-pop-in items-center justify-center rounded-full bg-brand text-on-brand">
          <CreditCard size={38} strokeWidth={2} />
        </span>
        <h2 className="mt-5 text-[30px] leading-tight font-semibold tracking-[-0.02em]">{t('cardPay.title')}</h2>
        <p className="mt-2 max-w-[34ch] text-[15px] text-ink-2">{t('cardPay.text')}</p>

        <div className="mt-6 w-full rounded-[20px] bg-surface p-4 text-left">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[14px] text-ink-2">{t('cardPay.amount')}</span>
            <span className="price text-[22px] font-semibold">{price(order.total)}</span>
          </div>
          {card && (
            <div className="mt-4 border-t border-line pt-4">
              <p className="text-[13px] text-ink-2">{t('cardPay.card')}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="price min-w-0 flex-1 text-[19px] font-semibold tracking-[0.02em] whitespace-nowrap">{card.number}</span>
                <button
                  type="button"
                  onClick={copy}
                  className="flex h-10 shrink-0 items-center gap-1.5 rounded-[12px] bg-brand-soft px-3 text-[14px] font-semibold text-brand-ink"
                >
                  {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2} />}
                  {copied ? t('cardPay.copiedShort') : t('cardPay.copy')}
                </button>
              </div>
              {(card.holder || card.bank) && (
                <p className="mt-2 text-[14px]">
                  <span className="text-ink-2">{t('cardPay.holder')}: </span>
                  {[card.holder, card.bank].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          )}
          <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-line pt-4 text-[14px]">
            <span className="text-ink-2">{t('cart.orderNumber')}</span>
            <span className="price font-semibold">#{order.id}</span>
          </div>
        </div>

        <ol className="mt-4 w-full space-y-2.5 text-left text-[15px]">
          {[t('cardPay.step1', { price: price(order.total) }), t('cardPay.step2'), t('cardPay.step3')].map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span className="price flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-white">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="space-y-2 px-4 pt-3 pb-safe">
        <Button size="lg" fullWidth onClick={sendReceipt}>
          <Send size={18} />
          {t('cardPay.sendReceipt')}
        </Button>
        <Button size="md" variant="ghost" fullWidth className="mb-2" onClick={onClose}>
          {t('cardPay.later')}
        </Button>
      </div>
    </>
  );
}

export function OrderSuccess({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const { t, price } = useI18n();
  if (!order || typeof document === 'undefined') return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={t('cart.successTitle')} className="fixed inset-0 z-[70] mx-auto flex max-w-lg animate-fade-in flex-col bg-ground">
      {order.paymentMethod === 'card' && order.paymentStatus !== 'paid' ? (
        <CardPayment order={order} onClose={onClose} />
      ) : (
        <>
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="flex size-24 animate-pop-in items-center justify-center rounded-full bg-brand text-on-brand">
              <Check size={46} strokeWidth={2.5} />
            </span>
            <h2 className="mt-7 text-[40px] leading-none font-semibold tracking-[-0.03em]">{t('cart.thanks')}</h2>
            <p className="mt-3 text-[17px]">{t('cart.onTheWay')}</p>
            <p className="mt-1.5 max-w-[30ch] text-[15px] text-ink-2">
              {order.paymentStatus === 'paid' ? t('cart.paidText', { id: order.id }) : t('cart.successText', { id: order.id })}
            </p>

            <dl className="mt-8 w-full divide-y divide-line rounded-[20px] bg-surface text-[15px]">
              <div className="flex items-center justify-between px-4 py-3.5">
                <dt className="text-ink-2">{t('cart.orderNumber')}</dt>
                <dd className="price font-semibold">#{order.id}</dd>
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <dt className="text-ink-2">{t('cart.total')}</dt>
                <dd className="price text-[17px] font-semibold">{price(order.total)}</dd>
              </div>
            </dl>
          </div>
          <div className="px-4 pb-safe">
            <Button size="lg" fullWidth className="mb-3" onClick={onClose}>
              {t('cart.backHome')}
            </Button>
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}
