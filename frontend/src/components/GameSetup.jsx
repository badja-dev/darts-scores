import { useState } from 'react';

const GameSetup = ({ onStartGame }) => {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [gameType, setGameType] = useState('501');
  const [format, setFormat] = useState('Double Out');

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
              Players
            </label>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  placeholder="Player 1 Name"
                  className="w-full px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#0f1419',
                    color: 'white',
                    borderWidth: '2px',
                    borderColor: 'transparent',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a3e635';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'transparent';
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  placeholder="Player 2 Name"
                  className="w-full px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#0f1419',
                    color: 'white',
                    borderWidth: '2px',
                    borderColor: 'transparent',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a3e635';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'transparent';
                  }}
                />
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
