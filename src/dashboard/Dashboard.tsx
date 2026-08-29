import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCategories } from '../hooks/useCategories'
import { usePlayerProfile } from '../hooks/usePlayerProfile'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { GeneralTab } from './GeneralTab'
import { CategoryTab } from './CategoryTab'
import { DistributionPanel } from './DistributionPanel'
import { Loading, ErrorState } from '../components/ui/Loading'
import type { DistributionTarget } from '../lib/types'

export function Dashboard() {
  const navigate = useNavigate()
  const { dashboardUser, signOut } = useAuth()
  const { categories, loading: categoriesLoading } = useCategories()
  const {
    player,
    overallRanking,
    loading: profileLoading,
    error: profileError,
  } = usePlayerProfile(dashboardUser?.player_id)

  const [activeTab, setActiveTab] = useState('general')
  const [activeDistribution, setActiveDistribution] = useState<DistributionTarget | null>(null)

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'general') {
      setActiveDistribution(null)
    }
  }

  if (!dashboardUser) {
    return (
      <div className="full-page-status">
        <ErrorState message="No player is linked to this account." />
        <button type="button" className="login-submit" onClick={signOut}>
          Sign Out
        </button>
      </div>
    )
  }

  const activeCategory = categories.find((c) => c.id === activeTab) ?? null

  return (
    <div className="dashboard-shell">
      <Sidebar categories={categories} activeTab={activeTab} onSelectTab={handleSelectTab} />
      <div className="dashboard-main">
        <Header
          playerName={player?.name ?? dashboardUser.display_name}
          photoUrl={player?.photo_url}
          repsRating={overallRanking?.reps_rating}
          shotsTaken={player?.shots_taken_season}
          repsDone={player?.reps_done}
          trainingTimeMinutes={player?.training_time_minutes}
          onSignOut={signOut}
          onPrint={() => navigate('/print')}
        />
        <div className="dashboard-body">
          <div className="dashboard-content">
            {categoriesLoading ? (
              <Loading />
            ) : activeTab === 'general' ? (
              <GeneralTab
                player={player}
                overallRanking={overallRanking}
                categories={categories}
                loading={profileLoading}
                error={profileError}
              />
            ) : activeCategory ? (
              <CategoryTab
                playerId={dashboardUser.player_id}
                playerName={player?.name ?? dashboardUser.display_name}
                category={activeCategory}
                activeDistribution={activeDistribution}
                onSelectDistribution={setActiveDistribution}
              />
            ) : (
              <ErrorState message="Category not found." />
            )}
          </div>

          {activeDistribution && <DistributionPanel target={activeDistribution} />}
        </div>
      </div>
    </div>
  )
}
