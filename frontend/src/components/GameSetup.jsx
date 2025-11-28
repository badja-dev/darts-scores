import { useState, useEffect } from 'react';
import { getAllPlayers } from '../services/api';

const GameSetup = ({ onStartGame, onViewHistory }) => {
  const [gameMode, setGameMode] = useState('2player'); // 'solo' or '2player'
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameType, setGameType] = useState('501');
  const [format, setFormat] = useState('Double Out');
  const [numberOfLegs, setNumberOfLegs] = useState(1);
  const [existingPlayers, setExistingPlayers] = useState([]);
  const [showPlayer1Suggestions, setShowPlayer1Suggestions] = useState(false);
  const [showPlayer2Suggestions, setShowPlayer2Suggestions] = useState(false);

  // Load existing players on mount
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const players = await getAllPlayers();
        setExistingPlayers(players);
      } catch (error) {
        console.error('Failed to load players:', error);
      }
    };
    loadPlayers();
  }, []);

  // Filter suggestions based on input and exclude the other player
  const getFilteredSuggestions = (input, excludeName = null) => {
    let filtered = existingPlayers;

    // Filter by excludeName (prevent duplicate players)
    if (excludeName) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase() !== excludeName.toLowerCase()
      );
    }

    // Filter by input text
    if (input) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(input.toLowerCase())
      );
    }

    return filtered;
  };

  const handleStartGame = () => {
    // Validate player names
    if (!player1Name.trim()) {
      alert('Please enter a player name');
      return;
    }

    if (gameMode === '2player') {
      if (!player2Name.trim()) {
        alert('Please enter a name for Player 2');
        return;
      }

      if (player1Name.trim().toLowerCase() === player2Name.trim().toLowerCase()) {
        alert('Players must have different names');
        return;
      }
    }

    const players = gameMode === 'solo'
      ? [{ id: 1, name: player1Name.trim() }]
      : [
          { id: 1, name: player1Name.trim() },
          { id: 2, name: player2Name.trim() },
        ];

    onStartGame({
      players,
      gameType,
      format,
      numberOfLegs,
      gameMode,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#0a0e1a' }}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3" style={{ color: '#a3e635' }}>
            Darts Scores
          </h1>
          <p className="text-gray-400 text-lg">Set up your game and start playing</p>
        </div>

        <div className="rounded-lg p-8" style={{ backgroundColor: '#1a1f2e' }}>
          {/* Game Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGameMode('solo')}
                className="py-3 px-4 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: gameMode === 'solo' ? '#2a3f2e' : '#0f1419',
                  borderColor: gameMode === 'solo' ? '#a3e635' : 'transparent',
                  borderWidth: '2px',
                  color: gameMode === 'solo' ? 'white' : '#888',
                }}
              >
                Solo Practice
              </button>
              <button
                onClick={() => setGameMode('2player')}
                className="py-3 px-4 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: gameMode === '2player' ? '#2a3f2e' : '#0f1419',
                  borderColor: gameMode === '2player' ? '#a3e635' : 'transparent',
                  borderWidth: '2px',
                  color: gameMode === '2player' ? 'white' : '#888',
                }}
              >
                2 Players
              </button>
            </div>
          </div>

          {/* Game Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Game Type
            </label>
            <div className="grid grid-cols-4 gap-3">
              {['301', '501', '701', 'Endless'].map((type) => (
                <button
                  key={type}
                  onClick={() => setGameType(type)}
                  className="py-3 px-4 rounded-lg font-semibold transition-all"
                  style={{
                    backgroundColor: gameType === type ? '#2a3f2e' : '#0f1419',
                    borderColor: gameType === type ? '#a3e635' : 'transparent',
                    borderWidth: '2px',
                    color: gameType === type ? 'white' : '#888',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection - Hidden for Endless mode */}
          {gameType !== 'Endless' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Double Out', 'Straight Out'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className="py-3 px-4 rounded-lg font-semibold transition-all"
                    style={{
                      backgroundColor: format === fmt ? '#2a3f2e' : '#0f1419',
                      borderColor: format === fmt ? '#a3e635' : 'transparent',
                      borderWidth: '2px',
                      color: format === fmt ? 'white' : '#888',
                    }}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Number of Legs Selection - Hidden for Endless mode */}
          {gameType !== 'Endless' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Number of Legs
              </label>
              <div className="grid grid-cols-5 gap-3">
                {[1, 3, 5, 7, 9].map((legs) => (
                  <button
                    key={legs}
                    onClick={() => setNumberOfLegs(legs)}
                    className="py-3 px-4 rounded-lg font-semibold transition-all"
                    style={{
                      backgroundColor: numberOfLegs === legs ? '#2a3f2e' : '#0f1419',
                      borderColor: numberOfLegs === legs ? '#a3e635' : 'transparent',
                      borderWidth: '2px',
                      color: numberOfLegs === legs ? 'white' : '#888',
                    }}
                  >
                    {legs === 1 ? 'Best of 1' : `Best of ${legs}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Player Names */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              {gameMode === 'solo' ? 'Player Name' : 'Players'} {existingPlayers.length > 0 && <span className="text-xs text-gray-500">({existingPlayers.length} known players)</span>}
            </label>
            <div className="space-y-3">
              {/* Player 1 with autocomplete */}
              <div className="relative">
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => {
                    setPlayer1Name(e.target.value);
                    setShowPlayer1Suggestions(true);
                  }}
                  onFocus={() => setShowPlayer1Suggestions(true)}
                  onBlur={() => setTimeout(() => setShowPlayer1Suggestions(false), 200)}
                  placeholder={gameMode === 'solo' ? 'Your Name' : 'Player 1 Name'}
                  className="w-full px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#0f1419',
                    color: 'white',
                    borderWidth: '2px',
                    borderColor: 'transparent',
                  }}
                />
                {showPlayer1Suggestions && getFilteredSuggestions(player1Name, player2Name).length > 0 && (
                  <div
                    className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden"
                    style={{ backgroundColor: '#1a1f2e', maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {getFilteredSuggestions(player1Name, player2Name).map((player) => (
                      <button
                        key={player.id}
                        onClick={() => {
                          setPlayer1Name(player.name);
                          setShowPlayer1Suggestions(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#0f1419', color: 'white', borderBottom: '1px solid #2a2a2a' }}
                      >
                        {player.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Player 2 with autocomplete - Only for 2-player mode */}
              {gameMode === '2player' && (
                <div className="relative">
                  <input
                    type="text"
                    value={player2Name}
                    onChange={(e) => {
                      setPlayer2Name(e.target.value);
                      setShowPlayer2Suggestions(true);
                    }}
                    onFocus={() => setShowPlayer2Suggestions(true)}
                    onBlur={() => setTimeout(() => setShowPlayer2Suggestions(false), 200)}
                    placeholder="Player 2 Name"
                    className="w-full px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: '#0f1419',
                      color: 'white',
                      borderWidth: '2px',
                      borderColor: 'transparent',
                    }}
                  />
                  {showPlayer2Suggestions && getFilteredSuggestions(player2Name, player1Name).length > 0 && (
                    <div
                      className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden"
                      style={{ backgroundColor: '#1a1f2e', maxHeight: '200px', overflowY: 'auto' }}
                    >
                      {getFilteredSuggestions(player2Name, player1Name).map((player) => (
                        <button
                          key={player.id}
                          onClick={() => {
                            setPlayer2Name(player.name);
                            setShowPlayer2Suggestions(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: '#0f1419', color: 'white', borderBottom: '1px solid #2a2a2a' }}
                        >
                          {player.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90"
            style={{
              backgroundColor: '#a3e635',
              color: '#0a0e1a',
            }}
          >
            Start Game
          </button>

          {/* View History Button */}
          <button
            onClick={onViewHistory}
            className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-80 mt-3"
            style={{
              backgroundColor: '#1a1f2e',
              color: '#a3e635',
              borderColor: '#a3e635',
              borderWidth: '2px',
            }}
          >
            View Player History
          </button>

          {/* Game Info */}
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#0f1419' }}>
            <p className="text-sm text-gray-400 text-center">
              {gameType === 'Endless' ? (
                <>
                  Playing <span className="font-semibold text-white">Endless Mode</span> - scores count up
                </>
              ) : (
                <>
                  Playing <span className="font-semibold text-white">{gameType}</span> with{' '}
                  <span className="font-semibold text-white">{format}</span> rules
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Track your scores, view statistics, and improve your game</p>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
