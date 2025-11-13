import { useState } from 'react';

const Dartboard = ({ onScoreSelect }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Dartboard segments in clockwise order starting from top
  const segments = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

  // Colors for segments (alternating black and cream)
  const getSegmentColor = (index) => {
    return index % 2 === 0 ? '#1a1a1a' : '#f5e6d3';
  };

  const handleSegmentClick = (score, multiplier) => {
    if (onScoreSelect) {
      onScoreSelect(score, multiplier);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-md"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
      >
        {/* Outer border */}
        <circle cx="200" cy="200" r="195" fill="#2a2a2a" />

        {/* Double ring (outer) */}
        <circle cx="200" cy="200" r="185" fill="none" stroke="#4a4a4a" strokeWidth="2" />

        {/* Main segments */}
        {segments.map((score, index) => {
          // Adjust angle to center 20 at top (subtract 9 degrees to center each segment)
          const angle = (index * 18 - 90 - 9) * (Math.PI / 180);
          const nextAngle = ((index + 1) * 18 - 90 - 9) * (Math.PI / 180);

          return (
            <g key={`segment-${index}`}>
              {/* Main segment area */}
              <path
                d={`M 200 200 L ${200 + 175 * Math.cos(angle)} ${200 + 175 * Math.sin(angle)} A 175 175 0 0 1 ${200 + 175 * Math.cos(nextAngle)} ${200 + 175 * Math.sin(nextAngle)} Z`}
                fill={getSegmentColor(index)}
                stroke="#2a2a2a"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleSegmentClick(score, 1)}
              />

              {/* Triple ring */}
              <path
                d={`M ${200 + 110 * Math.cos(angle)} ${200 + 110 * Math.sin(angle)} L ${200 + 120 * Math.cos(angle)} ${200 + 120 * Math.sin(angle)} A 120 120 0 0 1 ${200 + 120 * Math.cos(nextAngle)} ${200 + 120 * Math.sin(nextAngle)} L ${200 + 110 * Math.cos(nextAngle)} ${200 + 110 * Math.sin(nextAngle)} A 110 110 0 0 0 ${200 + 110 * Math.cos(angle)} ${200 + 110 * Math.sin(angle)}`}
                fill={index % 2 === 0 ? "#dc2626" : "#a3e635"}
                stroke="#2a2a2a"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleSegmentClick(score, 3)}
              />

              {/* Double ring */}
              <path
                d={`M ${200 + 165 * Math.cos(angle)} ${200 + 165 * Math.sin(angle)} L ${200 + 175 * Math.cos(angle)} ${200 + 175 * Math.sin(angle)} A 175 175 0 0 1 ${200 + 175 * Math.cos(nextAngle)} ${200 + 175 * Math.sin(nextAngle)} L ${200 + 165 * Math.cos(nextAngle)} ${200 + 165 * Math.sin(nextAngle)} A 165 165 0 0 0 ${200 + 165 * Math.cos(angle)} ${200 + 165 * Math.sin(angle)}`}
                fill={index % 2 === 0 ? "#dc2626" : "#a3e635"}
                stroke="#2a2a2a"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleSegmentClick(score, 2)}
              />

              {/* Score labels */}
              <text
                x={200 + 185 * Math.cos(angle + 0.157)}
                y={200 + 185 * Math.sin(angle + 0.157)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {score}
              </text>
            </g>
          );
        })}

        {/* Outer bull (green) */}
        <circle
          cx="200"
          cy="200"
          r="20"
          fill="#a3e635"
          stroke="#2a2a2a"
          strokeWidth="2"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleSegmentClick(25, 1)}
        />

        {/* Inner bull / Bullseye (red) */}
        <circle
          cx="200"
          cy="200"
          r="10"
          fill="#dc2626"
          stroke="#2a2a2a"
          strokeWidth="2"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleSegmentClick(25, 2)}
        />
      </svg>

      <button
        className="mt-4 px-6 py-2 rounded-lg font-semibold transition-colors"
        style={{ backgroundColor: '#4a4a4a', color: 'white' }}
        onClick={() => handleSegmentClick(0, 0)}
      >
        MISS
      </button>
    </div>
  );
};

export default Dartboard;
