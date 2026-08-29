import type { QuartileStats } from '../../lib/quartiles'

export function DistributionChart({
  stats,
  playerValue,
  formatValue,
  lowerIsBetter,
  showAxis = true,
}: {
  stats: QuartileStats
  playerValue: number
  formatValue: (value: number) => string
  lowerIsBetter?: boolean
  showAxis?: boolean
}) {
  const span = stats.max - stats.min
  const pad = span > 0 ? span * 0.1 : 1
  const domainMin = stats.min - pad
  const domainMax = stats.max + pad
  const scale = (v: number) => {
    const t = ((v - domainMin) / (domainMax - domainMin)) * 100
    return lowerIsBetter ? 100 - t : t
  }

  const minX = scale(stats.min)
  const maxX = scale(stats.max)
  const scaledQ1 = scale(stats.q1)
  const scaledQ3 = scale(stats.q3)
  const medianX = scale(stats.median)
  const clampedPlayer = Math.min(Math.max(playerValue, stats.min), stats.max)
  const playerX = scale(clampedPlayer)
  const [leftLabelValue, rightLabelValue] = lowerIsBetter
    ? [stats.max, stats.min]
    : [stats.min, stats.max]

  return (
    <div className="distribution-chart">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="distribution-chart-svg">
        <line x1={minX} x2={maxX} y1={20} y2={20} className="dist-whisker" vectorEffect="non-scaling-stroke" />
        <line x1={scaledQ1} x2={medianX} y1={20} y2={20} className="dist-band-lower" vectorEffect="non-scaling-stroke" />
        <line x1={medianX} x2={scaledQ3} y1={20} y2={20} className="dist-band-upper" vectorEffect="non-scaling-stroke" />
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
      {showAxis && (
        <div className="distribution-chart-labels">
          <span>{formatValue(leftLabelValue)}</span>
          <span className="distribution-chart-median">median {formatValue(stats.median)}</span>
          <span>{formatValue(rightLabelValue)}</span>
        </div>
      )}
    </div>
  )
}
