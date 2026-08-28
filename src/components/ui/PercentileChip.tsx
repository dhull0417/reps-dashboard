import { formatOrdinal } from '../../lib/format'

function tierForPercentile(percentile: number): 'good' | 'mid' | 'low' {
  if (percentile >= 75) return 'good'
  if (percentile >= 40) return 'mid'
  return 'low'
}

export function PercentileChip({
  percentile,
  rank,
  active,
  onClick,
}: {
  percentile: number
  rank: number
  active?: boolean
  onClick?: () => void
}) {
  const tier = tierForPercentile(percentile)

  return (
    <button
      type="button"
      className={`percentile-chip tier-${tier}${active ? ' active' : ''}${
        onClick ? '' : ' static'
      }`}
      onClick={onClick}
      disabled={!onClick}
    >
      <span className="percentile-chip-value">{formatOrdinal(percentile)}</span>
      <span className="percentile-chip-rank">#{rank} / 100</span>
    </button>
  )
}
