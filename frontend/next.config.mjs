/**
 * Ikki rejim:
 *  - oddiy (Vercel / `next start`) — server bilan
 *  - STATIC_EXPORT=true — GitHub Pages uchun statik fayllar (`out/`), NEXT_PUBLIC_BASE_PATH="/Fast-Delivery-Bot"
 */
const staticExport = process.env.STATIC_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(staticExport
    ? {
        output: 'export',
        basePath,
        trailingSlash: true, // GitHub Pages: /catalog/ -> /catalog/index.html
      }
    : {
        // Telegram Mini App iframe ichida ochiladi — Telegram domenlariga ruxsat beramiz
        // (statik eksportda headers ishlamaydi; GitHub Pages iframe'ni o'zi taqiqlamaydi)
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                {
                  key: 'Content-Security-Policy',
                  value: "frame-ancestors 'self' https://web.telegram.org https://*.telegram.org",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
