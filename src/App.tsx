import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Sidebar from './components/Sidebar'
import GamesSection from './components/Sections/GamesSection'
import ShopSection from './components/Sections/ShopSection'
import { useGameStore } from './stores/GameStore'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('games')
  const { games, isLoading, error, loadGames } = useGameStore()

  // Load games on mount
  useEffect(() => {
    if (games.length === 0 && !isLoading) {
      loadGames()
    }
  }, [games.length, isLoading, loadGames])

  // Show loading screen globally
  if (isLoading) {
    return <LoadingScreen />
  }

  // Show error globally
  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">Erreur de chargement</h2>
          <p className="text-white/70">{error}</p>
          <button 
            onClick={loadGames}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'games':
        return <GamesSection games={games} />
      case 'shop':
        return <ShopSection />
      default:
        return <GamesSection games={games} />
    }
  }

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      activeSection={activeSection}
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      {renderContent()}
    </Layout>
  )
}
