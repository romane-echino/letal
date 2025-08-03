import { 
  ShoppingBagIcon, 
  XMarkIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { House } from 'lucide-react'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection }: SidebarProps) {
  const navigation = [
    { name: 'Games', href: '#games', icon: House, current: activeSection === 'games' },
    { name: 'Shop', href: '#shop', icon: ShoppingBagIcon, current: activeSection === 'shop' },
    { name: 'Library', href: '#library', icon: BookOpenIcon, current: activeSection === 'library' },
  ]

  return (
    <div className={`fixed  inset-y-0 left-0 z-50 w-64 bg-secondary backdrop-blur-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10 drag-handle">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 p-1 flex items-center justify-center animate-glow">
              <img src="icon.png" alt="Letal" className='w-full h-full object-cover' />
            </div>
            <span className="text-2xl font-normal text-white font-bebas pt-1">Letal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="cursor-pointer lg:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveSection(item.name.toLowerCase())}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 font-quicksand ${
                item.current
                  ? 'bg-gradient-to-r from-purple-500/60 to-accent/80 text-white shadow-bloom animate-glow'
                  : 'text-white/70 hover:text-white hover:bg-white/10 hover:shadow-bloom'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>

        {/* Profile Menu 
        <div className="p-4 border-t border-white/10">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center w-full px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-bloom">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 animate-glow">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-white/50">Premium Member</p>
              </div>
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute bottom-full left-0 mb-2 w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-bloom-lg">
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button className={`flex items-center w-full px-4 py-2 text-sm text-white/70 hover:text-white transition-all duration-200 ${active ? 'bg-white/10' : ''}`}>
                        <CogIcon className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button className={`flex items-center w-full px-4 py-2 text-sm text-white/70 hover:text-white transition-all duration-200 ${active ? 'bg-white/10' : ''}`}>
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        */}
      </div>
    </div>
  )
} 