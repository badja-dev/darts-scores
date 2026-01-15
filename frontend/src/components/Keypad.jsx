import { useState } from 'react';

const Keypad = ({ onScoreSelect }) => {
  const [inputScore, setInputScore] = useState('');
  const [selectedMultiplier, setSelectedMultiplier] = useState(1);

  const handleNumberClick = (num) => {
    // Limit input to 2 digits and max score of 60 for single, 120 for double, 180 for triple
    const newInput = inputScore + num;
    const numValue = parseInt(newInput);

    if (newInput.length <= 2 && numValue <= 60) {
      setInputScore(newInput);
    }
  };

  const handleMultiplierClick = (multiplier) => {
    setSelectedMultiplier(multiplier);
  };

  const handleSubmit = () => {
    if (!inputScore) return;

    const score = parseInt(inputScore);

    // Validate score
    if (score < 0 || (score > 20 && score !== 25)) {
      alert('Invalid score! Must be 0-20 or 25 (bull)');
      return;
    }

    // Submit the score
    onScoreSelect(score, selectedMultiplier);

    // Reset for next input
    setInputScore('');
    setSelectedMultiplier(1);
  };

  const handleMiss = () => {
    onScoreSelect(0, 1);
    setInputScore('');
    setSelectedMultiplier(1);
  };

  const handleClear = () => {
    setInputScore('');
    setSelectedMultiplier(1);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Score Display */}
      <div className="w-full max-w-xl lg:max-w-2xl">
        <div
          className="text-center p-6 rounded-lg mb-4"
          style={{ backgroundColor: '#0f1419' }}
        >
          <div className="text-6xl font-bold text-white mb-2">
            {inputScore || '0'}
          </div>
          <div className="text-xl" style={{ color: '#a3e635' }}>
            {selectedMultiplier === 1 && 'Single'}
            {selectedMultiplier === 2 && 'Double'}
            {selectedMultiplier === 3 && 'Triple'}
          </div>
        </div>

        {/* Multiplier Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => handleMultiplierClick(1)}
            className="py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: selectedMultiplier === 1 ? '#2a3f2e' : '#4a4a4a',
              borderColor: selectedMultiplier === 1 ? '#a3e635' : 'transparent',
              borderWidth: '2px',
              color: 'white',
            }}
          >
            Single
          </button>
          <button
            onClick={() => handleMultiplierClick(2)}
            className="py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: selectedMultiplier === 2 ? '#2a3f2e' : '#4a4a4a',
              borderColor: selectedMultiplier === 2 ? '#a3e635' : 'transparent',
              borderWidth: '2px',
              color: 'white',
            }}
          >
            Double
          </button>
          <button
            onClick={() => handleMultiplierClick(3)}
            className="py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: selectedMultiplier === 3 ? '#2a3f2e' : '#4a4a4a',
              borderColor: selectedMultiplier === 3 ? '#a3e635' : 'transparent',
              borderWidth: '2px',
              color: 'white',
            }}
          >
            Triple
          </button>
        </div>

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="aspect-square rounded-lg text-2xl font-bold transition-all hover:opacity-80"
              style={{
                backgroundColor: '#4a4a4a',
                color: 'white',
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="aspect-square rounded-lg text-xl font-bold transition-all hover:opacity-80"
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
            }}
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="aspect-square rounded-lg text-2xl font-bold transition-all hover:opacity-80"
            style={{
              backgroundColor: '#4a4a4a',
              color: 'white',
            }}
          >
            0
          </button>
          <button
            onClick={handleSubmit}
            className="aspect-square rounded-lg text-xl font-bold transition-all hover:opacity-80"
            style={{
              backgroundColor: '#a3e635',
              color: '#0a0e1a',
            }}
          >
            ✓
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setInputScore('25');
              setSelectedMultiplier(1);
            }}
            className="py-3 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{
              backgroundColor: '#4a4a4a',
              color: 'white',
            }}
          >
            Bull (25)
          </button>
          <button
            onClick={handleMiss}
            className="py-3 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{
              backgroundColor: '#4a4a4a',
              color: 'white',
            }}
          >
            MISS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Keypad;
