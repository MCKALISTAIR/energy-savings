import { NavigateFunction } from 'react-router-dom';

export const navigateToError = (navigate: NavigateFunction, message?: string) => {
  navigate('/error', { 
    state: { message: message || 'An unexpected error occurred' } 
  });
};

export const navigateToErrorWithQuery = (message: string) => {
  window.location.href = `/error?msg=${encodeURIComponent(message)}`;
};