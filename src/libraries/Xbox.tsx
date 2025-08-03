import { XboxIcon } from "./icons/xbox.tsx";
import { Game, Library } from "./Library";

export class Xbox implements Library {
    Name: string = "Xbox";
    Logo: React.ReactNode = <XboxIcon />;
    Colors: string[] = ['#077d07', '#044904'];
    
    async List(): Promise<Game[]> {
        return [];
    }
}