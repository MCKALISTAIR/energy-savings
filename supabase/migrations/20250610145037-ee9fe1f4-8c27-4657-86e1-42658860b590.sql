
-- Create houses table
CREATE TABLE public.houses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create systems table
CREATE TABLE public.systems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  house_id UUID REFERENCES public.houses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('solar', 'battery', 'ev')),
  install_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  specifications JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.systems ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for houses
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

-- Create RLS policies for systems
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

-- Create indexes for better performance
CREATE INDEX houses_user_id_idx ON public.houses(user_id);
CREATE INDEX systems_user_id_idx ON public.systems(user_id);
CREATE INDEX systems_house_id_idx ON public.systems(house_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON public.houses 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_systems_updated_at BEFORE UPDATE ON public.systems 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
