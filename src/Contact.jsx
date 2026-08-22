import { useEffect, useState, useRef } from 'react';
import Footer from './Footer';
import { useAnimatedUnderline } from './hooks/useAnimatedUnderline';
import './PrivacyPolicy.css';

export default function Contact({ onOpenQrSidebar, onNavigateRoute }) {
  const { handleMouseEnter: handleLinkMouseEnter, handleMouseLeave: handleLinkMouseLeave } = useAnimatedUnderline();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const subjectOptions = [
    'Subscription or billing',
    'App not working',
    'Story suggestion',
    'Business or partnership',
    'Other'
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Close subject options dropdown when clicking anywhere outside or clicking/focusing other fields
  useEffect(() => {
    if (!isDropdownOpen) return;

    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsDropdownOpen(false);
  };

  return (
    <div className="policy-page">

      <main className="policy-container">
        {/* Hero Header */}
        <section className="policy-hero">
          <div className="policy-hero-grid">
            <div className="policy-hero-left">
              <div className="policy-title-group">
                <h1 className="policy-title-line">Get in</h1>
                <h1 className="policy-title-line">Touch</h1>
              </div>

              <div className="policy-intro-text">
                <p>
                  Whether it’s a question, a story suggestion, or just a warm namaste.
                </p>
                <p className="policy-meta-date">
                  Myoksha Travels Private Limited | Mangaluru, Karnataka
                </p>
              </div>
            </div>

            <div className="policy-hero-right">
              <div className="policy-divider policy-hero-divider" />
              <p>
                We&apos;re here to help! Reach out to us for support, partnerships, or any questions about the Temple Girl Kids app and platform.
              </p>
              <p>
                We read every message and respond within 1–2 business days.
              </p>
            </div>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 01: Direct Channels */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">01</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Contact Channels</h2>
            
            {/* Box 1: Support */}
            <p className="policy-contact-label">App Support &amp; Billing</p>
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
              <p className="policy-contact-desc-text">Subscriptions, technical help, and account issues.</p>
            </div>

            {/* Box 2: Business */}
            <p className="policy-contact-label">Business &amp; Partnerships</p>
            <div className="policy-contact-box">
              <a
                href="mailto:namaste@templegirl.com"
                className="policy-animated-link policy-contact-email"
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
              >
                namaste@templegirl.com
                <span className="policy-animated-underline" />
              </a>
              <p className="policy-contact-desc-text">Media, collaborations, and general enquiries.</p>
            </div>

            {/* Box 3: Registered Office */}
            <p className="policy-contact-label">Registered Office</p>
            <div className="policy-contact-box">
              <address className="policy-contact-address">
                23-9-568/6, Swasti Nilaya, Mangala Nagar 2nd Cross,<br />
                Mangaladevi Temple, Mangaluru, Karnataka 575001, India
              </address>
            </div>
          </div>
        </section>

        <div className="policy-divider" />

        {/* Section 02: Send Us a Message */}
        <section className="policy-section">
          <div className="policy-num-col">
            <span className="policy-num-text">02</span>
          </div>
          <div className="policy-content-col">
            <h2 className="policy-section-heading">Send Us a Message</h2>
            <p style={{ marginBottom: '1.5rem' }}>We reply to every message within 1–2 business days.</p>

            <div className="minimal-form-container">
              <form onSubmit={handleSubmit} className="minimal-form-stack">
                {/* Field 1: Name */}
                <div className="minimal-field-group">
                  <label htmlFor="minimal-name" className="sr-only">Your Name</label>
                  <input
                    id="minimal-name"
                    type="text"
                    required
                    aria-required="true"
                    className="minimal-input"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Field 2: Email */}
                <div className="minimal-field-group">
                  <label htmlFor="minimal-email" className="sr-only">Email Address</label>
                  <input
                    id="minimal-email"
                    type="email"
                    required
                    aria-required="true"
                    className="minimal-input"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Field 3: Subject Dropdown — keyboard accessible combobox */}
                <div ref={dropdownRef} className="minimal-field-group">
                  <div
                    id="minimal-subject"
                    className={`minimal-select-trigger ${isDropdownOpen ? 'open' : ''}`}
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    aria-label="Subject"
                    aria-controls="subject-listbox"
                    tabIndex={0}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsDropdownOpen(!isDropdownOpen);
                      }
                      if (e.key === 'Escape') setIsDropdownOpen(false);
                    }}
                  >
                    <span className={`minimal-select-text ${!formData.subject ? 'placeholder' : ''}`}>
                      {formData.subject ? formData.subject : 'Subject *'}
                    </span>
                    <svg
                      className={`minimal-chevron ${isDropdownOpen ? 'open' : ''}`}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <div
                      id="subject-listbox"
                      role="listbox"
                      aria-label="Subject options"
                      className="minimal-dropdown-card"
                    >
                      {subjectOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          role="option"
                          aria-selected={formData.subject === opt}
                          className={`minimal-dropdown-option ${formData.subject === opt ? 'selected' : ''}`}
                          onClick={() => {
                            setFormData({ ...formData, subject: opt });
                            setIsDropdownOpen(false);
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field 4: Message */}
                <div className="minimal-field-group">
                  <textarea
                    id="minimal-message"
                    required
                    className="minimal-textarea"
                    placeholder="Your Message... *"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button type="submit" className="minimal-submit-btn">
                    Submit
                  </button>

                  <p className="minimal-terms-text">
                    <span>* By submitting, you agree to our</span>
                    <a
                      href="/privacy"
                      className="policy-animated-link"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onNavigateRoute) onNavigateRoute('/privacy');
                      }}
                      onMouseEnter={handleLinkMouseEnter}
                      onMouseLeave={handleLinkMouseLeave}
                    >
                      Privacy Policy
                      <span className="policy-animated-underline" />
                    </a>
                    <span>.</span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* Docked Footer */}
      <Footer onOpenQrSidebar={onOpenQrSidebar} onNavigateRoute={onNavigateRoute} />
    </div>
  );
}
