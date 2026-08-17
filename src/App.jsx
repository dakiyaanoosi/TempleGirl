import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './Header';
import ShaderBackground from './ShaderBackground';
import Hero from './Hero';
import Music from './Music';
import Why from './Why';
import Steps from './Steps';

const Reviews = lazy(() => import('./Reviews'));
const Questions = lazy(() => import('./Questions'));
const Footer = lazy(() => import('./Footer'));
const QrSidebar = lazy(() => import('./QrSidebar'));
const DownloadRedirect = lazy(() => import('./DownloadRedirect'));

function App() {
  const [isDownloadRoute, setIsDownloadRoute] = useState(
    () => window.location.pathname.startsWith('/download')
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Keep route detection reactive on client-side navigation
  useEffect(() => {
    const handlePopState = () => {
      setIsDownloadRoute(window.location.pathname.startsWith('/download'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isDownloadRoute) {
    return (
      <Suspense fallback={null}>
        <DownloadRedirect />
      </Suspense>
    );
  }

  return (
    <main>
      <Header />
      <Hero onOpenQrSidebar={() => setIsSidebarOpen(true)} />
      <Music onOpenQrSidebar={() => setIsSidebarOpen(true)} />
      <Why />
      <Steps />
      <Suspense fallback={null}>
        <Reviews />
        <Questions />
        <Footer onOpenQrSidebar={() => setIsSidebarOpen(true)} />
        <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </Suspense>
      <ShaderBackground />
    </main>
  );
}

export default App;
