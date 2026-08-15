import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import './Why.css';

export default function Why() {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);

  const prevPrimaryRef = useRef(null);
  const prevSecondaryRef = useRef(null);
  const nextPrimaryRef = useRef(null);
  const nextSecondaryRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const cardsData = [
    {
      id: 'zero-screen',
      image: '/CardZeroScreen.png',
      title: 'Beyond the screen',
      desc: 'Audio-only stories that give children something better than screen time — a world to imagine, wonder about, and dream in.'
    },
    {
      id: 'warm-voice',
      image: '/CardWarmVoice.png',
      title: 'A voice they know',
      desc: 'Every story is narrated by Namratha — warm, familiar, and comforting, turning bedtime into a ritual children look forward to.'
    },
    {
      id: 'temples',
      image: '/CardTemples.png',
      title: 'Stories rooted in Bharat',
      desc: "From Tirupati to Guruvayur, every story begins in a real temple, carrying its legends, traditions, and timeless wonder."
    },
    {
      id: 'safe',
      image: '/CardSafe.png',
      title: 'Safe by design',
      desc: 'No ads. No distractions. No inappropriate content. Just thoughtful stories created for curious little minds.'
    }
  ];

  // Dynamic responsive listener for Kolam border and breakpoint calculations
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth || 1200);
      }
      setViewportWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 834);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Responsive Kolam border calculation
  const waveSegmentWidth = 30;
  const numWaves = Math.max(4, Math.floor(containerWidth / waveSegmentWidth));
  const kolamSvgWidth = numWaves * waveSegmentWidth;

  const generateWavePath = () => {
    let d = "M 0 12 Q 15 3, 30 12";
    for (let i = 1; i < numWaves; i++) {
      d += ` T ${(i + 1) * waveSegmentWidth} 12`;
    }
    return d;
  };

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

  // Nav Handlers with GSAP transition engine
  const handlePrev = () => {
    if (activeIndex <= 0) return;
    if (snapTweenRef.current) snapTweenRef.current.kill();

    const targetIndex = activeIndex - 1;
    const initialOffset = dragOffset - cardGap;

    setActiveIndex(targetIndex);
    setDragOffset(initialOffset);

    const tweenObj = { value: initialOffset };
    snapTweenRef.current = gsap.to(tweenObj, {
      value: 0,
      duration: 1.3,
      ease: 'power3.out',
      onUpdate: () => setDragOffset(tweenObj.value)
    });
  };

  const handleNext = () => {
    if (activeIndex >= cardsData.length - 1) return;
    if (snapTweenRef.current) snapTweenRef.current.kill();

    const targetIndex = activeIndex + 1;
    const initialOffset = dragOffset + cardGap;

    setActiveIndex(targetIndex);
    setDragOffset(initialOffset);

    const tweenObj = { value: initialOffset };
    snapTweenRef.current = gsap.to(tweenObj, {
      value: 0,
      duration: 1.3,
      ease: 'power3.out',
      onUpdate: () => setDragOffset(tweenObj.value)
    });
  };

  const hasMovedRef = useRef(false);

  const handleCardClick = (index) => {
    if (hasMovedRef.current) return;
    if (index === activeIndex) return;
    if (snapTweenRef.current) snapTweenRef.current.kill();

    const targetIndex = index;
    const initialOffset = dragOffset + (targetIndex - activeIndex) * cardGap;

    setActiveIndex(targetIndex);
    setDragOffset(initialOffset);

    const tweenObj = { value: initialOffset };
    snapTweenRef.current = gsap.to(tweenObj, {
      value: 0,
      duration: 1.3,
      ease: 'power3.out',
      onUpdate: () => setDragOffset(tweenObj.value)
    });
  };

  const prevTlRef = useRef(null);
  const nextTlRef = useRef(null);

  // GSAP Arrow Hover Animations
  const handlePrevMouseEnter = () => {
    if (activeIndex === 0) return;
    if (prevTlRef.current) prevTlRef.current.kill();
    prevTlRef.current = gsap.timeline()
      .to(prevPrimaryRef.current, { xPercent: -180, duration: 0.3, ease: 'power2.in' })
      .fromTo(prevSecondaryRef.current, { xPercent: 180 }, { xPercent: 0, duration: 0.3, ease: 'power2.out' });
  };

  const handlePrevMouseLeave = () => {
    if (prevTlRef.current) prevTlRef.current.kill();
    prevTlRef.current = gsap.timeline()
      .to(prevSecondaryRef.current, { xPercent: 180, duration: 0.3, ease: 'power2.in' })
      .to(prevPrimaryRef.current, { xPercent: 0, duration: 0.3, ease: 'power2.out' });
  };

  const handleNextMouseEnter = () => {
    if (activeIndex === cardsData.length - 1) return;
    if (nextTlRef.current) nextTlRef.current.kill();
    nextTlRef.current = gsap.timeline()
      .to(nextPrimaryRef.current, { xPercent: 180, duration: 0.3, ease: 'power2.in' })
      .fromTo(nextSecondaryRef.current, { xPercent: -180 }, { xPercent: 0, duration: 0.3, ease: 'power2.out' });
  };

  const handleNextMouseLeave = () => {
    if (nextTlRef.current) nextTlRef.current.kill();
    nextTlRef.current = gsap.timeline()
      .to(nextSecondaryRef.current, { xPercent: -180, duration: 0.3, ease: 'power2.in' })
      .to(nextPrimaryRef.current, { xPercent: 0, duration: 0.3, ease: 'power2.out' });
  };

  const snapTweenRef = useRef(null);

  // Drag / Touch Interactions (Real-Time 1:1 Scrub with GSAP Smooth Snap on Release)
  const handleDragStart = (e) => {
    if (snapTweenRef.current) snapTweenRef.current.kill();
    hasMovedRef.current = false;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    
    if (Math.abs(diff) > 5) {
      hasMovedRef.current = true;
    }

    // Dampen drag at boundary bounds
    let adjustedDiff = diff;
    if ((activeIndex === 0 && diff > 0) || (activeIndex === cardsData.length - 1 && diff < 0)) {
      adjustedDiff = diff * 0.25;
    }
    setDragOffset(adjustedDiff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = isMobile ? 40 : 80;
    let targetIndex = activeIndex;

    if (dragOffset < -threshold && activeIndex < cardsData.length - 1) {
      targetIndex = activeIndex + 1;
    } else if (dragOffset > threshold && activeIndex > 0) {
      targetIndex = activeIndex - 1;
    }

    const initialOffset = dragOffset + (targetIndex - activeIndex) * cardGap;

    setActiveIndex(targetIndex);
    setDragOffset(initialOffset);

    const tweenObj = { value: initialOffset };
    snapTweenRef.current = gsap.to(tweenObj, {
      value: 0,
      duration: 0.55,
      ease: 'power3.out',
      onUpdate: () => setDragOffset(tweenObj.value)
    });
  };

  // Calculate card gap (48% of screen width on desktop, matching Eight Club spacing)
  const cardGap = isMobile ? Math.max(260, Math.round(viewportWidth * 0.72)) : Math.max(520, Math.round(viewportWidth * 0.48));

  return (
    <section className="why-page-section" id="why">
      {/* Top Kolam Wave Border */}
      <div ref={containerRef} className="wave-container top-wave-container">
        <svg
          className="why-page-wave"
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

      {/* Eight Club Style 3D Card Carousel */}
      <div className="slider">
        <div className="slider__carrousel">
          <div className="carousel">
            
            {/* Viewport Boundary for Mouse Drag & Touch */}
            <div
              ref={viewportRef}
              className={`carousel__viewport ${isDragging ? 'carousel__viewport--dragging' : ''}`}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div className="carousel__track">
                {cardsData.map((card, index) => {
                  const offset = index - activeIndex;
                  const translateX = offset * cardGap + dragOffset;
                  
                  // Continuous 180° rotateY scrub mapped directly to drag position in uniform direction
                  const normOffset = cardGap > 0 ? translateX / cardGap : offset;
                  const clampedNorm = Math.max(-1, Math.min(1, normOffset));
                  const cardRotateY = 180 - clampedNorm * 180;
                  
                  const rotateZ = normOffset * (isMobile ? 3 : 5);
                  const scale = 1 - Math.min(1.2, Math.abs(normOffset)) * 0.12;
                  const translateZ = -Math.min(1.2, Math.abs(normOffset)) * 60;
                  const zIndex = 100 - Math.round(Math.abs(normOffset) * 10);

                  return (
                    <div
                      key={card.id}
                      className="card carousel__card"
                      style={{
                        transform: `translate3d(${translateX}px, 0px, ${translateZ}px) rotateZ(${rotateZ}deg) scale(${scale})`,
                        zIndex: zIndex,
                      }}
                      onClick={() => handleCardClick(index)}
                    >
                      <div
                        className="card__inner"
                        style={{
                          transform: `rotateY(${cardRotateY}deg)`
                        }}
                      >
                        {/* Front Face (Card Image Artwork with #F2B84B Matted Frame) */}
                        <div className="card__face card__face--front">
                          <div className="card-frame-inner">
                            <img
                              src={card.image}
                              alt={card.title}
                              className="card-image"
                              draggable={false}
                              onDragStart={(e) => e.preventDefault()}
                            />
                            <div className="card-overlay">
                              <h3 className="card-title">{card.title}</h3>
                            </div>
                          </div>
                        </div>

                        {/* Back Face (Pattern) */}
                        <div className="card__face card__face--back" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Arrow Buttons */}
            <button
              type="button"
              className={`button-arrow slider__nav slider__nav--prev ${activeIndex === 0 ? 'is-disabled' : ''}`}
              onClick={handlePrev}
              onMouseEnter={handlePrevMouseEnter}
              onMouseLeave={handlePrevMouseLeave}
              disabled={activeIndex === 0}
              aria-label="Previous Slide"
            >
              <span className="button-arrow-icon-wrapper">
                <svg ref={prevPrimaryRef} className="arrow-icon icon-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <svg ref={prevSecondaryRef} className="arrow-icon icon-secondary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </span>
            </button>

            <button
              type="button"
              className={`button-arrow slider__nav slider__nav--next ${activeIndex === cardsData.length - 1 ? 'is-disabled' : ''}`}
              onClick={handleNext}
              onMouseEnter={handleNextMouseEnter}
              onMouseLeave={handleNextMouseLeave}
              disabled={activeIndex === cardsData.length - 1}
              aria-label="Next Slide"
            >
              <span className="button-arrow-icon-wrapper">
                <svg ref={nextPrimaryRef} className="arrow-icon icon-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                <svg ref={nextSecondaryRef} className="arrow-icon icon-secondary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </span>
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}
