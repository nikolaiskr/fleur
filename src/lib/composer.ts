// Локальный композитор букета: реализует ту же логику, что задана
// в SYSTEM_PROMPT, но без внешнего API. Используется как fallback,
// когда VITE_DEEPSEEK_API_KEY не задан или API недоступен.

import { z } from 'zod'
import type { Composition, CompositionFlower, CompositionStyle, Flower, FormData } from '@/types'
import { CATALOG, FLOWER_BY_ID, currentSeason } from './catalog'
import { rngFrom, pick, range } from './rng'

export const CompositionSchema = z.object({
  vibe_summary: z.string().max(220),
  mood_tags: z.array(z.string()).min(2).max(6),
  flowers: z
    .array(
      z.object({
        flower_id: z.string(),
        quantity: z.number().int().min(1).max(51),
        reason: z.string(),
      }),
    )
    .min(3)
    .max(7),
  palette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).min(2).max(4),
  composition_style: z.enum(['раскидистый', 'компактный', 'каскадный', 'моно', 'полевой']),
  total_cost: z.number().nonnegative(),
  caption: z.string(),
  florist_note: z.string(),
})

/* ── 1. Вайб: из анкеты → mood-теги ────────────────────── */

const KEYWORD_TAGS: Array<[RegExp, string[]]> = [
  [/минимализм|архитект|scandi|сканди/i, ['минимализм']],
  [/кофе|книг|чита|писа|журнал/i, ['уют', 'мечтательность']],
  [/спорт|бег|тренир|марафон|зал/i, ['сила', 'энергия']],
  [/йог|медита|психолог/i, ['спокойствие']],
  [/путешеств|travel|горы|поход/i, ['свобода', 'полевой']],
  [/музык|пианино|скрипк|по[её]т/i, ['романтика', 'драма']],
  [/рис|дизайн|арт|иллюстрац|фотограф/i, ['яркость', 'воздушность']],
  [/врач|учитель|преподав|няня|воспитат/i, ['нежность', 'тёплота']],
  [/программист|it\b|разработ|аналитик|данн/i, ['минимализм', 'спокойствие']],
  [/сад|цветы|огород|растени/i, ['полевой', 'весна']],
  [/готов|кухн|выпечк|кондитер/i, ['уют', 'тёплота']],
  [/танц|балет|театр|актрис/i, ['драма', 'романтика']],
  [/море|океан|плаван|сёрф/i, ['прохлада', 'свобода']],
  [/кошк|собак|питом/i, ['нежность', 'уют']],
]

const ROLE_TAGS: Record<string, string[]> = {
  девушка: ['романтика'],
  жена: ['романтика', 'тёплота'],
  мама: ['тёплота', 'нежность'],
  сестра: ['радость', 'дружба'],
  подруга: ['радость', 'дружба'],
  коллега: ['минимализм', 'сила'],
  crush: ['романтика', 'нежность'],
  дочь: ['нежность', 'радость'],
}

const NAME_VIBES = [
  'тихая уверенность и вкус к простым вещам',
  'свет, который замечают, только когда рядом',
  'мягкий характер с твёрдым стержнем',
  'смеётся так, что хочется слушать ещё',
  'из тех, кто замечает свет в окне, а не толпу на улице',
  'внутренняя тишина и редкое чувство вкуса',
  'тепло, которое не нужно объяснять',
  'лёгкость, за которой стоит сила',
]

function inferTags(form: FormData, rng: () => number): string[] {
  const tags = new Set<string>()
  ;(ROLE_TAGS[form.role] ?? ['нежность']).forEach((t) => tags.add(t))
  for (const [re, ts] of KEYWORD_TAGS) {
    if (re.test(form.about)) ts.forEach((t) => tags.add(t))
  }
  if (form.age <= 24) tags.add(pick(rng, ['радость', 'весна']))
  else if (form.age <= 40) tags.add('романтика')
  else if (form.age <= 60) tags.add('тёплота')
  else tags.add(pick(rng, ['уют', 'винтаж']))
  if (tags.size < 3) tags.add(pick(rng, ['нежность', 'спокойствие', 'воздушность']))
  return [...tags].slice(0, 5)
}

/* ── 2. Подбор цветов ──────────────────────────────────── */

function scoreFlower(f: Flower, tags: string[], season: string, rng: () => number): number {
  let s = f.mood_tags.filter((t) => tags.includes(t)).length * 3
  if (f.season === 'all' || f.season === season) s += 2
  s += range(rng, 0, 1.4)
  return s
}

function selectFlowers(form: FormData, tags: string[], rng: () => number): Flower[] {
  const season = currentSeason()
  const scored = CATALOG.map((f) => ({ f, s: scoreFlower(f, tags, season, rng) }))
    .sort((a, b) => b.s - a.s)

  const chosen: Flower[] = []
  const push = (f: Flower) => {
    if (!chosen.some((c) => c.id === f.id)) chosen.push(f)
  }

  // Любимые цветы — святое: минимум один обязательно
  for (const id of form.favorites) {
    const f = FLOWER_BY_ID[id]
    if (f) push(f)
  }

  // Минимум одна зелень
  const green = scored.find((x) => x.f.size === 'greenery')
  if (green) push(green.f)

  // Добираем до 5–7 видов с верха рейтинга, максимум 2 зелени
  for (const { f } of scored) {
    if (chosen.length >= 5 + Math.floor(range(rng, 0, 3))) break
    if (f.size === 'greenery' && chosen.filter((c) => c.size === 'greenery').length >= 2) continue
    push(f)
  }

  // Если любимых было много — урезаем, но любимые оставляем
  while (chosen.length > 7) {
    const idx = chosen.findIndex((c) => !form.favorites.includes(c.id) && c.size !== 'greenery')
    if (idx === -1) break
    chosen.splice(idx, 1)
  }
  return chosen.slice(0, 7)
}

/* ── 3. Бюджет → количество стеблей ────────────────────── */

function allocate(flowers: Flower[], budget: number, rng: () => number): CompositionFlower[] {
  const baseQty = (f: Flower) =>
    f.size === 'large' ? 2 : f.size === 'medium' ? 3 : f.size === 'small' ? 3 : 2

  const items = flowers.map((f) => ({ f, quantity: baseQty(f) }))
  let total = items.reduce((s, i) => s + i.quantity * i.f.price_per_stem, 0)

  // Если уже не влезаем — урезаем самые дорогие
  let guard = 0
  while (total > budget && guard++ < 60) {
    const sorted = [...items].sort((a, b) => b.f.price_per_stem - a.f.price_per_stem)
    const victim = sorted.find((i) => i.quantity > 1)
    if (!victim) break
    victim.quantity -= 1
    total -= victim.f.price_per_stem
  }

  // Добавляем стебли, пока бюджет позволяет (цель — 85–98% бюджета)
  const target = budget * 0.94
  guard = 0
  const order = [...items].sort(() => range(rng, -1, 1))
  while (total < target && guard++ < 120) {
    const cand = order[guard % order.length]
    const maxQty = cand.f.size === 'large' ? 9 : cand.f.size === 'greenery' ? 8 : 12
    if (cand.quantity >= maxQty) continue
    if (total + cand.f.price_per_stem > budget) {
      const cheaper = order.find(
        (i) => i.quantity < 12 && total + i.f.price_per_stem <= budget,
      )
      if (!cheaper) break
      cheaper.quantity += 1
      total += cheaper.f.price_per_stem
    } else {
      cand.quantity += 1
      total += cand.f.price_per_stem
    }
  }

  return items.map(({ f, quantity }) => ({
    flower_id: f.id,
    quantity,
    reason: reasonFor(f),
  }))
}

function reasonFor(f: Flower): string {
  const reasons: Record<string, string> = {
    large: `${f.name_ru} — центр композиции: ${f.meaning.toLowerCase()}.`,
    medium: `${f.name_ru} задаёт характер букета: ${f.meaning.toLowerCase()}.`,
    small: `${f.name_ru} добавляет деталь и воздух: ${f.meaning.toLowerCase()}.`,
    greenery: `${f.name_ru} собирает букет воедино: ${f.meaning.toLowerCase()}.`,
  }
  return reasons[f.size]
}

/* ── 4. Слова: vibe, caption, note ─────────────────────── */

const CAPTIONS: Record<string, string[]> = {
  мама: [
    'Мама, это не просто цветы — это всё, что я не успеваю говорить каждый день.',
    'Спасибо, что у тебя я научился(лась) замечать красоту. Этот букет — отзвук твоего тепла.',
  ],
  жена: [
    'Столько лет вместе, а я всё ещё подбираю слова. Пусть вместо них говорят цветы.',
    'Ты — мой дом. А это — маленький сад для него.',
  ],
  девушка: [
    'Пусть этот букет будет намёком: я думаю о тебе чаще, чем признаюсь.',
    'Ты говорила, что любишь простые знаки внимания. Вот один — собранный специально под тебя.',
  ],
  crush: [
    'Я долго не решался(ась) это сказать, поэтому пусть скажут цветы.',
    'Этот букет собран так, словно я знаю тебя давно. Может, проверим?',
  ],
  сестра: [
    'Ты знаешь обо мне всё — и всё равно со мной дружишь. Это того стоит.',
    'Сёстры не выбирают, но я бы выбрал(а) тебя. Дважды.',
  ],
  подруга: [
    'За все наши разговоры до утра и смех не вовремя — спасибо. Держи немного красоты.',
    'Хорошая подруга редкость. Ты — мой редкий сорт.',
  ],
  коллега: [
    'Работать рядом с тобой — заметно легче. Этот букет — без повода, просто в благодарность.',
    'Пусть на твоём столе будет место чему-то живому, кроме дедлайнов.',
  ],
  дочь: [
    'Ты выросла быстрее, чем я успел(а) заметить. Но для меня ты всегда — самое нежное чудо.',
    'Пусть у тебя всегда будет повод улыбнуться. Начни с этого букета.',
  ],
}

const STYLE_BY_TAG: Array<[string, CompositionStyle]> = [
  ['полевой', 'полевой'],
  ['минимализм', 'моно'],
  ['драма', 'каскадный'],
  ['романтика', 'раскидистый'],
]

export function localCompose(form: FormData, seedSuffix = ''): Composition {
  const rng = rngFrom(`compose:${form.name}:${form.role}:${seedSuffix || form.about}`)
  const tags = inferTags(form, rng)
  const flowers = selectFlowers(form, tags, rng)
  const items = allocate(flowers, form.budget, rng)
  const total = items.reduce((s, i) => s + i.quantity * FLOWER_BY_ID[i.flower_id].price_per_stem, 0)

  // Палитра из выбранных цветов
  const bloomColors = flowers.filter((f) => f.size !== 'greenery').flatMap((f) => f.colors)
  const palette = [...new Set(bloomColors)].slice(0, 3)
  while (palette.length < 3) palette.push(pick(rng, ['#E8AEB7', '#F5E6D3', '#8FA98F']))

  const style = (STYLE_BY_TAG.find(([t]) => tags.includes(t))?.[1] ?? 'компактный') as CompositionStyle

  const vibe = pick(rng, NAME_VIBES)
  const vibeSummary = `${form.name} — ${vibe}. Букет собран в настроении: ${tags.slice(0, 3).join(', ')}.`
  const caption = pick(rng, CAPTIONS[form.role] ?? CAPTIONS['подруга'])
  const hero = flowers.find((f) => form.favorites.includes(f.id)) ?? flowers.find((f) => f.size === 'large') ?? flowers[0]
  const floristNote = `${hero.name_ru} здесь не случайно: ${hero.meaning.toLowerCase()} — и это ровно про неё.`

  return {
    vibe_summary: vibeSummary.slice(0, 200),
    mood_tags: tags,
    flowers: items,
    palette,
    composition_style: style,
    total_cost: total,
    caption,
    florist_note: floristNote,
  }
}
