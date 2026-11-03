# Reference V1: Voiceover explainer ("Furniture Trends of 2025")

720×1280, 31.59 s, voiceover by a female presenter + soft music bed. This is the **Mode A** source.
Timestamps come from faster-whisper word timing (±40 ms), ffmpeg scene detection and 25–100 fps frame grids.

## 1. Word-by-word transcript (start time of each word, in seconds)

| # | Line | Words |
|---|---|---|
| L1 | Hottest Furniture Trends of 2025 | Hottest 0.00 · Furniture 0.50 · Trends 0.90 · of 1.46 · 2025 1.66 |
| L2 | Boucle and textured fabrics are in | Boucle 2.28 · and 3.18 · textured 3.54 · fabrics 3.90 · are 4.36 · in 4.66 |
| L3 | Sofa, chairs and cushions get soft, cozy and statement-making vibe | Sofa 4.94 · chairs 5.64 · and 5.96 · cushions 6.24 · get 6.64 · soft 6.88 · cozy 7.34 · and 7.74 · statement 8.06 · making 8.42 · vibe 8.74 |
| L4 | Curved and organic shapes are redefining modern furniture | Curved 9.14 · and 9.60 · organic 9.78 · shapes 10.10 · are 10.62 · redefining 10.86 · modern 11.40 · furniture 11.82 |
| L5 | With fluid, elegant lines that make any room feel warm and welcoming | With 12.42 · fluid 12.96 · elegant 13.34 · lines 13.74 · that 14.26 · make 14.62 · any 14.94 · room 15.28 · feel 15.56 · warm 15.78 · and 16.12 · welcoming 16.42 |
| L6 | Earthy and natural tones are trending too *(Whisper heard "Or the end"; "Earthy and" is the most likely wording)* | [Earthy] 16.88 · [and] 17.62 · … 17.82 · natural 18.00 · tones 18.32 · are 18.70 · trending 18.98 · too 19.32 |
| L7 | Creating calming, versatile spaces that can match any interior | Creating 19.70 · calming 20.28 · versatile 20.82 · spaces 21.18 · that 21.74 · can 22.16 · match 22.34 · any 22.58 · interior 22.90 |
| L8 | Upgrade your home with these trendiest pieces | Upgrade 23.46 · your 24.20 · home 24.38 · with 24.68 · these 24.92 · trendiest 25.10 · pieces 25.62 |
| L9 | Style and comfort, perfectly combined | Style 26.00 · and 26.50 · comfort 26.70 · perfectly 27.08 · combined 27.72 (speech ends ≈ 28.1) |

Delivery: about 2.9 words per second, calm and warm, a slight pause after each line. The edit breathes with the lines.

## 2. Shot list (cuts measured by scene detection)

| # | In → Out (s) | Dur | Shot | Over which words | Cut logic |
|---|---|---|---|---|---|
| 1 | 0.00 → 2.67 | 2.67 | Presenter **wide, full body**, showroom. Opens mid-motion as she steps/pans into frame from the right and settles centre by 1.0 s. | L1 (hook) | Opens on motion |
| T | 2.67 → 2.84 | ~0.3 | **Amber light leak** | gap after L1 | Hook to section |
| 2 | 2.84 → 5.06 | 2.22 | Presenter **medium, seated** on a white boucle chair, panelled wall | L2 "Boucle… are in" | She *sits on* the boucle chair, so the A-roll is the illustration |
| 3 | 5.06 → 7.02 | 1.96 | B-roll: navy sofa with grey/white cushions, slow slide | "Sofa chairs and cushions get" | Cut on **Sofa** (+0.12) |
| 4 | 7.02 → 8.16 | 1.14 | B-roll: boucle chair seat, hard window-blind shadows, top angle | "soft cozy and" | Cut on **soft** (+0.14) |
| 5 | 8.16 → 9.23 | 1.07 | B-roll: same chair, wider angle, dark moody | "statement making vibe" | Cut on **statement** (+0.10) |
| 6 | 9.23 → 12.66 | 3.43 | B-roll: curved walnut chair, presenter's hand glides along the back, she walks past, shallow DOF | L4 | Cut on **Curved** (+0.09) |
| T | 12.56 → 12.76 | ~0.2 | **Whip**: text blur-slides left, then a horizontal whip-pan into shot 7 | "With" | |
| 7 | 12.66 → 15.06 | 2.40 | Presenter **close/medium**, leaning on a wooden pillar beside a plant, talking with her hands | L5 first half | Talking head returns |
| 8 | 15.06 → 17.03 | 1.97 | B-roll: bright minimalist living room, cream sectional, wide and slow | "any room feel warm and welcoming" | Cut on **any room** (+0.12) |
| T | 17.03 → 17.20 | ~0.3 | **Amber light leak** | "Earthy" | New section |
| 9 | 17.20 → 19.95 | 2.75 | Presenter seated on a beige sofa, picks up a two-tone earthy pillow | L6 | The prop *is* the earthy tone |
| 10 | 19.95 → 21.99 | 2.04 | **Split screen**: top is a curved sofa living room, bottom is a white sectional room | "Creating calming versatile spaces" | Cut on **Creating** (+0.25) |
| 11 | 21.99 → 23.55 | 1.56 | **Split screen**: top is a black TV wall with a yellow chair, bottom is a dining area | "that can match any interior" | Both halves swap together |
| T | 23.55 → 23.72 | ~0.3 | **Amber light leak** | "Upgrade" | Into the CTA |
| 12 | 23.72 → 28.26 | 4.54 | Presenter **wide, standing** in the showroom (same setup as shot 1, bookends it) | L8 + L9 | CTA, no text |
| T | 28.26 → 28.54 | 0.28 | **Dip to white** | after "combined" | |
| 13 | 28.54 → 31.59 | 3.05 | **Logo** on white: wordmark builds out from the centre, tagline below | (music only) | Outro |

## 3. Text events (frame-accurate)

| Stack | Tier | Text | Spoken at | On screen at | Delay | Leaves |
|---|---|---|---|---|---|---|
| Title (Stack-3, left) | T1 yellow | FURNITURE | 0.50 | **0.55** | +0.05 | Rides out under the light leak at 2.67 |
| | T2 script | Trends | 0.90 | **1.00** | +0.10 | 〃 |
| | T3 thin | of 2025 | 1.46 | **1.48** | +0.02 | 〃 |
| | Scrim | bottom gradient | | 0.55 (same frame as T1) | | 〃 |
| Hero (Stack-3, left) | T1 | STATEMENT | 8.06 | **8.16** (same frame as the cut) | +0.10 | Hard cut at 9.23 |
| | T2 | Making | 8.42 | **8.52** | +0.10 | 〃 |
| | T3 | Vibe | 8.74 | **8.76** | +0.02 | 〃 |
| Category (Stack-2, centred) | T2 script (on top) | Modern | 11.40 | **11.60** | +0.20 | **Whip-blur out** 12.56 to 12.68 |
| | T1 (below) | FURNITURE | 11.82 | **11.96** | +0.14 | 〃 |

The word "Hottest" (0.00) is deliberately left off the screen; only meaning-carrying words get type.
"Boucle", "Curved", "organic", "earthy" and "versatile" get B-roll, not text.

Entrance at 100 fps: frame 0.54 shows nothing and frame 0.55 shows the full word with the scrim already on.
It is a true 1-frame pop with no scale, blur or fade.

Whip exit at 25 fps:
- 12.52: rest position.
- 12.56: block moved slightly left with a faint blur.
- 12.60: about 25% left, heavy horizontal smear.
- 12.64: about 60% left, only streaks remain.
- 12.68: gone. The background is mid whip-pan (strong horizontal blur) and lands clean on shot 7 at 12.76.

## 4. Composition measurements
- T1 yellow is RGB(251,252,7), about **#FAFA05**. Its bounding box in the title is x 66–556 and y 860–924 on a 720×1280 frame.
  That puts the left margin at 9%, the width at 68% and the cap height at 64 px (5% of height), centred on about 70% of the height.
- The script tier overhangs the right end of T1 and sits over the bottom quarter of the T1 letters.
- T3 is indented about 10% from T1's left edge and sits about 81% down the frame, slightly larger than T1.
- Scrim: mean luma of the bottom rows drops 102→91, 108→71 and 122→80 when the text appears. Rows above 62% of the frame height are unchanged.
- Stack-2 is centred: "Modern" sits at about 69% of the height (slightly right of centre) and FURNITURE at about 77%.

## 5. Light-leak anatomy (25 fps)
- 2.60: clean.
- 2.64: warm orange tint creeping in, upper left.
- 2.68: strong peach/orange wash with highlights blooming.
- 2.72: cut to shot 2, almost cream-white amber, about 85% washed out.
- 2.76 to 2.80: still washed, clearing from the bottom.
- 2.84: mostly clean, with a **red-orange vertical streak** at about 30% of the width.
- 2.88: clean.
- In total: about 7–9 frames with the cut at the peak.

## 6. Logo outro (25 fps)
- 28.26 to 28.54: footage fades to white.
- 28.54: a thin red sliver appears at the centre.
- 28.58 to 28.66: the "X" emerges, then "P" splits away to the left, so the outer letters slide apart from the centre.
- 28.70 to 29.10: the inner letters R-E-N-I fade/unmask into the gaps with a little motion blur and a red underline accent under N. Ease-out.
- 29.14: the wordmark is complete.
- 29.42 to 29.74: the tagline "FURNITURE" (wide-tracked thin caps) unmasks upward under the wordmark.
- Hold to 31.59 (about 1.85 s).
