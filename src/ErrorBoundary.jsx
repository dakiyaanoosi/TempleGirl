import { Component } from 'react';
import './ErrorBoundary.css';

/**
 * Top-level error boundary. Catches any unhandled runtime error in the React
 * tree and renders a graceful fallback instead of a blank white screen.
 *
 * Error reporting: swap console.error for Sentry.captureException(error, { extra: info })
 * when an observability platform is added.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
    // TODO: Sentry.captureException(error, { extra: info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1 className="error-boundary__title">Something went wrong</h1>
          <p className="error-boundary__message">
            An unexpected error occurred. Please refresh the page to continue.
          </p>
          <button
            className="error-boundary__btn"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
