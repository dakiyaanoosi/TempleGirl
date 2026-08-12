import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FourthPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function FourthPage() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const qnaRightRef = useRef(null);
  const underlineRef = useRef(null);

  const [qnaData, setQnaData] = useState([]);
  const marqueeItems = Array(8).fill("Questions ? *");

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

  // Continuous ultra-smooth GSAP marquee tween
  useEffect(() => {
    if (!trackRef.current) return;

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

  // GSAP ScrollTrigger: Desktop pin & right column scroll logic
  useEffect(() => {
    if (!sectionRef.current || !qnaRightRef.current) return;

    let ctx = gsap.context(() => {
      // Only pin & scrub on desktop/tablet screens (>768px)
      if (window.innerWidth > 768) {
        const rightCol = qnaRightRef.current;
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
      }
    }, sectionRef);

    return () => {
      if (ctx) ctx.revert();
    };
  }, [qnaData]);

  // GSAP Mouse Enter Underline Animation (Slides to Right -> Returns from Left)
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

  // GSAP Mouse Leave Underline Animation (Slides to Left -> Returns from Right - Reverse)
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
      <div className="fourth-page-marquee-wrapper">
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
                href="mailto:support@templegirlkids.com"
                className="qna-help-link"
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
              {qnaData.map((item, index) => (
                <div key={index} className="qna-item">
                  <h3 className="qna-question">{item.q}</h3>
                  <p className="qna-answer">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
