import { Game, gameMock, Library } from "./Library";
import {
    parse
} from '@node-steam/vdf';

interface SteamVDF {
    libraryfolders: {
        [libraryIndex: number]: {
            path: string;
            apps: {
                [appId: number]: string;
            }
        }
    }
}

interface SteamACF {
    AppState: {
        appid: number;
        name: string;
        LastPlayed: string;
        SizeOnDisk: string;
    }
}

export class Steam implements Library {
    async List(): Promise<Game[]> {
        console.log('Listing Steam games...');
        let result: Game[] = [];

        // Check if currently running through electron
        if (!window.electronAPI) {
            console.log('Not running in Electron, returning empty list');
            return gameMock;
        }

        try {
            // Check if the Steam directory exists
            const steamPath = 'C:\\Program Files (x86)\\Steam\\steamapps\\';
            const libraryFoldersPath = 'C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf';

            // Check if Steam is installed
            const steamExists = await window.electronAPI.checkPathExists(steamPath);
            if (!steamExists) {
                console.log('Steam directory not found');
                return result;
            }

            // Read libraryfolders.vdf file
            const vdfFile = await window.electronAPI.readFile(libraryFoldersPath);
            if (!vdfFile) {
                console.log('Could not read libraryfolders.vdf');
                return result;
            }

            // Convert VDF to JSON format
            let libraries: SteamVDF = parse(vdfFile);

            for (const library of Object.values(libraries.libraryfolders)) {
                for (const appId of Object.keys(library.apps)) {


                    const acfFile = await window.electronAPI.readFile(`${library.path}\\steamapps\\appmanifest_${appId}.acf`);
                    if (!acfFile) {
                        console.log(`Could not read ACF file ${library.path}\\steamapps\\appmanifest_${appId}.acf`);
                        continue;
                    }

                    let acfJson: SteamACF = parse(acfFile);

                    result.push({
                        Name: acfJson.AppState.name,
                        Path: `steam://rungameid/${appId}`,
                        Image: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`,
                        ExternalId: appId,
                        SizeOnDisk: acfJson.AppState.SizeOnDisk,
                        LastPlayed: acfJson.AppState.LastPlayed,
                    });
                }
            }

        } catch (error) {
            console.error('Error in Steam.List():', error);
        }

        return result;
    }

}

