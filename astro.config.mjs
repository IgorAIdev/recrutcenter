// @ts-check
import { defineConfig } from 'astro/config';

// Статична збірка: результат кладеться на Apache, Node на сервері не потрібен.
export default defineConfig({
  site: 'https://lfrecruiting.mil.gov.ua',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // Один CSS-файл замість кількох запитів — важливо на слабкій мережі.
    inlineStylesheets: 'auto',
  },
});
