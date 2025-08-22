
-- Create lead_emails table for tracking all email communications
CREATE TABLE public.lead_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads_raccordement(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('out', 'in')),
  provider_message_id TEXT,
  subject TEXT NOT NULL,
  body_html TEXT,
  body_text TEXT,
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  cc_emails TEXT[], -- Array of CC emails
  bcc_emails TEXT[], -- Array of BCC emails
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'delivered', 'bounced', 'opened', 'clicked')),
  sent_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create email_templates table for storing reusable templates
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables JSONB DEFAULT '[]', -- Array of template variables like {{prenom}}, {{ville}}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.lead_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for lead_emails (same pattern as lead_notes)
CREATE POLICY "Superadmin full access to emails" ON public.lead_emails
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (auth.jwt() ->> 'email') 
      AND role = 'superadmin' 
      AND is_active = true
    )
  );

CREATE POLICY "Assigned users can manage emails" ON public.lead_emails
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      JOIN public.leads_raccordement l ON l.assigned_to_email = au.email
      WHERE au.email = (auth.jwt() ->> 'email') 
      AND au.is_active = true
      AND l.id = lead_emails.lead_id
    )
  );

-- RLS policies for email_templates (admins only)
CREATE POLICY "Admins can manage email templates" ON public.email_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- Create indexes for performance
CREATE INDEX idx_lead_emails_lead_id ON public.lead_emails(lead_id);
CREATE INDEX idx_lead_emails_created_at ON public.lead_emails(created_at DESC);
CREATE INDEX idx_lead_emails_status ON public.lead_emails(status);
CREATE INDEX idx_lead_emails_direction ON public.lead_emails(direction);

-- Insert French email templates
INSERT INTO public.email_templates (name, subject, body_html, body_text, variables) VALUES
(
  'accuse_reception',
  'Nous avons bien reçu votre demande de raccordement',
  '<p>Bonjour {{prenom}},</p>
   <p>Nous accusons réception de votre demande concernant {{type_projet}} à {{ville}}.</p>
   <p>Un conseiller vous recontactera sous 24 h ouvrées pour confirmer les pièces nécessaires et la suite des étapes.</p>
   <p>Cordialement,<br>
   Raccordement Connect – Service Clients<br>
   Tél. 09 70 70 95 70 · contact@raccordement-connect.com</p>',
  'Bonjour {{prenom}},

Nous accusons réception de votre demande concernant {{type_projet}} à {{ville}}.

Un conseiller vous recontactera sous 24 h ouvrées pour confirmer les pièces nécessaires et la suite des étapes.

Cordialement,
Raccordement Connect – Service Clients
Tél. 09 70 70 95 70 · contact@raccordement-connect.com',
  '["prenom", "type_projet", "ville"]'
),
(
  'demande_pieces',
  'Documents complémentaires pour votre dossier {{ref_dossier}}',
  '<p>Bonjour {{prenom}},</p>
   <p>Pour avancer sur votre {{type_projet}}, merci de nous transmettre :</p>
   <p>– {{liste_pieces}}</p>
   <p>Vous pouvez répondre à ce mail en pièce jointe, ou déposer les fichiers depuis votre espace.</p>
   <p>Bien à vous,<br>
   Raccordement Connect</p>',
  'Bonjour {{prenom}},

Pour avancer sur votre {{type_projet}}, merci de nous transmettre :
– {{liste_pieces}}

Vous pouvez répondre à ce mail en pièce jointe, ou déposer les fichiers depuis votre espace.

Bien à vous,
Raccordement Connect',
  '["prenom", "type_projet", "ref_dossier", "liste_pieces"]'
),
(
  'instruction_paiement',
  'Validation de votre dossier {{ref_dossier}} – règlement de la prestation',
  '<p>Bonjour {{prenom}},</p>
   <p>Votre dossier est prêt à être déposé. Pour lancer la procédure, merci de finaliser le règlement sécurisé via ce lien : <a href="{{lien_paiement}}">{{lien_paiement}}</a>.</p>
   <p>Dès réception, nous déposons votre demande sous 24 h ouvrées.</p>
   <p>Cordialement,<br>
   Raccordement Connect</p>',
  'Bonjour {{prenom}},

Votre dossier est prêt à être déposé. Pour lancer la procédure, merci de finaliser le règlement sécurisé via ce lien : {{lien_paiement}}.

Dès réception, nous déposons votre demande sous 24 h ouvrées.

Cordialement,
Raccordement Connect',
  '["prenom", "ref_dossier", "lien_paiement"]'
);

-- Create trigger for updated_at on lead_emails
CREATE OR REPLACE FUNCTION public.update_lead_emails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_emails_updated_at
  BEFORE UPDATE ON public.lead_emails
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_emails_updated_at();

-- Create trigger for updated_at on email_templates
CREATE OR REPLACE FUNCTION public.update_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_email_templates_updated_at();
