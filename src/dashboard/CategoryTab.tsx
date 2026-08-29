import { useEffect, useRef } from 'react'
import { useCategoryData } from '../hooks/useCategoryData'
import { Card } from '../components/ui/Card'
import { PercentileChip } from '../components/ui/PercentileChip'
import { ErrorState } from '../components/ui/Loading'
import { Skeleton } from '../components/ui/Skeleton'
import { getReferenceStat } from '../lib/normsReference'
import type { Category, DistributionTarget } from '../lib/types'

function formatRawValue(value: number, unit: string): string {
  const formatted = unit === 'reps' ? Math.round(value).toString() : value.toFixed(1)
  return unit === '%' ? `${formatted}%` : `${formatted} ${unit}`
}

export function CategoryTab({
  playerId,
  playerName,
  category,
  activeDistribution,
  onSelectDistribution,
}: {
  playerId: string
  playerName: string | null | undefined
  category: Category
  activeDistribution: DistributionTarget | null
  onSelectDistribution: (target: DistributionTarget) => void
}) {
  const { categoryScore, subcategoryRows, loading, error } = useCategoryData(
    playerId,
    category.id
  )

  const autoSelectedCategoryRef = useRef<string | null>(null)

  useEffect(() => {
    if (!categoryScore) return
    if (categoryScore.category_id !== category.id) return
    if (autoSelectedCategoryRef.current === category.id) return
    autoSelectedCategoryRef.current = category.id
    onSelectDistribution({
      kind: 'category',
      categoryId: category.id,
      label: category.name,
      playerValue: categoryScore.percentile,
      playerRank: categoryScore.rank,
      playerPercentile: categoryScore.percentile,
    })
  }, [category.id, category.name, categoryScore, onSelectDistribution])

  if (loading) {
    return (
      <div className="tab-content">
        <div className="category-header">
          <Skeleton width={220} height={36} />
          <Skeleton width={140} height={56} className="skeleton-chip" />
        </div>
        <h3 className="section-subheader">Contributing Drills</h3>
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
      <div className="category-header">
        <h2 className="category-header-title">{category.name}</h2>
        {categoryScore ? (
          <PercentileChip
            percentile={categoryScore.percentile}
            rank={categoryScore.rank}
            size="lg"
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
        ) : (
          <ErrorState message="No category score found." />
        )}
      </div>

      <h3 className="section-subheader">Contributing Drills</h3>

      <div className="subcategory-list">
        {subcategoryRows.map(({ subcategory, raw_value, rank, percentile }) => {
          const reference = getReferenceStat(playerName, subcategory.name)
          const displayRank = reference?.rank ?? rank
          const displayPercentile = reference?.percentile ?? percentile

          return (
            <Card key={subcategory.id} className="subcategory-card">
              <div className="subcategory-row">
                <div className="subcategory-info">
                  <span className="subcategory-name">{subcategory.name}</span>
                  <span className="subcategory-raw">
                    {raw_value !== null ? formatRawValue(raw_value, subcategory.unit) : '—'}
                  </span>
                </div>
                {raw_value !== null && displayRank !== null && displayPercentile !== null ? (
                  <PercentileChip
                    percentile={displayPercentile}
                    rank={displayRank}
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
                        playerRank: displayRank,
                        playerPercentile: displayPercentile,
                      })
                    }
                  />
                ) : (
                  <span className="subcategory-missing">No result</span>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
