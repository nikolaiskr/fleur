// Родительный падеж русских женских имён: «Для Маши», а не «Для Маша».
// Приложение собирает букеты для неё — склоняем только женские формы.

export function toGenitive(rawName: string): string {
  const name = rawName.trim().split(/\s+/)[0] ?? rawName.trim()
  if (!name) return rawName
  const lower = name.toLowerCase()
  const head = name.slice(0, -1)

  // -ия → -ии (Мария → Марии, Дария → Дарии)
  if (/ия$/.test(lower)) return `${name.slice(0, -2)}ии`
  // -ья → -ьи (Дарья → Дарьи)
  if (/ья$/.test(lower)) return `${head.slice(0, -1)}ьи`
  // -я → -и (Аня → Ани, Настя → Насти)
  if (/я$/.test(lower)) return `${head}и`
  // -а → -ы/-и: после г, к, х, ж, ш, ч, щ — «и» (Маша → Маши, Ольга → Ольги)
  if (/а$/.test(lower)) {
    const prev = lower.slice(-2, -1)
    return `${head}${'гкхжшчщ'.includes(prev) ? 'и' : 'ы'}`
  }
  // -ь → -и (Любовь → Любови)
  if (/ь$/.test(lower)) return `${head}и`
  // -й → -я (Николай → Николая)
  if (/й$/.test(lower)) return `${head}я`
  // Иностранные и прочие имена не склоняем
  return name
}
