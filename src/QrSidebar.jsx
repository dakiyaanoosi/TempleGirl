import { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import './QrSidebar.css';

export default function QrSidebar({ isOpen, onClose }) {
  const [downloadUrl, setDownloadUrl] = useState('');
  const sidebarRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Shared, reference-counted body scroll lock
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDownloadUrl(`${window.location.origin}/download`);
    }
  }, []);

  // Focus trap + Escape key when sidebar is open
  useEffect(() => {
    if (!isOpen) return;

    // Move focus into the sidebar after CSS transition starts
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = sidebarRef.current?.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`qr-sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={sidebarRef}
        className={`qr-sidebar ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Scan QR code to download Temple Girl Kids"
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="qr-sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <path fill="currentColor" d="M0 0h2.857v2.857H0V0Zm5.714 5.714H2.857V2.857h2.857v2.857Zm2.857 2.857H5.714V5.714h2.857v2.857Zm2.858 0H8.57v2.858H5.714v2.857H2.857v2.857H0V20h2.857v-2.857h2.857v-2.857h2.857v-2.857h2.858v2.857h2.857v2.857h2.857V20H20v-2.857h-2.857v-2.857h-2.857v-2.857h-2.857V8.57Zm2.857-2.857v2.857h-2.857V5.714h2.857Zm2.857-2.857v2.857h-2.857V2.857h2.857Zm0 0V0H20v2.857h-2.857Z" />
          </svg>
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
              Scan the QR code to automatically open the App Store or Google Play, depending on your device.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
