export interface QuartileStats {
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

function percentileOf(sorted: number[], p: number): number {
  const idx = (sorted.length - 1) * p
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sorted[lo]
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

export function computeQuartiles(values: number[]): QuartileStats {
  const sorted = [...values].sort((a, b) => a - b)
  return {
    min: sorted[0],
    q1: percentileOf(sorted, 0.25),
    median: percentileOf(sorted, 0.5),
    q3: percentileOf(sorted, 0.75),
    max: sorted[sorted.length - 1],
  }
}
