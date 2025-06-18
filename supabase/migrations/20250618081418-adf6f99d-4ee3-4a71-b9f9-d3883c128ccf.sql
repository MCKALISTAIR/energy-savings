
-- Add system_cost column to the systems table
ALTER TABLE public.systems 
ADD COLUMN system_cost DECIMAL(10,2) DEFAULT 0.00;

-- Add a comment to document the column
COMMENT ON COLUMN public.systems.system_cost IS 'The total cost of the system installation in the local currency';
