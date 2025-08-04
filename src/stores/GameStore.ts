import { Game, LibraryList } from '../libraries/Library'
import { useFavorites } from '../hooks/useFavorites'
import { useState, useEffect } from 'react'
import { captureError, captureMessage, setTag } from '../utils/sentry'

interface GameStoreState {
  games: Game[],
  libraries: GameStoreLibrary[],
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}


export interface GameStoreLibrary {
  name: string,
  logo: React.ReactNode,
  colors: string[],
  games: Game[],
}


class GameStore {
  private static instance: GameStore
  private state: GameStoreState = {
    games: [],
    libraries: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  }
  private listeners: Set<(state: GameStoreState) => void> = new Set()

  private constructor() {}

  // Méthode utilitaire pour capturer les erreurs Sentry
  private captureStoreError(error: unknown, context: string, additionalData?: Record<string, any>) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    
    captureError(errorObj, {
      context: `GameStore - ${context}`,
      storeState: {
        gamesCount: this.state.games.length,
        librariesCount: this.state.libraries.length,
        isLoading: this.state.isLoading,
        hasError: !!this.state.error,
        lastUpdated: this.state.lastUpdated?.toISOString()
      },
      ...additionalData
    })
  }

  // Méthode utilitaire pour capturer les actions du store
  private captureStoreAction(action: string, data?: Record<string, any>) {
    captureMessage(`GameStore: ${action}`, 'info')
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        setTag(`action_${key}`, String(value))
      })
    }
  }

  static getInstance(): GameStore {
    if (!GameStore.instance) {
      GameStore.instance = new GameStore()
    }
    return GameStore.instance
  }

  // Subscribe to store changes
  subscribe(listener: (state: GameStoreState) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach(listener => listener(this.state))
  }

  // Update state and notify listeners
  private setState(updates: Partial<GameStoreState>) {
    this.state = { ...this.state, ...updates }
    this.notify()
  }

  // Load all games from all libraries
  async loadGames(): Promise<void> {
    if (this.state.isLoading) return

    this.setState({ isLoading: true, error: null })

    // Capturer le début du chargement
    this.captureStoreAction('Starting games loading process', { operation: 'games_load' })

    try {
      console.log('Loading games from all libraries...')
      let allGames: Game[] = []
      let successfulLibraries = 0
      let failedLibraries = 0

      for (const library of LibraryList) {
        try {
          console.log(`Loading games from ${library.constructor.name}...`)
          let gamesFromLibrary: Game[] = [];
          
          try {
            gamesFromLibrary = await library.List()
            successfulLibraries++
            
            // Capturer le succès de chaque bibliothèque
            captureMessage(`GameStore: Successfully loaded ${gamesFromLibrary.length} games from ${library.constructor.name}`, 'info')
            setTag(`library_${library.constructor.name.toLowerCase()}`, 'success')
            
          } catch (error) {
            failedLibraries++
            console.error(`Error loading games from ${library.constructor.name}:`, error)
            
            // Capturer l'erreur de chaque bibliothèque
            this.captureStoreError(error, 'Library Loading Error', {
              library: library.constructor.name,
              gamesLoaded: gamesFromLibrary.length,
              errorType: 'library_load_failed'
            })
            setTag(`library_${library.constructor.name.toLowerCase()}`, 'failed')
          }
          
          this.setState({
            libraries: [...this.state.libraries, {
              name: library.constructor.name,
              logo: library.Logo,
              games: gamesFromLibrary,
              colors: library.Colors
            }]
          })
          allGames.push(...gamesFromLibrary)
          console.log(`Loaded ${gamesFromLibrary.length} games from ${library.constructor.name}`)
          
        } catch (error) {
          failedLibraries++
          console.error(`Error loading games from ${library.constructor.name}:`, error)
          
          // Capturer l'erreur de configuration de bibliothèque
          this.captureStoreError(error, 'Library Configuration Error', {
            library: library.constructor.name,
            errorType: 'library_config_failed'
          })
          setTag(`library_${library.constructor.name.toLowerCase()}`, 'config_failed')
        }
      }

      console.log(`Total games loaded: ${allGames.length}`)
      
      // Capturer les statistiques finales
      captureMessage(`GameStore: Loading completed - ${allGames.length} total games, ${successfulLibraries} successful libraries, ${failedLibraries} failed libraries`, 'info')
      setTag('total_games_loaded', allGames.length.toString())
      setTag('successful_libraries', successfulLibraries.toString())
      setTag('failed_libraries', failedLibraries.toString())
      
      setTimeout(() => {
        this.setState({
          games: allGames,
          isLoading: false,
          lastUpdated: new Date()
        })
      }, 1000)
      
    } catch (error) {
      console.error('Error loading games:', error)
      
      // Capturer l'erreur générale de chargement
      this.captureStoreError(error, 'General Loading Error', {
        errorType: 'general_load_failed'
      })
      
      this.setState({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      })
    }
  }

  // Get current state
  getState(): GameStoreState {
    return { ...this.state }
  }

  // Get games with favorites status
  getGamesWithFavorites(): Game[] {
    const { favorites } = useFavorites()
    return this.state.games.map(game => ({
      ...game,
      isFavorite: favorites.includes(game.ExternalId)
    }))
  }

  // Get games by library
 /* getGamesByLibrary(libraryName: string): Game[] {
    return this.state.games.filter(game => {
      // This is a simplified filter - you might want to add a library property to Game
      return true // For now, return all games
    })
  }*/

  // Get favorite games
  getFavoriteGames(): Game[] {
    const { favorites } = useFavorites()
    return this.state.games.filter(game => favorites.includes(game.ExternalId))
  }

  // Get games by search term
  searchGames(searchTerm: string): Game[] {
    try {
      const term = searchTerm.toLowerCase()
      const results = this.state.games.filter(game => 
        game.Name?.toLowerCase().includes(term) ||
        game.ExternalId.toLowerCase().includes(term)
      )
      
      // Capturer les statistiques de recherche
      captureMessage(`GameStore: Search performed for "${searchTerm}" - ${results.length} results found`, 'info')
      setTag('search_term', searchTerm)
      setTag('search_results_count', results.length.toString())
      setTag('total_games_available', this.state.games.length.toString())
      
      return results
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        context: 'GameStore - Search Error',
        searchTerm,
        errorType: 'search_failed'
      })
      return []
    }
  }

  // Refresh games
  async refreshGames(): Promise<void> {
    try {
      captureMessage('GameStore: Starting games refresh', 'info')
      setTag('operation', 'games_refresh')
      
      await this.loadGames()
      
      captureMessage('GameStore: Games refresh completed successfully', 'info')
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        context: 'GameStore - Refresh Error',
        errorType: 'refresh_failed'
      })
      throw error
    }
  }

  // Clear games
  clearGames(): void {
    try {
      const gamesCount = this.state.games.length
      const librariesCount = this.state.libraries.length
      
      captureMessage(`GameStore: Clearing ${gamesCount} games and ${librariesCount} libraries`, 'info')
      setTag('operation', 'games_clear')
      setTag('games_cleared', gamesCount.toString())
      setTag('libraries_cleared', librariesCount.toString())
      
      this.setState({
        games: [],
        lastUpdated: null
      })
      
      captureMessage('GameStore: Games cleared successfully', 'info')
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        context: 'GameStore - Clear Error',
        errorType: 'clear_failed'
      })
      throw error
    }
  }
}

// Export singleton instance
export const gameStore = GameStore.getInstance()

// React hook for using the store
export function useGameStore() {
  const [state, setState] = useState<GameStoreState>(gameStore.getState())

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(setState)
    return unsubscribe
  }, [])

  return {
    ...state,
    loadGames: () => gameStore.loadGames(),
    refreshGames: () => gameStore.refreshGames(),
    getGamesWithFavorites: () => gameStore.getGamesWithFavorites(),
    getFavoriteGames: () => gameStore.getFavoriteGames(),
    searchGames: (term: string) => gameStore.searchGames(term),
    clearGames: () => gameStore.clearGames()
  }
} 