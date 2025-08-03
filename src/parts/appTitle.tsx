export const AppTitle = ({ setIsMobileMenuOpen }: { setIsMobileMenuOpen: (open: boolean) => void }) => {
    return (
        <div className='h-16 flex items-center sm:px-0 lg:px-4 lg:justify-start drag border-b border-white/10'>
            <div className='drag flex items-center gap-2 flex-1 justify-center lg:justify-start h-16'>
                <img src="./icon.png" alt="logo" className='size-6 drag' />
                <span className='sm:hidden lg:block drag font-bebas text-2xl pt-1'>LETAL</span>
            </div>

            <div className='no-drag sm:hidden size-10 bg-orange-500 cursor-pointer hover:opacity-80 cursor-pointer' onClick={() => setIsMobileMenuOpen(false)}>
                Menu
            </div>
        </div>
    )
}