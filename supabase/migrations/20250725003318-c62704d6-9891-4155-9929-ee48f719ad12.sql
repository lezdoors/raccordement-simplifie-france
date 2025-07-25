-- Enable realtime for leads_raccordement table
ALTER TABLE public.leads_raccordement REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads_raccordement;