'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log detailed information about the error
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      url: window.location.href,
      pathname: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="mb-6 p-4 rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertOctagon className="h-12 w-12 text-red-600 dark:text-red-400" />
      </div>
      
      <h1 className="text-4xl font-bold mb-2">Something went wrong</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We've encountered an error while loading this page.
        The error has been logged to help diagnose the issue.
      </p>
      
      <Button 
        onClick={() => {
          console.log('User attempted to reset error page');
          reset();
        }}
        className="mb-4"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try again
      </Button>
      
      <div className="mt-4 p-4 border border-border rounded-md bg-muted/50 text-left max-w-lg">
        <h3 className="font-medium mb-2">Error Details:</h3>
        <pre className="text-xs overflow-auto p-2 bg-background rounded">
          {`Message: ${error.message}
Digest: ${error.digest || 'N/A'}
URL: ${window.location.href}
Time: ${new Date().toISOString()}`}
        </pre>
      </div>
    </div>
  );
}