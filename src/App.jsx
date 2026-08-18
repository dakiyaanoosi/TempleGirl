import { useState, useEffect } from 'react';
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
import PrivacyPolicy from './PrivacyPolicy';
import WebsitePrivacyPolicy from './WebsitePrivacyPolicy';
import DeleteAccount from './DeleteAccount';
import Terms from './Terms';
import RefundPolicy from './RefundPolicy';
import Contact from './Contact';

function App() {
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper function to navigate routes
  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Keep route detection reactive on client-side navigation
  useEffect(() => {
    window.onNavigateRoute = navigateTo;
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      delete window.onNavigateRoute;
    };
  }, []);

  if (currentPath.startsWith('/download')) {
    return <DownloadRedirect />;
  }

  if (currentPath === '/contact' || currentPath === '/pages/contact.html' || currentPath.endsWith('/contact.html')) {
    return (
      <main>
        <Contact 
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
        <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ShaderBackground />
      </main>
    );
  }

  if (currentPath === '/refund' || currentPath === '/pages/refund.html' || currentPath.endsWith('/refund.html')) {
    return (
      <main>
        <RefundPolicy 
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
        <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ShaderBackground />
      </main>
    );
  }

  if (currentPath === '/terms' || currentPath === '/pages/terms.html' || currentPath.endsWith('/terms.html')) {
    return (
      <main>
        <Terms 
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
        <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ShaderBackground />
      </main>
    );
  }

  if (currentPath === '/delete-account' || currentPath === '/pages/account-deletion.html' || currentPath.endsWith('/account-deletion.html')) {
    return (
      <main>
        <DeleteAccount 
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
        <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ShaderBackground />
      </main>
    );
  }

  if (currentPath === '/website-privacy' || currentPath === '/pages/website-privacy.html' || currentPath.endsWith('/website-privacy.html')) {
    return (
      <main>
        <WebsitePrivacyPolicy 
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
        <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ShaderBackground />
      </main>
    );
  }

  if (currentPath === '/privacy-policy' || currentPath === '/privacy' || currentPath.endsWith('/privacy.html')) {
    return (
      <main>
        <PrivacyPolicy 
          onOpenQrSidebar={() => setIsSidebarOpen(true)}
          onNavigateHome={() => navigateTo('/')}
          onNavigateRoute={navigateTo}
        />
        <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ShaderBackground />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <Hero onOpenQrSidebar={() => setIsSidebarOpen(true)} />
      <Music onOpenQrSidebar={() => setIsSidebarOpen(true)} />
      <Why />
      <Steps />
      <Reviews />
      <Questions />
      <Footer 
        onOpenQrSidebar={() => setIsSidebarOpen(true)} 
        onNavigateRoute={navigateTo}
      />
      <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ShaderBackground />
    </main>
  );
}

export default App;

