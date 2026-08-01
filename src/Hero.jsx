import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Hero.css';

const WORDS = [
  'stories.',
  'wonder.',
  'tradition.',
  'imagination.',
  'childhood.',
  'devotion.',
  'bedtime.',
];

export default function Hero({ onOpenQrSidebar }) {
  const [index, setIndex] = useState(0);
  const wordRef = useRef(null);

  useEffect(() => {
    if (!wordRef.current) return;

    const letters = wordRef.current.querySelectorAll('.letter');
    if (!letters.length) return;

    // Reset initial state: word opacity to 0, letters hidden and blurred
    gsap.set(wordRef.current, { opacity: 0, filter: 'blur(6px)' });
    gsap.set(letters, { visibility: 'hidden', filter: 'blur(10px)' });

    const tl = gsap.timeline({
      onComplete: () => {
        setIndex((prev) => (prev + 1) % WORDS.length);
      },
    });

    // 1. Whole word opacity fades in while letters reveal & unblur typewriter-style
    tl.to(
      wordRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.6,
        ease: 'power2.out',
      },
      0
    )
      .to(
        letters,
        {
          visibility: 'visible',
          filter: 'blur(0px)',
          duration: 0.1,
          stagger: 0.07,
          ease: 'power2.out',
        },
        0
      )
      // 2. Pause while word is fully visible
      .to({}, { duration: 1.5 })
      // 3. Whole word opacity fades out while letters blur & disappear in reverse
      .to(
        wordRef.current,
        {
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.5,
          ease: 'power2.in',
        },
        'erase'
      )
      .to(
        letters,
        {
          filter: 'blur(10px)',
          visibility: 'hidden',
          duration: 0.2,
          stagger: {
            each: 0.05,
            from: 'end',
          },
          ease: 'power2.in',
        },
        'erase'
      );


    return () => {
      tl.kill();
    };
  }, [index]);

  const handleQrMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--x', `${x}px`);
    e.currentTarget.style.setProperty('--y', `${y}px`);
  };

  const currentWord = WORDS[index];

  return (
    <section className="hero-section">
      <div className="hero-left-content">
        <h1 className="hero-heading">
          Bringing temples to life <br />
          through{' '}
          <span className="word-wrapper">
            <span ref={wordRef} className="rotating-word">
              {currentWord.split('').map((char, i) => (
                <span key={`${index}-${i}`} className="letter">
                  {char}
                </span>
              ))}
            </span>
          </span>
        </h1>
        <p className="hero-subtext">
          <span className="subtext-line">Bedtime stories inspired by India's timeless temples,</span>{' '}
          <span className="subtext-line">lovingly narrated by <span className="text-highlight">The Temple Girl</span> for curious young minds.</span>
        </p>
        <div className="hero-store-buttons">
          <a
            href="https://apps.apple.com/us/app/temple-girl-kids/id6772048283"
            target="_blank"
            rel="noopener noreferrer"
            className="store-btn-link"
          >
            <img src="/appStore.svg.svg" alt="Download on the App Store" className="store-btn-img" />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.templegirlkids.templegirl"
            target="_blank"
            rel="noopener noreferrer"
            className="store-btn-link"
          >
            <img src="/googlePlay.svg.svg" alt="Get it on Play Store" className="store-btn-img" />
          </a>
          <button
            type="button"
            className="qr-code-btn"
            aria-label="QR Code"
            onMouseEnter={handleQrMouseMove}
            onMouseLeave={handleQrMouseMove}
            onClick={onOpenQrSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="qr-icon">
              <path fill="currentColor" d="M24 10.667H13.34V0H24v10.667Zm-2.665-8h-5.33V8h5.33V2.667ZM24 24H13.34V13.333H24V24Zm-2.665-8h-5.33v5.333h5.33V16ZM10.675 0v10.667H.012V0h10.661ZM2.678 8h5.33V2.667h-5.33V8Zm7.982 5.333H7.996V16h2.665v-2.667ZM7.996 16H5.33v2.667h2.666V16Zm2.665 2.667H7.996v2.666h2.665v-2.666Zm-5.33 0H2.664v2.666H5.33v-2.666Zm-2.666 2.666H0V24h2.665v-2.667Zm5.33 0H5.33V24h2.666v-2.667Zm-2.665-8H2.665V16H5.33v-2.667ZM2.665 16H0v2.667h2.665V16Z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="hero-right-content">
        <img src="/image.png" alt="Temple Girl Art" className="hero-image" />
      </div>
    </section>
  );
}




