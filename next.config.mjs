/** @type {import('next').NextConfig} */
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://cdn.sanity.io https://*.mapbox.com https://www.google-analytics.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    worker-src blob:;
    connect-src 'self'
        https://*.mapbox.com
        https://api.mapbox.com
        https://events.mapbox.com
        https://api.open-meteo.com
        https://*.supabase.co
        wss://*.supabase.co
        https://api.anthropic.com
        https://*.sanity.io
        wss://*.sanity.io
        https://www.googletagmanager.com
        https://www.google-analytics.com
        https://*.google-analytics.com
        https://*.analytics.google.com;
    upgrade-insecure-requests;
`


const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        minimumCacheTTL: 60,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                pathname: '**',
            },
        ],
    },
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\n/g, ''),
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ]
    },
};

export default nextConfig;
