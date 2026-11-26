// DeepSeek API (модель deepseek-chat). Ключ — из .env (VITE_DEEPSEEK_API_KEY).
// В продакшене вызов должен идти через серверный прокси (в ТЗ — Next.js API
// route), чтобы ключ не попадал в браузер; в этом статическом MVP при
// отсутствии ключа или ошибке API букет собирает локальный композитор
// с той же JSON-схемой (валидация через zod, 1 retry).

import type { Composition, FormData } from '@/types'
import { CompositionSchema, localCompose } from './composer'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts'

const API_URL = 'https://api.deepseek.com/chat/completions'

async function callDeepSeek(form: FormData): Promise<Composition> {
  const key = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined
  if (!key) throw new Error('no-key')

  let lastError: unknown = null
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          temperature: 0.8,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: buildUserPrompt(form) },
          ],
        }),
      })
      if (!res.ok) throw new Error(`deepseek ${res.status}`)
      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content
      if (!text) throw new Error('empty')
      return CompositionSchema.parse(JSON.parse(text))
    } catch (e) {
      lastError = e
      console.warn(`[fleur] deepseek attempt ${attempt + 1} failed`, e)
    }
  }
  throw lastError
}

export async function composeBouquet(form: FormData, seedSuffix = ''): Promise<{ composition: Composition; source: 'deepseek' | 'local' }> {
  try {
    const composition = await callDeepSeek(form)
    return { composition, source: 'deepseek' }
  } catch {
    return { composition: localCompose(form, seedSuffix), source: 'local' }
  }
}
