import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Rose, Tulip, Daisy, Cloud } from '@/components/flowers/shapes'

const float = (delay: number, y: number) => ({
  initial: { opacity: 0, y: y + 30 },
  animate: { opacity: 1, y: [y, y - 12, y] },
  transition: {
    opacity: { duration: 1, delay },
    y: { duration: 7 + delay * 2, repeat: Infinity, ease: 'easeInOut' as const, delay },
  },
})

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* плавающие цветы фоном */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <motion.div className="absolute left-[8%] top-[16%] w-20" {...float(0.2, 0)}>
          <svg viewBox="-45 -50 90 100"><Rose palette={['#E8AEB7', '#D48C99']} seed="h1" /></svg>
        </motion.div>
        <motion.div className="absolute right-[10%] top-[24%] w-16" {...float(0.9, 0)}>
          <svg viewBox="-25 -55 50 65"><Tulip palette={['#F5C84C', '#EDB52E']} seed="h2" /></svg>
        </motion.div>
        <motion.div className="absolute bottom-[18%] left-[14%] w-16" {...float(1.5, 0)}>
          <svg viewBox="-40 -40 80 80"><Daisy palette={['#FDFBF5', '#F5F1E6']} seed="h3" /></svg>
        </motion.div>
        <motion.div className="absolute bottom-[26%] right-[14%] w-24" {...float(2.1, 0)}>
          <svg viewBox="-70 -75 140 85"><Cloud palette={['#FBFAF5', '#E8AEB7']} seed="h4" /></svg>
        </motion.div>
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-display text-xl text-[#3E352C]">✿ Флёр</span>
        <span className="text-xs uppercase tracking-[0.25em] text-[#B09A83]">цифровой флорист</span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="font-display max-w-3xl text-4xl leading-tight text-[#3E352C] sm:text-6xl">
          Букет, который знает её имя
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-5 max-w-md text-base text-[#7C6D5B] sm:text-lg">
          Расскажи о ней — мы соберём цветы, которые попадут в сердце
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}>
          <Link to="/compose">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="mt-9 inline-block rounded-full bg-[#C97B8A] px-9 py-4 text-white shadow-[0_16px_35px_-10px_rgba(201,123,138,0.65)] transition-colors hover:bg-[#B96B7B]">
              Собрать букет — 60 секунд
            </motion.span>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 max-w-xs text-xs leading-relaxed text-[#B09A83]">
          Никаких «хитов продаж» и скидок — только цветы, собранные под её характер,
          и открытка, которую можно скачать или отправить ссылкой.
        </motion.p>
      </main>
    </div>
  )
}
