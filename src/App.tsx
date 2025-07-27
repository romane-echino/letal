import { useState } from 'react'
import Layout from './components/Layout'
import Sidebar from './components/Sidebar'
import GamesSection from './components/GamesSection'
import ShopSection from './components/ShopSection'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('games')

  const renderContent = () => {
    switch (activeSection) {
      case 'games':
        return <GamesSection />
      case 'shop':
        return <ShopSection />
      default:
        return <GamesSection />
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
