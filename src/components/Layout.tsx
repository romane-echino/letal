import { ReactNode } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import WindowControls from './WindowControls'
import { SearchIcon } from 'lucide-react'


interface LayoutProps {
  children: ReactNode
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeSection: string
}

export default function Layout({ children, sidebarOpen, setSidebarOpen, activeSection }: LayoutProps) {
  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/40 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/40 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 relative z-10 flex flex-col">
        {/* Top bar */}
        <div className="fixed right-0 left-0 lg:left-64 -top-px z-40 bg-primary/80 backdrop-blur-lg border-b border-white/10" >
          <div className="flex items-center justify-between h-16 px-2 sm:px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="flex-1 flex items-center gap-4 pl-2">
              <div className='flex items-center gap-2 relative bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 text-white'>
                <input type="text" placeholder='Search for a game' className='pl-6 pr-8 outline-none text-sm' />

                <SearchIcon className='w-4 h-4 absolute left-3' />

                <div className='absolute right-2'>
                  <div className='bg-primary rounded-full px-2 py-1 text-xs text-white/70'>CTRL + K</div>
                </div>
              </div>

              <h1 className="text-xl font-semibold text-white capitalize text-center font-quicksand  drag-handle grow ">{activeSection}</h1>




            </div>
            {/* Window controls */}
            <WindowControls />
          </div>
        </div>

        {/* Content */}
        <main className="px-6 pt-20 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
} 