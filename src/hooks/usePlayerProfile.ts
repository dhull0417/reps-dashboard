import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Player, OverallRanking } from '../lib/types'

interface PlayerProfile {
  player: Player | null
  overallRanking: OverallRanking | null
  loading: boolean
  error: string | null
}

export function usePlayerProfile(playerId: string | undefined): PlayerProfile {
  const [player, setPlayer] = useState<Player | null>(null)
  const [overallRanking, setOverallRanking] = useState<OverallRanking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playerId) return
    let active = true
    setLoading(true)
    setError(null)

    Promise.all([
      supabase.from('players').select('*').eq('id', playerId).single(),
      supabase.from('overall_rankings').select('*').eq('player_id', playerId).single(),
    ]).then(([playerRes, rankingRes]) => {
      if (!active) return
      if (playerRes.error) {
        setError(playerRes.error.message)
      } else {
        setPlayer(playerRes.data)
      }
      if (rankingRes.error) {
        setError((prev) => prev ?? rankingRes.error.message)
      } else {
        setOverallRanking(rankingRes.data)
      }
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [playerId])

  return { player, overallRanking, loading, error }
}
