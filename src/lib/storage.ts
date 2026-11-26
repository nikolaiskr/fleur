// Локальное хранилище открыток (MVP вместо SQLite/Prisma):
// букет сохраняется под коротким slug, ссылкой можно поделиться
// на этом же устройстве. Плюс rate limit: 5 генераций в час.

import type { SavedBouquet } from '@/types'
import { hashString } from './rng'

const STORE_KEY = 'fleur:bouquets'
const RATE_KEY = 'fleur:rate'
const RATE_LIMIT = 5
const HOUR = 60 * 60 * 1000

function readStore(): Record<string, SavedBouquet> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function makeSlug(name: string, seed: string): string {
  const base = name
    .toLowerCase()
    .replace(/[ё]/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, '')
    .slice(0, 12)
  const suffix = hashString(`${name}:${seed}:${Date.now()}`).toString(36).slice(0, 5)
  return `${base || 'buket'}-${suffix}`
}

export function saveBouquet(b: SavedBouquet): void {
  const store = readStore()
  store[b.slug] = b
  localStorage.setItem(STORE_KEY, JSON.stringify(store))
}

export function loadBouquet(slug: string): SavedBouquet | null {
  return readStore()[slug] ?? null
}

export function checkRateLimit(): { allowed: boolean; left: number } {
  let stamps: number[] = []
  try {
    stamps = JSON.parse(localStorage.getItem(RATE_KEY) ?? '[]')
  } catch {
    stamps = []
  }
  const now = Date.now()
  stamps = stamps.filter((t) => now - t < HOUR)
  if (stamps.length >= RATE_LIMIT) {
    localStorage.setItem(RATE_KEY, JSON.stringify(stamps))
    return { allowed: false, left: 0 }
  }
  stamps.push(now)
  localStorage.setItem(RATE_KEY, JSON.stringify(stamps))
  return { allowed: true, left: RATE_LIMIT - stamps.length }
}
