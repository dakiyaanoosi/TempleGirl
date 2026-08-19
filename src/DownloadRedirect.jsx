import { useEffect } from 'react';
import './DownloadRedirect.css';

export default function DownloadRedirect() {
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    // Use maxTouchPoints for iPadOS detection (navigator.platform is deprecated)
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.maxTouchPoints > 1 && /Mac/.test(ua));

    if (isIOS) {
      window.location.href = 'https://apps.apple.com/us/app/temple-girl-kids/id6772048283';
    } else {
      window.location.href = 'https://play.google.com/store/apps/details?id=com.templegirlkids.templegirl';
    }
  }, []);

  return (
    <div className="download-redirect-page">
      <p>Redirecting to store…</p>
    </div>
  );
}
