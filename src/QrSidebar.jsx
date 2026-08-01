import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { X } from 'lucide-react';
import './QrSidebar.css';

export default function QrSidebar({ isOpen, onClose }) {
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDownloadUrl(`${window.location.origin}/download`);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`qr-sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`qr-sidebar ${isOpen ? 'open' : ''}`} aria-label="QR Code Sidebar">
        <button
          type="button"
          className="qr-sidebar-close"
          onClick={onClose}
          aria-label="Close Sidebar"
        >
          <X size={26} strokeWidth={1.8} />
        </button>

        <div className="qr-sidebar-content">
          <h2 className="qr-sidebar-title">
            Scan the<br />
            QR Code
          </h2>

          <p className="qr-sidebar-description">
            Trusted by over 2 million families, Temple Girl Kids transforms India's temple stories into warm, screen-free bedtime experiences. Scan below to get started.
          </p>

          <div className="qr-sidebar-card">
            <div className="qr-code-wrapper">
              {downloadUrl && (
                <QRCode
                  value={downloadUrl}
                  size={140}
                  bgColor="transparent"
                  fgColor="#000000"
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                />
              )}
            </div>
            <p className="qr-card-text">
              Scan the QR code on the left to automatically open the App Store or Google Play, depending on your device.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
