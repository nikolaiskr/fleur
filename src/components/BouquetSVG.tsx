// <BouquetSVG> — программный конструктор букета.
// Цветы собираются из SVG-компонентов: зелень фоном, крупные цветы
// в центре, мелкие по краям; внизу — крафт-обёртка. Положение каждого
// цветка детерминировано seed'ом — букет стабилен при перерендере.

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
  layer: number
  greenery: boolean
  stemTop?: { x: number; y: number }
}

const BIND = { x: 200, y: 305 }
const CENTER_Y = 195

const STYLE_SPREAD: Record<CompositionStyle, number> = {
  компактный: 0.72,
  раскидистый: 1.12,
  каскадный: 1.0,
  моно: 0.85,
  полевой: 1.25,
}

export default function BouquetSVG({ flowers, palette, style, seed, animated = true }: Props) {
  const rng = rngFrom(`bouquet:${seed}`)
  const spread = STYLE_SPREAD[style] ?? 1

  // Разворачиваем количество в отдельные стебли
  const instances: Instance[] = []
  const all = flowers.flatMap((cf) => {
    const f = FLOWER_BY_ID[cf.flower_id]
    if (!f) return []
    return Array.from({ length: cf.quantity }, () => f)
  })

  const greenery = all.filter((f) => f.size === 'greenery')
  const blooms = all.filter((f) => f.size !== 'greenery')
  const order = { large: 0, medium: 1, small: 2 } as const
  blooms.sort((a, b) => order[a.size as keyof typeof order] - order[b.size as keyof typeof order])

  // Зелень: широкий веер позади
  greenery.forEach((f, i) => {
    const a = -Math.PI / 2 + (i - (greenery.length - 1) / 2) * (0.5 + 0.14 * spread)
    const dist = range(rng, 100, 148) * spread
    instances.push({
      key: `g-${f.id}-${i}`,
      flowerId: f.id,
      x: BIND.x + Math.cos(a) * dist * 0.75,
      y: BIND.y - Math.abs(Math.sin(a)) * dist * 0.35 - range(rng, 18, 60),
      scale: range(rng, 0.85, 1.15),
      rotate: (a + Math.PI / 2) * (180 / Math.PI) * 0.8,
      layer: 0,
      greenery: true,
    })
  })

  // Цветы: золотой угол, крупные — к центру
  blooms.forEach((f, i) => {
    const rank = f.size === 'large' ? 0 : f.size === 'medium' ? 1 : 2
    const baseR =
      f.size === 'large' ? range(rng, 8, 42) :
      f.size === 'medium' ? range(rng, 38, 88) :
      range(rng, 74, 128)
    const r = baseR * spread
    const angle = i * 137.508 + rank * 60 + range(rng, -14, 14)
    const rad = (angle * Math.PI) / 180
    const cascadeDrop = style === 'каскадный' && rank === 2 ? range(rng, 20, 60) : 0
    const wildLift = style === 'полевой' ? range(rng, -26, 8) : 0
    const x = 200 + Math.cos(rad) * r * 1.06
    const y = CENTER_Y + Math.sin(rad) * r * 0.78 + cascadeDrop + wildLift - rank * 6
    const baseScale = f.size === 'large' ? 1.05 : f.size === 'medium' ? 0.82 : 0.62
    instances.push({
      key: `b-${f.id}-${i}`,
      flowerId: f.id,
      x, y,
      scale: baseScale * range(rng, 0.9, 1.12),
      rotate: range(rng, -24, 24),
      layer: 2 - rank, // крупные поверх
      greenery: false,
    })
  })

  // Палитра AI применяется к «нейтральным» цветам
  const resolveColors = (flowerId: string, i: number): string[] => {
    const f = FLOWER_BY_ID[flowerId]
    if (!f) return ['#E8AEB7', '#D48C99']
    if (f.neutral && palette.length >= 2) {
      return [palette[i % palette.length], palette[(i + 1) % palette.length]]
    }
    return f.colors
  }

  const sorted = [...instances].sort((a, b) => a.layer - b.layer)

  return (
    <svg viewBox="0 0 400 520" className="h-auto w-full" role="img" aria-label="Собранный букет">
      <defs>
        <linearGradient id="kraft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9BC8A" />
          <stop offset="100%" stopColor="#C4A271" />
        </linearGradient>
        <linearGradient id="kraftFold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CDAF7C" />
          <stop offset="100%" stopColor="#B99766" />
        </linearGradient>
      </defs>

      {/* зелень и стебли — за обёрткой сверху */}
      {sorted.filter((i) => i.greenery).map((inst, idx) => {
        const f = FLOWER_BY_ID[inst.flowerId]
        const Shape = SHAPES[f.shape]
        return (
          <g key={inst.key} transform={`translate(${inst.x},${inst.y}) rotate(${inst.rotate}) scale(${inst.scale})`}>
            <motion.g
              style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}
              initial={animated ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + idx * 0.05, type: 'spring', stiffness: 120, damping: 14 }}
            >
              <Shape palette={f.colors} seed={inst.key} />
            </motion.g>
          </g>
        )
      })}

      {/* стебли цветов */}
      {sorted.filter((i) => !i.greenery).map((inst) => (
        <path key={`s-${inst.key}`}
          d={`M${inst.x},${inst.y + 8} Q ${(inst.x + BIND.x) / 2 + (inst.x - 200) * 0.12},${(inst.y + BIND.y) / 2} ${BIND.x + (inst.x - 200) * 0.12},${BIND.y}`}
          stroke="#5E8A5A" strokeWidth={2.6} fill="none" opacity={0.9} />
      ))}

      {/* крафт-обёртка */}
      <g>
        <path d="M96,296 L304,296 L212,508 L188,508 Z" fill="url(#kraft)" stroke="#B08D5C" strokeWidth={1.6} />
        <path d="M96,296 L172,296 L188,508 Z" fill="url(#kraftFold)" opacity={0.65} />
        <path d="M304,296 L228,296 L212,508 Z" fill="url(#kraftFold)" opacity={0.45} />
        <path d="M96,296 L200,330 L304,296 L200,272 Z" fill="#E2C89A" stroke="#B08D5C" strokeWidth={1.2} />
        {/* бечёвка */}
        <path d="M150,318 Q200,336 250,318" stroke="#8A6A42" strokeWidth={3} fill="none" />
        <path d="M200,327 q-10,16 -4,30 M200,327 q10,16 4,30" stroke="#8A6A42" strokeWidth={2.4} fill="none" />
        <circle cx={200} cy={327} r={4.6} fill="#8A6A42" />
      </g>

      {/* цветы — расцветают по очереди */}
      {sorted.filter((i) => !i.greenery).map((inst, idx) => {
        const f = FLOWER_BY_ID[inst.flowerId]
        const Shape = SHAPES[f.shape]
        return (
          <g key={inst.key} transform={`translate(${inst.x},${inst.y}) rotate(${inst.rotate}) scale(${inst.scale})`}>
            <motion.g
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={animated ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.08, type: 'spring', stiffness: 160, damping: 13 }}
            >
              <Shape palette={resolveColors(inst.flowerId, idx)} seed={inst.key} />
            </motion.g>
          </g>
        )
      })}
    </svg>
  )
}
