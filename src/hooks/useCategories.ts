import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Category } from '../lib/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase
      .from('categories')
      .select('*')
      .order('display_order')
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) setCategories(data)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { categories, loading }
}
