import React from 'react';
import * as Sentry from '@sentry/react';
import { captureError } from '../utils/sentry';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Capturer l'erreur dans Sentry
    captureError(error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      // Fallback par défaut
      return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-red-400">Oups ! Quelque chose s'est mal passé</h2>
            <p className="text-white/70">
              Une erreur inattendue s'est produite. L'équipe technique a été notifiée.
            </p>
            <button
              onClick={this.resetError}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
            >
              Réessayer
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-white/50 hover:text-white/70">
                  Détails de l'erreur (développement)
                </summary>
                <pre className="mt-2 p-4 bg-black/20 rounded text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper Sentry pour l'Error Boundary
export const SentryErrorBoundary = Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: ({ error, resetError }) => (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md mx-auto p-6">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-2xl font-bold text-red-400">Oups ! Quelque chose s'est mal passé</h2>
        <p className="text-white/70">
          Une erreur inattendue s'est produite. L'équipe technique a été notifiée.
        </p>
        <button
          onClick={resetError}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  ),
});

export default ErrorBoundary; 