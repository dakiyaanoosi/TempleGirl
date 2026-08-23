import { useEffect } from 'react';
import './NotFound.css';

export default function NotFound() {
  useEffect(() => {
    document.title = "404 — Page Not Found";
  }, []);

  return (
    <div className="minimal-404-container">
      <h1 className="minimal-404-text">404</h1>
    </div>
  );
}
