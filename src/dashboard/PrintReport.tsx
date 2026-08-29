import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { usePlayerProfile } from '../hooks/usePlayerProfile'
import { usePrintReport } from '../hooks/usePrintReport'
import { Header } from './Header'
import { Card } from '../components/ui/Card'
import { PercentileChip } from '../components/ui/PercentileChip'
import { DistributionChart } from '../components/ui/DistributionChart'
import { Loading, ErrorState } from '../components/ui/Loading'
import { getReferenceStat } from '../lib/normsReference'
import { formatOrdinal } from '../lib/format'

function formatRawValue(value: number, unit: string): string {
  const formatted = unit === 'reps' ? Math.round(value).toString() : value.toFixed(1)
  return unit === '%' ? `${formatted}%` : `${formatted} ${unit}`
}

export function PrintReport() {
  const navigate = useNavigate()
  const { dashboardUser } = useAuth()
  const {
    player,
    overallRanking,
    loading: profileLoading,
    error: profileError,
  } = usePlayerProfile(dashboardUser?.player_id)
  const { rows, loading: reportLoading, error: reportError } = usePrintReport(dashboardUser?.player_id)

  if (!dashboardUser) {
    return (
      <div className="full-page-status">
        <ErrorState message="No player is linked to this account." />
      </div>
    )
  }

  const playerName = player?.name ?? dashboardUser.display_name
  const loading = profileLoading || reportLoading
  const error = profileError ?? reportError

  return (
    <div className="print-report">
      <div className="print-toolbar no-print">
        <button type="button" className="sign-out-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <button type="button" className="sign-out-button print-button" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <Header
        playerName={playerName}
        photoUrl={player?.photo_url}
        repsRating={overallRanking?.reps_rating}
        shotsTaken={player?.shots_taken_season}
        repsDone={player?.reps_done}
        trainingTimeMinutes={player?.training_time_minutes}
      />

      <div className="print-body">
        {loading && <Loading />}
        {error && <ErrorState message={error} />}

        {rows &&
          rows.map(({ category, categoryScore, categoryStats, subcategoryRows }) => (
            <section key={category.id} className="print-category">
              <Card className="print-category-card">
                <div className="print-row">
                  <div className="print-row-info">
                    <h2 className="category-header-title">{category.name}</h2>
                    {categoryScore ? (
                      <PercentileChip percentile={categoryScore.percentile} rank={categoryScore.rank} size="lg" />
                    ) : (
                      <span className="subcategory-missing">No category score found</span>
                    )}
                  </div>
                  <div className="print-row-chart">
                    {categoryStats && categoryScore ? (
                      <DistributionChart
                        stats={categoryStats}
                        playerValue={categoryScore.percentile}
                        formatValue={(v) => `${formatOrdinal(v)} percentile`}
                        showAxis={false}
                      />
                    ) : (
                      <div className="print-chart-placeholder">No distribution data</div>
                    )}
                  </div>
                </div>
              </Card>

              <h3 className="section-subheader print-subheader">Contributing Drills</h3>

              <div className="subcategory-list">
                {subcategoryRows.map(({ subcategory, raw_value, rank, percentile, stats }) => {
                  const reference = getReferenceStat(playerName, subcategory.name)
                  const displayRank = reference?.rank ?? rank
                  const displayPercentile = reference?.percentile ?? percentile
                  const hasResult = raw_value !== null && displayRank !== null && displayPercentile !== null

                  return (
                    <Card key={subcategory.id} className="subcategory-card">
                      <div className="print-row">
                        <div className="print-row-info">
                          <div className="subcategory-info">
                            <span className="subcategory-name">{subcategory.name}</span>
                            <span className="subcategory-raw">
                              {raw_value !== null ? formatRawValue(raw_value, subcategory.unit) : '—'}
                            </span>
                          </div>
                          {hasResult ? (
                            <PercentileChip percentile={displayPercentile!} rank={displayRank!} />
                          ) : (
                            <span className="subcategory-missing">No result</span>
                          )}
                        </div>
                        <div className="print-row-chart">
                          {hasResult && stats ? (
                            <DistributionChart
                              stats={stats}
                              playerValue={raw_value!}
                              formatValue={(v) => formatRawValue(v, subcategory.unit)}
                              lowerIsBetter={subcategory.lower_is_better}
                              showAxis
                            />
                          ) : (
                            <div className="print-chart-placeholder">No distribution data</div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}
      </div>
    </div>
  )
}
