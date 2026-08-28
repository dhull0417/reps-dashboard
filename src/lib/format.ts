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
