import { XMarkIcon, MinusIcon, ArrowsPointingOutIcon, CommandLineIcon } from '@heroicons/react/24/outline'

interface WindowControlsProps {
}

export default function WindowControls({ }: WindowControlsProps) {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimize()
    }
  }

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximize()
    }
  }

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.close()
    }
  }

  const handleToggleDevTools = () => {
    if (window.electronAPI) {
      window.electronAPI.toggleDevTools()
    }
  }

  return (
    <div className={`flex items-center space-x-1`}>
      <button
        onClick={handleToggleDevTools}
        className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
        title="Toggle DevTools"
      >
        <CommandLineIcon className="w-4 h-4" />
      </button>
      <button
        onClick={handleMinimize}
        className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
        title="Minimize"
      >
        <MinusIcon className="w-4 h-4" />
      </button>
      <button
        onClick={handleMaximize}
        className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
        title="Maximize"
      >
        <ArrowsPointingOutIcon className="w-4 h-4" />
      </button>
      <button
        onClick={handleClose}
        className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-red-500/20 rounded transition-all duration-200"
        title="Close"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  )
} 