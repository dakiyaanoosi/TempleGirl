import { useEffect } from 'react';
import { gsap } from 'gsap';
import Header from './Header';
import Footer from './Footer';
import './PrivacyPolicy.css';

export default function PrivacyPolicy({ onOpenQrSidebar, onNavigateHome, onNavigateRoute }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP Mouse Enter Underline Animation (matches Questions.jsx "We're here to help")
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
      {/* Standard Site Header */}
      <Header />

      <main className="policy-container">
        {/* Hero Header */}
        <section className="policy-hero">
          <div className="policy-hero-grid">
            <div className="policy-hero-left">
              <div className="policy-title-group">
                <h1 className="policy-title-line">Privacy</h1>
                <h1 className="policy-title-line">Policy</h1>
              </div>

              <div className="policy-intro-text">
                <p>
                  This Privacy Policy explains how we collect, use, disclose, and safeguard the privacy of children and families who use Temple Girl Kids.
                </p>
                <p className="policy-meta-date">
                  Last updated: 29.06.2026 | Effective: 18 May 2026 | Myoksha Travels Private Limited
                </p>
              </div>
            </div>

            <div className="policy-hero-right">
              <p>
                This policy covers the Temple Girl Kids mobile app only. For how we handle data on the templegirl.com website, see our{' '}
                <a
                  href="/pages/privacy.html"
                  className="policy-animated-link"
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  Website Privacy Policy
                  <span className="policy-animated-underline" />
                </a>
                .
              </p>
              <p>
                Temple Girl Kids is operated by Myoksha Travels Private Limited (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a company registered in Mangalore, Karnataka, India. This privacy policy explains how we collect, use, and protect information in connection with the Temple Girl Kids mobile application.
              </p>
              <p>
                We are committed to protecting the privacy of children and families who use our service. This policy complies with the Children&apos;s Online Privacy Protection Act (COPPA), India&apos;s Digital Personal Data Protection Act, and applicable data protection laws.
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
            <h2 className="policy-section-heading">Who Uses Temple Girl Kids</h2>
            <p>
              Temple Girl Kids is an audio storytelling app for children aged 3 to 10. All accounts are created and managed by parents or legal guardians. Children access content through their parent&apos;s or guardian&apos;s account. We do not require or allow children to create their own accounts.
            </p>
            <p>
              Parental consent is established through the account creation process, which requires a valid mobile phone number and an active paid subscription managed by the parent or guardian. Subscriptions may be purchased on our website (via Razorpay) or in the mobile app (via Google Play or the Apple App Store). Only a parent or legal guardian may create an account, and doing so constitutes consent for the limited data collection described in this policy.
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
            <h2 className="policy-section-heading">Information We Collect &amp; Why</h2>
            
            <div className="policy-subsection">
              <h3 className="policy-subheading">Information Provided by Parents</h3>
              <p>When a parent or guardian creates an account, we collect:</p>
              <ul className="policy-list">
                <li>
                  <strong className="list-label">Mobile phone number:</strong> For account authentication via OTP (one-time password).
                </li>
                <li>
                  <strong className="list-label">Payment information:</strong> Depending on how you subscribe:
                  <ul className="policy-sublist">
                    <li>
                      <strong className="sublist-label">Website (templegirl.com):</strong> Credit/debit card, UPI, or other payment details are collected and processed by Razorpay. We do not store payment card details on our servers.
                    </li>
                    <li>
                      <strong className="sublist-label">Mobile app (Android):</strong> Subscription payments are processed by Google Play Billing through your Google account. We do not receive or store your payment card details.
                    </li>
                    <li>
                      <strong className="sublist-label">Mobile app (iOS):</strong> Subscription payments are processed by the Apple App Store through your Apple ID. We do not receive or store your payment card details.
                    </li>
                  </ul>
                  <p className="policy-note">Each payment provider&apos;s privacy policy governs how your payment data is handled.</p>
                </li>
              </ul>
            </div>

            <div className="policy-subsection">
              <h3 className="policy-subheading">Information Collected Automatically</h3>
              <p>When the app is used, we automatically collect:</p>
              <ul className="policy-list">
                <li><strong className="list-label">Device Data:</strong> Device type and operating system version</li>
                <li><strong className="list-label">Listening History:</strong> Which stories are played and for how long</li>
                <li><strong className="list-label">Push Notification Tokens:</strong> For sending new story alerts</li>
              </ul>
            </div>

            <div className="policy-subsection">
              <h3 className="policy-subheading">Information We Do Not Collect</h3>
              <p>We do not collect:</p>
              <ul className="policy-list">
                <li>Children&apos;s names, ages, or personal details</li>
                <li>Photos, videos, or voice recordings</li>
                <li>Location data (GPS, Wi-Fi, or Bluetooth-based)</li>
                <li>Contact lists or address book data</li>
                <li>Browsing history outside the app</li>
                <li>Any data from other apps on the device</li>
              </ul>
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
            <h2 className="policy-section-heading">How We Use Information</h2>
            <p>We use the information we collect solely for the following purposes:</p>
            <ul className="policy-list">
              <li>To provide and maintain the Temple Girl Kids service</li>
              <li>To authenticate parent accounts and manage subscriptions</li>
              <li>To track listening history so children can resume stories</li>
              <li>To send push notifications about new stories (parents can disable this in device settings)</li>
              <li>To understand which stories and categories are most popular, so we can improve our content</li>
              <li>To respond to support enquiries from parents</li>
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
              <li>We do not serve advertisements of any kind in the app.</li>
              <li>We do not engage in behavioural advertising or interest-based advertising.</li>
              <li>We do not build profiles of children for marketing purposes.</li>
              <li>We do not sell, rent, or share personal information with third parties for their marketing purposes.</li>
              <li>We do not use any analytics tools in the mobile app to track or profile children.</li>
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
            <h2 className="policy-section-heading">Third-Party Processors</h2>
            <p>We use the following third-party services:</p>
            <ul className="policy-list">
              <li><strong className="list-label">Firebase Authentication:</strong> For secure parent login</li>
              <li><strong className="list-label">Firebase Cloud Firestore:</strong> For storing account data and story metadata</li>
              <li><strong className="list-label">Firebase Cloud Messaging:</strong> For sending push notifications</li>
              <li><strong className="list-label">Firebase Crashlytics:</strong> For identifying and fixing app crashes (collects anonymous crash data only)</li>
              <li><strong className="list-label">Razorpay:</strong> For processing subscription payments on our website</li>
              <li><strong className="list-label">Google Play Billing:</strong> For processing in-app subscription payments on Android</li>
              <li><strong className="list-label">Apple App Store:</strong> For processing in-app subscription payments on iOS</li>
            </ul>
            <p className="policy-note">
              These services process data in accordance with their own privacy policies. Our use of app services does not involve tracking or profiling of children.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 6 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">06</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Data Retention &amp; Security</h2>
            <p>
              Account data and listening history are stored on Firebase (Google Cloud) servers. Firebase servers may be located outside India. By using the service, you consent to your data being processed on Google Cloud infrastructure in accordance with Google&apos;s data processing terms.
            </p>
            <p>
              We use industry-standard security measures including encrypted connections (TLS/SSL), secure authentication, and access controls to protect all data.
            </p>
            <p>
              We retain account data for as long as the parent maintains an active account. Listening history is retained to provide a seamless experience (resume playback, story recommendations).
            </p>
            <p>
              If a subscription lapses but the account is not deleted, we retain account data for 12 months to allow easy reactivation. After 12 months of inactivity with no active subscription, account data is automatically deleted. Parents may request earlier deletion at any time.
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
            <h2 className="policy-section-heading">Parental Rights</h2>
            <p>As a parent or guardian, you have the right to:</p>
            <ul className="policy-list">
              <li>Review the personal information associated with your account by contacting us</li>
              <li>
                Delete your account and all associated data by contacting us at{' '}
                <a
                  href="mailto:support@templegirl.com"
                  className="policy-animated-link"
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  support@templegirl.com
                  <span className="policy-animated-underline" />
                </a>
              </li>
              <li>Opt out of push notifications through your device settings</li>
              <li>Request information about what data we hold about your account</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{' '}
              <a
                href="mailto:support@templegirl.com"
                className="policy-animated-link"
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
              >
                support@templegirl.com
                <span className="policy-animated-underline" />
              </a>
              . We will respond within 30 days.
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
            <h2 className="policy-section-heading">Data Sharing</h2>
            <p>We do not share personal information with any third party except:</p>
            <ul className="policy-list">
              <li>With service providers (Firebase, Razorpay, Google Play, Apple App Store) strictly for operating the service</li>
              <li>When required by law, regulation, or legal process</li>
              <li>To protect the safety of our users or the public</li>
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
            <h2 className="policy-section-heading">Changes to This Policy</h2>
            <p>
              If we make material changes to this privacy policy, we will notify parents via email (sent to the registered account email) at least 7 days before the changes take effect. Continued use of the service after notification constitutes acceptance of the updated policy.
            </p>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 10 */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">10</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Contact Information</h2>
            <p>
              If you have questions or concerns about this privacy policy or our data practices, contact us at:
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
                Mangaluru, Dakshina Kannada<br />
                Karnataka 575001, India
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
