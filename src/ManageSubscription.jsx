import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import Footer from './Footer';
import './PrivacyPolicy.css';
import './ManageSubscription.css';

export default function ManageSubscription({ onOpenQrSidebar, onNavigateRoute }) {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' | 'annual'

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP Mouse Enter Underline Animation for email & text links
  const handleLinkMouseEnter = (e) => {
    const underline = e.currentTarget.querySelector('.policy-animated-underline');
    if (!underline) return;
    gsap.killTweensOf(underline);

    const tl = gsap.timeline();
    tl.to(underline, {
      xPercent: 100,
      duration: 0.4,
      ease: 'power2.in'
    })
    .set(underline, {
      xPercent: -100
    })
    .to(underline, {
      xPercent: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  // GSAP Mouse Leave Underline Animation
  const handleLinkMouseLeave = (e) => {
    const underline = e.currentTarget.querySelector('.policy-animated-underline');
    if (!underline) return;
    gsap.killTweensOf(underline);

    const tl = gsap.timeline();
    tl.to(underline, {
      xPercent: -100,
      duration: 0.4,
      ease: 'power2.in'
    })
    .set(underline, {
      xPercent: 100
    })
    .to(underline, {
      xPercent: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <div className="policy-page">
      <main className="policy-container">
        
        {/* Top Hero Section (Flowty Reference Layout) */}
        <section className="sub-hero">
          <div className="sub-hero-title-group">
            <h1 className="sub-hero-title-line">Manage Your</h1>
            <h1 className="sub-hero-title-line">Subscription</h1>
          </div>

          <div className="sub-hero-bottom-row">
            {/* Left Description */}
            <p className="sub-hero-desc">
              All website subscriptions are managed through Razorpay. Sign in with the same mobile number you use in the app.
            </p>

            {/* Right Side Note & Support */}
            <div className="sub-hero-right">
              <p className="sub-hero-right-note">
                Need help? Email us at{' '}
                <a
                  href="mailto:support@templegirl.com"
                  className="policy-animated-link"
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  support@templegirl.com
                  <span className="policy-animated-underline" />
                </a>
              </p>
              <p className="sub-tax-note">
                All prices are in INR with applicable taxes included at checkout.
              </p>
            </div>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Pricing Section with Top-Centered Toggle Switch */}
        <section className="sub-pricing-section">
          <div className="sub-toggle-wrapper">
            <div className="sub-toggle-container">
              <button
                type="button"
                className={`sub-toggle-option ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>

              <button
                type="button"
                className={`sub-toggle-option ${billingCycle === 'annual' ? 'active' : ''}`}
                onClick={() => setBillingCycle('annual')}
              >
                Annual <span className="sub-save-text">• Save 33%</span>
              </button>
            </div>
          </div>

          <div className="sub-pricing-grid">
          
          {/* Card 1: Basic Free */}
          <div className="sub-card">
            <div>
              <div className="sub-card-header">
                <h2 className="sub-card-title">Basic Free</h2>
                <p className="sub-card-desc">
                  Get started instantly and explore the magical world of Temple Girl Kids with free previews.
                </p>
                <div className="sub-price-row">
                  <span className="sub-price-num">₹0</span>
                  <span className="sub-price-period">
                    / {billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <div className="sub-price-subtext">Forever free. No credit card required.</div>
              </div>

              <button
                type="button"
                className="sub-cta-btn secondary"
                onClick={onOpenQrSidebar}
              >
                Listen Free in App
              </button>
            </div>

            <div className="sub-feature-list">
              <div className="sub-feature-item">
                <span>1-minute audio previews of all stories</span>
                <span className="sub-icon-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
              <div className="sub-feature-item">
                <span>Access to full catalog previews</span>
                <span className="sub-icon-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
              <div className="sub-feature-item disabled">
                <span>Full-length story audio (5–8 mins)</span>
                <span className="sub-icon-cross">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              </div>
              <div className="sub-feature-item disabled">
                <span>Temple Girl Radio 24/7 continuous stream</span>
                <span className="sub-icon-cross">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              </div>
              <div className="sub-feature-item disabled">
                <span>Sleep timer & background playback</span>
                <span className="sub-icon-cross">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Premium Plan (Featured) */}
          <div className="sub-card featured">
            <div>
              <div className="sub-card-header">
                <h2 className="sub-card-title">Premium Access</h2>
                <p className="sub-card-desc">
                  Unlock full-length audio stories, 24/7 Temple Girl Radio, sleep timer, and new weekly releases.
                </p>
                <div className="sub-price-row">
                  <span className="sub-price-num">
                    {billingCycle === 'monthly' ? '₹249' : '₹1,999'}
                  </span>
                  <span className="sub-price-period">
                    / {billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <div className="sub-price-subtext">
                  {billingCycle === 'monthly' 
                    ? 'Billed every 30 days. Cancel anytime.' 
                    : 'Billed once annually (equivalent to ~₹166/month).'}
                </div>
              </div>

              <button
                type="button"
                className="sub-cta-btn primary"
              >
                Subscribe Now
              </button>
            </div>

            <div className="sub-feature-list">
              <div className="sub-feature-item">
                <span>Full-length story audio (5–8 mins each)</span>
                <span className="sub-icon-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
              <div className="sub-feature-item">
                <span>Temple Girl Radio 24/7 continuous streaming</span>
                <span className="sub-icon-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
              <div className="sub-feature-item">
                <span>Sleep timer & uninterrupted audio</span>
                <span className="sub-icon-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
              <div className="sub-feature-item">
                <span>100+ cultural & mythological audio stories</span>
                <span className="sub-icon-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
              <div className="sub-feature-item">
                <span>Zero ads & child-safe audio experience</span>
                <span className="sub-icon-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Docked Footer Navigation */}
      <Footer onOpenQrSidebar={onOpenQrSidebar} onNavigateRoute={onNavigateRoute} currentPath="/manage-subscription" />
    </div>
  );
}
