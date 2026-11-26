import type { Flower, Season } from '@/types'

// Каталог «Флёр» — seed-данные. Без холодной экзотики: только цветы,
// которые реально стоят на витрине хорошей городской мастерской.
export const CATALOG: Flower[] = [
  // ── Розы ──────────────────────────────────────────────
  { id: 'rose_red', name_ru: 'Роза красная', name_latin: 'Rosa «Grand Prix»', category: 'розы', colors: ['#B23A48', '#8E2A38'], season: 'all', mood_tags: ['страсть', 'драма', 'романтика'], price_per_stem: 350, meaning: 'Глубокая любовь и уважение', shape: 'rose', size: 'large' },
  { id: 'rose_pink', name_ru: 'Роза розовая', name_latin: 'Rosa «Sweet Avalanche»', category: 'розы', colors: ['#E8AEB7', '#D48C99'], season: 'all', mood_tags: ['нежность', 'романтика'], price_per_stem: 340, meaning: 'Симпатия и восхищение', shape: 'rose', size: 'large' },
  { id: 'rose_white', name_ru: 'Роза белая', name_latin: 'Rosa «Mondial»', category: 'розы', colors: ['#F7F3EC', '#EDE4D6'], season: 'all', mood_tags: ['нежность', 'минимализм', 'чистота'], price_per_stem: 340, meaning: 'Чистота и новые начинания', shape: 'rose', size: 'large', neutral: true },
  { id: 'rose_peach', name_ru: 'Роза персиковая', name_latin: 'Rosa «Peach Avalanche»', category: 'розы', colors: ['#F4C2A1', '#EAA984'], season: 'all', mood_tags: ['нежность', 'тёплота', 'романтика'], price_per_stem: 340, meaning: 'Благодарность и искренность', shape: 'rose', size: 'large' },
  { id: 'rose_spray', name_ru: 'Роза кустовая', name_latin: 'Rosa spray «Bombastic»', category: 'розы', colors: ['#EFB7C8', '#E39EB5'], season: 'all', mood_tags: ['нежность', 'воздушность'], price_per_stem: 300, meaning: 'Лёгкость и очарование', shape: 'rose', size: 'medium' },
  { id: 'rose_garden', name_ru: 'Роза пионовидная', name_latin: 'Rosa «Juliet»', category: 'розы', colors: ['#F2B8A0', '#E8A58C'], season: 'all', mood_tags: ['романтика', 'роскошь', 'нежность'], price_per_stem: 480, meaning: 'Любовь с первого взгляда', shape: 'peony', size: 'large' },

  // ── Пионы ─────────────────────────────────────────────
  { id: 'peony_pink', name_ru: 'Пион розовый', name_latin: 'Paeonia «Sarah Bernhardt»', category: 'пионы', colors: ['#F0B9C8', '#E49FB4'], season: 'summer', mood_tags: ['романтика', 'нежность', 'роскошь'], price_per_stem: 650, meaning: 'Счастливая любовь и благополучие', shape: 'peony', size: 'large' },
  { id: 'peony_coral', name_ru: 'Пион коралловый', name_latin: 'Paeonia «Coral Charm»', category: 'пионы', colors: ['#F29E8E', '#E88170'], season: 'summer', mood_tags: ['яркость', 'романтика', 'драма'], price_per_stem: 700, meaning: 'Страсть и удача', shape: 'peony', size: 'large' },
  { id: 'peony_white', name_ru: 'Пион белый', name_latin: 'Paeonia «Duchesse de Nemours»', category: 'пионы', colors: ['#FBF6EE', '#F0E7D8'], season: 'summer', mood_tags: ['нежность', 'минимализм'], price_per_stem: 650, meaning: 'Чистые чувства', shape: 'peony', size: 'large', neutral: true },

  // ── Тюльпаны ──────────────────────────────────────────
  { id: 'tulip_pink', name_ru: 'Тюльпан розовый', name_latin: 'Tulipa «Pink Impression»', category: 'тюльпаны', colors: ['#EEA5BC', '#E28AA6'], season: 'spring', mood_tags: ['нежность', 'весна', 'романтика'], price_per_stem: 180, meaning: 'Забота и хорошее отношение', shape: 'tulip', size: 'medium' },
  { id: 'tulip_yellow', name_ru: 'Тюльпан жёлтый', name_latin: 'Tulipa «Strong Gold»', category: 'тюльпаны', colors: ['#F5C84C', '#EDB52E'], season: 'spring', mood_tags: ['радость', 'весна', 'солнце'], price_per_stem: 170, meaning: 'Улыбка и солнечное настроение', shape: 'tulip', size: 'medium' },
  { id: 'tulip_white', name_ru: 'Тюльпан белый', name_latin: 'Tulipa «White Dream»', category: 'тюльпаны', colors: ['#FAF6EF', '#EFE8DA'], season: 'spring', mood_tags: ['минимализм', 'нежность', 'весна'], price_per_stem: 170, meaning: 'Чистота помыслов', shape: 'tulip', size: 'medium', neutral: true },
  { id: 'tulip_parrot', name_ru: 'Тюльпан махровый', name_latin: 'Tulipa «Double Princess»', category: 'тюльпаны', colors: ['#E98FB0', '#DD769B'], season: 'spring', mood_tags: ['драма', 'яркость', 'весна'], price_per_stem: 230, meaning: 'Яркое признание', shape: 'peony', size: 'medium' },

  // ── Ранункулюсы ───────────────────────────────────────
  { id: 'ranunculus_pink', name_ru: 'Ранункулюс розовый', name_latin: 'Ranunculus asiaticus', category: 'ранункулюсы', colors: ['#F0ABC0', '#E692AC'], season: 'spring', mood_tags: ['нежность', 'романтика'], price_per_stem: 320, meaning: 'Очарование и привязанность', shape: 'ranunculus', size: 'medium' },
  { id: 'ranunculus_white', name_ru: 'Ранункулюс белый', name_latin: 'Ranunculus «Aviv White»', category: 'ранункулюсы', colors: ['#FBF7F0', '#F2EADD'], season: 'spring', mood_tags: ['минимализм', 'нежность'], price_per_stem: 320, meaning: 'Ты прекрасна без прикрас', shape: 'ranunculus', size: 'medium', neutral: true },
  { id: 'ranunculus_orange', name_ru: 'Ранункулюс оранжевый', name_latin: 'Ranunculus «Elegance Salmon»', category: 'ранункулюсы', colors: ['#F2A56F', '#EB8F52'], season: 'spring', mood_tags: ['яркость', 'тёплота'], price_per_stem: 330, meaning: 'Энергия и вдохновение', shape: 'ranunculus', size: 'medium' },

  // ── Эустома / лизиантус ───────────────────────────────
  { id: 'eustoma_white', name_ru: 'Эустома белая', name_latin: 'Eustoma grandiflorum', category: 'эустома', colors: ['#FAF7F1', '#F0EADD'], season: 'all', mood_tags: ['нежность', 'минимализм', 'воздушность'], price_per_stem: 280, meaning: 'Спокойная уверенность', shape: 'daisy', size: 'medium', neutral: true },
  { id: 'eustoma_lilac', name_ru: 'Эустома сиреневая', name_latin: 'Eustoma «Rosita Lilac»', category: 'эустома', colors: ['#C9A9D4', '#B690C6'], season: 'all', mood_tags: ['нежность', 'мечтательность'], price_per_stem: 280, meaning: 'Восхищение и доброта', shape: 'daisy', size: 'medium' },
  { id: 'lisianthus_pink', name_ru: 'Лизиантус розовый', name_latin: 'Lisianthus «Mariachi Pink»', category: 'лизиантус', colors: ['#EFB4C6', '#E59DB4'], season: 'all', mood_tags: ['романтика', 'нежность'], price_per_stem: 300, meaning: 'Признательность', shape: 'daisy', size: 'medium' },

  // ── Гортензия ─────────────────────────────────────────
  { id: 'hydrangea_blue', name_ru: 'Гортензия голубая', name_latin: 'Hydrangea macrophylla', category: 'гортензия', colors: ['#A9C3E0', '#8FADD2'], season: 'summer', mood_tags: ['воздушность', 'минимализм', 'прохлада'], price_per_stem: 700, meaning: 'Искренность и понимание', shape: 'hydrangea', size: 'large' },
  { id: 'hydrangea_pink', name_ru: 'Гортензия розовая', name_latin: 'Hydrangea «Pink Cloud»', category: 'гортензия', colors: ['#E7B7C9', '#DBA0B7'], season: 'summer', mood_tags: ['нежность', 'романтика'], price_per_stem: 700, meaning: 'Сердечность', shape: 'hydrangea', size: 'large' },

  // ── Герберы ───────────────────────────────────────────
  { id: 'gerbera_orange', name_ru: 'Гербера оранжевая', name_latin: 'Gerbera jamesonii', category: 'герберы', colors: ['#F09A4B', '#E9822F'], season: 'all', mood_tags: ['радость', 'яркость', 'сила'], price_per_stem: 200, meaning: 'Солнечный характер', shape: 'daisy', size: 'medium' },
  { id: 'gerbera_red', name_ru: 'Гербера красная', name_latin: 'Gerbera «Red Explosion»', category: 'герберы', colors: ['#C94F4F', '#B23B3B'], season: 'all', mood_tags: ['драма', 'сила', 'яркость'], price_per_stem: 200, meaning: 'Увлечённость', shape: 'daisy', size: 'medium' },
  { id: 'gerbera_cream', name_ru: 'Гербера кремовая', name_latin: 'Gerbera «Cream Spring»', category: 'герберы', colors: ['#F6E7CE', '#EFD9B8'], season: 'all', mood_tags: ['нежность', 'тёплота'], price_per_stem: 190, meaning: 'Доброта', shape: 'daisy', size: 'medium', neutral: true },

  // ── Хризантемы ────────────────────────────────────────
  { id: 'chrysanthemum_white', name_ru: 'Хризантема белая', name_latin: 'Chrysanthemum «Baltica»', category: 'хризантемы', colors: ['#FAF6EE', '#F1EADB'], season: 'autumn', mood_tags: ['минимализм', 'спокойствие'], price_per_stem: 220, meaning: 'Правда и долголетие', shape: 'pompom', size: 'medium', neutral: true },
  { id: 'chrysanthemum_spray', name_ru: 'Хризантема кустовая', name_latin: 'Chrysanthemum «Santini»', category: 'хризантемы', colors: ['#F2D388', '#ECC565'], season: 'autumn', mood_tags: ['радость', 'тёплота'], price_per_stem: 240, meaning: 'Дружба и оптимизм', shape: 'pompom', size: 'small' },
  { id: 'chrysanthemum_bronze', name_ru: 'Хризантема бронзовая', name_latin: 'Chrysanthemum «Copper»', category: 'хризантемы', colors: ['#C98A5A', '#B87847'], season: 'autumn', mood_tags: ['осень', 'драма', 'уют'], price_per_stem: 230, meaning: 'Зрелая красота', shape: 'pompom', size: 'medium' },

  // ── Ромашки и полевые ─────────────────────────────────
  { id: 'chamomile', name_ru: 'Ромашка', name_latin: 'Leucanthemum vulgare', category: 'полевые', colors: ['#FDFBF5', '#F5F1E6'], season: 'summer', mood_tags: ['полевой', 'нежность', 'простота'], price_per_stem: 120, meaning: 'Невинность и верность', shape: 'daisy', size: 'small', neutral: true },
  { id: 'cornflower', name_ru: 'Василёк', name_latin: 'Centaurea cyanus', category: 'полевые', colors: ['#5B7FC4', '#466BB0'], season: 'summer', mood_tags: ['полевой', 'свобода', 'простота'], price_per_stem: 130, meaning: 'Верность и доверие', shape: 'cornflower', size: 'small' },
  { id: 'poppy', name_ru: 'Мак', name_latin: 'Papaver rhoeas', category: 'полевые', colors: ['#D9534F', '#C43D3A'], season: 'summer', mood_tags: ['полевой', 'драма', 'яркость'], price_per_stem: 200, meaning: 'Мечты и воображение', shape: 'poppy', size: 'medium' },
  { id: 'sunflower', name_ru: 'Подсолнух', name_latin: 'Helianthus annuus', category: 'полевые', colors: ['#F2B93B', '#E8A91F'], season: 'summer', mood_tags: ['радость', 'солнце', 'сила'], price_per_stem: 280, meaning: 'Обожание и жизнелюбие', shape: 'sunflower', size: 'large' },
  { id: 'wheat', name_ru: 'Колоски пшеницы', name_latin: 'Triticum aestivum', category: 'полевые', colors: ['#E0C084', '#D2AE6C'], season: 'autumn', mood_tags: ['полевой', 'уют', 'осень'], price_per_stem: 90, meaning: 'Достаток и тепло дома', shape: 'wheat', size: 'greenery' },

  // ── Лаванда и ароматные ───────────────────────────────
  { id: 'lavender', name_ru: 'Лаванда', name_latin: 'Lavandula angustifolia', category: 'ароматные', colors: ['#9A86C4', '#8672B4'], season: 'summer', mood_tags: ['спокойствие', 'полевой', 'мечтательность'], price_per_stem: 150, meaning: 'Спокойствие и преданность', shape: 'spike', size: 'small' },
  { id: 'freesia', name_ru: 'Фрезия', name_latin: 'Freesia refracta', category: 'ароматные', colors: ['#F9F3E3', '#F3E8CF'], season: 'spring', mood_tags: ['нежность', 'аромат', 'весна'], price_per_stem: 260, meaning: 'Доверие и свежесть', shape: 'spike', size: 'small', neutral: true },
  { id: 'hyacinth', name_ru: 'Гиацинт', name_latin: 'Hyacinthus orientalis', category: 'ароматные', colors: ['#8FA8D8', '#7994CC'], season: 'spring', mood_tags: ['весна', 'аромат', 'радость'], price_per_stem: 240, meaning: 'Постоянство чувств', shape: 'spike', size: 'medium' },
  { id: 'matthiola', name_ru: 'Маттиола', name_latin: 'Matthiola incana', category: 'ароматные', colors: ['#E8C5D5', '#DCABC2'], season: 'all', mood_tags: ['аромат', 'нежность', 'винтаж'], price_per_stem: 280, meaning: 'Вечная красота', shape: 'spike', size: 'medium' },

  // ── Высокие и драматичные ─────────────────────────────
  { id: 'delphinium', name_ru: 'Дельфиниум', name_latin: 'Delphinium elatum', category: 'высокие', colors: ['#7B9BD6', '#6486C6'], season: 'summer', mood_tags: ['сила', 'свобода', 'драма'], price_per_stem: 380, meaning: 'Лёгкость бытия и большие планы', shape: 'spike', size: 'large' },
  { id: 'gladiolus', name_ru: 'Гладиолус', name_latin: 'Gladiolus hortulanus', category: 'высокие', colors: ['#E88CA0', '#DC7289'], season: 'autumn', mood_tags: ['сила', 'драма'], price_per_stem: 260, meaning: 'Сила характера', shape: 'spike', size: 'large' },
  { id: 'iris', name_ru: 'Ирис', name_latin: 'Iris germanica', category: 'высокие', colors: ['#6E7FC0', '#5A6CAD'], season: 'spring', mood_tags: ['мудрость', 'минимализм', 'сила'], price_per_stem: 250, meaning: 'Мудрость и надежда', shape: 'iris', size: 'medium' },

  // ── Нежные мелкие ─────────────────────────────────────
  { id: 'gypsophila', name_ru: 'Гипсофила', name_latin: 'Gypsophila paniculata', category: 'мелкие', colors: ['#FBFAF5', '#F3F1E8'], season: 'all', mood_tags: ['воздушность', 'нежность', 'минимализм'], price_per_stem: 180, meaning: 'Вечная любовь, лёгкость', shape: 'cloud', size: 'greenery', neutral: true },
  { id: 'statice', name_ru: 'Статица', name_latin: 'Limonium sinuatum', category: 'мелкие', colors: ['#A78BC9', '#9375B8'], season: 'all', mood_tags: ['винтаж', 'спокойствие'], price_per_stem: 160, meaning: 'Память и постоянство', shape: 'cloud', size: 'greenery' },
  { id: 'scabiosa', name_ru: 'Скабиоза', name_latin: 'Scabiosa atropurpurea', category: 'мелкие', colors: ['#B49BCF', '#A186C0'], season: 'summer', mood_tags: ['полевой', 'нежность'], price_per_stem: 220, meaning: 'Тонкость души', shape: 'pompom', size: 'small' },
  { id: 'aster', name_ru: 'Астра', name_latin: 'Aster novi-belgii', category: 'мелкие', colors: ['#B78FD1', '#A579C2'], season: 'autumn', mood_tags: ['осень', 'нежность', 'винтаж'], price_per_stem: 180, meaning: 'Элегантность и любовь', shape: 'daisy', size: 'small' },
  { id: 'alstroemeria', name_ru: 'Альстромерия', name_latin: 'Alstroemeria aurantiaca', category: 'мелкие', colors: ['#F2A3B3', '#EA8CA0'], season: 'all', mood_tags: ['дружба', 'радость'], price_per_stem: 180, meaning: 'Дружба и поддержка', shape: 'daisy', size: 'small' },
  { id: 'carnation', name_ru: 'Гвоздика', name_latin: 'Dianthus caryophyllus', category: 'мелкие', colors: ['#E57B93', '#DA6681'], season: 'all', mood_tags: ['сила', 'винтаж'], price_per_stem: 150, meaning: 'Гордость и восхищение', shape: 'pompom', size: 'medium' },
  { id: 'craspedia', name_ru: 'Краспедия', name_latin: 'Craspedia globosa', category: 'мелкие', colors: ['#F0C33C', '#E5B224'], season: 'all', mood_tags: ['минимализм', 'радость', 'характер'], price_per_stem: 190, meaning: 'Хорошие новости', shape: 'ball', size: 'small' },
  { id: 'anemone', name_ru: 'Анемон', name_latin: 'Anemone coronaria', category: 'мелкие', colors: ['#F5F0E8', '#ECE4D6'], season: 'spring', mood_tags: ['минимализм', 'драма', 'нежность'], price_per_stem: 350, meaning: 'Ожидание и искренность', shape: 'poppy', size: 'medium', neutral: true },

  // ── Сезонные крупные ──────────────────────────────────
  { id: 'dahlia', name_ru: 'Георгин', name_latin: 'Dahlia variabilis', category: 'сезонные', colors: ['#D97A8E', '#C9647B'], season: 'autumn', mood_tags: ['осень', 'драма', 'яркость'], price_per_stem: 300, meaning: 'Величие и благодарность', shape: 'pompom', size: 'large' },
  { id: 'narcissus', name_ru: 'Нарцисс', name_latin: 'Narcissus poeticus', category: 'сезонные', colors: ['#F7E9B8', '#F2DE9A'], season: 'spring', mood_tags: ['весна', 'радость', 'солнце'], price_per_stem: 160, meaning: 'Новое начало', shape: 'narcissus', size: 'medium' },

  // ── Зелень ────────────────────────────────────────────
  { id: 'eucalyptus', name_ru: 'Эвкалипт', name_latin: 'Eucalyptus cinerea', category: 'зелень', colors: ['#8FA98F', '#7B967B'], season: 'all', mood_tags: ['минимализм', 'спокойствие', 'прохлада'], price_per_stem: 200, meaning: 'Защита и свежесть', shape: 'eucalyptus', size: 'greenery' },
  { id: 'pistach', name_ru: 'Писташ', name_latin: 'Pistacia lentiscus', category: 'зелень', colors: ['#6E8F5E', '#5C7C4E'], season: 'all', mood_tags: ['полевой', 'характер'], price_per_stem: 250, meaning: 'Стойкость', shape: 'branch', size: 'greenery' },
  { id: 'fern', name_ru: 'Папоротник', name_latin: 'Nephrolepis exaltata', category: 'зелень', colors: ['#5E8A5A', '#4C7649'], season: 'all', mood_tags: ['лес', 'таинственность', 'полевой'], price_per_stem: 150, meaning: 'Искренность и укрытие', shape: 'fern', size: 'greenery' },
]

export const FLOWER_BY_ID: Record<string, Flower> = Object.fromEntries(
  CATALOG.map((f) => [f.id, f]),
)

export function currentSeason(): Season {
  const m = new Date().getMonth() + 1
  if (m >= 3 && m <= 5) return 'spring'
  if (m >= 6 && m <= 8) return 'summer'
  if (m >= 9 && m <= 11) return 'autumn'
  return 'winter'
}
