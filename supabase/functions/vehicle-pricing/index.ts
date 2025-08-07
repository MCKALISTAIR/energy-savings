import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MARKETCHECK_API_KEY = Deno.env.get('MARKETCHECK_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

interface VehiclePricingRequest {
  vehicleClass: string;
  targetPrice: number;
  useCache?: boolean;
}

interface VehiclePricingResponse {
  averagePrice: number;
  dataSource: 'marketcheck' | 'cached' | 'static';
  lastUpdated: string;
  priceInGBP: number;
  exchangeRate: number;
}

// Vehicle class mapping for MarketCheck API
const VEHICLE_CLASS_MAPPING = {
  '10000': 'Subcompact',
  '20000': 'Compact',
  '30000': 'Midsize', 
  '40000': 'Midsize',
  '50000': 'Full-size',
  '60000': 'Luxury',
  '70000': 'Luxury',
  '80000': 'Luxury',
  '90000': 'Luxury',
  '100000': 'Luxury'
};

async function getExchangeRate(): Promise<number> {
  try {
    // Try to get cached rate first
    const { data: cachedRate } = await supabase
      .from('exchange_rates')
      .select('rate, updated_at')
      .eq('from_currency', 'USD')
      .eq('to_currency', 'GBP')
      .single();

    if (cachedRate && isWithin24Hours(cachedRate.updated_at)) {
      console.log('Using cached exchange rate:', cachedRate.rate);
      return cachedRate.rate;
    }

    // Fetch new rate from UniRateAPI
    const response = await fetch('https://api.uniratesapi.com/v1/latest?base=USD&symbols=GBP');
    const data = await response.json();
    
    if (data.success && data.rates?.GBP) {
      const rate = data.rates.GBP;
      
      // Cache the rate
      await supabase
        .from('exchange_rates')
        .upsert({
          from_currency: 'USD',
          to_currency: 'GBP',
          rate: rate,
          updated_at: new Date().toISOString()
        });

      console.log('Fetched new exchange rate:', rate);
      return rate;
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
  }

  // Fallback to static rate
  return 0.79; // Approximate USD to GBP rate
}

function isWithin24Hours(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  return diffHours < 24;
}

function isWithin7Days(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < 7;
}

async function testNetworkConnectivity(): Promise<boolean> {
  try {
    const response = await fetch('https://httpbin.org/get', { 
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    console.error('Network connectivity test failed:', error);
    return false;
  }
}

async function getMarketCheckPricing(vehicleClass: string, targetPrice: number): Promise<{ averagePrice: number; count: number } | null> {
  if (!MARKETCHECK_API_KEY) {
    console.error('MarketCheck API key not configured');
    return null;
  }

  // Test network connectivity first
  const hasConnectivity = await testNetworkConnectivity();
  if (!hasConnectivity) {
    console.error('Network connectivity test failed - falling back to static pricing');
    return null;
  }

  // API endpoints to try in order
  const apiEndpoints = [
    'https://api.marketcheck.com/v2/search',
    'https://marketcheck-prod.apigee.net/v2/search', 
    'https://marketcheck-prod.apigee.net/v1/search'
  ];

  for (const endpoint of apiEndpoints) {
    try {
      console.log(`Attempting MarketCheck API call to: ${endpoint}`);

      const searchParams = new URLSearchParams({
        body_type: vehicleClass,
        price_min: Math.max(0, targetPrice - 5000).toString(),
        price_max: (targetPrice + 5000).toString(),
        fuel_type: 'Gasoline',
        listing_type: 'used',
        radius: '100',
        zip: '94538', // California ZIP code for testing
        rows: '50'
      });

      // Try with API key in headers first
      let response = await fetch(`${endpoint}?${searchParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MARKETCHECK_API_KEY}`,
          'X-API-KEY': MARKETCHECK_API_KEY,
          'User-Agent': 'Supabase-Function/1.0'
        },
        signal: AbortSignal.timeout(10000)
      });

      // If headers don't work, try with API key in query params
      if (!response.ok) {
        console.log(`Headers auth failed (${response.status}), trying query param auth`);
        searchParams.set('api_key', MARKETCHECK_API_KEY);
        response = await fetch(`${endpoint}?${searchParams}`, {
          method: 'GET',
          signal: AbortSignal.timeout(10000)
        });
      }
      
      if (!response.ok) {
        console.error(`MarketCheck API error for ${endpoint}: ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        console.error(`Response body: ${errorText}`);
        continue; // Try next endpoint
      }

      const data = await response.json();
      console.log(`MarketCheck API response structure:`, Object.keys(data));
      
      if (data.listings && data.listings.length > 0) {
        const prices = data.listings.map((listing: any) => listing.price).filter((price: number) => price > 0);
        const averagePrice = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;
        
        console.log(`MarketCheck SUCCESS: Found ${prices.length} vehicles, average price: $${averagePrice}`);
        return { averagePrice, count: prices.length };
      }

      console.log('MarketCheck returned no listings');
      return null;

    } catch (error) {
      console.error(`Error fetching MarketCheck data from ${endpoint}:`, error);
      
      // Log specific error types for debugging
      if (error instanceof TypeError && error.message.includes('dns error')) {
        console.error('DNS resolution failed - this appears to be a network configuration issue');
      }
      
      continue; // Try next endpoint
    }
  }

  console.error('All MarketCheck API endpoints failed');
  return null;
}

async function getCachedVehiclePricing(vehicleClass: string): Promise<{ averagePrice: number; lastUpdated: string } | null> {
  try {
    const { data } = await supabase
      .from('vehicle_pricing_cache')
      .select('average_price_usd, updated_at')
      .eq('vehicle_class', vehicleClass)
      .single();

    if (data && isWithin7Days(data.updated_at)) {
      return {
        averagePrice: data.average_price_usd,
        lastUpdated: data.updated_at
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching cached pricing:', error);
    return null;
  }
}

async function cacheVehiclePricing(vehicleClass: string, averagePriceUSD: number): Promise<void> {
  try {
    await supabase
      .from('vehicle_pricing_cache')
      .upsert({
        vehicle_class: vehicleClass,
        average_price_usd: averagePriceUSD,
        updated_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error caching vehicle pricing:', error);
  }
}

function getStaticPricing(targetPrice: number): number {
  // UK market adjustment: US prices are typically 15-20% lower than UK
  const ukAdjustmentFactor = 1.175;
  return targetPrice * 0.85 * ukAdjustmentFactor;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vehicleClass, targetPrice, useCache = true }: VehiclePricingRequest = await req.json();

    if (!vehicleClass || !targetPrice) {
      return new Response(
        JSON.stringify({ error: 'Missing vehicleClass or targetPrice' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let averagePriceUSD: number;
    let dataSource: 'marketcheck' | 'cached' | 'static' = 'static';
    let lastUpdated = new Date().toISOString();

    // Try cached data first if useCache is true
    if (useCache) {
      const cachedData = await getCachedVehiclePricing(vehicleClass);
      if (cachedData) {
        averagePriceUSD = cachedData.averagePrice;
        dataSource = 'cached';
        lastUpdated = cachedData.lastUpdated;
        console.log('Using cached vehicle pricing data');
      }
    }

    // If no cached data or cache disabled, try MarketCheck API
    if (dataSource === 'static') {
      const marketCheckClass = VEHICLE_CLASS_MAPPING[vehicleClass as keyof typeof VEHICLE_CLASS_MAPPING] || 'Midsize';
      const marketCheckData = await getMarketCheckPricing(marketCheckClass, targetPrice);
      
      if (marketCheckData && marketCheckData.count > 5) {
        averagePriceUSD = marketCheckData.averagePrice;
        dataSource = 'marketcheck';
        lastUpdated = new Date().toISOString();
        
        // Cache the new data
        await cacheVehiclePricing(vehicleClass, averagePriceUSD);
        console.log('Using fresh MarketCheck data');
      }
    }

    // Fall back to static pricing if no API data available
    if (dataSource === 'static') {
      averagePriceUSD = getStaticPricing(targetPrice);
      console.log('Using static pricing fallback');
    }

    // Get exchange rate and convert to GBP
    const exchangeRate = await getExchangeRate();
    const priceInGBP = averagePriceUSD * exchangeRate;

    const response: VehiclePricingResponse = {
      averagePrice: averagePriceUSD,
      dataSource,
      lastUpdated,
      priceInGBP,
      exchangeRate
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in vehicle-pricing function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});