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

const STEP = 3; // "ip" kengligi, px
const q = (value: number) => Math.round(value / 1.5) * 1.5;

/** Yuqoridan y(x) gacha to'ldirilgan, pastki cheti zinapoyasimon shakl */
function steppedFill(width: number, depth: (x: number) => number) {
  let d = `M0 0 H${width} `;
  for (let x = width; x > 0; x -= STEP) {
    const y = q(depth(x - STEP / 2));
    d += `V${y} H${x - STEP} `;
  }
  return `${d}V0 Z`;
}

/** Uchburchak to'lqin 0..1..0 — romb (bodom) uchlari uchun */
const tri = (x: number, period: number) => {
  const p = ((x % period) + period) % period;
  return 1 - Math.abs((p / period) * 2 - 1);
};

function edgeTile(width: number, height: number, seed: number) {
  const rnd = random(seed);
  const jitter = Array.from({ length: Math.ceil(width / STEP) + 2 }, () => (rnd() - 0.5) * 3);
  const j = (x: number) => jitter[Math.floor(x / STEP)] ?? 0;
  const base = height * 0.34;
  const amp = height * 0.4;
  const profile = (x: number) => base + amp * Math.pow(tri(x, width), 2.2);
  return {
    saffron: steppedFill(width, (x) => Math.min(height, profile(x) + height * 0.3 + j(x) * 1.4)),
    magenta: steppedFill(width, (x) => profile(x) + height * 0.16 + j(x)),
    brand: steppedFill(width, (x) => profile(x) + j(x) * 0.8),
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
    const w = half * 0.42;
    const top: string[] = [];
    const bottom: string[] = [];
    for (let x = cx - w; x <= cx + w; x += STEP) {
      const k = 1 - Math.abs(x - cx) / w;
      const h = q(Math.max(0, k * (mid - 1) + (rnd() - 0.5) * 1.5));
      top.push(`${x},${mid - h} ${x + STEP},${mid - h}`);
      bottom.unshift(`${x + STEP},${mid + h} ${x},${mid + h}`);
    }
    return { points: [...top, ...bottom].join(' '), tone: tones[(i + seed) % 3] };
  });
}

interface AtlasBandProps {
  variant?: 'edge' | 'rail';
  height?: number;
  /** Naqsh davri (px) */
  tile?: number;
  seed?: number;
  className?: string;
}

export function AtlasBand({ variant = 'edge', height = 28, tile = 72, seed = 7, className }: AtlasBandProps) {
  const id = useId().replace(/:/g, '');
  const edge = useMemo(() => edgeTile(tile, height, seed), [tile, height, seed]);
  const lozenges = useMemo(() => railLozenges(tile, height, seed), [tile, height, seed]);

  return (
    <svg aria-hidden="true" className={cn('block w-full', className)} height={height} preserveAspectRatio="none">
      <defs>
        <pattern id={id} width={tile} height={height} patternUnits="userSpaceOnUse">
          {variant === 'edge' ? (
            <>
              <path d={edge.saffron} style={{ fill: 'var(--silk-3)' }} />
              <path d={edge.magenta} style={{ fill: 'var(--silk-2)' }} />
              <path d={edge.brand} style={{ fill: 'var(--brand)' }} />
            </>
          ) : (
            <>
              <rect width={tile} height={height} style={{ fill: 'var(--brand)' }} />
              {lozenges.map((shape, i) => (
                <polygon
                  key={i}
                  points={shape.points}
                  style={{
                    fill: shape.tone === 'silk2' ? 'var(--silk-2)' : shape.tone === 'silk3' ? 'var(--silk-3)' : 'var(--on-brand)',
                  }}
                />
              ))}
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
}
