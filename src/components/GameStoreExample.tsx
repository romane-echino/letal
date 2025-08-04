import React from 'react';
import { useGameStore } from '../stores/GameStore';
import { useSentry } from '../hooks/useSentry';

export function GameStoreExample() {
  const { games, libraries, isLoading, error, loadGames, searchGames } = useGameStore();
  const { logUserAction, logError } = useSentry();

  const handleLoadGames = async () => {
    try {
      logUserAction('load_games_clicked', { 
        currentGamesCount: games.length,
        currentLibrariesCount: libraries.length 
      });
      
      await loadGames();
      
      logUserAction('load_games_completed', { 
        gamesLoaded: games.length,
        librariesLoaded: libraries.length 
      });
    } catch (error) {
      logError(error as Error, {
        context: 'GameStoreExample - Load Games Error',
        userAction: 'load_games_clicked'
      });
    }
  };

  const handleSearch = (searchTerm: string) => {
    try {
      logUserAction('search_games', { 
        searchTerm,
        totalGamesAvailable: games.length 
      });
      
      const results = searchGames(searchTerm);
      
      logUserAction('search_completed', { 
        searchTerm,
        resultsFound: results.length,
        totalAvailable: games.length 
      });
    } catch (error) {
      logError(error as Error, {
        context: 'GameStoreExample - Search Error',
        searchTerm
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <button 
          onClick={handleLoadGames}
          disabled={isLoading}
          className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80 disabled:opacity-50"
        >
          {isLoading ? 'Chargement...' : 'Charger les jeux'}
        </button>
        
        <input 
          type="text" 
          placeholder="Rechercher un jeu..."
          onChange={(e) => handleSearch(e.target.value)}
          className="px-3 py-2 border border-white/20 rounded bg-white/10 text-white placeholder-white/50"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded text-red-400">
          Erreur: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.slice(0, 6).map((game) => (
          <div key={game.ExternalId} className="p-4 bg-white/10 rounded">
            <h3 className="font-semibold text-white">{game.Name}</h3>
            <p className="text-white/70 text-sm">{game.ExternalId}</p>
          </div>
        ))}
      </div>

      <div className="text-white/70 text-sm">
        {games.length} jeux chargés depuis {libraries.length} bibliothèques
      </div>
    </div>
  );
} 