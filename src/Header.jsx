import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import './Header.css';

export default function Header() {
  const [activeNav, setActiveNav] = useState('Home');

  const navItems = [
    { id: 'nav-home', label: 'Home' },
    { id: 'nav-contacts', label: 'Contacts' },
    { id: 'nav-subscriptions', label: 'Manage Subscriptions' },
  ];

  const itemsRef = useRef([]);

  useEffect(() => {
    const anims = [];

    itemsRef.current.forEach((li) => {
      if (!li) return;
      const left = li.querySelector('.bracket.left');
      const right = li.querySelector('.bracket.right');
      if (!left || !right) return;

      gsap.set(left, { x: 15, opacity: 0 });
      gsap.set(right, { x: -15, opacity: 0 });

      const bracketAnim = gsap.to([left, right], {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out',
        paused: true,
      });

      const handleMouseEnter = () => {
        if (window.innerWidth > 624) {
          bracketAnim.timeScale(1).play();
        }
      };

      const handleMouseLeave = () => {
        bracketAnim.timeScale(3).reverse();
      };

      li.addEventListener('mouseenter', handleMouseEnter);
      li.addEventListener('mouseleave', handleMouseLeave);

      anims.push({ li, handleMouseEnter, handleMouseLeave, bracketAnim });
    });

    return () => {
      anims.forEach(({ li, handleMouseEnter, handleMouseLeave, bracketAnim }) => {
        if (li) {
          li.removeEventListener('mouseenter', handleMouseEnter);
          li.removeEventListener('mouseleave', handleMouseLeave);
        }
        if (bracketAnim) {
          bracketAnim.kill();
        }
      });
    };
  }, []);

  return (
    <header className="pill-header-container">
      <nav className="pill-header" aria-label="Main Navigation">
        <ul className="pill-nav-list">
          {navItems.map((item, index) => (
            <li
              key={item.id}
              className="pill-nav-item"
              ref={(el) => (itemsRef.current[index] = el)}
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
        </ul>
      </nav>
    </header>
  );
}
