import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import type { DashboardUser } from '../lib/types'

interface AuthContextValue {
  session: Session | null
  dashboardUser: DashboardUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [dashboardUser, setDashboardUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active) setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const userId = session?.user.id
    if (!userId) {
      setDashboardUser(null)
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)

    supabase
      .from('dashboard_users')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          console.error('Failed to load dashboard_users row', error)
          setDashboardUser(null)
        } else {
          setDashboardUser(data)
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [session?.user.id])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, dashboardUser, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
