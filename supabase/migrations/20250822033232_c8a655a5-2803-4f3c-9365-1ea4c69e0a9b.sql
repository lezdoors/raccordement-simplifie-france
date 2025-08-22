
-- Create lead_emails table for internal messages
CREATE TABLE public.lead_emails_internal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads_raccordement(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('internal', 'inbound')),
  subject TEXT NOT NULL,
  body_html TEXT,
  body_text TEXT,
  from_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_events table for timeline/audit log
CREATE TABLE public.lead_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads_raccordement(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('status_changed', 'note_added', 'message_added', 'file_uploaded', 'assignment_changed')),
  actor_id UUID REFERENCES auth.users(id),
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for lead_emails_internal
ALTER TABLE public.lead_emails_internal ENABLE ROW LEVEL SECURITY;

-- Superadmin full access
CREATE POLICY "Superadmin full access to internal emails" 
  ON public.lead_emails_internal 
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND role = 'superadmin' 
    AND is_active = true
  ));

-- Manager access to all leads
CREATE POLICY "Manager access to all internal emails" 
  ON public.lead_emails_internal 
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND role = 'manager' 
    AND is_active = true
  ));

-- Traiteur access only to assigned leads
CREATE POLICY "Traiteur access to assigned lead emails" 
  ON public.lead_emails_internal 
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users au
    JOIN leads_raccordement l ON l.assigned_to_email = au.email
    WHERE au.email = (auth.jwt() ->> 'email') 
    AND au.role = 'traiteur'
    AND au.is_active = true 
    AND l.id = lead_emails_internal.lead_id
  ));

-- Add RLS policies for lead_events
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;

-- Superadmin full access to events
CREATE POLICY "Superadmin full access to lead events" 
  ON public.lead_events 
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND role = 'superadmin' 
    AND is_active = true
  ));

-- Manager access to all lead events
CREATE POLICY "Manager access to all lead events" 
  ON public.lead_events 
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND role = 'manager' 
    AND is_active = true
  ));

-- Traiteur access only to assigned lead events
CREATE POLICY "Traiteur access to assigned lead events" 
  ON public.lead_events 
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users au
    JOIN leads_raccordement l ON l.assigned_to_email = au.email
    WHERE au.email = (auth.jwt() ->> 'email') 
    AND au.role = 'traiteur'
    AND au.is_active = true 
    AND l.id = lead_events.lead_id
  ));

-- Enhanced RLS for payments - create view that excludes payment fields for traiteurs
CREATE OR REPLACE VIEW public.leads_for_traiteur AS
SELECT 
  id, email, created_at, updated_at, consent_accepted, form_step, assigned_to, priority,
  civilite, type_client, nom, prenom, telephone, code_postal, ville, raison_sociale, siren,
  type_raccordement, type_projet, type_alimentation, puissance, adresse_chantier, numero_pdl,
  etat_projet, delai_souhaite, type_facturation, commentaires, assigned_to_email, status, form_type,
  -- Hide payment fields from traiteurs
  CASE WHEN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND role IN ('superadmin', 'manager') 
    AND is_active = true
  ) THEN amount ELSE NULL END as amount,
  CASE WHEN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND role IN ('superadmin', 'manager') 
    AND is_active = true
  ) THEN payment_status ELSE NULL END as payment_status,
  CASE WHEN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND role IN ('superadmin', 'manager') 
    AND is_active = true
  ) THEN stripe_session_id ELSE NULL END as stripe_session_id
FROM public.leads_raccordement;

-- Grant access to the view
GRANT SELECT ON public.leads_for_traiteur TO authenticated;

-- Create trigger to auto-create inbound message when lead is created
CREATE OR REPLACE FUNCTION public.create_inbound_message_for_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create inbound message for leads created via public form
  IF NEW.form_type IS NOT NULL THEN
    INSERT INTO public.lead_emails_internal (
      lead_id,
      direction,
      subject,
      body_text,
      body_html
    ) VALUES (
      NEW.id,
      'inbound',
      'Nouvelle demande de raccordement',
      format('Nouvelle demande de raccordement de %s %s (%s)', NEW.prenom, NEW.nom, NEW.email),
      format('<p>Nouvelle demande de raccordement de <strong>%s %s</strong> (%s)</p>', NEW.prenom, NEW.nom, NEW.email)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_inbound_message
  AFTER INSERT ON public.leads_raccordement
  FOR EACH ROW
  EXECUTE FUNCTION public.create_inbound_message_for_lead();

-- Create function to log lead events
CREATE OR REPLACE FUNCTION public.log_lead_event(
  p_lead_id UUID,
  p_type TEXT,
  p_actor_id UUID DEFAULT NULL,
  p_payload JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.lead_events (lead_id, type, actor_id, payload)
  VALUES (p_lead_id, p_type, p_actor_id, p_payload)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update trigger function to updated_at
CREATE OR REPLACE FUNCTION public.update_lead_emails_internal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lead_emails_internal_updated_at
  BEFORE UPDATE ON public.lead_emails_internal
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_emails_internal_updated_at();
