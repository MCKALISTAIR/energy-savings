import { supabase } from '@/integrations/supabase/client';
import { navigateToError } from './errorNavigation';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

interface SupabaseResponse {
  data?: any;
  error?: any;
}

export const apiFetch = async (
  functionName: string, 
  body?: any,
  options: { throwOnError?: boolean; redirectOnError?: boolean } = {}
): Promise<any> => {
  const { throwOnError = true, redirectOnError = false } = options;
  
  try {
    const { data, error }: SupabaseResponse = await supabase.functions.invoke(functionName, {
      body
    });

    if (error) {
      const apiError: ApiError = new Error(error.message || 'API request failed');
      apiError.status = error.status;
      apiError.code = error.code;
      
      if (redirectOnError) {
        navigateToErrorWithQuery(`API Error: ${apiError.message}`);
        return null;
      }
      
      if (throwOnError) {
        throw apiError;
      }
      
      return { success: false, error: apiError };
    }

    if (data && !data.success && data.error) {
      const apiError: ApiError = new Error(data.error);
      
      if (redirectOnError) {
        navigateToErrorWithQuery(`API Error: ${apiError.message}`);
        return null;
      }
      
      if (throwOnError) {
        throw apiError;
      }
      
      return { success: false, error: apiError };
    }

    return data;
  } catch (error) {
    const apiError: ApiError = error instanceof Error ? error : new Error('Unknown API error');
    
    if (redirectOnError) {
      navigateToErrorWithQuery(`Network Error: ${apiError.message}`);
      return null;
    }
    
    if (throwOnError) {
      throw apiError;
    }
    
    return { success: false, error: apiError };
  }
};

// Direct database query with error handling
export const dbQuery = async (
  queryFn: () => Promise<any>,
  options: { throwOnError?: boolean; redirectOnError?: boolean } = {}
): Promise<any> => {
  const { throwOnError = true, redirectOnError = false } = options;
  
  try {
    const result = await queryFn();
    
    if (result.error) {
      const dbError: ApiError = new Error(result.error.message || 'Database query failed');
      dbError.code = result.error.code;
      
      if (redirectOnError) {
        navigateToErrorWithQuery(`Database Error: ${dbError.message}`);
        return null;
      }
      
      if (throwOnError) {
        throw dbError;
      }
      
      return { success: false, error: dbError };
    }
    
    return result.data;
  } catch (error) {
    const dbError: ApiError = error instanceof Error ? error : new Error('Unknown database error');
    
    if (redirectOnError) {
      navigateToErrorWithQuery(`Database Error: ${dbError.message}`);
      return null;
    }
    
    if (throwOnError) {
      throw dbError;
    }
    
    return { success: false, error: dbError };
  }
};

function navigateToErrorWithQuery(message: string) {
  window.location.href = `/error?msg=${encodeURIComponent(message)}`;
}