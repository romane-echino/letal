// Configuration Sentry selon l'environnement
export const SENTRY_CONFIG = {
  // Utiliser une variable d'environnement qui n'est disponible qu'au build
  dsn: import.meta.env.VITE_SENTRY_DSN || 'VOTRE_DSN_SENTRY_ICI',
  
  // Configuration selon l'environnement
  environment: process.env.NODE_ENV || 'development',
  
  // Version de l'application
  release: process.env.npm_package_version || '0.0.3',
  
  // Activer Sentry seulement en production
  enabled: process.env.NODE_ENV === 'production',
  
  // Configuration pour le développement
  debug: process.env.NODE_ENV === 'development',
  
  // Sample rates
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
};

// Fonction pour obtenir la configuration selon l'environnement
export function getSentryConfig() {
  return {
    ...SENTRY_CONFIG,
    // Ajouter des configurations spécifiques selon l'environnement
    beforeSend(event: any) {
      // Filtrer les erreurs en développement si nécessaire
      if (process.env.NODE_ENV === 'development') {
        // Vous pouvez ajouter des filtres ici
        return event;
      }
      return event;
    },
  };
} 