/**
 * Фільтри головної. Vanilla, без залежностей, поверх даних, відрендерених
 * у розмітку на білді. Один стан на сторінку — усі групи з однаковим `name`
 * синхронізуються між блоками.
 */

type FilterName = 'family' | 'region' | 'type';

const FILTERS: FilterName[] = ['family', 'region', 'type'];

const state: Record<FilterName, string> = { family: '', region: '', type: '' };

const grid = document.querySelector<HTMLElement>('[data-vacancy-grid]');
const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-vacancy]'));

// У блоці «Популярні вакансії» показуються перші N збігів, лічильник же
// рахує всі — тому в розмітці лежить увесь каталог, а обрізає його ліміт.
const limit = Number(grid?.dataset.limit ?? cards.length) || cards.length;
const counterValue = document.querySelector<HTMLElement>('[data-counter-value]');
const counterWord = document.querySelector<HTMLElement>('[data-counter-word]');
const emptyState = document.querySelector<HTMLElement>('[data-empty]');
const resetButtons = Array.from(document.querySelectorAll<HTMLElement>('[data-reset]'));
const catalogLabel = document.querySelector<HTMLElement>('[data-catalog-label]');
const catalogLink = document.querySelector<HTMLAnchorElement>('[data-catalog-link]');

const total = cards.length;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Українська множина: 1 позиція, 2 позиції, 5 позицій. */
function positions(count: number): string {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'позицій';
  if (mod10 === 1) return 'позиція';
  if (mod10 >= 2 && mod10 <= 4) return 'позиції';
  return 'позицій';
}

function matches(card: HTMLElement): boolean {
  return (
    (state.family === '' || card.dataset.family === state.family) &&
    (state.region === '' || card.dataset.regionGroup === state.region) &&
    (state.type === '' || card.dataset.type === state.type)
  );
}

let frame = 0;
let shown = total;

/**
 * Єдина анімація на екрані — перерахунок лічильника. Вона несе сенс:
 * показує, що за фільтрами є реальні дані.
 */
function renderCounter(next: number): void {
  if (!counterValue) return;
  cancelAnimationFrame(frame);

  if (counterWord) counterWord.textContent = positions(next);

  const from = shown;
  shown = next;

  if (reducedMotion || from === next) {
    counterValue.textContent = String(next);
    return;
  }

  const started = performance.now();
  const duration = 220;

  const step = (now: number) => {
    const progress = Math.min((now - started) / duration, 1);
    const eased = 1 - (1 - progress) * (1 - progress);
    counterValue.textContent = String(Math.round(from + (next - from) * eased));
    if (progress < 1) frame = requestAnimationFrame(step);
  };

  frame = requestAnimationFrame(step);
}

function query(): string {
  const params = new URLSearchParams();
  for (const name of FILTERS) {
    if (state[name]) params.set(name, state[name]);
  }
  const search = params.toString();
  return search ? `?${search}` : '';
}

function apply(): void {
  let visible = 0;

  for (const card of cards) {
    const ok = matches(card);
    card.hidden = !ok || visible >= limit;
    if (ok) visible += 1;
  }

  renderCounter(visible);

  const filtered = FILTERS.some((name) => state[name] !== '');

  if (emptyState) emptyState.hidden = visible > 0;

  // Скидання показується лише тоді, коли є що скидати.
  for (const button of resetButtons) {
    if (button.hasAttribute('data-reset-toggle')) button.hidden = !filtered;
  }

  if (catalogLabel) {
    catalogLabel.textContent = filtered
      ? `Переглянути ${visible} ${positions(visible)}`
      : `Усі ${total} ${positions(total)}`;
  }

  if (catalogLink) catalogLink.href = `/vacancies${query()}`;

  // Дублікати значень у прихованих полях форми — щоб GET-перехід ніс той самий вибір.
  for (const mirror of document.querySelectorAll<HTMLInputElement>('[data-filter-mirror]')) {
    const name = mirror.dataset.filterMirror as FilterName | undefined;
    if (name) mirror.value = state[name];
  }
}

function sync(name: FilterName): void {
  for (const select of document.querySelectorAll<HTMLSelectElement>(`select[data-filter="${name}"]`)) {
    if (select.value !== state[name]) select.value = state[name];
  }
  for (const chip of document.querySelectorAll<HTMLElement>(`button[data-filter="${name}"]`)) {
    chip.setAttribute('aria-pressed', String((chip.dataset.value ?? '') === state[name]));
  }
}

function set(name: FilterName, value: string): void {
  if (state[name] === value) return;
  state[name] = value;
  sync(name);
  apply();
}

for (const select of document.querySelectorAll<HTMLSelectElement>('select[data-filter]')) {
  select.addEventListener('change', () => {
    const name = select.dataset.filter as FilterName | undefined;
    if (name) set(name, select.value);
  });
}

for (const chip of document.querySelectorAll<HTMLElement>('button[data-filter]')) {
  chip.addEventListener('click', () => {
    const name = chip.dataset.filter as FilterName | undefined;
    if (name) set(name, chip.dataset.value ?? '');
  });
}

for (const button of resetButtons) {
  button.addEventListener('click', () => {
    for (const name of FILTERS) {
      state[name] = '';
      sync(name);
    }
    apply();
  });
}

// Стан приходить із адреси: посилання з реклами чи з каталогу відкриває
// головну вже з обраним фільтром. localStorage не використовується.
const params = new URLSearchParams(window.location.search);
for (const name of FILTERS) {
  const value = params.get(name);
  if (value) {
    state[name] = value;
    sync(name);
  }
}

apply();
