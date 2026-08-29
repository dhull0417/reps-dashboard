import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { CategoryScoreRanked } from '../lib/types'

interface CategoryScores {
  scores: CategoryScoreRanked[]
  loading: boolean
  error: string | null
}

export function useCategoryScores(playerId: string | undefined): CategoryScores {
  const [scores, setScores] = useState<CategoryScoreRanked[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playerId) return
    let active = true
    setLoading(true)
    setError(null)

    supabase
      .from('category_scores_ranked')
      .select('*')
      .eq('player_id', playerId)
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setError(error.message)
        } else {
          setScores(data ?? [])
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [playerId])

  return { scores, loading, error }
}
