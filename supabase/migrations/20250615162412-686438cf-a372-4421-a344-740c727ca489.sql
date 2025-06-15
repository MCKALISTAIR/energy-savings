
-- Update the systems table type constraint to include heat_pump
ALTER TABLE public.systems 
DROP CONSTRAINT IF EXISTS systems_type_check;

ALTER TABLE public.systems 
ADD CONSTRAINT systems_type_check 
CHECK (type IN ('solar', 'battery', 'ev', 'heat_pump'));
