import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Sidebar from './components/Sidebar'
import GamesSection from './components/Sections/GamesSection'
import ShopSection from './components/Sections/ShopSection'
import { useGameStore } from './stores/GameStore'
import LoadingScreen from './components/LoadingScreen'
import { UpdateNotification } from './components/UpdateNotification'
import { AppTitle } from './parts/appTitle'
import { MenuItem } from './parts/menuItem'
import { BookOpenIcon, Bug, House, Menu, Minus, Search, Square, X } from 'lucide-react'
import { AppButton } from './parts/appButton'
import { ScrollContent } from './parts/scrollContent'

import { SearchOverlay } from './parts/searchOverlay'
import { LibrariesPage } from './pages/libraries'
import GamePage from './pages/games'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('libraries')
  const { games, libraries, isLoading, error, loadGames } = useGameStore()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Load games on mount
  useEffect(() => {
    if (games.length === 0 && !isLoading) {
      loadGames()
    }

    window.onkeyup = (e) => {
      if (e.key === 'k' && e.ctrlKey) {
        openSearch()
      }

      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
  }, [games.length, isLoading, loadGames])


  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      document.getElementById('search-input')?.focus();
    }, 100);
  }

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
        return <GamePage games={games} />
      case 'shop':
        return <ShopSection />
      case 'libraries':
        return <LibrariesPage libraries={libraries} />
      default:
        return <GamesSection games={games} />
    }
  }


  return (
    <div className='text-white bg-primary h-screen relative sm:pl-16 lg:pl-[256px] flex flex-col select-none overflow-hidden'>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 sm:-left-24 lg:left-24 w-80 h-80 bg-accent/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      </div>


      <div className='px-2 lg:px-4 flex items-center justify-between drag bg-primary/80 backdrop-blur-lg border-b border-white/10 h-16 z-1 fixed right-0 left-0 sm:left-16 lg:left-64'>
        <div className='flex items-center gap-2'>
          <AppButton Icon={Menu} onClick={() => setIsMobileMenuOpen(true)} className='sm:hidden' />

          <div className='no-drag bg-white/10 rounded-full h-10 min-w-10 lg:px-4 sm:w-auto cursor-pointer flex items-center justify-center gap-2 hover:bg-white/20' onClick={() => openSearch()}>
            <Search className='size-4' />


            <div className='hidden lg:block text-xs text-white/70'>
              CTRL + K
            </div>
          </div>

          <AppButton Icon={Bug} onClick={() => window.electronAPI?.toggleDevTools()} customColor='yellow' />
        </div>

        <div className='h-16 flex-1 sm:w-auto flex items-center justify-center drag font-quicksand text-xl font-semibold text-white/70 capitalize drag'>
          {activeSection}
        </div>

        <div className='flex items-center gap-2'>
          <AppButton Icon={Minus} onClick={() => window.electronAPI?.minimize()} customColor='yellow' />
          <AppButton Icon={Square} onClick={() => window.electronAPI?.maximize()} customColor='green' />
          <AppButton Icon={X} onClick={() => window.electronAPI?.close()} customColor='red' />
        </div>
      </div>

      <ScrollContent>
        {renderContent()}
      </ScrollContent>



      {/* Sidebar */}
      <div className={`absolute z-2 inset-y-0 left-0 w-full sm:w-16 lg:w-[256px] flex flex-col 
        bg-secondary/80 backdrop-blur-xl sm:bg-secondary sm:backdrop-blur-none no-drag
        ${isMobileMenuOpen ? 'translate-x-0 transition-transform duration-300' :
          '-translate-x-full sm:translate-x-0 lg:translate-x-0 transition-none'} `}>

        {/* App title & logo */}
        <AppTitle setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Menu */}
        <div className='flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-2 lg:p-4 space-y-2'>
          <MenuItem
            Icon={BookOpenIcon}
            Label='Libraries'
            Active={activeSection === 'libraries'}
            onClick={() => setActiveSection('libraries')} />
            
          <MenuItem
            Icon={House}
            Label='Games'
            Active={activeSection === 'games'}
            onClick={() => setActiveSection('games')} />

        </div>
      </div>


      {/* Search popup */}
      {isSearchOpen && (
        <SearchOverlay onClose={() => setIsSearchOpen(false)} onSearch={() => { }} games={games} />
      )}


<UpdateNotification />

    </div>
  )
  return (
    <>
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
      <UpdateNotification />
    </>
  )
}
