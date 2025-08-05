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
    console.log('Fetching UK fuel prices...');
    
    // Use the UK Government's statistical data API
    // This endpoint provides the latest weekly road fuel prices
    const response = await fetch('https://assets.publishing.service.gov.uk/media/66f8b5b5a3e84e5e6d7bad26/CSV_RFS0142.csv');
    
    if (!response.ok) {
      console.error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch fuel prices: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV data fetched successfully, length:', csvText.length);
    
    // Parse CSV to get the latest petrol price
    const lines = csvText.trim().split('\n');
    
    if (lines.length < 2) {
      throw new Error('Invalid CSV data - not enough rows');
    }
    
    // Skip header row and get the most recent data
    // UK Government CSV format: Date, ULSP (Unleaded Super Petrol), Diesel, etc.
    const dataLines = lines.slice(1).filter(line => line.trim().length > 0);
    
    if (dataLines.length === 0) {
      throw new Error('No data rows found in CSV');
    }
    
    // Get the most recent entry (last row)
    const latestRow = dataLines[dataLines.length - 1];
    const values = latestRow.split(',');
    
    console.log('Latest row:', latestRow);
    console.log('Values:', values);
    
    // Extract date and petrol price
    // Assuming format: Date, ULSP, Diesel, ...
    const date = values[0]?.trim();
    const petrolPriceStr = values[1]?.trim();
    
    if (!petrolPriceStr || petrolPriceStr === '' || petrolPriceStr === '-') {
      throw new Error('No valid petrol price found in latest data');
    }
    
    const petrolPrice = parseFloat(petrolPriceStr);
    
    if (isNaN(petrolPrice) || petrolPrice <= 0) {
      throw new Error(`Invalid petrol price: ${petrolPriceStr}`);
    }
    
    // UK Government data is typically in pence per litre, convert to pounds
    const priceInPounds = petrolPrice > 50 ? petrolPrice / 100 : petrolPrice;
    
    console.log(`Latest petrol price: £${priceInPounds}/litre from ${date}`);
    
    return new Response(JSON.stringify({
      price: priceInPounds,
      date: date,
      source: 'UK Government Weekly Road Fuel Prices',
      rawPrice: petrolPrice
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error fetching fuel prices:', error);
    
    // Fallback: return a reasonable default price with error info
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch current fuel prices',
      details: error.message,
      fallbackPrice: 1.45, // Typical UK petrol price as fallback
      message: 'Using fallback price due to data source unavailability'
    }), {
      status: 200, // Return 200 so frontend can handle gracefully
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});