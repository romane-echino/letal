import { useEffect, useState } from "react"
import { Game } from "../libraries/Library"
import SortOptions, { SortOption } from "../components/SortOptions"
import { useFavorites } from "../hooks/useFavorites"
import { sortGames } from "../utils/sortUtils"
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react"
import { GameCard } from "../parts/gameCard"

interface GamesPageProps {
    games: Game[]
}

export default function GamePage({ games }: GamesPageProps) {
    const [currentSort, setCurrentSort] = useState<SortOption>('recent')
    const [sortedGames, setSortedGames] = useState<Game[]>(games)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const { favorites } = useFavorites()

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

    const favoriteGames = sortedGames.filter(game => game.isFavorite)
    const regularGames = sortedGames.filter(game => !game.isFavorite)

    return (
        <div className="space-y-6">
            {/* Favorites Section */}
            {favoriteGames.length > 0 && (
                <>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-white font-quicksand">Favoris</h2>
                            <span className="text-white/50 text-sm">
                                {favoriteGames.length} jeu{favoriteGames.length > 1 ? 'x' : ''} favori{favoriteGames.length > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favoriteGames.map((game) => (
                            <GameCard
                                key={game.ExternalId}
                                game={game}
                            />


                        ))}
                    </div>
                </>
            )}

            {/* All Games Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white font-quicksand">Mes jeux</h2>
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
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {regularGames.map((game) => (
                        <GameCard
                            key={game.ExternalId}
                            game={game}
                        />
                    ))}
                </div>
            )}
        </div>
    )
} 