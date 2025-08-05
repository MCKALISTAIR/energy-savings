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
    
    // Fetch the CSV data from UK Government's open data
    const response = await fetch('https://www.gov.uk/government/statistics/weekly-road-fuel-prices.csv');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fuel prices: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV data fetched successfully');
    
    // Parse CSV to get the latest petrol price
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    // Find the petrol price column (usually "ULSP" for Unleaded Super Petrol)
    const petrolIndex = headers.findIndex(header => 
      header.toLowerCase().includes('ulsp') || 
      header.toLowerCase().includes('petrol') ||
      header.toLowerCase().includes('unleaded')
    );
    
    if (petrolIndex === -1) {
      throw new Error('Could not find petrol price column in data');
    }
    
    // Get the most recent data (last row with data)
    let latestPrice = null;
    let latestDate = null;
    
    for (let i = lines.length - 1; i >= 1; i--) {
      const values = lines[i].split(',');
      const priceValue = values[petrolIndex];
      
      if (priceValue && !isNaN(parseFloat(priceValue))) {
        latestPrice = parseFloat(priceValue);
        latestDate = values[0]; // Assuming first column is date
        break;
      }
    }
    
    if (!latestPrice) {
      throw new Error('No valid petrol price found in data');
    }
    
    // Convert from pence to pounds (UK government data is typically in pence)
    const priceInPounds = latestPrice > 50 ? latestPrice / 100 : latestPrice;
    
    console.log(`Latest petrol price: £${priceInPounds}/litre from ${latestDate}`);
    
    return new Response(JSON.stringify({
      price: priceInPounds,
      date: latestDate,
      source: 'UK Government Weekly Road Fuel Prices'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error fetching fuel prices:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch current fuel prices',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});