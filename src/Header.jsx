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
    itemsRef.current.forEach((li) => {
      if (!li) return;
      const left = li.querySelector('.bracket.left');
      const right = li.querySelector('.bracket.right');
      if (!left || !right) return;
      gsap.set(left, { x: 15, opacity: 0 });
      gsap.set(right, { x: -15, opacity: 0 });
    });
  }, []);

  const handleItemMouseEnter = (index) => {
    const li = itemsRef.current[index];
    if (!li) return;
    const left = li.querySelector('.bracket.left');
    const right = li.querySelector('.bracket.right');
    if (!left || !right) return;

    gsap.to(left, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    gsap.to(right, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
  };

  const handleItemMouseLeave = (index) => {
    const li = itemsRef.current[index];
    if (!li) return;
    const left = li.querySelector('.bracket.left');
    const right = li.querySelector('.bracket.right');
    if (!left || !right) return;

    gsap.to(left, { x: 15, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
    gsap.to(right, { x: -15, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
  };

  return (
    <header className="pill-header-container">
      <nav className="pill-header" aria-label="Main Navigation">
        <div className="pill-header-brand">
          <img src="/templeGirlKids.svg" alt="Temple Girl Kids" className="header-brand-svg" />
        </div>
        <ul className="pill-nav-list">
          {navItems.map((item, index) => (
            <li
              key={item.id}
              className="pill-nav-item"
              ref={(el) => (itemsRef.current[index] = el)}
              onMouseEnter={() => handleItemMouseEnter(index)}
              onMouseLeave={() => handleItemMouseLeave(index)}
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
