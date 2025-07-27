import { useState, useEffect } from 'react'
import { Game } from '../../libraries/Library'
import GameCard from '../GameCard'
import SortOptions, { SortOption } from '../SortOptions'
import { sortGames } from '../../utils/sortUtils'
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites'

interface GamesSectionProps {
  games: Game[]
}

export default function GamesSection({ games }: GamesSectionProps) {
  const [currentSort, setCurrentSort] = useState<SortOption>('recent')
  const [sortedGames, setSortedGames] = useState<Game[]>(games)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    let sortedGames = sortGames(games, currentSort);

    sortedGames = sortedGames.map(game => {
      return {
        ...game,
        isFavorite: favorites.includes(game.ExternalId)
      }
    })

    if (sortDirection === 'desc') {
      sortedGames = sortedGames.reverse()
    }
    setSortedGames(sortedGames)
  }, [games, currentSort, sortDirection, favorites])

  return (
    <div className="space-y-6">

      {favorites.length > 0 && (
        <>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white font-quicksand">Favorites</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedGames.filter(game => game.isFavorite).map((game, index) => (
            <GameCard
              key={game.ExternalId}
              game={game}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
        </>
      )}


      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white font-quicksand">My games</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedGames.filter(game => !game.isFavorite).map((game, index) => (
          <GameCard
            key={game.ExternalId}
            game={game}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  )
} 