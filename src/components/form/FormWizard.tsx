import { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FormData } from '@/types'
import { CATALOG } from '@/lib/catalog'

const ROLES = ['девушка', 'жена', 'мама', 'сестра', 'подруга', 'коллега', 'crush', 'дочь']

interface Props {
  onSubmit: (form: FormData) => void
}

/* Прогресс-бар-лепесток: 5 лепестков, распускаются по шагам */
function ProgressPetals({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`Шаг ${step} из 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.svg key={n} width="26" height="26" viewBox="0 0 26 26"
          initial={false}
          animate={{ scale: step >= n ? 1 : 0.55, rotate: step >= n ? 0 : -30 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
          <path d="M13,24 C5,18 4,8 13,2 C22,8 21,18 13,24 Z"
            fill={step >= n ? '#E8AEB7' : '#EFE6DB'}
            stroke={step >= n ? '#D48C99' : '#DDD0BF'} strokeWidth="1.2" />
        </motion.svg>
      ))}
    </div>
  )
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
        active
          ? 'border-[#C97B8A] bg-[#C97B8A] text-white shadow-sm'
          : 'border-[#E3D7C8] bg-white/70 text-[#5C5347] hover:border-[#C97B8A]/60 hover:bg-[#FBF3EE]'
      }`}>
      {children}
    </button>
  )
}

export default function FormWizard({ onSubmit }: Props) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>({
    role: '',
    name: '',
    age: 30,
    about: '',
    favorites: [],
    budget: 5000,
  })
  const [softError, setSoftError] = useState('')
  // Зеркало состояния — на случай, если «Собрать букет» нажата
  // в тот же момент, что и последний чип (до флаша setState)
  const formRef = useRef(form)
  formRef.current = form

  const canNext = useMemo(() => {
    if (step === 1) return form.role !== ''
    if (step === 2) return form.name.trim().length >= 2
    return true
  }, [step, form.role, form.name])

  const next = () => {
    if (!canNext) {
      setSoftError(step === 2 ? 'Напишите её имя — букет должен знать, к кому лететь 🌿' : 'Выберите вариант — это важно для настроения букета')
      return
    }
    setSoftError('')
    setStep((s) => Math.min(5, s + 1))
  }

  const toggleFav = (id: string) =>
    setForm((f) => ({
      ...f,
      favorites: f.favorites.includes(id) ? f.favorites.filter((x) => x !== id) : [...f.favorites, id],
    }))

  const stepAnim = {
    initial: { opacity: 0, x: 26 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -26 },
    transition: { duration: 0.28, ease: 'easeOut' as const },
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <ProgressPetals step={step} />

      <div className="mt-6 min-h-[380px] rounded-3xl border border-[#EDE2D3] bg-white/80 p-6 shadow-[0_18px_50px_-24px_rgba(120,86,60,0.35)] backdrop-blur sm:p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" {...stepAnim}>
              <p className="text-xs tracking-[0.2em] text-[#B09A83] uppercase">Шаг 1 из 5</p>
              <h2 className="font-display mt-2 text-2xl text-[#3E352C] sm:text-3xl">Кто она для тебя?</h2>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {ROLES.map((r) => (
                  <Chip key={r} active={form.role === r} onClick={() => setForm((f) => ({ ...f, role: r }))}>
                    {r}
                  </Chip>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" {...stepAnim}>
              <p className="text-xs tracking-[0.2em] text-[#B09A83] uppercase">Шаг 2 из 5</p>
              <h2 className="font-display mt-2 text-2xl text-[#3E352C] sm:text-3xl">Как её зовут?</h2>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && next()}
                placeholder="Аня"
                className="font-display mt-6 w-full border-b-2 border-[#E3D7C8] bg-transparent pb-2 text-3xl text-[#3E352C] outline-none transition-colors placeholder:text-[#D8CCBB] focus:border-[#C97B8A]"
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" {...stepAnim}>
              <p className="text-xs tracking-[0.2em] text-[#B09A83] uppercase">Шаг 3 из 5</p>
              <h2 className="font-display mt-2 text-2xl text-[#3E352C] sm:text-3xl">Сколько ей лет?</h2>
              <div className="mt-10 px-1">
                <input type="range" min={16} max={75} value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: Number(e.target.value) }))}
                  className="fleur-range w-full" />
                <div className="mt-4 text-center">
                  <span className="font-display text-5xl text-[#C97B8A]">{form.age}</span>
                  <span className="ml-2 text-[#B09A83]">лет</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" {...stepAnim}>
              <p className="text-xs tracking-[0.2em] text-[#B09A83] uppercase">Шаг 4 из 5</p>
              <h2 className="font-display mt-2 text-2xl text-[#3E352C] sm:text-3xl">Чем она занимается, что любит?</h2>
              <textarea
                autoFocus
                value={form.about}
                onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))}
                placeholder="архитектор, любит минимализм и кофе по утрам…"
                rows={4}
                className="mt-6 w-full resize-none rounded-2xl border border-[#E3D7C8] bg-[#FDFAF5] p-4 text-[#3E352C] outline-none transition-colors placeholder:text-[#C9BBA6] focus:border-[#C97B8A]"
              />
              <p className="mt-2 text-xs text-[#B09A83]">Пара тёплых деталей — и букет попадёт точнее 🌸</p>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" {...stepAnim}>
              <p className="text-xs tracking-[0.2em] text-[#B09A83] uppercase">Шаг 5 из 5</p>
              <h2 className="font-display mt-2 text-2xl text-[#3E352C] sm:text-3xl">Любимые цветы и бюджет</h2>
              <p className="mt-1 text-sm text-[#8A7B68]">Если знаете её любимые — отметьте, обязательно добавим хотя бы один.</p>
              <div className="mt-4 flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
                {CATALOG.filter((f) => f.size !== 'greenery').map((f) => (
                  <Chip key={f.id} active={form.favorites.includes(f.id)} onClick={() => toggleFav(f.id)}>
                    {f.name_ru}
                  </Chip>
                ))}
              </div>
              <div className="mt-6 px-1">
                <input type="range" min={1500} max={30000} step={500} value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) }))}
                  className="fleur-range w-full" />
                <div className="mt-3 text-center">
                  <span className="font-display text-4xl text-[#C97B8A]">{form.budget.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {softError && <p className="mt-4 text-sm text-[#C97B8A]">{softError}</p>}

        <div className="mt-8 flex items-center justify-between">
          <button type="button" onClick={() => { setSoftError(''); setStep((s) => Math.max(1, s - 1)) }}
            className={`text-sm text-[#A08E78] transition-opacity hover:text-[#6E5F4E] ${step === 1 ? 'pointer-events-none opacity-0' : ''}`}>
            ← назад
          </button>

          {step < 5 ? (
            <motion.button whileTap={{ scale: 0.96 }} type="button" onClick={next}
              className="rounded-full bg-[#3E352C] px-7 py-3 text-sm text-[#FBF6EE] transition-colors hover:bg-[#2E2820]">
              дальше →
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.03 }}
              type="button"
              onClick={() => onSubmit(formRef.current)}
              className="rounded-full bg-[#C97B8A] px-7 py-3 text-sm font-medium text-white shadow-[0_10px_25px_-8px_rgba(201,123,138,0.7)] transition-colors hover:bg-[#B96B7B]">
              ✿ Собрать букет
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
