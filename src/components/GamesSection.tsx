import { useState, useEffect } from 'react'
import { Game } from '../libraries/Library'
import GameCard from './GameCard'
import SortOptions, { SortOption } from './SortOptions'
import { sortGames } from '../utils/sortUtils'
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useGameStore } from '../stores/GameStore'
import LoadingScreen from './LoadingScreen'

export default function GamesSection() {
  const [currentSort, setCurrentSort] = useState<SortOption>('recent')
  const [sortedGames, setSortedGames] = useState<Game[]>([])
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const { favorites, toggleFavorite } = useFavorites()
  const { games, isLoading, error, loadGames } = useGameStore()

  // Load games on mount
  useEffect(() => {
    if (games.length === 0 && !isLoading) {
      loadGames()
    }
  }, [games.length, isLoading, loadGames])

  // Sort games when games, sort, or favorites change
  useEffect(() => {
    if (games.length > 0) {
      let gamesWithFavorites = games.map(game => ({
        ...game,
        isFavorite: favorites.includes(game.ExternalId)
      }))
      
      let sorted = sortGames(gamesWithFavorites, currentSort)
      if (sortDirection === 'desc') {
        sorted = sorted.reverse()
      }
      setSortedGames(sorted)
    }
  }, [games, currentSort, sortDirection, favorites])

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen />
  }

  // Show error
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Mes jeux</h2>
          {games.length > 0 && (
            <span className="text-white/50 text-sm">
              {games.length} jeu{games.length > 1 ? 'x' : ''} trouvé{games.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <div className='px-4 py-2 h-10 bg-white/10 backdrop-blur-xl rounded-lg text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center cursor-pointer' 
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
          {sortDirection === 'asc' ?
            <ArrowDownAZ className='size-4' />
            : <ArrowUpAZ className='size-4' />
          }
          </div>
        
          <SortOptions currentSort={currentSort} onSortChange={setCurrentSort} />
        </div>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/50">Aucun jeu trouvé</p>
          <button 
            onClick={loadGames}
            className="mt-4 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
          >
            Recharger
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedGames.map((game) => (
            <GameCard 
              key={game.ExternalId} 
              game={game} 
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
} 