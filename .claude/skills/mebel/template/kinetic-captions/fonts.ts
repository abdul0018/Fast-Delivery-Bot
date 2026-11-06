import {staticFile, continueRender, delayRender} from 'remotion';
const faces = [
  new FontFace('Poppins', `url(${staticFile('poppins-600i.woff2')})`, {style: 'italic', weight: '600'}),
  new FontFace('Poppins', `url(${staticFile('poppins-700i.woff2')})`, {style: 'italic', weight: '700'}),
  new FontFace('Playfair Display', `url(${staticFile('playfair-400.woff2')})`, {weight: '400'}),
  new FontFace('Playfair Display', `url(${staticFile('playfair-600.woff2')})`, {weight: '600'}),
];
const h = delayRender('fonts');
Promise.all(faces.map((f) => f.load().then(() => document.fonts.add(f))))
  .catch((e) => console.error(e)).finally(() => continueRender(h));
