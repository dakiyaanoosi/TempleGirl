import { useEffect } from 'react';
import { gsap } from 'gsap';
import Footer from './Footer';
import './PrivacyPolicy.css';

export default function Terms({ onOpenQrSidebar, onNavigateRoute }) {
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
                <h1 className="policy-title-line">Terms &amp;</h1>
                <h1 className="policy-title-line">Conditions</h1>
              </div>

              <div className="policy-intro-text">
                <p>
                  Please read these terms carefully before using the Temple Girl Kids app or website.
                </p>
                <p className="policy-meta-date">
                  Last updated: 29.06.2026 | Effective: 18 May 2026 | Myoksha Travels Private Limited
                </p>
              </div>
            </div>

            <div className="policy-hero-right">
              <div className="policy-divider policy-hero-divider" />
              <p>
                These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the Temple Girl Kids mobile application and website (collectively, &quot;the Service&quot;) operated by Myoksha Travels Private Limited (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), registered under the Companies Act, 2013, with GSTIN 29AAKCM0397B1ZE.
              </p>
              <p>
                By downloading, installing, or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service. If you are accessing the Service on behalf of a minor child, you represent that you are the parent or legal guardian and accept these Terms on their behalf.
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
            <h2 className="policy-section-heading">Eligibility</h2>
            <ul className="policy-list">
              <li>The Service is intended for children aged 3–10 years, used under the supervision and with the consent of a parent or legal guardian.</li>
              <li>To create an account or purchase a subscription, you must be at least 18 years of age (or the age of majority in your jurisdiction) and have the legal capacity to enter into a binding contract.</li>
              <li>By using the Service, you represent that you meet these eligibility requirements.</li>
              <li>You acknowledge that you are solely responsible for supervising your child&apos;s use of the Service and for any activity on your account.</li>
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
            <h2 className="policy-section-heading">Description of Service</h2>
            <p>Temple Girl Kids is an audio storytelling platform offering:</p>
            <ul className="policy-list">
              <li><strong className="list-label">Free tier:</strong> 1-minute audio previews of all stories, available to all users without subscription.</li>
              <li><strong className="list-label">Premium tier:</strong> Full-length audio stories (typically 5–8 minutes each), Temple Girl Radio (24/7 continuous playback), and sleep timer — available on a paid subscription basis.</li>
            </ul>
            <p>
              We reserve the right to modify, add, or remove stories, features, or content at any time, with or without notice, provided that existing subscribers retain access to the core service they subscribed for during their active subscription period.
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
            <h2 className="policy-section-heading">Account Registration</h2>
            <ul className="policy-list">
              <li>You may use certain features without an account. However, to purchase a subscription or save listening progress, account registration is required.</li>
              <li>You agree to provide accurate, current, and complete information during registration and to keep it updated.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials and for all activity occurring under your account.</li>
              <li>
                You must notify us immediately at{' '}
                <a
                  href="mailto:support@templegirl.com"
                  className="policy-animated-link"
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  support@templegirl.com
                  <span className="policy-animated-underline" />
                </a>{' '}
                if you suspect unauthorised access to your account.
              </li>
              <li>One subscription account may be used across multiple personal devices belonging to the same family.</li>
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
            <h2 className="policy-section-heading">Subscriptions &amp; Payments</h2>

            <div className="policy-subsection">
              <h3 className="policy-subheading">Subscription Plans</h3>
              <ul className="policy-list">
                <li><strong className="list-label">Monthly Plan:</strong> ₹249 per month (India) / $6.99 per month (International), billed every 30 days.</li>
                <li><strong className="list-label">Annual Plan:</strong> ₹1,999 per year (India) / $59.99 per year (International), billed once annually.</li>
              </ul>
              <p className="policy-note">
                Prices are inclusive of applicable taxes. We reserve the right to change prices with 30 days&apos; prior notice to existing subscribers.
              </p>
            </div>

            <div className="policy-subsection">
              <h3 className="policy-subheading">Payment Methods</h3>
              <p>You may subscribe through one of the following channels:</p>
              <ul className="policy-list">
                <li>
                  <strong className="list-label">Website (templegirl.com):</strong> Payments on our website are processed via Razorpay. Accepted methods include UPI, credit/debit cards, net banking, and wallets. We do not store payment card details on our servers.
                </li>
                <li>
                  <strong className="list-label">Mobile app (Android / iOS):</strong> Subscriptions purchased inside the mobile app are processed by Google Play Billing or Apple App Store through your respective account.
                </li>
              </ul>
            </div>

            <div className="policy-subsection">
              <h3 className="policy-subheading">Auto-Renewal &amp; Cancellation</h3>
              <p>
                All subscription plans automatically renew at the end of each billing period unless cancelled before renewal. You may cancel at any time:
              </p>
              <ul className="policy-list">
                <li>
                  <strong className="list-label">Website (Razorpay):</strong> Email support@templegirl.com at least 3 business days before renewal, or use the manage subscription page on templegirl.com.
                </li>
                <li>
                  <strong className="list-label">Google Play (Android):</strong> Open Google Play → Payments &amp; subscriptions → Subscriptions and cancel Temple Girl Kids.
                </li>
                <li>
                  <strong className="list-label">Apple App Store (iOS):</strong> Open Settings → [your name] → Subscriptions and cancel Temple Girl Kids.
                </li>
              </ul>
              <p>
                Subscription fees are non-refundable regardless of payment method. See our{' '}
                <a
                  href="/refund"
                  className="policy-animated-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigateRoute) onNavigateRoute('/refund');
                  }}
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  Refund Policy
                  <span className="policy-animated-underline" />
                </a>{' '}
                for details.
              </p>
            </div>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 5 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">05</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Free Tier</h2>
            <ul className="policy-list">
              <li>Free users may access the first minute of any story without charge.</li>
              <li>We reserve the right to modify the extent of free access at any time.</li>
              <li>The free tier contains no advertisements.</li>
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
            <h2 className="policy-section-heading">Intellectual Property</h2>
            <ul className="policy-list">
              <li>All audio content, narrations, story scripts, illustrations, app design, branding, logos, and software (&quot;Content&quot;) are the exclusive property of Myoksha Travels Private Limited or its licensors.</li>
              <li>We grant you a limited, non-exclusive, non-transferable, revocable licence to access and use the Service for personal, non-commercial purposes.</li>
              <li>You may not reproduce, distribute, modify, publicly perform, transmit, broadcast, or create derivative works from any Content without our express written permission.</li>
              <li>You may not screen-record, download, or redistribute audio content from the Service.</li>
              <li>&quot;Temple Girl Kids&quot; and &quot;Temple Girl&quot; are trademarks of Myoksha Travels Private Limited. All rights reserved.</li>
            </ul>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 7 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">07</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul className="policy-list">
              <li>Use the Service for any unlawful purpose or in violation of these Terms</li>
              <li>Attempt to gain unauthorised access to any part of the Service or its systems</li>
              <li>Use automated bots, scrapers, or tools to extract content</li>
              <li>Reverse engineer, decompile, or disassemble any part of the app</li>
              <li>Share your login credentials with non-family third parties to circumvent subscription requirements</li>
              <li>Upload or transmit viruses, malware, or any harmful code</li>
              <li>Defame, harass, or impersonate any person or entity</li>
              <li>Use the Service in any way that could damage our reputation or business</li>
            </ul>
            <p className="policy-note">
              We reserve the right to immediately suspend or terminate accounts engaged in prohibited conduct.
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
            <h2 className="policy-section-heading">Disclaimers</h2>
            <ul className="policy-list">
              <li>The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, express or implied.</li>
              <li>We do not warrant that the Service will be uninterrupted, error-free, or free from viruses or other harmful components.</li>
              <li>Stories are based on temple history, tradition, and cultural heritage and are presented as entertaining narratives for children. They are not intended as religious instruction or authoritative theological statements.</li>
              <li>We do not guarantee that the Service will be available in all geographic regions.</li>
            </ul>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 9 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">09</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable Indian law:</p>
            <ul className="policy-list">
              <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.</li>
              <li>Our total aggregate liability to you for any claim arising under these Terms shall not exceed the amount you paid to us in the 3 months preceding the claim.</li>
              <li>Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability — in such cases, our liability is limited to the minimum extent permitted by law.</li>
            </ul>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 10 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">10</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Myoksha Travels Private Limited, its directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of your violation of these Terms, misuse of the Service, or violation of any third-party rights.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 11 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">11</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Termination</h2>
            <ul className="policy-list">
              <li>We may suspend or terminate your access to the Service at any time, with or without cause, with or without notice, if we believe you have violated these Terms.</li>
              <li>
                You may terminate your account at any time by emailing{' '}
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
              </li>
              <li>Upon termination, all licences granted to you immediately cease. Sections 6 (IP), 9 (Liability), 10 (Indemnity), and 12 (Governing Law) survive termination.</li>
            </ul>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 12 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">12</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Governing Law &amp; Disputes</h2>
            <ul className="policy-list">
              <li>These Terms are governed by the laws of India, specifically the laws of the state of Karnataka.</li>
              <li>Any dispute arising out of or relating to these Terms shall first be attempted to be resolved through good-faith negotiation.</li>
              <li>If unresolved within 30 days, disputes shall be subject to the exclusive jurisdiction of the courts of Mangaluru, Karnataka, India.</li>
              <li>Notwithstanding the above, we may seek injunctive or other equitable relief in any court of competent jurisdiction to protect our intellectual property.</li>
            </ul>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 13 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">13</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide at least 14 days&apos; notice of material changes via in-app notification and/or email. Continued use after the effective date of changes constitutes your acceptance of the updated Terms.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 14 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">14</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Contact Us</h2>
            <p>For any questions about these Terms, please contact us at:</p>
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
