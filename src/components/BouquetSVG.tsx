// <BouquetSVG> — программный конструктор букета.
// Пышный «купол» цветов над мягкой крафт-обёрткой: зелень выглядывает
// по краям, крупные цветы в центре, мелкие по краям; порядок отрисовки —
// художественный (нижние поверх верхних). Положение каждого цветка
// детерминировано seed'ом — букет стабилен при перерендере.

import { motion } from 'framer-motion'
import type { CompositionFlower, CompositionStyle } from '@/types'
import { FLOWER_BY_ID } from '@/lib/catalog'
import { rngFrom, range } from '@/lib/rng'
import { SHAPES } from './flowers/shapes'

interface Props {
  flowers: CompositionFlower[]
  palette: string[]
  style: CompositionStyle
  seed: string
  animated?: boolean
}

interface Instance {
  key: string
  flowerId: string
  x: number
  y: number
  scale: number
  rotate: number
  greenery: boolean
}

const DOME = { x: 200, y: 168 }
const BIND = { x: 200, y: 302 }

const STYLE_SPREAD: Record<CompositionStyle, number> = {
  компактный: 0.74,
  раскидистый: 1.1,
  каскадный: 1.0,
  моно: 0.82,
  полевой: 1.18,
}

export default function BouquetSVG({ flowers, palette, style, seed, animated = true }: Props) {
  const rng = rngFrom(`bouquet:${seed}`)
  const spread = STYLE_SPREAD[style] ?? 1

  const all = flowers.flatMap((cf) => {
    const f = FLOWER_BY_ID[cf.flower_id]
    if (!f) return []
    return Array.from({ length: cf.quantity }, () => f)
  })

  const greenery = all.filter((f) => f.size === 'greenery')
  const blooms = all.filter((f) => f.size !== 'greenery')
  // Порядок раздачи позиций: крупные → средние → мелкие
  const rankOf = { large: 0, medium: 1, small: 2 } as const
  blooms.sort((a, b) => rankOf[a.size as keyof typeof rankOf] - rankOf[b.size as keyof typeof rankOf])

  const greenInstances: Instance[] = greenery.map((f, i) => {
    // Веер зелени за куполом: точки крепления вдоль края обёртки, кончики наружу
    const a = (-170 + (160 / Math.max(1, greenery.length - 1)) * i + range(rng, -9, 9)) * (Math.PI / 180)
    return {
      key: `g-${f.id}-${i}`,
      flowerId: f.id,
      x: BIND.x + Math.cos(a) * 118 * spread,
      y: 268 + range(rng, -8, 14),
      scale: range(rng, 0.95, 1.25),
      rotate: (Math.cos(a)) * 42 + range(rng, -8, 8),
      greenery: true,
    }
  })

  const bloomInstances: Instance[] = blooms.map((f, i) => {
    const rank = rankOf[f.size as keyof typeof rankOf]
    const baseR =
      f.size === 'large' ? range(rng, 4, 46) :
      f.size === 'medium' ? range(rng, 38, 92) :
      range(rng, 78, 130)
    const r = baseR * spread
    const angle = i * 137.508 + rank * 55 + range(rng, -16, 16)
    const rad = (angle * Math.PI) / 180
    const drop =
      style === 'каскадный' && rank === 2 ? range(rng, 26, 66) :
      style === 'полевой' ? range(rng, -20, 16) :
      range(rng, -4, 10)
    const x = DOME.x + Math.cos(rad) * r * 1.06
    const y = DOME.y + Math.sin(rad) * r * 0.72 + drop
    const baseScale = f.size === 'large' ? 1.45 : f.size === 'medium' ? 1.15 : 0.9
    return {
      key: `b-${f.id}-${i}`,
      flowerId: f.id,
      x: Math.min(372, Math.max(28, x)),
      y: Math.min(292, Math.max(30, y)),
      scale: baseScale * range(rng, 0.92, 1.1),
      rotate: range(rng, -18, 18),
      greenery: false,
    }
  })

  // Художественный порядок: нижние цветы поверх верхних
  bloomInstances.sort((a, b) => a.y - b.y)

  // Листья-подложка вокруг купола — заполняют промежутки между цветами
  const leafCount = 8
  const leaves = Array.from({ length: leafCount }, (_, i) => {
    const a = ((-165 + (150 / (leafCount - 1)) * i) * Math.PI) / 180 + range(rng, -0.06, 0.06)
    const r = range(rng, 118, 142) * spread
    return {
      x: DOME.x + Math.cos(a) * r * 1.08,
      y: DOME.y + Math.sin(a) * r * 0.74 + 14,
      rotate: (a * 180) / Math.PI + 90,
      scale: range(rng, 0.85, 1.15),
      fill: i % 2 ? '#8FA98F' : '#7B967B',
    }
  })

  const resolveColors = (flowerId: string, i: number): string[] => {
    const f = FLOWER_BY_ID[flowerId]
    if (!f) return ['#E8AEB7', '#D48C99']
    if (f.neutral && palette.length >= 2) {
      return [palette[i % palette.length], palette[(i + 1) % palette.length]]
    }
    return f.colors
  }

  return (
    <svg viewBox="0 0 400 470" className="h-auto w-full" role="img" aria-label="Собранный букет">
      <defs>
        <linearGradient id="kraft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCC091" />
          <stop offset="100%" stopColor="#C6A473" />
        </linearGradient>
        <linearGradient id="kraftLip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9D3A8" />
          <stop offset="100%" stopColor="#D8BC8C" />
        </linearGradient>
      </defs>

      {/* зелень за куполом */}
      {greenInstances.map((inst, idx) => {
        const f = FLOWER_BY_ID[inst.flowerId]
        const Shape = SHAPES[f.shape]
        return (
          <g key={inst.key} transform={`translate(${inst.x},${inst.y}) rotate(${inst.rotate}) scale(${inst.scale})`}>
            <motion.g
              style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}
              initial={animated ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12 + idx * 0.05, type: 'spring', stiffness: 120, damping: 14 }}
            >
              <Shape palette={f.colors} seed={inst.key} />
            </motion.g>
          </g>
        )
      })}

      {/* листья-подложка вокруг купола */}
      {leaves.map((l, i) => (
        <g key={`leaf-${i}`} transform={`translate(${l.x},${l.y}) rotate(${l.rotate}) scale(${l.scale})`}>
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.04, type: 'spring', stiffness: 130, damping: 15 }}
          >
            <path d="M0,0 Q-13,-16 -11,-34 Q-5,-46 0,-48 Q5,-46 11,-34 Q13,-16 0,0 Z"
              fill={l.fill} opacity={0.9} />
            <path d="M0,-4 L0,-42" stroke="#6B8A6B" strokeWidth={1.4} opacity={0.7} />
          </motion.g>
        </g>
      ))}

      {/* стебли — почти скрыты обёрткой */}
      {bloomInstances.map((inst) => (
        <path key={`s-${inst.key}`}
          d={`M${inst.x},${inst.y + 10} Q ${(inst.x + BIND.x) / 2 + (inst.x - 200) * 0.1},${(inst.y + BIND.y) / 2} ${BIND.x + (inst.x - 200) * 0.1},${BIND.y}`}
          stroke="#5E8A5A" strokeWidth={2.8} fill="none" opacity={0.9} />
      ))}

      {/* мягкая крафт-обёртка */}
      <g>
        <path d="M104,262 Q200,236 296,262 L240,436 Q200,452 160,436 Z"
          fill="url(#kraft)" stroke="#B08D5C" strokeWidth={1.6} />
        {/* левый и правый загибы бумаги */}
        <path d="M104,262 Q150,252 182,262 L168,434 Q160,438 152,432 Z"
          fill="#B99766" opacity={0.4} />
        <path d="M296,262 Q250,252 218,262 L232,434 Q240,438 248,432 Z"
          fill="#B99766" opacity={0.3} />
        {/* верхняя кромка-отворот */}
        <path d="M104,262 Q200,236 296,262 Q200,290 104,262 Z" fill="url(#kraftLip)"
          stroke="#B08D5C" strokeWidth={1.2} />
        {/* бечёвка с бантиком */}
        <path d="M146,306 Q200,322 254,306" stroke="#8A6A42" strokeWidth={3} fill="none" />
        <path d="M200,314 q-14,-12 -22,-2 q6,12 22,2 Z" fill="#8A6A42" />
        <path d="M200,314 q14,-12 22,-2 q-6,12 -22,2 Z" fill="#8A6A42" />
        <path d="M200,314 q-8,20 -14,30 M200,314 q8,20 14,30" stroke="#8A6A42" strokeWidth={2.4}
          fill="none" strokeLinecap="round" />
        <circle cx={200} cy={314} r={4.4} fill="#7A5C38" />
      </g>

      {/* цветы — расцветают по очереди, нижние поверх */}
      {bloomInstances.map((inst, idx) => {
        const f = FLOWER_BY_ID[inst.flowerId]
        const Shape = SHAPES[f.shape]
        return (
          <g key={inst.key} transform={`translate(${inst.x},${inst.y}) rotate(${inst.rotate}) scale(${inst.scale})`}>
            <motion.g
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={animated ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.45 + idx * 0.08, type: 'spring', stiffness: 150, damping: 13 }}
            >
              <Shape palette={resolveColors(inst.flowerId, idx)} seed={inst.key} />
            </motion.g>
          </g>
        )
      })}
    </svg>
  )
}
