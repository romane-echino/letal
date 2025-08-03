import { Steam } from "./Steam";
import { Ea } from "./Ea";
import { Ubisoft } from "./Ubisoft";
import { Xbox } from "./Xbox";
import { Blizzard } from "./Blizzard";

export interface Library {
    List: () => Promise<Game[]>;
    Name: string;
    Logo: React.ReactNode;
    Colors: string[];
}


export const LibraryList: Library[] = [
    new Steam(),
    new Ea(),
    new Ubisoft(),
    new Xbox(),
    new Blizzard(), 
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

    Library:string;
}

export const gameMock: Game[] = [
    {
        Name: "Game 1",
        Path: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Game 1",
        Image: "https://via.placeholder.com/150",
        ExternalId: "1234567890",
        Library: "Steam"
    },
]