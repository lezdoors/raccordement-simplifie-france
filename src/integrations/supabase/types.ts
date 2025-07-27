export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
