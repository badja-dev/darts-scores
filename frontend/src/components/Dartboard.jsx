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
        className="w-full max-w-2xl"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
      >
        {/* Outer border */}
        <circle cx="200" cy="200" r="195" fill="#2a2a2a" />

        {/* Double ring (outer) */}
        <circle cx="200" cy="200" r="190" fill="none" stroke="#4a4a4a" strokeWidth="2" />

        {/* Main segments */}
        {segments.map((score, index) => {
          // Adjust angle to center 20 at top (subtract 9 degrees to center each segment)
          const angle = (index * 18 - 90 - 9) * (Math.PI / 180);
          const nextAngle = ((index + 1) * 18 - 90 - 9) * (Math.PI / 180);

          return (
            <g key={`segment-${index}`}>
              {/* Main segment area - adjusted for wider double ring */}
              <path
                d={`M 200 200 L ${200 + 180 * Math.cos(angle)} ${200 + 180 * Math.sin(angle)} A 180 180 0 0 1 ${200 + 180 * Math.cos(nextAngle)} ${200 + 180 * Math.sin(nextAngle)} Z`}
                fill={getSegmentColor(index)}
                stroke="#2a2a2a"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleSegmentClick(score, 1)}
              />

              {/* Triple ring - made wider (105 to 125 = 20 units wide) */}
              <path
                d={`M ${200 + 105 * Math.cos(angle)} ${200 + 105 * Math.sin(angle)} L ${200 + 125 * Math.cos(angle)} ${200 + 125 * Math.sin(angle)} A 125 125 0 0 1 ${200 + 125 * Math.cos(nextAngle)} ${200 + 125 * Math.sin(nextAngle)} L ${200 + 105 * Math.cos(nextAngle)} ${200 + 105 * Math.sin(nextAngle)} A 105 105 0 0 0 ${200 + 105 * Math.cos(angle)} ${200 + 105 * Math.sin(angle)}`}
                fill={index % 2 === 0 ? "#dc2626" : "#a3e635"}
                stroke="#2a2a2a"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleSegmentClick(score, 3)}
              />

              {/* Double ring - made wider (160 to 180 = 20 units wide) */}
              <path
                d={`M ${200 + 160 * Math.cos(angle)} ${200 + 160 * Math.sin(angle)} L ${200 + 180 * Math.cos(angle)} ${200 + 180 * Math.sin(angle)} A 180 180 0 0 1 ${200 + 180 * Math.cos(nextAngle)} ${200 + 180 * Math.sin(nextAngle)} L ${200 + 160 * Math.cos(nextAngle)} ${200 + 160 * Math.sin(nextAngle)} A 160 160 0 0 0 ${200 + 160 * Math.cos(angle)} ${200 + 160 * Math.sin(angle)}`}
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
        onClick={() => handleSegmentClick(0, 1)}
      >
        MISS
      </button>
    </div>
  );
};

export default Dartboard;
