import { useRef, useEffect, useState } from 'react';
import './Reviews.css';

export default function Reviews() {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  const [reviewsData, setReviewsData] = useState([]);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Fetch real review data from public/review.json
  useEffect(() => {
    fetch('/review.json')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviewsData(data);
        }
      })
      .catch((err) => console.error("Failed to load review data:", err));
  }, []);

  // Dynamic responsive width listener for Kolam wave border
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth || 1200);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Responsive Kolam border calculation
  const waveSegmentWidth = 30;
  const numWaves = Math.max(4, Math.floor(containerWidth / waveSegmentWidth));
  const kolamSvgWidth = numWaves * waveSegmentWidth;

  const generateWavePath = () => {
    let d = "M 0 12 Q 15 3, 30 12";
    for (let i = 1; i < numWaves; i++) {
      d += ` T ${(i + 1) * waveSegmentWidth} 12`;
    }
    return d;
  };

  const renderDots = () => {
    const dots = [];
    let isUpper = true;
    for (let i = 0; i < numWaves; i++) {
      const cx = i * waveSegmentWidth + 15;
      const cy = isUpper ? 15.5 : 8.5;
      dots.push(
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="2.2"
          fill="#F2B84B"
        />
      );
      isUpper = !isUpper;
    }
    return dots;
  };

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
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="third-page-section" id="third-page">
      {/* Responsive Top Kolam Wave Border */}
      <div ref={containerRef} className="wave-container top-wave-container">
        <svg
          className="third-page-wave"
          viewBox={`0 0 ${kolamSvgWidth} 24`}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d={generateWavePath()}
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {renderDots()}
          </g>
        </svg>
      </div>

      {/* Headline Container (86vw max-width 1240px) */}
      <div className="third-page-content">
        <div className="third-page-header-block">
          <h2 className="third-page-title">
            <span className="text-white">What do families think of Temple Girl?</span>{' '}
            <span className="text-muted">
              Discover why parents are bringing the stories of India’s temples into their children’s bedtime.
            </span>
          </h2>
        </div>
      </div>

      {/* Full-Bleed 100vw Screen Width Reviews Carousel */}
      <div className="reviews-carousel-wrapper">
        <div
          ref={sliderRef}
          className={`reviews-slider-track ${isMouseDown ? 'is-grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {reviewsData.map((review, index) => (
            <div key={index} className="review-card">
              {/* Header Row: Stars Left, Date Right */}
              <div className="card-top-row">
                <div className="card-stars">{renderStars(review.stars || 5)}</div>
                <div className="card-date">{review.date}</div>
              </div>

              {/* Reviewer Name */}
              <div className="card-reviewer-row">
                <span className="reviewer-name">{review.name}</span>
              </div>

              {/* Review Body */}
              <p className="card-review-text">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Bottom Kolam Wave Border */}
      <div ref={containerRef} className="wave-container bottom-wave-container">
        <svg
          className="third-page-wave"
          viewBox={`0 0 ${kolamSvgWidth} 24`}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d={generateWavePath()}
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {renderDots()}
          </g>
        </svg>
      </div>
    </section>
  );
}
