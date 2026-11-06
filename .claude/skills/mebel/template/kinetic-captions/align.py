import json, re, sys
from difflib import SequenceMatcher
ww = json.load(open(sys.argv[1])); script = open(sys.argv[2]).read().split()
# merge whisper apostrophe fragments
mw=[]
for w in ww:
    if mw and (w["w"].startswith("'") or w["w"].startswith("-")): mw[-1]["w"]+=w["w"]; mw[-1]["e"]=w["e"]
    else: mw.append(dict(w))
norm=lambda s: re.sub(r"[^a-z]","",s.lower().replace("x","h").replace("q","k"))
A=[norm(w) for w in script]; B=[norm(w["w"]) for w in mw]
n,m=len(A),len(B); NEG=-1e9
sc=[[0]*(m+1) for _ in range(n+1)]; bt=[[None]*(m+1) for _ in range(n+1)]
for i in range(1,n+1): sc[i][0]=-0.4*i; bt[i][0]='u'
for j in range(1,m+1): sc[0][j]=-0.4*j; bt[0][j]='l'
for i in range(1,n+1):
    for j in range(1,m+1):
        r=SequenceMatcher(None,A[i-1],B[j-1]).ratio()
        c=[(sc[i-1][j-1]+(r*2-0.6),'d'),(sc[i-1][j]-0.4,'u'),(sc[i][j-1]-0.4,'l')]
        sc[i][j],bt[i][j]=max(c)
i,j=n,m; match={}
while i>0 and j>0:
    b=bt[i][j]
    if b=='d':
        if SequenceMatcher(None,A[i-1],B[j-1]).ratio()>0.45: match[i-1]=j-1
        i-=1;j-=1
    elif b=='u': i-=1
    else: j-=1
T=[None]*n
for k,v in match.items(): T[k]=mw[v]["s"]
# interpolate
known=[k for k in range(n) if T[k] is not None]
for k in range(n):
    if T[k] is None:
        lo=max([x for x in known if x<k],default=None); hi=min([x for x in known if x>k],default=None)
        if lo is None: T[k]=T[hi]-0.3*(hi-k)
        elif hi is None: T[k]=T[lo]+0.3*(k-lo)
        else: T[k]=T[lo]+(T[hi]-T[lo])*(k-lo)/(hi-lo)
out=[{"w":script[k],"t":round(T[k],2),"m":k in match, "heard": mw[match[k]]["w"] if k in match else ""} for k in range(n)]
json.dump(out,open(sys.argv[3],"w"),ensure_ascii=False,indent=0)
for o in out: print(f'{o["t"]:6.2f} {"*" if o["m"] else " "} {o["w"]:<18} {o["heard"]}')
