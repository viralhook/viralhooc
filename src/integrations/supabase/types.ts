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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_feed: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          niche: string | null
          platform: string | null
          user_display_name: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          niche?: string | null
          platform?: string | null
          user_display_name: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          niche?: string | null
          platform?: string | null
          user_display_name?: string
        }
        Relationships: []
      }
      content_calendar: {
        Row: {
          created_at: string | null
          id: string
          idea_id: string | null
          notes: string | null
          platform: string
          scheduled_date: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          idea_id?: string | null
          notes?: string | null
          platform: string
          scheduled_date: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          idea_id?: string | null
          notes?: string | null
          platform?: string
          scheduled_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_calendar_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "saved_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_purchases: {
        Row: {
          amount_paid: number
          created_at: string | null
          credits: number
          id: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          credits: number
          id?: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          credits?: number
          id?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits_remaining: number
          display_name: string | null
          email_notifications_credits: boolean | null
          email_notifications_features: boolean | null
          email_notifications_referrals: boolean | null
          id: string
          is_premium: boolean
          lifetime_access: boolean | null
          referral_code: string | null
          referral_count: number
          referred_by: string | null
          stripe_customer_id: string | null
          total_ideas_generated: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits_remaining?: number
          display_name?: string | null
          email_notifications_credits?: boolean | null
          email_notifications_features?: boolean | null
          email_notifications_referrals?: boolean | null
          id?: string
          is_premium?: boolean
          lifetime_access?: boolean | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
          stripe_customer_id?: string | null
          total_ideas_generated?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits_remaining?: number
          display_name?: string | null
          email_notifications_credits?: boolean | null
          email_notifications_features?: boolean | null
          email_notifications_referrals?: boolean | null
          id?: string
          is_premium?: boolean
          lifetime_access?: boolean | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
          stripe_customer_id?: string | null
          total_ideas_generated?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_ideas: {
        Row: {
          ai_prompt: string
          created_at: string
          goal: string
          hashtags: string[]
          hook: string
          id: string
          niche: string
          platform: string
          storyline: string
          title: string
          user_id: string
        }
        Insert: {
          ai_prompt: string
          created_at?: string
          goal: string
          hashtags: string[]
          hook: string
          id?: string
          niche: string
          platform: string
          storyline: string
          title: string
          user_id: string
        }
        Update: {
          ai_prompt?: string
          created_at?: string
          goal?: string
          hashtags?: string[]
          hook?: string
          id?: string
          niche?: string
          platform?: string
          storyline?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: { Args: never; Returns: string }
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
