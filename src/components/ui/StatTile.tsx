import { Skeleton } from './Skeleton'

export function StatTile({
  label,
  value,
  suffix,
}: {
  label: string
  value: string | number
  suffix?: string
}) {
  return (
    <div className="stat-tile">
      <span className="stat-tile-label">{label}</span>
      <span className="stat-tile-value">
        {value}
        {suffix && <span className="stat-tile-suffix">{suffix}</span>}
      </span>
    </div>
  )
}

export function StatTileSkeleton() {
  return (
    <div className="stat-tile">
      <Skeleton width={64} height={11} />
      <Skeleton width={84} height={30} />
    </div>
  )
}
