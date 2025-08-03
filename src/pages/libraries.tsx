
import { LibraryCard } from "../parts/libraryCard"
import { GameStoreLibrary } from "../stores/GameStore"

export const LibrariesPage = ({ libraries }: { libraries: GameStoreLibrary[] }) => {
    return (
        <>

        {libraries.map((library, index) => (
            <LibraryCard key={index} name={library.name} colors={library.colors} gameCount={library.games.length} logo={library.logo} />
        ))}

        </>
    )
}