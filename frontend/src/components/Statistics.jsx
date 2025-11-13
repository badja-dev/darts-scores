const Statistics = ({ throwHistory, players }) => {
  const calculatePlayerStats = (playerId) => {
    const playerThrows = throwHistory.filter(t => t.playerId === playerId && !t.bust);

    if (playerThrows.length === 0) {
      return {
        totalDarts: 0,
        totalScore: 0,
        average: 0,
        threeDartAverage: 0,
        highestScore: 0,
        doubles: 0,
        triples: 0,
      };
    }

    const totalScore = playerThrows.reduce((sum, t) => sum + t.score, 0);
    const doubles = playerThrows.filter(t => t.multiplier === 2).length;
    const triples = playerThrows.filter(t => t.multiplier === 3).length;
    const highestScore = Math.max(...playerThrows.map(t => t.score));

    // Calculate 3-dart average
    const turns = [];
    for (let i = 0; i < playerThrows.length; i += 3) {
      const turn = playerThrows.slice(i, i + 3);
      if (turn.length > 0) {
        turns.push(turn.reduce((sum, t) => sum + t.score, 0));
      }
    }
    const threeDartAverage = turns.length > 0
      ? turns.reduce((sum, t) => sum + t, 0) / turns.length
      : 0;

    return {
      totalDarts: playerThrows.length,
      totalScore,
      average: totalScore / playerThrows.length,
      threeDartAverage,
      highestScore,
      doubles,
      triples,
      turns: turns.length,
    };
  };

  if (throwHistory.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg
          className="w-16 h-16 mx-auto mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-lg font-semibold">No statistics yet</p>
        <p className="text-sm mt-2">Start playing to see your game statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {players.map((player) => {
        const stats = calculatePlayerStats(player.id);

        return (
          <div
            key={player.id}
            className="rounded-lg p-6"
            style={{ backgroundColor: '#0f1419' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                  style={{ backgroundColor: '#2a3f2e', color: '#a3e635' }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{player.name}</h3>
                  <p className="text-sm text-gray-400">Current Score: {player.score}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p className="text-xs text-gray-400 mb-1">3-Dart Avg</p>
                <p className="text-2xl font-bold text-white">
                  {stats.threeDartAverage.toFixed(2)}
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p className="text-xs text-gray-400 mb-1">1-Dart Avg</p>
                <p className="text-2xl font-bold text-white">
                  {stats.average.toFixed(2)}
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p className="text-xs text-gray-400 mb-1">Highest Score</p>
                <p className="text-2xl font-bold" style={{ color: '#a3e635' }}>
                  {stats.highestScore}
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p className="text-xs text-gray-400 mb-1">Total Darts</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalDarts}
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p className="text-xs text-gray-400 mb-1">Doubles Hit</p>
                <p className="text-2xl font-bold text-white">
                  {stats.doubles}
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p className="text-xs text-gray-400 mb-1">Triples Hit</p>
                <p className="text-2xl font-bold text-white">
                  {stats.triples}
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p className="text-xs text-gray-400 mb-1">Total Score</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalScore}
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1f2e' }}>
                <p className="text-xs text-gray-400 mb-1">Turns Played</p>
                <p className="text-2xl font-bold text-white">
                  {stats.turns}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Statistics;
