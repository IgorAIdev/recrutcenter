import type { APIRoute } from 'astro';
import { vacancies, lastUpdatedAt } from '../data/taxonomy';
import { withBase } from '../lib/paths';

/**
 * Карта сайта генерується з даних, без окремої залежності заради однієї функції.
 * Варіант Б у карту не потрапляє: він закритий від індексації.
 */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('astro.config: site не заданий — sitemap не побудувати');

  const updated = lastUpdatedAt();
  const roleGroups = [...new Set(vacancies.map((vacancy) => vacancy.roleGroup))];

  const entries = [
    { path: '/', priority: '1.0', lastmod: updated },
    { path: '/vacancies', priority: '0.9', lastmod: updated },
    ...roleGroups.map((group) => ({
      path: `/profession/${group}`,
      priority: '0.8',
      lastmod: updated,
    })),
    ...vacancies.map((vacancy) => ({
      path: `/vacancy/${vacancy.slug}`,
      priority: '0.7',
      lastmod: vacancy.updatedAt,
    })),
  ];

  const urls = entries
    .map(({ path, priority, lastmod }) => {
      const loc = new URL(withBase(path), site).href;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
