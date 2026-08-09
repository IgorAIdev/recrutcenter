const NBSP = ' ';

/** 100000 → «100 000». Нерозривні пробіли, щоб сума не ламалась на два рядки. */
export function money(value: number): string {
  return value.toLocaleString('uk-UA').replace(/\s/g, NBSP);
}

const MONTHS_GENITIVE = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
];

/** '2026-08-07' → «7 серпня». Рік додається, лише якщо він не поточний. */
export function shortDate(iso: string, today = new Date()): string {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  const label = `${day}${NBSP}${MONTHS_GENITIVE[month - 1]}`;
  return year === today.getFullYear() ? label : `${label} ${year}`;
}

/**
 * Українська множина: 1 позиція, 2 позиції, 5 позицій.
 * Форми передаються в порядку [одна, дві, п’ять].
 */
export function plural(count: number, forms: [string, string, string]): string {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

export function positions(count: number): string {
  return plural(count, ['позиція', 'позиції', 'позицій']);
}
