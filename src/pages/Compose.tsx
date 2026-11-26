import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import FormWizard from '@/components/form/FormWizard'
import type { FormData } from '@/types'
import { composeBouquet } from '@/lib/deepseek'
import { checkRateLimit, makeSlug, saveBouquet } from '@/lib/storage'

function PetalSkeletons() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.svg key={i} width="30" height="30" viewBox="0 0 26 26"
            animate={{ scale: [0.6, 1.05, 0.6], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}>
            <path d="M13,24 C5,18 4,8 13,2 C22,8 21,18 13,24 Z" fill="#E8AEB7" />
          </motion.svg>
        ))}
      </div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="font-display text-xl text-[#7C6D5B]">
        Флорист подбирает стебли…
      </motion.p>
    </div>
  )
}

export default function Compose() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (form: FormData) => {
    const rate = checkRateLimit()
    if (!rate.allowed) {
      setError('Тихо-тихо, флорист не машет ножницами так быстро 🌿 Пять букетов в час — пауза, попробуйте чуть позже.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { composition } = await composeBouquet(form)
      const slug = makeSlug(form.name, form.about)
      saveBouquet({ slug, form, composition, created_at: new Date().toISOString() })
      navigate(`/r/${slug}`)
    } catch (e) {
      console.error(e)
      setError('Кажется, лепесток застрял в проводе — попробуем ещё раз?')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6 sm:px-6">
      <header className="mx-auto flex w-full max-w-xl items-center justify-between">
        <Link to="/" className="font-display text-xl text-[#3E352C]">✿ Флёр</Link>
        <span className="text-xs uppercase tracking-[0.25em] text-[#B09A83]">анкета</span>
      </header>

      <main className="flex flex-1 items-center justify-center py-8">
        {loading ? (
          <PetalSkeletons />
        ) : (
          <div className="w-full">
            <FormWizard onSubmit={handleSubmit} />
            {error && (
              <p className="mx-auto mt-4 max-w-xl rounded-2xl border border-[#EFCFC8] bg-[#FDF1EC] px-5 py-3 text-center text-sm text-[#B0695A]">
                {error}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
