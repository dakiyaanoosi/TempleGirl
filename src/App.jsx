import { useState, useEffect } from 'react';
import Header from './Header';
import ShaderBackground from './ShaderBackground';
import Hero from './Hero';
import SecondPage from './SecondPage';
import ThirdPage from './ThirdPage';
import QrSidebar from './QrSidebar';
import DownloadRedirect from './DownloadRedirect';

function App() {
  const [isDownloadRoute, setIsDownloadRoute] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/download' || window.location.pathname === '/download/') {
      setIsDownloadRoute(true);
    }
  }, []);

  if (isDownloadRoute) {
    return <DownloadRedirect />;
  }

  return (
    <main>
      <Header />
      <Hero onOpenQrSidebar={() => setIsSidebarOpen(true)} />
      <SecondPage onOpenQrSidebar={() => setIsSidebarOpen(true)} />
      <ThirdPage />
      <QrSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ShaderBackground />
    </main>
  );
}

export default App;
