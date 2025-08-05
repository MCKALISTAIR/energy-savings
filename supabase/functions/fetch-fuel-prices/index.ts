import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Fetch Fuel Prices Function Started ===');
    
    // For now, let's return a simple test response to verify the function works
    console.log('Returning test data...');
    
    const testResponse = {
      price: 1.449,
      date: new Date().toISOString().split('T')[0],
      source: 'Test Data - UK Government Weekly Road Fuel Prices',
      message: 'This is test data to verify the function works'
    };
    
    console.log('Test response:', testResponse);
    
    return new Response(JSON.stringify(testResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Function error',
      details: error.message,
      fallbackPrice: 1.45,
      message: 'Using fallback due to function error'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});