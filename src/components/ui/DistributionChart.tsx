import type { QuartileStats } from '../../lib/quartiles'

export function DistributionChart({
  stats,
  playerValue,
  formatValue,
}: {
  stats: QuartileStats
  playerValue: number
  formatValue: (value: number) => string
}) {
  const span = stats.max - stats.min
  const pad = span > 0 ? span * 0.1 : 1
  const domainMin = stats.min - pad
  const domainMax = stats.max + pad
  const scale = (v: number) => ((v - domainMin) / (domainMax - domainMin)) * 100

  const minX = scale(stats.min)
  const maxX = scale(stats.max)
  const boxLeft = scale(stats.q1)
  const boxRight = scale(stats.q3)
  const medianX = scale(stats.median)
  const clampedPlayer = Math.min(Math.max(playerValue, stats.min), stats.max)
  const playerX = scale(clampedPlayer)

  return (
    <div className="distribution-chart">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="distribution-chart-svg">
        <line x1={minX} x2={maxX} y1={20} y2={20} className="dist-whisker" vectorEffect="non-scaling-stroke" />
        <line x1={minX} x2={minX} y1={13} y2={27} className="dist-cap" vectorEffect="non-scaling-stroke" />
        <line x1={maxX} x2={maxX} y1={13} y2={27} className="dist-cap" vectorEffect="non-scaling-stroke" />
        <rect
          x={boxLeft}
          y={7}
          width={Math.max(boxRight - boxLeft, 0.6)}
          height={26}
          rx={1.5}
          className="dist-box"
        />
        <line x1={medianX} x2={medianX} y1={7} y2={33} className="dist-median" vectorEffect="non-scaling-stroke" />
        <line
          x1={playerX}
          x2={playerX}
          y1={1}
          y2={39}
          className="dist-player-line"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={playerX} cy={20} r={3.2} className="dist-player-dot" />
      </svg>
      <div className="distribution-chart-labels">
        <span>{formatValue(stats.min)}</span>
        <span className="distribution-chart-median">median {formatValue(stats.median)}</span>
        <span>{formatValue(stats.max)}</span>
      </div>
    </div>
  )
}
