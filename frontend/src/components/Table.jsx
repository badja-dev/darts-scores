const Table = ({ onScoreSelect }) => {
  // Numbers 1-20 in numerical order
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const handleScoreClick = (number, multiplier) => {
    onScoreSelect(number, multiplier);
  };

  return (
    <div className="space-y-2">
      {/* Number rows - organized in 2 columns for compact display */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {numbers.map((num) => (
          <div
            key={num}
            className="grid grid-cols-3 gap-2 p-2 rounded-lg"
            style={{ backgroundColor: '#0f1419' }}
          >
            <button
              onClick={() => handleScoreClick(num, 1)}
              className="py-2 px-4 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: '#2a3f2e', color: 'white' }}
            >
              {num}
            </button>
            <button
              onClick={() => handleScoreClick(num, 2)}
              className="py-2 px-4 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: '#1a4d2e', color: 'white' }}
            >
              D{num}
            </button>
            <button
              onClick={() => handleScoreClick(num, 3)}
              className="py-2 px-4 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: '#0d3a20', color: 'white' }}
            >
              T{num}
            </button>
          </div>
        ))}
      </div>

      {/* Bull section */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={() => handleScoreClick(25, 1)}
          className="py-3 px-4 rounded-lg font-semibold transition-all hover:opacity-80"
          style={{ backgroundColor: '#2a3f2e', color: 'white' }}
        >
          Bull (25)
        </button>
        <button
          onClick={() => handleScoreClick(25, 2)}
          className="py-3 px-4 rounded-lg font-semibold transition-all hover:opacity-80"
          style={{ backgroundColor: '#1a4d2e', color: 'white' }}
        >
          Bullseye (50)
        </button>
      </div>

      {/* Miss button */}
      <button
        onClick={() => handleScoreClick(0, 1)}
        className="w-full py-3 px-4 rounded-lg font-semibold transition-all hover:opacity-80"
        style={{ backgroundColor: '#4a2020', color: 'white' }}
      >
        MISS
      </button>
    </div>
  );
};

export default Table;
