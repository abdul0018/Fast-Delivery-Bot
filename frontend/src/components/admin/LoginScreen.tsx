'use client';

/**
 * Admin panelga kirish ekrani (brauzerda ochilganda).
 * Asosiy yo'l — parolsiz, Telegram orqali: botda /admin → panel Telegram ichida avtomatik kiradi.
 * Parol (ADMIN_PASSWORD) faqat serverda yoqilgan bo'lsa ko'rsatiladi.
 */
import { useEffect, useState, type FormEvent } from 'react';
import { Eye, EyeOff, LockKeyhole, Send } from 'lucide-react';
import { Logo } from '@/components/layout/Header';
import { Button, buttonClasses } from '@/components/ui/Button';
import { brand } from '@/config/brand';
import { Input } from '@/components/ui/Input';
import { adminApi, adminErrorText, tokenStore } from '@/lib/adminApi';

export function LoginScreen({ onLogin, telegramError }: { onLogin: () => void; telegramError?: string }) {
  const [info, setInfo] = useState<{ passwordEnabled: boolean; botUsername: string | null } | null>(null);
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminApi
      .info()
      .then(setInfo)
      .catch(() => setInfo({ passwordEnabled: false, botUsername: null }));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!password) return;
    setLoading(true);
    setError(undefined);
    try {
      const { token } = await adminApi.login(password);
      tokenStore.set(token);
      onLogin();
    } catch (err) {
      setError(adminErrorText(err));
    } finally {
      setLoading(false);
    }
  };

  const botLink = `https://t.me/${info?.botUsername || brand.botUsername}?start=admin`;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ground px-4 py-10">
      <div className="w-full max-w-sm rounded-[24px] bg-surface p-6">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <p className="mt-1 text-[15px] text-ink-2">Админ-панель</p>
        </div>

        {telegramError && (
          <p role="alert" className="mt-5 rounded-[14px] bg-tile p-3 text-[14px] font-medium text-sale">
            {telegramError}
          </p>
        )}

        <div className="mt-6 text-center">
          <p className="text-[15px] font-medium">Вход без пароля — через Telegram</p>
          <p className="mt-1 text-[14px] text-ink-2">
            Откройте бота и отправьте <b className="text-ink">/admin</b> — панель откроется прямо в Telegram.
          </p>
          <a href={botLink} className={buttonClasses({ size: 'lg', fullWidth: true, className: 'mt-4' })}>
            <Send size={18} />
            Открыть в Telegram
          </a>
        </div>

        {info?.passwordEnabled && (
          <form onSubmit={submit} className="mt-6 border-t border-line pt-5">
            <div className="relative">
              <Input
                id="admin-password"
                type={visible ? 'text' : 'password'}
                label="Или по паролю"
                icon={<LockKeyhole size={14} strokeWidth={2} />}
                autoComplete="current-password"
                value={password}
                error={error}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(undefined);
                }}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setVisible((value) => !value)}
                aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
                className="absolute top-[30px] right-1.5 flex size-10 items-center justify-center rounded-[12px] text-ink-2"
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button type="submit" variant="secondary" size="lg" fullWidth loading={loading} disabled={!password} className="mt-3">
              Войти
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
