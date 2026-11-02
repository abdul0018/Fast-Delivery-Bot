'use client';

/**
 * Mahsulotni qo'shish / tahrirlash — butun ekranli oyna (telefon uchun).
 * Rasm telefondan tanlanadi (kamera yoki galereya), yuklashdan oldin kichraytiriladi.
 * Matnlar ikki tilda: RU / UZ almashtirgich bilan.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Camera, ImagePlus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { AdminApiError, adminApi, adminErrorText, type AdminProduct, type ProductInput } from '@/lib/adminApi';
import { resizeImage } from '@/lib/imageResize';
import { asset, cn, formatPrice } from '@/lib/utils';
import { CATEGORY_LABELS, useAdminToast } from './adminUi';

// Tez tanlash: birlik ikki tilda birdan qo'yiladi
const UNIT_PRESETS: { ru: string; uz: string }[] = [
  { ru: '1 кг', uz: '1 kg' },
  { ru: '500 г', uz: '500 g' },
  { ru: '200 г', uz: '200 g' },
  { ru: '100 г', uz: '100 g' },
  { ru: '1 шт', uz: '1 dona' },
  { ru: '1 упак.', uz: '1 qadoq' },
];

type Lang = 'ru' | 'uz';

interface FormState {
  category: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  ingredients: Record<Lang, string>;
  unit: Record<Lang, string>;
  price: string;
  oldPrice: string;
  image: string | null;
  isActive: boolean;
  isUpsell: boolean;
  sortOrder: string;
}

const fromProduct = (product: AdminProduct | null, category: string): FormState => ({
  category: product?.category ?? category,
  name: { ru: product?.name.ru ?? '', uz: product?.name.uz ?? '' },
  description: { ru: product?.description.ru ?? '', uz: product?.description.uz ?? '' },
  ingredients: { ru: product?.ingredients.ru.join(', ') ?? '', uz: product?.ingredients.uz.join(', ') ?? '' },
  unit: { ru: product?.unit.ru ?? '1 кг', uz: product?.unit.uz ?? '1 kg' },
  price: product ? formatPrice(product.price) : '',
  oldPrice: product?.oldPrice ? formatPrice(product.oldPrice) : '',
  image: product?.image ?? null,
  isActive: product?.isActive ?? true,
  isUpsell: product?.isUpsell ?? false,
  sortOrder: String(product?.sortOrder ?? 0),
});

const digits = (value: string) => value.replace(/\D/g, '');
const toAmount = (value: string) => (digits(value) ? Number(digits(value)) : null);
const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

function Section({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="rounded-[20px] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-semibold">{title}</h3>
        {aside}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function LangSwitch({ value, onChange }: { value: Lang; onChange: (lang: Lang) => void }) {
  return (
    <div role="radiogroup" aria-label="Язык текста" className="flex rounded-[12px] bg-tile p-0.5">
      {(['ru', 'uz'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          role="radio"
          aria-checked={value === lang}
          onClick={() => onChange(lang)}
          className={cn(
            'h-8 rounded-[10px] px-3 text-[13px] font-semibold uppercase transition-colors',
            value === lang ? 'bg-surface text-ink shadow-(--shadow-thumb)' : 'text-ink-2',
          )}
        >
          {lang === 'ru' ? 'Рус' : 'Uzb'}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({ title, text, checked, onChange }: { title: string; text: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium">{title}</p>
        <p className="text-[13px] text-ink-2">{text}</p>
      </div>
      <Switch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

interface ProductEditorProps {
  product: AdminProduct | null;
  categories: string[];
  defaultCategory: string;
  onClose: () => void;
  onSaved: (product: AdminProduct) => void;
  onDeleted: (id: number) => void;
}

export function ProductEditor({ product, categories, defaultCategory, onClose, onSaved, onDeleted }: ProductEditorProps) {
  const toast = useAdminToast();
  const [form, setForm] = useState<FormState>(() => fromProduct(product, defaultCategory));
  const [lang, setLang] = useState<Lang>('ru');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<'name' | 'price' | 'oldPrice', string>>>({});
  const fileInput = useRef<HTMLInputElement>(null);
  const isNew = !product;

  // Orqa sahifa aylanib ketmasin
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const setLocalized = (key: 'name' | 'description' | 'ingredients' | 'unit', value: string, target: Lang = lang) =>
    setForm((current) => ({ ...current, [key]: { ...current[key], [target]: value } }));

  const pickImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const blob = await resizeImage(file);
      const path = await adminApi.uploadImage(blob);
      set('image', path);
    } catch (error) {
      toast(error instanceof AdminApiError ? adminErrorText(error) : 'Не удалось открыть фото. Выберите JPEG или PNG.', 'error');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!form.name.ru.trim()) next.name = 'Введите название на русском';
    const price = toAmount(form.price);
    if (price == null) next.price = 'Укажите цену';
    const oldPrice = toAmount(form.oldPrice);
    if (oldPrice != null && price != null && oldPrice <= price) next.oldPrice = 'Старая цена должна быть больше новой';
    setErrors(next);
    if (next.name) setLang('ru');
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) {
      toast('Проверьте выделенные поля', 'error');
      return;
    }
    const input: ProductInput = {
      category: form.category,
      nameRu: form.name.ru.trim(),
      nameUz: form.name.uz.trim(),
      descriptionRu: form.description.ru.trim(),
      descriptionUz: form.description.uz.trim(),
      ingredientsRu: splitList(form.ingredients.ru),
      ingredientsUz: splitList(form.ingredients.uz),
      price: toAmount(form.price),
      oldPrice: toAmount(form.oldPrice),
      unitRu: form.unit.ru.trim(),
      unitUz: form.unit.uz.trim(),
      image: form.image,
      isActive: form.isActive,
      isUpsell: form.isUpsell,
      sortOrder: Number(form.sortOrder) || 0,
    };
    setSaving(true);
    try {
      const saved = isNew ? await adminApi.createProduct(input) : await adminApi.updateProduct(product.id, input);
      toast(isNew ? 'Товар добавлен' : 'Изменения сохранены');
      onSaved(saved);
    } catch (error) {
      toast(adminErrorText(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!product) return;
    if (!window.confirm(`Удалить «${product.name.ru}»? Это нельзя отменить.\n\nЧтобы временно убрать товар, лучше выключите «Показывать в каталоге».`)) return;
    setDeleting(true);
    try {
      await adminApi.deleteProduct(product.id);
      toast('Товар удалён');
      onDeleted(product.id);
    } catch (error) {
      toast(adminErrorText(error), 'error');
      setDeleting(false);
    }
  };

  const priceInput = (key: 'price' | 'oldPrice', value: string) => {
    set(key, digits(value) ? formatPrice(Number(digits(value).slice(0, 9))) : '');
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={isNew ? 'Новый товар' : 'Редактирование товара'} className="fixed inset-0 z-[70] flex flex-col bg-ground">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-ground px-2">
        <button type="button" onClick={onClose} aria-label="Закрыть" className="flex size-11 items-center justify-center rounded-[12px] text-ink hover:bg-tile">
          <X size={22} />
        </button>
        <h2 className="min-w-0 flex-1 truncate text-[17px] font-semibold">{isNew ? 'Новый товар' : form.name.ru || 'Товар'}</h2>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-2xl space-y-3 px-4 pt-4 pb-32">
          {/* Rasm */}
          <section className="rounded-[20px] bg-surface p-4">
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => pickImage(event.target.files?.[0])}
            />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                aria-label="Выбрать фото"
                className="relative size-28 shrink-0 overflow-hidden rounded-[16px] bg-tile text-ink-2"
              >
                {form.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset(form.image)} alt="" className="size-full object-cover" />
                ) : (
                  <span className="flex size-full flex-col items-center justify-center gap-1 text-[12px]">
                    <ImagePlus size={26} />
                    Фото
                  </span>
                )}
                {uploading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-surface/70">
                    <span className="size-6 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                  </span>
                )}
              </button>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-[13px] text-ink-2">Квадратное фото смотрится лучше всего. Можно снять на камеру.</p>
                <Button variant="secondary" size="sm" onClick={() => fileInput.current?.click()} loading={uploading}>
                  <Camera size={16} />
                  {form.image ? 'Заменить фото' : 'Загрузить фото'}
                </Button>
              </div>
            </div>
          </section>

          {/* Narx */}
          <Section title="Цена">
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="price"
                label="Цена, сум *"
                inputMode="numeric"
                placeholder="350 000"
                value={form.price}
                error={errors.price}
                onChange={(event) => priceInput('price', event.target.value)}
              />
              <Input
                id="old-price"
                label="Старая цена"
                inputMode="numeric"
                placeholder="для скидки"
                value={form.oldPrice}
                error={errors.oldPrice}
                onChange={(event) => priceInput('oldPrice', event.target.value)}
              />
            </div>
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-ink-2">Цена за</p>
              <div className="flex flex-wrap gap-1.5">
                {UNIT_PRESETS.map((preset) => {
                  const active = form.unit.ru === preset.ru;
                  return (
                    <button
                      key={preset.ru}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, unit: { ...preset } }))}
                      aria-pressed={active}
                      className={cn(
                        'h-9 rounded-full px-3.5 text-[14px] font-medium transition-colors',
                        active ? 'bg-ink text-white' : 'bg-tile text-ink',
                      )}
                    >
                      {preset.ru}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Input id="unit-ru" aria-label="Единица на русском" placeholder="Своя: 4 шт" value={form.unit.ru} onChange={(event) => setLocalized('unit', event.target.value, 'ru')} />
                <Input id="unit-uz" aria-label="Единица на узбекском" placeholder="O'zbekcha: 4 dona" value={form.unit.uz} onChange={(event) => setLocalized('unit', event.target.value, 'uz')} />
              </div>
            </div>
          </Section>

          {/* Kategoriya */}
          <Section title="Категория">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => set('category', id)}
                  aria-pressed={form.category === id}
                  className={cn(
                    'h-9 rounded-full px-3.5 text-[14px] font-medium transition-colors',
                    form.category === id ? 'bg-ink text-white' : 'bg-tile text-ink',
                  )}
                >
                  {CATEGORY_LABELS[id] ?? id}
                </button>
              ))}
            </div>
          </Section>

          {/* Matnlar */}
          <Section title="Описание" aside={<LangSwitch value={lang} onChange={setLang} />}>
            <Input
              id="name"
              label={lang === 'ru' ? 'Название *' : 'Nomi (o‘zbekcha)'}
              placeholder={lang === 'ru' ? 'Лосось юкола' : 'Losos yukola'}
              value={form.name[lang]}
              error={lang === 'ru' ? errors.name : undefined}
              onChange={(event) => {
                setLocalized('name', event.target.value);
                setErrors((current) => ({ ...current, name: undefined }));
              }}
            />
            <Textarea
              id="description"
              rows={4}
              label={lang === 'ru' ? 'Описание' : 'Tavsif'}
              placeholder={lang === 'ru' ? 'Вкус, происхождение, как подавать…' : "Ta'mi, kelib chiqishi…"}
              value={form.description[lang]}
              onChange={(event) => setLocalized('description', event.target.value)}
            />
            <Input
              id="ingredients"
              label={lang === 'ru' ? 'Состав / особенности (через запятую)' : 'Tarkibi (vergul bilan)'}
              placeholder={lang === 'ru' ? 'Лосось, соль, сахар' : 'Losos, tuz, shakar'}
              value={form.ingredients[lang]}
              onChange={(event) => setLocalized('ingredients', event.target.value)}
            />
            {lang === 'ru' && !form.name.uz && (
              <p className="text-[13px] text-ink-2">Узбекский текст можно не заполнять — покупатели увидят русский.</p>
            )}
          </Section>

          {/* Ko'rinish */}
          <Section title="Показ">
            <ToggleRow
              title="Показывать в каталоге"
              text="Выключите, если товара временно нет"
              checked={form.isActive}
              onChange={(value) => set('isActive', value)}
            />
            <ToggleRow
              title="Предложение в корзине"
              text="Предлагается добавить к заказу (только один товар)"
              checked={form.isUpsell}
              onChange={(value) => set('isUpsell', value)}
            />
            <Input
              id="sort-order"
              label="Порядок в списке (меньше — выше)"
              inputMode="numeric"
              value={form.sortOrder}
              onChange={(event) => set('sortOrder', event.target.value.replace(/[^\d-]/g, '').slice(0, 6))}
            />
          </Section>

          {!isNew && (
            <button
              type="button"
              onClick={remove}
              disabled={deleting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] text-[15px] font-semibold text-sale hover:bg-surface disabled:opacity-50"
            >
              <Trash2 size={18} />
              Удалить товар
            </button>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-line bg-ground px-4 pt-3 pb-safe">
        <div className="mx-auto max-w-2xl pb-2">
          <Button size="lg" fullWidth loading={saving} disabled={uploading} onClick={save}>
            {isNew ? 'Добавить товар' : 'Сохранить'}
          </Button>
        </div>
      </div>
    </div>
  );
}
