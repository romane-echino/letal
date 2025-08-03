import { Cloud, HardDrive } from "lucide-react";

export interface LibraryCardProps {
    colors: string[];
    name: string;
    logo: React.ReactNode;
    gameCount: number;


    localSearch?: boolean;
    remoteSearch?: boolean;

}



export const LibraryCard = ({ colors, name, logo, gameCount }: LibraryCardProps) => {
    return (
        <div className="min-w-16 max-w-[256px]">
            <div
                className=" aspect-3/2 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10 rounded-xl"
                    style={{
                        background: `linear-gradient(to top left, ${colors[0]}, ${colors[1]})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}></div>

                <div className="absolute inset-0 flex items-center justify-center border-2 border-white/10 rounded-xl flex-col gap-4">
                    <div className="w-[30%] aspect-square fill-white rounded-full flex items-center justify-center">
                        {logo}
                    </div>

                    <div className="outline-2 outline-white/10 rounded-full px-4 py-1 text-sm bg-primary flex items-center gap-2">
                        <HardDrive />
                        <Cloud />
                    </div>
                </div>
            </div>

            <div className="text-sm mt-1 mx-2 whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-2 justify-between">
                <div className="font-medium">{name}</div>
                <div className="text-white/50">{gameCount} games</div>
            </div>


        </div>
    )
}