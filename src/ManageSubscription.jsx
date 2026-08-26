import { useEffect } from 'react';
import { useAnimatedUnderline } from './hooks/useAnimatedUnderline';
import './styles/policy-shared.css';
import './ManageSubscription.css';

export default function ManageSubscription() {
  const { handleMouseEnter: handleLinkMouseEnter, handleMouseLeave: handleLinkMouseLeave } = useAnimatedUnderline();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <main className="policy-container">
        
        {/* Page Hero Header */}
        <section className="sub-hero">
          <div className="sub-hero-title-group">
            <h1 className="sub-hero-title-line">
              <span className="sub-hero-title-break">Manage Your</span>
              <span className="sub-hero-title-break">Subscription</span>
            </h1>
          </div>

          <div className="sub-hero-bottom-row">
            <p className="sub-hero-desc">
              View your active subscription details, renewal date, or cancel auto-renewal. Sign in with your registered mobile number.
            </p>

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
            </div>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Coming Soon Placeholder */}
        <div className="manage-coming-soon">
          coming soon
        </div>

      </main>
    </div>
  );
}
