import { useRef, useEffect, useState } from 'react';
import KolamBorder from './KolamBorder';
import './Reviews.css';

export default function Reviews() {
  const sliderRef = useRef(null);

  const [reviewsData, setReviewsData] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Fetch real review data from public/review.json with retry
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

    async function loadReviews() {
      try {
        const data = await fetchWithRetry('/review.json');
        if (isMounted && Array.isArray(data)) setReviewsData(data);
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          console.error('Failed to load review data after retries:', err);
          setFetchError(true);
        }
      }
    }

    loadReviews();
    return () => { isMounted = false; controller.abort(); };
  }, []);

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e) => {
    if (!sliderRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Render Stars component
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star-icon ${i < rating ? 'star-filled' : 'star-empty'}`}
          aria-hidden="true"
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="third-page-section" id="reviews-section">
      {/* Responsive Top Kolam Wave Border — shared component */}
      <KolamBorder svgClassName="third-page-wave" />

      {/* Headline Container (86vw max-width 1240px) */}
      <div className="third-page-content">
        <div className="third-page-header-block">
          <h2 className="third-page-title">
            <span className="text-white">What do families think of Temple Girl?</span>{' '}
            <span className="text-muted">
              Discover why parents are bringing the stories of India's temples into their children's bedtime.
            </span>
          </h2>
        </div>
      </div>

      {/* Full-Bleed 100vw Screen Width Reviews Carousel */}
      <div className="reviews-carousel-wrapper">
        {fetchError && (
          <p style={{
            textAlign: 'center', padding: '2rem',
            color: 'rgba(255,255,255,0.55)', fontFamily: "'Manrope', sans-serif",
          }}>
            Couldn't load reviews. Please refresh to try again.
          </p>
        )}
        <div
          ref={sliderRef}
          className={`reviews-slider-track ${isMouseDown ? 'is-grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          role="region"
          aria-label="Customer reviews"
        >
          {reviewsData.map((review, index) => (
            <article key={index} className="review-card">
              {/* Header Row: Stars Left, Date Right */}
              <div className="card-top-row">
                <div className="card-stars" role="img" aria-label={`${review.stars ?? 5} out of 5 stars`}>
                  {renderStars(review.stars || 5)}
                </div>
                <div className="card-date">{review.date}</div>
              </div>

              {/* Reviewer Name */}
              <div className="card-reviewer-row">
                <span className="reviewer-name">{review.name}</span>
              </div>

              {/* Review Body */}
              <p className="card-review-text">{review.comment}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Responsive Bottom Kolam Wave Border — separate instance with its own internal ref */}
      <KolamBorder svgClassName="third-page-wave" />
    </section>
  );
}
