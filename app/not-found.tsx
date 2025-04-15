'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  useEffect(() => {
    // Log detailed information about the 404 error
    console.error('404 Not Found Error', {
      url: window.location.href,
      pathname: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="mb-6 p-4 rounded-full bg-amber-100 dark:bg-amber-900">
        <AlertTriangle className="h-12 w-12 text-amber-600 dark:text-amber-300" />
      </div>
      
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
        This information has been logged to help diagnose routing issues.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => {
            // Log the navigation attempt
            console.log('User attempted to go back from 404 page');
            window.history.back();
          }}
        >
          Go Back
        </Button>
      </div>
      
      <div className="mt-8 p-4 border border-border rounded-md bg-muted/50 text-left max-w-lg">
        <h3 className="font-medium mb-2">Debug Information:</h3>
        <pre className="text-xs overflow-auto p-2 bg-background rounded">
          {`URL: ${typeof window !== 'undefined' ? window.location.href : ''}
Path: ${typeof window !== 'undefined' ? window.location.pathname : ''}
Time: ${new Date().toISOString()}`}
        </pre>
      </div>
    </div>
  );
}