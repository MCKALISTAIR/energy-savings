import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Service {
  id: string;
  name: string;
  description: string;
  status: 'healthy' | 'error' | 'warning' | 'unknown';
  lastChecked?: string;
  responseTime?: number;
  lastError?: string;
}

export interface ServiceLog {
  service: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: any;
  timestamp: string;
}

export const useServiceStatus = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 'supabase',
      name: 'Supabase Database',
      description: 'Main database and authentication service',
      status: 'unknown',
    },
    {
      id: 'octopus-energy',
      name: 'Octopus Energy API',
      description: 'Smart meter data and energy consumption',
      status: 'unknown',
    },
    {
      id: 'address-lookup',
      name: 'Address Lookup Service',
      description: 'GetAddress.io address lookup and validation',
      status: 'unknown',
    },
    {
      id: 'vehicle-pricing',
      name: 'Vehicle Pricing API',
      description: 'MarketCheck vehicle pricing data',
      status: 'unknown',
    },
    {
      id: 'fuel-prices',
      name: 'Fuel Prices Service',
      description: 'UK fuel price data from government sources',
      status: 'unknown',
    },
    {
      id: 'unirate',
      name: 'UniRate Exchange Rates',
      description: 'USD to GBP currency conversion rates',
      status: 'unknown',
    },
  ]);

  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const addLog = useCallback((log: Omit<ServiceLog, 'timestamp'>) => {
    const newLog: ServiceLog = {
      ...log,
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep only last 100 logs
  }, []);

  const updateService = useCallback((serviceId: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, ...updates, lastChecked: new Date().toISOString() }
        : service
    ));
  }, []);

  const checkSupabase = useCallback(async () => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.from('user_preferences').select('count').limit(1);
      const responseTime = Date.now() - startTime;
      
      if (error) {
        throw error;
      }
      
      updateService('supabase', {
        status: 'healthy',
        responseTime,
        lastError: undefined,
      });
      
      addLog({
        service: 'supabase',
        level: 'info',
        message: `Database connection successful (${responseTime}ms)`,
        details: { responseTime, queryResult: data }
      });
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      updateService('supabase', {
        status: 'error',
        responseTime,
        lastError: error.message,
      });
      
      addLog({
        service: 'supabase',
        level: 'error',
        message: `Database connection failed: ${error.message}`,
        details: { error: error.message, responseTime }
      });
    }
  }, [updateService, addLog]);

  const checkUniRate = useCallback(async () => {
    const startTime = Date.now();
    try {
      // First check cached exchange rates freshness
      const { data: cachedRates, error: cacheError } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('from_currency', 'USD')
        .eq('to_currency', 'GBP')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const cachedRateAge = cachedRates ? new Date(cachedRates.updated_at) : null;
      const isStale = !cachedRateAge || cachedRateAge < oneDayAgo;

      // Test UniRateAPI directly
      const apiResponse = await fetch('https://api.unirate.io/v1/rates/latest?base=USD&currencies=GBP');
      const apiResponseTime = Date.now() - startTime;
      
      if (!apiResponse.ok) {
        throw new Error(`UniRate API returned ${apiResponse.status}`);
      }

      const apiData = await apiResponse.json();
      if (!apiData.rates?.GBP) {
        throw new Error('Invalid response format from UniRate API');
      }

      // Determine status based on API health and cache freshness
      let status: 'healthy' | 'warning' | 'error' = 'healthy';
      let message = `UniRate API responding (${apiResponseTime}ms)`;
      let level: 'info' | 'warning' | 'error' = 'info';

      if (isStale) {
        status = 'warning';
        level = 'warning';
        message = `UniRate API responding but cached rates are stale (${apiResponseTime}ms)`;
      }

      updateService('unirate', {
        status,
        responseTime: apiResponseTime,
        lastError: undefined,
      });

      addLog({
        service: 'unirate',
        level,
        message,
        details: { 
          responseTime: apiResponseTime, 
          currentRate: apiData.rates.GBP,
          cachedRateAge: cachedRateAge?.toISOString(),
          isStale 
        }
      });

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      // Check if we have cached rates as fallback
      const { data: cachedRates } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('from_currency', 'USD')
        .eq('to_currency', 'GBP')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const hasFallback = cachedRates && new Date(cachedRates.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      updateService('unirate', {
        status: 'error',
        responseTime,
        lastError: error.message,
      });

      addLog({
        service: 'unirate',
        level: 'error',
        message: `UniRate API failed: ${error.message}${hasFallback ? ' (cached rates available)' : ' (no recent cached rates)'}`,
        details: { 
          error: error.message, 
          responseTime,
          hasFallback,
          cachedRateAge: cachedRates?.updated_at 
        }
      });
    }
  }, [updateService, addLog]);

  const checkEdgeFunction = useCallback(async (functionName: string, serviceName: string) => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { healthCheck: true }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        throw error;
      }
      
      updateService(serviceName, {
        status: 'healthy',
        responseTime,
        lastError: undefined,
      });
      
      addLog({
        service: serviceName,
        level: 'info',
        message: `Edge function ${functionName} responded successfully (${responseTime}ms)`,
        details: { responseTime, functionResponse: data }
      });
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      updateService(serviceName, {
        status: 'error',
        responseTime,
        lastError: error.message,
      });
      
      addLog({
        service: serviceName,
        level: 'error',
        message: `Edge function ${functionName} failed: ${error.message}`,
        details: { error: error.message, responseTime, functionName }
      });
    }
  }, [updateService, addLog]);

  const checkSingleService = useCallback(async (serviceId: string) => {
    setIsChecking(true);
    
    try {
      switch (serviceId) {
        case 'supabase':
          await checkSupabase();
          break;
        case 'octopus-energy':
          await checkEdgeFunction('octopus-energy', 'octopus-energy');
          break;
        case 'address-lookup':
          await checkEdgeFunction('address-lookup', 'address-lookup');
          break;
        case 'vehicle-pricing':
          await checkEdgeFunction('vehicle-pricing', 'vehicle-pricing');
          break;
        case 'fuel-prices':
          await checkEdgeFunction('fetch-fuel-prices', 'fuel-prices');
          break;
        case 'unirate':
          await checkUniRate();
          break;
        default:
          addLog({
            service: serviceId,
            level: 'warning',
            message: `Unknown service: ${serviceId}`,
          });
      }
    } finally {
      setIsChecking(false);
    }
  }, [checkSupabase, checkEdgeFunction, addLog]);

  const checkAllServices = useCallback(async () => {
    setIsChecking(true);
    
    addLog({
      service: 'system',
      level: 'info',
      message: 'Starting health check for all services',
    });

    const serviceIds = services.map(s => s.id);
    
    try {
      await Promise.all(serviceIds.map(serviceId => checkSingleService(serviceId)));
      
      addLog({
        service: 'system',
        level: 'info',
        message: 'Completed health check for all services',
      });
    } catch (error: any) {
      addLog({
        service: 'system',
        level: 'error',
        message: `Error during bulk health check: ${error.message}`,
        details: error
      });
    } finally {
      setIsChecking(false);
    }
  }, [services, checkSingleService, addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    addLog({
      service: 'system',
      level: 'info',
      message: 'Service logs cleared',
    });
  }, [addLog]);

  return {
    services,
    logs,
    isChecking,
    checkAllServices,
    checkSingleService,
    clearLogs,
  };
};