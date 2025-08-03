import { BlizzardIcon } from "./icons/blizzard";
import { Game, Library } from "./Library";


const blizzardGames = [
    {
        Name: "World of Warcraft",
        Image: "https://www.blizzard.com/fr-fr/games/world-of-warcraft/heroes-of-storm/images/heroes-of-storm-hero-gallery-1.jpg",
        RegistryPath: [
            "HKEY_LOCAL_MACHINE\\SOFTWARE\\Blizzard Entertainment\\World of Warcraft",
            "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Blizzard Entertainment\\World of Warcraft",
            "HKEY_CURRENT_USER\\Software\\Blizzard Entertainment\\World of Warcraft",
            "HKEY_CURRENT_USER\\Software\\Wow6432Node\\Blizzard Entertainment\\World of Warcraft",
        ],
    },
    {
        Name: "Heroes of Storm",
        Image: "https://www.blizzard.com/fr-fr/games/world-of-warcraft/heroes-of-storm/images/heroes-of-storm-hero-gallery-1.jpg",
        RegistryPath: ["HKEY_LOCAL_MACHINE\\SOFTWARE\\Blizzard Entertainment\\Heroes of Storm"],
    },
    {
        Name: "Overwatch",
        Image: "https://www.blizzard.com/fr-fr/games/world-of-warcraft/heroes-of-storm/images/heroes-of-storm-hero-gallery-1.jpg",
        RegistryPath: ["HKEY_LOCAL_MACHINE\\SOFTWARE\\Blizzard Entertainment\\Overwatch", "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Overwatch"],
    },
    {
        Name: "Diablo II",
        Image: "https://www.blizzard.com/fr-fr/games/world-of-warcraft/heroes-of-storm/images/heroes-of-storm-hero-gallery-1.jpg",
        RegistryPath: ["HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Blizzard Entertainment\\Diablo II"],
    },
    {
        Name: "Diablo III",
        Image: "https://www.blizzard.com/fr-fr/games/world-of-warcraft/heroes-of-storm/images/heroes-of-storm-hero-gallery-1.jpg",
        RegistryPath: ["HKEY_LOCAL_MACHINE\\SOFTWARE\\Blizzard Entertainment\\Diablo III"],
    },
    {
        Name: "Starcraft II",
        Image: "https://www.blizzard.com/fr-fr/games/world-of-warcraft/heroes-of-storm/images/heroes-of-storm-hero-gallery-1.jpg",
        RegistryPath: ["HKEY_LOCAL_MACHINE\\SOFTWARE\\Blizzard Entertainment\\Starcraft II"],
    },
    {
        Name: "StarCraft: Remastered",
        Image: "https://www.blizzard.com/fr-fr/games/world-of-warcraft/heroes-of-storm/images/heroes-of-storm-hero-gallery-1.jpg",
        RegistryPath: ["HKEY_LOCAL_MACHINE\\SOFTWARE\\Blizzard Entertainment\\StarCraft: Remastered"],
    },
    {
        Name: "Starcraft",
        Image: "https://www.blizzard.com/fr-fr/games/world-of-warcraft/heroes-of-storm/images/heroes-of-storm-hero-gallery-1.jpg",
        RegistryPath: ["HKEY_LOCAL_MACHINE\\SOFTWARE\\Blizzard Entertainment\\Starcraft"],
    },
    {
        Name: "Warcraft III",
        Image: "https://www.blizzard.com/fr-fr/games/world-of-warcraft/heroes-of-storm/images/heroes-of-storm-hero-gallery-1.jpg",
        RegistryPath: ["HKEY_CURRENT_USER\\Software\\Blizzard Entertainment\\Warcraft III",
            "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Blizzard Entertainment\\Warcraft III"
        ],
    },
]


export class Blizzard implements Library {
    Name: string = "Blizzard";
    Logo: React.ReactNode = <BlizzardIcon />;
    Colors: string[] = ['#000f2c', '#004576'];

    async List(): Promise<Game[]> {
        try {
            console.log('Recherche des jeux Blizzard dans le registre...');
            
            const games: Game[] = [];
            
            // Tester chaque jeu de la liste
            for (const blizzardGame of blizzardGames) {
                try {
                    const gameInfo = await this.checkBlizzardGame(blizzardGame);
                    if (gameInfo) {
                        games.push(gameInfo);
                    }
                } catch (error) {
                    console.error(`Erreur lors de la vérification de ${blizzardGame.Name}:`, error);
                }
            }
            
            // Rechercher également dans les dossiers d'installation par défaut
            const defaultPaths = [
                'C:\\Program Files (x86)\\Blizzard Entertainment',
                'C:\\Program Files\\Blizzard Entertainment',
                'C:\\Program Files (x86)\\Battle.net',
                'C:\\Program Files\\Battle.net'
            ];
            
            const folderGames = await this.getBlizzardGamesFromFolders(defaultPaths);
            games.push(...folderGames);
            
            console.log(`Total des jeux Blizzard trouvés: ${games.length}`);
            return games;
            
        } catch (error) {
            console.error('Erreur lors de la recherche des jeux Blizzard:', error);
            return [];
        }
    }
    
    private async checkBlizzardGame(blizzardGame: any): Promise<Game | null> {
        try {
            let installPath: string | null = null;
            let executablePath: string | null = null;
            
            // Tester chaque clé de registre pour ce jeu
            for (const registryPath of blizzardGame.RegistryPath) {
                try {
                    const result = await window.electronAPI.readRegistry(registryPath);
                    
                    if (result.success && result.data) {
                        console.log(`Données trouvées pour ${blizzardGame.Name} dans ${registryPath}:`, result.data);
                        
                        // Chercher les informations d'installation
                        for (const values of Object.values(result.data)) {
                            if (typeof values === 'object' && values !== null) {
                                // Chercher le chemin d'installation
                                if ((values as any)['InstallPath']) {
                                    installPath = (values as any)['InstallPath'];
                                }
                                
                                if ((values as any)['InstallLocation']) {
                                    installPath = (values as any)['InstallLocation'];
                                }
                                
                                if ((values as any)['Path']) {
                                    installPath = (values as any)['Path'];
                                }
                                
                                // Chercher le chemin de l'exécutable
                                if ((values as any)['ExecutablePath']) {
                                    executablePath = (values as any)['ExecutablePath'];
                                }
                                
                                if ((values as any)['GamePath']) {
                                    executablePath = (values as any)['GamePath'];
                                }
                                
                                // Chercher dans les sous-clés
                                if ((values as any)['InstallDir']) {
                                    installPath = (values as any)['InstallDir'];
                                }
                            }
                        }
                        
                        // Si on a trouvé des informations, on peut arrêter
                        if (installPath || executablePath) {
                            break;
                        }
                    } else {
                        console.log(`Aucune donnée trouvée pour ${blizzardGame.Name} dans ${registryPath}:`, result.error);
                    }
                } catch (error) {
                    console.error(`Erreur lors de la lecture de ${registryPath} pour ${blizzardGame.Name}:`, error);
                }
            }
            
            // Si on a trouvé un chemin d'installation ou un exécutable
            if (installPath || executablePath) {
                const gamePath = executablePath || installPath;
                
                // Vérifier si le chemin existe
                if (gamePath) {
                    const pathExists = await window.electronAPI.checkPathExists(gamePath);
                    if (pathExists) {
                        return {
                            Name: blizzardGame.Name,
                            Path: gamePath,
                            Image: blizzardGame.Image,
                            ExternalId: `blizzard_${blizzardGame.Name.toLowerCase().replace(/\s+/g, '_')}`,
                            Library: this.Name,
                            isFavorite: false
                        };
                    }
                }
            }
            
            return null;
            
        } catch (error) {
            console.error(`Erreur lors de la vérification de ${blizzardGame.Name}:`, error);
            return null;
        }
    }
    
    private async getBlizzardGamesFromFolders(folderPaths: string[]): Promise<Game[]> {
        const games: Game[] = [];
        
        for (const folderPath of folderPaths) {
            try {
                const exists = await window.electronAPI.checkPathExists(folderPath);
                if (exists) {
                    const files = await window.electronAPI.readDirectory(folderPath);
                    
                    for (const file of files) {
                        // Chercher des dossiers qui pourraient contenir des jeux Blizzard
                        if (file.includes('.exe') || 
                            file.toLowerCase().includes('wow') ||
                            file.toLowerCase().includes('diablo') ||
                            file.toLowerCase().includes('starcraft') ||
                            file.toLowerCase().includes('warcraft') ||
                            file.toLowerCase().includes('overwatch') ||
                            file.toLowerCase().includes('heroes')) {
                            
                            const gameName = this.extractBlizzardGameName(file);
                            if (gameName) {
                                games.push({
                                    Name: gameName,
                                    Path: `${folderPath}\\${file}`,
                                    Image: this.getBlizzardGameImage(gameName),
                                    ExternalId: `blizzard_${gameName.toLowerCase().replace(/\s+/g, '_')}`,
                                    Library: this.Name,
                                    isFavorite: false
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Erreur lors de la vérification du dossier ${folderPath}:`, error);
            }
        }
        
        return games;
    }
    
    private extractBlizzardGameName(fileName: string): string | null {
        // Extraire le nom du jeu depuis le nom du fichier
        const name = fileName.replace('.exe', '').replace(/_/g, ' ').replace(/-/g, ' ');
        
        // Mapping des noms de fichiers vers les noms de jeux
        const gameNameMapping: { [key: string]: string } = {
            'wow': 'World of Warcraft',
            'diablo': 'Diablo',
            'starcraft': 'StarCraft',
            'warcraft': 'Warcraft',
            'overwatch': 'Overwatch',
            'heroes': 'Heroes of the Storm'
        };
        
        const lowerName = name.toLowerCase();
        for (const [key, gameName] of Object.entries(gameNameMapping)) {
            if (lowerName.includes(key)) {
                return gameName;
            }
        }
        
        return name;
    }
    
    private getBlizzardGameImage(gameName: string): string {
        // Retourner une image par défaut pour les jeux Blizzard
        return `https://via.placeholder.com/150/000f2c/FFFFFF?text=${encodeURIComponent(gameName)}`;
    }
}