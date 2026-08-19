import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import KolamBorder from './KolamBorder';
import './Why.css';

// Moved outside component: stable reference, no re-creation on every render
const CARDS_DATA = [
  {
    id: 'zero-screen',
    image: '/CardZeroScreen.webp',
    title: 'Beyond the screen',
    desc: 'Audio-only stories that give children something better than screen time — a world to imagine, wonder about, and dream in.',
    callout: {
      desktop: {
        text: 'Audio-only stories that give children something better than screen time — a world to imagine, wonder about, and dream in.',
        anchor: { x: 45, y: 170 },
        elbow: { x: -20, y: 170 },
        end: { x: -50, y: 150 },
        boxStyle: { left: '-330px', top: '70px', width: '300px' }
      },
      mobile: {
        text: 'Audio-only stories that give children something better than screen time — a world to imagine, wonder about, and dream in.'
      }
    }
  },
  {
    id: 'warm-voice',
    image: '/CardWarmVoice.webp',
    title: 'A voice they know',
    desc: 'Every story is narrated by Namratha — warm, familiar, and comforting, turning bedtime into a ritual children look forward to.',
    callout: {
      desktop: {
        text: 'Every story is narrated by Namratha — warm, familiar, and comforting, turning bedtime into a ritual children look forward to.',
        anchor: { x: 305, y: 200 },
        elbow: { x: 360, y: 200 },
        end: { x: 390, y: 180 },
        boxStyle: { left: '390px', top: '100px', width: '300px' }
      },
      mobile: {
        text: 'Every story is narrated by Namratha — warm, familiar, and comforting, turning bedtime into a ritual children look forward to.'
      }
    }
  },
  {
    id: 'temples',
    image: '/CardTemples.webp',
    title: 'Stories rooted in Bharat',
    desc: "From Tirupati to Guruvayur, every story begins in a real temple, carrying its legends, traditions, and timeless wonder.",
    callout: {
      desktop: {
        text: 'From Tirupati to Guruvayur, every story begins in a real temple, carrying its legends, traditions, and timeless wonder.',
        anchor: { x: 45, y: 190 },
        elbow: { x: -20, y: 190 },
        end: { x: -50, y: 170 },
        boxStyle: { left: '-330px', top: '90px', width: '300px' }
      },
      mobile: {
        text: 'From Tirupati to Guruvayur, every story begins in a real temple, carrying its legends, traditions, and timeless wonder.'
      }
    }
  },
  {
    id: 'safe',
    image: '/CardSafe.webp',
    title: 'Safe by design',
    desc: 'No ads. No distractions. No inappropriate content. Just thoughtful stories created for curious little minds.',
    callout: {
      desktop: {
        text: 'No ads. No distractions. No inappropriate content. Just thoughtful stories created for curious little minds.',
        anchor: { x: 305, y: 180 },
        elbow: { x: 370, y: 180 },
        end: { x: 400, y: 160 },
        boxStyle: { left: '390px', top: '80px', width: '300px' }
      },
      mobile: {
        text: 'No ads. No distractions. No inappropriate content. Just thoughtful stories created for curious little minds.'
      }
    }
  }
];

export default function Why() {
  const viewportRef = useRef(null);

  const prevPrimaryRef = useRef(null);
  const prevSecondaryRef = useRef(null);
  const nextPrimaryRef = useRef(null);
  const nextSecondaryRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);

  // Responsive listener
  useEffect(() => {
    const updateDimensions = () => {
      setViewportWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 834);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate card gap
  const cardGap = isMobile
    ? Math.max(260, Math.round(viewportWidth * 0.72))
    : Math.max(520, Math.round(viewportWidth * 0.48));

  // Keep cardGap in a ref for GSAP tween callbacks that close over it
  const cardGapRef = useRef(cardGap);
  useEffect(() => { cardGapRef.current = cardGap; }, [cardGap]);

  const snapTweenRef = useRef(null);
  const prevTlRef = useRef(null);
  const nextTlRef = useRef(null);

  // Clean up any running GSAP tweens on unmount
  useEffect(() => {
    return () => {
      if (snapTweenRef.current) snapTweenRef.current.kill();
      if (prevTlRef.current) prevTlRef.current.kill();
      if (nextTlRef.current) nextTlRef.current.kill();
    };
  }, []);

  // Nav Handlers with GSAP transition engine
  const handlePrev = () => {
    if (activeIndex <= 0) return;
    if (snapTweenRef.current) snapTweenRef.current.kill();

    const targetIndex = activeIndex - 1;
    const initialOffset = dragOffset - cardGapRef.current;

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
    if (activeIndex >= CARDS_DATA.length - 1) return;
    if (snapTweenRef.current) snapTweenRef.current.kill();

    const targetIndex = activeIndex + 1;
    const initialOffset = dragOffset + cardGapRef.current;

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

    if (index === activeIndex) {
      setShowCallouts(prev => !prev);
      return;
    }

    if (snapTweenRef.current) snapTweenRef.current.kill();

    const initialOffset = dragOffset + (index - activeIndex) * cardGapRef.current;

    setActiveIndex(index);
    setDragOffset(initialOffset);

    const tweenObj = { value: initialOffset };
    snapTweenRef.current = gsap.to(tweenObj, {
      value: 0,
      duration: 1.3,
      ease: 'power3.out',
      onUpdate: () => setDragOffset(tweenObj.value)
    });
  };

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
    if (activeIndex === CARDS_DATA.length - 1) return;
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

  // Drag / Touch Interactions
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

    let adjustedDiff = diff;
    if ((activeIndex === 0 && diff > 0) || (activeIndex === CARDS_DATA.length - 1 && diff < 0)) {
      adjustedDiff = diff * 0.25;
    }
    setDragOffset(adjustedDiff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = isMobile ? 40 : 80;
    let targetIndex = activeIndex;

    if (dragOffset < -threshold && activeIndex < CARDS_DATA.length - 1) {
      targetIndex = activeIndex + 1;
    } else if (dragOffset > threshold && activeIndex > 0) {
      targetIndex = activeIndex - 1;
    }

    const initialOffset = dragOffset + (targetIndex - activeIndex) * cardGapRef.current;

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

  const calloutBoxRef = useRef(null);
  const [calloutBoxHeight, setCalloutBoxHeight] = useState(130);

  useEffect(() => {
    if (!calloutBoxRef.current) return;
    const el = calloutBoxRef.current;
    if (el.offsetHeight) {
      setCalloutBoxHeight(Math.round(el.offsetHeight));
    }

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const h = entry.borderBoxSize && entry.borderBoxSize[0]
          ? entry.borderBoxSize[0].blockSize
          : el.offsetHeight;
        if (h) setCalloutBoxHeight(Math.round(h));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeIndex, showCallouts, isMobile, viewportWidth]);

  return (
    <section className="why-page-section" id="why">
      {/* Top Kolam Wave Border — shared component */}
      <KolamBorder svgClassName="why-page-wave" />

      {/* Section Heading */}
      <div className="why-header-block">
        <h2 className="why-main-title">
          <span className="why-cursive">Why</span>{" "}
          <span className="why-highlight">Temple Girl Kids</span>
        </h2>
      </div>

      {/* Eight Club Style 3D Card Carousel */}
      <div className="slider">
        <div className="slider__carrousel">
          <div className={`carousel ${isMobile && showCallouts ? 'has-open-callout' : ''}`}>

            {/* Viewport Boundary — accessible region with keyboard navigation */}
            <div
              ref={viewportRef}
              className={`carousel__viewport ${isDragging ? 'carousel__viewport--dragging' : ''}`}
              role="region"
              aria-label="Why Temple Girl Kids — feature cards"
              aria-roledescription="carousel"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') handlePrev();
                if (e.key === 'ArrowRight') handleNext();
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div className="carousel__track">
                {CARDS_DATA.map((card, index) => {
                  const offset = index - activeIndex;
                  const translateX = offset * cardGap + dragOffset;

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
                      role="group"
                      aria-label={`${card.title}, slide ${index + 1} of ${CARDS_DATA.length}`}
                      aria-current={index === activeIndex ? 'true' : undefined}
                    >
                      <div
                        className="card__inner"
                        style={{
                          transform: `rotateY(${cardRotateY}deg)`
                        }}
                      >
                        {/* Front Face */}
                        <div className="card__face card__face--front">
                          <div className="card-frame-inner">
                            <img
                              src={card.image}
                              alt={card.title}
                              className="card-image"
                              draggable={false}
                              loading="lazy"
                              width={322}
                              height={549}
                              onDragStart={(e) => e.preventDefault()}
                            />
                            <div className="card-overlay">
                              <h3 className="card-title">{card.title}</h3>
                            </div>

                            {/* Integrated Top-Right Action Button (Click Arrow / Close Cross) attached to the card (Desktop Only) */}
                            {index === activeIndex && !isMobile && (
                              !showCallouts ? (
                                <button
                                  type="button"
                                  className="card-corner-action-btn card-click-icon-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCallouts(true);
                                  }}
                                  aria-label="Click to reveal details"
                                  title="Click to reveal details"
                                >
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                                    <path d="M13 13l6 6" />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="card-corner-action-btn callouts-close-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCallouts(false);
                                  }}
                                  aria-label="Close callouts"
                                  title="Close callouts"
                                >
                                  &times;
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        {/* Back Face */}
                        <div className="card__face card__face--back" aria-hidden="true" />
                      </div>

                      {/* Desktop Callout Overlay (Absolute Positioned with Leader Line) */}
                      {!isMobile && index === activeIndex && showCallouts && (() => {
                        const boxTop = parseInt(card.callout.desktop.boxStyle.top, 10);
                        const boxLeft = parseInt(card.callout.desktop.boxStyle.left, 10);
                        const boxWidth = parseInt(card.callout.desktop.boxStyle.width, 10);
                        const isLeftBox = boxLeft < 0;

                        const endX = isLeftBox ? (boxLeft + boxWidth) : boxLeft;
                        const endY = boxTop + Math.round(calloutBoxHeight / 2);
                        const anchor = card.callout.desktop.anchor;

                        // Perfectly balanced Bezier curve: enters callout midpoint 100% horizontally
                        const dx = endX - anchor.x;
                        const cp1x = anchor.x + dx * 0.45;
                        const cp1y = anchor.y;
                        const cp2x = isLeftBox ? (endX + 35) : (endX - 35);
                        const cp2y = endY;

                        // Symmetrical Chevron Arrowhead perfectly aligned along horizontal axis
                        const chvSize = 6;
                        const chvHeight = 4.5;
                        const chvX = isLeftBox ? (endX + chvSize) : (endX - chvSize);
                        const chvY1 = endY - chvHeight;
                        const chvY2 = endY + chvHeight;

                        const leaderPath = `M ${anchor.x} ${anchor.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY} M ${chvX} ${chvY1} L ${endX} ${endY} L ${chvX} ${chvY2}`;

                        return (
                          <div className="card-callouts-overlay">
                            <svg className="callouts-svg-canvas">
                              <g className="leader-line-group">
                                <path
                                  className="leader-line-main"
                                  d={leaderPath}
                                />
                              </g>
                            </svg>

                            <div
                              ref={calloutBoxRef}
                              className="callout-box"
                              style={card.callout.desktop.boxStyle}
                            >
                              <p className="callout-text">{card.callout.desktop.text}</p>
                            </div>
                          </div>
                        );
                      })()}

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
              aria-label="Previous slide"
            >
              <span className="button-arrow-icon-wrapper" aria-hidden="true">
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
              className={`button-arrow slider__nav slider__nav--next ${activeIndex === CARDS_DATA.length - 1 ? 'is-disabled' : ''}`}
              onClick={handleNext}
              onMouseEnter={handleNextMouseEnter}
              onMouseLeave={handleNextMouseLeave}
              disabled={activeIndex === CARDS_DATA.length - 1}
              aria-label="Next slide"
            >
              <span className="button-arrow-icon-wrapper" aria-hidden="true">
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

        {/* Single Mobile Callout Box (Always visible on mobile — full width) */}
        {isMobile && (
          <div className="mobile-callout-container">
            <div className="callout-box mobile-callout-flow">
              <p className="callout-text">{CARDS_DATA[activeIndex].callout.mobile.text}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
