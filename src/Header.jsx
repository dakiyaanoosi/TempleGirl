import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { handleRadialMouseMove } from './utils/radialMouseMove';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import './Header.css';

export default function Header() {
  const [activeNav, setActiveNav] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  // Shared, reference-counted body scroll lock
  useBodyScrollLock(isMenuOpen);

  // Optimized hide-on-scroll listener with requestAnimationFrame & threshold check
  useEffect(() => {
    const threshold = 15;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;
      const diff = currentScrollY - prevScrollY;

      if (currentScrollY <= 60) {
        setIsHidden(false);
        lastScrollYRef.current = currentScrollY;
      } else if (!isMenuOpen) {
        if (diff > threshold) {
          setIsHidden(true);
          lastScrollYRef.current = currentScrollY;
        } else if (diff < -threshold) {
          setIsHidden(false);
          lastScrollYRef.current = currentScrollY;
        }
      }

      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(updateScroll);
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  // Escape key closes the mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const navItems = [
    { id: 'nav-home', label: 'Home' },
    { id: 'nav-contacts', label: 'Contacts' },
    { id: 'nav-subscriptions', label: 'Manage Subscriptions' },
  ];

  const itemsRef = useRef([]);
  const mobileItemsRef = useRef([]);
  const headerRef = useRef(null);
  const menuContentRef = useRef(null);
  const closeBtnRef = useRef(null);
  const backdropRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    itemsRef.current.forEach((li) => {
      if (!li) return;
      const left = li.querySelector('.bracket.left');
      const right = li.querySelector('.bracket.right');
      if (!left || !right) return;
      gsap.set(left, { x: 15, opacity: 0 });
      gsap.set(right, { x: -15, opacity: 0 });
    });
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    mobileItemsRef.current.forEach((li) => {
      if (!li) return;
      const left = li.querySelector('.bracket.left');
      const right = li.querySelector('.bracket.right');
      if (!left || !right) return;
      gsap.set(left, { x: 15, opacity: 0 });
      gsap.set(right, { x: -15, opacity: 0 });
    });
  }, [isMenuOpen]);

  const handleItemMouseEnter = (refArray, index) => {
    const li = refArray.current[index];
    if (!li) return;
    const left = li.querySelector('.bracket.left');
    const right = li.querySelector('.bracket.right');
    if (!left || !right) return;

    gsap.to(left, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    gsap.to(right, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
  };

  const handleItemMouseLeave = (refArray, index) => {
    const li = refArray.current[index];
    if (!li) return;
    const left = li.querySelector('.bracket.left');
    const right = li.querySelector('.bracket.right');
    if (!left || !right) return;

    gsap.to(left, { x: 15, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
    gsap.to(right, { x: -15, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
  };

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
    } else {
      closeMenu();
    }
  };

  const closeMenu = () => {
    if (timelineRef.current && timelineRef.current.isActive()) return;
    if (timelineRef.current) {
      timelineRef.current.reverse();
    } else {
      setIsMenuOpen(false);
    }
  };

  useLayoutEffect(() => {
    if (!isMenuOpen) {
      if (headerRef.current) {
        gsap.set(headerRef.current, { clearProps: 'all' });
        const topBarEl = headerRef.current.querySelector('.pill-header-top');
        if (topBarEl) gsap.set(topBarEl, { clearProps: 'all' });
      }
      return;
    }

    if (headerRef.current) {
      const headerEl = headerRef.current;
      const menuContentEl = menuContentRef.current;
      const closeBtnEl = closeBtnRef.current;
      const topBarEl = headerEl.querySelector('.pill-header-top');

      if (menuContentEl) {
        gsap.set(menuContentEl, { opacity: 0 });
      }

      const collapsedHeight = topBarEl ? topBarEl.offsetHeight + 16 : 48;

      gsap.set(headerEl, { height: collapsedHeight, overflow: 'hidden' });
      gsap.set(headerEl, { height: 'auto' });
      const targetHeight = headerEl.scrollHeight;

      gsap.set(headerEl, { height: collapsedHeight });

      const tl = gsap.timeline({
        onReverseComplete: () => {
          setIsMenuOpen(false);
          timelineRef.current = null;
        },
        onComplete: () => {
          // Move focus to close button after animation
          closeBtnRef.current?.focus();
        },
      });

      if (backdropRef.current) {
        tl.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power2.out' },
          0
        );
      }

      if (topBarEl) {
        tl.to(topBarEl, {
          opacity: 0,
          duration: 0.22,
          ease: 'power2.out',
        }, 0);
      }

      tl.to(headerEl, {
        height: targetHeight,
        borderRadius: '28px',
        duration: 0.60,
        ease: 'power3.inOut',
      }, 0);

      tl.to(headerEl, {
        backgroundColor: '#D8D8E2',
        duration: 0.75,
        ease: 'power2.out',
      }, 0);

      if (menuContentEl) {
        tl.fromTo(
          menuContentEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.32, ease: 'power2.out' },
          0.32
        );

        const subscribeBtnEl = menuContentEl.querySelector('.mobile-subscribe-btn');
        if (subscribeBtnEl) {
          tl.fromTo(
            subscribeBtnEl,
            { opacity: 0 },
            { opacity: 1, duration: 0.32, ease: 'power2.out' },
            0.38
          );
        }
      }

      if (closeBtnEl) {
        tl.fromTo(
          closeBtnEl,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.40, ease: 'power3.out' },
          0.22
        );
      }

      timelineRef.current = tl;
    }
  }, [isMenuOpen]);

  return (
    <>
      {isMenuOpen && (
        <div
          ref={backdropRef}
          className="mobile-menu-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      <header className={`pill-header-container ${isHidden ? 'header-hidden' : ''}`}>
        <nav ref={headerRef} className="pill-header" aria-label="Main Navigation">
          <div className="pill-header-top">
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <svg width="32" height="14" viewBox="0 0 32 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="1" y1="2" x2="31" y2="2" />
                <line x1="1" y1="10" x2="31" y2="10" />
              </svg>
            </button>

            <div className="pill-header-brand">
              <button
                type="button"
                className="pill-header-brand-btn"
                onClick={() => {
                  setActiveNav('Home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="Go to top of page"
              >
                <img src="/templeGirlKids.svg" alt="Temple Girl Kids" className="header-brand-svg" width={77} height={32} />
              </button>
            </div>

            <ul className="pill-nav-list">
              {navItems.map((item, index) => (
                <li
                  key={item.id}
                  className="pill-nav-item desktop-only"
                  ref={(el) => (itemsRef.current[index] = el)}
                  onMouseEnter={() => handleItemMouseEnter(itemsRef, index)}
                  onMouseLeave={() => handleItemMouseLeave(itemsRef, index)}
                >
                  <button
                    id={item.id}
                    type="button"
                    className={`pill-nav-link ${activeNav === item.label ? 'active' : ''}`}
                    onClick={() => setActiveNav(item.label)}
                  >
                    <span className="bracket left" aria-hidden="true">||</span>
                    <span className="nav-item-text" data-text={item.label}>{item.label}</span>
                    <span className="bracket right" aria-hidden="true">||</span>
                  </button>
                </li>
              ))}
              <li className="pill-nav-item subscribe-item">
                <button
                  id="nav-subscribe"
                  type="button"
                  className={`subscribe-btn ${activeNav === 'SUBSCRIBE' ? 'active' : ''}`}
                  onClick={() => setActiveNav('SUBSCRIBE')}
                  onMouseMove={handleRadialMouseMove}
                  onMouseEnter={handleRadialMouseMove}
                  onMouseLeave={handleRadialMouseMove}
                >
                  <span className="subscribe-btn-text">SUBSCRIBE</span>
                </button>
              </li>
            </ul>
          </div>

          {isMenuOpen && (
            <div ref={menuContentRef} className="mobile-menu-content">
              <div className="mobile-menu-header">
                <ul className="mobile-nav-list" role="list">
                  {navItems.map((item, index) => (
                    <li
                      key={`mobile-${item.id}`}
                      className="mobile-nav-item"
                      ref={(el) => (mobileItemsRef.current[index] = el)}
                      onMouseEnter={() => handleItemMouseEnter(mobileItemsRef, index)}
                      onMouseLeave={() => handleItemMouseLeave(mobileItemsRef, index)}
                    >
                      <button
                        type="button"
                        className={`pill-nav-link ${activeNav === item.label ? 'active' : ''}`}
                        onClick={() => {
                          setActiveNav(item.label);
                          closeMenu();
                        }}
                      >
                        <span className="bracket left" aria-hidden="true">||</span>
                        <span className="nav-item-text" data-text={item.label}>{item.label}</span>
                        <span className="bracket right" aria-hidden="true">||</span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mobile-menu-brand">
                  <button
                    type="button"
                    className="mobile-menu-brand-btn"
                    onClick={() => {
                      setActiveNav('Home');
                      closeMenu();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-label="Go to top of page"
                  >
                    <img src="/templeGirlKids.svg" alt="Temple Girl Kids" className="mobile-brand-svg" width={77} height={32} />
                  </button>
                </div>
              </div>

              <div className="mobile-menu-footer">
                <button
                  type="button"
                  className="mobile-subscribe-btn"
                  onClick={() => {
                    setActiveNav('SUBSCRIBE');
                    closeMenu();
                  }}
                  onMouseMove={handleRadialMouseMove}
                  onMouseEnter={handleRadialMouseMove}
                  onMouseLeave={handleRadialMouseMove}
                >
                  <span className="subscribe-btn-text">SUBSCRIBE</span>
                </button>
              </div>
            </div>
          )}
        </nav>

        {isMenuOpen && (
          <div className="mobile-close-container">
            <button
              ref={closeBtnRef}
              type="button"
              className="mobile-menu-close-btn"
              onClick={closeMenu}
              onMouseMove={handleRadialMouseMove}
              onMouseEnter={handleRadialMouseMove}
              onMouseLeave={handleRadialMouseMove}
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M0 0h2.857v2.857H0V0Zm5.714 5.714H2.857V2.857h2.857v2.857Zm2.857 2.857H5.714V5.714h2.857v2.857Zm2.858 0H8.57v2.858H5.714v2.857H2.857v2.857H0V20h2.857v-2.857h2.857v-2.857h2.857v-2.857h2.858v2.857h2.857v2.857h2.857V20H20v-2.857h-2.857v-2.857h-2.857v-2.857h-2.857V8.57Zm2.857-2.857v2.857h-2.857V5.714h2.857Zm2.857-2.857v2.857h-2.857V2.857h2.857Zm0 0V0H20v2.857h-2.857Z" />
              </svg>
            </button>
          </div>
        )}
      </header>
    </>
  );
}
