import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/browser';
import { getSentryConfig } from '../config/sentry';

export function initSentry() {
  const config = getSentryConfig();
  
  if (config.enabled) {
    Sentry.init({
      dsn: config.dsn,
      integrations: [
        new BrowserTracing({
          // Définir les routes pour le tracing
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            // Vous pouvez ajouter votre router ici si vous en utilisez un
          ),
        }),
      ],
      // Performance monitoring
      tracesSampleRate: config.tracesSampleRate,
      // Capture des erreurs
      replaysSessionSampleRate: config.replaysSessionSampleRate,
      replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,
      
      // Configuration spécifique pour Electron
      environment: config.environment,
      release: config.release,
      
      // Capture des erreurs non gérées
      beforeSend: config.beforeSend,
      
      // Configuration pour le développement
      debug: config.debug,
    });
  }
}

// Fonction utilitaire pour capturer des erreurs manuellement
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Fonction pour capturer des messages
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

// Fonction pour ajouter du contexte utilisateur
export function setUserContext(userId: string, email?: string) {
  Sentry.setUser({
    id: userId,
    email: email,
  });
}

// Fonction pour ajouter des tags personnalisés
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
} 