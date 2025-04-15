'use client';

import { useEffect } from 'react';
import clientLogger from '@/lib/client-logger';

/**
 * Component that initializes client-side logging
 * This should be included in the app layout to ensure logging is available throughout the application
 */
export function LoggingInitializer() {
  useEffect(() => {
    // Initialize all logging functionality
    clientLogger.initLogging();
    
    // Log initial render
    clientLogger.logInfo('LoggingInitializer mounted', {
      url: window.location.href,
      pathname: window.location.pathname
    });
    
    // Add specific logging for 404 errors
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);
      
      // Log 404 responses
      if (response.status === 404) {
        clientLogger.logError('Fetch 404 error', {
          url: args[0],
          pathname: window.location.pathname,
          responseUrl: response.url
        });
      }
      
      return response;
    };
    
    return () => {
      // Restore original fetch when component unmounts
      window.fetch = originalFetch;
      clientLogger.logInfo('LoggingInitializer unmounted');
    };
  }, []);

  // This component doesn't render anything
  return null;
}

export default LoggingInitializer;