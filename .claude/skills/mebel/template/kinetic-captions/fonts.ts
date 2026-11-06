import {staticFile} from 'remotion';
// Local @font-face only (no delayRender: a font wait hung headless tabs mid-render).
const css = `
@font-face{font-family:'Poppins';font-style:italic;font-weight:600;font-display:block;src:url(${staticFile('poppins-600i.woff2')}) format('woff2');}
@font-face{font-family:'Poppins';font-style:italic;font-weight:700;font-display:block;src:url(${staticFile('poppins-700i.woff2')}) format('woff2');}
@font-face{font-family:'Playfair Display';font-weight:400;font-display:block;src:url(${staticFile('playfair-400.woff2')}) format('woff2');}
@font-face{font-family:'Playfair Display';font-weight:600;font-display:block;src:url(${staticFile('playfair-600.woff2')}) format('woff2');}`;
if (typeof document !== 'undefined' && !document.getElementById('reel-fonts')) {
  const el = document.createElement('style'); el.id = 'reel-fonts'; el.textContent = css; document.head.appendChild(el);
  ['italic 600 40px Poppins', 'italic 700 40px Poppins', '400 40px "Playfair Display"', '600 40px "Playfair Display"'].forEach((f) => document.fonts.load(f));
}
