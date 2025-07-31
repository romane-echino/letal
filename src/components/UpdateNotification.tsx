import React from 'react'
import { useAutoUpdater } from '../hooks/useAutoUpdater'
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export const UpdateNotification: React.FC = () => {
  const { updateStatus, checkForUpdates, downloadUpdate, installUpdate } = useAutoUpdater()

  // Ne pas afficher si l'état est idle ou not-available
  if (updateStatus.status === 'idle' || updateStatus.status === 'not-available') {
    return null
  }

  const getStatusIcon = () => {
    switch (updateStatus.status) {
      case 'checking':
        return <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-500" />
      case 'available':
        return <ArrowDownTrayIcon className="w-5 h-5 text-green-500" />
      case 'downloading':
        return <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-500" />
      case 'downloaded':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getActionButton = () => {
    switch (updateStatus.status) {
      case 'available':
        return (
          <button
            onClick={downloadUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Télécharger
          </button>
        )
      case 'downloaded':
        return (
          <button
            onClick={installUpdate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Installer maintenant
          </button>
        )
      case 'error':
        return (
          <button
            onClick={checkForUpdates}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Réessayer
          </button>
        )
      default:
        return null
    }
  }

  const getProgressBar = () => {
    if (updateStatus.status === 'downloading' && updateStatus.progress) {
      const percent = Math.round(updateStatus.progress.percent || 0)
      return (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${percent}%` }}
          />
        </div>
      )
    }
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getStatusIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">
            {updateStatus.message}
          </p>
          {updateStatus.error && (
            <p className="text-xs text-red-400 mt-1">
              {updateStatus.error}
            </p>
          )}
          {getProgressBar()}
        </div>
        <div className="flex-shrink-0">
          {getActionButton()}
        </div>
      </div>
    </div>
  )
} 