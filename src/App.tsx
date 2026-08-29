import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { LoginScreen } from './auth/LoginScreen'
import { Dashboard } from './dashboard/Dashboard'
import { PrintReport } from './dashboard/PrintReport'

function Gate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  if (loading && session) {
    return (
      <div className="full-page-status">
        <span className="spinner" />
      </div>
    )
  }

  if (!session) {
    return <LoginScreen />
  }

  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route
            path="/print"
            element={
              <Gate>
                <PrintReport />
              </Gate>
            }
          />
          <Route
            path="/"
            element={
              <Gate>
                <Dashboard />
              </Gate>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
