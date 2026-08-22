import KolamBorder from './KolamBorder';
import { handleRadialMouseMove } from './utils/radialMouseMove';
import { isRouteActive } from './utils/routes';
import './Footer.css';

export default function Footer({ onOpenQrSidebar, onNavigateRoute, currentPath }) {
  const activePath = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');

  const isLinkActive = (path) => {
    return isRouteActive(activePath, path);
  };

  const handleNav = (path) => {
    if (onNavigateRoute) {
      onNavigateRoute(path);
    } else {
      window.location.pathname = path;
    }
  };

  return (
    <footer className="footer-section" id="fifth-page">
      <KolamBorder containerClassName="footer-kolam-border" svgClassName="second-page-wave" />

      <div className="footer-container">
        {/* Hero CTA Center Content */}
        <div className="footer-hero">
          <h2 className="footer-title">
            Try <span className="text-highlight">Temple Girl Kids</span> Today!
          </h2>
          <p className="footer-subtitle">Give your child stories to remember.</p>

          <div className="hero-store-buttons">
            <a
              href="https://apps.apple.com/us/app/temple-girl-kids/id6772048283"
              target="_blank"
              rel="noopener noreferrer"
              className="store-btn-link"
            >
              <img src="/appStore.svg" alt="Download on the App Store" className="store-btn-img" width={114} height={38} />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.templegirlkids.templegirl"
              target="_blank"
              rel="noopener noreferrer"
              className="store-btn-link"
            >
              <img src="/googlePlay.svg" alt="Get it on Google Play" className="store-btn-img" width={114} height={38} />
            </a>
            <button
              type="button"
              className="qr-code-btn"
              aria-label="Show QR code to download the app"
              onMouseMove={handleRadialMouseMove}
              onMouseEnter={handleRadialMouseMove}
              onMouseLeave={handleRadialMouseMove}
              onClick={onOpenQrSidebar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="qr-icon" aria-hidden="true">
                <path fill="currentColor" d="M24 10.667H13.34V0H24v10.667Zm-2.665-8h-5.33V8h5.33V2.667ZM24 24H13.34V13.333H24V24Zm-2.665-8h-5.33v5.333h5.33V16ZM10.675 0v10.667H.012V0h10.661ZM2.678 8h5.33V2.667h-5.33V8Zm7.982 5.333H7.996V16h2.665v-2.667ZM7.996 16H5.33v2.667h2.666V16Zm2.665 2.667H7.996v2.666h2.665v-2.666Zm-5.33 0H2.664v2.666H5.33v-2.666Zm-2.666 2.666H0V24h2.665v-2.667Zm5.33 0H5.33V24h2.666v-2.667Zm-2.665-8H2.665V16H5.33v-2.667ZM2.665 16H0v2.667h2.665V16Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Docked Footer Navigation */}
        <nav className="footer-bottom" aria-label="Footer navigation">
          {/* Column 1: Legal & Policies */}
          <div className="footer-nav-col">
            <button
              type="button"
              className={`footer-nav-link ${isLinkActive('/privacy-policy') ? 'active' : ''}`}
              onClick={() => handleNav('/privacy-policy')}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className={`footer-nav-link ${isLinkActive('/website-privacy') ? 'active' : ''}`}
              onClick={() => handleNav('/website-privacy')}
            >
              Website Privacy
            </button>
            <button
              type="button"
              className={`footer-nav-link ${isLinkActive('/delete-account') ? 'active' : ''}`}
              onClick={() => handleNav('/delete-account')}
            >
              Delete Account
            </button>
            <button
              type="button"
              className={`footer-nav-link ${isLinkActive('/terms') ? 'active' : ''}`}
              onClick={() => handleNav('/terms')}
            >
              Terms &amp; Conditions
            </button>
            <button
              type="button"
              className={`footer-nav-link ${isLinkActive('/refund') ? 'active' : ''}`}
              onClick={() => handleNav('/refund')}
            >
              Refund Policy
            </button>
          </div>

          {/* Column 2: Social Links & Subscribe */}
          <div className="footer-nav-col">
            <a href="https://www.instagram.com/thetemplegirl" target="_blank" rel="noopener noreferrer" className="footer-nav-link">Instagram</a>
            <a href="https://www.youtube.com/@thetemplegirl" target="_blank" rel="noopener noreferrer" className="footer-nav-link">YouTube</a>
            <a href="https://www.linkedin.com/in/templegirl/" target="_blank" rel="noopener noreferrer" className="footer-nav-link">LinkedIn</a>
            <a href="https://www.facebook.com/people/The-Temple-Girl/61554364524093/" target="_blank" rel="noopener noreferrer" className="footer-nav-link">Facebook</a>
            <button
              type="button"
              className="footer-nav-link"
              onClick={() => { if (onOpenQrSidebar) onOpenQrSidebar(); }}
            >
              Subscribe
            </button>
          </div>
        </nav>
      </div>
    </footer>
  );
}
