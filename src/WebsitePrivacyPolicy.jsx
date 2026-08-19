import { useEffect } from 'react';
import { gsap } from 'gsap';
import Footer from './Footer';
import './PrivacyPolicy.css';

export default function WebsitePrivacyPolicy({ onOpenQrSidebar, onNavigateRoute }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP Mouse Enter Underline Animation (matches Questions.jsx & PrivacyPolicy.jsx)
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
                <h1 className="policy-title-line">Website</h1>
                <h1 className="policy-title-line">Privacy</h1>
                <h1 className="policy-title-line">Policy</h1>
              </div>

              <div className="policy-intro-text">
                <p>
                  This policy explains how we collect, use, and handle data when you visit templegirl.com.
                </p>
                <p className="policy-meta-date">
                  Last updated: 29.06.2026 | Effective: 18 May 2026 | Myoksha Travels Private Limited
                </p>
              </div>
            </div>

            <div className="policy-hero-right">
              <div className="policy-divider policy-hero-divider" />
              <p>
                This policy applies only to the templegirl.com website. It does not apply to the Temple Girl Kids mobile app. For the app&apos;s privacy policy, please see our{' '}
                <a
                  href="/privacy-policy"
                  className="policy-animated-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigateRoute) onNavigateRoute('/privacy-policy');
                  }}
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  App Privacy Policy
                  <span className="policy-animated-underline" />
                </a>
                .
              </p>
              <p>
                The templegirl.com website is operated by Myoksha Travels Private Limited (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a company registered in Mangalore, Karnataka, India. This website is designed for parents and guardians who want to learn about Temple Girl Kids, manage their subscription, or make a purchase. This website is not intended for use by children.
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
            <h2 className="policy-section-heading">Who This Policy Covers</h2>
            <p>
              The templegirl.com website is designed for parents and guardians who want to learn about Temple Girl Kids, manage their subscription, or make a purchase. This website is not intended for use by children.
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
            <h2 className="policy-section-heading">Information We Collect on the Website</h2>

            <div className="policy-subsection">
              <h3 className="policy-subheading">Analytics Data</h3>
              <p>
                We use Google Analytics (GA4) to understand how visitors use our website. Google Analytics collects aggregated data such as pages viewed, approximate location (country or city), device type, browser, and how you arrived at our site. Google Analytics uses cookies to recognize returning visitors and measure sessions. This data is processed by Google in accordance with the{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="policy-animated-link"
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  Google Privacy Policy
                  <span className="policy-animated-underline" />
                </a>
                .
              </p>
            </div>

            <div className="policy-subsection">
              <h3 className="policy-subheading">Advertising Cookies</h3>
              <p>
                We use Google Ads remarketing to show relevant reminders about Temple Girl Kids to parents who have previously visited our website. When you visit templegirl.com, a cookie may be placed on your browser by Google Ads. This cookie allows us to show you advertisements on other websites and platforms you visit, such as Google Search, YouTube, and websites in the Google Display Network.
              </p>
              <p>
                These advertising cookies are used solely to remind previous website visitors about Temple Girl Kids. We do not use them to build profiles of children, and they are not connected to any data from the Temple Girl Kids mobile app.
              </p>
            </div>

            <div className="policy-subsection">
              <h3 className="policy-subheading">Payment Information</h3>
              <p>
                Subscription payments on the website are processed by Razorpay. Payment details (credit/debit card, UPI, or other payment methods) are collected and handled by Razorpay. We do not store payment card details on our servers. Razorpay&apos;s privacy policy governs the handling of payment data.
              </p>
            </div>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 3 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">03</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">How We Use Website Data</h2>
            <p>We use website data for the following purposes only:</p>
            <ul className="policy-list">
              <li>To understand which pages are most visited and how visitors navigate the site</li>
              <li>To understand where our website traffic comes from</li>
              <li>To show relevant reminders about Temple Girl Kids to parents who have visited our website</li>
              <li>To process subscription payments</li>
              <li>To improve the website experience</li>
            </ul>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 4 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">04</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">What We Do Not Do</h2>
            <ul className="policy-list">
              <li>We do not use website cookies or advertising data to track or profile children.</li>
              <li>We do not connect website analytics or advertising cookies to children&apos;s listening activity in the app.</li>
              <li>We do not sell, rent, or share your data with third parties for their own marketing purposes.</li>
              <li>We do not send your mobile number, account details, or app usage data to Google Analytics or Google Ads.</li>
            </ul>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 5 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">05</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Your Choices</h2>
            <ul className="policy-list">
              <li>
                <strong className="list-label">Opt out of Google Analytics:</strong> You can install the{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="policy-animated-link"
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  Google Analytics Opt-out Browser Add-on
                  <span className="policy-animated-underline" />
                </a>{' '}
                to prevent your data from being collected by Google Analytics.
              </li>
              <li>
                <strong className="list-label">Opt out of Google Ads remarketing:</strong> You can opt out of personalized advertising by visiting{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="policy-animated-link"
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  Google Ads Settings
                  <span className="policy-animated-underline" />
                </a>{' '}
                or by using your browser&apos;s cookie settings to block third-party cookies.
              </li>
              <li>
                <strong className="list-label">Cookie settings:</strong> Most browsers allow you to block or delete cookies through their settings. Please note that blocking cookies may affect the functionality of the website.
              </li>
            </ul>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 6 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">06</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Cookie Consent for EU/UK Visitors</h2>
            <p>
              If you are visiting from the European Union or United Kingdom, analytics and advertising cookies will only be loaded after you provide consent through our cookie banner. You may withdraw your consent at any time through the cookie settings on our website.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 7 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">07</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Data Retention</h2>
            <p>
              Google Analytics data is retained for 14 months. Google Ads remarketing cookies expire after 540 days. You can clear cookies from your browser at any time.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 8 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">08</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Changes to This Policy</h2>
            <p>
              If we make material changes to this website privacy policy, we will update the &quot;Last updated&quot; date at the top of this page.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 9 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">09</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Contact Us</h2>
            <p>
              If you have questions about this website privacy policy, contact us at:
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
