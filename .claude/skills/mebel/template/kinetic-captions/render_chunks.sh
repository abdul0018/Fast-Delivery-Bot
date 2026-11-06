#!/bin/bash
cd "$(dirname "$0")"
npx remotion bundle src/index.ts --out-dir=bundle --log=error >/dev/null 2>&1 || exit 3
for r in "0-321" "322-643" "644-965" "966-1286"; do
  out="chunk_${r}.mp4"; [ -f "$out" ] && continue
  for attempt in 1 2 3; do
    npx remotion render bundle Inmoda "$out" --frames=$r --log=error --concurrency=4 --timeout=90000 --crf=16 --muted > "render_${r}.log" 2>&1 && break
    rm -f "$out"
  done
  [ -f "$out" ] || { echo "FAILED $r"; exit 2; }
  echo "done $r"
done
echo ALLDONE
