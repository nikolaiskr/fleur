import { useCallback, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import BouquetSVG from '@/components/BouquetSVG'
import { FLOWER_BY_ID } from '@/lib/catalog'
import { composeBouquet } from '@/lib/deepseek'
import { checkRateLimit, loadBouquet, saveBouquet } from '@/lib/storage'
import { toGenitive } from '@/lib/names'
import type { SavedBouquet } from '@/types'

export default function Result() {
  const { slug } = useParams()
  const [bouquet, setBouquet] = useState<SavedBouquet | null>(() => (slug ? loadBouquet(slug) : null))
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState<'png' | 'pdf' | 'redo' | null>(null)
  const [error, setError] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  const downloadPng = useCallback(async () => {
    if (!cardRef.current || !bouquet) return
    setBusy('png')
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true })
      const a = document.createElement('a')
      a.download = `fleur-${bouquet.slug}.png`
      a.href = dataUrl
      a.click()
    } finally {
      setBusy(null)
    }
  }, [bouquet])

  const downloadPdf = useCallback(async () => {
    if (!cardRef.current || !bouquet) return
    setBusy('pdf')
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 300 / 96, cacheBust: true })
      // A5 (148×210 мм) + bleed 3 мм с каждой стороны
      const pdf = new jsPDF({ unit: 'mm', format: [154, 216], orientation: 'portrait' })
      pdf.addImage(dataUrl, 'PNG', 3, 3, 148, 210)
      pdf.save(`fleur-${bouquet.slug}-print.pdf`)
    } finally {
      setBusy(null)
    }
  }, [bouquet])

  const copyLink = useCallback(async () => {
    if (!bouquet) return
    const url = `${window.location.origin}${window.location.pathname}#/r/${bouquet.slug}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }, [bouquet])

  const regenerate = useCallback(async () => {
    if (!bouquet) return
    const rate = checkRateLimit()
    if (!rate.allowed) {
      setError('Пять букетов в час — флористу нужен кофе ☕ Попробуйте чуть позже.')
      return
    }
    setBusy('redo')
    setError('')
    try {
      const { composition } = await composeBouquet(bouquet.form, String(Date.now()))
      const updated = { ...bouquet, composition, created_at: new Date().toISOString() }
      saveBouquet(updated)
      setBouquet({ ...updated })
    } finally {
      setBusy(null)
    }
  }, [bouquet])

  if (!bouquet) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-3xl text-[#3E352C]">Этот букет ещё не собран 🌱</p>
        <p className="mt-3 max-w-sm text-sm text-[#8A7B68]">
          Открытки живут в браузере того, кто их собрал. Если ссылку вам прислали — попросите PNG или соберите свой букет.
        </p>
        <Link to="/compose" className="mt-8 rounded-full bg-[#C97B8A] px-8 py-3.5 text-white transition-colors hover:bg-[#B96B7B]">
          Собрать свой букет
        </Link>
      </div>
    )
  }

  const { form, composition } = bouquet
  const compositionList = composition.flowers
    .map((cf) => {
      const f = FLOWER_BY_ID[cf.flower_id]
      return f ? `${f.name_ru} × ${cf.quantity}` : null
    })
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-6 sm:py-10">
      <header className="flex w-full max-w-lg items-center justify-between">
        <Link to="/" className="font-display text-xl text-[#3E352C]">✿ Флёр</Link>
        <span className="text-xs uppercase tracking-[0.25em] text-[#B09A83]">открытка</span>
      </header>

      {/* Карточка-открытка A5 (148×210) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mt-6 w-full max-w-[420px]">
        <div
          ref={cardRef}
          className="aspect-[148/210] w-full overflow-hidden rounded-[22px] border border-[#EDE2D3] bg-[#FDFAF5] shadow-[0_30px_70px_-30px_rgba(120,86,60,0.45)]">
          <div className="flex h-full flex-col items-center px-6 py-5">
            <div className="w-full max-w-[290px] flex-1">
              <BouquetSVG
                flowers={composition.flowers}
                palette={composition.palette}
                style={composition.composition_style}
                seed={bouquet.slug}
              />
            </div>
            <h1 className="font-display mt-1 text-center text-2xl text-[#3E352C]">
              Для {toGenitive(form.name)}
            </h1>
            <p className="mt-1.5 text-center text-[11px] leading-relaxed text-[#8A7B68]">
              {composition.vibe_summary}
            </p>
            <div className="my-2.5 h-px w-10 bg-[#D8CCBB]" />
            <p className="text-center text-[12px] leading-relaxed text-[#5C5347]">
              {composition.caption}
            </p>
            <p className="mt-2 text-center text-[10.5px] italic leading-relaxed text-[#A08E78]">
              {composition.florist_note}
            </p>
            <p className="mt-auto pt-2 text-center text-[9px] leading-relaxed text-[#B09A83]">
              {composition.total_cost.toLocaleString('ru-RU')} ₽ · {compositionList}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Действия */}
      <div className="mt-6 grid w-full max-w-[420px] grid-cols-2 gap-2.5">
        <button onClick={downloadPng} disabled={busy !== null}
          className="rounded-full bg-[#3E352C] px-4 py-3 text-sm text-[#FBF6EE] transition-all hover:bg-[#2E2820] disabled:opacity-50">
          {busy === 'png' ? 'Сохраняем…' : 'Скачать PNG'}
        </button>
        <button onClick={downloadPdf} disabled={busy !== null}
          className="rounded-full bg-[#3E352C] px-4 py-3 text-sm text-[#FBF6EE] transition-all hover:bg-[#2E2820] disabled:opacity-50">
          {busy === 'pdf' ? 'Готовим…' : 'PDF для печати'}
        </button>
        <button onClick={copyLink} disabled={busy !== null}
          className="rounded-full border border-[#D8CCBB] bg-white/70 px-4 py-3 text-sm text-[#5C5347] transition-all hover:border-[#C97B8A]/50 disabled:opacity-50">
          {copied ? 'Ссылка скопирована ✿' : 'Скопировать ссылку'}
        </button>
        <button onClick={regenerate} disabled={busy !== null}
          className="rounded-full border border-[#D8CCBB] bg-white/70 px-4 py-3 text-sm text-[#5C5347] transition-all hover:border-[#C97B8A]/50 disabled:opacity-50">
          {busy === 'redo' ? 'Пересобираем…' : 'Собрать заново'}
        </button>
      </div>

      {error && (
        <p className="mt-4 max-w-[420px] rounded-2xl border border-[#EFCFC8] bg-[#FDF1EC] px-5 py-3 text-center text-sm text-[#B0695A]">
          {error}
        </p>
      )}

      {/* Почему именно эти цветы */}
      <div className="mt-8 w-full max-w-[420px] rounded-3xl border border-[#EDE2D3] bg-white/80 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B09A83]">почему именно они</p>
        <ul className="mt-3 space-y-2">
          {composition.flowers.map((cf) => {
            const f = FLOWER_BY_ID[cf.flower_id]
            if (!f) return null
            return (
              <li key={cf.flower_id} className="text-[12px] leading-relaxed text-[#6E5F4E]">
                <span className="font-medium text-[#3E352C]">{f.name_ru} × {cf.quantity}</span>
                {' — '}{cf.reason}
              </li>
            )
          })}
        </ul>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {composition.mood_tags.map((t) => (
            <span key={t} className="rounded-full bg-[#F6EDE4] px-3 py-1 text-[11px] text-[#8A7B68]">
              {t}
            </span>
          ))}
          <span className="rounded-full bg-[#F6EDE4] px-3 py-1 text-[11px] text-[#8A7B68]">
            стиль: {composition.composition_style}
          </span>
        </div>
      </div>

      <Link to="/compose" className="mt-8 text-sm text-[#A08E78] transition-colors hover:text-[#6E5F4E]">
        ← собрать ещё один букет
      </Link>
    </div>
  )
}
