import { UbisoftIcon } from "./icons/ubisoft";
import { Game, Library } from "./Library";

export class Ubisoft implements Library {
    Name: string = "Ubisoft";
    Logo: React.ReactNode = <UbisoftIcon />;
    Colors: string[] = ['#110d11', '#3f1842'];
    
    async List(): Promise<Game[]> {
        try {
            console.log('Recherche des jeux Ubisoft Connect dans le registre...');
            
            const games: Game[] = [];
            
            // Chemins de registre pour les installations Ubisoft
            const installRegistryPaths = [
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Ubisoft\\Launcher\\Installs',
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\Ubisoft\\Launcher\\Installs'
            ];
            
            // Chemins de registre pour les informations de désinstallation
            const uninstallRegistryPaths = [
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall'
            ];
            
            // Dossiers d'installation par défaut d'Ubisoft Connect
            const defaultPaths = [
                'C:\\Program Files (x86)\\Ubisoft\\Ubisoft Game Launcher\\data',
                'C:\\Program Files\\Ubisoft\\Ubisoft Game Launcher\\data'
            ];
            
            // Étape 1: Récupérer les IDs des jeux installés depuis le registre
            const gameIds = await this.getUbisoftGameIds(installRegistryPaths);
            console.log('IDs de jeux trouvés:', gameIds);
            
            // Étape 2: Pour chaque ID, récupérer les informations du jeu
            for (const gameId of gameIds) {
                try {
                    const gameInfo = await this.getUbisoftGameInfo(gameId, installRegistryPaths, uninstallRegistryPaths);
                    if (gameInfo) {
                        games.push(gameInfo);
                    }
                } catch (error) {
                    console.error(`Erreur lors de la récupération des infos pour le jeu ${gameId}:`, error);
                }
            }
            
            // Étape 3: Vérifier également les dossiers data d'Ubisoft Connect
            const folderGames = await this.getUbisoftGamesFromFolders(defaultPaths);
            games.push(...folderGames);
            
            console.log(`Total des jeux Ubisoft trouvés: ${games.length}`);
            return games;
            
        } catch (error) {
            console.error('Erreur lors de la recherche des jeux Ubisoft:', error);
            return [];
        }
    }
    
    private async getUbisoftGameIds(registryPaths: string[]): Promise<string[]> {
        const gameIds: string[] = [];
        
        for (const registryPath of registryPaths) {
            try {
                const result = await window.electronAPI.readRegistry(registryPath);
                
                if (result.success && result.data) {
                    console.log(`Données trouvées dans ${registryPath}:`, result.data);
                    
                    // Extraire les IDs des sous-clés numériques
                    for (const [key, values] of Object.entries(result.data)) {
                        if (typeof values === 'object' && values !== null) {
                            // Vérifier si c'est une clé numérique (ID de jeu)
                            const keyParts = key.split('\\');
                            const lastPart = keyParts[keyParts.length - 1];
                            
                            if (lastPart && /^\d+$/.test(lastPart)) {
                                gameIds.push(lastPart);
                            }
                        }
                    }
                } else {
                    console.log(`Aucune donnée trouvée dans ${registryPath}:`, result.error);
                }
            } catch (error) {
                console.error(`Erreur lors de la lecture de ${registryPath}:`, error);
            }
        }
        
        // Supprimer les doublons
        return [...new Set(gameIds)];
    }
    
    private async getUbisoftGameInfo(gameId: string, installPaths: string[], uninstallPaths: string[]): Promise<Game | null> {
        try {
            let installDir: string | null = null;
            let gameName: string | null = null;
            
            // Récupérer le chemin d'installation depuis le registre d'installation
            for (const installPath of installPaths) {
                try {
                    const fullPath = `${installPath}\\${gameId}`;
                    const result = await window.electronAPI.readRegistry(fullPath);
                    
                    if (result.success && result.data) {
                        for (const values of Object.values(result.data)) {
                            if (typeof values === 'object' && values !== null) {
                                if ((values as any)['InstallDir']) {
                                    installDir = (values as any)['InstallDir'];
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (installDir) break;
                } catch (error) {
                    console.error(`Erreur lors de la lecture du chemin d'installation pour ${gameId}:`, error);
                }
            }
            
            // Récupérer le nom du jeu depuis le registre de désinstallation
            for (const uninstallPath of uninstallPaths) {
                try {
                    const fullPath = `${uninstallPath}\\UPlay Install ${gameId}`;
                    const result = await window.electronAPI.readRegistry(fullPath);
                    
                    if (result.success && result.data) {
                        for (const values of Object.values(result.data)) {
                            if (typeof values === 'object' && values !== null) {
                                if ((values as any)['DisplayName']) {
                                    gameName = (values as any)['DisplayName'];
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (gameName) break;
                } catch (error) {
                    console.error(`Erreur lors de la lecture du nom pour ${gameId}:`, error);
                }
            }
            
            // Si on n'a pas trouvé le nom dans le registre, essayer de l'extraire du chemin
            if (!gameName && installDir) {
                gameName = this.extractGameNameFromPath(installDir);
            }
            
            // Si on n'a toujours pas de nom, utiliser l'ID
            if (!gameName) {
                gameName = `Ubisoft Game ${gameId}`;
            }
            
            if (installDir) {
                return {
                    Name: gameName,
                    Path: installDir,
                    Image: this.getUbisoftGameImage(gameName),
                    ExternalId: `ubisoft_${gameId}`,
                    Library: this.Name,
                    isFavorite: false
                };
            }
            
            return null;
            
        } catch (error) {
            console.error(`Erreur lors de la récupération des infos pour le jeu ${gameId}:`, error);
            return null;
        }
    }
    
    private async getUbisoftGamesFromFolders(folderPaths: string[]): Promise<Game[]> {
        const games: Game[] = [];
        
        for (const folderPath of folderPaths) {
            try {
                const exists = await window.electronAPI.checkPathExists(folderPath);
                if (exists) {
                    const files = await window.electronAPI.readDirectory(folderPath);
                    
                    for (const file of files) {
                        // Vérifier si c'est un dossier numérique (ID de jeu)
                        if (/^\d+$/.test(file)) {
                            const gameId = file;
                            const gameName = `Ubisoft Game ${gameId}`;
                            
                            games.push({
                                Name: gameName,
                                Path: `${folderPath}\\${file}`,
                                Image: this.getUbisoftGameImage(gameName),
                                ExternalId: `ubisoft_${gameId}`,
                                Library: this.Name,
                                isFavorite: false
                            });
                        }
                    }
                }
            } catch (error) {
                console.error(`Erreur lors de la vérification du dossier ${folderPath}:`, error);
            }
        }
        
        return games;
    }
    
    private extractGameNameFromPath(installPath: string): string | null {
        try {
            const pathParts = installPath.split('\\');
            const lastPart = pathParts[pathParts.length - 1];
            
            if (lastPart) {
                // Nettoyer le nom du jeu
                return lastPart.replace(/_/g, ' ').replace(/-/g, ' ');
            }
            
            return null;
        } catch (error) {
            console.error('Erreur lors de l\'extraction du nom depuis le chemin:', error);
            return null;
        }
    }
    
    private getUbisoftGameImage(gameName: string): string {
        // Retourner une image par défaut pour les jeux Ubisoft
        return `https://via.placeholder.com/150/110d11/FFFFFF?text=${encodeURIComponent(gameName)}`;
    }
}