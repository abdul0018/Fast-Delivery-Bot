'use client';

/**
 * Pastdan tepaga chiquvchi panel (Bottom Sheet).
 *  - fon (backdrop) bosilganda yoki tutqichni pastga tortganda yopiladi
 *  - footer — ekran pastiga yopishgan (sticky) CTA uchun joy
 */
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

const CLOSE_ANIMATION_MS = 240;
const DRAG_CLOSE_THRESHOLD = 110;

export function BottomSheet({ open, onClose, children, footer, ariaLabel, className }: BottomSheetProps) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const dragStart = useRef<number | null>(null);

  // Ochilish / yopilish animatsiyasi
  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      setDragY(0);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, CLOSE_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [open, mounted]);

  // Orqa fondagi sahifa skroll bo'lmasligi uchun
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [mounted, onClose]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    setDragY(Math.max(0, event.clientY - dragStart.current));
  };
  const onPointerUp = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (dragY > DRAG_CLOSE_THRESHOLD) onClose();
    else setDragY(0);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-[#3a0a0a]/30 transition-opacity duration-200',
          closing ? 'opacity-0' : 'animate-fade-in',
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 mx-auto flex max-h-[92dvh] max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-ground',
          closing ? 'translate-y-full transition-transform duration-200 ease-in' : 'animate-sheet-up',
          className,
        )}
        style={dragY && !closing ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
      >
        {/* Tutqich (drag handle) */}
        <div
          className="absolute inset-x-0 top-0 z-10 flex h-7 touch-none justify-center pt-2.5"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className="h-1.5 w-10 rounded-full bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer && <div className="bg-ground px-4 pt-3 pb-safe">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
