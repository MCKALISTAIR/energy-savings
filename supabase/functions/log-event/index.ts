import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface LogEvent {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  details?: any;
  source: 'error_boundary' | 'global_handler' | 'api_fetch' | 'manual';
  stack_trace?: string;
  url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { level, message, details, source, stack_trace, url }: LogEvent = await req.json();

    // Basic validation
    if (!level || !message || !source) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: level, message, source' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authorization header to extract user info if available
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      try {
        // Create a client with the user's token to get their info
        const userSupabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: {
                authorization: authHeader
              }
            }
          }
        );
        
        const { data: { user } } = await userSupabase.auth.getUser();
        if (user) {
          userId = user.id;
        }
      } catch (error) {
        console.warn('Could not extract user from auth header:', error);
      }
    }

    // Extract additional context from headers
    const userAgent = req.headers.get('user-agent') || '';
    const sessionId = req.headers.get('x-session-id') || null;

    // Sanitize sensitive data from details
    const sanitizedDetails = details ? sanitizeDetails(details) : null;

    // Insert log entry using service role
    const { error } = await supabase
      .from('app_logs')
      .insert({
        level,
        message: message.substring(0, 1000), // Limit message length
        details: sanitizedDetails,
        user_id: userId,
        session_id: sessionId,
        user_agent: userAgent.substring(0, 500), // Limit user agent length
        url: url?.substring(0, 500), // Limit URL length
        source,
        stack_trace: stack_trace?.substring(0, 5000), // Limit stack trace length
      });

    if (error) {
      console.error('Failed to insert log:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in log-event function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to sanitize sensitive data
function sanitizeDetails(details: any): any {
  if (!details || typeof details !== 'object') {
    return details;
  }

  const sanitized = { ...details };
  
  // Remove sensitive fields
  const sensitiveFields = [
    'password', 'token', 'secret', 'key', 'authorization',
    'cookie', 'session', 'credit_card', 'ssn', 'email'
  ];

  function sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitizeObject);

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveFields.some(field => lowerKey.includes(field));
      
      if (isSensitive) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        result[key] = sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return sanitizeObject(sanitized);
}