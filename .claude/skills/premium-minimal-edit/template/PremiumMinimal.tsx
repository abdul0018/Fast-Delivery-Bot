/**
 * Premium Minimal Edit: Remotion building blocks (Mode A, voiceover style).
 * Spec: ../SKILL.md §2–§3. All timings are in frames at 30 fps unless noted.
 *
 * Usage: describe the edit as an `Edit` object (shots + text stacks + transitions,
 * with times in SECONDS taken from word-level transcription) and render <PremiumEdit edit={...} />.
 *
 * Deps: remotion, @remotion/google-fonts, react.
 */
import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Sequence, interpolate, Easing,
  useCurrentFrame, useVideoConfig, staticFile,
} from 'remotion';
// Fonts: Google Fonts via Remotion. If headless Chrome cannot reach fonts.gstatic.com (sandbox/proxy),
// replace these lines with `import './fonts-local'; const SANS = 'Montserrat'; const SCRIPT = 'Allison';`
// and put the woff2 files in public/ (see fonts-local.ts).
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadAllison} from '@remotion/google-fonts/Allison';

const {fontFamily: SANS} = loadMontserrat('italic', {weights: ['800']});
loadMontserrat('normal', {weights: ['300', '600']}); // 300 = T3 thin, 600 = logo
const {fontFamily: SCRIPT} = loadAllison();

export const YELLOW = '#FAFA05';
export const FPS = 30;
const s2f = (s: number) => Math.round(s * FPS);

// ---------- Types ----------
export type Media = {src: string; image?: boolean; startFrom?: number /* s into source */};
export type Shot = {
  from: number; to: number;                 // seconds on the timeline
  media?: Media;                            // full-frame clip
  split?: {top: Media; bottom: Media};      // 50/50 vertical split screen
  slowPush?: boolean;                       // 100%→104% scale over the shot (for static clips)
};
export type Stack = {
  layout: 'stack3' | 'stack2';
  t1: {text: string; at: number};           // yellow keyword (seconds = word onset)
  t2?: {text: string; at: number};          // script connector
  t3?: {text: string; at: number};          // thin finisher (stack3 only)
  out: number;                              // seconds: when it leaves
  exit?: 'cut' | 'whip';                    // whip = 4-frame blur-slide left
};
export type Edit = {
  durationSec: number;
  shots: Shot[];
  stacks: Stack[];
  lightLeaks: number[];                     // seconds: the CUT point (peak of the leak)
  whips: number[];                          // seconds: the cut point of a whip-pan
  dipToWhite?: number;                      // seconds: start of the 8-frame dip
  logo?: {at: number; word: string; tagline?: string; accentIndex?: number};
  audio?: string;
};

// ---------- Footage ----------
const MediaFill: React.FC<{m: Media; style?: React.CSSProperties}> = ({m, style}) => {
  const src = m.src.startsWith('http') ? m.src : staticFile(m.src);
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', ...style};
  return m.image ? <Img src={src} style={st} /> : (
    <OffthreadVideo src={src} startFrom={s2f(m.startFrom ?? 0)} muted style={st} />
  );
};

const ShotView: React.FC<{shot: Shot}> = ({shot}) => {
  const f = useCurrentFrame();
  const dur = s2f(shot.to - shot.from);
  const scale = shot.slowPush ? interpolate(f, [0, dur], [1, 1.04]) : 1;
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`}}>
      {shot.split ? (
        <AbsoluteFill style={{flexDirection: 'column'}}>
          <div style={{height: '50%', overflow: 'hidden'}}><MediaFill m={shot.split.top} /></div>
          <div style={{height: '50%', overflow: 'hidden'}}><MediaFill m={shot.split.bottom} /></div>
        </AbsoluteFill>
      ) : shot.media ? <MediaFill m={shot.media} /> : null}
    </AbsoluteFill>
  );
};

// Horizontal-only motion blur (SVG filter). Referenced as filter: url(#hblur-N).
const HBlurDefs: React.FC = () => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    {[6, 18, 40, 70].map((d) => (
      <filter key={d} id={`hblur-${d}`} x="-50%" y="0" width="200%" height="100%">
        <feGaussianBlur stdDeviation={`${d} 0`} />
      </filter>
    ))}
  </svg>
);

/** Whip-pan around a cut: 2 frames of heavy horizontal blur + slide before and after. */
const WhipFootage: React.FC<{children: React.ReactNode; cut: number}> = ({children, cut}) => {
  const f = useCurrentFrame();
  const c = s2f(cut);
  const d = f - c; // frames relative to cut
  let blur = 0, x = 0;
  if (d >= -3 && d < 0) { blur = [6, 40, 70][d + 3]; x = [-2, -8, -16][d + 3]; }
  if (d >= 0 && d < 3) { blur = [70, 18, 6][d]; x = [16, 6, 1][d]; }
  return (
    <AbsoluteFill style={{transform: `translateX(${x}%) scale(${blur ? 1.15 : 1})`,
      filter: blur ? `url(#hblur-${blur})` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- Scrim ----------
export const Scrim: React.FC = () => (
  <AbsoluteFill style={{background:
    'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,.35) 75%, rgba(0,0,0,.45) 100%)'}} />
);

// ---------- Text stack ----------
const t1Style = (H: number): React.CSSProperties => ({
  fontFamily: SANS, fontStyle: 'italic', fontWeight: 800, color: YELLOW,
  fontSize: H * 0.074, lineHeight: 1, letterSpacing: '-0.01em', textTransform: 'uppercase',
  textShadow: '0 2px 6px rgba(0,0,0,.25)', whiteSpace: 'nowrap',
});
const t2Style = (H: number): React.CSSProperties => ({
  fontFamily: SCRIPT, color: '#fff', fontSize: H * 0.095, lineHeight: 1, whiteSpace: 'nowrap',
});
const t3Style = (H: number): React.CSSProperties => ({
  fontFamily: 'Montserrat', fontWeight: 300, color: 'rgba(255,255,255,.95)',
  fontSize: H * 0.072, lineHeight: 1, whiteSpace: 'nowrap',
});

/** Rendered inside a Sequence that starts at stack.t1.at (or earlier tier). */
export const TextStack: React.FC<{stack: Stack; start: number}> = ({stack, start}) => {
  const f = useCurrentFrame() + s2f(start); // absolute frame
  const {width: W, height: H} = useVideoConfig();
  const on = (at?: number) => at !== undefined && f >= s2f(at); // 1-frame hard pop
  const firstAt = Math.min(stack.t1.at, stack.t2?.at ?? Infinity, stack.t3?.at ?? Infinity);

  // Whip exit: 4 frames, cubic-in, block slides left with growing horizontal blur.
  const outF = s2f(stack.out);
  let x = 0, blurId: number | null = null, opacity = 1;
  if (stack.exit === 'whip' && f >= outF - 4) {
    const k = Math.min(4, f - (outF - 4)); // 0..4
    x = -interpolate(k, [0, 4], [0, 1], {easing: Easing.in(Easing.cubic)}) * W * 0.75;
    blurId = [null, 6, 18, 40, 70][k] as number | null;
    opacity = k >= 4 ? 0 : 1;
  }

  const blockStyle: React.CSSProperties = {
    position: 'absolute', transform: `translateX(${x}px)`, opacity,
    filter: blurId ? `url(#hblur-${blurId})` : undefined,
  };

  return (
    <AbsoluteFill>
      {f >= s2f(firstAt) && <Scrim />}
      {stack.layout === 'stack3' ? (
        <div style={{...blockStyle, left: W * 0.09, top: H * 0.655}}>
          <div style={{...t1Style(H), visibility: on(stack.t1.at) ? 'visible' : 'hidden'}}>{stack.t1.text}</div>
          {stack.t2 && (
            <div style={{...t2Style(H), position: 'absolute', right: -W * 0.07, top: H * 0.035,
              visibility: on(stack.t2.at) ? 'visible' : 'hidden'}}>{stack.t2.text}</div>
          )}
          {stack.t3 && (
            <div style={{...t3Style(H), marginLeft: W * 0.1, marginTop: H * 0.022,
              visibility: on(stack.t3.at) ? 'visible' : 'hidden'}}>{stack.t3.text}</div>
          )}
        </div>
      ) : (
        <div style={{...blockStyle, left: 0, right: 0, top: H * 0.655, textAlign: 'center'}}>
          {stack.t2 && (
            <div style={{...t2Style(H), marginLeft: W * 0.08, marginBottom: -H * 0.022,
              visibility: on(stack.t2.at) ? 'visible' : 'hidden'}}>{stack.t2.text}</div>
          )}
          <div style={{...t1Style(H), visibility: on(stack.t1.at) ? 'visible' : 'hidden'}}>{stack.t1.text}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Light leak (≈9 frames, cut at peak) ----------
/** Place in a 10-frame Sequence starting 4 frames before the cut. */
export const LightLeak: React.FC = () => {
  const f = useCurrentFrame() - 4; // −4 … +5 relative to the cut
  const a = interpolate(f, [-4, -1, 0, 2, 5], [0, 0.7, 0.9, 0.55, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const streak = interpolate(f, [1, 3, 5], [0, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const drift = interpolate(f, [-4, 5], [-20, 20]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{opacity: a, mixBlendMode: 'screen', background:
        `radial-gradient(ellipse 90% 70% at ${30 + drift}% 25%, #FFF1D6 0%, #FFD38A 30%, #FF9A3C 60%, rgba(255,120,40,0) 100%)`}} />
      <AbsoluteFill style={{opacity: a * 0.6, background: '#FFE7C2', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{opacity: streak, mixBlendMode: 'screen', background:
        'linear-gradient(90deg, rgba(255,60,40,0) 22%, rgba(255,70,50,.85) 30%, rgba(255,60,40,0) 38%)'}} />
    </AbsoluteFill>
  );
};

// ---------- Dip to white ----------
/** Place in a Sequence starting at the dip. */
export const DipToWhite: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#fff', opacity: o}} />;
};

// ---------- Logo reveal (letters spread from centre 18f, pause 9f, tagline 9f) ----------
export const LogoReveal: React.FC<{word: string; tagline?: string; accentIndex?: number}> = (
  {word, tagline, accentIndex}) => {
  const f = useCurrentFrame();
  const {height: H} = useVideoConfig();
  const letters = word.split('');
  const mid = (letters.length - 1) / 2;
  const ease = Easing.out(Easing.exp);
  const tagIn = interpolate(f, [27, 36], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return (
    <AbsoluteFill style={{background: '#fff', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', gap: H * 0.008}}>
        {letters.map((ch, i) => {
          const dist = Math.abs(i - mid);
          const delay = (mid - dist) * 3;             // outer letters first, centre letters last
          const p = interpolate(f, [delay, delay + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
          const dx = (i - mid) * -0.6 * (1 - p) * H * 0.03; // start bunched at centre, spread out
          return (
            <span key={i} style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: H * 0.05,
              color: '#111', opacity: p, transform: `translateX(${dx}px)`, letterSpacing: '0.04em',
              borderBottom: i === accentIndex ? `${H * 0.004}px solid #E0141E` : undefined}}>{ch}</span>
          );
        })}
      </div>
      {tagline && (
        <div style={{overflow: 'hidden', marginTop: H * 0.006}}>
          <div style={{fontFamily: 'Montserrat', fontWeight: 300, fontSize: H * 0.018, letterSpacing: '0.35em',
            color: '#111', transform: `translateY(${(1 - tagIn) * 100}%)`}}>{tagline.toUpperCase()}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Whole edit ----------
export const PremiumEdit: React.FC<{edit: Edit}> = ({edit}) => {
  const frame = useCurrentFrame();
  const whipAt = edit.whips.find((w) => Math.abs(frame - s2f(w)) <= 3);
  const footage = (
    <>
      {edit.shots.map((sh, i) => (
        <Sequence key={i} from={s2f(sh.from)} durationInFrames={Math.max(1, s2f(sh.to) - s2f(sh.from))}>
          <ShotView shot={sh} />
        </Sequence>
      ))}
    </>
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <HBlurDefs />
      {whipAt !== undefined ? <WhipFootage cut={whipAt}>{footage}</WhipFootage> : footage}
      {edit.stacks.map((st, i) => {
        const start = Math.min(st.t1.at, st.t2?.at ?? Infinity, st.t3?.at ?? Infinity);
        return (
          <Sequence key={`t${i}`} from={s2f(start)} durationInFrames={s2f(st.out) - s2f(start)}>
            <TextStack stack={st} start={start} />
          </Sequence>
        );
      })}
      {edit.lightLeaks.map((c, i) => (
        <Sequence key={`l${i}`} from={s2f(c) - 4} durationInFrames={10}><LightLeak /></Sequence>
      ))}
      {edit.dipToWhite !== undefined && (
        <Sequence from={s2f(edit.dipToWhite)} durationInFrames={9}><DipToWhite /></Sequence>
      )}
      {edit.logo && (
        <Sequence from={s2f(edit.logo.at)}>
          <LogoReveal word={edit.logo.word} tagline={edit.logo.tagline} accentIndex={edit.logo.accentIndex} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
