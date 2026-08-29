import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { CategoryScoreRanked, Subcategory, TestResultRanked } from '../lib/types'

export interface SubcategoryRowData {
  subcategory: Subcategory
  raw_value: number | null
  rank: number | null
  percentile: number | null
}

interface CategoryData {
  categoryScore: CategoryScoreRanked | null
  subcategoryRows: SubcategoryRowData[]
  loading: boolean
  error: string | null
}

export function useCategoryData(
  playerId: string | undefined,
  categoryId: string | undefined
): CategoryData {
  const [categoryScore, setCategoryScore] = useState<CategoryScoreRanked | null>(null)
  const [subcategoryRows, setSubcategoryRows] = useState<SubcategoryRowData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playerId || !categoryId) return
    let active = true
    setLoading(true)
    setError(null)
    setCategoryScore(null)
    setSubcategoryRows([])

    async function load() {
      const [scoreRes, subcatRes] = await Promise.all([
        supabase
          .from('category_scores_ranked')
          .select('*')
          .eq('player_id', playerId)
          .eq('category_id', categoryId)
          .single(),
        supabase
          .from('subcategories')
          .select('*')
          .eq('category_id', categoryId)
          .order('display_order'),
      ])

      if (!active) return

      if (scoreRes.error) setError(scoreRes.error.message)
      else setCategoryScore(scoreRes.data)

      const subcategories: Subcategory[] = subcatRes.data ?? []
      if (subcatRes.error) {
        setError((prev) => prev ?? subcatRes.error!.message)
        setSubcategoryRows([])
        setLoading(false)
        return
      }

      if (subcategories.length === 0) {
        setSubcategoryRows([])
        setLoading(false)
        return
      }

      const subcategoryIds = subcategories.map((s) => s.id)
      const resultsRes = await supabase
        .from('test_results_ranked')
        .select('*')
        .eq('player_id', playerId)
        .in('subcategory_id', subcategoryIds)

      if (!active) return

      if (resultsRes.error) {
        setError((prev) => prev ?? resultsRes.error!.message)
      }

      const resultsBySubcat = new Map<string, TestResultRanked>(
        (resultsRes.data ?? []).map((r) => [r.subcategory_id, r])
      )

      setSubcategoryRows(
        subcategories.map((subcategory) => {
          const result = resultsBySubcat.get(subcategory.id)
          return {
            subcategory,
            raw_value: result?.raw_value ?? null,
            rank: result?.rank ?? null,
            percentile: result?.percentile ?? null,
          }
        })
      )
      setLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [playerId, categoryId])

  return { categoryScore, subcategoryRows, loading, error }
}
