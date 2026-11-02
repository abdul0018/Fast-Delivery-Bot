"use client";

/**
 * Admin panel (sayt, telefon uchun moslashgan): Statistika · Mahsulotlar · Buyurtmalar.
 * Kirish — parolsiz: Telegram ichida ochilganda (botda /admin) avtomatik, Telegram tasdig'i bilan.
 */
import { useEffect, useState } from "react";
import {
  BarChart3,
  ClipboardList,
  LogOut,
  Package,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/layout/Header";
import {
  adminApi,
  adminErrorText,
  setUnauthorizedHandler,
  tokenStore,
} from "@/lib/adminApi";
import { cn } from "@/lib/utils";
import { AdminToastProvider } from "./adminUi";
import { LoginScreen } from "./LoginScreen";
import { OrdersView } from "./OrdersView";
import { ProductsView } from "./ProductsView";
import { StatsView } from "./StatsView";

type Tab = "stats" | "products" | "orders";
const TAB_KEY = "morefish-admin-tab";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "stats", label: "Статистика", icon: BarChart3 },
  { id: "products", label: "Товары", icon: Package },
  { id: "orders", label: "Заказы", icon: ClipboardList },
];

const isTab = (value: unknown): value is Tab =>
  TABS.some((tab) => tab.id === value);

export function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("stats");
  const [telegramError, setTelegramError] = useState<string>();
  const [inTelegram, setInTelegram] = useState(false);

  useEffect(() => {
    // Telegram ichida: Telegram imzolagan initData bilan avtomatik kirish (parolsiz)
    const initData = window.Telegram?.WebApp?.initData;
    if (initData) {
      setInTelegram(true);
      adminApi
        .telegramLogin(initData)
        .then(({ token }) => {
          tokenStore.set(token);
          setAuthed(true);
        })
        .catch((error) => {
          tokenStore.set(null);
          setTelegramError(adminErrorText(error));
          setAuthed(false);
        });
    } else {
      setAuthed(Boolean(tokenStore.get()));
    }
    try {
      const saved = localStorage.getItem(TAB_KEY);
      if (isTab(saved)) setTab(saved);
    } catch {
      /* ignore */
    }
    setUnauthorizedHandler(() => {
      tokenStore.set(null);
      setAuthed(false);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const selectTab = (next: Tab) => {
    setTab(next);
    window.scrollTo({ top: 0 });
    try {
      localStorage.setItem(TAB_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const logout = () => {
    tokenStore.set(null);
    setAuthed(false);
  };

  if (authed === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ground">
        <Logo size="lg" className="animate-pulse" />
      </div>
    );
  }

  return (
    <AdminToastProvider>
      {!authed ? (
        <LoginScreen
          onLogin={() => setAuthed(true)}
          telegramError={telegramError}
        />
      ) : (
        <div className="min-h-dvh bg-ground text-ink">
          <header className="sticky top-0 z-30 border-b border-line bg-ground/95 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
              <span className="flex items-center gap-2">
                <Logo />
                <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[12px] font-semibold text-brand-ink">
                  Админ
                </span>
              </span>
              {!inTelegram && (
                <button
                  type="button"
                  onClick={logout}
                  className="flex h-10 items-center gap-1.5 rounded-[12px] px-3 text-[14px] font-medium text-ink-2 hover:bg-tile"
                >
                  <LogOut size={16} />
                  Выйти
                </button>
              )}
            </div>
          </header>

          <main className="mx-auto max-w-2xl px-4 pt-4 pb-32">
            {tab === "stats" && (
              <StatsView onOpenOrders={() => selectTab("orders")} />
            )}
            {tab === "products" && <ProductsView />}
            {tab === "orders" && <OrdersView />}
          </main>

          <nav aria-label="Разделы" className="fixed inset-x-0 bottom-0 z-40">
            <ul className="mx-auto grid max-w-2xl grid-cols-3 border-t border-line bg-surface px-2 pt-1.5 pb-safe">
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => selectTab(id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex w-full flex-col items-center gap-1 rounded-[12px] py-1.5 text-[11px] font-medium transition-colors duration-200",
                        active ? "text-ink" : "text-ink-2",
                      )}
                    >
                      <Icon size={24} strokeWidth={active ? 2.1 : 1.75} />
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </AdminToastProvider>
  );
}
