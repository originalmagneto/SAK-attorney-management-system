'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<string>('');
  
  useEffect(() => {
    // Add window error event listener for uncaught errors
    const handleWindowError = (event: ErrorEvent) => {
      console.error('Window error caught:', event.error);
      setHasError(true);
      setError(event.error);
      setErrorInfo(`Location: ${event.filename}:${event.lineno}:${event.colno}`);
    };

    // Add unhandled rejection listener for promise errors
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setError(new Error(event.reason?.message || 'Unhandled Promise Rejection'));
      setErrorInfo('Unhandled Promise Rejection');
    };

    // Log navigation events to help debug routing issues
    const logRouteChange = (url: string) => {
      console.log(`Route change to: ${url}`);
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  // Function to reset the error state
  const resetError = () => {
    setHasError(false);
    setError(null);
    setErrorInfo('');
    window.location.reload();
  };

  if (hasError) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Detected</AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <p className="font-semibold">Error: {error?.message || 'Unknown error'}</p>
              <p className="text-sm mt-1">{errorInfo}</p>
              <p className="text-sm mt-1">URL: {window.location.href}</p>
              <p className="text-sm mt-1">User Agent: {navigator.userAgent}</p>
              <div className="mt-4">
                <Button onClick={resetError} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

export default ErrorBoundary;