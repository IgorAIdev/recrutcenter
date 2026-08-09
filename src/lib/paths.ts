/**
 * Шляхи з урахуванням базового префікса.
 *
 * На GitHub Pages сайт лежить не в корені домену, а в /recrutcenter/.
 * Усі абсолютні шляхи — до картинок, шевронів і внутрішніх сторінок —
 * мають проходити через цю функцію, інакше вони ведуть у порожнечу.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
