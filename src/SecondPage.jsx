import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import MusicPlayer from './MusicPlayer';
import './SecondPage.css';

export default function SecondPage({ onOpenQrSidebar }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const linesRef = useRef([]);
  const lotusesRef = useRef([]);
  const phaseRef = useRef(0);
  const amplitudeRef = useRef(0);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Dynamic responsive width listener for Kolam wave border and vertical lines
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

  // Dynamic vertical stem line count maintaining constant ~46px spacing
  const targetLineSpacing = 46;
  const totalLines = Math.max(4, Math.floor((containerWidth - 40) / targetLineSpacing) + 1);

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

  // GSAP Ticker wave animation: dynamic spatial frequency for responsive totalLines
  useEffect(() => {
    let phase = phaseRef.current;
    let amplitude = amplitudeRef.current;
    const waveSpeed = 0.035;

    const onTick = () => {
      const targetAmp = isPlaying ? 1 : 0;
      amplitude += (targetAmp - amplitude) * 0.06;
      amplitudeRef.current = amplitude;

      const activeLineCount = linesRef.current.filter(Boolean).length || totalLines;
      const spatialFreq = (2 * Math.PI) / activeLineCount;

      if (isPlaying || amplitude > 0.001) {
        phase += waveSpeed;
        phaseRef.current = phase;

        linesRef.current.forEach((line, index) => {
          if (line) {
            const wave = Math.sin(phase - index * spatialFreq);
            const dip = amplitude * 0.1875 * (1 - wave);
            const heightFactor = 1.0 - dip;
            const targetY1 = 180 * (1 - heightFactor);
            line.setAttribute('y1', targetY1.toFixed(2));

            const lotus = lotusesRef.current[index];
            if (lotus) {
              const lotusY = targetY1 - 28;
              lotus.setAttribute('y', lotusY.toFixed(2));
            }
          }
        });
      } else {
        // Complete rest state (all stems at y1 = 0 and lotus flowers at top y = -28)
        linesRef.current.forEach((line, index) => {
          if (line) {
            line.setAttribute('y1', '0');
          }
          const lotus = lotusesRef.current[index];
          if (lotus) {
            lotus.setAttribute('y', '-28');
          }
        });
      }
    };

    gsap.ticker.add(onTick);

    return () => {
      gsap.ticker.remove(onTick);
    };
  }, [isPlaying, totalLines]);

  return (
    <section className="second-page-section" id="second-page">
      {/* Responsive Top Kolam Wave Border */}
      <div ref={containerRef} className="wave-container top-wave-container">
        <svg
          className="second-page-wave"
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

      <div className="second-page-content">
        {/* 2-Column Split Layout matching Hero styling */}
        <div className="second-page-split-layout">
          {/* Left Column: Music Player */}
          <div className="second-page-left-col">
            <div className="music-player-wrapper">
              <MusicPlayer onPlayStateChange={setIsPlaying} onOpenQrSidebar={onOpenQrSidebar} />
            </div>
          </div>

          {/* Right Column: Title */}
          <div className="second-page-right-col">
            {/* Headline with Headphone SVG Icon before "Hear" */}
            <h2 className="second-page-title">
              <span className="title-inline-svg title-prefix-svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178 184" fill="none">
                  <path fill="currentColor" d="M177 135.742c0 21.857-17.942 39.576-40.074 39.576-22.132 0-40.073-17.719-40.073-39.576s17.941-39.575 40.073-39.575S177 113.885 177 135.742ZM89.427 1C53.121 1 23.69 31.024 23.69 68.06c0 5.435.635 12.59 1.832 17.65h2.816c-.512-3.128-.78-8.225-.78-11.522 0-29.047 20.775-52.594 46.403-52.594 25.627 0 46.403 23.547 46.403 52.594 0 2.76-.188 8.278-.55 10.924h33.865c.974-4.59 1.487-12.164 1.487-17.052C155.165 31.024 125.733 1 89.427 1ZM1 135.742c0 22.146 17.552 40.098 39.202 40.098V95.644C18.552 95.644 1 113.597 1 135.742ZM76.305 88.253l14.57 47.489L76.305 183l-13.713-47.258 13.713-47.489Z"></path>
                  <path fill="currentColor" d="m55.69 110.302 7.737 25.44-7.738 25.785-9.407-25.785 9.407-25.44Z"></path>
                </svg>
              </span>
              Hear <span className="text-highlight">Namratha</span> bring a story to life.
            </h2>
          </div>
        </div>

        {/* Bottom: Full-width Vertical Lines SVG Wave Container */}
        <div className="full-width-lines-wrapper">
          <div className="vertical-lines-container">
            <svg
              className="vertical-lines-svg"
              viewBox={`0 -38 ${containerWidth} 218`}
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Vertical Stem Lines */}
              {Array.from({ length: totalLines }).map((_, index) => {
                const x = totalLines > 1
                  ? 20 + index * ((containerWidth - 40) / (totalLines - 1))
                  : containerWidth / 2;
                return (
                  <line
                    key={`line-${index}`}
                    ref={(el) => (linesRef.current[index] = el)}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="180"
                    stroke="#8eb331ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Lotus Flowers: 32px x 32px constant un-squashed size */}
              {Array.from({ length: totalLines }).map((_, index) => {
                const x = totalLines > 1
                  ? 20 + index * ((containerWidth - 40) / (totalLines - 1))
                  : containerWidth / 2;
                return (
                  <svg
                    key={`lotus-${index}`}
                    ref={(el) => (lotusesRef.current[index] = el)}
                    x={x - 16}
                    y={-28}
                    width="32"
                    height="32"
                    viewBox="0 0 512 512"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path fill="#E07188" d="M217.651,138.607c-39.431-29.705-78.175-43.486-79.804-44.059c-11.187-3.927-23.548,1.19-28.683,11.882c-0.748,1.558-18.398,38.703-25.277,87.595c-1.79,12.728,7.076,24.495,19.805,26.286c1.1,0.155,2.191,0.23,3.269,0.23l115.276-49.345C229.97,160.932,227.917,146.341,217.651,138.607z"/>
                    <path fill="#DC4161" d="M279.237,419.078c-0.709-12.833-11.706-22.663-24.517-21.954c-0.169,0.009-3.17,0.154-8.294,0.116l-61.215-147.793c3.973-1.641,7.548-4.384,10.19-8.174c7.351-10.542,4.763-25.048-5.782-32.4c-70.354-49.053-163.52-44.524-167.459-44.306c-11.845,0.653-21.301,10.111-21.956,21.954c-0.27,4.924-5.836,121.398,64.921,192.157c60.029,60.026,152.952,65.124,182.766,65.124c5.331,0,8.645-0.163,9.394-0.205C270.116,442.888,279.946,431.91,279.237,419.078z"/>
                    <path fill="#E07188" d="M271.525,74.134c-8.835-7.914-22.21-7.914-31.047,0c-3.675,3.289-89.97,81.712-89.97,181.779c0,100.069,86.295,178.49,89.97,181.779c4.418,3.956,9.969,5.934,15.524,5.934c5.551,0,11.105-1.978,15.524-5.934c3.672-3.289,89.97-81.71,89.97-181.779C361.495,155.846,275.197,77.423,271.525,74.134z"/>
                    <path fill="#DC4161" d="M428.116,194.025c-6.879-48.892-24.533-86.037-25.281-87.593c-5.137-10.692-17.489-15.811-28.683-11.881c-1.631,0.571-40.37,14.352-79.802,44.057c-10.266,7.732-12.32,22.323-4.588,32.589l115.279,49.345c1.078,0,2.172-0.074,3.272-0.23C421.04,218.521,429.907,206.752,428.116,194.025z"/>
                    <path fill="#E07188" d="M511.796,186.518c-0.655-11.844-10.112-21.3-21.953-21.953c-3.936-0.217-97.113-4.746-167.459,44.307c-10.542,7.351-13.13,21.856-5.779,32.4c2.642,3.789,6.215,6.532,10.19,8.173l-61.205,147.769c-5.157,0.051-8.176-0.084-8.345-0.093c-12.778-0.686-23.771,9.136-24.48,21.956c-0.706,12.832,9.124,23.81,21.956,24.517c0.745,0.042,4.057,0.205,9.394,0.205c29.82,0,122.738-5.101,182.763-65.124C517.638,307.917,512.069,191.442,511.796,186.518z"/>
                    <path fill="#DC4161" d="M271.525,74.134c-4.418-3.956-9.973-5.934-15.524-5.934v375.431c5.551,0,11.105-1.978,15.524-5.934c3.672-3.289,89.97-81.711,89.97-181.779C361.495,155.846,275.197,77.423,271.525,74.134z"/>
                  </svg>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
