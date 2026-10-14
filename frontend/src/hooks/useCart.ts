'use client';

import { useMemo } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useCatalogStore } from '@/store/catalogStore';

/**
 * Savatcha + hisoblangan qiymatlar (soni, summa, Order Bump, jami).
 * Ko'rsatiladigan summa — taxminiy; aniq summani backend qayta hisoblaydi.
 */
export function useCart() {
  const items = useCartStore((state) => state.items);
  const bump = useCartStore((state) => state.bump);
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  const actions = useCartStore.getState();
  const bumpOffer = useCatalogStore((state) => state.config?.bump ?? null);

  return useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const bumpPrice = bump && bumpOffer ? bumpOffer.price : 0;
    const quantityOf = (productId: number) => items.find((item) => item.product.id === productId)?.quantity ?? 0;

    return {
      items,
      bump: bump && Boolean(bumpOffer),
      bumpOffer,
      paymentMethod,
      count,
      subtotal,
      bumpPrice,
      total: subtotal + bumpPrice,
      isEmpty: items.length === 0,
      quantityOf,
      add: actions.add,
      increment: actions.increment,
      decrement: actions.decrement,
      remove: actions.remove,
      clear: actions.clear,
      setBump: actions.setBump,
      setPaymentMethod: actions.setPaymentMethod,
    };
  }, [items, bump, bumpOffer, paymentMethod, actions]);
}
