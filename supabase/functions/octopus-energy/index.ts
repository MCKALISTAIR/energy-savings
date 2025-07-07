
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, mpan, meterSerial, apiKey } = await req.json()
    
    const octopusApiKey = apiKey || Deno.env.get('OCTOPUS_ENERGY_API_KEY')
    if (!octopusApiKey) {
      throw new Error('Octopus Energy API key not provided')
    }

    const baseUrl = 'https://api.octopus.energy/v1'
    const auth = btoa(`${octopusApiKey}:`)

    let response
    let data

    switch (action) {
      case 'getAccount':
        // Get account information
        response = await fetch(`${baseUrl}/accounts/`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        })
        data = await response.json()
        break

      case 'getConsumption':
        if (!mpan || !meterSerial) {
          throw new Error('MPAN and meter serial number required for consumption data')
        }
        
        // Get electricity consumption for the last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const periodFrom = thirtyDaysAgo.toISOString()
        
        response = await fetch(
          `${baseUrl}/electricity-meter-points/${mpan}/meters/${meterSerial}/consumption/?period_from=${periodFrom}`,
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            }
          }
        )
        data = await response.json()
        break

      case 'getCurrentTariff':
        if (!mpan) {
          throw new Error('MPAN required for tariff data')
        }
        
        response = await fetch(`${baseUrl}/electricity-meter-points/${mpan}/`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        })
        data = await response.json()
        break

      default:
        throw new Error('Invalid action specified')
    }

    if (!response.ok) {
      throw new Error(`Octopus Energy API error: ${response.status} ${response.statusText}`)
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Octopus Energy API error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
