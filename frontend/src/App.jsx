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
    { id: 1, name: 'Player 1', score: 501, legsWon: 0 },
    { id: 2, name: 'Player 2', score: 501, legsWon: 0 },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Current turn state
  const [currentDarts, setCurrentDarts] = useState([]);
  const [turnStartScore, setTurnStartScore] = useState(null); // Track score at start of turn for bust restoration

  // Throw history
  const [throwHistory, setThrowHistory] = useState([]);

  // Suggested checkout
  const [suggestedCheckout, setSuggestedCheckout] = useState(null);

  // Easter eggs
  const [showNice, setShowNice] = useState(false);
  const [showBlazeIt, setShowBlazeIt] = useState(false);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const gameState = {
        gameId,
        legId,
        dbPlayerIds,
        gameType,
        gameFormat,
        currentLeg,
        totalLegs,
        players,
        currentPlayerIndex,
        currentDarts,
        turnStartScore,
        throwHistory,
        timestamp: Date.now(),
      };
      localStorage.setItem('dartsGameState', JSON.stringify(gameState));
    } else if (gameComplete) {
      // Clear saved game when complete
      localStorage.removeItem('dartsGameState');
    }
  }, [gameStarted, gameComplete, gameId, legId, dbPlayerIds, gameType, gameFormat, currentLeg, totalLegs, players, currentPlayerIndex, currentDarts, turnStartScore, throwHistory]);

  // Update checkout suggestion when current player's score changes
  useEffect(() => {
    const currentPlayer = players[currentPlayerIndex];
    const isEndlessMode = gameType === 'Endless';
    if (currentPlayer && !isEndlessMode) {
      const suggestion = getCheckoutSuggestion(currentPlayer.score);
      setSuggestedCheckout(suggestion);
    } else {
      setSuggestedCheckout(null);
    }
  }, [players, currentPlayerIndex, gameType]);

  // Handle score selection from dartboard
  const handleScoreSelect = (score, multiplier) => {
    if (currentDarts.length >= 3 || gameComplete) return;

    // Clear easter eggs when starting a new turn
    if (showNice) {
      setShowNice(false);
    }
    if (showBlazeIt && currentDarts.length === 0) {
      // Only clear blaze it when starting a fresh turn (not adding to existing darts)
      setShowBlazeIt(false);
    }

    const currentPlayer = players[currentPlayerIndex];

    // Capture the score at the start of the turn (before any darts are thrown)
    if (currentDarts.length === 0) {
      setTurnStartScore(currentPlayer.score);
    }

    const totalScore = score * multiplier;
    const newDarts = [...currentDarts, { score: totalScore, multiplier }];
    setCurrentDarts(newDarts);

    // Easter egg: Check if turn total equals 69
    const turnTotal = newDarts.reduce((sum, dart) => sum + dart.score, 0);
    if (turnTotal === 69) {
      setShowNice(true);
    }

    // Update score immediately
    const isEndlessMode = gameType === 'Endless';
    const newScore = isEndlessMode
      ? currentPlayer.score + totalScore
      : currentPlayer.score - totalScore;

    // Easter egg: Check if score is 420
    if (newScore === 420) {
      setShowBlazeIt(true);
    } else if (showBlazeIt) {
      setShowBlazeIt(false);
    }

    // Skip win/bust checks for endless mode
    if (isEndlessMode) {
      updatePlayerScore(totalScore, isEndlessMode);
      return;
    }

    // Check for exact finish with double (Double Out rule) or Straight Out
    const isWin = gameFormat === 'Double Out'
      ? (newScore === 0 && multiplier === 2)
      : (newScore === 0);

    if (isWin) {
      // Leg won! Update score and record the winning throw
      updatePlayerScore(totalScore);

      // Record the winning throw to database and handle leg completion
      const handleLegWin = async () => {
        try {
          const dbPlayerId = dbPlayerIds[currentPlayer.id];

          // Calculate throw number (count actual completed turns for this player)
          const playerThrows = throwHistory.filter(t => t.playerId === currentPlayer.id);
          let throwNumber = 1;
          if (playerThrows.length > 0) {
            // Find the highest throw number already recorded for this player
            const throwNumbers = new Set();
            let currentThrow = 1;
            for (let i = 0; i < playerThrows.length; i++) {
              throwNumbers.add(currentThrow);
              // Every 3 darts (or less) is a new turn
              if ((i + 1) % 3 === 0) {
                currentThrow++;
              }
            }
            throwNumber = throwNumbers.size + 1;
          }

          // Record each dart in the winning throw to database
          for (let i = 0; i < newDarts.length; i++) {
            const dart = newDarts[i];
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

          // Add winning throw to history (frontend)
          const historyDarts = newDarts.map((dart, index) => ({
            ...dart,
            playerId: currentPlayer.id,
            throwNumber: throwNumber,
            bust: false,
            remainingScore: currentPlayer.score - newDarts.slice(0, index + 1).reduce((sum, d) => sum + d.score, 0)
          }));
          setThrowHistory(prev => [...prev, ...historyDarts]);

          // Complete the leg in database
          await completeLeg(legId, dbPlayerId);
          console.log('Leg completed in database');

          // Update leg wins for the winner
          const updatedPlayers = players.map(p =>
            p.id === currentPlayer.id ? { ...p, legsWon: p.legsWon + 1 } : p
          );

          const winner = updatedPlayers.find(p => p.id === currentPlayer.id);
          const legsNeededToWin = Math.ceil(totalLegs / 2);

          // Check if game is won (won enough legs)
          if (winner.legsWon >= legsNeededToWin) {
            setPlayers(updatedPlayers);
            setCurrentDarts([]);
            setTurnStartScore(null);
            setTimeout(() => {
              // Handle solo vs 2-player win messages
              if (players.length === 1) {
                alert(`${currentPlayer.name} completes the game!`);
              } else {
                const opponent = updatedPlayers.find(p => p.id !== currentPlayer.id);
                alert(`${currentPlayer.name} wins the game ${winner.legsWon}-${opponent.legsWon}!`);
              }
              setGameComplete(true);
            }, 300);
          } else {
            // Game continues - start next leg
            setCurrentDarts([]);
            setTurnStartScore(null);
            setTimeout(async () => {
              alert(`${currentPlayer.name} wins leg ${currentLeg}!`);

              // Update players with leg win and reset scores
              const startingScore = parseInt(gameType);
              setPlayers(updatedPlayers.map(p => ({ ...p, score: startingScore })));

              // Create new leg in database
              const newLegNumber = currentLeg + 1;
              const newLeg = await createLeg(gameId, newLegNumber);
              setLegId(newLeg.id);
              setCurrentLeg(newLegNumber);

              // Reset turn state
              setThrowHistory([]);
              setCurrentPlayerIndex(0);

              console.log('New leg started:', newLegNumber);
            }, 300);
          }
        } catch (error) {
          console.error('Failed to handle leg win:', error);
          alert('Error processing leg win. Please try again.');
        }
      };
      handleLegWin();
      return;
    }

    // Check for bust (score would go below 0 or to exactly 1)
    if (newScore < 0 || newScore === 1) {
      // Bust! Restore score to what it was at the start of this turn
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) =>
          index === currentPlayerIndex
            ? { ...player, score: turnStartScore }
            : player
        )
      );

      // Clear current darts and reset turn start score
      setCurrentDarts([]);
      setTurnStartScore(null);

      // Show bust alert and move to next player
      setTimeout(() => {
        alert(`${currentPlayer.name} BUST!`);
        nextPlayer();
      }, 300);
      return;
    }

    // Normal scoring - update player score
    updatePlayerScore(totalScore);
  };

  // Update player score
  const updatePlayerScore = (dartScore, isEndless = false) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, index) =>
        index === currentPlayerIndex
          ? { ...player, score: isEndless ? player.score + dartScore : player.score - dartScore }
          : player
      )
    );
  };

  // Complete turn - add to history, save to database, and move to next player
  const handleCompleteTurn = async () => {
    if (currentDarts.length === 0 || gameComplete) return;

    // Clear easter eggs when turn is completed
    if (showNice) {
      setShowNice(false);
    }
    if (showBlazeIt) {
      setShowBlazeIt(false);
    }

    const currentPlayer = players[currentPlayerIndex];
    const currentScore = currentPlayer.score;
    const dbPlayerId = dbPlayerIds[currentPlayer.id];

    try {
      // Calculate throw number (count actual completed turns for this player)
      const playerThrows = throwHistory.filter(t => t.playerId === currentPlayer.id);
      let throwNumber = 1;
      if (playerThrows.length > 0) {
        // Find the highest throw number already recorded for this player
        const throwNumbers = new Set();
        let currentThrow = 1;
        for (let i = 0; i < playerThrows.length; i++) {
          throwNumbers.add(currentThrow);
          // Every 3 darts (or less) is a new turn
          if ((i + 1) % 3 === 0) {
            currentThrow++;
          }
        }
        throwNumber = throwNumbers.size + 1;
      }

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
        throwNumber: throwNumber,
        bust: false,
        remainingScore: currentScore - currentDarts.slice(0, index + 1).reduce((sum, d) => sum + d.score, 0)
      }));
      setThrowHistory(prev => [...prev, ...historyDarts]);

      // Clear current darts and reset turn start score, then move to next player
      setCurrentDarts([]);
      setTurnStartScore(null);
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
      const isEndlessMode = gameType === 'Endless';
      const currentPlayer = players[currentPlayerIndex];
      const restoredScore = isEndlessMode ? currentPlayer.score - lastDart.score : currentPlayer.score + lastDart.score;

      // Restore the score (reverse the operation)
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) =>
          index === currentPlayerIndex
            ? { ...player, score: restoredScore }
            : player
        )
      );
      // Remove the dart
      const newDarts = currentDarts.slice(0, -1);
      setCurrentDarts(newDarts);

      // If no darts left, clear turn start score
      if (newDarts.length === 0) {
        setTurnStartScore(null);
      }

      // Check if we should still show "nice" after undo
      const turnTotal = newDarts.reduce((sum, dart) => sum + dart.score, 0);
      if (turnTotal !== 69) {
        setShowNice(false);
      }

      // Check if we should still show "blaze it" after undo
      if (restoredScore !== 420) {
        setShowBlazeIt(false);
      }
    }
  };

  // Reset current turn - restore all scores from this turn
  const handleReset = () => {
    if (currentDarts.length > 0 && turnStartScore !== null) {
      // Restore score to what it was at the start of the turn
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) =>
          index === currentPlayerIndex
            ? { ...player, score: turnStartScore }
            : player
        )
      );
    }
    setCurrentDarts([]);
    setTurnStartScore(null);
    setShowNice(false);
    setShowBlazeIt(false);
  };

  // Handle game start
  const handleStartGame = async ({ players: newPlayers, gameType: newGameType, format: newFormat, numberOfLegs, gameMode }) => {
    try {
      const isEndlessMode = newGameType === 'Endless';
      const startingScore = isEndlessMode ? 0 : parseInt(newGameType);
      const isSoloMode = gameMode === 'solo';

      // Create or get players from database
      const dbPlayer1 = await getOrCreatePlayer(newPlayers[0].name);
      const dbPlayer2 = isSoloMode ? null : await getOrCreatePlayer(newPlayers[1].name);

      // Map local player IDs to database IDs
      const playerIdMap = {
        [newPlayers[0].id]: dbPlayer1.id,
      };
      if (!isSoloMode) {
        playerIdMap[newPlayers[1].id] = dbPlayer2.id;
      }
      setDbPlayerIds(playerIdMap);

      // Create game in database
      const playerIds = isSoloMode ? [dbPlayer1.id] : [dbPlayer1.id, dbPlayer2.id];
      const game = await createGame(newGameType, newFormat, playerIds);
      setGameId(game.id);

      // Create first leg
      const leg = await createLeg(game.id, 1);
      setLegId(leg.id);

      // Set up frontend state
      setPlayers(newPlayers.map(p => ({ ...p, score: startingScore, legsWon: 0 })));
      setGameType(newGameType);
      setGameFormat(newFormat);
      // Solo mode and Endless mode always single leg
      setTotalLegs(isSoloMode || isEndlessMode ? 1 : numberOfLegs);
      setCurrentLeg(1);
      setGameStarted(true);

      console.log('Game created:', { game, leg, playerIdMap, numberOfLegs, gameMode });
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to start game. Please try again.');
    }
  };

  // Handle resuming saved game
  const handleResumeGame = () => {
    try {
      const savedState = localStorage.getItem('dartsGameState');
      if (!savedState) return false;

      const gameState = JSON.parse(savedState);

      // Restore all state
      setGameId(gameState.gameId);
      setLegId(gameState.legId);
      setDbPlayerIds(gameState.dbPlayerIds);
      setGameType(gameState.gameType);
      setGameFormat(gameState.gameFormat);
      setCurrentLeg(gameState.currentLeg);
      setTotalLegs(gameState.totalLegs);
      setPlayers(gameState.players);
      setCurrentPlayerIndex(gameState.currentPlayerIndex);
      setCurrentDarts(gameState.currentDarts);
      setTurnStartScore(gameState.turnStartScore);
      setThrowHistory(gameState.throwHistory);
      setGameStarted(true);

      return true;
    } catch (error) {
      console.error('Failed to resume game:', error);
      localStorage.removeItem('dartsGameState');
      return false;
    }
  };

  // Show different views based on state
  if (view === 'history') {
    return <PlayerHistory onBack={() => setView('setup')} />;
  }

  // Show setup screen if game hasn't started
  if (!gameStarted) {
    return <GameSetup onStartGame={handleStartGame} onViewHistory={() => setView('history')} onResumeGame={handleResumeGame} />;
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
                {gameType === 'Endless'
                  ? 'Endless Mode'
                  : `${gameType} • ${gameFormat} • ${totalLegs === 1 ? 'Single Leg' : `Best of ${totalLegs}`}`
                }
              </p>
            </div>
          </div>

          {gameComplete ? (
            <button
              onClick={() => {
                setGameStarted(false);
                setGameComplete(false);
                setThrowHistory([]);
                setCurrentDarts([]);
                setCurrentPlayerIndex(0);
              }}
              className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: '#a3e635', color: '#0a0e1a' }}
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Menu
            </button>
          ) : (
            <button
              onClick={() => {
                const isEndlessMode = gameType === 'Endless';
                if (isEndlessMode) {
                  // For endless mode, just end the game and show stats
                  if (confirm('End this game and view statistics?')) {
                    setGameComplete(true);
                    setActiveTab('stats'); // Switch to stats tab
                  }
                } else {
                  // For regular games, reset everything
                  if (confirm('Start a new game? All data will be cleared.')) {
                    setGameStarted(false);
                    setGameComplete(false);
                    setThrowHistory([]);
                    setCurrentDarts([]);
                    setCurrentPlayerIndex(0);
                  }
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
                  d={gameType === 'Endless' ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"}
                />
              </svg>
              {gameType === 'Endless' ? 'End Game' : 'New Game'}
            </button>
          )}
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
                Mode: <span style={{ color: '#a3e635' }}>{players.length === 1 ? 'Solo Practice' : '2 Player'}</span>
              </span>
            </div>

            {gameType !== 'Endless' && (
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
            )}
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

        {/* Easter eggs */}
        {(showNice || showBlazeIt) && (
          <div className="mt-4 flex justify-center gap-4">
            {showNice && (
              <p className="text-sm" style={{ color: '#a3e635' }}>
                nice
              </p>
            )}
            {showBlazeIt && (
              <p className="text-sm" style={{ color: '#a3e635' }}>
                blaze it
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
