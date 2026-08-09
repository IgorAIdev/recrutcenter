export type RegionGroup = 'skhid' | 'pivden' | 'tsentr' | 'zakhid';
export type VacancyType = 'combat' | 'support';

export type Vacancy = {
  id: number;
  slug: string; // 210-oshp-kulemetnyk — замість ?id=
  role: string; // Кулеметник
  roleGroup: string; // kulemet — для сторінок-хабів за професією
  unit: string; // 210 окремий штурмовий полк
  unitSlug: string;
  unitPatch: string;

  salaryFrom: number; // НОВЕ — немає в поточній базі
  salaryNote?: string; // НОВЕ
  region: string; // НОВЕ — Донеччина
  regionGroup: RegionGroup;

  type: VacancyType;
  trainingDays?: number;
  experienceRequired: boolean;

  summary: string; // 1–2 речення, унікальні — для description і og
  duties: string[];
  requirements: string[];

  updatedAt: string; // ISO 8601, дата оновлення зі штатного розпису
};

/** Групи спеціальностей — порядок визначає порядок фільтрів у героі. */
export type RoleGroup = {
  id: string;
  label: string;
};

/** Укрупнені напрямки — якщо точну область публікувати не можна. */
export type RegionGroupMeta = {
  id: RegionGroup;
  label: string;
};
