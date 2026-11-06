import React from 'react';
import {AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, interpolate, Easing, random} from 'remotion';
import './fonts';
import track from './track.json';
import {FPS, SEGS, LEAKS, CARD, PAGES, END_CARD, SRC_END} from './data';

const W = 1080, H = 1920;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const tr = (t: number) => {
  const i = clamp(Math.round(t * FPS), 0, track.cx.length - 1);
  return {cx: track.cx[i], cy: track.cy[i]};
};
const segAt = (t: number) => SEGS.find((s) => t >= s.a && t < s.b) ?? SEGS[SEGS.length - 1];

// Crop (center + zoom) for source time t.
export const cropAt = (t: number) => {
  const s = segAt(t);
  const z = interpolate(t, [s.a, s.b], [s.z0, s.z1]);
  let cx = 0.5, cy = 0.5;
  if (s.m === 'f') {
    const p = tr(t);
    cx = p.cx; cy = p.cy + 0.12 / z; // keep upper body slightly above centre
  }
  const hw = 0.5 / z;
  return {z, cx: clamp(cx, hw, 1 - hw), cy: clamp(cy, hw, 1 - hw), seg: s};
};

const GOLD = 'linear-gradient(180deg,#FFF1BF 0%,#F7D27A 28%,#E3A93B 58%,#B97A1C 78%,#F3CC72 100%)';
const YGOLD = 'linear-gradient(180deg,#FFE680 0%,#FFC93C 50%,#E89A16 100%)';

// ---------------- Footage ----------------
const Footage: React.FC<{t: number}> = ({t}) => {
  const {z, cx, cy} = cropAt(t);
  const x = -(cx - 0.5 / z) * W * z, y = -(cy - 0.5 / z) * H * z;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', width: W, height: H, transformOrigin: '0 0',
        transform: `translate(${x}px, ${y}px) scale(${z})`}}>
        <OffthreadVideo src={staticFile('raw_graded.mp4')} muted style={{width: W, height: H}} />
      </div>
    </AbsoluteFill>
  );
};

// Crumpled paper (static SVG lighting).
const Paper: React.FC<{tone?: string; light?: string}> = ({tone = '#e9e6e1', light = '#f4f1ec'}) => (
  <AbsoluteFill style={{background: tone}}>
    <svg width={W} height={H}>
      <filter id="crumple">
        <feTurbulence type="fractalNoise" baseFrequency="0.0045" numOctaves={5} seed={7} />
        <feDiffuseLighting lightingColor={light} surfaceScale={5} diffuseConstant={1.05}>
          <feDistantLight azimuth={225} elevation={52} />
        </feDiffuseLighting>
      </filter>
      <rect width={W} height={H} filter="url(#crumple)" />
    </svg>
  </AbsoluteFill>
);

// Card section: video shrinks into a rounded card on paper.
const CardFrame: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) => {
  const inP = interpolate(t, [CARD.a, CARD.a + 7 / FPS], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.exp)});
  const outP = interpolate(t, [CARD.b - 6 / FPS, CARD.b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const p = inP * (1 - outP);
  const inset = 0.075 * p, insetY = 0.085 * p, r = 34 * p;
  return (
    <AbsoluteFill>
      <Img src={staticFile('paper_light.png')} style={{position: 'absolute', width: W, height: H}} />
      <div style={{position: 'absolute', left: W * inset, top: H * insetY, width: W * (1 - 2 * inset), height: H * (1 - 2 * insetY),
        borderRadius: r, overflow: 'hidden', boxShadow: `0 ${18 * p}px ${50 * p}px rgba(0,0,0,${0.28 * p})`}}>
        <div style={{position: 'absolute', left: -W * inset, top: -H * insetY, width: W, height: H}}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Light leak (prism film burn, ~10f) ----------------
const Leak: React.FC<{t: number; at: number; i: number}> = ({t, at, i}) => {
  const f = (t - at) * FPS; // -5..+5
  if (f < -6 || f > 6) return null;
  const a = interpolate(f, [-6, -2, 0, 2, 6], [0, 0.75, 0.95, 0.6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sweep = interpolate(f, [-6, 6], [-35, 45]);
  const dots = Array.from({length: 70}, (_, k) => ({
    x: random(`dx${i}${k}`) * W, y: random(`dy${i}${k}`) * H, r: 1 + random(`dr${i}${k}`) * 3.5, o: random(`do${i}${k}`)}));
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{opacity: a * 0.85, mixBlendMode: 'screen', background:
        `radial-gradient(ellipse 80% 60% at ${70 - sweep / 2}% 30%, rgba(255,246,228,1) 0%, rgba(255,214,150,.85) 35%, rgba(255,150,70,.35) 65%, rgba(255,120,50,0) 100%)`}} />
      <AbsoluteFill style={{opacity: a, mixBlendMode: 'screen', background:
        `linear-gradient(115deg, rgba(0,0,0,0) ${38 + sweep}%, rgba(255,60,50,.75) ${44 + sweep}%, rgba(255,190,60,.8) ${48 + sweep}%, rgba(120,255,150,.55) ${51 + sweep}%, rgba(80,150,255,.55) ${54 + sweep}%, rgba(170,90,255,.35) ${57 + sweep}%, rgba(0,0,0,0) ${62 + sweep}%)`}} />
      <AbsoluteFill style={{opacity: a * 0.35, background: '#fff8ee'}} />
      <svg width={W} height={H} style={{position: 'absolute', opacity: a, mixBlendMode: 'screen'}}>
        {dots.map((d, k) => <circle key={k} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity={0.25 + 0.6 * d.o} />)}
        <line x1={W * 0.12} y1={0} x2={W * 0.16} y2={H} stroke="#fff" strokeWidth={1.5} opacity={0.5} />
        <line x1={W * 0.0} y1={H * 0.36} x2={W} y2={H * 0.33} stroke="#fff" strokeWidth={1.2} opacity={0.45} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- Captions ----------------
type Wd = [number, string, 'w' | 'g' | 's' | 'y', boolean?];
const BASE: Record<string, {size: number; cw: number; css: React.CSSProperties}> = {
  w: {size: 62, cw: 0.58, css: {fontFamily: 'Poppins', fontStyle: 'italic', fontWeight: 600, color: '#fff', textShadow: '0 2px 3px rgba(0,0,0,.55), 0 3px 14px rgba(0,0,0,.45)'}},
  s: {size: 96, cw: 0.47, css: {fontFamily: 'Playfair Display', fontWeight: 400, color: '#fff', textShadow: '0 2px 3px rgba(0,0,0,.55), 0 3px 16px rgba(0,0,0,.45)'}},
  g: {size: 150, cw: 0.47, css: {fontFamily: 'Playfair Display', fontWeight: 600, backgroundImage: GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 2px 2px rgba(40,22,0,.7)) drop-shadow(0 4px 14px rgba(0,0,0,.5))'}},
  y: {size: 104, cw: 0.6, css: {fontFamily: 'Poppins', fontStyle: 'italic', fontWeight: 700, backgroundImage: YGOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 2px 2px rgba(40,22,0,.7)) drop-shadow(0 4px 12px rgba(0,0,0,.5))'}},
};

const Letters: React.FC<{text: string; st: string; size: number; f0: number; fEnd: number; f: number; seed: string; condensed: boolean}> = (
  {text, st, size, f0, fEnd, f, seed, condensed}) => {
  const chars = [...text];
  const stag = Math.min(1.2, 9 / chars.length);
  return (
    <span style={{display: 'inline-block', whiteSpace: 'nowrap', transform: condensed ? 'scaleX(0.88)' : undefined}}>
      {chars.map((c, i) => {
        const p = interpolate(f - f0 - i * stag, [0, 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        const q = interpolate(f - (fEnd - 5) - i * 0.4, [0, 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
        const rot = (random(`${seed}r${i}`) - 0.5) * 70, rot2 = (random(`${seed}o${i}`) - 0.5) * 60;
        const o = p * (1 - q);
        if (o <= 0.001) return <span key={i} style={{...BASE[st].css, fontSize: size, opacity: 0}}>{c === ' ' ? ' ' : c}</span>;
        return (
          <span key={i} style={{...BASE[st].css, fontSize: size, display: 'inline-block', opacity: o,
            transform: `translateY(${((1 - p) * 0.45 - q * 0.35) * size}px) rotate(${(1 - p) * rot + q * rot2}deg) scale(${0.55 + 0.45 * p})`,
            filter: `${BASE[st].css.filter ?? ''} blur(${(1 - p) * 9 + q * 8}px)`}}>{c === ' ' ? ' ' : c}</span>
        );
      })}
    </span>
  );
};

const Captions: React.FC<{t: number}> = ({t}) => {
  const f = t * FPS;
  const idx = PAGES.findIndex((pg, k) => {
    const s = pg[0][0][0] as number; const e = k + 1 < PAGES.length ? (PAGES[k + 1][0][0][0] as number) : SRC_END;
    return t >= s - 0.01 && t < e;
  });
  if (idx < 0) return null;
  const page = PAGES[idx] as unknown as Wd[][];
  const pStart = page[0][0][0];
  const pEnd = idx + 1 < PAGES.length ? (PAGES[idx + 1][0][0][0] as number) : SRC_END;
  // Side placement: away from presenter (decided once per page).
  const c = cropAt(pStart);
  let xc = 0.5, maxW = 0.84;
  if (c.seg.m === 'f' && !c.seg.card) {
    const px = (tr(pStart).cx - (c.cx - 0.5 / c.z)) * c.z;
    if (px > 0.56) { xc = 0.37; maxW = 0.62; } else if (px < 0.44) { xc = 0.63; maxW = 0.62; }
  }
  const lines = page.map((ln) => {
    // fit line width
    const est = ln.reduce((acc, w) => acc + [...w[1]].length * BASE[w[2]].cw * BASE[w[2]].size * (w[2] === 'g' ? 0.88 : 1), 0) + (ln.length - 1) * 24;
    const k = Math.min(1, (maxW * W) / est);
    return {ln, k};
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: xc * W, top: H * 0.4, transform: 'translate(-50%,-50%)', width: W * maxW * 1.15, height: H * 0.3,
        opacity: interpolate(t, [pStart, pStart + 0.15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(10,8,6,.42) 0%, rgba(10,8,6,.22) 45%, rgba(10,8,6,0) 75%)'}} />
      <div style={{position: 'absolute', left: xc * W, top: H * 0.4, transform: 'translate(-50%,-50%)', textAlign: 'center', width: W * maxW}}>
        {lines.map(({ln, k}, li) => (
          <div key={li} style={{lineHeight: 1.0, marginTop: li ? -6 : 0, whiteSpace: 'nowrap'}}>
            {ln.map((w, wi) => {
              const size = BASE[w[2]].size * k;
              const f0 = w[0] * FPS;
              const el = <Letters text={w[1]} st={w[2]} size={size} f0={f0} fEnd={pEnd * FPS} f={f} seed={`${idx}-${li}-${wi}`} condensed={w[2] === 'g'} />;
              return (
                <span key={wi} style={{display: 'inline-block', position: 'relative', margin: `0 ${12 * k}px`}}>
                  {el}
                  {w[3] && (
                    <span style={{position: 'absolute', left: 0, right: 0, top: '86%', transform: 'scaleY(-1)', opacity: 0.38,
                      WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,.9), rgba(0,0,0,0) 62%)', maskImage: 'linear-gradient(to top, rgba(0,0,0,.9), rgba(0,0,0,0) 62%)'}}>
                      {el}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Grain + vignette ----------------
const Grain: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <Img src={staticFile(`grain_${f % 8}.png`)} style={{position: 'absolute', width: W, height: H, opacity: 0.16, mixBlendMode: 'overlay'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 48%, rgba(0,0,0,0) 60%, rgba(0,0,0,.28) 100%)'}} />
  </AbsoluteFill>
);

// ---------------- End card ----------------
const EndCard: React.FC<{t: number}> = ({t}) => {
  const f = (t - END_CARD) * FPS;
  const word = 'INMODA';
  return (
    <AbsoluteFill>
      <Img src={staticFile('paper_dark.png')} style={{position: 'absolute', width: W, height: H}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 45% at 50% 46%, rgba(255,200,120,.16), rgba(0,0,0,.55) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{letterSpacing: '0.14em', marginLeft: '0.14em'}}>
          <Letters text={word} st="g" size={190} f0={4} fEnd={9999} f={f} seed="end" condensed={false} />
        </div>
        <div style={{width: interpolate(f, [12, 26], [0, 520], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.exp)}), height: 3, marginTop: 18,
          background: 'linear-gradient(90deg, rgba(227,169,59,0), #E3A93B, rgba(227,169,59,0))'}} />
        <div style={{marginTop: 26}}>
          <Letters text="inmoda.uz" st="w" size={64} f0={16} fEnd={9999} f={f} seed="end2" condensed={false} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PaperStill: React.FC<{dark?: boolean}> = ({dark}) => dark ? <Paper tone="#17120d" light="#3a2e22" /> : <Paper />;

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const inCard = t >= CARD.a && t < CARD.b;
  const footage = <Footage t={Math.min(t, SRC_END - 0.01)} />;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < END_CARD ? (
        <>
          {inCard ? <CardFrame t={t}>{footage}</CardFrame> : footage}
          <Captions t={t} />
        </>
      ) : <EndCard t={t} />}
      <Grain f={frame} />
      {LEAKS.map((at, i) => <Leak key={i} t={t} at={at} i={i} />)}
    </AbsoluteFill>
  );
};
