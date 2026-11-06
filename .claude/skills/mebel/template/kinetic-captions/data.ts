// Edit decision list for the Inmoda reel. All times in seconds (source = timeline, single take).
export const FPS = 30;
export const SRC_END = 40.6;      // last used source second
export const END_CARD = 40.6;     // end card start
export const TOTAL = 42.9;

export type Seg = {a: number; b: number; z0: number; z1: number; m: 'f' | 'c'; card?: boolean};
export const SEGS: Seg[] = [
  {a: 0.0, b: 3.4, z0: 1, z1: 1, m: 'f'},
  {a: 3.4, b: 8.1, z0: 1, z1: 1, m: 'c'},
  {a: 8.1, b: 12.0, z0: 1, z1: 1, m: 'f'},
  {a: 12.0, b: 14.8, z0: 1, z1: 1, m: 'f'},
  {a: 14.8, b: 16.55, z0: 1, z1: 1, m: 'c'},
  {a: 16.55, b: 19.9, z0: 1, z1: 1, m: 'c', card: true},
  {a: 19.9, b: 21.9, z0: 1, z1: 1, m: 'f'},
  {a: 21.9, b: 24.75, z0: 1, z1: 1, m: 'f'},
  {a: 24.75, b: 30.55, z0: 1, z1: 1, m: 'c'},
  {a: 30.55, b: 35.65, z0: 1, z1: 1, m: 'f'},
  {a: 35.65, b: 38.65, z0: 1, z1: 1, m: 'f'},
  {a: 38.65, b: 40.6, z0: 1, z1: 1, m: 'f'},
];
export const LEAKS = [3.4, 12.0, 24.75, 35.65, 40.6];
export const CARD = {a: 16.55, b: 19.9};

// Caption pages. style: w = white italic sans (small), g = gold serif (hero),
// s = white serif (medium), y = gold bold italic sans. r = mirrored reflection.
type W = [number, string, 'w' | 'g' | 's' | 'y', boolean?];
export const PAGES: W[][][] = [
  [[[0.0, 'Men', 'w'], [0.06, 'sizga', 'w']], [[0.28, 'maxsus', 'g']], [[0.62, 'dizaynni', 's']]],
  [[[0.9, 'ko‘rsataman', 'y']]],
  [[[1.52, 'Bu', 'w'], [1.58, 'maxsus', 'w']], [[1.86, 'dizayn', 'g']]],
  [[[2.18, 'ustida', 'w']], [[2.52, 'mohir', 'g']], [[2.96, 'ustalar', 's'], [3.1, 'ishlagan', 's']]],
  [[[3.48, 'Endi', 'w'], [3.9, 'buni', 'w']], [[4.1, 'ko‘ring', 'g']]],
  [[[4.5, 'Inmoda', 'g', true]], [[4.98, 'sizga', 'w'], [5.16, 'har', 'w'], [5.28, 'doim', 'w']]],
  [[[5.44, 'eng', 'w']], [[5.6, 'zo‘rini', 'y']], [[5.96, 'taklif', 's'], [6.3, 'etadi', 's']]],
  [[[6.54, 'bu', 'w']], [[6.94, 'dizayndagi', 's']], [[7.68, 'uyg‘unlik', 'g']]],
  [[[9.08, 'u', 'w'], [9.2, 'sizni', 'w']], [[9.52, 'uyingizga', 'y']], [[9.94, 'kirganda', 'w']]],
  [[[10.28, 'boshqa', 'w']], [[10.64, 'dunyoni', 'g']], [[10.96, 'olib', 's'], [11.2, 'kirishi', 's'], [11.46, 'aniq', 's']]],
  [[[12.0, 'Keyingi', 'w']], [[12.4, 'komplektimiz', 'y']]],
  [[[12.96, 'bu', 'w'], [13.02, 'bizani', 'w']], [[13.26, 'Luka', 'g', true]]],
  [[[13.64, 'komplektimizni', 's']], [[14.1, 'kamodi', 'g']]],
  [[[14.84, 'Hoynahoy', 'w']], [[15.12, 'bu', 's'], [15.2, 'komplektni', 's']]],
  [[[15.58, 'men', 'w'], [15.76, 'aytib', 'w']], [[16.08, 'o‘tganimdek', 's']]],
  [[[16.6, 'Pinterestda', 'g']], [[17.04, 'ko‘rgansiz', 'w']]],
  [[[17.54, 'TikToklarda', 'y']], [[18.04, 'Instagramlarda', 'y']]],
  [[[18.74, 'Ana', 'w'], [18.92, 'endi', 'w']], [[19.54, 'bemalol', 'g']]],
  [[[19.96, 'Inmodaga', 'g']], [[20.76, 'kelib', 'w'], [21.04, 'ko‘rib', 'w']]],
  [[[21.3, 'xarid', 'y']], [[21.54, 'qilsangiz', 's'], [21.74, 'bo‘ladi', 's']]],
  [[[21.92, 'Bu', 'w'], [22.18, 'komplekt', 'w'], [22.5, 'bilan', 'w']], [[22.58, 'yana', 's'], [22.82, 'nimalarni', 's']]],
  [[[22.94, 'olsam', 'w'], [23.22, 'bo‘ladi', 'w']], [[23.4, 'desiz?', 'g']]],
  [[[23.62, 'Men', 'w'], [23.68, 'sizga', 'w']], [[23.96, 'ko‘rsataman', 'y']]],
  [[[24.84, 'bu', 'w'], [24.98, 'yoqda', 'w']], [[25.1, 'bizani', 's'], [25.34, 'o‘sha', 's']], [[25.72, 'mashhur', 'g']]],
  [[[26.42, 'Luka', 'g', true]], [[26.5, 'komplekt', 'w']], [[26.94, 'stol-stulimiz', 's']]],
  [[[27.34, 'o‘n', 'y'], [27.5, 'kishilik', 'y']]],
  [[[27.8, 'va', 'w'], [28.12, 'yonida', 'w'], [28.4, 'turgan', 'w']], [[28.76, 'Riva', 'g', true]]],
  [[[29.18, 'maxsus', 'w'], [29.6, 'dizayn', 'w'], [29.92, 'bilan', 'w']], [[30.08, 'yaratilgan', 's']]],
  [[[30.58, 'Bu', 'w'], [30.76, 'komplekt', 'w']], [[31.24, 'bilan', 's'], [31.38, 'siz', 's']]],
  [[[31.6, 'o‘zini', 'w']], [[31.9, 'kamodini', 'g']], [[32.24, 'olib', 's'], [32.5, 'ketasiz', 's']]],
  [[[32.82, 'uyga', 'y']], [[33.38, 'qo‘yasiz', 's']]],
  [[[33.88, 'qo‘yishingiz', 'w'], [34.42, 'bilan', 'w']], [[34.56, 'boshqa', 'g'], [34.82, 'dunyo', 'g']], [[35.22, 'kirib', 's'], [35.3, 'qoladi', 's']]],
  [[[35.72, 'Ana', 'w'], [35.9, 'shu', 'w'], [36.1, 'payt', 'w']], [[36.36, 'Inmodauzni', 'g']], [[37.1, 'eslab', 's']]],
  [[[37.48, 'bitta', 'w']], [[37.88, 'duo', 'g']], [[38.08, 'qilib', 's'], [38.22, 'qo‘yasiz', 's']]],
  [[[38.7, 'Inmodauz', 'g', true]], [[39.1, 'har', 'w'], [39.2, 'doim', 'w'], [39.3, 'sizga', 'w']]],
  [[[39.52, 'eng', 'w']], [[39.74, 'yaxshisini', 'g']], [[39.94, 'taklif', 's'], [40.1, 'etadi', 's']]],
];
