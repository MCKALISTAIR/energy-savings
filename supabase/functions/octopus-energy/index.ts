
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, mpan, mprn, meterSerial, apiKey, userId, periodFrom, periodTo } = await req.json()
    
    const octopusApiKey = apiKey || Deno.env.get('OCTOPUS_ENERGY_API_KEY')
    if (!octopusApiKey) {
      throw new Error('Octopus Energy API key not provided')
    }

    const baseUrl = 'https://api.octopus.energy/v1'
    const auth = btoa(`${octopusApiKey}:`)

    let response
    let data
    let processedData

    console.log(`Processing ${action} request for user ${userId}`)

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
        
        // Save account info to user preferences if userId provided
        if (userId && data.results?.[0]) {
          await supabase
            .from('user_preferences')
            .upsert({
              user_id: userId,
              octopus_account_number: data.results[0].number,
              octopus_api_key: octopusApiKey,
              last_sync_at: new Date().toISOString()
            })
        }
        break

      case 'getElectricityConsumption':
        if (!mpan || !meterSerial) {
          throw new Error('MPAN and meter serial number required for electricity consumption data')
        }
        
        const electricityPeriodFrom = periodFrom || (() => {
          const date = new Date()
          date.setDate(date.getDate() - 30)
          return date.toISOString()
        })()
        
        response = await fetch(
          `${baseUrl}/electricity-meter-points/${mpan}/meters/${meterSerial}/consumption/?period_from=${electricityPeriodFrom}${periodTo ? `&period_to=${periodTo}` : ''}`,
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            }
          }
        )
        data = await response.json()
        
        // Store consumption data in database if userId provided
        if (userId && data.results) {
          await storeConsumptionData(userId, 'electricity', meterSerial, mpan, data.results)
        }
        break

      case 'getGasConsumption':
        if (!mprn || !meterSerial) {
          throw new Error('MPRN and meter serial number required for gas consumption data')
        }
        
        const gasPeriodFrom = periodFrom || (() => {
          const date = new Date()
          date.setDate(date.getDate() - 30)
          return date.toISOString()
        })()
        
        response = await fetch(
          `${baseUrl}/gas-meter-points/${mprn}/meters/${meterSerial}/consumption/?period_from=${gasPeriodFrom}${periodTo ? `&period_to=${periodTo}` : ''}`,
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            }
          }
        )
        data = await response.json()
        
        // Store consumption data in database if userId provided
        if (userId && data.results) {
          await storeConsumptionData(userId, 'gas', meterSerial, null, data.results, mprn)
        }
        break

      case 'getElectricityTariff':
        if (!mpan) {
          throw new Error('MPAN required for electricity tariff data')
        }
        
        response = await fetch(`${baseUrl}/electricity-meter-points/${mpan}/`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        })
        data = await response.json()
        
        // Extract and store tariff information
        if (userId && data.agreements) {
          await storeTariffRates(userId, 'electricity', data.agreements)
        }
        break

      case 'getGasTariff':
        if (!mprn) {
          throw new Error('MPRN required for gas tariff data')
        }
        
        response = await fetch(`${baseUrl}/gas-meter-points/${mprn}/`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        })
        data = await response.json()
        
        // Extract and store tariff information
        if (userId && data.agreements) {
          await storeTariffRates(userId, 'gas', data.agreements)
        }
        break

      case 'syncAllData':
        if (!userId) {
          throw new Error('User ID required for data sync')
        }
        
        // Get account first
        const accountResponse = await fetch(`${baseUrl}/accounts/`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!accountResponse.ok) {
          throw new Error('Failed to fetch account data')
        }
        
        const accountData = await accountResponse.json()
        const account = accountData.results?.[0]
        
        if (!account) {
          throw new Error('No account found')
        }
        
        processedData = await syncAllMeterData(octopusApiKey, userId, account)
        data = { account, syncResults: processedData }
        break

      default:
        throw new Error('Invalid action specified')
    }

    if (response && !response.ok) {
      throw new Error(`Octopus Energy API error: ${response.status} ${response.statusText}`)
    }

    return new Response(
      JSON.stringify({ success: true, data: processedData || data }),
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

// Helper function to store consumption data
async function storeConsumptionData(
  userId: string, 
  meterType: 'electricity' | 'gas', 
  meterSerial: string, 
  mpan?: string, 
  consumptionData?: any[], 
  mprn?: string
) {
  if (!consumptionData || consumptionData.length === 0) return

  const dataToInsert = consumptionData.map(reading => ({
    user_id: userId,
    meter_type: meterType,
    mpan: meterType === 'electricity' ? mpan : null,
    mprn: meterType === 'gas' ? mprn : null,
    meter_serial: meterSerial,
    consumption: parseFloat(reading.consumption),
    interval_start: reading.interval_start,
    interval_end: reading.interval_end
  }))

  // Use upsert to handle duplicates
  const { error } = await supabase
    .from('smart_meter_data')
    .upsert(dataToInsert, { 
      onConflict: 'user_id,meter_type,meter_serial,interval_start'
    })

  if (error) {
    console.error('Error storing consumption data:', error)
    throw new Error('Failed to store consumption data')
  }

  console.log(`Stored ${dataToInsert.length} ${meterType} consumption readings`)
}

// Helper function to store tariff rates
async function storeTariffRates(userId: string, fuelType: 'electricity' | 'gas', agreements: any[]) {
  const currentAgreement = agreements.find(a => !a.valid_to || new Date(a.valid_to) > new Date())
  
  if (!currentAgreement) return

  // Fetch tariff details
  const tariffCode = currentAgreement.tariff_code
  const baseUrl = 'https://api.octopus.energy/v1'
  
  try {
    const tariffResponse = await fetch(`${baseUrl}/products/${tariffCode.split('-')[0]}/`)
    if (!tariffResponse.ok) return
    
    const tariffData = await tariffResponse.json()
    const tariffInfo = fuelType === 'electricity' 
      ? tariffData.single_register_electricity_tariffs?.[tariffCode]
      : tariffData.single_register_gas_tariffs?.[tariffCode]
    
    if (tariffInfo?.standard_unit_rate_inc_vat && tariffInfo?.standing_charge_inc_vat) {
      const { error } = await supabase
        .from('tariff_rates')
        .upsert({
          user_id: userId,
          tariff_code: tariffCode,
          fuel_type: fuelType,
          unit_rate: parseFloat(tariffInfo.standard_unit_rate_inc_vat),
          standing_charge: parseFloat(tariffInfo.standing_charge_inc_vat),
          valid_from: currentAgreement.valid_from,
          valid_to: currentAgreement.valid_to
        })
      
      if (error) {
        console.error('Error storing tariff rates:', error)
      } else {
        console.log(`Stored ${fuelType} tariff rates for ${tariffCode}`)
      }
    }
  } catch (error) {
    console.error('Error fetching tariff details:', error)
  }
}

// Helper function to sync all meter data
async function syncAllMeterData(apiKey: string, userId: string, account: any) {
  const auth = btoa(`${apiKey}:`)
  const baseUrl = 'https://api.octopus.energy/v1'
  const results = { electricity: [], gas: [] }
  
  for (const property of account.properties || []) {
    // Process electricity meters
    for (const meterPoint of property.electricity_meter_points || []) {
      for (const meter of meterPoint.meters || []) {
        try {
          const response = await fetch(
            `${baseUrl}/electricity-meter-points/${meterPoint.mpan}/meters/${meter.serial_number}/consumption/?period_from=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
            { headers: { 'Authorization': `Basic ${auth}` } }
          )
          
          if (response.ok) {
            const data = await response.json()
            await storeConsumptionData(userId, 'electricity', meter.serial_number, meterPoint.mpan, data.results)
            results.electricity.push({ mpan: meterPoint.mpan, serial: meter.serial_number, count: data.results?.length || 0 })
          }
        } catch (error) {
          console.error('Error syncing electricity data:', error)
        }
      }
      
      // Store electricity tariff
      try {
        await storeTariffRates(userId, 'electricity', meterPoint.agreements || [])
      } catch (error) {
        console.error('Error storing electricity tariff:', error)
      }
    }
    
    // Process gas meters
    for (const meterPoint of property.gas_meter_points || []) {
      for (const meter of meterPoint.meters || []) {
        try {
          const response = await fetch(
            `${baseUrl}/gas-meter-points/${meterPoint.mprn}/meters/${meter.serial_number}/consumption/?period_from=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
            { headers: { 'Authorization': `Basic ${auth}` } }
          )
          
          if (response.ok) {
            const data = await response.json()
            await storeConsumptionData(userId, 'gas', meter.serial_number, null, data.results, meterPoint.mprn)
            results.gas.push({ mprn: meterPoint.mprn, serial: meter.serial_number, count: data.results?.length || 0 })
          }
        } catch (error) {
          console.error('Error syncing gas data:', error)
        }
      }
      
      // Store gas tariff
      try {
        await storeTariffRates(userId, 'gas', meterPoint.agreements || [])
      } catch (error) {
        console.error('Error storing gas tariff:', error)
      }
    }
  }
  
  // Update last sync time
  await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      last_sync_at: new Date().toISOString()
    })
  
  return results
}
