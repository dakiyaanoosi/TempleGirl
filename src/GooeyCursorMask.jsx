import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GooeyCursorMask() {
  const gRef = useRef(null);

  useEffect(() => {
    const gEl = gRef.current;
    if (!gEl) return;

    let columns = 28;
    let cellSize = 0;
    let rows = 0;
    let cellsTotal = 0;
    let cells = [];
    let cachedCell = null;
    const ttl = 0.18;

    function layout() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      cellSize = width / columns;
      rows = Math.ceil(height / cellSize);
      cellsTotal = rows * columns;

      gEl.innerHTML = '';
      cells = [];

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < cellsTotal; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(col * cellSize));
        rect.setAttribute('y', String(row * cellSize));
        rect.setAttribute('width', String(cellSize + 1));
        rect.setAttribute('height', String(cellSize + 1));
        rect.setAttribute('fill', 'black');
        rect.setAttribute('opacity', '0');
        fragment.appendChild(rect);
        cells.push(rect);
      }
      gEl.appendChild(fragment);
    }

    layout();

    const handleResize = () => layout();
    window.addEventListener('resize', handleResize);

    const handleMove = (ev) => {
      let clientX = ev.clientX;
      let clientY = ev.clientY;
      if (clientX === undefined && ev.touches && ev.touches[0]) {
        clientX = ev.touches[0].clientX;
        clientY = ev.touches[0].clientY;
      }
      if (clientX === undefined) return;

      const col = Math.floor(clientX / cellSize);
      const row = Math.floor(clientY / cellSize);
      if (col < 0 || col >= columns || row < 0 || row >= rows) return;

      const cellIndex = row * columns + col;
      const cell = cells[cellIndex];
      if (!cell || cachedCell === cell) return;
      cachedCell = cell;

      gsap.killTweensOf(cell);
      gsap.set(cell, { opacity: 1 });
      gsap.to(cell, {
        opacity: 0,
        duration: 0.35,
        delay: ttl,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return (
    <svg
      id="gooey-svg-mask-element"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: -9999,
      }}
    >
      <defs>
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="14" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
            result="goo"
          />
        </filter>

        <mask id="gooey-reveal-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          {/* White rect: primary background visible everywhere by default */}
          <rect width="100%" height="100%" fill="white" />

          {/* Black cell grid inside gooey filter: cuts liquid gooey holes to reveal starfield background2 */}
          <g filter="url(#gooey)" ref={gRef} />
        </mask>
      </defs>
    </svg>
  );
}
