import { LucideProps } from "lucide-react";


export const MenuItem = ({ Icon, Label, Active, onClick }:
    {
        Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
        Label: string,
        Active: boolean,
        onClick: () => void
    }) => {
    return (
        <div
            onClick={() => onClick()}
            className={`flex items-center rounded-xl  
            justify-start sm:justify-center lg:justify-start
            h-10 sm:h-12 lg:h-10 
            px-4 sm:px-0 lg:px-4
            ${Active ? 'bg-gradient-to-r from-purple-500/60 to-accent/80 text-white'
                    : 'text-white/70 hover:bg-white/10 cursor-pointer'}`}>
            <Icon className="size-5 sm:size-6 lg:size-5 mr-3 sm:mr-0 lg:mr-3" />
            <div className='flex-1 sm:hidden lg:block font-quicksand text-sm font-medium'>{Label}</div>
        </div>
    )
}