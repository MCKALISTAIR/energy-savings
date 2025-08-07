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