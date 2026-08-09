import type { RegionGroup, Vacancy } from './types';
import raw from './vacancies.json';

export const vacancies = raw as Vacancy[];

/**
 * Родини спеціальностей для фільтра в героі.
 *
 * roleGroup у моделі даних — це професія, під яку робиться сторінка-хаб
 * (`/profession/[group]`). Для фільтра їх забагато, тому професії згруповані
 * в родини. Це рівень подання, а не рівень даних: у вакансії поле лишається
 * без змін.
 */
export type Family = {
  id: string;
  label: string;
  roleGroups: string[];
};

export const families: Family[] = [
  { id: 'bpla', label: 'Безпілотні системи', roleGroups: ['bpla'] },
  { id: 'reb', label: 'РЕБ і радіотехніка', roleGroups: ['reb'] },
  { id: 'pikhota', label: 'Піхота і штурм', roleGroups: ['kulemet', 'stilets', 'hranatomet', 'snaiper'] },
  { id: 'artyleriya', label: 'Артилерія', roleGroups: ['artyleriya'] },
  { id: 'tekhnika', label: 'Техніка і водіння', roleGroups: ['vodii', 'mekhanik'] },
  { id: 'zviazok', label: 'Зв’язок', roleGroups: ['zviazok'] },
  { id: 'medyk', label: 'Медицина', roleGroups: ['medyk'] },
  { id: 'saper', label: 'Інженерні війська', roleGroups: ['saper'] },
  { id: 'zabezpechennia', label: 'Забезпечення і тил', roleGroups: ['lohistyka', 'kukhar', 'kadry'] },
  { id: 'it', label: 'ІТ і кадри', roleGroups: ['it'] },
  { id: 'navchannia', label: 'Навчання та інструктаж', roleGroups: ['instruktor'] },
];

const familyByRoleGroup = new Map<string, string>();
for (const family of families) {
  for (const group of family.roleGroups) familyByRoleGroup.set(group, family.id);
}

export function familyOf(vacancy: Vacancy): string {
  return familyByRoleGroup.get(vacancy.roleGroup) ?? 'inshe';
}

export const regionGroups: { id: RegionGroup; label: string }[] = [
  { id: 'skhid', label: 'Схід' },
  { id: 'pivden', label: 'Південь' },
  { id: 'tsentr', label: 'Центр' },
  { id: 'zakhid', label: 'Захід' },
];

export const vacancyTypes: { id: Vacancy['type']; label: string }[] = [
  { id: 'combat', label: 'Бойова' },
  { id: 'support', label: 'Забезпечення' },
];

/** Скільки вакансій потрапляє в кожну родину — щоб не показувати порожні фільтри. */
export function countByFamily(list: Vacancy[] = vacancies): Map<string, number> {
  const counts = new Map<string, number>();
  for (const vacancy of list) {
    const id = familyOf(vacancy);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

export function countBy<K extends keyof Vacancy>(key: K, list: Vacancy[] = vacancies): Map<unknown, number> {
  const counts = new Map<unknown, number>();
  for (const vacancy of list) {
    counts.set(vacancy[key], (counts.get(vacancy[key]) ?? 0) + 1);
  }
  return counts;
}

export type Unit = {
  name: string;
  slug: string;
  patch: string;
  openings: number;
};

/** Унікальні підрозділи з каталогу — без дублікатів у розмітці. */
export function units(list: Vacancy[] = vacancies): Unit[] {
  const map = new Map<string, Unit>();
  for (const vacancy of list) {
    const found = map.get(vacancy.unitSlug);
    if (found) {
      found.openings += 1;
      continue;
    }
    map.set(vacancy.unitSlug, {
      name: vacancy.unit,
      slug: vacancy.unitSlug,
      patch: vacancy.unitPatch,
      openings: 1,
    });
  }
  return [...map.values()].sort((a, b) => b.openings - a.openings);
}

/** Дата останнього оновлення каталогу — для рядка «дані станом на». */
export function lastUpdatedAt(list: Vacancy[] = vacancies): string {
  return list.reduce((latest, vacancy) => (vacancy.updatedAt > latest ? vacancy.updatedAt : latest), '');
}
