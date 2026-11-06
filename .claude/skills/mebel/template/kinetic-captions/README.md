# Kinetic captions reel (Mode C): render notes
- Pre-render the textures: paper (`npx remotion still ... PaperLight/PaperDark`) and 8 grain PNGs (numpy noise).
  Live SVG feTurbulence at 1080×1920 made headless tabs stall.
- Fonts are local `@font-face` with **no delayRender**: a font wait hung tabs mid-render, around frame 250 every time.
- Render with `render_chunks.sh` (4 chunks, retries), then concat and mux `mix.wav` (built by `mix.py`).
