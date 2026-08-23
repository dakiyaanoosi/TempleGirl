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
import CheckoutModal from './CheckoutModal';
import DownloadRedirect from './DownloadRedirect';
import SmoothScroll from './SmoothScroll';
import BlurFocusTransition from './BlurFocusTransition';
import { useBlurFocusNavigation, BlurFocusContext } from './BlurFocusContext';
import { NavigationContext } from './NavigationContext';

import { ROUTES, isRouteActive, isValidRoute } from './utils/routes';
import NotFound from './NotFound';

// Route-level components: lazy-loaded with explicit preloading helpers
const loadPrivacyPolicy      = () => import('./PrivacyPolicy');
const loadWebsitePrivacyPolicy = () => import('./WebsitePrivacyPolicy');
const loadDeleteAccount      = () => import('./DeleteAccount');
const loadTerms              = () => import('./Terms');
const loadRefundPolicy       = () => import('./RefundPolicy');
const loadContact            = () => import('./Contact');
const loadSubscribe          = () => import('./Subscribe');
const loadManageSubscription = () => import('./ManageSubscription');

const PrivacyPolicy      = lazy(loadPrivacyPolicy);
const WebsitePrivacyPolicy = lazy(loadWebsitePrivacyPolicy);
const DeleteAccount      = lazy(loadDeleteAccount);
const Terms              = lazy(loadTerms);
const RefundPolicy       = lazy(loadRefundPolicy);
const Contact            = lazy(loadContact);
const Subscribe          = lazy(loadSubscribe);
const ManageSubscription = lazy(loadManageSubscription);

// Helper function to pre-fetch all lazy route chunks in background
const preloadAllRoutes = () => {
  loadPrivacyPolicy().catch(() => {});
  loadWebsitePrivacyPolicy().catch(() => {});
  loadDeleteAccount().catch(() => {});
  loadTerms().catch(() => {});
  loadRefundPolicy().catch(() => {});
  loadContact().catch(() => {});
  loadSubscribe().catch(() => {});
  loadManageSubscription().catch(() => {});
};

const PageLoader = () => (
  <div className="page-loader">
    <div className="page-loader-spinner" />
  </div>
);

function AppInner({ currentPath, performDirectNavigate }) {
  const triggerTransition = useBlurFocusNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlanKey, setCheckoutPlanKey] = useState('annual');

  const isKnownRoute = isValidRoute(currentPath);

  const navigateTo = useCallback((path) => {
    if (triggerTransition) {
      triggerTransition(path);
    } else {
      performDirectNavigate(path);
    }
  }, [triggerTransition, performDirectNavigate]);

  const handleOpenCheckout = (planKey = 'annual') => {
    setCheckoutPlanKey(planKey);
    setIsCheckoutOpen(true);
  };

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

    if (isRouteActive(currentPath, ROUTES.SUBSCRIBE)) {
      return (
        <Subscribe
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
          onOpenCheckoutModal={handleOpenCheckout}
        />
      );
    }

    if (isRouteActive(currentPath, ROUTES.MANAGE_SUBSCRIPTION)) {
      return (
        <ManageSubscription
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
          onOpenCheckoutModal={handleOpenCheckout}
        />
      );
    }

    if (isRouteActive(currentPath, ROUTES.HOME)) {
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
    }

    // Default fallback for any undefined/unrecognized URL path (404 Lost Path)
    return <NotFound />;
  };

  return (
    <NavigationContext.Provider value={navigateTo}>
      {isKnownRoute && <Header currentPath={currentPath} />}

      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </main>

      {isKnownRoute && <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planKey={checkoutPlanKey}
        onSuccess={() => {
          // On subscription success, navigate to Manage Subscription
          navigateTo('/manage-subscription');
        }}
      />
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
