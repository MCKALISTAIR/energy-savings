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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      energy_insights: {
        Row: {
          created_at: string
          data: Json
          fuel_type: string
          id: string
          insight_type: string
          period_end: string
          period_start: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          fuel_type: string
          id?: string
          insight_type: string
          period_end: string
          period_start: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          fuel_type?: string
          id?: string
          insight_type?: string
          period_end?: string
          period_start?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exchange_rates: {
        Row: {
          from_currency: string
          id: string
          rate: number
          to_currency: string
          updated_at: string
        }
        Insert: {
          from_currency: string
          id?: string
          rate: number
          to_currency: string
          updated_at?: string
        }
        Update: {
          from_currency?: string
          id?: string
          rate?: number
          to_currency?: string
          updated_at?: string
        }
        Relationships: []
      }
      houses: {
        Row: {
          address: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      smart_meter_data: {
        Row: {
          consumption: number
          cost: number | null
          created_at: string
          id: string
          interval_end: string
          interval_start: string
          meter_serial: string
          meter_type: string
          mpan: string | null
          mprn: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consumption: number
          cost?: number | null
          created_at?: string
          id?: string
          interval_end: string
          interval_start: string
          meter_serial: string
          meter_type: string
          mpan?: string | null
          mprn?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consumption?: number
          cost?: number | null
          created_at?: string
          id?: string
          interval_end?: string
          interval_start?: string
          meter_serial?: string
          meter_type?: string
          mpan?: string | null
          mprn?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      systems: {
        Row: {
          created_at: string
          house_id: string
          id: string
          install_date: string
          is_active: boolean
          name: string
          specifications: Json
          system_cost: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          house_id: string
          id?: string
          install_date: string
          is_active?: boolean
          name: string
          specifications?: Json
          system_cost?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          house_id?: string
          id?: string
          install_date?: string
          is_active?: boolean
          name?: string
          specifications?: Json
          system_cost?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "systems_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      tariff_rates: {
        Row: {
          created_at: string
          fuel_type: string
          id: string
          standing_charge: number
          tariff_code: string
          unit_rate: number
          updated_at: string
          user_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          created_at?: string
          fuel_type: string
          id?: string
          standing_charge: number
          tariff_code: string
          unit_rate: number
          updated_at?: string
          user_id: string
          valid_from: string
          valid_to?: string | null
        }
        Update: {
          created_at?: string
          fuel_type?: string
          id?: string
          standing_charge?: number
          tariff_code?: string
          unit_rate?: number
          updated_at?: string
          user_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          auto_sync_enabled: boolean | null
          created_at: string
          id: string
          last_sync_at: string | null
          octopus_account_number: string | null
          octopus_api_key: string | null
          selected_energy_supplier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_sync_enabled?: boolean | null
          created_at?: string
          id?: string
          last_sync_at?: string | null
          octopus_account_number?: string | null
          octopus_api_key?: string | null
          selected_energy_supplier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_sync_enabled?: boolean | null
          created_at?: string
          id?: string
          last_sync_at?: string | null
          octopus_account_number?: string | null
          octopus_api_key?: string | null
          selected_energy_supplier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicle_pricing_cache: {
        Row: {
          average_price_usd: number
          data_source: string | null
          id: string
          updated_at: string
          vehicle_class: string
        }
        Insert: {
          average_price_usd: number
          data_source?: string | null
          id?: string
          updated_at?: string
          vehicle_class: string
        }
        Update: {
          average_price_usd?: number
          data_source?: string | null
          id?: string
          updated_at?: string
          vehicle_class?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
