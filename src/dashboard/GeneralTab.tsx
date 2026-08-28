import { Card } from '../components/ui/Card'
import { StatTile, StatTileSkeleton } from '../components/ui/StatTile'
import { ErrorState } from '../components/ui/Loading'
import { formatOrdinal } from '../lib/format'
import type { Player, OverallRanking } from '../lib/types'

export function GeneralTab({
  player,
  overallRanking,
  loading,
  error,
}: {
  player: Player | null
  overallRanking: OverallRanking | null
  loading: boolean
  error: string | null
}) {
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

  return (
    <div className="tab-content">
      <Card title="Section Percentiles">
        <div className="stat-grid">
          <StatTile
            label="Athleticism"
            value={formatOrdinal(player.athleticism_percentile)}
            suffix="pct"
          />
          <StatTile
            label="Shooting"
            value={formatOrdinal(player.shooting_percentile)}
            suffix="pct"
          />
          <StatTile label="Skills" value={formatOrdinal(player.skills_percentile)} suffix="pct" />
        </div>
      </Card>

      <Card title="Overall Standing">
        <div className="stat-grid">
          <StatTile
            label="Reps Rating"
            value={formatOrdinal(overallRanking.reps_rating)}
            suffix="pct"
          />
          <StatTile
            label="Reps Conversion Rating"
            value={overallRanking.reps_conversion_rating.toFixed(1)}
          />
          <StatTile label="Overall Rank" value={`#${overallRanking.overall_rank}`} suffix="/ 100" />
        </div>
      </Card>
    </div>
  )
}
