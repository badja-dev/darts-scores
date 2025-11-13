const CurrentTurn = ({ darts, onUndo, onReset, onCompleteTurn, suggestedCheckout, gameComplete }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-6" style={{ backgroundColor: '#1a1f2e' }}>
        <h2 className="text-xl font-bold mb-4 text-white">Current Turn</h2>

        {/* Dart displays */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="aspect-square rounded-lg flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: '#0f1419', color: 'white' }}
            >
              {darts[index] !== undefined ? (
                <span>{darts[index].score === 0 ? '-' : darts[index].score}</span>
              ) : (
                <span className="text-gray-600">-</span>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={onUndo}
            disabled={darts.length === 0 || gameComplete}
            className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              backgroundColor: darts.length === 0 || gameComplete ? '#2a2a2a' : '#4a4a4a',
              color: 'white',
            }}
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
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            Undo
          </button>
          <button
            onClick={onReset}
            disabled={darts.length === 0 || gameComplete}
            className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: darts.length === 0 || gameComplete ? '#2a2a2a' : '#4a4a4a',
              color: 'white',
            }}
          >
            Reset
          </button>
        </div>

        {/* Complete Turn button */}
        <button
          onClick={onCompleteTurn}
          disabled={darts.length === 0 || gameComplete}
          className="w-full px-4 py-3 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: darts.length === 0 || gameComplete ? '#2a2a2a' : '#a3e635',
            color: darts.length === 0 || gameComplete ? '#888' : '#0a0e1a',
          }}
        >
          Complete Turn
        </button>
      </div>

      {/* Suggested checkout */}
      {suggestedCheckout && (
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: '#1e3a5f', borderLeft: '4px solid #3b82f6' }}
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 mt-0.5 flex-shrink-0"
              style={{ color: '#3b82f6' }}
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
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#93c5fd' }}>
                Suggested Checkout
              </p>
              <p className="text-lg font-bold text-white">{suggestedCheckout}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentTurn;
