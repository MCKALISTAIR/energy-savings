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
    
    // Fetch UK fuel prices from GOV.UK data
    console.log('Fetching UK fuel prices from gov.uk...');
    
    const ukFuelPricesUrl = 'https://www.gov.uk/government/statistics/weekly-road-fuel-prices';
    
    try {
      // Fetch the GOV.UK page
      const response = await fetch(ukFuelPricesUrl);
      const html = await response.text();
      
      // Extract CSV download link
      const csvLinkMatch = html.match(/href="([^"]*road-fuel-prices[^"]*\.csv)"/);
      
      if (csvLinkMatch) {
        const csvUrl = csvLinkMatch[1].startsWith('http') 
          ? csvLinkMatch[1] 
          : `https://www.gov.uk${csvLinkMatch[1]}`;
        
        console.log('Found CSV URL:', csvUrl);
        
        // Fetch the CSV data
        const csvResponse = await fetch(csvUrl);
        const csvText = await csvResponse.text();
        
        // Parse CSV to get latest prices
        const lines = csvText.split('\n');
        const dataLines = lines.slice(1).filter(line => line.trim()); // Skip header
        
        if (dataLines.length > 0) {
          // Get the most recent entry (last line)
          const lastEntry = dataLines[dataLines.length - 1];
          const columns = lastEntry.split(',');
          
          // CSV format: Date, ULSP (petrol), ULSD (diesel), etc.
          const date = columns[0]?.replace(/"/g, '');
          const petrolPrice = parseFloat(columns[1]?.replace(/"/g, '')) || null;
          const dieselPrice = parseFloat(columns[2]?.replace(/"/g, '')) || null;
          
          if (petrolPrice && dieselPrice) {
            const response = {
              petrol: petrolPrice,
              diesel: dieselPrice,
              date: date,
              source: 'UK Government Weekly Road Fuel Prices',
              csvUrl: csvUrl
            };
            
            console.log('Parsed fuel prices:', response);
            
            return new Response(JSON.stringify(response), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      }
    } catch (fetchError) {
      console.error('Error fetching from gov.uk:', fetchError);
    }
    
    // Fallback with realistic UK averages
    console.log('Using fallback pricing...');
    
    const fallbackResponse = {
      petrol: 1.449,
      diesel: 1.529,
      date: new Date().toISOString().split('T')[0],
      source: 'Fallback - UK Average Estimates',
      message: 'Live data temporarily unavailable'
    };
    
    console.log('Fallback response:', fallbackResponse);
    
    return new Response(JSON.stringify(fallbackResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Function error',
      details: error.message,
      petrol: 1.449,
      diesel: 1.529,
      date: new Date().toISOString().split('T')[0],
      source: 'Error Fallback - UK Average Estimates',
      message: 'Using fallback due to function error'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});