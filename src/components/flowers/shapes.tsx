// Параметрические SVG-цветы. Каждый цветок — <g> вокруг точки (0,0):
// для «головных» форм это центр цветка, для зелени/колосьев — верх стебля.
// palette[0] — основной цвет лепестков, palette[1] — тень/глубина.

import { rngFrom, range } from '@/lib/rng'

export interface ShapeProps {
  palette: string[]
  seed: string
}

/* Лепесток с округлым кончиком */
function petal(len: number, w: number): string {
  return `M0,0 Q ${-w},${-len * 0.36} ${-w * 0.74},${-len * 0.78} Q ${-w * 0.34},${-len * 1.07} 0,${-len} Q ${w * 0.34},${-len * 1.07} ${w * 0.74},${-len * 0.78} Q ${w},${-len * 0.36} 0,0 Z`
}

function ring(
  count: number,
  len: number,
  w: number,
  fill: string,
  offset = 0,
  opacity = 1,
) {
  const els = []
  for (let i = 0; i < count; i++) {
    const a = offset + (360 / count) * i
    els.push(
      <path key={`${a}-${len}`} d={petal(len, w)} fill={fill} opacity={opacity}
        transform={`rotate(${a})`} stroke="rgba(60,40,30,0.08)" strokeWidth={0.7} />,
    )
  }
  return els
}

/* ── Роза: пышные слои + спираль ────────────────────────── */
export function Rose({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const off = range(rng, 0, 60)
  return (
    <g>
      {ring(9, 36, 19, palette[1] ?? palette[0], off)}
      {ring(7, 29, 16, palette[0], off + 24)}
      {ring(6, 21, 12, palette[1] ?? palette[0], off + 50)}
      {ring(4, 13, 8.5, palette[0], off + 12)}
      <circle r={6.4} fill={palette[1] ?? palette[0]} />
      <path d="M0,-5.4 A5.4,5.4 0 1,1 -5.4,0 A4,4 0 1,0 2.6,-2.6 A2.6,2.6 0 1,1 -0.8,0.8"
        fill="none" stroke={palette[0]} strokeWidth={1.5} strokeLinecap="round" opacity={0.9} />
    </g>
  )
}

/* ── Пион: широкие мягкие лепестки ──────────────────────── */
export function Peony({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const off = range(rng, 0, 45)
  return (
    <g>
      {ring(7, 41, 15, palette[1] ?? palette[0], off, 0.9)}
      {ring(9, 34, 21, palette[0], off + 18)}
      {ring(8, 26, 17, palette[1] ?? palette[0], off + 42)}
      {ring(6, 17, 12, palette[0], off + 8)}
      <circle r={4.6} fill={palette[1] ?? palette[0]} />
    </g>
  )
}

/* ── Ранункулюс: плотные ярусы лепестков ────────────────── */
export function Ranunculus({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const layers = [30, 23, 17, 9]
  return (
    <g>
      {layers.map((r, li) => {
        const n = Math.max(6, Math.round(r / 3.1))
        const els = []
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + li * 0.45 + range(rng, -0.05, 0.05)
          const x = Math.cos(a) * r
          const y = Math.sin(a) * r
          const angle = (a * 180) / Math.PI + 90
          els.push(
            <ellipse key={`${li}-${i}`} cx={x} cy={y} rx={4.6 + (3 - li) * 0.5} ry={8.2 - li * 0.7}
              fill={li % 2 ? palette[0] : palette[1] ?? palette[0]}
              transform={`rotate(${angle} ${x} ${y})`}
              stroke="rgba(60,40,30,0.07)" strokeWidth={0.5} />,
          )
        }
        return els
      })}
      <circle r={4.2} fill={palette[1] ?? palette[0]} />
      <circle r={2} fill={palette[0]} />
    </g>
  )
}

/* ── Тюльпан: чаша из округлых лепестков ────────────────── */
export function Tulip({ palette }: ShapeProps) {
  const p0 = palette[0]
  const p1 = palette[1] ?? palette[0]
  return (
    <g>
      <path d={petal(46, 17)} transform="rotate(-30)" fill={p1}
        stroke="rgba(60,40,30,0.08)" strokeWidth={0.7} />
      <path d={petal(46, 17)} transform="rotate(30)" fill={p1}
        stroke="rgba(60,40,30,0.08)" strokeWidth={0.7} />
      <path d={petal(48, 19)} fill={p0} stroke="rgba(60,40,30,0.08)" strokeWidth={0.7} />
      <path d="M-7,-30 Q0,-36 7,-30" stroke={p1} strokeWidth={1.6} fill="none" opacity={0.65} />
    </g>
  )
}

/* ── Ромашка/гербера/астра: два ряда лепестков + диск ───── */
export function Daisy({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const off = range(rng, 0, 25)
  return (
    <g>
      {ring(16, 31, 8.5, palette[1] ?? palette[0], off)}
      {ring(13, 26, 8.5, palette[0], off + 13)}
      <circle r={9.5} fill="#EDBE45" />
      <circle r={9.5} fill="none" stroke="#D9A92E" strokeWidth={1.4} />
      <circle r={5} fill="#D9A92E" opacity={0.8} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.4
        return <circle key={i} cx={Math.cos(a) * 7} cy={Math.sin(a) * 7} r={1} fill="#C1901F" />
      })}
    </g>
  )
}

/* ── Помпон (хризантема, георгин, гвоздика, скабиоза) ───── */
export function Pompom({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  return (
    <g>
      {ring(17, 28, 9.5, palette[1] ?? palette[0], range(rng, 0, 20))}
      {ring(14, 21, 8.5, palette[0], range(rng, 0, 20))}
      {ring(10, 13.5, 7, palette[1] ?? palette[0], range(rng, 0, 20))}
      <circle r={5.4} fill={palette[0]} />
      <circle r={2.6} fill={palette[1] ?? palette[0]} opacity={0.8} />
    </g>
  )
}

/* ── Гортензия: облако мелких соцветий ──────────────────── */
export function Hydrangea({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const florets = []
  for (let i = 0; i < 15; i++) {
    const a = range(rng, 0, Math.PI * 2)
    const r = range(rng, 4, 32)
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r * 0.88
    florets.push(
      <g key={i} transform={`translate(${x},${y})`}>
        {[0, 90, 180, 270].map((rot) => (
          <circle key={rot} cx={Math.cos((rot * Math.PI) / 180) * 4.8}
            cy={Math.sin((rot * Math.PI) / 180) * 4.8} r={5.2}
            fill={i % 3 === 0 ? palette[1] ?? palette[0] : palette[0]}
            stroke="rgba(60,40,30,0.05)" strokeWidth={0.5} />
        ))}
        <circle r={1.7} fill="#F8F2E2" />
      </g>,
    )
  }
  return <g>{florets}</g>
}

/* ── Колос (лаванда, дельфиниум, гиацинт, маттиола, фрезия) ─ */
export function Spike({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const buds = []
  const h = 86
  for (let i = 0; i < 11; i++) {
    const y = -i * (h / 11)
    const spread = 8.6 * (1 - i / 14)
    const r = 6.2 - i * 0.24
    buds.push(
      <circle key={`l${i}`} cx={-spread + range(rng, -1.5, 1.5)} cy={y} r={r}
        fill={i % 2 ? palette[0] : palette[1] ?? palette[0]}
        stroke="rgba(60,40,30,0.06)" strokeWidth={0.5} />,
      <circle key={`r${i}`} cx={spread + range(rng, -1.5, 1.5)} cy={y - h / 22} r={r}
        fill={i % 2 ? palette[1] ?? palette[0] : palette[0]}
        stroke="rgba(60,40,30,0.06)" strokeWidth={0.5} />,
    )
  }
  buds.push(<circle key="tip" cx={0} cy={-h - 4} r={4.4} fill={palette[0]} />)
  return (
    <g>
      <path d={`M0,6 L0,${-h}`} stroke="#5C7C4E" strokeWidth={2.6} />
      {buds}
    </g>
  )
}

/* ── Облако (гипсофила, статица): воздушные веточки ─────── */
export function Cloud({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const dots = []
  const branches = 6
  for (let b = 0; b < branches; b++) {
    const a = -Math.PI / 2 + (b - branches / 2) * 0.34 + range(rng, -0.1, 0.1)
    const len = range(rng, 42, 64)
    const x2 = Math.cos(a) * len
    const y2 = Math.sin(a) * len
    dots.push(
      <path key={`s${b}`} d={`M0,0 Q ${x2 * 0.4 + range(rng, -6, 6)},${y2 * 0.55} ${x2},${y2}`}
        stroke="#7B967B" strokeWidth={1.2} fill="none" opacity={0.8} />,
    )
    for (let d = 0; d < 4; d++) {
      const t = 0.45 + d * 0.17
      dots.push(
        <circle key={`${b}-${d}`} cx={x2 * t + range(rng, -7, 7)} cy={y2 * t + range(rng, -6, 6)}
          r={range(rng, 2.6, 4)} fill={d % 2 ? palette[0] : palette[1] ?? palette[0]}
          opacity={0.95} />,
      )
    }
  }
  return <g>{dots}</g>
}

/* ── Мак/анемон: широкие лепестки + тёмная сердцевина ───── */
export function Poppy({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const off = range(rng, 0, 70)
  return (
    <g>
      {ring(6, 34, 23, palette[1] ?? palette[0], off, 0.92)}
      {ring(5, 27, 19, palette[0], off + 36, 0.96)}
      <circle r={8.4} fill="#3A3234" />
      <circle r={5} fill="#5A4A38" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2
        return <circle key={i} cx={Math.cos(a) * 11.6} cy={Math.sin(a) * 11.6} r={1.2} fill="#3A3234" />
      })}
    </g>
  )
}

/* ── Ирис ───────────────────────────────────────────────── */
export function Iris({ palette }: ShapeProps) {
  const p0 = palette[0]
  const p1 = palette[1] ?? palette[0]
  return (
    <g>
      {[0, 120, 240].map((a) => (
        <path key={`u${a}`} d={petal(31, 13)} fill={p0} transform={`rotate(${a})`}
          stroke="rgba(60,40,30,0.08)" strokeWidth={0.6} />
      ))}
      {[60, 180, 300].map((a) => (
        <g key={`d${a}`} transform={`rotate(${a})`}>
          <path d="M0,0 Q-14,10 -13,24 Q-6,34 0,35 Q6,34 13,24 Q14,10 0,0 Z" fill={p1}
            stroke="rgba(60,40,30,0.08)" strokeWidth={0.6} />
          <path d="M0,10 L0,26" stroke="#E8C547" strokeWidth={2.2} />
        </g>
      ))}
      <circle r={4.2} fill="#E8C547" />
    </g>
  )
}

/* ── Подсолнух ──────────────────────────────────────────── */
export function Sunflower({ palette }: ShapeProps) {
  return (
    <g>
      {ring(17, 40, 10, palette[1] ?? '#E8A91F', 5)}
      {ring(17, 33, 10, palette[0], 15)}
      <circle r={16} fill="#5C4633" />
      <circle r={11} fill="#4A3828" />
      {Array.from({ length: 26 }).map((_, i) => {
        const a = i * 2.399963 // золотой угол
        const r = 2.3 * Math.sqrt(i)
        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={1.1} fill="#6E5741" />
      })}
    </g>
  )
}

/* ── Василёк: зубчатая звезда ───────────────────────────── */
export function Cornflower({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const rays = []
  const n = 9
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i + range(rng, -4, 4)
    rays.push(
      <g key={i} transform={`rotate(${a})`}>
        <path d="M0,0 L-5.4,-25 L-1.8,-20 L0,-30 L1.8,-20 L5.4,-25 Z"
          fill={i % 2 ? palette[0] : palette[1] ?? palette[0]} />
      </g>,
    )
  }
  return (
    <g>
      {rays}
      <circle r={4.6} fill="#3D3A6B" />
      <circle r={2} fill="#5A559A" />
    </g>
  )
}

/* ── Колос пшеницы ──────────────────────────────────────── */
export function Wheat({ palette }: ShapeProps) {
  const grains = []
  for (let i = 0; i < 7; i++) {
    const y = -i * 11 - 8
    grains.push(
      <ellipse key={`l${i}`} cx={-6} cy={y} rx={4.4} ry={9} fill={palette[i % 2]}
        transform={`rotate(-28 -6 ${y})`} stroke="rgba(60,40,30,0.06)" strokeWidth={0.5} />,
      <ellipse key={`r${i}`} cx={6} cy={y} rx={4.4} ry={9} fill={palette[(i + 1) % 2]}
        transform={`rotate(28 6 ${y})`} stroke="rgba(60,40,30,0.06)" strokeWidth={0.5} />,
    )
  }
  return (
    <g>
      <path d="M0,6 L0,-88" stroke="#C9A96B" strokeWidth={2.2} />
      {grains}
      <ellipse cx={0} cy={-84} rx={4.4} ry={10} fill={palette[0]} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M0,${-84 + i * 8} l${(i - 1) * 4},-26`} stroke="#C9A96B"
          strokeWidth={1} opacity={0.7} />
      ))}
    </g>
  )
}

/* ── Эвкалипт: стебель с круглыми листьями ──────────────── */
export function Eucalyptus({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const leaves = []
  for (let i = 0; i < 6; i++) {
    const y = -i * 16 - 8
    const r = 8.8 - i * 0.7
    leaves.push(
      <circle key={`l${i}`} cx={-9 + range(rng, -2, 2)} cy={y} r={r}
        fill={i % 2 ? palette[0] : palette[1] ?? palette[0]} opacity={0.92} />,
      <circle key={`r${i}`} cx={9 + range(rng, -2, 2)} cy={y - 8} r={r}
        fill={i % 2 ? palette[1] ?? palette[0] : palette[0]} opacity={0.92} />,
    )
  }
  return (
    <g>
      <path d="M0,8 C-3,-30 3,-70 0,-106" stroke="#7B967B" strokeWidth={2.4} fill="none" />
      {leaves}
      <circle cx={0} cy={-106} r={5.8} fill={palette[0]} opacity={0.92} />
    </g>
  )
}

/* ── Папоротник ─────────────────────────────────────────── */
export function Fern({ palette }: ShapeProps) {
  const leaflets = []
  for (let i = 0; i < 9; i++) {
    const y = -i * 11 - 6
    const w = 22 - i * 2
    leaflets.push(
      <path key={`l${i}`} d={`M0,${y} Q ${-w},${y - 4} ${-w - 4},${y - 14}`}
        stroke={i % 2 ? palette[0] : palette[1] ?? palette[0]} strokeWidth={5.4}
        strokeLinecap="round" fill="none" opacity={0.9} />,
      <path key={`r${i}`} d={`M0,${y - 5} Q ${w},${y - 9} ${w + 4},${y - 19}`}
        stroke={i % 2 ? palette[1] ?? palette[0] : palette[0]} strokeWidth={5.4}
        strokeLinecap="round" fill="none" opacity={0.9} />,
    )
  }
  return (
    <g>
      <path d="M0,8 C-4,-40 4,-80 0,-112" stroke="#4C7649" strokeWidth={2.6} fill="none" />
      {leaflets}
    </g>
  )
}

/* ── Ветка (писташ): дуга с овальными листьями ──────────── */
export function Branch({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  const leaves = []
  for (let i = 0; i < 6; i++) {
    const t = i / 5
    const x = -46 * t + 46 * t * t
    const y = -10 - t * 84
    leaves.push(
      <ellipse key={`l${i}`} cx={x - 9} cy={y} rx={5.2} ry={11.5} fill={palette[i % 2]}
        transform={`rotate(${-35 + range(rng, -8, 8)} ${x - 9} ${y})`} opacity={0.92} />,
      <ellipse key={`r${i}`} cx={x + 9} cy={y - 6} rx={5.2} ry={11.5} fill={palette[(i + 1) % 2]}
        transform={`rotate(${35 + range(rng, -8, 8)} ${x + 9} ${y - 6})`} opacity={0.92} />,
    )
  }
  return (
    <g>
      <path d="M0,8 C-20,-20 -50,-50 -46,-98" stroke="#5C7C4E" strokeWidth={2.4} fill="none" />
      {leaves}
    </g>
  )
}

/* ── Краспедия: шарик на ножке ──────────────────────────── */
export function Ball({ palette, seed }: ShapeProps) {
  const rng = rngFrom(seed)
  return (
    <g>
      <path d="M0,44 L0,-6" stroke="#8FA98F" strokeWidth={2.4} />
      <circle cy={-14} r={11.5} fill={palette[0]} stroke="rgba(60,40,30,0.1)" strokeWidth={0.8} />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = range(rng, 0, Math.PI * 2)
        const r = range(rng, 2, 9)
        return <circle key={i} cx={Math.cos(a) * r} cy={-14 + Math.sin(a) * r}
          r={1} fill={palette[1] ?? '#D9A92E'} />
      })}
    </g>
  )
}

/* ── Нарцисс: 6 лепестков + коронка ─────────────────────── */
export function Narcissus({ palette }: ShapeProps) {
  return (
    <g>
      {ring(6, 27, 12.5, palette[0], 0)}
      <circle r={9} fill="#F0A83C" stroke="#DE9429" strokeWidth={1.8} />
      <circle r={4.6} fill="#DE9429" />
    </g>
  )
}

export const SHAPES = {
  rose: Rose,
  peony: Peony,
  ranunculus: Ranunculus,
  tulip: Tulip,
  daisy: Daisy,
  pompom: Pompom,
  hydrangea: Hydrangea,
  spike: Spike,
  cloud: Cloud,
  poppy: Poppy,
  iris: Iris,
  sunflower: Sunflower,
  cornflower: Cornflower,
  wheat: Wheat,
  eucalyptus: Eucalyptus,
  fern: Fern,
  branch: Branch,
  ball: Ball,
  narcissus: Narcissus,
} as const
