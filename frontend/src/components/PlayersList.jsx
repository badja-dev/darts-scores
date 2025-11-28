const PlayersList = ({ players, currentPlayerId }) => {
  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: '#1a1f2e' }}>
      <h2 className="text-xl font-bold mb-4 text-white">Players</h2>
      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              player.id === currentPlayerId ? 'ring-2' : ''
            }`}
            style={{
              backgroundColor: player.id === currentPlayerId ? '#2a3f2e' : '#0f1419',
              borderColor: player.id === currentPlayerId ? '#a3e635' : 'transparent',
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-gray-400">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{player.name}</span>
                  {player.id === currentPlayerId && (
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{ backgroundColor: '#a3e635', color: '#0a0e1a' }}
                    >
                      Current
                    </span>
                  )}
                </div>
                {player.legsWon > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    Legs won: {player.legsWon}
                  </div>
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{player.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
