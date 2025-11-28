import { useState, useEffect } from 'react';
import { getAllPlayers, getPlayerGames, getLegPlayerStatistics, deleteGame, deleteAllPlayerGames } from '../services/api';

const PlayerHistory = ({ onBack }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedGames, setExpandedGames] = useState({});
  const [gameStats, setGameStats] = useState({});

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
      setExpandedGames({});
      setGameStats({});
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

  const toggleGameExpansion = async (game) => {
    const gameKey = game.id;

    // Toggle expansion
    setExpandedGames(prev => ({
      ...prev,
      [gameKey]: !prev[gameKey]
    }));

    // If expanding and we don't have stats yet, fetch them
    if (!expandedGames[gameKey] && !gameStats[gameKey] && game.total_legs > 0) {
      try {
        // Get the first leg ID (we're currently only doing single leg games)
        // In the backend response, game.id is actually the leg_id from the first leg
        const legId = game.id;

        // Fetch stats for all players in the game
        const statsPromises = game.players.map(player =>
          getLegPlayerStatistics(legId, player.id)
            .then(stats => ({ playerId: player.id, stats }))
        );

        const allStats = await Promise.all(statsPromises);

        // Store stats by player ID
        const statsMap = {};
        allStats.forEach(({ playerId, stats }) => {
          statsMap[playerId] = stats;
        });

        setGameStats(prev => ({
          ...prev,
          [gameKey]: statsMap
        }));
      } catch (error) {
        console.error('Failed to load game statistics:', error);
      }
    }
  };

  const handleDeleteGame = async (game, event) => {
    event.stopPropagation(); // Prevent toggling expansion when clicking delete

    const opponent = game.players.find(p => p.id !== selectedPlayer.id);
    const confirmMessage = opponent
      ? `Are you sure you want to delete this game vs ${opponent.name}?`
      : `Are you sure you want to delete this solo practice game?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteGame(game.game_id);
      // Remove from local state
      setGames(prev => prev.filter(g => g.game_id !== game.game_id));
      // Clean up expanded state and stats
      setExpandedGames(prev => {
        const newState = { ...prev };
        delete newState[game.id];
        return newState;
      });
      setGameStats(prev => {
        const newState = { ...prev };
        delete newState[game.id];
        return newState;
      });
    } catch (error) {
      console.error('Failed to delete game:', error);
      alert('Failed to delete game. Please try again.');
    }
  };

  const handleClearAllGames = async () => {
    if (!selectedPlayer) return;

    const confirmMessage = `Are you sure you want to delete ALL games for ${selectedPlayer.name}? This cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const result = await deleteAllPlayerGames(selectedPlayer.id);
      // Clear all local state
      setGames([]);
      setExpandedGames({});
      setGameStats({});
      alert(`${result.deleted} game(s) deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete all games:', error);
      alert('Failed to delete games. Please try again.');
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                {selectedPlayer.name}'s Games
              </h2>

              {games.length > 0 && (
                <button
                  onClick={handleClearAllGames}
                  className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80 flex items-center gap-2"
                  style={{
                    backgroundColor: '#3a1f1e',
                    color: '#ef4444',
                    borderColor: '#ef4444',
                    borderWidth: '2px',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-gray-400 text-center py-8">Loading games...</p>
            ) : games.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No games played yet</p>
            ) : (
              <div className="space-y-3">
                {games.map((game) => {
                  const result = getGameResult(game, selectedPlayer.id);
                  const opponent = game.players.find(p => p.id !== selectedPlayer.id);
                  const isExpanded = expandedGames[game.id];
                  const stats = gameStats[game.id];

                  return (
                    <div
                      key={game.id}
                      className="rounded-lg overflow-hidden"
                      style={{ backgroundColor: '#0f1419' }}
                    >
                      {/* Game Header - Clickable */}
                      <div className="relative">
                        <button
                          onClick={() => toggleGameExpansion(game)}
                          className="w-full p-4 pr-12 text-left hover:bg-opacity-80 transition-all"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="text-white font-semibold text-lg">
                                {opponent ? `vs ${opponent.name}` : 'Solo Practice'}
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

                          {/* Expand indicator */}
                          <div className="flex items-center justify-center mt-2 text-gray-400">
                            <svg
                              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {/* Delete Button - Positioned absolutely */}
                        <button
                          onClick={(e) => handleDeleteGame(game, e)}
                          className="absolute top-2 right-2 p-2 rounded-lg hover:bg-red-900 transition-all"
                          style={{
                            color: '#ef4444',
                          }}
                          title="Delete this game"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Expanded Stats */}
                      {isExpanded && stats && (
                        <div className="px-4 pb-4 space-y-4">
                          {game.players.map((player) => {
                            const playerStats = stats[player.id];
                            if (!playerStats) return null;

                            return (
                              <div key={player.id} className="rounded-lg p-4" style={{ backgroundColor: '#1a1f2e' }}>
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                    style={{ backgroundColor: '#2a3f2e', color: '#a3e635' }}
                                  >
                                    {player.name.charAt(0).toUpperCase()}
                                  </div>
                                  {player.name}
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0f1419' }}>
                                    <p className="text-xs text-gray-400 mb-1">3-Dart Avg</p>
                                    <p className="text-xl font-bold text-white">
                                      {playerStats.threeDartAverage.toFixed(2)}
                                    </p>
                                  </div>

                                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0f1419' }}>
                                    <p className="text-xs text-gray-400 mb-1">1-Dart Avg</p>
                                    <p className="text-xl font-bold text-white">
                                      {playerStats.average.toFixed(2)}
                                    </p>
                                  </div>

                                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0f1419' }}>
                                    <p className="text-xs text-gray-400 mb-1">Highest Score</p>
                                    <p className="text-xl font-bold" style={{ color: '#a3e635' }}>
                                      {playerStats.highestScore}
                                    </p>
                                  </div>

                                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0f1419' }}>
                                    <p className="text-xs text-gray-400 mb-1">Total Darts</p>
                                    <p className="text-xl font-bold text-white">
                                      {playerStats.totalDarts}
                                    </p>
                                  </div>

                                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0f1419' }}>
                                    <p className="text-xs text-gray-400 mb-1">Doubles Hit</p>
                                    <p className="text-xl font-bold text-white">
                                      {playerStats.doubles}
                                    </p>
                                  </div>

                                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0f1419' }}>
                                    <p className="text-xs text-gray-400 mb-1">Triples Hit</p>
                                    <p className="text-xl font-bold text-white">
                                      {playerStats.triples}
                                    </p>
                                  </div>

                                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0f1419' }}>
                                    <p className="text-xs text-gray-400 mb-1">Total Score</p>
                                    <p className="text-xl font-bold text-white">
                                      {playerStats.totalScore}
                                    </p>
                                  </div>

                                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0f1419' }}>
                                    <p className="text-xs text-gray-400 mb-1">Turns Played</p>
                                    <p className="text-xl font-bold text-white">
                                      {playerStats.turns}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {isExpanded && !stats && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-400 text-center py-4">Loading statistics...</p>
                        </div>
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
