'use client';

import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Logo } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { adminApi, adminErrorText, tokenStore } from '@/lib/adminApi';

/** Admin panelga kirish: bitta parol (Render → ADMIN_PASSWORD) */
export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ground px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[24px] bg-surface p-6">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <p className="mt-1 text-[15px] text-ink-2">Админ-панель</p>
        </div>
        <div className="relative mt-7">
          <Input
            id="admin-password"
            type={visible ? 'text' : 'password'}
            label="Пароль"
            icon={<LockKeyhole size={14} strokeWidth={2} />}
            autoComplete="current-password"
            autoFocus
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
        <Button type="submit" size="lg" fullWidth loading={loading} disabled={!password} className="mt-5">
          Войти
        </Button>
      </form>
    </div>
  );
}
