export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all'

export type FlowerShape =
  | 'rose' | 'peony' | 'ranunculus' | 'tulip' | 'daisy' | 'pompom'
  | 'hydrangea' | 'spike' | 'cloud' | 'poppy' | 'iris' | 'sunflower'
  | 'cornflower' | 'wheat' | 'eucalyptus' | 'fern' | 'branch' | 'ball' | 'narcissus'

export type FlowerSize = 'large' | 'medium' | 'small' | 'greenery'

export interface Flower {
  id: string
  name_ru: string
  name_latin: string
  category: string
  colors: string[]
  season: Season
  mood_tags: string[]
  price_per_stem: number
  meaning: string
  shape: FlowerShape
  size: FlowerSize
  neutral?: boolean // палитра AI применяется к нейтральным цветам
}

export interface FormData {
  role: string
  name: string
  age: number
  about: string
  favorites: string[] // flower_id
  budget: number
}

export interface CompositionFlower {
  flower_id: string
  quantity: number
  reason: string
}

export type CompositionStyle = 'раскидистый' | 'компактный' | 'каскадный' | 'моно' | 'полевой'

export interface Composition {
  vibe_summary: string
  mood_tags: string[]
  flowers: CompositionFlower[]
  palette: string[]
  composition_style: CompositionStyle
  total_cost: number
  caption: string
  florist_note: string
}

export interface SavedBouquet {
  slug: string
  form: FormData
  composition: Composition
  created_at: string
}
