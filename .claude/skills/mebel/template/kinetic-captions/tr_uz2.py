import sys, json, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
a = np.fromfile(sys.argv[1], dtype=np.float32)
segs, _ = m.transcribe(a, word_timestamps=True, language="uz", initial_prompt=open(sys.argv[2]).read(), beam_size=5)
json.dump([{"w":w.word.strip(),"s":w.start,"e":w.end} for s in segs for w in s.words], open(sys.argv[3],"w"), ensure_ascii=False)
