import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { computeQuartiles, type QuartileStats } from '../lib/quartiles'
import type { Category, CategoryScoreRanked, Subcategory, TestResultRanked } from '../lib/types'

export interface PrintSubcategoryRow {
  subcategory: Subcategory
  raw_value: number | null
  rank: number | null
  percentile: number | null
  stats: QuartileStats | null
}

export interface PrintCategoryRow {
  category: Category
  categoryScore: CategoryScoreRanked | null
  categoryStats: QuartileStats | null
  subcategoryRows: PrintSubcategoryRow[]
}

interface PrintReportData {
  rows: PrintCategoryRow[] | null
  loading: boolean
  error: string | null
}

export function usePrintReport(playerId: string | undefined): PrintReportData {
  const [rows, setRows] = useState<PrintCategoryRow[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playerId) return
    let active = true
    setLoading(true)
    setError(null)
    setRows(null)

    async function load() {
      const [
        categoriesRes,
        subcategoriesRes,
        myCategoryScoresRes,
        allCategoryScoresRes,
        myTestResultsRes,
        allTestResultsRes,
      ] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('subcategories').select('*').order('display_order'),
        supabase.from('category_scores_ranked').select('*').eq('player_id', playerId),
        supabase.from('category_scores_ranked').select('category_id, percentile'),
        supabase.from('test_results_ranked').select('*').eq('player_id', playerId),
        supabase.from('test_results_ranked').select('subcategory_id, raw_value'),
      ])

      if (!active) return

      const firstError =
        categoriesRes.error ||
        subcategoriesRes.error ||
        myCategoryScoresRes.error ||
        allCategoryScoresRes.error ||
        myTestResultsRes.error ||
        allTestResultsRes.error

      if (firstError) {
        setError(firstError.message)
        setLoading(false)
        return
      }

      const categories: Category[] = categoriesRes.data ?? []
      const subcategories: Subcategory[] = subcategoriesRes.data ?? []

      const myCategoryScores = new Map<string, CategoryScoreRanked>(
        (myCategoryScoresRes.data ?? []).map((s: CategoryScoreRanked) => [s.category_id, s])
      )
      const myTestResults = new Map<string, TestResultRanked>(
        (myTestResultsRes.data ?? []).map((r: TestResultRanked) => [r.subcategory_id, r])
      )

      const categoryPercentilesById = new Map<string, number[]>()
      for (const row of (allCategoryScoresRes.data ?? []) as { category_id: string; percentile: number }[]) {
        const arr = categoryPercentilesById.get(row.category_id) ?? []
        arr.push(row.percentile)
        categoryPercentilesById.set(row.category_id, arr)
      }

      const rawValuesBySubcategoryId = new Map<string, number[]>()
      for (const row of (allTestResultsRes.data ?? []) as { subcategory_id: string; raw_value: number }[]) {
        const arr = rawValuesBySubcategoryId.get(row.subcategory_id) ?? []
        arr.push(row.raw_value)
        rawValuesBySubcategoryId.set(row.subcategory_id, arr)
      }

      const report: PrintCategoryRow[] = categories.map((category) => {
        const categoryValues = categoryPercentilesById.get(category.id) ?? []
        const subcategoryRows: PrintSubcategoryRow[] = subcategories
          .filter((s) => s.category_id === category.id)
          .map((subcategory) => {
            const result = myTestResults.get(subcategory.id)
            const values = rawValuesBySubcategoryId.get(subcategory.id) ?? []
            return {
              subcategory,
              raw_value: result?.raw_value ?? null,
              rank: result?.rank ?? null,
              percentile: result?.percentile ?? null,
              stats: values.length > 0 ? computeQuartiles(values) : null,
            }
          })

        return {
          category,
          categoryScore: myCategoryScores.get(category.id) ?? null,
          categoryStats: categoryValues.length > 0 ? computeQuartiles(categoryValues) : null,
          subcategoryRows,
        }
      })

      setRows(report)
      setLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [playerId])

  return { rows, loading, error }
}
