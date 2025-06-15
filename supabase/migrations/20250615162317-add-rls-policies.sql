
-- Enable RLS on houses table
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for houses table
CREATE POLICY "Users can view their own houses" 
  ON public.houses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own houses" 
  ON public.houses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own houses" 
  ON public.houses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own houses" 
  ON public.houses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on systems table
ALTER TABLE public.systems ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for systems table
CREATE POLICY "Users can view their own systems" 
  ON public.systems 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own systems" 
  ON public.systems 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own systems" 
  ON public.systems 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own systems" 
  ON public.systems 
  FOR DELETE 
  USING (auth.uid() = user_id);
