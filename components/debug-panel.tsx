'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bug, X, RefreshCw, FileDown } from 'lucide-react';
import clientLogger from '@/lib/client-logger';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    pathname: string;
    asPath: string;
    query: Record<string, string>;
  }>({ pathname: '', asPath: '', query: {} });

  // Update logs periodically
  useEffect(() => {
    if (!isOpen) return;

    const updateLogs = () => {
      setLogs(clientLogger.getLogEntries());
      setRouteInfo({
        pathname: window.location.pathname,
        asPath: window.location.href,
        query: Object.fromEntries(new URLSearchParams(window.location.search))
      });
    };

    // Initial update
    updateLogs();

    // Set up interval for updates
    const interval = setInterval(updateLogs, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Download logs as JSON
  const downloadLogs = () => {
    const logData = JSON.stringify({
      logs,
      routeInfo,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 opacity-70 hover:opacity-100"
        onClick={() => setIsOpen(true)}
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 w-[90vw] max-w-[600px] z-50 shadow-xl border-red-200 dark:border-red-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Bug className="h-5 w-5 mr-2 text-red-500" />
            Debug Panel
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Troubleshooting information for 404 errors and routing issues
        </CardDescription>
      </CardHeader>

      <Tabs defaultValue="route">
        <div className="px-4 pb-2">
          <TabsList className="w-full">
            <TabsTrigger value="route">Route Info</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-0">
          <TabsContent value="route" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Current Route</h3>
                <div className="bg-muted p-2 rounded text-sm">
                  <p><span className="font-mono">pathname:</span> {routeInfo.pathname}</p>
                  <p><span className="font-mono">asPath:</span> {routeInfo.asPath}</p>
                  <p><span className="font-mono">query:</span> {JSON.stringify(routeInfo.query)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-1">Environment</h3>
                <div className="bg-muted p-2 rounded text-sm">
                  <p><span className="font-mono">userAgent:</span> {navigator.userAgent}</p>
                  <p><span className="font-mono">nextjs:</span> {process.env.NEXT_PUBLIC_VERCEL_ENV || 'development'}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-0">
            <ScrollArea className="h-[300px]">
              {logs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No logs recorded yet</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="text-xs border-l-4 pl-2 py-1" 
                      style={{
                        borderLeftColor: log.level === 'error' ? 'var(--red-500)' : 
                                        log.level === 'warn' ? 'var(--yellow-500)' : 
                                        'var(--border)'
                      }}>
                      <div className="flex items-center gap-2">
                        <Badge variant={log.level === 'error' ? 'destructive' : 
                                    log.level === 'warn' ? 'warning' : 'secondary'} 
                              className="text-[10px] h-4">
                          {log.level}
                        </Badge>
                        <span className="font-medium">{log.message}</span>
                      </div>
                      {log.data && (
                        <pre className="mt-1 bg-muted p-1 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {new Date(log.timestamp).toLocaleTimeString()} - {log.pathname}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="network" className="mt-0">
            <div className="text-sm">
              <p className="mb-2">Check browser DevTools Network tab for detailed request information.</p>
              
              <div className="space-y-2">
                <div>
                  <h3 className="font-medium">Common 404 Causes:</h3>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Incorrect route configuration in Next.js</li>
                    <li>Missing redirects in Netlify configuration</li>
                    <li>Client-side navigation to non-existent routes</li>
                    <li>API endpoints not properly configured</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => clientLogger.clearLogEntries()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Logs
          </Button>
          <Button variant="secondary" size="sm" onClick={downloadLogs}>
            <FileDown className="h-4 w-4 mr-2" />
            Download Logs
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
}

export default DebugPanel;