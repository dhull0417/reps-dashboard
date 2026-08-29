function ordinalSuffix(rounded: number): string {
  const mod100 = rounded % 100
  if (mod100 >= 11 && mod100 <= 13) return 'th'
  switch (rounded % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

export function formatOrdinal(value: number): string {
  const rounded = Math.round(value)
  return `${rounded}${ordinalSuffix(rounded)}`
}

export type PercentileTier = 'good' | 'mid' | 'low'

export function tierForPercentile(percentile: number): PercentileTier {
  if (percentile >= 75) return 'good'
  if (percentile >= 40) return 'mid'
  return 'low'
}

export function formatTrainingTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}
