import { navigateToErrorWithQuery } from './errorNavigation';
import { logger } from './logger';

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Log to our centralized logging system
    logger.logError(
      `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
      'global_handler',
      {
        details: {
          reason: event.reason,
          stack: event.reason?.stack,
          type: 'unhandledrejection'
        },
        stackTrace: event.reason?.stack
      }
    );
    
    // Check if it's a network error or API error
    const error = event.reason;
    const isNetworkError = error?.name === 'TypeError' && error?.message?.includes('fetch');
    const isApiError = error?.status >= 400;
    
    if (isNetworkError || isApiError) {
      event.preventDefault(); // Prevent default browser error handling
      
      const message = isNetworkError 
        ? 'Network connection error. Please check your internet connection.' 
        : `API Error (${error.status}): ${error.message || 'Unknown error'}`;
        
      navigateToErrorWithQuery(message);
    }
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Log to our centralized logging system
    logger.logError(
      `Global JavaScript Error: ${event.error?.message || event.message}`,
      'global_handler',
      {
        details: {
          error: event.error,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'javascript_error'
        },
        stackTrace: event.error?.stack
      }
    );
    
    // Only redirect for certain types of critical errors
    if (event.error?.name === 'ChunkLoadError' || 
        event.error?.message?.includes('Loading chunk') ||
        event.error?.message?.includes('Loading CSS chunk')) {
      event.preventDefault();
      navigateToErrorWithQuery('Application loading error. Please refresh the page.');
    }
  });
};

// Cleanup function for testing or unmounting
export const cleanupGlobalErrorHandling = () => {
  // Note: In a real app, you'd store the listeners and remove them
  // For now, we'll keep it simple since this is typically set up once
};
