import { useEffect } from 'react';
import { gsap } from 'gsap';
import Footer from './Footer';
import './PrivacyPolicy.css';

export default function DeleteAccount({ onOpenQrSidebar, onNavigateRoute }) {
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
                <h1 className="policy-title-line">Delete</h1>
                <h1 className="policy-title-line">Your</h1>
                <h1 className="policy-title-line">Account</h1>
              </div>

              <div className="policy-intro-text">
                <p>
                  How to remove your Temple Girl Kids account and data from the mobile app.
                </p>
                <p className="policy-meta-date">
                  Last updated: 29.06.2026 | Effective: 18 May 2026 | Myoksha Travels Private Limited
                </p>
              </div>
            </div>

            <div className="policy-hero-right">
              <div className="policy-divider policy-hero-divider" />
              <p>
                Account deletion is available in the Temple Girl Kids mobile app only (Android and iOS). Parents and guardians can delete an account themselves while signed in.
              </p>
              <p>
                The website does not offer an automatic delete button; if you only use the website and need help deleting your account, please email us at{' '}
                <a
                  href="mailto:support@templegirl.com"
                  className="policy-animated-link"
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  support@templegirl.com
                  <span className="policy-animated-underline" />
                </a>
                .
              </p>
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
            <h2 className="policy-section-heading">How to Delete (In the App)</h2>
            <p>Follow these steps in the Temple Girl Kids app:</p>
            <ul className="policy-list">
              <li>
                <strong className="list-label">Step 1:</strong> Open the app and sign in using your registered mobile number and the one-time password (OTP).
              </li>
              <li>
                <strong className="list-label">Step 2:</strong> Open your account profile from the app menu.
              </li>
              <li>
                <strong className="list-label">Step 3:</strong> Select &quot;Delete Account&quot;, read the warning, and confirm deletion.
              </li>
              <li>
                <strong className="list-label">Step 4:</strong> The app clears local data and signs you out when deletion succeeds.
              </li>
            </ul>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 2 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">02</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">What Happens When You Delete</h2>
            <ul className="policy-list">
              <li>Your login account is removed — you cannot sign in again with the same account ID.</li>
              <li>Data on your phone (saved preferences and caches) is cleared from the app.</li>
              <li>Push notifications for that account are turned off on our servers.</li>
              <li>
                If you have an active subscription purchased on templegirl.com, auto-renewal is cancelled at the end of your current billing period. You keep access until that period ends; we do not refund unused time through account deletion.
              </li>
              <li>Your cloud data is scheduled for permanent removal within 30 days.</li>
            </ul>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 3 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">03</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Data We Delete</h2>
            <p>When you delete your account, we remove or schedule removal of:</p>
            <ul className="policy-list">
              <li>Mobile phone number linked to your account (Firebase Authentication)</li>
              <li>Profile and account settings</li>
              <li>Listening history and app usage tied to your account</li>
              <li>Subscription and billing records linked to your account in our database</li>
              <li>Device and push notification tokens</li>
            </ul>
            <p className="policy-note">
              Deletion is permanent after the retention period. It cannot be undone.
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
            <h2 className="policy-section-heading">How Long We Keep Data</h2>
            <p>
              After you delete in the app, we mark your account for deletion and remove login access immediately. Remaining records in our database are permanently deleted within 30 days.
            </p>
            <p>
              If you sign in again with the same phone number in the future, you will get a brand new account. Premium access from your old account does not transfer automatically; you may subscribe again on the website if you wish.
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
            <h2 className="policy-section-heading">Website &amp; Support</h2>
            <ul className="policy-list">
              <li>
                <strong className="list-label">Mobile app:</strong> Delete your account yourself following the steps in Section 01.
              </li>
              <li>
                <strong className="list-label">Website only:</strong> Email{' '}
                <a
                  href="mailto:support@templegirl.com"
                  className="policy-animated-link"
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  support@templegirl.com
                  <span className="policy-animated-underline" />
                </a>{' '}
                to request account deletion.
              </li>
              <li>
                <strong className="list-label">Manage subscription:</strong> To cancel subscription auto-renewal without deleting your account, use Manage Subscriptions on the website while signed in.
              </li>
            </ul>
            <p>We respond to all support requests within 30 days.</p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 6 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">06</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Contact Us</h2>
            <p>
              If you have questions about account deletion, your data, or need assistance, contact us at:
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
          </div>
        </section>

      </main>

      {/* Docked Footer */}
      <Footer onOpenQrSidebar={onOpenQrSidebar} onNavigateRoute={onNavigateRoute} />
    </div>
  );
}
