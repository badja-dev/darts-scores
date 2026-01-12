import Dartboard from './Dartboard';
import Keypad from './Keypad';
import Table from './Table';

const ModernLayout = ({
  players,
  currentPlayerIndex,
  currentDarts,
  throwHistory,
  suggestedCheckout,
  gameComplete,
  activeTab,
  setActiveTab,
  onScoreSelect,
  onUndo,
  onReset,
  onCompleteTurn,
  gameType,
  currentLeg,
  totalLegs,
}) => {
  // Calculate player statistics
  const calculatePlayerStats = (playerId) => {
    const playerThrows = throwHistory.filter(t => t.playerId === playerId && !t.bust);

    if (playerThrows.length === 0) {
      return {
        threeDartAverage: 0,
        oneDartAverage: 0,
        turnScores: [],
        amountBreakdown: {},
        topSegments: [],
      };
    }

    // Calculate 3-dart average by grouping by throw number
    const turnMap = new Map();
    playerThrows.forEach(dart => {
      const throwNum = dart.throwNumber || 1;
      if (!turnMap.has(throwNum)) {
        turnMap.set(throwNum, { total: 0, darts: [] });
      }
      const turn = turnMap.get(throwNum);
      turn.total += dart.score;
      turn.darts.push(dart);
    });

    const turns = Array.from(turnMap.values());
    const turnScores = turns.map(t => t.total);
    const threeDartAverage = turnScores.length > 0
      ? turnScores.reduce((sum, t) => sum + t, 0) / turnScores.length
      : 0;

    const totalScore = playerThrows.reduce((sum, t) => sum + t.score, 0);
    const oneDartAverage = totalScore / playerThrows.length;

    // Amount breakdown (180s, 160-179, etc.)
    const amountBreakdown = {
      '180s': turnScores.filter(s => s === 180).length,
      '160-179': turnScores.filter(s => s >= 160 && s < 180).length,
      '140-159': turnScores.filter(s => s >= 140 && s < 160).length,
      '120-139': turnScores.filter(s => s >= 120 && s < 140).length,
      '100-119': turnScores.filter(s => s >= 100 && s < 120).length,
      '80-99': turnScores.filter(s => s >= 80 && s < 100).length,
      '60-79': turnScores.filter(s => s >= 60 && s < 80).length,
      '0-59': turnScores.filter(s => s >= 0 && s < 60).length,
    };

    // Top segments
    const segmentHits = {};
    playerThrows.forEach(dart => {
      if (dart.score === 0) return;
      const baseScore = dart.score / dart.multiplier;
      const key = `${dart.multiplier}x${baseScore}`;
      segmentHits[key] = (segmentHits[key] || 0) + 1;
    });

    const topSegments = Object.entries(segmentHits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([segment, count]) => ({ segment, count }));

    return {
      threeDartAverage,
      oneDartAverage,
      turnScores,
      amountBreakdown,
      topSegments,
    };
  };

  // Get turn-by-turn history for center display
  const getTurnHistory = () => {
    const turnMap = new Map();
    throwHistory.forEach(dart => {
      const key = `${dart.playerId}-${dart.throwNumber}`;
      if (!turnMap.has(key)) {
        turnMap.set(key, { playerId: dart.playerId, darts: [], total: 0 });
      }
      const turn = turnMap.get(key);
      turn.darts.push(dart);
      turn.total += dart.score;
    });
    return Array.from(turnMap.values());
  };

  const formatDart = (dart) => {
    if (dart.score === 0) return 'Miss';
    if (dart.multiplier === 1) return `${dart.score}`;
    if (dart.multiplier === 2) return `D${dart.score / 2}`;
    if (dart.multiplier === 3) return `T${dart.score / 3}`;
    return dart.score;
  };

  const player1 = players[0];
  const player2 = players[1];
  const stats1 = calculatePlayerStats(player1?.id);
  const stats2 = player2 ? calculatePlayerStats(player2.id) : null;
  const turnHistory = getTurnHistory();

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#1e3a5f' }}>
      <div className="max-w-[1600px] mx-auto">
        {/* Top Score Display */}
        <div className="rounded-lg mb-6 relative" style={{ backgroundColor: '#2c4f7c' }}>
          <div className="text-center py-2 text-sm font-semibold" style={{ color: '#fff' }}>
            {gameType !== 'Endless' && totalLegs > 1 && `BEST OF ${totalLegs} LEGS`}
          </div>
          <div className="grid grid-cols-2 divide-x relative" style={{ borderColor: '#1e3a5f' }}>
            {/* Player 1 Score */}
            <div className="p-6 text-center">
              <div className="text-8xl font-bold text-white mb-2">
                {player1?.score}
              </div>
              <div className="text-xl font-semibold text-white mb-1">
                {player1?.name}
                {currentPlayerIndex === 0 && (
                  <>
                    <span className="inline-block w-3 h-3 rounded-full bg-green-400 ml-2"></span>
                    <span className="inline-block w-3 h-3 rounded-full bg-green-400 ml-1"></span>
                  </>
                )}
              </div>
              {suggestedCheckout && currentPlayerIndex === 0 && (
                <div className="text-sm text-gray-300">{suggestedCheckout}</div>
              )}
            </div>

            {/* Legs Display (Center) */}
            {player2 && (
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
                <div className="text-xs mb-2">LEGS</div>
                <div className="flex gap-4 text-2xl font-bold">
                  <div>{player1?.legsWon || 0}</div>
                  <div className="text-gray-400">-</div>
                  <div>{player2?.legsWon || 0}</div>
                </div>
              </div>
            )}

            {/* Player 2 Score */}
            {player2 && (
              <div className="p-6 text-center">
                <div className="text-8xl font-bold text-white mb-2">
                  {player2.score}
                </div>
                <div className="text-xl font-semibold text-white mb-1">
                  {player2.name}
                  {currentPlayerIndex === 1 && (
                    <>
                      <span className="inline-block w-3 h-3 rounded-full bg-green-400 ml-2"></span>
                      <span className="inline-block w-3 h-3 rounded-full bg-green-400 ml-1"></span>
                    </>
                  )}
                </div>
                {suggestedCheckout && currentPlayerIndex === 1 && (
                  <div className="text-sm text-gray-300">{suggestedCheckout}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Player 1 Stats */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: '#2c4f7c' }}>
              <h3 className="text-lg font-bold text-white mb-3">GAME AVERAGES</h3>
              <div className="space-y-2 text-white">
                <div className="flex justify-between">
                  <span className="text-sm">3 DART</span>
                  <span className="font-bold">{stats1.threeDartAverage.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">1 DART</span>
                  <span className="font-bold">{stats1.oneDartAverage.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ backgroundColor: '#2c4f7c' }}>
              <h3 className="text-lg font-bold text-white mb-3">AMOUNT</h3>
              <div className="space-y-1 text-white text-sm">
                {Object.entries(stats1.amountBreakdown).map(([range, count]) => (
                  <div key={range} className="flex justify-between">
                    <span>{range}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {stats1.topSegments.length > 0 && (
              <div className="rounded-lg p-4" style={{ backgroundColor: '#2c4f7c' }}>
                <h3 className="text-lg font-bold text-white mb-3">TOP SEGMENTS</h3>
                <div className="space-y-2 text-white text-sm">
                  {stats1.topSegments.map(({ segment, count }) => {
                    const [multiplier, number] = segment.split('x');
                    let label = '';
                    if (multiplier === '3') label = `T${number}`;
                    else if (multiplier === '2') label = `D${number}`;
                    else label = number;
                    return (
                      <div key={segment} className="flex justify-between">
                        <span>{label}</span>
                        <span className="font-bold">{count}x</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Center Column - History & Input */}
          <div className="lg:col-span-6 space-y-4">
            {/* Score History */}
            <div className="rounded-lg p-4 max-h-[400px] overflow-y-auto" style={{ backgroundColor: '#2c4f7c' }}>
              <h3 className="text-lg font-bold text-white mb-4">SCORE HISTORY</h3>
              <div className="space-y-3">
                {turnHistory.slice().reverse().map((turn, index) => {
                  const player = players.find(p => p.id === turn.playerId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded"
                      style={{ backgroundColor: '#1e3a5f' }}
                    >
                      <div className="text-white text-sm font-semibold w-20">
                        {player?.name}
                      </div>
                      <div className="flex-1 text-center text-white">
                        {turn.darts.map((dart, i) => formatDart(dart)).join(', ')}
                      </div>
                      <div className="text-2xl font-bold text-white w-20 text-right">
                        {turn.total}
                      </div>
                    </div>
                  );
                })}
                {turnHistory.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    No throws yet
                  </div>
                )}
              </div>
            </div>

            {/* Current Turn Display */}
            <div className="rounded-lg p-4" style={{ backgroundColor: '#2c4f7c' }}>
              <div className="text-center mb-4">
                <div className="text-white text-lg font-semibold mb-2">
                  Current Turn - {players[currentPlayerIndex]?.name}
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg flex items-center justify-center text-3xl font-bold"
                      style={{ backgroundColor: '#1e3a5f', color: 'white' }}
                    >
                      {currentDarts[index] !== undefined ? (
                        currentDarts[index].score === 0 ? '-' : currentDarts[index].score
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-4 max-w-md mx-auto">
                <button
                  onClick={onUndo}
                  disabled={currentDarts.length === 0 || gameComplete}
                  className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: currentDarts.length === 0 || gameComplete ? '#4a4a4a' : '#ef4444',
                    color: 'white',
                  }}
                >
                  Undo
                </button>
                <button
                  onClick={onReset}
                  disabled={currentDarts.length === 0 || gameComplete}
                  className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: currentDarts.length === 0 || gameComplete ? '#4a4a4a' : '#f59e0b',
                    color: 'white',
                  }}
                >
                  Reset
                </button>
                <button
                  onClick={onCompleteTurn}
                  disabled={currentDarts.length === 0 || gameComplete}
                  className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: currentDarts.length === 0 || gameComplete ? '#4a4a4a' : '#22c55e',
                    color: 'white',
                  }}
                >
                  Complete
                </button>
              </div>

              {/* Input Tabs */}
              <div className="flex gap-2 mb-4 justify-center">
                <button
                  onClick={() => setActiveTab('dartboard')}
                  className="px-4 py-2 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: activeTab === 'dartboard' ? '#1e3a5f' : 'transparent',
                    color: activeTab === 'dartboard' ? '#a3e635' : '#888',
                  }}
                >
                  Dartboard
                </button>
                <button
                  onClick={() => setActiveTab('keypad')}
                  className="px-4 py-2 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: activeTab === 'keypad' ? '#1e3a5f' : 'transparent',
                    color: activeTab === 'keypad' ? '#a3e635' : '#888',
                  }}
                >
                  Keypad
                </button>
                <button
                  onClick={() => setActiveTab('table')}
                  className="px-4 py-2 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: activeTab === 'table' ? '#1e3a5f' : 'transparent',
                    color: activeTab === 'table' ? '#a3e635' : '#888',
                  }}
                >
                  Table
                </button>
              </div>

              {/* Input Method */}
              <div>
                {activeTab === 'dartboard' && <Dartboard onScoreSelect={onScoreSelect} />}
                {activeTab === 'keypad' && <Keypad onScoreSelect={onScoreSelect} />}
                {activeTab === 'table' && <Table onScoreSelect={onScoreSelect} />}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Player 2 Stats */}
          {player2 && stats2 && (
            <div className="lg:col-span-3 space-y-4">
              <div className="rounded-lg p-4" style={{ backgroundColor: '#2c4f7c' }}>
                <h3 className="text-lg font-bold text-white mb-3">GAME AVERAGES</h3>
                <div className="space-y-2 text-white">
                  <div className="flex justify-between">
                    <span className="text-sm">3 DART</span>
                    <span className="font-bold">{stats2.threeDartAverage.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">1 DART</span>
                    <span className="font-bold">{stats2.oneDartAverage.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: '#2c4f7c' }}>
                <h3 className="text-lg font-bold text-white mb-3">AMOUNT</h3>
                <div className="space-y-1 text-white text-sm">
                  {Object.entries(stats2.amountBreakdown).map(([range, count]) => (
                    <div key={range} className="flex justify-between">
                      <span>{range}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {stats2.topSegments.length > 0 && (
                <div className="rounded-lg p-4" style={{ backgroundColor: '#2c4f7c' }}>
                  <h3 className="text-lg font-bold text-white mb-3">TOP SEGMENTS</h3>
                  <div className="space-y-2 text-white text-sm">
                    {stats2.topSegments.map(({ segment, count }) => {
                      const [multiplier, number] = segment.split('x');
                      let label = '';
                      if (multiplier === '3') label = `T${number}`;
                      else if (multiplier === '2') label = `D${number}`;
                      else label = number;
                      return (
                        <div key={segment} className="flex justify-between">
                          <span>{label}</span>
                          <span className="font-bold">{count}x</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernLayout;
