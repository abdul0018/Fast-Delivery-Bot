// Local font fallback (download the latin woff2 subsets with curl into public/):
//   Montserrat ital 800 -> mont-italic.woff2, Montserrat 300 -> mont.woff2, Allison 400 -> allison.woff2
import {staticFile, continueRender, delayRender} from 'remotion';
const faces = [
 new FontFace('Montserrat', `url(${staticFile('mont-italic.woff2')})`, {style:'italic', weight:'800'}),
 new FontFace('Montserrat', `url(${staticFile('mont.woff2')})`, {style:'normal', weight:'300'}),
 new FontFace('Allison', `url(${staticFile('allison.woff2')})`),
];
const h = delayRender('fonts');
Promise.all(faces.map(f=>f.load().then(()=>document.fonts.add(f)))).catch(e=>console.error(e)).finally(()=>continueRender(h));
