import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import KolamBorder from './KolamBorder';
import MusicPlayer from './MusicPlayer';
import './Music.css';

export default function Music({ onOpenQrSidebar }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const linesRef = useRef([]);
  const lotusesRef = useRef([]);
  const phaseRef = useRef(0);
  const amplitudeRef = useRef(0);
  const swayPhaseRef = useRef(0);

  // Use sectionRef for containerWidth measurement; freeing the wave div for KolamBorder
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(1200);
  const [linesWidth, setLinesWidth] = useState(600);
  const [playerHeight, setPlayerHeight] = useState(420);
  const [isMobile, setIsMobile] = useState(false);

  // Dynamic responsive listener measuring music player column height & stem width & breakpoint
  useEffect(() => {
    const updateDimensions = () => {
      if (sectionRef.current) {
        setContainerWidth(sectionRef.current.clientWidth || 1200);
      }
      if (rightColRef.current) {
        setLinesWidth(rightColRef.current.clientWidth || 600);
      }
      if (leftColRef.current) {
        const h = leftColRef.current.clientHeight;
        if (h > 100) setPlayerHeight(h);
      }
      setIsMobile(window.innerWidth <= 834);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 834px breakpoint adaptation: full container width & standard 180px stem height on mobile/tablet
  const activeLinesWidth = isMobile ? containerWidth : linesWidth;
  const activeStemHeight = isMobile ? 180 : Math.round(playerHeight * 0.5);

  // Dynamic vertical stem line count for active lines width maintaining constant ~46px spacing
  const targetLineSpacing = 46;
  const totalLines = Math.max(4, Math.floor((activeLinesWidth - 40) / targetLineSpacing) + 1);

  // --- Refs to sync reactive values for stable single GSAP ticker ---
  const isPlayingRef = useRef(isPlaying);
  const totalLinesRef = useRef(totalLines);
  const activeLinesWidthRef = useRef(activeLinesWidth);
  const activeStemHeightRef = useRef(activeStemHeight);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { totalLinesRef.current = totalLines; }, [totalLines]);
  useEffect(() => { activeLinesWidthRef.current = activeLinesWidth; }, [activeLinesWidth]);
  useEffect(() => { activeStemHeightRef.current = activeStemHeight; }, [activeStemHeight]);

  // Single stable GSAP ticker — registered once, reads from refs each frame
  useEffect(() => {
    const waveSpeed = 0.035;

    const onTick = () => {
      const isPlayingNow = isPlayingRef.current;
      const totalLinesNow = totalLinesRef.current;
      const activeLinesWidthNow = activeLinesWidthRef.current;
      const activeStemHeightNow = activeStemHeightRef.current;

      const targetAmp = isPlayingNow ? 1 : 0;
      amplitudeRef.current += (targetAmp - amplitudeRef.current) * 0.06;

      swayPhaseRef.current += 0.015;

      const activeLineCount = linesRef.current.filter(Boolean).length || totalLinesNow;
      const spatialFreq = (2 * Math.PI) / activeLineCount;

      linesRef.current.forEach((line, index) => {
        if (line) {
          const x = totalLinesNow > 1
            ? 20 + index * ((activeLinesWidthNow - 40) / (totalLinesNow - 1))
            : activeLinesWidthNow / 2;

          const wave = Math.sin(phaseRef.current - index * spatialFreq);
          const dip = amplitudeRef.current * 0.1875 * (1 - wave);
          const heightFactor = 1.0 - dip;
          const targetY1 = activeStemHeightNow * (1 - heightFactor);

          const swayAmp = 3.5 + amplitudeRef.current * 4.5;
          const offset1 = Math.sin(swayPhaseRef.current + index * 0.45) * swayAmp;
          const offset2 = Math.cos(swayPhaseRef.current + index * 0.45) * swayAmp;

          const cp1x = (x + offset1).toFixed(2);
          const cp1y = (targetY1 + (activeStemHeightNow - targetY1) * 0.33).toFixed(2);
          const cp2x = (x - offset2).toFixed(2);
          const cp2y = (targetY1 + (activeStemHeightNow - targetY1) * 0.66).toFixed(2);

          const pathD = `M ${x.toFixed(2)} ${targetY1.toFixed(2)} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x.toFixed(2)} ${activeStemHeightNow}`;
          line.setAttribute('d', pathD);

          const lotus = lotusesRef.current[index];
          if (lotus) {
            lotus.setAttribute('y', (targetY1 - 28).toFixed(2));
          }
        }
      });

      if (isPlayingNow || amplitudeRef.current > 0.001) {
        phaseRef.current += waveSpeed;
      }
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, []); // stable — runs once only

  return (
    <section ref={sectionRef} className="second-page-section" id="second-page">
      {/* Reusable KolamBorder replaces 40 lines of duplicated wave logic */}
      <KolamBorder svgClassName="second-page-wave" />

      <div className="second-page-content">
        {/* 2-Column Split Layout matching Hero styling */}
        <div className="second-page-split-layout">
          {/* Left Column: Music Player */}
          <div ref={leftColRef} className="second-page-left-col">
            <div className="music-player-wrapper">
              <MusicPlayer onPlayStateChange={setIsPlaying} onOpenQrSidebar={onOpenQrSidebar} />
            </div>
          </div>

          {/* Right Column: Title Top, Vertical Stem Lines Bottom */}
          <div ref={rightColRef} className="second-page-right-col">
            {/* Headline with Headphone SVG Icon before "Hear" */}
            <h2 className="second-page-title">
              <span className="title-inline-svg title-prefix-svg">
                <img src="/headphone.svg" alt="" aria-hidden="true" />
              </span>
              Hear <span className="text-highlight">Namratha</span> bring a story to life.
            </h2>

            {/* Vertical Lines SVG Wave Container */}
            <div className="full-width-lines-wrapper">
              <div className="vertical-lines-container" style={{ height: `${activeStemHeight}px` }}>
                <svg
                  className="vertical-lines-svg"
                  viewBox={`0 -38 ${activeLinesWidth} ${activeStemHeight + 38}`}
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Vertical Stem Lines */}
                  {Array.from({ length: totalLines }).map((_, index) => {
                    const x = totalLines > 1
                      ? 20 + index * ((activeLinesWidth - 40) / (totalLines - 1))
                      : activeLinesWidth / 2;
                    const defaultPath = `M ${x} 0 C ${x + 3.5} ${activeStemHeight * 0.33}, ${x - 3.5} ${activeStemHeight * 0.66}, ${x} ${activeStemHeight}`;
                    return (
                      <path
                        key={`line-${index}`}
                        ref={(el) => (linesRef.current[index] = el)}
                        d={defaultPath}
                        stroke="#8eb331ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />
                    );
                  })}

                  {/* Lotus Flowers: 32px x 32px constant un-squashed size */}
                  {Array.from({ length: totalLines }).map((_, index) => {
                    const x = totalLines > 1
                      ? 20 + index * ((activeLinesWidth - 40) / (totalLines - 1))
                      : activeLinesWidth / 2;
                    return (
                      <svg
                        key={`lotus-${index}`}
                        ref={(el) => (lotusesRef.current[index] = el)}
                        className={isPlaying ? 'lotus-playing' : 'lotus-idle'}
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
        </div>
      </div>
    </section>
  );
}
