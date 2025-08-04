// Configuration sécurisée pour Electron
// Ce fichier est côté main process (serveur) et n'est pas exposé au client

export interface SecureConfig {
  sentry: {
    dsn: string;
    enabled: boolean;
  };
  github: {
    token?: string;
    enabled: boolean;
  };
  app: {
    name: string;
    version: string;
    environment: string;
  };
}

// Fonction pour charger la configuration de manière sécurisée
export function loadSecureConfig(): SecureConfig {
  const isDev = process.env.NODE_ENV === 'development';
  
  return {
    sentry: {
      dsn: process.env.SENTRY_DSN || '',
      enabled: !isDev && !!process.env.SENTRY_DSN,
    },
    github: {
      token: process.env.GH_TOKEN,
      enabled: !!process.env.GH_TOKEN,
    },
    app: {
      name: 'Letal',
      version: process.env.npm_package_version || '0.0.3',
      environment: process.env.NODE_ENV || 'development',
    },
  };
}

// Fonction pour valider la configuration
export function validateConfig(config: SecureConfig): boolean {
  if (config.sentry.enabled && !config.sentry.dsn) {
    console.error('Sentry enabled but no DSN provided');
    return false;
  }
  
  if (config.github.enabled && !config.github.token) {
    console.error('GitHub enabled but no token provided');
    return false;
  }
  
  return true;
} 