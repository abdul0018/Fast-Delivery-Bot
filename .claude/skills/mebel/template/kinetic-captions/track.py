import sys, json, cv2, torch, torchvision
from torchvision.models.detection import fasterrcnn_mobilenet_v3_large_fpn, FasterRCNN_MobileNet_V3_Large_FPN_Weights
w = FasterRCNN_MobileNet_V3_Large_FPN_Weights.DEFAULT
m = fasterrcnn_mobilenet_v3_large_fpn(weights=w).eval()
cap = cv2.VideoCapture(sys.argv[1]); fps = cap.get(cv2.CAP_PROP_FPS); step = int(round(fps/5))
out = []; i = 0
while True:
    ok, fr = cap.read()
    if not ok: break
    if i % step == 0:
        h, W = fr.shape[:2]
        img = cv2.resize(fr, (W//3, h//3))[:, :, ::-1].copy()
        t = torch.from_numpy(img).permute(2,0,1).float()/255
        with torch.no_grad(): r = m([t])[0]
        best = None
        for b, l, s in zip(r['boxes'], r['labels'], r['scores']):
            if l.item()==1 and s.item()>0.6:
                x0,y0,x1,y1 = (b*3).tolist(); area=(x1-x0)*(y1-y0)
                if best is None or area>best[4]: best=(x0/W,y0/h,x1/W,y1/h,area,s.item())
        out.append({"t": round(i/fps,2), "box": None if best is None else [round(v,3) for v in best[:4]], "s": None if best is None else round(best[5],2)})
    i += 1
json.dump(out, open(sys.argv[2],'w'))
print(len(out))
