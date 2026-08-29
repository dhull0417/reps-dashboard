import { useId, useState } from 'react'
import { formatOrdinal } from '../../lib/format'

export interface CategoryRadarDatum {
  category: string
  percentile: number
}

const SIZE = 200
const CENTER = SIZE / 2
const RADIUS = 68
const LABEL_RADIUS = 88
const GRID_PERCENTILES = [0, 25, 50, 75, 100]

// The 0th percentile still sits a bit out from the center, rather than
// collapsing there, so low scores don't all cluster unreadably close together.
// Kept modest so the shape still shows real contrast instead of ballooning
// into a uniform blob. 100th percentile still reaches the outer edge.
const BASELINE_FRACTION = 0.15

function radiusForPercentile(percentile: number): number {
  const clamped = Math.max(0, Math.min(100, percentile))
  const fraction = BASELINE_FRACTION + (1 - BASELINE_FRACTION) * (clamped / 100)
  return fraction * RADIUS
}

function pointAt(index: number, count: number, radius: number): [number, number] {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)]
}

function labelAnchor(index: number, count: number): 'start' | 'middle' | 'end' {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2
  const x = Math.cos(angle)
  if (x > 0.25) return 'start'
  if (x < -0.25) return 'end'
  return 'middle'
}

export function CategoryRadarChart({ data }: { data: CategoryRadarDatum[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const gradientId = useId()
  const count = data.length

  if (count === 0) return null

  const gridPolygons = GRID_PERCENTILES.map((percentile) =>
    Array.from({ length: count }, (_, i) => pointAt(i, count, radiusForPercentile(percentile)).join(','))
      .join(' ')
  )
  const spokes = Array.from({ length: count }, (_, i) => pointAt(i, count, RADIUS))
  const dataPoints = data.map((d, i) => pointAt(i, count, radiusForPercentile(d.percentile)))
  const dataPolygon = dataPoints.map((p) => p.join(',')).join(' ')

  const active = activeIndex !== null ? data[activeIndex] : null
  const activePoint = activeIndex !== null ? dataPoints[activeIndex] : null

  return (
    <div className="category-radar">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="category-radar-svg">
        <defs>
          <radialGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            cx={activePoint ? activePoint[0] : CENTER}
            cy={activePoint ? activePoint[1] : CENTER}
            r={RADIUS}
          >
            <stop offset="0%" stopColor="var(--color-purple-light)" />
            <stop offset="100%" stopColor="var(--color-purple)" />
          </radialGradient>
        </defs>
        {gridPolygons.map((points, i) => (
          <polygon key={i} points={points} className="category-radar-grid" />
        ))}
        {spokes.map(([x, y], i) => (
          <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} className="category-radar-spoke" />
        ))}
        <polygon
          points={dataPolygon}
          className="category-radar-shape"
          style={{ fill: activePoint ? `url(#${gradientId})` : 'var(--color-purple)' }}
        />
        {data.map((d, i) => {
          const [x, y] = dataPoints[i]
          const [lx, ly] = pointAt(i, count, LABEL_RADIUS)
          return (
            <g key={d.category}>
              <text
                x={lx}
                y={ly}
                textAnchor={labelAnchor(i, count)}
                dominantBaseline="middle"
                className="category-radar-label"
              >
                {d.category}
              </text>
              <circle cx={x} cy={y} r={3.5} className="category-radar-dot" />
              <circle
                cx={x}
                cy={y}
                r={9}
                className="category-radar-hit"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex((current) => (current === i ? null : current))}
              />
            </g>
          )
        })}
        {activePoint && (
          <circle
            cx={activePoint[0]}
            cy={activePoint[1]}
            r={5}
            className="category-radar-dot-active"
          />
        )}
      </svg>
      {active && activePoint && (
        <div
          className="category-radar-tooltip"
          style={{
            left: `${(activePoint[0] / SIZE) * 100}%`,
            top: `${(activePoint[1] / SIZE) * 100}%`,
          }}
        >
          <div className="category-radar-tooltip-label">{active.category}</div>
          <div className="category-radar-tooltip-value">
            {formatOrdinal(active.percentile)} percentile
          </div>
        </div>
      )}
    </div>
  )
}
