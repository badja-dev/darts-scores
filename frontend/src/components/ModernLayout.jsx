import { useState, useEffect } from 'react';
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
  showNice,
  showBlazeIt,
}) => {
  // Random position for easter eggs - changes when they appear
  const [easterEggPosition, setEasterEggPosition] = useState({ x: 50, y: 50, side: 'left' });

  useEffect(() => {
    if (showNice || showBlazeIt) {
      setEasterEggPosition({
        x: 10 + Math.random() * 80, // 10-90% horizontal within the side area
        y: 20 + Math.random() * 60, // 20-80% vertical
        side: Math.random() > 0.5 ? 'left' : 'right',
      });
    }
  }, [showNice, showBlazeIt]);
  // Calculate player statistics
  const calculatePlayerStats = (playerId) => {
    const playerThrows = throwHistory.filter(t => t.playerId === playerId && !t.bust);

    if (playerThrows.length === 0) {
      return {
        threeDartAverage: 0,
        oneDartAverage: 0,
        turnScores: [],
        amountBreakdown: {
          '180s': 0,
          '160-179': 0,
          '140-159': 0,
          '120-139': 0,
          '100-119': 0,
          '80-99': 0,
          '60-79': 0,
          '0-59': 0,
        },
        topSegments: [],
      };
    }

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
      turnBreakdowns: turns,
      amountBreakdown,
      topSegments,
    };
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

  // Stats panel component
  const StatsPanel = ({ stats, align }) => (
    <div className={`flex flex-col gap-3 text-white text-sm ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <div className="rounded-lg p-3" style={{ backgroundColor: '#2c4f7c' }}>
        <div className="font-bold text-base mb-2">AVERAGES</div>
        <div className="flex justify-between gap-4">
          <span>3 DART</span>
          <span className="font-bold">{stats.threeDartAverage.toFixed(1)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>1 DART</span>
          <span className="font-bold">{stats.oneDartAverage.toFixed(1)}</span>
        </div>
      </div>
      <div className="rounded-lg p-3" style={{ backgroundColor: '#2c4f7c' }}>
        <div className="font-bold text-base mb-2">AMOUNT</div>
        {Object.entries(stats.amountBreakdown).map(([range, count]) => (
          <div key={range} className="flex justify-between gap-4">
            <span>{range}</span>
            <span className="font-bold">{count}</span>
          </div>
        ))}
      </div>
      {stats.topSegments.length > 0 && (
        <div className="rounded-lg p-3" style={{ backgroundColor: '#2c4f7c' }}>
          <div className="font-bold text-base mb-2">TOP SEGM</div>
          {stats.topSegments.map(({ segment, count }) => {
            const [multiplier, number] = segment.split('x');
            let label = multiplier === '3' ? `T${number}` : multiplier === '2' ? `D${number}` : number;
            return (
              <div key={segment} className="flex justify-between gap-4">
                <span>{label}</span>
                <span className="font-bold">{count}x</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#1e3a5f' }}>
      {/* Tabs at top */}
      <div className="flex justify-center py-1 flex-shrink-0">
        {['dartboard', 'keypad', 'table'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1 font-semibold capitalize"
            style={{ color: activeTab === tab ? '#a3e635' : '#888' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Stats - at edge */}
        <div className="w-48 p-2 pt-12 flex-shrink-0 overflow-y-auto relative">
          <StatsPanel stats={stats1} align="left" />
          {/* Easter egg - left side */}
          {(showNice || showBlazeIt) && easterEggPosition.side === 'left' && (
            <div
              className="absolute text-2xl font-bold pointer-events-none animate-pulse"
              style={{
                color: '#a3e635',
                left: `${easterEggPosition.x}%`,
                top: `${easterEggPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 0 10px #a3e635',
              }}
            >
              {showNice ? 'nice' : 'blaze it'}
            </div>
          )}
        </div>

        {/* Center - Scores + Dartboard */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Score Display */}
          <div className={`flex items-start px-4 mb-1 mt-10 ${player2 ? 'justify-between' : 'justify-center'}`}>
            {player2 ? (
              <>
                <div className="flex flex-col items-center">
                  <div className={`rounded-lg px-6 py-3 text-center ${currentPlayerIndex === 0 ? 'ring-2 ring-green-400' : ''}`} style={{ backgroundColor: '#2c4f7c' }}>
                    <div className="text-7xl font-bold text-white">{player1?.score}</div>
                    <div className="text-lg text-white">{player1?.name}</div>
                    {suggestedCheckout && currentPlayerIndex === 0 && (
                      <div className="text-sm text-gray-300">{suggestedCheckout}</div>
                    )}
                  </div>
                  {/* Player 1 Turn History */}
                  <div className="mt-2 h-32 overflow-y-auto w-full">
                    {stats1.turnBreakdowns && [...stats1.turnBreakdowns].reverse().map((turn, idx) => (
                      <div key={idx} className="text-white text-sm flex justify-between px-2 py-0.5" style={{ backgroundColor: idx % 2 === 0 ? 'rgba(44, 79, 124, 0.5)' : 'transparent' }}>
                        <span className="text-gray-400">{stats1.turnBreakdowns.length - idx}.</span>
                        <span className="font-bold">{turn.total}</span>
                        <span className="text-gray-300 text-xs">{turn.darts.map(d => formatDart(d)).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-white pt-4">
                  <div className="text-sm text-gray-400">LEGS</div>
                  <div className="text-2xl font-bold">{player1?.legsWon || 0} - {player2?.legsWon || 0}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`rounded-lg px-6 py-3 text-center ${currentPlayerIndex === 1 ? 'ring-2 ring-green-400' : ''}`} style={{ backgroundColor: '#2c4f7c' }}>
                    <div className="text-7xl font-bold text-white">{player2?.score}</div>
                    <div className="text-lg text-white">{player2?.name}</div>
                    {suggestedCheckout && currentPlayerIndex === 1 && (
                      <div className="text-sm text-gray-300">{suggestedCheckout}</div>
                    )}
                  </div>
                  {/* Player 2 Turn History */}
                  <div className="mt-2 h-32 overflow-y-auto w-full">
                    {stats2?.turnBreakdowns && [...stats2.turnBreakdowns].reverse().map((turn, idx) => (
                      <div key={idx} className="text-white text-sm flex justify-between px-2 py-0.5" style={{ backgroundColor: idx % 2 === 0 ? 'rgba(44, 79, 124, 0.5)' : 'transparent' }}>
                        <span className="text-gray-400">{stats2.turnBreakdowns.length - idx}.</span>
                        <span className="font-bold">{turn.total}</span>
                        <span className="text-gray-300 text-xs">{turn.darts.map(d => formatDart(d)).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="rounded-lg px-12 py-3 text-center" style={{ backgroundColor: '#2c4f7c' }}>
                  <div className="text-7xl font-bold text-white">{player1?.score}</div>
                  <div className="text-lg text-white">{player1?.name}</div>
                  {suggestedCheckout && <div className="text-sm text-gray-300">{suggestedCheckout}</div>}
                </div>
                {/* Solo Player Turn History */}
                <div className="mt-2 h-32 overflow-y-auto w-full">
                  {stats1.turnBreakdowns && [...stats1.turnBreakdowns].reverse().map((turn, idx) => (
                    <div key={idx} className="text-white text-sm flex justify-between gap-4 px-2 py-0.5" style={{ backgroundColor: idx % 2 === 0 ? 'rgba(44, 79, 124, 0.5)' : 'transparent' }}>
                      <span className="text-gray-400">{stats1.turnBreakdowns.length - idx}.</span>
                      <span className="font-bold">{turn.total}</span>
                      <span className="text-gray-300 text-xs">{turn.darts.map(d => formatDart(d)).join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dartboard/Input - fills remaining space */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {activeTab === 'dartboard' && (
              <div className="h-full aspect-square">
                <Dartboard onScoreSelect={onScoreSelect} />
              </div>
            )}
            {activeTab === 'keypad' && <Keypad onScoreSelect={onScoreSelect} />}
            {activeTab === 'table' && <Table onScoreSelect={onScoreSelect} />}
          </div>
        </div>

        {/* Right Stats - at edge */}
        <div className="w-48 p-2 pt-12 flex-shrink-0 overflow-y-auto relative">
          {player2 && stats2 ? (
            <StatsPanel stats={stats2} align="right" />
          ) : (
            <StatsPanel stats={stats1} align="right" />
          )}
          {/* Easter egg - right side */}
          {(showNice || showBlazeIt) && easterEggPosition.side === 'right' && (
            <div
              className="absolute text-2xl font-bold pointer-events-none animate-pulse"
              style={{
                color: '#a3e635',
                left: `${easterEggPosition.x}%`,
                top: `${easterEggPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 0 10px #a3e635',
              }}
            >
              {showNice ? 'nice' : 'blaze it'}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-2 flex-shrink-0" style={{ backgroundColor: '#2c4f7c' }}>
        <div className="flex items-center justify-center gap-4">
          {/* Current darts */}
          <div className="flex gap-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-16 h-12 rounded flex items-center justify-center text-2xl font-bold"
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

          {/* Action buttons */}
          <button
            onClick={() => onScoreSelect(0, 1)}
            disabled={currentDarts.length >= 3 || gameComplete}
            className="px-4 py-2 rounded font-bold transition-all disabled:opacity-50"
            style={{ backgroundColor: '#6b7280', color: 'white' }}
          >
            MISS
          </button>
          <button
            onClick={onCompleteTurn}
            disabled={currentDarts.length === 0 || gameComplete}
            className="px-4 py-2 rounded font-bold transition-all disabled:opacity-50"
            style={{ backgroundColor: currentDarts.length === 0 || gameComplete ? '#4a4a4a' : '#22c55e', color: 'white' }}
          >
            DONE
          </button>
          <button
            onClick={onUndo}
            disabled={(currentDarts.length === 0 && throwHistory.length === 0) || gameComplete}
            className="px-4 py-2 rounded font-bold transition-all disabled:opacity-50"
            style={{ backgroundColor: '#6b7280', color: 'white' }}
          >
            ↺
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernLayout;
