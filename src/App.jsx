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
    height: '60vh', color: 'rgba(255,255,255,0.85)',
    fontFamily: "'Manrope', sans-serif", fontSize: '1rem',
  }}>
    Loading…
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
