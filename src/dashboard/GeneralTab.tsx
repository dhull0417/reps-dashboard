import { Card } from '../components/ui/Card'
import { StatTile, StatTileSkeleton } from '../components/ui/StatTile'
import { ErrorState } from '../components/ui/Loading'
import { Skeleton } from '../components/ui/Skeleton'
import { CategoryRadarChart } from '../components/ui/CategoryRadarChart'
import { useCategoryScores } from '../hooks/useCategoryScores'
import { formatOrdinal } from '../lib/format'
import type { Category, Player, OverallRanking } from '../lib/types'

export function GeneralTab({
  player,
  overallRanking,
  categories,
  loading,
  error,
}: {
  player: Player | null
  overallRanking: OverallRanking | null
  categories: Category[]
  loading: boolean
  error: string | null
}) {
  const {
    scores: categoryScores,
    loading: scoresLoading,
    error: scoresError,
  } = useCategoryScores(player?.id)

  if (loading) {
    return (
      <div className="tab-content">
        <Card title="Section Percentiles">
          <div className="stat-grid">
            <StatTileSkeleton />
            <StatTileSkeleton />
            <StatTileSkeleton />
          </div>
        </Card>
        <Card title="Overall Standing">
          <div className="stat-grid">
            <StatTileSkeleton />
            <StatTileSkeleton />
            <StatTileSkeleton />
          </div>
        </Card>
      </div>
    )
  }
  if (error) return <ErrorState message={error} />
  if (!player || !overallRanking) return <ErrorState message="No profile data found." />

  const radarData = categories.map((category) => {
    const score = categoryScores.find((s) => s.category_id === category.id)
    return { category: category.name, percentile: score?.percentile ?? 0 }
  })

  return (
    <div className="tab-content">
      <Card title="Overall Standing">
        <div className="stat-grid">
          <StatTile
            label="Reps Rating"
            value={formatOrdinal(overallRanking.reps_rating)}
            suffix="percentile"
          />
          <StatTile
            label="Reps Conversion Rating"
            value={overallRanking.reps_conversion_rating.toFixed(1)}
          />
          <StatTile label="Overall Rank" value={`#${overallRanking.overall_rank}`} suffix="/ 100" />
        </div>
      </Card>

      <Card title="Section Percentiles">
        <div className="stat-grid">
          <StatTile
            label="Athleticism"
            value={formatOrdinal(player.athleticism_percentile)}
            suffix="percentile"
          />
          <StatTile
            label="Shooting"
            value={formatOrdinal(player.shooting_percentile)}
            suffix="percentile"
          />
          <StatTile label="Skills" value={formatOrdinal(player.skills_percentile)} suffix="percentile" />
        </div>
      </Card>

      <Card title="Category Breakdown">
        {scoresLoading ? (
          <Skeleton width="100%" height={280} />
        ) : scoresError ? (
          <ErrorState message={scoresError} />
        ) : (
          <CategoryRadarChart data={radarData} />
        )}
      </Card>
    </div>
  )
}
