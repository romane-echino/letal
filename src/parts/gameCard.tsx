import { Game } from "../libraries/Library";
import { useGameStore } from "../stores/GameStore";

export interface GameCardProps {
    game: Game;
}


export const GameCard = ({ game }: GameCardProps) => {
    const { libraries } = useGameStore()

    return (
        <div className="min-w-16 max-w-[256px]">
            <div
                className=" aspect-2/3 rounded-xl overflow-hidden relative">
                <img src={game.Image} alt={game.Name} className='w-full h-full object-cover' />
                <div className="absolute inset-0 flex items-start p-2 justify-end border-2 border-white/10 rounded-xl">
                </div>
            </div>

            <div className="px-2 mt-1 grid grid-cols-[1fr_32px] gap-2 items-center w-full">
                <div className="flex flex-col grow">
                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis truncate">{game.Name}</span>
                    <div className="text-xs text-white/50">Played 7 days ago</div>
                </div>

                <div className="text-xs text-white/50 fill-white self-center justify-self-end size-5">
                    {libraries.find(library => library.name === game.Library)?.logo}
                </div>
            </div>


        </div>
    )
}