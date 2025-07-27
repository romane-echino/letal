import { Steam } from "./Steam";

export interface Library {
    List: () => Promise<Game[]>;
}


export const LibraryList: Library[] = [
    new Steam(),
]

export interface Game {
    Name?: string;
    Path?: string;
    Image?: string;
    ExternalId: string;
    // Steam-specific properties
    SizeOnDisk?: string;
    LastPlayed?: string;
    isFavorite?: boolean;
}

export const gameMock: Game[] = [
    {
        Name: "Game 1",
        Path: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Game 1",
        Image: "https://via.placeholder.com/150",
        ExternalId: "1234567890"
    },
]