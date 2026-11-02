// MapLibre xarita "worker" faylini public/ ga nusxalash (bundler uni o'zi topa olmaydi). `npm run build` dan oldin ishlaydi.
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve('maplibre-gl/package.json'));
const { version } = require('maplibre-gl/package.json');
const target = join(process.cwd(), 'public', 'vendor');
mkdirSync(target, { recursive: true });
copyFileSync(join(pkgDir, 'dist', 'maplibre-gl-worker.mjs'), join(target, `maplibre-gl-worker-${version}.js`));
console.log(`maplibre worker ${version} -> public/vendor/`);
