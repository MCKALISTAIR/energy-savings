import { navigateToErrorWithQuery } from './errorNavigation';

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
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
