import { EaIcon } from "./icons/ea";
import { Game, Library } from "./Library";

export class Ea implements Library {
    Name: string = "EA";
    Logo: React.ReactNode = <EaIcon />;
    Colors: string[] = ['#f05610', '#970603'];

    async List(): Promise<Game[]> {
        try {
            console.log('Recherche des jeux EA dans le registre...');
            
            // Chemins de registre où EA stocke ses informations de jeux
            const registryPaths = [
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\EA Games',
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\Electronic Arts',
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\EA Games',
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Electronic Arts',
                'HKEY_CURRENT_USER\\SOFTWARE\\EA Games',
                'HKEY_CURRENT_USER\\SOFTWARE\\Electronic Arts'
            ];

            const games: Game[] = [];

            for (const registryPath of registryPaths) {
                try {
                    const result = await window.electronAPI.readRegistry(registryPath);
                    
                    if (result.success && result.data) {
                        console.log(`Données trouvées dans ${registryPath}:`, result.data);
                        
                        // Traiter les données du registre pour extraire les jeux
                        const eaGames = this.parseEaRegistryData(result.data, registryPath);
                        games.push(...eaGames);
                    } else {
                        console.log(`Aucune donnée trouvée dans ${registryPath}:`, result.error);
                    }
                } catch (error) {
                    console.error(`Erreur lors de la lecture de ${registryPath}:`, error);
                }
            }

            // Rechercher également dans les dossiers d'installation par défaut
            const defaultPaths = [
                'C:\\Program Files (x86)\\EA Games',
                'C:\\Program Files\\EA Games',
                'C:\\Program Files (x86)\\Electronic Arts',
                'C:\\Program Files\\Electronic Arts'
            ];

            for (const defaultPath of defaultPaths) {
                try {
                    const exists = await window.electronAPI.checkPathExists(defaultPath);
                    if (exists) {
                        const files = await window.electronAPI.readDirectory(defaultPath);
                        const folderGames = this.parseEaFolderData(files, defaultPath);
                        games.push(...folderGames);
                    }
                } catch (error) {
                    console.error(`Erreur lors de la vérification du dossier ${defaultPath}:`, error);
                }
            }

            console.log(`Total des jeux EA trouvés: ${games.length}`);
            return games;

        } catch (error) {
            console.error('Erreur lors de la recherche des jeux EA:', error);
            return [];
        }
    }

    private parseEaRegistryData(registryData: any, registryPath: string): Game[] {
        const games: Game[] = [];
        
        console.log('parseEaRegistryData',registryData, registryPath);
        for (const [key, values] of Object.entries(registryData)) {
            if (typeof values === 'object' && values !== null) {
                // Chercher des valeurs qui indiquent un jeu installé
                const gameName = this.extractGameName(key, values);
                const gamePath = this.extractGamePath(values);
                
                if (gameName && gamePath) {
                    games.push({
                        Name: gameName,
                        Path: gamePath,
                        Image: this.getEaGameImage(gameName),
                        ExternalId: `ea_${gameName.toLowerCase().replace(/\s+/g, '_')}`,
                        Library: this.Name,
                        isFavorite: false
                    });
                }
            }
        }
        
        return games;
    }

    private parseEaFolderData(files: string[], folderPath: string): Game[] {
        const games: Game[] = [];
        
        for (const file of files) {
            // Chercher des dossiers qui pourraient contenir des jeux
            if (file.includes('.exe') || file.includes('Game')) {
                const gameName = this.extractGameNameFromFolder(file);
                if (gameName) {
                    games.push({
                        Name: gameName,
                        Path: `${folderPath}\\${file}`,
                        Image: this.getEaGameImage(gameName),
                        ExternalId: `ea_${gameName.toLowerCase().replace(/\s+/g, '_')}`,
                        Library: this.Name,
                        isFavorite: false
                    });
                }
            }
        }
        
        return games;
    }

    private extractGameName(key: string, values: any): string | null {
        // Extraire le nom du jeu depuis la clé de registre ou les valeurs
        const keyParts = key.split('\\');
        const lastPart = keyParts[keyParts.length - 1];
        
        // Nettoyer le nom du jeu
        if (lastPart && lastPart !== 'EA Games' && lastPart !== 'Electronic Arts') {
            return lastPart.replace(/_/g, ' ').replace(/-/g, ' ');
        }
        
        // Chercher dans les valeurs
        if (values['DisplayName']) {
            return values['DisplayName'];
        }
        
        if (values['GameName']) {
            return values['GameName'];
        }
        
        return null;
    }

    private extractGamePath(values: any): string | null {
        // Chercher le chemin d'installation du jeu
        if (values['InstallPath']) {
            return values['InstallPath'];
        }
        
        if (values['GamePath']) {
            return values['GamePath'];
        }
        
        if (values['Path']) {
            return values['Path'];
        }
        
        return null;
    }

    private extractGameNameFromFolder(folderName: string): string | null {
        // Extraire le nom du jeu depuis le nom du dossier
        if (folderName.includes('.exe')) {
            return folderName.replace('.exe', '');
        }
        
        if (folderName.includes('Game')) {
            return folderName.replace('Game', '').trim();
        }
        
        return folderName;
    }

    private getEaGameImage(gameName: string): string {
        // Retourner une image par défaut pour les jeux EA
        // Vous pourriez implémenter une logique plus sophistiquée ici
        return `https://via.placeholder.com/150/FF0000/FFFFFF?text=${encodeURIComponent(gameName)}`;
    }
}