import { LucideProps } from "lucide-react"

export const AppButton = ({ Icon, onClick, customColor, className }: {
    Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>, 
    onClick: () => void,
    customColor?: 'red'|'white'|'yellow'|'blue'|'green'|'purple'|'orange'|'pink'|'gray'|'teal'|'cyan'
    className?: string
}) => {

    const customColorClass = {
        red: 'hover:text-red-400 hover:bg-red-500/20',
        white: 'hover:text-white hover:bg-white/10',
        yellow: 'hover:text-yellow-400 hover:bg-yellow-500/20',
        blue: 'hover:text-blue-400 hover:bg-blue-500/20',
        green: 'hover:text-green-400 hover:bg-green-500/20',
        purple: 'hover:text-purple-400 hover:bg-purple-500/20',
        orange: 'hover:text-orange-400 hover:bg-orange-500/20',
        pink: 'hover:text-pink-400 hover:bg-pink-500/20',
        gray: 'hover:text-gray-400 hover:bg-gray-500/20',
        teal: 'hover:text-teal-400 hover:bg-teal-500/20',
        cyan: 'hover:text-cyan-400 hover:bg-cyan-500/20',
    };

    return (
        <div className={`no-drag size-8 rounded-lg flex items-center justify-center text-white/70 
        ${customColorClass[customColor??"white"]} ${className}`} onClick={() => onClick()}>
            <Icon className="size-4" />
        </div>
    )
}