import { useEffect } from 'react';
import { APP_STORE_URL, PLAY_STORE_URL } from './config';
import './DownloadRedirect.css';

export default function DownloadRedirect() {
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    // Use maxTouchPoints for iPadOS detection (navigator.platform is deprecated)
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.maxTouchPoints > 1 && /Mac/.test(ua));

    if (isIOS) {
      window.location.href = APP_STORE_URL;
    } else {
      window.location.href = PLAY_STORE_URL;
    }
  }, []);

  return (
    <div className="download-redirect-page">
      <p>Redirecting to store…</p>
    </div>
  );
}
