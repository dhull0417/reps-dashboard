import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { computeQuartiles, type QuartileStats } from '../lib/quartiles'
import type { DistributionTarget } from '../lib/types'

interface Distribution {
  values: number[]
  stats: QuartileStats | null
  loading: boolean
  error: string | null
}

export function useDistribution(target: DistributionTarget | null): Distribution {
  const [values, setValues] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!target) {
      setValues([])
      return
    }

    let active = true
    setLoading(true)
    setError(null)

    const query =
      target.kind === 'subcategory'
        ? supabase
            .from('test_results_ranked')
            .select('raw_value')
            .eq('subcategory_id', target.subcategoryId)
        : supabase
            .from('category_scores_ranked')
            .select('percentile')
            .eq('category_id', target.categoryId)

    query.then(({ data, error }) => {
      if (!active) return
      if (error) {
        setError(error.message)
        setValues([])
      } else {
        const key = target.kind === 'subcategory' ? 'raw_value' : 'percentile'
        setValues((data ?? []).map((row: Record<string, number>) => row[key]))
      }
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [target])

  const stats = values.length > 0 ? computeQuartiles(values) : null

  return { values, stats, loading, error }
}
