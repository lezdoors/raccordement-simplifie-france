export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_email: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource: string
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_email: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource: string
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_email?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource?: string
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          can_export_data: boolean | null
          can_manage_users: boolean | null
          can_see_all_leads: boolean | null
          can_see_payments: boolean | null
          created_at: string | null
          department: string | null
          email: string
          id: string
          is_active: boolean | null
          role: string
        }
        Insert: {
          can_export_data?: boolean | null
          can_manage_users?: boolean | null
          can_see_all_leads?: boolean | null
          can_see_payments?: boolean | null
          created_at?: string | null
          department?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          role: string
        }
        Update: {
          can_export_data?: boolean | null
          can_manage_users?: boolean | null
          can_see_all_leads?: boolean | null
          can_see_payments?: boolean | null
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          role?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body_html: string
          body_text?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body_html?: string
          body_text?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      lead_emails: {
        Row: {
          bcc_emails: string[] | null
          body_html: string | null
          body_text: string | null
          cc_emails: string[] | null
          created_at: string | null
          direction: string
          from_email: string
          id: string
          lead_id: string
          provider_message_id: string | null
          sent_by: string | null
          status: string
          subject: string
          to_email: string
          updated_at: string | null
        }
        Insert: {
          bcc_emails?: string[] | null
          body_html?: string | null
          body_text?: string | null
          cc_emails?: string[] | null
          created_at?: string | null
          direction: string
          from_email: string
          id?: string
          lead_id: string
          provider_message_id?: string | null
          sent_by?: string | null
          status?: string
          subject: string
          to_email: string
          updated_at?: string | null
        }
        Update: {
          bcc_emails?: string[] | null
          body_html?: string | null
          body_text?: string | null
          cc_emails?: string[] | null
          created_at?: string | null
          direction?: string
          from_email?: string
          id?: string
          lead_id?: string
          provider_message_id?: string | null
          sent_by?: string | null
          status?: string
          subject?: string
          to_email?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_emails_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_for_traiteur"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_emails_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_raccordement"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_emails_internal: {
        Row: {
          body_html: string | null
          body_text: string | null
          created_at: string
          direction: string
          from_user_id: string | null
          id: string
          lead_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          direction: string
          from_user_id?: string | null
          id?: string
          lead_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          direction?: string
          from_user_id?: string | null
          id?: string
          lead_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_emails_internal_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_for_traiteur"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_emails_internal_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_raccordement"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_events: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          lead_id: string
          payload: Json | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          lead_id: string
          payload?: Json | null
          type: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          payload?: Json | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_for_traiteur"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_raccordement"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_files: {
        Row: {
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          is_deleted: boolean | null
          lead_id: string
          mime_type: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          is_deleted?: boolean | null
          lead_id: string
          mime_type: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          is_deleted?: boolean | null
          lead_id?: string
          mime_type?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_files_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_for_traiteur"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_files_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_raccordement"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          admin_email: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          note: string
          note_type: string | null
        }
        Insert: {
          admin_email?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          note: string
          note_type?: string | null
        }
        Update: {
          admin_email?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          note?: string
          note_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_admin_email_fkey"
            columns: ["admin_email"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_for_traiteur"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_raccordement"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_status_history: {
        Row: {
          admin_email: string | null
          changed_at: string | null
          id: string
          lead_id: string | null
          new_status: string | null
          old_status: string | null
        }
        Insert: {
          admin_email?: string | null
          changed_at?: string | null
          id?: string
          lead_id?: string | null
          new_status?: string | null
          old_status?: string | null
        }
        Update: {
          admin_email?: string | null
          changed_at?: string | null
          id?: string
          lead_id?: string | null
          new_status?: string | null
          old_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_status_history_admin_email_fkey"
            columns: ["admin_email"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "lead_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_for_traiteur"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_raccordement"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_raccordement: {
        Row: {
          adresse_chantier: string | null
          amount: number | null
          assigned_to: string | null
          assigned_to_email: string | null
          civilite: string | null
          code_postal: string | null
          commentaires: string | null
          consent_accepted: boolean | null
          created_at: string | null
          delai_souhaite: string | null
          email: string
          etat_projet: string | null
          form_step: number | null
          form_type: string
          id: string
          nom: string
          numero_pdl: string | null
          payment_status: string | null
          prenom: string
          priority: number | null
          puissance: string | null
          raison_sociale: string | null
          siren: string | null
          status: string | null
          stripe_session_id: string | null
          telephone: string
          type_alimentation: string | null
          type_client: string
          type_facturation: string | null
          type_projet: string | null
          type_raccordement: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          adresse_chantier?: string | null
          amount?: number | null
          assigned_to?: string | null
          assigned_to_email?: string | null
          civilite?: string | null
          code_postal?: string | null
          commentaires?: string | null
          consent_accepted?: boolean | null
          created_at?: string | null
          delai_souhaite?: string | null
          email: string
          etat_projet?: string | null
          form_step?: number | null
          form_type?: string
          id?: string
          nom: string
          numero_pdl?: string | null
          payment_status?: string | null
          prenom: string
          priority?: number | null
          puissance?: string | null
          raison_sociale?: string | null
          siren?: string | null
          status?: string | null
          stripe_session_id?: string | null
          telephone: string
          type_alimentation?: string | null
          type_client: string
          type_facturation?: string | null
          type_projet?: string | null
          type_raccordement?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          adresse_chantier?: string | null
          amount?: number | null
          assigned_to?: string | null
          assigned_to_email?: string | null
          civilite?: string | null
          code_postal?: string | null
          commentaires?: string | null
          consent_accepted?: boolean | null
          created_at?: string | null
          delai_souhaite?: string | null
          email?: string
          etat_projet?: string | null
          form_step?: number | null
          form_type?: string
          id?: string
          nom?: string
          numero_pdl?: string | null
          payment_status?: string | null
          prenom?: string
          priority?: number | null
          puissance?: string | null
          raison_sociale?: string | null
          siren?: string | null
          status?: string | null
          stripe_session_id?: string | null
          telephone?: string
          type_alimentation?: string | null
          type_client?: string
          type_facturation?: string | null
          type_projet?: string | null
          type_raccordement?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          request_type: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          request_type?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          request_type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          email_sent: boolean | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          email_sent?: boolean | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          email_sent?: boolean | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          failure_reason: string | null
          id: string
          paid_at: string | null
          payment_method: string | null
          status: string
          stripe_payment_intent_id: string
          stripe_session_id: string | null
          submission_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          failure_reason?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          status: string
          stripe_payment_intent_id: string
          stripe_session_id?: string | null
          submission_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          failure_reason?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string
          stripe_session_id?: string | null
          submission_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nom: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          nom?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nom?: string | null
          role?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          count: number
          created_at: string
          id: string
          identifier: string
          window_start: string
        }
        Insert: {
          action: string
          count?: number
          created_at?: string
          id?: string
          identifier: string
          window_start?: string
        }
        Update: {
          action?: string
          count?: number
          created_at?: string
          id?: string
          identifier?: string
          window_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      leads_for_traiteur: {
        Row: {
          adresse_chantier: string | null
          amount: number | null
          assigned_to: string | null
          assigned_to_email: string | null
          civilite: string | null
          code_postal: string | null
          commentaires: string | null
          consent_accepted: boolean | null
          created_at: string | null
          delai_souhaite: string | null
          email: string | null
          etat_projet: string | null
          form_step: number | null
          form_type: string | null
          id: string | null
          nom: string | null
          numero_pdl: string | null
          payment_status: string | null
          prenom: string | null
          priority: number | null
          puissance: string | null
          raison_sociale: string | null
          siren: string | null
          status: string | null
          stripe_session_id: string | null
          telephone: string | null
          type_alimentation: string | null
          type_client: string | null
          type_facturation: string | null
          type_projet: string | null
          type_raccordement: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          adresse_chantier?: string | null
          amount?: never
          assigned_to?: string | null
          assigned_to_email?: string | null
          civilite?: string | null
          code_postal?: string | null
          commentaires?: string | null
          consent_accepted?: boolean | null
          created_at?: string | null
          delai_souhaite?: string | null
          email?: string | null
          etat_projet?: string | null
          form_step?: number | null
          form_type?: string | null
          id?: string | null
          nom?: string | null
          numero_pdl?: string | null
          payment_status?: never
          prenom?: string | null
          priority?: number | null
          puissance?: string | null
          raison_sociale?: string | null
          siren?: string | null
          status?: string | null
          stripe_session_id?: never
          telephone?: string | null
          type_alimentation?: string | null
          type_client?: string | null
          type_facturation?: string | null
          type_projet?: string | null
          type_raccordement?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          adresse_chantier?: string | null
          amount?: never
          assigned_to?: string | null
          assigned_to_email?: string | null
          civilite?: string | null
          code_postal?: string | null
          commentaires?: string | null
          consent_accepted?: boolean | null
          created_at?: string | null
          delai_souhaite?: string | null
          email?: string | null
          etat_projet?: string | null
          form_step?: number | null
          form_type?: string | null
          id?: string | null
          nom?: string | null
          numero_pdl?: string | null
          payment_status?: never
          prenom?: string | null
          priority?: number | null
          puissance?: string | null
          raison_sociale?: string | null
          siren?: string | null
          status?: string | null
          stripe_session_id?: never
          telephone?: string | null
          type_alimentation?: string | null
          type_client?: string | null
          type_facturation?: string | null
          type_projet?: string | null
          type_raccordement?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      get_security_headers: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_admin_email: {
        Args: { email_to_check: string }
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_session_valid: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_lead_event: {
        Args: {
          p_actor_id?: string
          p_lead_id: string
          p_payload?: Json
          p_type: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
