import { Search } from "lucide-react"
import { useEffect, useState } from "react";
import { Game } from "../libraries/Library";

export interface SearchOverlayProps {
    onClose: () => void;
    onSearch: (query: string) => void;
    games: Game[];
}

export const SearchOverlay = ({ onClose, games }: SearchOverlayProps) => {

    const [searchResults, setSearchResults] = useState<Game[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {

        console.log('useEffect',searchQuery, games)
        setSearchResults(games.filter(game => game.Name?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10))
    }, [games, searchQuery])

    return (
        <div className='absolute z-3 inset-0 flex items-start pt-20 justify-center bg-primary/80 backdrop-blur-sm' onClick={onClose}>
            <div className='bg-primary border border-white/10 overflow-hidden rounded-lg shadow-xl min-w-lg max-h-[80vh] flex flex-col'
                onClick={(e) => e.stopPropagation()}>
                <div className='flex items-center gap-2 p-4 border-b border-white/10'>
                    <Search className='size-4' />
                    <input id="search-input" type="search" 
                    placeholder="Search for a game..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='bg-transparent outline-none flex-1 text-sm' />
                    <div className='text-xs text-white/50 border border-white/10 rounded-lg px-2 py-1'>ESC</div>
                </div>

                <div className="flex flex-col gap-2 p-4 overflow-y-auto">
                    {searchResults.length > 0 ? searchResults.map(game => (
                        <div className="flex items-center gap-2">
                            <img src={game.Image} alt={game.Name} className="w-10 h-10 rounded-lg" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{game.Name}</span>
                                <div className="text-xs text-white/50">Played 7 days ago</div>
                            </div>
                        </div>
                    )) : <div className="text-sm text-white/50">No results found</div>}
                </div>
            </div>
        </div>
    )
}