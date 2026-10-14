/**
 * Telegram WebApp (telegram-web-app.js) uchun minimal tiplar.
 * To'liq hujjat: https://core.telegram.org/bots/webapps
 */
export {};

declare global {
  interface TelegramWebAppUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
  }

  type HapticImpact = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
  type HapticNotification = 'error' | 'success' | 'warning';
  type InvoiceStatus = 'paid' | 'cancelled' | 'failed' | 'pending';

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: { user?: TelegramWebAppUser; start_param?: string };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: Record<string, string>;
    isExpanded: boolean;
    ready(): void;
    expand(): void;
    close(): void;
    isVersionAtLeast(version: string): boolean;
    setHeaderColor(color: string): void;
    setBackgroundColor(color: string): void;
    disableVerticalSwipes?(): void;
    openInvoice(url: string, callback?: (status: InvoiceStatus) => void): void;
    openTelegramLink(url: string): void;
    showAlert(message: string, callback?: () => void): void;
    onEvent(event: string, handler: () => void): void;
    offEvent(event: string, handler: () => void): void;
    BackButton: {
      isVisible: boolean;
      show(): void;
      hide(): void;
      onClick(cb: () => void): void;
      offClick(cb: () => void): void;
    };
    HapticFeedback: {
      impactOccurred(style: HapticImpact): void;
      notificationOccurred(type: HapticNotification): void;
      selectionChanged(): void;
    };
  }

  interface Window {
    Telegram?: { WebApp: TelegramWebApp };
  }
}
