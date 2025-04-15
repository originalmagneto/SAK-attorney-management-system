/**
 * Client-side logging utility to help diagnose routing and rendering issues
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  url: string;
  pathname: string;
};

const MAX_LOG_ENTRIES = 100;
let logEntries: LogEntry[] = [];

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Add a log entry to the in-memory log
 */
function addLogEntry(level: LogLevel, message: string, data?: any): void {
  if (!isBrowser) return;
  
  const entry: LogEntry = {
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    pathname: window.location.pathname,
  };
  
  // Add to in-memory log
  logEntries.push(entry);
  
  // Trim log if it gets too large
  if (logEntries.length > MAX_LOG_ENTRIES) {
    logEntries = logEntries.slice(-MAX_LOG_ENTRIES);
  }
  
  // Also log to console
  switch (level) {
    case 'info':
      console.info(`[CLIENT] ${message}`, data);
      break;
    case 'warn':
      console.warn(`[CLIENT] ${message}`, data);
      break;
    case 'error':
      console.error(`[CLIENT] ${message}`, data);
      break;
    case 'debug':
      console.debug(`[CLIENT] ${message}`, data);
      break;
  }
}

/**
 * Log an informational message
 */
export function logInfo(message: string, data?: any): void {
  addLogEntry('info', message, data);
}

/**
 * Log a warning message
 */
export function logWarning(message: string, data?: any): void {
  addLogEntry('warn', message, data);
}

/**
 * Log an error message
 */
export function logError(message: string, data?: any): void {
  addLogEntry('error', message, data);
}

/**
 * Log a debug message
 */
export function logDebug(message: string, data?: any): void {
  addLogEntry('debug', message, data);
}

/**
 * Get all log entries
 */
export function getLogEntries(): LogEntry[] {
  return [...logEntries];
}

/**
 * Clear all log entries
 */
export function clearLogEntries(): void {
  logEntries = [];
}

/**
 * Initialize route change logging
 */
export function initRouteChangeLogging(): void {
  if (!isBrowser) return;
  
  // Log initial page load
  logInfo('Page loaded', { referrer: document.referrer });
  
  // Track history changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    logInfo('Navigation: pushState', { from: document.location.pathname, to: args[2] });
    return originalPushState.apply(this, args);
  };
  
  history.replaceState = function(...args) {
    logInfo('Navigation: replaceState', { from: document.location.pathname, to: args[2] });
    return originalReplaceState.apply(this, args);
  };
  
  // Track popstate events (back/forward navigation)
  window.addEventListener('popstate', () => {
    logInfo('Navigation: popstate', { location: document.location.pathname });
  });
}

/**
 * Initialize error logging
 */
export function initErrorLogging(): void {
  if (!isBrowser) return;
  
  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    logError('Unhandled error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError('Unhandled promise rejection', {
      reason: event.reason?.message || event.reason,
      stack: event.reason?.stack
    });
  });
}

/**
 * Initialize all logging
 */
export function initLogging(): void {
  initRouteChangeLogging();
  initErrorLogging();
}

// Export a default object with all functions
const clientLogger = {
  logInfo,
  logWarning,
  logError,
  logDebug,
  getLogEntries,
  clearLogEntries,
  initRouteChangeLogging,
  initErrorLogging,
  initLogging
};

export default clientLogger;