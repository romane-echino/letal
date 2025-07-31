import { useState, useEffect, useCallback } from 'react'

interface UpdateStatus {
  status: 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error'
  message: string
  progress?: any
  info?: any
  error?: string
}

export const useAutoUpdater = () => {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    status: 'idle',
    message: ''
  })

  const checkForUpdates = useCallback(async () => {
    try {
      setUpdateStatus({ status: 'checking', message: 'Vérification des mises à jour...' })
      const result = await window.electronAPI.checkForUpdates()
      
      if (result.available) {
        setUpdateStatus({ 
          status: 'available', 
          message: 'Mise à jour disponible !' 
        })
      } else {
        setUpdateStatus({ 
          status: 'not-available', 
          message: 'Aucune mise à jour disponible' 
        })
      }
    } catch (error) {
      setUpdateStatus({ 
        status: 'error', 
        message: 'Erreur lors de la vérification', 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      })
    }
  }, [])

  const downloadUpdate = useCallback(async () => {
    try {
      setUpdateStatus({ status: 'downloading', message: 'Téléchargement en cours...' })
      const result = await window.electronAPI.downloadUpdate()
      
      if (result.success) {
        setUpdateStatus({ 
          status: 'downloaded', 
          message: 'Mise à jour téléchargée et prête à installer' 
        })
      } else {
        setUpdateStatus({ 
          status: 'error', 
          message: 'Erreur lors du téléchargement', 
          error: result.error 
        })
      }
    } catch (error) {
      setUpdateStatus({ 
        status: 'error', 
        message: 'Erreur lors du téléchargement', 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      })
    }
  }, [])

  const installUpdate = useCallback(async () => {
    try {
      await window.electronAPI.installUpdate()
    } catch (error) {
      setUpdateStatus({ 
        status: 'error', 
        message: 'Erreur lors de l\'installation', 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      })
    }
  }, [])

  useEffect(() => {
    // Écouter les événements de mise à jour depuis le processus principal
    const handleUpdateStatus = (_event: any, status: UpdateStatus) => {
      setUpdateStatus(status)
    }

    window.electronAPI.onUpdateStatus(handleUpdateStatus)

    // Vérifier les mises à jour au démarrage (seulement en production)
    if (!import.meta.env.DEV) {
      setTimeout(() => {
        checkForUpdates()
      }, 5000) // Attendre 5 secondes après le démarrage
    }

    return () => {
      // Cleanup si nécessaire
    }
  }, [checkForUpdates])

  return {
    updateStatus,
    checkForUpdates,
    downloadUpdate,
    installUpdate
  }
} 