import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/login',
          '/login/',
          '/studio',
          '/api',
          '/api/',
          '/auth',
          '/auth/',
        ],
      },
    ],
    sitemap: 'https://trip2bangladesh.com/sitemap.xml',
    host: 'https://trip2bangladesh.com',
  };
}
