import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Questions.css';

// Register once at module load — guarantees it's available before any component
// lifecycle runs, eliminating the race condition between useEffect and useLayoutEffect.
gsap.registerPlugin(ScrollTrigger);

export default function Questions({ onNavigateRoute }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const qnaRightRef = useRef(null);
  const underlineRef = useRef(null);

  const [qnaData, setQnaData] = useState([]);
  const [qnaError, setQnaError] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  // Array(8) value is never used — only the index matters for the key
  const marqueeItems = Array(8).fill(null);

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

// Fetch Q&A data from public/qna.json with retry
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function fetchWithRetry(url, retries = 3, delay = 600) {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return await res.json();
        } catch (err) {
          if (err.name === 'AbortError') throw err;
          if (attempt < retries - 1) {
            await new Promise((r) => setTimeout(r, delay * 2 ** attempt));
          } else {
            throw err;
          }
        }
      }
    }

    async function loadQna() {
      try {
        const data = await fetchWithRetry('/qna.json');
        if (isMounted && Array.isArray(data)) setQnaData(data);
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          console.error('Failed to load Q&A data after retries:', err);
          setQnaError(true);
        }
      }
    }

    loadQna();
    return () => { isMounted = false; controller.abort(); };
  }, []);

  // Continuous ultra-smooth GSAP marquee tween using percentage transform for seamless looping
  useEffect(() => {
    if (!trackRef.current) return;

    gsap.set(trackRef.current, { xPercent: 0 });

    const marqueeTween = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: 'none',
      duration: 50,
      repeat: -1
    });

    return () => {
      marqueeTween.kill();
    };
  }, []);

  // GSAP ScrollTrigger: Desktop pin using matchMedia for reactive breakpoint handling.
  // Using useLayoutEffect ensures GSAP context revert runs synchronously BEFORE React unmounts DOM nodes,
  // preventing 'NotFoundError: Failed to execute removeChild on Node' when switching client routes.
  useLayoutEffect(() => {
    if (!sectionRef.current || !qnaRightRef.current) return;

    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 825px)', () => {
        const rightCol = qnaRightRef.current;
        if (!rightCol) return;
        const rightWrapper = rightCol.parentElement;

        const getScrollDistance = () => {
          const totalHeight = rightCol.scrollHeight;
          const visibleHeight = rightWrapper ? rightWrapper.clientHeight : (window.innerHeight - 140);
          return Math.max(0, totalHeight - visibleHeight);
        };

        const scrollDist = getScrollDistance();

        if (scrollDist > 0) {
          gsap.to(rightCol, {
            y: -scrollDist,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${scrollDist}`,
              pin: true,
              pinType: 'transform',
              scrub: 1,
              anticipatePin: 0,
              invalidateOnRefresh: true
            }
          });
        }

        // Returning cleanup from matchMedia callback automatically reverts on breakpoint exit
      });
    }, sectionRef);

    return () => {
      if (ctx) ctx.revert();
    };
  }, [qnaData]);

  // GSAP Mouse Enter Underline Animation
  const handleLinkMouseEnter = () => {
    if (!underlineRef.current) return;
    gsap.killTweensOf(underlineRef.current);

    const tl = gsap.timeline();
    tl.to(underlineRef.current, {
      xPercent: 100,
      duration: 0.4,
      ease: 'power2.in'
    })
    .set(underlineRef.current, {
      xPercent: -100
    })
    .to(underlineRef.current, {
      xPercent: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  // GSAP Mouse Leave Underline Animation
  const handleLinkMouseLeave = () => {
    if (!underlineRef.current) return;
    gsap.killTweensOf(underlineRef.current);

    const tl = gsap.timeline();
    tl.to(underlineRef.current, {
      xPercent: -100,
      duration: 0.4,
      ease: 'power2.in'
    })
    .set(underlineRef.current, {
      xPercent: 100
    })
    .to(underlineRef.current, {
      xPercent: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <section ref={sectionRef} className="fourth-page-section" id="faq-section">
      {/* Infinite Moving Marquee Header powered by GSAP */}
      <div className="fourth-page-marquee-wrapper" aria-hidden="true">
        <div ref={trackRef} className="fourth-page-marquee-track">
          {/* Track Group 1 */}
          <div className="marquee-group">
            {marqueeItems.map((_, index) => (
              <span key={`g1-${index}`} className="marquee-item">
                <span className="marquee-text">Questions ?</span>
                <span className="marquee-star">✳</span>
              </span>
            ))}
          </div>

          {/* Track Group 2 for Seamless Infinite Loop */}
          <div className="marquee-group" aria-hidden="true">
            {marqueeItems.map((_, index) => (
              <span key={`g2-${index}`} className="marquee-item">
                <span className="marquee-text">Questions ?</span>
                <span className="marquee-star">✳</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Direct Q&A Content Container */}
      <div className="fourth-page-content">
        <div className="qna-split-container">
          {/* Left Column: Intro Paragraph */}
          <div className="qna-left-col">
            <p className="qna-intro-text">
              Got questions? We've answered the most common ones below. Still curious? Feel free to reach out to us directly -{' '}
              <a
                href="/contact"
                className="qna-help-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateRoute) onNavigateRoute('/contact');
                }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
              >
                we're here to help.
                <span ref={underlineRef} className="qna-help-underline" />
              </a>
            </p>
          </div>

          {/* Right Column: Q&A List inside overflow wrapper */}
          <div className="qna-right-wrapper">
            <div ref={qnaRightRef} className="qna-right-col">
              {qnaError && (
                <p style={{ color: 'rgba(255,255,255,0.5)', padding: '1rem 0', fontFamily: "'Manrope', sans-serif" }}>
                  Couldn't load questions. Please refresh the page.
                </p>
              )}
              {qnaData.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`qna-item ${isOpen ? 'is-open' : ''}`}
                  >
                    {/* Semantic button for keyboard accessibility and proper ARIA */}
                    <button
                      type="button"
                      className="qna-question-header"
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={isOpen}
                      aria-controls={`qna-answer-${index}`}
                    >
                      <h3 className="qna-question">{item.q}</h3>
                      <span className="qna-accordion-icon" aria-hidden="true">
                        <svg
                          className={`qna-chevron ${isOpen ? 'is-open' : ''}`}
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    </button>
                    <div
                      id={`qna-answer-${index}`}
                      className="qna-answer-wrapper"
                    >
                      <div className="qna-answer-content">
                        <p className="qna-answer">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
