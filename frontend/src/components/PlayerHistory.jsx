import { useState, useEffect } from 'react';
import { getAllPlayers, getPlayerGames } from '../services/api';

const PlayerHistory = ({ onBack }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load players on mount
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const playersData = await getAllPlayers();
        setPlayers(playersData);
      } catch (error) {
        console.error('Failed to load players:', error);
      }
    };
    loadPlayers();
  }, []);

  // Load games when player is selected
  useEffect(() => {
    if (!selectedPlayer) {
      setGames([]);
      return;
    }

    const loadGames = async () => {
      setLoading(true);
      try {
        const gamesData = await getPlayerGames(selectedPlayer.id);
        setGames(gamesData);
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, [selectedPlayer]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getGameResult = (game, playerId) => {
    const player = game.players.find(p => p.id === playerId);
    const otherPlayer = game.players.find(p => p.id !== playerId);

    if (!player || !otherPlayer) return { result: 'N/A', color: '#888' };

    if (player.legs_won > otherPlayer.legs_won) {
      return { result: `Won ${player.legs_won}-${otherPlayer.legs_won}`, color: '#a3e635' };
    } else if (player.legs_won < otherPlayer.legs_won) {
      return { result: `Lost ${player.legs_won}-${otherPlayer.legs_won}`, color: '#ef4444' };
    } else if (game.completed_legs > 0) {
      return { result: `Tied ${player.legs_won}-${otherPlayer.legs_won}`, color: '#fbbf24' };
    } else {
      return { result: 'In Progress', color: '#888' };
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#0a0e1a' }}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80 flex items-center gap-2"
          style={{
            backgroundColor: '#1a1f2e',
            color: '#a3e635',
            borderColor: '#a3e635',
            borderWidth: '2px',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: '#a3e635' }}>
          Player History
        </h1>

        {/* Player Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Select Player
          </label>
          <div className="grid grid-cols-2 gap-3">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className="py-3 px-4 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: selectedPlayer?.id === player.id ? '#2a3f2e' : '#1a1f2e',
                  borderColor: selectedPlayer?.id === player.id ? '#a3e635' : 'transparent',
                  borderWidth: '2px',
                  color: selectedPlayer?.id === player.id ? 'white' : '#888',
                }}
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>

        {/* Games List */}
        {selectedPlayer && (
          <div className="rounded-lg p-6" style={{ backgroundColor: '#1a1f2e' }}>
            <h2 className="text-2xl font-bold mb-4 text-white">
              {selectedPlayer.name}'s Games
            </h2>

            {loading ? (
              <p className="text-gray-400 text-center py-8">Loading games...</p>
            ) : games.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No games played yet</p>
            ) : (
              <div className="space-y-3">
                {games.map((game) => {
                  const result = getGameResult(game, selectedPlayer.id);
                  const opponent = game.players.find(p => p.id !== selectedPlayer.id);

                  return (
                    <div
                      key={game.id}
                      className="rounded-lg p-4"
                      style={{ backgroundColor: '#0f1419' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-semibold text-lg">
                            vs {opponent?.name || 'Unknown'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {game.game_type} - {game.format}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="font-bold text-lg"
                            style={{ color: result.color }}
                          >
                            {result.result}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {formatDate(game.created_at)}
                          </p>
                        </div>
                      </div>

                      {game.completed_legs < game.total_legs && (
                        <p className="text-sm text-yellow-400 mt-2">
                          Game not completed ({game.completed_legs}/{game.total_legs} legs)
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerHistory;
