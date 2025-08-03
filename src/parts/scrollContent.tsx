import { useEffect, useLayoutEffect, useRef, useState } from "react"

export const ScrollContent = ({ children }: { children: React.ReactNode }) => {

    const [scrollY, setScrollY] = useState(0)
    const [scrollHeight, setScrollHeight] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null)


    const handleScroll = () => {
        if (!scrollRef.current) return;

        const top = scrollRef.current.scrollTop;
        const height = scrollRef.current.scrollHeight;
        const clientHeight = scrollRef.current.clientHeight;
const thumbHeight =Math.floor((clientHeight / height) * 10000) / 100
        const thumbTop = Math.floor(top / (height) * 10000) / 100
        setScrollY(thumbTop)
        setScrollHeight(thumbHeight);
    }

    useEffect(() => {
        handleScroll()
    }, [scrollRef.current, children])


    useLayoutEffect(() => {
        function updateSize() {
            handleScroll()
        }
        window.addEventListener('resize', updateSize);
        handleScroll()
        return () => window.removeEventListener('resize', updateSize);
      }, []);

    return (
        <>
            <div ref={scrollRef} tabIndex={-1} 
            className=" max-h-screen px-4 pt-20 scroll pb-4 relative grid gap-4 grid-cols-2 xs:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] " 
            onScroll={handleScroll}>
                {children}
            </div>
            <div className={`absolute top-20 bottom-4 right-0 w-4 ${scrollHeight === 100 ? 'hidden' : 'block'}`}>
                <div className="bg-accent rounded-full w-2 min-h-4 ml-1 absolute" style={{
                    top: `${scrollY}%`,
                    height: `${scrollHeight}%`
                }}></div>
            </div>
        </>
    )
}