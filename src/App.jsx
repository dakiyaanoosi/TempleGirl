import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
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
import BlurFocusTransition from './BlurFocusTransition';
import { useBlurFocusNavigation, BlurFocusContext } from './BlurFocusContext';
import { NavigationContext } from './NavigationContext';

import { ROUTES, isRouteActive } from './utils/routes';

// Route-level components: lazy-loaded with explicit preloading helpers
const loadPrivacyPolicy      = () => import('./PrivacyPolicy');
const loadWebsitePrivacyPolicy = () => import('./WebsitePrivacyPolicy');
const loadDeleteAccount      = () => import('./DeleteAccount');
const loadTerms              = () => import('./Terms');
const loadRefundPolicy       = () => import('./RefundPolicy');
const loadContact            = () => import('./Contact');
const loadManageSubscription = () => import('./ManageSubscription');

const PrivacyPolicy      = lazy(loadPrivacyPolicy);
const WebsitePrivacyPolicy = lazy(loadWebsitePrivacyPolicy);
const DeleteAccount      = lazy(loadDeleteAccount);
const Terms              = lazy(loadTerms);
const RefundPolicy       = lazy(loadRefundPolicy);
const Contact            = lazy(loadContact);
const ManageSubscription = lazy(loadManageSubscription);

// Helper function to pre-fetch all lazy route chunks in background
const preloadAllRoutes = () => {
  loadPrivacyPolicy().catch(() => {});
  loadWebsitePrivacyPolicy().catch(() => {});
  loadDeleteAccount().catch(() => {});
  loadTerms().catch(() => {});
  loadRefundPolicy().catch(() => {});
  loadContact().catch(() => {});
  loadManageSubscription().catch(() => {});
};

const PageLoader = () => (
  <div className="page-loader" style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '60vh',
  }}>
    <div style={{
      width: '36px', height: '36px',
      border: '3px solid rgba(242,184,75,0.2)',
      borderTop: '3px solid #F2B84B',
      borderRadius: '50%',
      animation: 'page-loader-spin 0.75s linear infinite',
    }} />
    <style>{`@keyframes page-loader-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function AppInner({ currentPath, performDirectNavigate }) {
  const triggerTransition = useBlurFocusNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigateTo = useCallback((path) => {
    if (triggerTransition) {
      triggerTransition(path);
    } else {
      performDirectNavigate(path);
    }
  }, [triggerTransition, performDirectNavigate]);

  const renderPage = () => {
    if (isRouteActive(currentPath, ROUTES.CONTACT)) {
      return (
        <Contact
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (isRouteActive(currentPath, ROUTES.REFUND)) {
      return (
        <RefundPolicy
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (isRouteActive(currentPath, ROUTES.TERMS)) {
      return (
        <Terms
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (isRouteActive(currentPath, ROUTES.DELETE_ACCOUNT)) {
      return (
        <DeleteAccount
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (isRouteActive(currentPath, ROUTES.WEBSITE_PRIVACY)) {
      return (
        <WebsitePrivacyPolicy
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (isRouteActive(currentPath, ROUTES.PRIVACY)) {
      return (
        <PrivacyPolicy
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
      );
    }

    if (isRouteActive(currentPath, ROUTES.MANAGE_SUBSCRIPTION)) {
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
      {/* Skip navigation — hidden until focused by keyboard users (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Header currentPath={currentPath} />

      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </main>

      <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </NavigationContext.Provider>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname
  );

  // Preload all lazy route JS chunks in background right after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      preloadAllRoutes();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Keep React state in sync when browser Back/Forward buttons are used.
  // Without this, history.pushState updates the URL but React's currentPath
  // state diverges from window.location.pathname.
  useEffect(() => {
    const handlePop = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const performDirectNavigate = useCallback((path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  }, []);

  if (currentPath.startsWith('/download')) {
    return <DownloadRedirect />;
  }

  return (
    <SmoothScroll currentPath={currentPath}>
      <ShaderBackground />
      <BlurFocusTransition currentPath={currentPath} onNavigate={performDirectNavigate}>
        <AppInner currentPath={currentPath} performDirectNavigate={performDirectNavigate} />
      </BlurFocusTransition>
    </SmoothScroll>
  );
}

export default App;
