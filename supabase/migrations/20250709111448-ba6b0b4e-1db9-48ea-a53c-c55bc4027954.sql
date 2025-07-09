-- Create smart meter data table for storing consumption history
CREATE TABLE public.smart_meter_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meter_type TEXT NOT NULL CHECK (meter_type IN ('electricity', 'gas')),
  mpan TEXT,
  mprn TEXT, -- for gas meters
  meter_serial TEXT NOT NULL,
  consumption DECIMAL(10,4) NOT NULL, -- kWh for electricity, cubic meters for gas
  interval_start TIMESTAMP WITH TIME ZONE NOT NULL,
  interval_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cost DECIMAL(10,4), -- calculated cost for this interval
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_meter_interval UNIQUE (user_id, meter_type, meter_serial, interval_start)
);

-- Create tariff rates table for storing pricing information
CREATE TABLE public.tariff_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tariff_code TEXT NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('electricity', 'gas')),
  unit_rate DECIMAL(10,6) NOT NULL, -- price per kWh/cubic meter
  standing_charge DECIMAL(10,4) NOT NULL, -- daily standing charge
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_to TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create energy insights table for analytics
CREATE TABLE public.energy_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL, -- 'daily_summary', 'weekly_trend', etc.
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('electricity', 'gas', 'combined')),
  data JSONB NOT NULL, -- flexible storage for different insight types
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.smart_meter_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tariff_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for smart_meter_data
CREATE POLICY "Users can view their own smart meter data" 
ON public.smart_meter_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own smart meter data" 
ON public.smart_meter_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own smart meter data" 
ON public.smart_meter_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own smart meter data" 
ON public.smart_meter_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for tariff_rates
CREATE POLICY "Users can view their own tariff rates" 
ON public.tariff_rates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tariff rates" 
ON public.tariff_rates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tariff rates" 
ON public.tariff_rates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tariff rates" 
ON public.tariff_rates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for energy_insights
CREATE POLICY "Users can view their own energy insights" 
ON public.energy_insights 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own energy insights" 
ON public.energy_insights 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own energy insights" 
ON public.energy_insights 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own energy insights" 
ON public.energy_insights 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_smart_meter_data_user_type ON public.smart_meter_data(user_id, meter_type);
CREATE INDEX idx_smart_meter_data_interval ON public.smart_meter_data(interval_start DESC);
CREATE INDEX idx_tariff_rates_user_fuel ON public.tariff_rates(user_id, fuel_type);
CREATE INDEX idx_tariff_rates_valid_period ON public.tariff_rates(valid_from, valid_to);
CREATE INDEX idx_energy_insights_user_type ON public.energy_insights(user_id, insight_type);

-- Create function to update timestamps
CREATE TRIGGER update_smart_meter_data_updated_at
BEFORE UPDATE ON public.smart_meter_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tariff_rates_updated_at
BEFORE UPDATE ON public.tariff_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_energy_insights_updated_at
BEFORE UPDATE ON public.energy_insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add new columns to user_preferences for octopus-specific settings
ALTER TABLE public.user_preferences 
ADD COLUMN octopus_api_key TEXT,
ADD COLUMN octopus_account_number TEXT,
ADD COLUMN auto_sync_enabled BOOLEAN DEFAULT true,
ADD COLUMN last_sync_at TIMESTAMP WITH TIME ZONE;