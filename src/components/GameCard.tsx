import { HardDrive, Play, Heart } from 'lucide-react'
import { Game } from '../libraries/Library'
import { formatLastPlayed } from '../utils/dateUtils'

interface GameCardProps {
  game: Game
  onToggleFavorite?: (gameId: string) => void
}

export default function GameCard({ game, onToggleFavorite }: GameCardProps) {
  const handlePlayNow = async () => {
    if (game.Path) {
      try {
        if (window.electronAPI) {
          console.log('Launching game:', game.Path)
          const result = await window.electronAPI.launchApp(game.Path)
          if (result.success) {
            console.log('Game launched successfully:', result.message)
          } else {
            console.error('Failed to launch game:', result.error)
          }
        } else {
          // Fallback for web environment
          if (game.Path.startsWith('steam://')) {
            window.open(game.Path, '_blank')
          } else {
            console.log('Cannot launch application in web environment')
          }
        }
      } catch (error) {
        console.error('Error launching game:', error)
      }
    } else {
      console.log('No path available for this game')
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite?.(game.ExternalId)
  }

  return (
    <div className='rounded-xl group cursor-pointer overflow-hidden' onClick={handlePlayNow} onContextMenu={() => onToggleFavorite?.(game.ExternalId)}>
      <div className='relative group-hover:shadow-xl group-hover:shadow-accent/10 rounded-xl transition-all duration-300 bg-cover bg-left h-48 group-hover:bg-right pointer-events-none'
        style={{ backgroundImage: `url(${game.Image || 'https://via.placeholder.com/300x200?text=No+Image'})` }}>


        <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300'></div>

        {/* Favorite button */}
        {game.isFavorite && (
          <div className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 bg-accent-500 text-white`}>
            <Heart className={`w-4 h-4`} />
          </div>
        )}

        <div className='absolute flex flex-row gap-2 items-center bottom-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300'>
          <HardDrive className='w-4 h-4' />
          {game.SizeOnDisk ? `${(parseInt(game.SizeOnDisk) / (1024 * 1024 * 1024)).toFixed(1)} GB` : ''}
        </div>

        <div className='absolute flex items-center justify-center inset-0'>
          <button disabled={!game.Path} className='bg-accent text-white shadow-lg hover:shadow-xl transform hover:scale-105 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110'>
            <Play className='w-6 h-6' />
          </button>
        </div>


        <div className='absolute bottom-2 left-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300'>
          <div className='flex gap-2 items-center justify-center bg-accent rounded-full px-4 py-1 text-sm text-white'>
            <div>RMB to {game.isFavorite ? 'remove from' : 'add to'} favorites</div>
            <Heart className={`w-4 h-4`} onClick={() => onToggleFavorite?.(game.ExternalId)} />
          </div>
        </div>
      </div>


        <div className='flex flex-row justify-between gap-2 text-white text-sm py-2'>
          <div className='font-semibold'>{game.Name}</div>
          <div className='text-white/70 whitespace-nowrap'>{formatLastPlayed(game.LastPlayed || '0')}</div>
        </div>




    </div>
  )
} 