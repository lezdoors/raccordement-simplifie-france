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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      billing_addresses: {
        Row: {
          address: string
          city: string
          country: string | null
          customer_id: string
          id: string
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          country?: string | null
          customer_id: string
          id?: string
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          country?: string | null
          customer_id?: string
          id?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          error: string | null
          id: string
          latency_ms: number | null
          retrieved_doc_ids: string[] | null
          role: string
          session_id: string
          tokens_in: number | null
          tokens_out: number | null
        }
        Insert: {
          content: string
          created_at?: string
          error?: string | null
          id?: string
          latency_ms?: number | null
          retrieved_doc_ids?: string[] | null
          role: string
          session_id: string
          tokens_in?: number | null
          tokens_out?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          error?: string | null
          id?: string
          latency_ms?: number | null
          retrieved_doc_ids?: string[] | null
          role?: string
          session_id?: string
          tokens_in?: number | null
          tokens_out?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          lead_id: string | null
          session_data: Json | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          session_data?: Json | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          session_data?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          auth_user_id: string | null
          client_type: string | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          siren: string | null
        }
        Insert: {
          auth_user_id?: string | null
          client_type?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          siren?: string | null
        }
        Update: {
          auth_user_id?: string | null
          client_type?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          siren?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          id: string
          kind: string | null
          path: string
          request_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string | null
          path: string
          request_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string | null
          path?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          id: number
          name: string
          payload: Json | null
          request_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          payload?: Json | null
          request_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          payload?: Json | null
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_docs: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          id: string
          metadata: Json | null
          title: string
          updated_at: string
          url: string
          xai_doc_id: string | null
        }
        Insert: {
          chunk_index?: number
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string
          url: string
          xai_doc_id?: string | null
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string
          url?: string
          xai_doc_id?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          ab_variant: string | null
          billing: string | null
          created_at: string
          customer_id: string | null
          email: string
          full_name: string | null
          gclid: string | null
          id: string
          page: string | null
          payment_status: string | null
          phone: string | null
          postal_code: string | null
          power: string | null
          service: string | null
          source: string | null
          status: string | null
          type_client: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          ab_variant?: string | null
          billing?: string | null
          created_at?: string
          customer_id?: string | null
          email: string
          full_name?: string | null
          gclid?: string | null
          id?: string
          page?: string | null
          payment_status?: string | null
          phone?: string | null
          postal_code?: string | null
          power?: string | null
          service?: string | null
          source?: string | null
          status?: string | null
          type_client?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          ab_variant?: string | null
          billing?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string
          full_name?: string | null
          gclid?: string | null
          id?: string
          page?: string | null
          payment_status?: string | null
          phone?: string | null
          postal_code?: string | null
          power?: string | null
          service?: string | null
          source?: string | null
          status?: string | null
          type_client?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string | null
          currency: string
          id: string
          lead_id: string | null
          paid: boolean
          raw: Json | null
          request_id: string | null
          stripe_session_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string | null
          currency?: string
          id?: string
          lead_id?: string | null
          paid?: boolean
          raw?: Json | null
          request_id?: string | null
          stripe_session_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string | null
          currency?: string
          id?: string
          lead_id?: string | null
          paid?: boolean
          raw?: Json | null
          request_id?: string | null
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_events: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string | null
          id: string
          kind: string
          lead_id: string | null
          payload: Json | null
          request_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type?: string | null
          id?: string
          kind: string
          lead_id?: string | null
          payload?: Json | null
          request_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string | null
          id?: string
          kind?: string
          lead_id?: string | null
          payload?: Json | null
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_events_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          customer_id: string
          desired_start_date: string | null
          id: string
          is_viabilise: boolean | null
          lead_id: string | null
          notes: string | null
          payload: Json | null
          payment_status: string | null
          phase: string | null
          power_kva: number | null
          source: string | null
          status: Database["public"]["Enums"]["request_status"]
          type_raccordement: string | null
          usage: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          customer_id: string
          desired_start_date?: string | null
          id?: string
          is_viabilise?: boolean | null
          lead_id?: string | null
          notes?: string | null
          payload?: Json | null
          payment_status?: string | null
          phase?: string | null
          power_kva?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          type_raccordement?: string | null
          usage?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          customer_id?: string
          desired_start_date?: string | null
          id?: string
          is_viabilise?: boolean | null
          lead_id?: string | null
          notes?: string | null
          payload?: Json | null
          payment_status?: string | null
          phase?: string | null
          power_kva?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          type_raccordement?: string | null
          usage?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      crm_activities: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string | null
          lead_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string | null
          lead_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string | null
          lead_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_full_request: {
        Args: { payload: Json }
        Returns: string
      }
    }
    Enums: {
      request_status:
        | "draft"
        | "submitted"
        | "in_review"
        | "validated"
        | "scheduled"
        | "completed"
        | "cancelled"
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
    Enums: {
      request_status: [
        "draft",
        "submitted",
        "in_review",
        "validated",
        "scheduled",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
