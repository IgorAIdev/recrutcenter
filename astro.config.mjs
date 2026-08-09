// @ts-check
import { defineConfig } from 'astro/config';

// Статична збірка: результат кладеться на Apache, Node на сервері не потрібен.
// SITE і BASE задаються збіркою: на GitHub Pages прототип лежить у
// /recrutcenter/, на бойовому домені — в корені.
export default defineConfig({
  site: process.env.SITE ?? 'https://lfrecruiting.mil.gov.ua',
  base: process.env.BASE_PATH ?? '/',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // Один CSS-файл замість кількох запитів — важливо на слабкій мережі.
    inlineStylesheets: 'auto',
  },
});
