import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import MusicPlayer from './MusicPlayer';
import './SecondPage.css';

export default function SecondPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const linesRef = useRef([]);
  const phaseRef = useRef(0);
  const amplitudeRef = useRef(0);

  const wavePath = "M 0 12 Q 15 3, 30 12 T 60 12 T 90 12 T 120 12 T 150 12 T 180 12 T 210 12 T 240 12 T 270 12 T 300 12 T 330 12 T 360 12 T 390 12 T 420 12 T 450 12 T 480 12 T 510 12 T 540 12 T 570 12 T 600 12 T 630 12 T 660 12 T 690 12 T 720 12 T 750 12 T 780 12 T 810 12 T 840 12 T 870 12 T 900 12 T 930 12 T 960 12 T 990 12 T 1020 12 T 1050 12 T 1080 12 T 1110 12 T 1140 12 T 1170 12 T 1200 12";

  // Generate gold dots nestled inside each upper curve and lower curve
  const renderDots = () => {
    const dots = [];
    let isUpper = true;
    for (let x = 15; x <= 1185; x += 30) {
      const cy = isUpper ? 15.5 : 8.5;
      dots.push(
        <circle
          key={x}
          cx={x}
          cy={cy}
          r="2.2"
          fill="#F2B84B"
        />
      );
      isUpper = !isUpper;
    }
    return dots;
  };

  const totalLines = 26;

  // GSAP Ticker wave animation: tight opacity modulation on wave motion
  useEffect(() => {
    let phase = phaseRef.current;
    let amplitude = amplitudeRef.current;
    const spatialFreq = (2 * Math.PI) / totalLines;
    const waveSpeed = 0.035;

    const onTick = () => {
      // Smoothly interpolate amplitude: 0 when paused, 1 when playing
      const targetAmp = isPlaying ? 1 : 0;
      amplitude += (targetAmp - amplitude) * 0.06;
      amplitudeRef.current = amplitude;

      if (isPlaying || amplitude > 0.001) {
        phase += waveSpeed;
        phaseRef.current = phase;

        linesRef.current.forEach((line, index) => {
          if (line) {
            const wave = Math.sin(phase - index * spatialFreq);
            const dip = amplitude * 0.1875 * (1 - wave);
            const heightFactor = 1.0 - dip;
            const targetY1 = 300 * (1 - heightFactor);
            line.setAttribute('y1', targetY1.toFixed(2));

            // Shorter opacity fade duration: stays visible longer, min opacity 0.25
            const opacityVal = Math.max(0.25, Math.min(1, (heightFactor - 0.7) / 0.3));
            line.setAttribute('opacity', opacityVal.toFixed(2));
          }
        });
      } else {
        // Complete rest state (all lines at default height y1 = 0 and opacity = 1)
        linesRef.current.forEach((line) => {
          if (line) {
            line.setAttribute('y1', '0');
            line.setAttribute('opacity', '1');
          }
        });
      }
    };

    gsap.ticker.add(onTick);

    return () => {
      gsap.ticker.remove(onTick);
    };
  }, [isPlaying]);

  return (
    <section className="second-page-section" id="second-page">
      {/* Top Kolam Wave Border Only */}
      <div className="wave-container top-wave-container">
        <svg
          className="second-page-wave"
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d={wavePath}
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {renderDots()}
          </g>
        </svg>
      </div>

      <div className="second-page-content">
        <div className="second-page-centered-layout">
          {/* Centered Music Player */}
          <div className="music-player-wrapper">
            <MusicPlayer onPlayStateChange={setIsPlaying} />
          </div>

          {/* Full-width Vertical Lines SVG Wave Container */}
          <div className="full-width-lines-wrapper">
            <div className="vertical-lines-container">
              <svg
                className="vertical-lines-svg"
                viewBox="0 0 1200 300"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {Array.from({ length: totalLines }).map((_, index) => {
                  const x = 20 + index * ((1200 - 40) / (totalLines - 1));
                  return (
                    <line
                      key={index}
                      ref={(el) => (linesRef.current[index] = el)}
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="300"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="1"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
