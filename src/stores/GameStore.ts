import { Game, LibraryList } from '../libraries/Library'
import { useFavorites } from '../hooks/useFavorites'
import { useState, useEffect } from 'react'

interface GameStoreState {
  games: Game[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

class GameStore {
  private static instance: GameStore
  private state: GameStoreState = {
    games: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  }
  private listeners: Set<(state: GameStoreState) => void> = new Set()

  private constructor() {}

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

    try {
      console.log('Loading games from all libraries...')
      let allGames: Game[] = []

      for (const library of LibraryList) {
        try {
          console.log(`Loading games from ${library.constructor.name}...`)
          const gamesFromLibrary = await library.List()
          allGames.push(...gamesFromLibrary)
          console.log(`Loaded ${gamesFromLibrary.length} games from ${library.constructor.name}`)
        } catch (error) {
          console.error(`Error loading games from ${library.constructor.name}:`, error)
        }
      }

      console.log(`Total games loaded: ${allGames.length}`)
      
      setTimeout(() => {
        this.setState({
          games: allGames,
          isLoading: false,
          lastUpdated: new Date()
        })
      }, 1000)
    } catch (error) {
      console.error('Error loading games:', error)
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
    const term = searchTerm.toLowerCase()
    return this.state.games.filter(game => 
      game.Name?.toLowerCase().includes(term) ||
      game.ExternalId.toLowerCase().includes(term)
    )
  }

  // Refresh games
  async refreshGames(): Promise<void> {
    await this.loadGames()
  }

  // Clear games
  clearGames(): void {
    this.setState({
      games: [],
      lastUpdated: null
    })
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