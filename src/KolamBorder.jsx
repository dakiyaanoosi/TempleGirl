import { useMemo, useRef } from 'react';
import { useWindowWidth } from './hooks/useWindowWidth';
import './KolamBorder.css';

/**
 * Responsive Kolam wave border SVG.
 * Uses the shared useWindowWidth hook (one listener for all instances)
 * and memoizes path/dot generation to avoid re-computation on unrelated renders.
 * @param {string} svgClassName  CSS class applied to the <svg> element.
 *                               Defaults to 'second-page-wave'.
 */
export default function KolamBorder({ svgClassName = 'second-page-wave' }) {
  const containerRef = useRef(null);
  // useWindowWidth shares a single resize listener across all KolamBorder instances
  useWindowWidth(); // triggers re-render on resize so we can read updated clientWidth

  const containerWidth = containerRef.current?.clientWidth || 1200;
  const waveSegmentWidth = 30;
  const numWaves = Math.max(4, Math.floor(containerWidth / waveSegmentWidth));
  const kolamSvgWidth = numWaves * waveSegmentWidth;

  // Memoized to avoid recalculating strings/arrays on every parent re-render
  const wavePath = useMemo(() => {
    let d = 'M 0 12 Q 15 3, 30 12';
    for (let i = 1; i < numWaves; i++) {
      d += ` T ${(i + 1) * waveSegmentWidth} 12`;
    }
    return d;
  }, [numWaves]);

  const dots = useMemo(() =>
    Array.from({ length: numWaves }, (_, i) => ({
      key: i,
      cx: i * waveSegmentWidth + 15,
      cy: i % 2 === 0 ? 15.5 : 8.5,
    })),
    [numWaves]
  );

  return (
    <div ref={containerRef} className="wave-container top-wave-container">
      <svg
        className={svgClassName}
        viewBox={`0 0 ${kolamSvgWidth} 24`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g>
          <path
            d={wavePath}
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {dots.map(({ key, cx, cy }) => (
            <circle key={key} cx={cx} cy={cy} r="2.2" fill="#F2B84B" />
          ))}
        </g>
      </svg>
    </div>
  );
}
