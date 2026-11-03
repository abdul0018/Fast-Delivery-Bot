---
name: premium-minimal-edit
description: Recreate the user's "clean, premium, minimal" short-form editing style (9:16 interior/lifestyle reels) — sparse word-synced 3-tier typography (neon-yellow heavy italic + white signature script + white thin sans), bottom scrim, hard-pop text, whip-blur exits, amber light-leak transitions, B-roll cut on the spoken noun, logo outro; plus the music-only "cinematic collage" variant. Use whenever the user says "recreate", "recreate for my video", "edit this in my style", "premium minimal style", or hands over footage/script to be edited like the reference reels.
---

# Premium Minimal Edit — style bible

Learned from the reference reels (see `references/`). When the user says **"recreate"**,
apply this file to *their* footage/script. Do not copy the reference brand, text or logo.

There are two modes. Pick by the audio:
- **Mode A — Voiceover / talking-head explainer** (has narration) → §1–§6. This is the core style.
- **Mode B — Music-only cinematic showcase** (no narration) → §7.

---

## 0. The philosophy (why it reads as "premium")

1. **Restraint.** Text appears only ~3 times in 30 s. Never full subtitles. Only the
   *hook title* and *1–2 hero phrases* get typography. Everything else is footage + voice.
2. **Words land on the voice.** Every text tier appears on the exact frame its word is spoken
   (+0 to +100 ms). Every B-roll cut lands on the noun it illustrates (+50 to +120 ms).
3. **Hard in, motion out.** Text *pops* in with zero easing (1 frame). It leaves with energy
   (whip-blur) or rides out under a transition. Never slow fades in.
4. **One loud colour.** Neon lemon yellow is the only saturated element; everything else is
   white, soft neutrals, warm wood, beige, black.
5. **Contrast of type personalities.** Heavy italic sans (loud) × thin signature script
   (elegant) × light geometric sans (calm). That 3-voice contrast *is* the look.

---

## 1. Script → edit mapping (where things go)

Process the script into beats with word timestamps (whisper word-level). Then:

| Script moment | Visual treatment |
|---|---|
| Opening hook line (topic + year/number) | Presenter wide shot, **3-tier title stack** built word by word. Bottom scrim on. |
| End of hook | **Amber light-leak transition** (~300 ms) into the first section. |
| Each new claim/item ("X is in", "Y are trending") | Cut to **B-roll of that object on the noun** ("Sofa" → cut to sofa at +0.06 s). |
| Adjective list ("soft, cozy, statement-making vibe") | One B-roll per 1–2 adjectives; put the **last, strongest phrase** in a text stack (e.g. STATEMENT / Making / Vibe). |
| Key category phrase ("modern furniture") | **2-tier centered stack** (script on top, yellow below), then **whip-blur exit** + whip-pan into the next shot. |
| Talking head returns mid-section | Medium/close presenter shot, *no text*. |
| New section ("Earthy natural tones are trending too") | **Light-leak transition** at the sentence start. |
| Plural / "any / versatile / match every…" | **Split screen** — two B-roll clips stacked 50/50 vertically; both swap together once (~every 2 s). |
| CTA ("Upgrade your home…") | Light leak → presenter wide shot, no text (let the person sell). |
| Final line | **Dip to white** (~280 ms) → **logo reveal** → hold ~2 s. |

Rhythm targets (Mode A, ~30 s): shots 1.0–3.0 s (avg ~2.3 s); ~13 shots; 3 light leaks;
1 whip; 1 split-screen; 3 text stacks; outro 3 s.

Never put text over a tight talking-head close-up. Text sits on **wide presenter shots or
B-roll with calm negative space** in the lower-middle third.

---

## 2. Design composition

Canvas 1080×1920 (refs are 720×1280; all numbers below are % of frame so they scale).

### 2.1 The three tiers
| Tier | Role | Look | Size (cap height) | Colour |
|---|---|---|---|---|
| **T1 — Keyword** | the noun/main word | Geometric sans **Black/ExtraBold Italic, ALL CAPS**, tight tracking (0 to −10). e.g. *Montserrat ExtraBold Italic*, Gilroy Black Italic, Poppins ExtraBold Italic. | **~5% of frame height** (64 px @1280 → **96 px @1920**); word width ~60–70% of frame | **#FAFA05** (neon lemon; measured 251,252,7). Very soft dark drop shadow (0 2px 6px rgba(0,0,0,.25)). |
| **T2 — Connector** | small linking word ("Trends", "Making", "Modern") | Thin monoline **signature script**, Title case, slanted. e.g. *Amsterdam / Holimount / Brittany Signature*; free Google: **Allison**, **Corinthia**, Mrs Saint Delafield. | x-height ~2% of frame, ascenders ~5% | **#FFFFFF** |
| **T3 — Finisher** | closing word ("of 2025", "Vibe") | Geometric sans **Light/ExtraLight**, sentence case, normal tracking. e.g. *Montserrat Light*, Raleway Light. | **~5.5% of frame height** — slightly *larger* than T1 | **#FFFFFF**, 90–95% opacity |

### 2.2 Layouts
**Stack-3 (left-anchored)** — used for the hook title and hero phrases:
```
 FURNITURE              ← T1, left edge at x = 9% , baseline y ≈ 72%
            Trends      ← T2, right edge ≈ T1 right edge +10% (overhangs), overlaps T1 bottom by ~25% of T1 height
   of 2025              ← T3, indented x ≈ 19%, baseline y ≈ 81%
```
**Stack-2 (centered, script-above)** — for a 2-word category phrase:
```
        Modern          ← T2, centered slightly right of center, y ≈ 69%
     FURNITURE          ← T1, centered, y ≈ 77%
```
Rules: lines are tight (leading ≈ 0.85–0.95 of T1 size, tiers *overlap*), no boxes, no
backgrounds, no emojis, no outlines. Keep bottom 15% clear (platform UI). Text block always in
the **lower-middle third (64–84% height)**.

### 2.3 Bottom scrim
A linear gradient appears **on the same frame as the first tier** and leaves with the text:
`linear-gradient(to bottom, transparent 60%, rgba(0,0,0,.35) 75%, rgba(0,0,0,.45) 100%)`.
Measured: bottom 35% of frame darkens ~30–35%, top 60% untouched.

### 2.4 Footage / colour
- Clean, bright, true-to-life grade; warm neutrals (beige, cream, walnut, black), soft
  daylight. Slight lift in blacks, gentle contrast, *no* heavy LUT in Mode A.
- Presenter: wardrobe in black/white; shot in a showroom; wide (full body), medium (seated),
  close-up (leaning on a pillar). Alternate distances on every return.
- B-roll: slow, smooth camera moves (push-in, slide, rack focus); detail shots in hard
  window light (shadows of blinds), macro textures (boucle), tidy wide room tours.
- Optional: very slow 100%→104% scale over a B-roll shot if the clip is static.

---

## 3. Animation logic (timings to recreate exactly)

All at 30 fps (refs mixed 30/100 fps). `f` = frames @30 fps.

| Animation | Timing | Feel / keyframes |
|---|---|---|
| **Text tier IN** | 1 frame (≤33 ms), no easing, no scale, no blur | Hard pop. Opacity 0→1 on a single frame. Lands at word onset +0…+100 ms. |
| **Tier stagger** | Follows the voice: measured gaps 0.44 s & 0.48 s (title), 0.36 s & 0.24 s (statement), 0.36 s (modern) | Each tier pops on *its* word. Never a fixed stagger. |
| **Scrim IN** | same frame as T1 | Hard on (or 2-frame fade). |
| **Hold** | until the next cut / transition (1.0–2.2 s after last tier) | Text is static: no float, no drift, no per-letter animation. |
| **Whip-blur OUT** | 3–4 f (~120 ms) | Text block shifts left: f1 x −4% + light blur; f2 x −25% heavy horizontal motion blur (smear ~30% width); f3 x −60%, mostly smeared; f4 gone. Ease-in (accelerating, cubic-in). Simultaneously the footage whip-pans (horizontal directional blur 2–3 f) into the next shot. |
| **Ride-out** | 0 f of its own | Text simply stays until a light-leak transition burns over it. |
| **Light-leak transition** | ~9 f (~300 ms) total | f0–4: warm orange/amber (#FF9A3C → #FFD38A) flare washes in from one side/top, screen-blended, exposure rising; cut to next shot at the peak (frame almost cream-white); f5–8: flare recedes, a thin red-orange vertical streak passes, clean by f9. |
| **Hard cut** | 0 f | Default between B-roll shots. Cut on the noun. |
| **Split-screen** | hard cut in; both halves swap simultaneously at ~2 s | Two 16:9-ish clips stacked top/bottom, no gap, no border. |
| **Dip to white** | ~8 f (280 ms) | Linear fade of footage to #FFFFFF. |
| **Logo reveal** | letters 18 f (600 ms) + pause 9 f + tagline 9 f (300 ms) | Wordmark builds *outward from the centre letter*: outer letters slide apart from center while inner letters fade/unmask in (slight motion blur), ease-out (expo). Then tagline (wide-tracked small caps) unmasks upward below it. Hold ~2 s on white, then end. |

**Motion feel:** decisive and quiet. Things appear instantly and stand still; the only fast
motion is exits and transitions. No bounces, no overshoot springs, no typewriter, no
word-by-word karaoke highlight.

---

## 4. Recreate workflow (what to do when the user says "recreate")

1. **Ingest.** `ffprobe` every clip; extract audio; transcribe with **word-level timestamps**
   (`faster-whisper`, feed 16 kHz mono PCM via ffmpeg). Mark presenter A-roll vs B-roll.
2. **Beat sheet.** Split the script into: hook / sections / CTA / sign-off. Pick *only*:
   1 hook title (Stack-3), 1–2 hero phrases (Stack-3 or Stack-2). Assign T1/T2/T3 words
   (T1 = the noun, T2 = tiny connector, T3 = number/closing word).
3. **Cut list.** For every noun in the narration that has matching B-roll, cut at
   `word.start + 0.06 s`. Shots 1–3 s. Insert light leaks at hook→section, between major
   sections, and before the CTA. One whip exit after the Stack-2 phrase. Split-screen for
   "versatile / any / every / options" lines.
4. **Build** in Remotion with `template/PremiumMinimal.tsx` (components: `TextStack`,
   `Scrim`, `LightLeak`, `WhipExit`, `SplitScreen`, `DipToWhite`, `LogoReveal`), or in
   ffmpeg/CapCut/Premiere using the numbers in §2–§3.
5. **QA.** Export, then extract frames around every text event and cut (25 fps contact
   sheets) and verify: text pop frame within +0…+3 frames of the word onset, scrim present,
   only one saturated colour, nothing in the bottom 15%, whip ≤ 4 frames, leak ≈ 9 frames.
6. Deliver 1080×1920, 30 fps, H.264 high, ~12–16 Mbps, AAC 320k, loudness ≈ −14 LUFS.

If the user only gives a script (no footage), deliver the beat sheet + cut list + text
stacks with exact timestamps, and a B-roll shot list.

---

## 5. Words → tiers cheat-sheet

| Spoken phrase | T1 (yellow) | T2 (script) | T3 (thin) | Layout |
|---|---|---|---|---|
| "Hottest furniture trends of 2025" | FURNITURE | Trends | of 2025 | Stack-3 |
| "statement-making vibe" | STATEMENT | Making | Vibe | Stack-3 |
| "modern furniture" | FURNITURE | Modern | — | Stack-2 |
| pattern | the noun / loudest word | small adjective/verb-ing/connector | year / number / last word | |

Hook rule: drop filler ("Hottest", "the") from on-screen text — show only the 2–3 words
that carry meaning.

---

## 6. Don'ts
- No full captions, no animated subtitles, no emoji, no stickers, no SFX-heavy whooshes on
  every cut (one soft whoosh on the whip and light leaks max).
- No more than one yellow word on screen. No second accent colour.
- No slow fade-ins, no bounce/scale-pop, no per-letter animation on body text.
- No text over the presenter's face; no text in top 60% (Mode A).

---

## 7. Mode B — Music-only cinematic showcase

Same premium restraint, but driven by the beat instead of the voice.

- **Grade:** filmic, faded: teal-olive shadows, amber/orange highlights (lamps glow orange),
  slightly lowered contrast and saturation, fine grain. Think "Kodak-ish warm green".
- **Tempo:** measured track ~136 BPM (beat ≈ 0.44 s). After the intro, **cut every 3 beats
  (≈1.30 s) like a metronome**, one slow-moving shot each (dolly/slide/tilt).
- **Intro (0–4.3 s), beat-driven collage:**
  - 0–0.32 s black.
  - Panels build on beats: 1/3-height horizontal strip at top (beat 1), second strip below
    (beat 2), third strip (beat 3) → three stacked clips.
  - 1.7–2.1 s: two quick full-frame shots with **chromatic aberration + defocus** (2–5 f each).
  - 2.1–3.5 s: dark **halftone-dot texture** background; rectangular photo cards (no border,
    no shadow, varied sizes) **pop on** every 0.12–0.4 s (on beats and off-beats), overlapping.
  - 3.5–4.3 s: sepia/halftone version of the hero shot, then **white translucent rectangles**
    flash in random blocks (2–3 frames each) and reveal the clean graded shot (block wipe).
- **Title (at ~4.5 s, on a beat):** centered at ~45% height.
  `Minimalist` — classic humanist serif (Optima / Marcellus / Cormorant-style), golden yellow
  **#E8BC1A**-ish, cap height ~3.5% of frame; pops in (1–2 f, tiny fade allowed).
  `INTERIOR DESIGN` — small caps serif, white, letter-spacing ~+200, ~1/3 the size,
  appears **0.2 s later** directly below. Holds ~3 s across one cut; removed on the next cut.
- **Mid transition:** one amber light leak (~5 f flash) roughly a third of the way in.
- **Ending:** hard cut to black on a beat. No logo needed.

---

## 8. Reference material
- `references/v1-voiceover-breakdown.md` — word-by-word transcript, shot list, every text
  and transition event with timestamps (Mode A source).
- `references/v2-music-breakdown.md` — beat grid, shot list, collage/title timings (Mode B).
- `references/stills/` — contact sheets of the text stacks, whip exit, light leak, split
  screen, logo outro, collage intro and serif title.
- `template/PremiumMinimal.tsx` — Remotion components implementing §2–§3.

Built from **2 reference videos** so far (V1 voiceover explainer, V2 music showcase). The user
plans ~20. When new reference videos arrive, analyse them the same way and append findings here
(keep the measured numbers; note where a new ref contradicts an old one).
