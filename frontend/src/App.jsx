import { useState, useEffect } from 'react';
import Dartboard from './components/Dartboard';
import Keypad from './components/Keypad';
import PlayersList from './components/PlayersList';
import CurrentTurn from './components/CurrentTurn';
import History from './components/History';
import Statistics from './components/Statistics';
import GameSetup from './components/GameSetup';
import { getCheckoutSuggestion } from './utils/checkouts';

function App() {
  // Game setup state
  const [gameStarted, setGameStarted] = useState(false);

  // Game state
  const [gameType, setGameType] = useState('501');
  const [gameFormat, setGameFormat] = useState('Double Out');
  const [currentLeg, setCurrentLeg] = useState(1);
  const [totalLegs, setTotalLegs] = useState(1);

  // UI state
  const [activeTab, setActiveTab] = useState('dartboard'); // 'dartboard', 'keypad', 'history', 'stats'

  // Players state
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', score: 501 },
    { id: 2, name: 'Player 2', score: 501 },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Current turn state
  const [currentDarts, setCurrentDarts] = useState([]);

  // Throw history
  const [throwHistory, setThrowHistory] = useState([]);

  // Suggested checkout
  const [suggestedCheckout, setSuggestedCheckout] = useState(null);

  // Update checkout suggestion when current player's score changes
  useEffect(() => {
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer) {
      const suggestion = getCheckoutSuggestion(currentPlayer.score);
      setSuggestedCheckout(suggestion);
    }
  }, [players, currentPlayerIndex]);

  // Handle score selection from dartboard
  const handleScoreSelect = (score, multiplier) => {
    if (currentDarts.length >= 3) return;

    const totalScore = score * multiplier;
    const newDarts = [...currentDarts, { score: totalScore, multiplier }];
    setCurrentDarts(newDarts);

    // Check for win or if turn is complete
    const currentPlayer = players[currentPlayerIndex];
    const newScore = currentPlayer.score - totalScore;

    // Check for exact finish with double (Double Out rule)
    if (newScore === 0 && multiplier === 2) {
      // Winner!
      setTimeout(() => {
        alert(`${currentPlayer.name} wins!`);
        resetGame();
      }, 500);
      return;
    }

    // Check for bust (score would go below 0 or to exactly 1)
    if (newScore < 0 || newScore === 1) {
      // Bust! Complete turn without updating score
      // Add darts to history marked as bust
      const historyDarts = newDarts.map(dart => ({
        ...dart,
        playerId: currentPlayer.id,
        bust: true,
        remainingScore: currentPlayer.score
      }));
      setThrowHistory(prev => [...prev, ...historyDarts]);

      setTimeout(() => {
        alert(`${currentPlayer.name} BUST!`);
        setCurrentDarts([]);
        nextPlayer();
      }, 500);
      return;
    }

    // Normal scoring
    updatePlayerScore(totalScore);

    // If 3 darts thrown, move to next player
    if (newDarts.length === 3) {
      // Add complete turn to history
      const historyDarts = newDarts.map(dart => ({
        ...dart,
        playerId: currentPlayer.id,
        bust: false,
        remainingScore: newScore
      }));
      setThrowHistory(prev => [...prev, ...historyDarts]);

      setTimeout(() => {
        setCurrentDarts([]);
        nextPlayer();
      }, 500);
    }
  };

  // Update player score
  const updatePlayerScore = (dartScore) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, index) =>
        index === currentPlayerIndex
          ? { ...player, score: player.score - dartScore }
          : player
      )
    );
  };

  // Reset game
  const resetGame = () => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player => ({ ...player, score: 501 }))
    );
    setCurrentPlayerIndex(0);
    setCurrentDarts([]);
    setThrowHistory([]);
  };

  // Move to next player
  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  // Undo last dart
  const handleUndo = () => {
    if (currentDarts.length > 0) {
      setCurrentDarts((prev) => prev.slice(0, -1));
    }
  };

  // Reset current turn
  const handleReset = () => {
    setCurrentDarts([]);
  };

  // Handle game start
  const handleStartGame = ({ players: newPlayers, gameType: newGameType, format: newFormat }) => {
    const startingScore = parseInt(newGameType);
    setPlayers(newPlayers.map(p => ({ ...p, score: startingScore })));
    setGameType(newGameType);
    setGameFormat(newFormat);
    setGameStarted(true);
  };

  // Show setup screen if game hasn't started
  if (!gameStarted) {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#0a0e1a' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-4"
          style={{ backgroundColor: '#1a1f2e' }}
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#a3e635' }}>
                Darts Scores
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {gameType} • {gameFormat}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm('Start a new game? Current progress will be lost.')) {
                setGameStarted(false);
                setThrowHistory([]);
                setCurrentDarts([]);
              }
            }}
            className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: '#4a4a4a', color: 'white' }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Game
          </button>
        </div>

        {/* Game Info Bar */}
        <div
          className="rounded-lg p-3 mb-6 flex flex-wrap items-center gap-6"
          style={{ backgroundColor: '#0f1419' }}
        >

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6"
                style={{ color: '#a3e635' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.0 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span className="text-white font-semibold">
                Format: <span style={{ color: '#a3e635' }}>Single Leg</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6"
                style={{ color: '#a3e635' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-white font-semibold">
                Current Leg: <span style={{ color: '#a3e635' }}>{currentLeg} of {totalLegs}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main game area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Players */}
          <div className="space-y-6">
            <PlayersList players={players} currentPlayerId={players[currentPlayerIndex]?.id} />
            <CurrentTurn
              darts={currentDarts}
              onUndo={handleUndo}
              onReset={handleReset}
              suggestedCheckout={suggestedCheckout}
            />
          </div>

          {/* Center - Dartboard/Keypad/History */}
          <div className="lg:col-span-2">
            <div className="rounded-lg p-6" style={{ backgroundColor: '#1a1f2e' }}>
              <div className="flex gap-4 mb-6 border-b border-gray-700 pb-4">
                <button
                  onClick={() => setActiveTab('dartboard')}
                  className="px-4 py-2 rounded-t-lg font-semibold transition-colors border-b-2"
                  style={{
                    backgroundColor: activeTab === 'dartboard' ? '#2a3f2e' : 'transparent',
                    borderColor: activeTab === 'dartboard' ? '#a3e635' : 'transparent',
                    color: activeTab === 'dartboard' ? 'white' : '#888'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    Dartboard
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('keypad')}
                  className="px-4 py-2 rounded-t-lg font-semibold transition-colors border-b-2"
                  style={{
                    backgroundColor: activeTab === 'keypad' ? '#2a3f2e' : 'transparent',
                    borderColor: activeTab === 'keypad' ? '#a3e635' : 'transparent',
                    color: activeTab === 'keypad' ? 'white' : '#888'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Keypad
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className="px-4 py-2 rounded-t-lg font-semibold transition-colors border-b-2"
                  style={{
                    backgroundColor: activeTab === 'history' ? '#2a3f2e' : 'transparent',
                    borderColor: activeTab === 'history' ? '#a3e635' : 'transparent',
                    color: activeTab === 'history' ? 'white' : '#888'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    History
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className="px-4 py-2 rounded-t-lg font-semibold transition-colors border-b-2"
                  style={{
                    backgroundColor: activeTab === 'stats' ? '#2a3f2e' : 'transparent',
                    borderColor: activeTab === 'stats' ? '#a3e635' : 'transparent',
                    color: activeTab === 'stats' ? 'white' : '#888'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Stats
                  </div>
                </button>
              </div>

              {activeTab === 'dartboard' && <Dartboard onScoreSelect={handleScoreSelect} />}
              {activeTab === 'keypad' && <Keypad onScoreSelect={handleScoreSelect} />}
              {activeTab === 'history' && <History throwHistory={throwHistory} players={players} />}
              {activeTab === 'stats' && <Statistics throwHistory={throwHistory} players={players} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
