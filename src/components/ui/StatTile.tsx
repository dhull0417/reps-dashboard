import { Skeleton } from './Skeleton'

export function StatTile({
  label,
  value,
  suffix,
  accent,
}: {
  label: string
  value: string | number
  suffix?: string
  accent?: 'yellow' | 'red' | 'purple'
}) {
  return (
    <div className="stat-tile">
      <span className="stat-tile-label">{label}</span>
      <span className={`stat-tile-value${accent ? ` accent-${accent}` : ''}`}>
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
