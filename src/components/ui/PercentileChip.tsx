import { formatOrdinal, tierForPercentile } from '../../lib/format'

export function PercentileChip({
  percentile,
  rank,
  active,
  onClick,
  size = 'md',
}: {
  percentile: number
  rank: number
  active?: boolean
  onClick?: () => void
  size?: 'md' | 'lg'
}) {
  const tier = tierForPercentile(percentile)

  return (
    <button
      type="button"
      className={`percentile-chip tier-${tier}${active ? ' active' : ''}${
        onClick ? '' : ' static'
      }${size === 'lg' ? ' percentile-chip-lg' : ''}`}
      onClick={onClick}
      disabled={!onClick}
    >
      <span className="percentile-chip-value">{formatOrdinal(percentile)} percentile</span>
      <span className="percentile-chip-rank">#{rank} / 100</span>
    </button>
  )
}
