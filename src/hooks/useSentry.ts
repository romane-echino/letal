import { useCallback } from 'react';
import { captureError, captureMessage, setUserContext, setTag } from '../utils/sentry';

export function useSentry() {
  const logError = useCallback((error: Error, context?: Record<string, any>) => {
    captureError(error, context);
  }, []);

  const logMessage = useCallback((message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    captureMessage(message, level);
  }, []);

  const setUser = useCallback((userId: string, email?: string) => {
    setUserContext(userId, email);
  }, []);

  const addTag = useCallback((key: string, value: string) => {
    setTag(key, value);
  }, []);

  const logUserAction = useCallback((action: string, details?: Record<string, any>) => {
    captureMessage(`User Action: ${action}`, 'info');
    if (details) {
      // Vous pouvez ajouter des tags ou du contexte supplémentaire ici
      Object.entries(details).forEach(([key, value]) => {
        addTag(`action_${key}`, String(value));
      });
    }
  }, [addTag]);

  return {
    logError,
    logMessage,
    setUser,
    addTag,
    logUserAction,
  };
} 