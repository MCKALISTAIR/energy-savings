
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GetAddressResponse {
  suggestions: Array<{
    address: string;
    url: string;
    id: string;
  }>;
}

// Function to properly format UK postcodes
function formatUKPostcode(postcode: string): string {
  // Remove all spaces and convert to uppercase
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
  
  // UK postcode format: outward code (2-4 chars) + space + inward code (3 chars)
  // Examples: M1 1AA, M60 1NW, B33 8TH, W1A 0AX, EC1A 1BB
  
  if (cleaned.length < 5 || cleaned.length > 7) {
    return cleaned; // Return as-is if invalid length
  }
  
  // Insert space before the last 3 characters (inward code)
  const inwardCode = cleaned.slice(-3);
  const outwardCode = cleaned.slice(0, -3);
  
  return `${outwardCode} ${inwardCode}`;
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

    // Format postcode properly for UK format
    const formattedPostcode = formatUKPostcode(postcode);
    
    console.log(`Original postcode input: "${postcode}"`);
    console.log(`Formatted postcode: "${formattedPostcode}"`);
    console.log(`API key present: ${apiKey ? 'Yes' : 'No'}`);
    console.log(`API key length: ${apiKey ? apiKey.length : 0}`);
    console.log(`Using autocomplete API URL: https://api.getAddress.io/autocomplete/${encodeURIComponent(formattedPostcode)}`);

    const response = await fetch(
      `https://api.getAddress.io/autocomplete/${encodeURIComponent(formattedPostcode)}?api-key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`GetAddress API response status: ${response.status}`);
    console.log(`GetAddress API response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GetAddress API error response:', errorText);
      
      if (response.status === 404) {
        // Test with a known working postcode to verify API connectivity
        console.log('Testing API connectivity with known postcode...');
        const testResponse = await fetch(
          `https://api.getAddress.io/autocomplete/SW1A%201AA?api-key=${apiKey}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(`Test postcode response status: ${testResponse.status}`);
        
        return new Response(
          JSON.stringify({ 
            addresses: [], 
            error: `No addresses found for postcode "${formattedPostcode}". This postcode may not exist or may not be covered by the address lookup service.` 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 400) {
        return new Response(
          JSON.stringify({ addresses: [], error: 'Invalid postcode format' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 401) {
        console.error('GetAddress API authentication failed - check API key');
        return new Response(
          JSON.stringify({ error: 'API authentication failed. Please check your GetAddress API key.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Address lookup service temporarily unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: GetAddressResponse = await response.json();
    console.log(`GetAddress API response data:`, JSON.stringify(data));
    console.log(`Found ${data.suggestions?.length || 0} suggestions`);

    // Transform GetAddress.io autocomplete format to our expected format
    const formattedAddresses = data.suggestions?.map((suggestion, index) => {
      // Parse the address string to extract components
      const addressParts = suggestion.address.split(',').map(part => part.trim());
      
      return {
        formatted_address: suggestion.address,
        building_number: addressParts[0]?.split(' ')[0] || '',
        thoroughfare: addressParts[0]?.split(' ').slice(1).join(' ') || '',
        postcode: formattedPostcode,
        post_town: addressParts[addressParts.length - 2] || '',
        county: addressParts[addressParts.length - 1] || ''
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
