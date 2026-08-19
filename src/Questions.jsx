import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Questions.css';

export default function Questions({ onNavigateRoute }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const qnaRightRef = useRef(null);
  const underlineRef = useRef(null);

  const [qnaData, setQnaData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  // Array(8) value is never used — only the index matters for the key
  const marqueeItems = Array(8).fill(null);

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Register plugin once inside an effect (not at module level)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Fetch Q&A data from public/qna.json
  useEffect(() => {
    fetch('/qna.json')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQnaData(data);
        }
      })
      .catch((err) => console.error("Failed to load Q&A data:", err));
  }, []);

  // Continuous ultra-smooth GSAP marquee tween — Issue 06: start at x=0 so first word is never clipped
  useEffect(() => {
    if (!trackRef.current) return;

    const groupEls = trackRef.current.querySelectorAll('.marquee-group');
    if (!groupEls.length) return;

    // Measure the width of a single group after first paint
    const singleGroupWidth = groupEls[0].offsetWidth || 0;
    if (singleGroupWidth === 0) return;

    // Always start at x=0 — first character is always clean/visible
    gsap.set(trackRef.current, { x: 0 });

    const marqueeTween = gsap.to(trackRef.current, {
      x: -singleGroupWidth,
      ease: 'none',
      duration: 50,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((value) => parseFloat(value) % singleGroupWidth)
      }
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
              scrub: true,
              anticipatePin: 1,
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
    <section ref={sectionRef} className="fourth-page-section" id="fourth-page">
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
                  if (onNavigateRoute) {
                    onNavigateRoute('/contact');
                  } else if (window.onNavigateRoute) {
                    window.onNavigateRoute('/contact');
                  } else {
                    window.location.href = '/contact';
                  }
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
