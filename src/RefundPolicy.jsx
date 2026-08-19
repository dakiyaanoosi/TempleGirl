import { useEffect } from 'react';
import { gsap } from 'gsap';
import Footer from './Footer';
import './PrivacyPolicy.css';

export default function RefundPolicy({ onOpenQrSidebar, onNavigateRoute }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP Mouse Enter Underline Animation (matches PrivacyPolicy.jsx)
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
        {/* Hero Header */}
        <section className="policy-hero">
          <div className="policy-hero-grid">
            <div className="policy-hero-left">
              <div className="policy-title-group">
                <h1 className="policy-title-line">Refund</h1>
                <h1 className="policy-title-line">Policy</h1>
              </div>

              <div className="policy-intro-text">
                <p>
                  How cancellations work for website and in-app subscriptions.
                </p>
                <p className="policy-meta-date">
                  Last updated: 29.06.2026 | Effective: 18 May 2026 | Myoksha Travels Private Limited
                </p>
              </div>
            </div>

            <div className="policy-hero-right">
              <div className="policy-divider policy-hero-divider" />
              <p>
                This Refund Policy governs all Temple Girl Kids subscription purchases — on our website (templegirl.com via Razorpay) and in the mobile app (via Google Play Billing on Android or the Apple App Store on iOS).
              </p>
              <p>
                Please read this policy carefully before subscribing. By completing a purchase, you acknowledge that you have read and agree to this policy.
              </p>
            </div>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Quick Summary Section */}
        <section className="quick-summary-wrapper">
          <h2 className="quick-summary-main-heading">Quick Summary</h2>
          
          <div className="policy-summary-table">
            {/* Column 1: All Subscriptions */}
            <div className="policy-summary-col">
              <h3 className="policy-summary-col-title">
                <svg
                  className="policy-title-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M12 11h4" />
                  <path d="M12 16h4" />
                  <path d="M8 11h.01" />
                  <path d="M8 16h.01" />
                </svg>
                <span>All subscriptions</span>
              </h3>
              <ul className="policy-summary-list">
                <li className="policy-summary-item">
                  <span className="policy-summary-bullet">✕</span>
                  <span>
                    Temple Girl Kids subscriptions are <strong>non-refundable</strong> — whether purchased on the website (Razorpay), Google Play, or the Apple App Store.
                  </span>
                </li>
                <li className="policy-summary-item">
                  <span className="policy-summary-bullet">✕</span>
                  <span>
                    You may <strong>cancel at any time</strong>; you keep full premium access until the end of your current billing period.
                  </span>
                </li>
                <li className="policy-summary-item">
                  <span className="policy-summary-bullet">✕</span>
                  <span>
                    There are <strong>no partial refunds</strong> for unused time within a billing period.
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 2: How to Cancel */}
            <div className="policy-summary-col">
              <h3 className="policy-summary-col-title">
                <svg
                  className="policy-title-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span>How to cancel</span>
              </h3>
              <ul className="policy-summary-list">
                <li className="policy-summary-item">
                  <span className="policy-summary-bullet">✓</span>
                  <span>
                    <strong>Website (Razorpay):</strong> email{' '}
                    <a
                      href="mailto:support@templegirl.com"
                      className="policy-animated-link"
                      onMouseEnter={handleLinkMouseEnter}
                      onMouseLeave={handleLinkMouseLeave}
                    >
                      support@templegirl.com
                      <span className="policy-animated-underline" />
                    </a>{' '}
                    or use the manage-subscription page.
                  </span>
                </li>
                <li className="policy-summary-item">
                  <span className="policy-summary-bullet">✓</span>
                  <span>
                    <strong>Google Play:</strong> Play Store &rarr; Payments &amp; subscriptions &rarr; Subscriptions.
                  </span>
                </li>
                <li className="policy-summary-item">
                  <span className="policy-summary-bullet">✓</span>
                  <span>
                    <strong>Apple App Store:</strong> Settings &rarr; [your name] &rarr; Subscriptions.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 1 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">01</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">General Policy</h2>
            <p>
              All Temple Girl Kids subscriptions are non-refundable. Once you subscribe, you receive premium access for the full billing period you have paid for. We do not provide refunds for change of mind, partial use of a billing period, early cancellation, or after you have received access during a paid period.
            </p>
            <p>
              This applies equally whether you pay through Razorpay on our website, Google Play Billing on Android, or the Apple App Store on iOS.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 2 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">02</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Website Subscriptions (Razorpay)</h2>
            <p>
              Subscriptions purchased on templegirl.com are processed by Razorpay. Payment is charged at the start of each billing period. If you cancel, you keep access until the end of the period already paid for; no refund is issued for the remaining days.
            </p>
            <p>
              For billing questions about website subscriptions, contact us at{' '}
              <a
                href="mailto:support@templegirl.com"
                className="policy-animated-link"
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
              >
                support@templegirl.com
                <span className="policy-animated-underline" />
              </a>{' '}
              with your registered mobile number and Razorpay payment or subscription ID.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 3 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">03</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">In-App Subscriptions (Google Play &amp; Apple)</h2>
            <p>
              Subscriptions purchased inside the Temple Girl Kids mobile app are billed and renewed by Google (Android) or Apple (iOS) through your Google account or Apple ID. Temple Girl Kids does not process or issue refunds for in-app purchases.
            </p>
            <p>
              Google and Apple maintain their own refund policies for purchases made through their stores. Any refund request for an in-app subscription must be submitted directly to Google or Apple in accordance with their terms. Approval of such requests is solely at Google or Apple&apos;s discretion — we cannot override store billing decisions.
            </p>
            <p>
              Regardless of store policies, our position is the same: subscription fees are non-refundable and access continues until the end of the paid billing period when you cancel.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 4 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">04</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Cancellations</h2>
            <p>
              You may cancel your subscription at any time to stop future charges. After cancellation, you continue to have premium access until the end of the billing period you have already paid for.
            </p>
            <ul className="policy-list">
              <li>
                <strong className="list-label">Website (Razorpay):</strong> email{' '}
                <a
                  href="mailto:support@templegirl.com"
                  className="policy-animated-link"
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  support@templegirl.com
                  <span className="policy-animated-underline" />
                </a>{' '}
                or visit the manage subscription page.
              </li>
              <li>
                <strong className="list-label">Google Play (Android):</strong> open Google Play &rarr; Payments &amp; subscriptions &rarr; Subscriptions &rarr; Temple Girl Kids &rarr; Cancel.
              </li>
              <li>
                <strong className="list-label">Apple App Store (iOS):</strong> open Settings &rarr; [your name] &rarr; Subscriptions &rarr; Temple Girl Kids &rarr; Cancel.
              </li>
            </ul>
            <p className="policy-note">
              Cancelling through the correct channel for your payment method is your responsibility. Cancelling on the website does not cancel a Google Play or Apple subscription, and vice versa.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 5 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">05</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Contact Us</h2>
            <p>
              For questions about this policy, subscription billing, or cancellations on the website:
            </p>
            <div className="policy-contact-box">
              <a
                href="mailto:support@templegirl.com"
                className="policy-animated-link policy-contact-email"
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
              >
                support@templegirl.com
                <span className="policy-animated-underline" />
              </a>
              <address className="policy-contact-address">
                23-9-568/6, Swasti Nilaya, Mangala Nagar 2nd Cross,<br />
                Mangaladevi Temple, Mangaluru, Karnataka 575001, India
              </address>
            </div>
            <p style={{ marginTop: '1.25rem' }}>
              For in-app subscription billing or refund enquiries, contact Google Play Support or Apple Support directly, as those purchases are managed by the respective app stores.
            </p>
          </div>
        </section>

      </main>

      {/* Docked Footer */}
      <Footer onOpenQrSidebar={onOpenQrSidebar} onNavigateRoute={onNavigateRoute} />
    </div>
  );
}
