import { Game } from '../libraries/Library'
import { SortOption } from '../components/SortOptions'

export function sortGames(games: Game[], sortOption: SortOption): Game[] {
  const sortedGames = [...games]

  switch (sortOption) {
    case 'name':
      return sortedGames.sort((a, b) =>
        (a.Name || '').localeCompare(b.Name || '', 'fr', { sensitivity: 'base' })
      )

    case 'size':
      return sortedGames.sort((a, b) => {
        const aSize = parseInt(a.SizeOnDisk || '0')
        const bSize = parseInt(b.SizeOnDisk || '0')

        // Sort by largest first
        return bSize - aSize
      })

    case 'recent':
      return sortedGames.sort((a, b) => {
        const aTime = parseInt(a.LastPlayed || '0')
        const bTime = parseInt(b.LastPlayed || '0')

        // Sort by most recent first, but put never played at the end
        if (aTime === 0 && bTime === 0) return 0
        if (aTime === 0) return 1
        if (bTime === 0) return -1

        return bTime - aTime
      })

    default:
      return sortedGames
  }
} 