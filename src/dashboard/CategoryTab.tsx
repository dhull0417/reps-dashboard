import { useCategoryData } from '../hooks/useCategoryData'
import { Card } from '../components/ui/Card'
import { PercentileChip } from '../components/ui/PercentileChip'
import { ErrorState } from '../components/ui/Loading'
import { Skeleton } from '../components/ui/Skeleton'
import type { Category, DistributionTarget } from '../lib/types'

function formatRawValue(value: number, unit: string): string {
  const formatted = unit === 'reps' ? Math.round(value).toString() : value.toFixed(1)
  return unit === '%' ? `${formatted}%` : `${formatted} ${unit}`
}

export function CategoryTab({
  playerId,
  category,
  activeDistribution,
  onSelectDistribution,
}: {
  playerId: string
  category: Category
  activeDistribution: DistributionTarget | null
  onSelectDistribution: (target: DistributionTarget) => void
}) {
  const { categoryScore, subcategoryRows, loading, error } = useCategoryData(
    playerId,
    category.id
  )

  if (loading) {
    return (
      <div className="tab-content">
        <Card title={category.name}>
          <div className="category-score-row">
            <Skeleton width={140} height={14} />
            <Skeleton width={92} height={40} className="skeleton-chip" />
          </div>
        </Card>
        <div className="subcategory-list">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="subcategory-card">
              <div className="subcategory-row">
                <div className="subcategory-info">
                  <Skeleton width={130} height={15} />
                  <Skeleton width={60} height={12} />
                </div>
                <Skeleton width={92} height={40} className="skeleton-chip" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  if (error) return <ErrorState message={error} />

  return (
    <div className="tab-content">
      <Card title={category.name}>
        {categoryScore ? (
          <div className="category-score-row">
            <span className="category-score-label">Category Standing</span>
            <PercentileChip
              percentile={categoryScore.percentile}
              rank={categoryScore.rank}
              active={
                activeDistribution?.kind === 'category' &&
                activeDistribution.categoryId === category.id
              }
              onClick={() =>
                onSelectDistribution({
                  kind: 'category',
                  categoryId: category.id,
                  label: category.name,
                  playerValue: categoryScore.percentile,
                  playerRank: categoryScore.rank,
                  playerPercentile: categoryScore.percentile,
                })
              }
            />
          </div>
        ) : (
          <ErrorState message="No category score found." />
        )}
      </Card>

      <div className="subcategory-list">
        {subcategoryRows.map(({ subcategory, raw_value, rank, percentile }) => (
          <Card key={subcategory.id} className="subcategory-card">
            <div className="subcategory-row">
              <div className="subcategory-info">
                <span className="subcategory-name">{subcategory.name}</span>
                <span className="subcategory-raw">
                  {raw_value !== null ? formatRawValue(raw_value, subcategory.unit) : '—'}
                </span>
              </div>
              {raw_value !== null && rank !== null && percentile !== null ? (
                <PercentileChip
                  percentile={percentile}
                  rank={rank}
                  active={
                    activeDistribution?.kind === 'subcategory' &&
                    activeDistribution.subcategoryId === subcategory.id
                  }
                  onClick={() =>
                    onSelectDistribution({
                      kind: 'subcategory',
                      subcategoryId: subcategory.id,
                      label: subcategory.name,
                      unit: subcategory.unit,
                      lowerIsBetter: subcategory.lower_is_better,
                      playerValue: raw_value,
                      playerRank: rank,
                      playerPercentile: percentile,
                    })
                  }
                />
              ) : (
                <span className="subcategory-missing">No result</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
