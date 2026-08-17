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
    return <DownloadRedirect />;
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
      <Footer onOpenQrSidebar={() => setIsSidebarOpen(true)} />
      <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ShaderBackground />
    </main>
  );
}

export default App;
