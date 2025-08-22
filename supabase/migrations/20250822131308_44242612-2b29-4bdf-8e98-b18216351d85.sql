-- Fix security issues: Add SET search_path to functions missing it

-- Fix update_lead_emails_updated_at
CREATE OR REPLACE FUNCTION public.update_lead_emails_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix update_email_templates_updated_at
CREATE OR REPLACE FUNCTION public.update_email_templates_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix update_lead_files_updated_at
CREATE OR REPLACE FUNCTION public.update_lead_files_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix create_inbound_message_for_lead
CREATE OR REPLACE FUNCTION public.create_inbound_message_for_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Fix log_lead_event
CREATE OR REPLACE FUNCTION public.log_lead_event(p_lead_id uuid, p_type text, p_actor_id uuid DEFAULT NULL::uuid, p_payload jsonb DEFAULT NULL::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.lead_events (lead_id, type, actor_id, payload)
  VALUES (p_lead_id, p_type, p_actor_id, p_payload)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Fix update_lead_emails_internal_updated_at
CREATE OR REPLACE FUNCTION public.update_lead_emails_internal_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;