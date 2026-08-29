import type { CSSProperties } from 'react'
import { StatTile } from '../components/ui/StatTile'
import { formatOrdinal, formatTrainingTime, tierForPercentile } from '../lib/format'

export function Header({
  playerName,
  photoUrl,
  repsRating,
  shotsTaken,
  repsDone,
  trainingTimeMinutes,
  onSignOut,
  onPrint,
}: {
  playerName: string
  photoUrl?: string | null
  repsRating?: number | null
  shotsTaken?: number | null
  repsDone?: number | null
  trainingTimeMinutes?: number | null
  onSignOut?: () => void
  onPrint?: () => void
}) {
  const trimmedName = playerName.trim()
  const initial = trimmedName.charAt(0).toUpperCase()
  const [firstName, ...rest] = trimmedName.split(' ')
  const lastName = rest.join(' ')
  const hasRating = repsRating != null
  const tier = hasRating ? tierForPercentile(repsRating) : null
  const ringPct = hasRating ? Math.max(0, Math.min(100, repsRating)) : 0

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-identity">
        {photoUrl ? (
          <img className="dashboard-header-avatar" src={photoUrl} alt={playerName} />
        ) : (
          <div className="dashboard-header-avatar dashboard-header-avatar-fallback">{initial}</div>
        )}
        <div className="dashboard-header-text">
          <span className="dashboard-header-eyebrow">Athlete</span>
          <div className="dashboard-header-name-row">
            <h1 className="dashboard-header-name">
              <span className="dashboard-header-name-first">{firstName}</span>
              {lastName && ' ' + lastName}
            </h1>
            {hasRating && (
              <div className={`reps-rating-badge tier-${tier}`}>
                <div
                  className="reps-rating-ring"
                  style={{ '--pct': ringPct } as CSSProperties}
                >
                  <div className="reps-rating-ring-inner">
                    <span className="reps-rating-ring-value">{Math.round(repsRating!)}</span>
                  </div>
                </div>
                <div className="reps-rating-badge-text">
                  <span className="reps-rating-badge-label">Reps Rating</span>
                  <span className="reps-rating-badge-caption">
                    {formatOrdinal(repsRating!)} percentile
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="dashboard-header-stats">
            <StatTile label="Shots Taken" value={shotsTaken ?? '—'} accent="yellow" />
            <StatTile label="Reps Done" value={repsDone ?? '—'} accent="red" />
            <StatTile
              label="Time in Reps | Training"
              value={trainingTimeMinutes != null ? formatTrainingTime(trainingTimeMinutes) : '—'}
              accent="purple"
            />
            <span className="dashboard-header-stats-caption">Last 30 Days</span>
          </div>
        </div>
      </div>
      <div className="dashboard-header-right no-print">
        {onSignOut && (
          <button type="button" className="sign-out-button" onClick={onSignOut}>
            Sign Out
          </button>
        )}
        {onPrint && (
          <button type="button" className="sign-out-button print-button" onClick={onPrint}>
            Print
          </button>
        )}
      </div>
    </header>
  )
}
