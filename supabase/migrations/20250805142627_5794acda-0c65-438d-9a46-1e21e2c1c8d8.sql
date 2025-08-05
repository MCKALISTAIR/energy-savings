-- Create table for caching exchange rates
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate DECIMAL(10, 6) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Create table for caching vehicle pricing data
CREATE TABLE IF NOT EXISTS public.vehicle_pricing_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_class TEXT NOT NULL UNIQUE,
  average_price_usd DECIMAL(10, 2) NOT NULL,
  data_source TEXT DEFAULT 'marketcheck',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies ON public.exchange_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_vehicle_pricing_class ON public.vehicle_pricing_cache(vehicle_class);
CREATE INDEX IF NOT EXISTS idx_vehicle_pricing_updated ON public.vehicle_pricing_cache(updated_at);