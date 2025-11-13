const History = ({ throwHistory, players }) => {
  // Group throws by turn (3 darts per turn)
  const groupedHistory = [];
  for (let i = 0; i < throwHistory.length; i += 3) {
    const turn = throwHistory.slice(i, Math.min(i + 3, throwHistory.length));
    groupedHistory.push(turn);
  }

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  const formatDart = (dart) => {
    if (dart.score === 0) return 'Miss';
    if (dart.multiplier === 1) return `${dart.score}`;
    if (dart.multiplier === 2) return `D${dart.score}`;
    if (dart.multiplier === 3) return `T${dart.score}`;
    return dart.score;
  };

  const calculateTurnTotal = (turn) => {
    return turn.reduce((sum, dart) => sum + dart.score, 0);
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-semibold">No throws yet</p>
        <p className="text-sm mt-2">Start playing to see your throw history</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {groupedHistory.reverse().map((turn, turnIndex) => {
        const actualTurnIndex = groupedHistory.length - 1 - turnIndex;
        const playerId = turn[0]?.playerId;
        const playerName = getPlayerName(playerId);
        const turnTotal = calculateTurnTotal(turn);
        const isBust = turn[0]?.bust || false;

        return (
          <div
            key={actualTurnIndex}
            className="rounded-lg p-4"
            style={{ backgroundColor: '#0f1419' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="text-sm font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#2a2a2a', color: '#888' }}
                >
                  Turn {actualTurnIndex + 1}
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-white font-medium">{playerName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isBust ? (
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#dc2626', color: 'white' }}
                  >
                    BUST
                  </span>
                ) : (
                  <span
                    className="text-lg font-bold px-3 py-1 rounded-lg"
                    style={{ backgroundColor: '#2a3f2e', color: '#a3e635' }}
                  >
                    {turnTotal}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {turn.map((dart, dartIndex) => (
                <div
                  key={dartIndex}
                  className="text-center py-2 rounded-lg font-semibold"
                  style={{
                    backgroundColor: dart.score === 0 ? '#2a2a2a' : '#1a1f2e',
                    color: dart.score === 0 ? '#666' : 'white',
                  }}
                >
                  {formatDart(dart)}
                </div>
              ))}
              {/* Fill empty slots if less than 3 darts */}
              {turn.length < 3 &&
                Array(3 - turn.length)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="text-center py-2 rounded-lg"
                      style={{ backgroundColor: '#2a2a2a', color: '#666' }}
                    >
                      -
                    </div>
                  ))}
            </div>

            {turn[0]?.remainingScore !== undefined && (
              <div className="mt-3 text-sm text-gray-400 text-center">
                Remaining: <span className="text-white font-semibold">{turn[0].remainingScore}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default History;
