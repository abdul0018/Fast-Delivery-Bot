import subprocess
G={"impact1":0,"impact2":2,"impact3":5,"impact4":5.5,"leak_whoosh":0,"outro_hit":3}
ev=[("leak_whoosh",3.40,0.25),("impact1",8.10,0.20),("leak_whoosh",12.0,0.25),("impact2",14.80,0.20),
    ("impact3",16.55,0.20),("impact1",19.90,0.20),("impact4",21.90,0.20),("leak_whoosh",24.75,0.25),
    ("impact2",30.55,0.20),("leak_whoosh",35.65,0.25),("impact3",38.65,0.20),("outro_hit",40.60,0.25)]
inputs=["-i","/tmp/claude-0/-home-user-Fast-Delivery-Bot/9d79873b-2e53-589d-b265-4e04fc4f3193/scratchpad/job/B.mp4"]; fl=[]
fl.append("[0:a]atrim=0:40.84,asetpts=N/SR/TB,aresample=48000,highpass=f=80,afftdn=nf=-28,equalizer=f=220:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1.2:g=2.5,acompressor=threshold=-20dB:ratio=3:attack=5:release=90:makeup=2,loudnorm=I=-15:TP=-1.5:LRA=9,afade=t=out:st=40.55:d=0.25,apad=whole_dur=42.9[v]")
labels=["[v]"]
for k,(n,t,off) in enumerate(ev):
    inputs+=["-i",f"/tmp/claude-0/-home-user-Fast-Delivery-Bot/9d79873b-2e53-589d-b265-4e04fc4f3193/scratchpad/inmoda/{n}.wav"]; d=int(max(0,(t-off))*1000)
    fl.append(f"[{k+1}:a]aresample=48000,volume={G[n]}dB,adelay={d}|{d}[s{k}]"); labels.append(f"[s{k}]")
fl.append("".join(labels)+f"amix=inputs={len(labels)}:normalize=0:duration=first,alimiter=limit=0.89[out]")
subprocess.run(["ffmpeg","-v","error","-y"]+inputs+["-filter_complex",";".join(fl),"-map","[out]","-ar","48000","-ac","2","-c:a","pcm_s16le","/tmp/claude-0/-home-user-Fast-Delivery-Bot/9d79873b-2e53-589d-b265-4e04fc4f3193/scratchpad/inmoda/mix.wav"],check=True)
