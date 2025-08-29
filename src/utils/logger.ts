import { supabase } from '@/integrations/supabase/client';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';
type LogSource = 'error_boundary' | 'global_handler' | 'api_fetch' | 'manual';

interface LogOptions {
  details?: any;
  stackTrace?: string;
  url?: string;
}

class Logger {
  private enabled = true;

  async log(level: LogLevel, message: string, source: LogSource, options: LogOptions = {}) {
    if (!this.enabled) return;

    // Always log to console first
    const consoleMethod = level === 'error' ? console.error : 
                         level === 'warn' ? console.warn : 
                         level === 'info' ? console.info : console.debug;
    
    consoleMethod(`[${source.toUpperCase()}] ${message}`, options.details || '');

    try {
      // Get current URL if not provided
      const currentUrl = options.url || window.location.href;
      
      // Get session ID from sessionStorage if available
      const sessionId = sessionStorage.getItem('session_id') || 
                       crypto.randomUUID(); // Generate one if not exists
      
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', sessionId);
      }

      // Call the edge function to log the event
      const { error } = await supabase.functions.invoke('log-event', {
        body: {
          level,
          message,
          details: options.details,
          source,
          stack_trace: options.stackTrace,
          url: currentUrl,
        },
        headers: {
          'x-session-id': sessionId,
        }
      });

      if (error) {
        console.warn('Failed to log to backend:', error);
      }
    } catch (error) {
      console.warn('Logger failed to send to backend:', error);
    }
  }

  logError(message: string, source: LogSource, options: LogOptions = {}) {
    return this.log('error', message, source, options);
  }

  logWarn(message: string, source: LogSource, options: LogOptions = {}) {
    return this.log('warn', message, source, options);
  }

  logInfo(message: string, source: LogSource, options: LogOptions = {}) {
    return this.log('info', message, source, options);
  }

  logDebug(message: string, source: LogSource, options: LogOptions = {}) {
    return this.log('debug', message, source, options);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const logger = new Logger();