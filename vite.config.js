import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    // Set VITE_BASE_PATH to "/your-repo-name/" for GitHub Pages project sites.
    // Leave empty ("/") for custom domains or Capacitor builds.
    var base = env.VITE_BASE_PATH || '/';
    return {
        base: base,
        resolve: {
            alias: { '@': path.resolve(__dirname, './src') },
        },
        build: {
            target: 'es2020',
            sourcemap: false,
            rollupOptions: {
                output: {
                    manualChunks: {
                        react: ['react', 'react-dom', 'react-router-dom'],
                        supabase: ['@supabase/supabase-js'],
                        query: ['@tanstack/react-query'],
                        motion: ['framer-motion'],
                    },
                },
            },
        },
        plugins: [
            react(),
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
                manifest: {
                    name: 'Nosotros',
                    short_name: 'Nosotros',
                    description: 'Nuestra app para nosotros dos.',
                    theme_color: '#e05763',
                    background_color: '#FFF8F5',
                    display: 'standalone',
                    orientation: 'portrait',
                    start_url: base,
                    scope: base,
                    icons: [
                        { src: "".concat(base, "pwa-192x192.png"), sizes: '192x192', type: 'image/png' },
                        { src: "".concat(base, "pwa-512x512.png"), sizes: '512x512', type: 'image/png' },
                        { src: "".concat(base, "pwa-maskable-512x512.png"), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                    ],
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,svg,png,ico,webp}'],
                    runtimeCaching: [
                        {
                            urlPattern: function (_a) {
                                var url = _a.url;
                                return url.origin.includes('supabase.co') && url.pathname.includes('/storage/v1/object/public');
                            },
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'supabase-images',
                                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
                                cacheableResponse: { statuses: [0, 200] },
                            },
                        },
                        {
                            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'google-fonts',
                                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                            },
                        },
                    ],
                },
            }),
        ],
        server: { port: 5173, host: true },
    };
});
