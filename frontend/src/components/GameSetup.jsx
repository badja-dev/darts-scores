import { useState, useEffect } from 'react';
import { getAllPlayers } from '../services/api';

const GameSetup = ({ onStartGame }) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameType, setGameType] = useState('501');
  const [format, setFormat] = useState('Double Out');
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

  // Filter suggestions based on input
  const getFilteredSuggestions = (input) => {
    if (!input) return existingPlayers;
    return existingPlayers.filter(p =>
      p.name.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleStartGame = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      alert('Please enter names for both players');
      return;
    }

    onStartGame({
      players: [
        { id: 1, name: player1Name.trim() },
        { id: 2, name: player2Name.trim() },
      ],
      gameType,
      format,
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
          {/* Game Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Game Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['301', '501', '701'].map((type) => (
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

          {/* Format Selection */}
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

          {/* Player Names */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Players {existingPlayers.length > 0 && <span className="text-xs text-gray-500">({existingPlayers.length} known players)</span>}
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
                  placeholder="Player 1 Name"
                  className="w-full px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#0f1419',
                    color: 'white',
                    borderWidth: '2px',
                    borderColor: 'transparent',
                  }}
                />
                {showPlayer1Suggestions && getFilteredSuggestions(player1Name).length > 0 && (
                  <div
                    className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden"
                    style={{ backgroundColor: '#1a1f2e', maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {getFilteredSuggestions(player1Name).map((player) => (
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

              {/* Player 2 with autocomplete */}
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
                {showPlayer2Suggestions && getFilteredSuggestions(player2Name).length > 0 && (
                  <div
                    className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden"
                    style={{ backgroundColor: '#1a1f2e', maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {getFilteredSuggestions(player2Name).map((player) => (
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

          {/* Game Info */}
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#0f1419' }}>
            <p className="text-sm text-gray-400 text-center">
              Playing <span className="font-semibold text-white">{gameType}</span> with{' '}
              <span className="font-semibold text-white">{format}</span> rules
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
