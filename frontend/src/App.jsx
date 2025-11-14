import { useState, useEffect } from 'react';
import Dartboard from './components/Dartboard';
import Keypad from './components/Keypad';
import Table from './components/Table';
import PlayersList from './components/PlayersList';
import CurrentTurn from './components/CurrentTurn';
import History from './components/History';
import Statistics from './components/Statistics';
import GameSetup from './components/GameSetup';
import PlayerHistory from './components/PlayerHistory';
import { getCheckoutSuggestion } from './utils/checkouts';
import { getOrCreatePlayer, createGame, createLeg, recordThrow, completeLeg } from './services/api';

function App() {
  // View state
  const [view, setView] = useState('setup'); // 'setup', 'game', 'history'

  // Game setup state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  // Database IDs
  const [gameId, setGameId] = useState(null);
  const [legId, setLegId] = useState(null);
  const [dbPlayerIds, setDbPlayerIds] = useState({}); // Maps local player ID to database player ID

  // Game state
  const [gameType, setGameType] = useState('501');
  const [gameFormat, setGameFormat] = useState('Double Out');
  const [currentLeg, setCurrentLeg] = useState(1);
  const [totalLegs, setTotalLegs] = useState(1);

  // UI state
  const [activeTab, setActiveTab] = useState('dartboard'); // 'dartboard', 'keypad', 'table', 'history', 'stats'

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
    if (currentDarts.length >= 3 || gameComplete) return;

    const totalScore = score * multiplier;
    const newDarts = [...currentDarts, { score: totalScore, multiplier }];
    setCurrentDarts(newDarts);

    // Update score immediately
    const currentPlayer = players[currentPlayerIndex];
    const newScore = currentPlayer.score - totalScore;

    // Check for exact finish with double (Double Out rule) or Straight Out
    const isWin = gameFormat === 'Double Out'
      ? (newScore === 0 && multiplier === 2)
      : (newScore === 0);

    if (isWin) {
      // Winner! Update score and mark game complete
      updatePlayerScore(totalScore);

      // Complete the leg in database
      const handleWin = async () => {
        try {
          const dbPlayerId = dbPlayerIds[currentPlayer.id];
          await completeLeg(legId, dbPlayerId);
          console.log('Leg completed in database');
        } catch (error) {
          console.error('Failed to complete leg:', error);
        }
      };
      handleWin();

      setTimeout(() => {
        alert(`${currentPlayer.name} wins!`);
        setGameComplete(true);
      }, 300);
      return;
    }

    // Check for bust (score would go below 0 or to exactly 1)
    if (newScore < 0 || newScore === 1) {
      // Bust! Don't update score
      setTimeout(() => {
        alert(`${currentPlayer.name} BUST!`);
      }, 300);
      return;
    }

    // Normal scoring - update player score
    updatePlayerScore(totalScore);
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

  // Complete turn - add to history, save to database, and move to next player
  const handleCompleteTurn = async () => {
    if (currentDarts.length === 0 || gameComplete) return;

    const currentPlayer = players[currentPlayerIndex];
    const currentScore = currentPlayer.score;
    const dbPlayerId = dbPlayerIds[currentPlayer.id];

    try {
      // Calculate throw number (how many turns this player has taken)
      const playerTurns = throwHistory.filter(t => t.playerId === currentPlayer.id).length / 3;
      const throwNumber = Math.floor(playerTurns) + 1;

      // Record each dart to database
      for (let i = 0; i < currentDarts.length; i++) {
        const dart = currentDarts[i];
        await recordThrow(
          legId,
          dbPlayerId,
          throwNumber,
          i + 1, // dart_number (1, 2, or 3)
          dart.score,
          dart.multiplier,
          dart.score === 0 // is_miss
        );
      }

      // Add turn to history (frontend)
      const historyDarts = currentDarts.map((dart, index) => ({
        ...dart,
        playerId: currentPlayer.id,
        bust: false,
        remainingScore: currentScore - currentDarts.slice(0, index + 1).reduce((sum, d) => sum + d.score, 0)
      }));
      setThrowHistory(prev => [...prev, ...historyDarts]);

      // Clear current darts and move to next player
      setCurrentDarts([]);
      nextPlayer();

      console.log('Turn saved to database');
    } catch (error) {
      console.error('Failed to save turn:', error);
      alert('Failed to save turn. Please try again.');
    }
  };

  // Move to next player
  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  // Undo last dart - also undo the score change
  const handleUndo = () => {
    if (currentDarts.length > 0) {
      const lastDart = currentDarts[currentDarts.length - 1];
      // Restore the score
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) =>
          index === currentPlayerIndex
            ? { ...player, score: player.score + lastDart.score }
            : player
        )
      );
      // Remove the dart
      setCurrentDarts((prev) => prev.slice(0, -1));
    }
  };

  // Reset current turn - restore all scores from this turn
  const handleReset = () => {
    if (currentDarts.length > 0) {
      const totalToRestore = currentDarts.reduce((sum, dart) => sum + dart.score, 0);
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) =>
          index === currentPlayerIndex
            ? { ...player, score: player.score + totalToRestore }
            : player
        )
      );
    }
    setCurrentDarts([]);
  };

  // Handle game start
  const handleStartGame = async ({ players: newPlayers, gameType: newGameType, format: newFormat }) => {
    try {
      const startingScore = parseInt(newGameType);

      // Create or get players from database
      const dbPlayer1 = await getOrCreatePlayer(newPlayers[0].name);
      const dbPlayer2 = await getOrCreatePlayer(newPlayers[1].name);

      // Map local player IDs to database IDs
      const playerIdMap = {
        [newPlayers[0].id]: dbPlayer1.id,
        [newPlayers[1].id]: dbPlayer2.id,
      };
      setDbPlayerIds(playerIdMap);

      // Create game in database
      const game = await createGame(newGameType, newFormat, [dbPlayer1.id, dbPlayer2.id]);
      setGameId(game.id);

      // Create first leg
      const leg = await createLeg(game.id, 1);
      setLegId(leg.id);

      // Set up frontend state
      setPlayers(newPlayers.map(p => ({ ...p, score: startingScore })));
      setGameType(newGameType);
      setGameFormat(newFormat);
      setGameStarted(true);

      console.log('Game created:', { game, leg, playerIdMap });
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to start game. Please try again.');
    }
  };

  // Show different views based on state
  if (view === 'history') {
    return <PlayerHistory onBack={() => setView('setup')} />;
  }

  // Show setup screen if game hasn't started
  if (!gameStarted) {
    return <GameSetup onStartGame={handleStartGame} onViewHistory={() => setView('history')} />;
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
              if (confirm('Start a new game? All data will be cleared.')) {
                setGameStarted(false);
                setGameComplete(false);
                setThrowHistory([]);
                setCurrentDarts([]);
                setCurrentPlayerIndex(0);
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
              onCompleteTurn={handleCompleteTurn}
              suggestedCheckout={suggestedCheckout}
              gameComplete={gameComplete}
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
                  onClick={() => setActiveTab('table')}
                  className="px-4 py-2 rounded-t-lg font-semibold transition-colors border-b-2"
                  style={{
                    backgroundColor: activeTab === 'table' ? '#2a3f2e' : 'transparent',
                    borderColor: activeTab === 'table' ? '#a3e635' : 'transparent',
                    color: activeTab === 'table' ? 'white' : '#888'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Table
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
              {activeTab === 'table' && <Table onScoreSelect={handleScoreSelect} />}
              {activeTab === 'history' && <History throwHistory={throwHistory} players={players} />}
              {activeTab === 'stats' && <Statistics throwHistory={throwHistory} players={players} gameComplete={gameComplete} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
