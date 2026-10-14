/**
 * Atlas (abr / ikat) lentasi — dizayn tizimining asosiy belgisi.
 *
 * Ikat matosida bo'yoq ip bo'ylab "oqib" ketadi, shuning uchun ranglar chegarasi
 * zinapoyasimon va notekis bo'ladi. Bu komponent shu chegarani SVG da seed asosida chizadi;
 * ranglar CSS o'zgaruvchilaridan olinadi (--brand, --silk-2, --silk-3), ya'ni rebrend avtomatik.
 *
 *  variant="edge" — brend maydonining pastki chekkasi: brend → pushti → za'faron chiziqlar
 *  variant="rail" — ingichka lenta: brend fonda zinapoyasimon romblar (kategoriyalar ostida)
 */
import { useId, useMemo } from 'react';
import { cn } from '@/lib/utils';

/** Deterministik tasodifiy sonlar (mulberry32) — har safar bir xil naqsh */
function random(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const q = (value: number) => Math.round(value * 2) / 2;

/**
 * Iplar: har birining kengligi 2–4 px (to'qilgan matoda iplar bir xil emas).
 * Bir marta hisoblanadi va barcha rang qatlamlari uchun umumiy bo'ladi.
 */
function threads(width: number, rnd: () => number) {
  const xs: number[] = [0];
  while (xs[xs.length - 1] < width) xs.push(Math.min(width, xs[xs.length - 1] + 2 + Math.round(rnd() * 2)));
  return xs;
}

/** Yuqoridan depth(x) gacha to'ldirilgan, pastki cheti zinapoyasimon shakl */
function steppedFill(xs: number[], depth: (x: number, i: number) => number) {
  const width = xs[xs.length - 1];
  let d = `M0 0 H${width} `;
  for (let i = xs.length - 1; i > 0; i -= 1) {
    d += `V${q(depth((xs[i] + xs[i - 1]) / 2, i))} H${xs[i - 1]} `;
  }
  return `${d}V0 Z`;
}

/**
 * Abr cheti: plitka bir nechta notekis "til" (bodom uchi) dan iborat — har birining eni va
 * chuqurligi seed asosida tasodifiy, shuning uchun telefon kengligida takror ko'rinmaydi.
 */
function edgeTile(width: number, height: number, seed: number) {
  const rnd = random(seed);
  const xs = threads(width, rnd);
  const cells: { start: number; end: number; amp: number }[] = [];
  for (let x = 0; x < width; ) {
    const w = Math.min(width - x, 34 + rnd() * 46);
    cells.push({ start: x, end: x + w, amp: 0.45 + rnd() * 0.55 });
    x += w;
  }
  const profile = (x: number) => {
    const cell = cells.find((c) => x >= c.start && x < c.end) ?? cells[cells.length - 1];
    const k = 1 - Math.abs(((x - cell.start) / (cell.end - cell.start)) * 2 - 1);
    return height * 0.26 + height * 0.42 * cell.amp * Math.pow(k, 2);
  };
  const noise = xs.map(() => rnd() - 0.5);
  const layer = (offset: number, spread: number) =>
    steppedFill(xs, (x, i) => Math.min(height, profile(x) + height * offset + noise[i] * spread));
  return {
    // Har bir rang qatlami ostida yarim shaffof "bo'yoq oqishi" qatori
    saffronBleed: layer(0.36, 4),
    saffron: layer(0.29, 3),
    magentaBleed: layer(0.2, 3.5),
    magenta: layer(0.14, 2.5),
    brandBleed: layer(0.06, 3),
    brand: layer(0, 2),
  };
}

/** Rail uchun ikki zinapoyasimon romb (polygon nuqtalari) */
function railLozenges(width: number, height: number, seed: number) {
  const rnd = random(seed);
  const tones = ['silk3', 'silk2', 'light'] as const;
  const half = width / 2;
  const mid = height / 2;
  return [0, 1].map((i) => {
    const cx = half * i + half / 2;
    const w = half * (0.36 + rnd() * 0.1);
    const top: string[] = [];
    const bottom: string[] = [];
    let x = cx - w;
    while (x < cx + w) {
      const step = 2 + Math.round(rnd() * 2);
      const k = 1 - Math.abs(x + step / 2 - cx) / w;
      const h = q(Math.max(0, k * (mid - 2) + (rnd() - 0.5) * 2));
      top.push(`${x},${mid - h} ${x + step},${mid - h}`);
      bottom.unshift(`${x + step},${mid + h} ${x},${mid + h}`);
      x += step;
    }
    return { points: [...top, ...bottom].join(' '), tone: tones[(i + seed) % 3] };
  });
}

const toneFill = (tone: 'silk2' | 'silk3' | 'light') =>
  tone === 'silk2' ? 'var(--silk-2)' : tone === 'silk3' ? 'var(--silk-3)' : 'var(--on-brand)';

interface AtlasBandProps {
  variant?: 'edge' | 'rail';
  height?: number;
  /** Naqsh davri (px); default: chet uchun 520, rail uchun 64 */
  tile?: number;
  seed?: number;
  className?: string;
}

export function AtlasBand({ variant = 'edge', height = 28, tile, seed = 7, className }: AtlasBandProps) {
  // Chet uchun keng plitka (telefonda takror ko'rinmaydi), rail uchun qisqa motiv
  const width = tile ?? (variant === 'edge' ? 520 : 64);
  const id = useId().replace(/:/g, '');
  const edge = useMemo(() => edgeTile(width, height, seed), [width, height, seed]);
  const lozenges = useMemo(() => railLozenges(width, height, seed), [width, height, seed]);

  return (
    <svg aria-hidden="true" className={cn('block w-full', className)} height={height} preserveAspectRatio="none">
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
          {variant === 'edge' ? (
            <>
              <path d={edge.saffronBleed} style={{ fill: 'var(--silk-3)', opacity: 0.45 }} />
              <path d={edge.saffron} style={{ fill: 'var(--silk-3)' }} />
              <path d={edge.magentaBleed} style={{ fill: 'var(--silk-2)', opacity: 0.5 }} />
              <path d={edge.magenta} style={{ fill: 'var(--silk-2)' }} />
              <path d={edge.brandBleed} style={{ fill: 'var(--brand)', opacity: 0.55 }} />
              <path d={edge.brand} style={{ fill: 'var(--brand)' }} />
            </>
          ) : (
            <>
              <rect width={width} height={height} style={{ fill: 'var(--brand)' }} />
              {lozenges.map((shape, i) => (
                <g key={i}>
                  {/* bo'yoq oqishi: biroz siljigan yarim shaffof nusxa */}
                  <polygon points={shape.points} transform="translate(1.5 0)" style={{ fill: toneFill(shape.tone), opacity: 0.4 }} />
                  <polygon points={shape.points} style={{ fill: toneFill(shape.tone) }} />
                </g>
              ))}
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
}
