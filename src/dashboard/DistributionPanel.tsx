import { useDistribution } from '../hooks/useDistribution'
import { Card } from '../components/ui/Card'
import { ErrorState } from '../components/ui/Loading'
import { Skeleton } from '../components/ui/Skeleton'
import { DistributionChart } from '../components/ui/DistributionChart'
import { formatOrdinal } from '../lib/format'
import type { DistributionTarget } from '../lib/types'

function formatValue(target: DistributionTarget, value: number): string {
  if (target.kind === 'category') return `${formatOrdinal(value)} pct`
  const rounded = target.unit === 'reps' ? Math.round(value).toString() : value.toFixed(1)
  return target.unit === '%' ? `${rounded}%` : `${rounded} ${target.unit}`
}

export function DistributionPanel({
  target,
  onClose,
}: {
  target: DistributionTarget
  onClose: () => void
}) {
  const { stats, loading, error } = useDistribution(target)

  return (
    <Card className="distribution-panel">
      <div className="distribution-panel-header">
        <div>
          <span className="distribution-panel-eyebrow">Distribution · 100 players</span>
          <h3 className="distribution-panel-title">{target.label}</h3>
        </div>
        <button
          type="button"
          className="distribution-panel-close"
          onClick={onClose}
          aria-label="Close distribution"
        >
          ×
        </button>
      </div>

      {loading && (
        <div className="distribution-chart">
          <Skeleton height={90} />
          <div className="distribution-chart-labels">
            <Skeleton width={28} height={10} />
            <Skeleton width={70} height={10} />
            <Skeleton width={28} height={10} />
          </div>
        </div>
      )}
      {error && <ErrorState message={error} />}

      {stats && (
        <>
          <DistributionChart
            stats={stats}
            playerValue={target.playerValue}
            formatValue={(v) => formatValue(target, v)}
          />

          <div className="distribution-panel-summary">
            <div className="distribution-panel-summary-item">
              <span className="distribution-panel-summary-label">You</span>
              <span className="distribution-panel-summary-value">
                {formatValue(target, target.playerValue)}
              </span>
            </div>
            <div className="distribution-panel-summary-item">
              <span className="distribution-panel-summary-label">Percentile</span>
              <span className="distribution-panel-summary-value">
                {formatOrdinal(target.playerPercentile)}
              </span>
            </div>
            <div className="distribution-panel-summary-item">
              <span className="distribution-panel-summary-label">Rank</span>
              <span className="distribution-panel-summary-value">#{target.playerRank} / 100</span>
            </div>
          </div>

          {target.kind === 'subcategory' && target.lowerIsBetter && (
            <p className="distribution-panel-note">Lower is better</p>
          )}
        </>
      )}
    </Card>
  )
}
