import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './Header';
import ShaderBackground from './ShaderBackground';
import Hero from './Hero';
import Music from './Music';
import Why from './Why';
import Steps from './Steps';
import Reviews from './Reviews';
import Questions from './Questions';
import Footer from './Footer';
import QrSidebar from './QrSidebar';
import DownloadRedirect from './DownloadRedirect';
import SmoothScroll from './SmoothScroll';
import { NavigationContext } from './NavigationContext';

// Route-level components: lazy-loaded so the home-page bundle stays lean.
// Only downloaded when the user actually navigates to that route.
const PrivacyPolicy      = lazy(() => import('./PrivacyPolicy'));
const WebsitePrivacyPolicy = lazy(() => import('./WebsitePrivacyPolicy'));
const DeleteAccount      = lazy(() => import('./DeleteAccount'));
const Terms              = lazy(() => import('./Terms'));
const RefundPolicy       = lazy(() => import('./RefundPolicy'));
const Contact            = lazy(() => import('./Contact'));
const ManageSubscription = lazy(() => import('./ManageSubscription'));

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '60vh', color: 'rgba(255,255,255,0.5)',
    fontFamily: "'Manrope', sans-serif", fontSize: '1rem',
  }}>
    Loading…
  </div>
);

function App() {
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation function — shared via context, no more window.onNavigateRoute
  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Keep route detection reactive on browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath.startsWith('/download')) {
    return <DownloadRedirect />;
  }

  const renderPage = () => {
    if (currentPath === '/contact' || currentPath === '/pages/contact.html' || currentPath.endsWith('/contact.html')) {
      return (
        <Contact
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (currentPath === '/refund' || currentPath === '/pages/refund.html' || currentPath.endsWith('/refund.html')) {
      return (
        <RefundPolicy
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (currentPath === '/terms' || currentPath === '/pages/terms.html' || currentPath.endsWith('/terms.html')) {
      return (
        <Terms
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (currentPath === '/delete-account' || currentPath === '/pages/account-deletion.html' || currentPath.endsWith('/account-deletion.html')) {
      return (
        <DeleteAccount
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (currentPath === '/website-privacy' || currentPath === '/pages/website-privacy.html' || currentPath.endsWith('/website-privacy.html')) {
      return (
        <WebsitePrivacyPolicy
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (currentPath === '/privacy-policy' || currentPath === '/privacy' || currentPath.endsWith('/privacy.html')) {
      return (
        <PrivacyPolicy
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (currentPath === '/manage-subscription' || currentPath === '/pages/manage-subscription' || currentPath === '/pages/manage-subscription.html' || currentPath.endsWith('/manage-subscription.html')) {
      return (
        <ManageSubscription
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    return (
      <>
        <Hero onOpenQrSidebar={() => setIsSidebarOpen(true)} />
        <Music onOpenQrSidebar={() => setIsSidebarOpen(true)} />
        <Why />
        <Steps />
        <Reviews />
        <Questions onNavigateRoute={navigateTo} />
        <Footer
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateRoute={navigateTo}
          currentPath={currentPath}
        />
      </>
    );
  };

  return (
    <NavigationContext.Provider value={navigateTo}>
      <SmoothScroll currentPath={currentPath}>
        {/* Skip navigation — hidden until focused by keyboard users (WCAG 2.4.1) */}
        <a href="#main-content" className="skip-link">Skip to main content</a>

        <Header currentPath={currentPath} />

        <main id="main-content">
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </main>

        <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ShaderBackground />
      </SmoothScroll>
    </NavigationContext.Provider>
  );
}

export default App;
