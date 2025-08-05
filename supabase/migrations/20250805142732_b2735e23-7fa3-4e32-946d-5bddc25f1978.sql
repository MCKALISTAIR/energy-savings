-- Enable RLS on the new tables
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_pricing_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for exchange_rates (public read access since it's shared data)
CREATE POLICY "Anyone can view exchange rates"
ON public.exchange_rates
FOR SELECT
USING (true);

-- Edge functions can insert/update exchange rates
CREATE POLICY "Service role can manage exchange rates"
ON public.exchange_rates
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');

-- Create policies for vehicle_pricing_cache (public read access since it's shared data)
CREATE POLICY "Anyone can view vehicle pricing cache"
ON public.vehicle_pricing_cache
FOR SELECT
USING (true);

-- Edge functions can insert/update vehicle pricing cache
CREATE POLICY "Service role can manage vehicle pricing cache"
ON public.vehicle_pricing_cache
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');