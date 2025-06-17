
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GetAddressResponse {
  addresses: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postcode } = await req.json();
    
    if (!postcode) {
      return new Response(
        JSON.stringify({ error: 'Postcode is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GETADDRESS_API_KEY');
    if (!apiKey) {
      console.error('GetAddress API key not found');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean and format postcode
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
    
    console.log(`Looking up addresses for postcode: ${cleanPostcode}`);

    const response = await fetch(
      `https://api.getAddress.io/find/${encodeURIComponent(cleanPostcode)}?api-key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ addresses: [], error: 'No addresses found for this postcode' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('GetAddress API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ error: 'Address lookup service temporarily unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: GetAddressResponse = await response.json();
    console.log(`Found ${data.addresses?.length || 0} addresses`);

    // Transform GetAddress.io format to our expected format
    const formattedAddresses = data.addresses?.map((address, index) => {
      // GetAddress.io returns addresses as comma-separated strings
      const parts = address.split(',').map(part => part.trim());
      
      return {
        formatted_address: address,
        building_number: parts[0] || '',
        thoroughfare: parts[1] || '',
        postcode: cleanPostcode,
        post_town: parts[parts.length - 2] || '',
        county: parts[parts.length - 1] || ''
      };
    }) || [];

    return new Response(
      JSON.stringify({ addresses: formattedAddresses }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in address-lookup function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
