import { AuthProvider, useAuth } from './auth/AuthContext'
import { LoginScreen } from './auth/LoginScreen'
import { Dashboard } from './dashboard/Dashboard'

function Gate() {
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

  return <Dashboard />
}

function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}

export default App
