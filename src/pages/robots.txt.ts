import type { APIRoute } from 'astro';
import { withBase } from '../lib/paths';

export const GET: APIRoute = ({ site }) => {
  const sitemap = site ? new URL(withBase('/sitemap.xml'), site).href : '/sitemap.xml';

  const body = [
    'User-agent: *',
    'Allow: /',
    // Варіант Б — сторінка для порівняння, вона не має конкурувати з головною.
    `Disallow: ${withBase('/variant-b')}`,
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
