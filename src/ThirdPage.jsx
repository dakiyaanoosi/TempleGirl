import { useRef, useEffect, useState } from 'react';
import './ThirdPage.css';

export default function ThirdPage() {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Dynamic responsive width listener for Kolam wave border
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth || 1200);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Responsive Kolam border calculation
  const waveSegmentWidth = 30;
  const numWaves = Math.max(4, Math.floor(containerWidth / waveSegmentWidth));
  const kolamSvgWidth = numWaves * waveSegmentWidth;

  // Generate path string dynamically for numWaves
  const generateWavePath = () => {
    let d = "M 0 12 Q 15 3, 30 12";
    for (let i = 1; i < numWaves; i++) {
      d += ` T ${(i + 1) * waveSegmentWidth} 12`;
    }
    return d;
  };

  // Generate gold dots dynamically based on number of waves
  const renderDots = () => {
    const dots = [];
    let isUpper = true;
    for (let i = 0; i < numWaves; i++) {
      const cx = i * waveSegmentWidth + 15;
      const cy = isUpper ? 15.5 : 8.5;
      dots.push(
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="2.2"
          fill="#F2B84B"
        />
      );
      isUpper = !isUpper;
    }
    return dots;
  };

  return (
    <section className="third-page-section" id="third-page">
      {/* Responsive Top Kolam Wave Border */}
      <div ref={containerRef} className="wave-container top-wave-container">
        <svg
          className="third-page-wave"
          viewBox={`0 0 ${kolamSvgWidth} 24`}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d={generateWavePath()}
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {renderDots()}
          </g>
        </svg>
      </div>

      <div className="third-page-content">
        {/* Future 3rd Page Content Container */}
      </div>
    </section>
  );
}
