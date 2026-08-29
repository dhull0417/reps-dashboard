export interface Player {
  id: string
  name: string
  photo_url?: string | null
  athleticism_percentile: number
  shooting_percentile: number
  skills_percentile: number
  weighted_score: number
  reps_rating: number
  reps_conversion_rating: number
  shots_taken_season?: number | null
  reps_done?: number | null
  training_time_minutes?: number | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  display_order: number
}

export interface Subcategory {
  id: string
  category_id: string
  name: string
  unit: string
  lower_is_better: boolean
  display_order: number
}

export interface RawComponents {
  raw_time_sec: number
  mistakes: number
}

export interface TestResult {
  id: string
  player_id: string
  subcategory_id: string
  raw_value: number
  raw_components: RawComponents | null
  created_at: string
}

export interface DashboardUser {
  id: string
  player_id: string
  display_name: string
}

export interface TestResultRanked {
  player_id: string
  subcategory_id: string
  raw_value: number
  rank: number
  percentile: number
}

export interface CategoryScoreRanked {
  player_id: string
  category_id: string
  percentile: number
  rank: number
}

export interface OverallRanking {
  player_id: string
  weighted_score: number
  reps_rating: number
  reps_conversion_rating: number
  overall_rank: number
}

export type DistributionTarget =
  | {
      kind: 'subcategory'
      subcategoryId: string
      label: string
      unit: string
      lowerIsBetter: boolean
      playerValue: number
      playerRank: number
      playerPercentile: number
    }
  | {
      kind: 'category'
      categoryId: string
      label: string
      playerValue: number
      playerRank: number
      playerPercentile: number
    }
