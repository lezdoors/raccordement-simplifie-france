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
      admins: {
        Row: {
          active: boolean | null
          created_at: string
          created_by: string | null
          email: string
          id: string
          name: string | null
          role: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          name?: string | null
          role?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      demandes: {
        Row: {
          adresse: string
          code_postal: string
          created_at: string | null
          deja_client: boolean | null
          email: string
          facture_edis_id: string | null
          id: string
          nom: string
          observations: string | null
          prenom: string
          puissance_souhaitee_kw: number
          statut: string | null
          telephone: string
          type_logement: string | null
          type_raccordement: string
          ville: string
        }
        Insert: {
          adresse: string
          code_postal: string
          created_at?: string | null
          deja_client?: boolean | null
          email: string
          facture_edis_id?: string | null
          id?: string
          nom: string
          observations?: string | null
          prenom: string
          puissance_souhaitee_kw: number
          statut?: string | null
          telephone: string
          type_logement?: string | null
          type_raccordement: string
          ville: string
        }
        Update: {
          adresse?: string
          code_postal?: string
          created_at?: string | null
          deja_client?: boolean | null
          email?: string
          facture_edis_id?: string | null
          id?: string
          nom?: string
          observations?: string | null
          prenom?: string
          puissance_souhaitee_kw?: number
          statut?: string | null
          telephone?: string
          type_logement?: string | null
          type_raccordement?: string
          ville?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          additional_comments: string | null
          adresse: string
          amount_paid: number | null
          architect_email: string | null
          architect_name: string | null
          architect_phone: string | null
          assigned_to: string | null
          billing_address: string | null
          billing_city: string | null
          billing_postal_code: string | null
          client_type: string
          code_postal: string
          complement_adresse: string | null
          connection_type: string
          created_at: string | null
          created_ip: unknown | null
          custom_request_description: string | null
          desired_timeline: string
          different_billing_address: boolean | null
          email: string
          form_status: string | null
          form_status_detailed: string | null
          has_architect: boolean | null
          id: string
          internal_notes: string | null
          ip_address: unknown | null
          nom: string
          nom_collectivite: string | null
          payment_completed_at: string | null
          payment_status: string | null
          payment_status_detailed: string | null
          power_kva: string | null
          power_type: string
          prenom: string
          project_status: string
          project_type: string
          raison_sociale: string | null
          referrer: string | null
          siren: string | null
          siren_collectivite: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          telephone: string
          terrain_viabilise: boolean | null
          total_amount: number | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          ville: string
        }
        Insert: {
          additional_comments?: string | null
          adresse: string
          amount_paid?: number | null
          architect_email?: string | null
          architect_name?: string | null
          architect_phone?: string | null
          assigned_to?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_postal_code?: string | null
          client_type: string
          code_postal: string
          complement_adresse?: string | null
          connection_type: string
          created_at?: string | null
          created_ip?: unknown | null
          custom_request_description?: string | null
          desired_timeline: string
          different_billing_address?: boolean | null
          email: string
          form_status?: string | null
          form_status_detailed?: string | null
          has_architect?: boolean | null
          id?: string
          internal_notes?: string | null
          ip_address?: unknown | null
          nom: string
          nom_collectivite?: string | null
          payment_completed_at?: string | null
          payment_status?: string | null
          payment_status_detailed?: string | null
          power_kva?: string | null
          power_type: string
          prenom: string
          project_status: string
          project_type: string
          raison_sociale?: string | null
          referrer?: string | null
          siren?: string | null
          siren_collectivite?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          telephone: string
          terrain_viabilise?: boolean | null
          total_amount?: number | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          ville: string
        }
        Update: {
          additional_comments?: string | null
          adresse?: string
          amount_paid?: number | null
          architect_email?: string | null
          architect_name?: string | null
          architect_phone?: string | null
          assigned_to?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_postal_code?: string | null
          client_type?: string
          code_postal?: string
          complement_adresse?: string | null
          connection_type?: string
          created_at?: string | null
          created_ip?: unknown | null
          custom_request_description?: string | null
          desired_timeline?: string
          different_billing_address?: boolean | null
          email?: string
          form_status?: string | null
          form_status_detailed?: string | null
          has_architect?: boolean | null
          id?: string
          internal_notes?: string | null
          ip_address?: unknown | null
          nom?: string
          nom_collectivite?: string | null
          payment_completed_at?: string | null
          payment_status?: string | null
          payment_status_detailed?: string | null
          power_kva?: string | null
          power_type?: string
          prenom?: string
          project_status?: string
          project_type?: string
          raison_sociale?: string | null
          referrer?: string | null
          siren?: string | null
          siren_collectivite?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          telephone?: string
          terrain_viabilise?: boolean | null
          total_amount?: number | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          ville?: string
        }
        Relationships: []
      }
      lead_tracking: {
        Row: {
          event_type: string
          id: string
          ip_address: unknown | null
          step_number: number | null
          submission_id: string | null
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          event_type: string
          id?: string
          ip_address?: unknown | null
          step_number?: number | null
          submission_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          ip_address?: unknown | null
          step_number?: number | null
          submission_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_tracking_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "form_submissions"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "payments_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "form_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_email: {
        Args: { email_to_check: string }
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
