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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      authors: {
        Row: {
          created_at: string
          is_approved: boolean
          pen_name: string | null
          profile_id: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          is_approved?: boolean
          pen_name?: string | null
          profile_id: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          is_approved?: boolean
          pen_name?: string | null
          profile_id?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          image_url: string
          is_active: boolean
          link_url: string | null
          position: string
          sort_order: number
          starts_at: string | null
          subtitle: string | null
          title: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string | null
          position?: string
          sort_order?: number
          starts_at?: string | null
          subtitle?: string | null
          title: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string | null
          position?: string
          sort_order?: number
          starts_at?: string | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          age: string | null
          appearance: string | null
          bio: string | null
          created_at: string
          id: string
          is_public: boolean
          name: string
          occupation: string | null
          personality: string | null
          portrait_prompt: string | null
          portrait_url: string | null
          role: string
          sort_order: number
          story_id: string
          updated_at: string
        }
        Insert: {
          age?: string | null
          appearance?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          name: string
          occupation?: string | null
          personality?: string | null
          portrait_prompt?: string | null
          portrait_url?: string | null
          role?: string
          sort_order?: number
          story_id: string
          updated_at?: string
        }
        Update: {
          age?: string | null
          appearance?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          name?: string
          occupation?: string | null
          personality?: string | null
          portrait_prompt?: string | null
          portrait_url?: string | null
          role?: string
          sort_order?: number
          story_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      chapter_contents: {
        Row: {
          chapter_id: string
          content: string
          updated_at: string
        }
        Insert: {
          chapter_id: string
          content: string
          updated_at?: string
        }
        Update: {
          chapter_id?: string
          content?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_contents_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: true
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          created_at: string
          id: string
          is_free: boolean
          is_published: boolean
          number: number
          price_cents: number | null
          published_at: string | null
          reads_count: number
          story_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_free?: boolean
          is_published?: boolean
          number: number
          price_cents?: number | null
          published_at?: string | null
          reads_count?: number
          story_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_free?: boolean
          is_published?: boolean
          number?: number
          price_cents?: number | null
          published_at?: string | null
          reads_count?: number
          story_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          chapter_id: string | null
          content: string
          created_at: string
          id: string
          is_hidden: boolean
          parent_id: string | null
          story_id: string
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          parent_id?: string | null
          story_id: string
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          parent_id?: string | null
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      payment_audit: {
        Row: {
          action: string
          admin_id: string | null
          amount_cents: number
          created_at: string
          id: string
          order_id: string
          reason: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          amount_cents?: number
          created_at?: string
          id?: string
          order_id: string
          reason?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          amount_cents?: number
          created_at?: string
          id?: string
          order_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_audit_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_audit_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          author_id: string | null
          chapter_id: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["purchase_kind"]
          paid_at: string | null
          payment_method: string
          payment_ref: string | null
          platform_commission_ppm: number
          price_cents: number
          price_coins: number
          proof_path: string | null
          reference: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["purchase_status"]
          story_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          author_id?: string | null
          chapter_id?: string | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["purchase_kind"]
          paid_at?: string | null
          payment_method?: string
          payment_ref?: string | null
          platform_commission_ppm?: number
          price_cents?: number
          price_coins?: number
          proof_path?: string | null
          reference?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["purchase_status"]
          story_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          author_id?: string | null
          chapter_id?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["purchase_kind"]
          paid_at?: string | null
          payment_method?: string
          payment_ref?: string | null
          platform_commission_ppm?: number
          price_cents?: number
          price_coins?: number
          proof_path?: string | null
          reference?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["purchase_status"]
          story_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          created_at: string
          rating: number
          story_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          rating: number
          story_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          rating?: number
          story_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_progress: {
        Row: {
          chapter_id: string | null
          chapter_number: number
          completed: boolean
          id: string
          last_read_at: string
          progress: number
          story_id: string
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          chapter_number?: number
          completed?: boolean
          id?: string
          last_read_at?: string
          progress?: number
          story_id: string
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          chapter_number?: number
          completed?: boolean
          id?: string
          last_read_at?: string
          progress?: number
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          chapter_id: string | null
          comment_id: string | null
          created_at: string
          details: string | null
          id: string
          reason: string
          reporter_id: string
          status: Database["public"]["Enums"]["report_status"]
          story_id: string | null
          target: Database["public"]["Enums"]["report_target"]
        }
        Insert: {
          chapter_id?: string | null
          comment_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reporter_id: string
          status?: Database["public"]["Enums"]["report_status"]
          story_id?: string | null
          target: Database["public"]["Enums"]["report_target"]
        }
        Update: {
          chapter_id?: string | null
          comment_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          status?: Database["public"]["Enums"]["report_status"]
          story_id?: string | null
          target?: Database["public"]["Enums"]["report_target"]
        }
        Relationships: [
          {
            foreignKeyName: "reports_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_id: string
          category_id: string | null
          completion: Database["public"]["Enums"]["story_completion"]
          cover_url: string | null
          created_at: string
          id: string
          is_featured: boolean
          is_free: boolean
          preview_min: number
          preview_percent: number
          price_cents: number | null
          published_at: string | null
          rating_avg: number
          rating_count: number
          reads_count: number
          slug: string
          status: Database["public"]["Enums"]["story_status"]
          synopsis: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category_id?: string | null
          completion?: Database["public"]["Enums"]["story_completion"]
          cover_url?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          is_free?: boolean
          preview_min?: number
          preview_percent?: number
          price_cents?: number | null
          published_at?: string | null
          rating_avg?: number
          rating_count?: number
          reads_count?: number
          slug: string
          status?: Database["public"]["Enums"]["story_status"]
          synopsis: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category_id?: string | null
          completion?: Database["public"]["Enums"]["story_completion"]
          cover_url?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          is_free?: boolean
          preview_min?: number
          preview_percent?: number
          price_cents?: number | null
          published_at?: string | null
          rating_avg?: number
          rating_count?: number
          reads_count?: number
          slug?: string
          status?: Database["public"]["Enums"]["story_status"]
          synopsis?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_tags: {
        Row: {
          story_id: string
          tag_id: string
        }
        Insert: {
          story_id: string
          tag_id: string
        }
        Update: {
          story_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_tags_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          payment_ref: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          payment_ref?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          payment_ref?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["user_id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          currency: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          currency?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          currency?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_payment_order: { Args: { p_order_id: string }; Returns: boolean }
      create_payment_order: {
        Args: { p_chapter_id?: string; p_story_id: string }
        Returns: {
          chapter_id: string
          id: string
          kind: Database["public"]["Enums"]["purchase_kind"]
          price_cents: number
          reference: string
          story_id: string
        }[]
      }
      gen_payment_reference: { Args: never; Returns: string }
      has_access: { Args: { p_chapter_id: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      story_preview_limit: { Args: { p_story_id: string }; Returns: number }
      record_read: {
        Args: { p_chapter_id: string; p_story_id: string }
        Returns: undefined
      }
      reject_payment_order: {
        Args: { p_order_id: string; p_reason: string }
        Returns: boolean
      }
      submit_payment_proof: {
        Args: { p_order_id: string; p_payment_ref: string; p_proof_path?: string }
        Returns: Database["public"]["Enums"]["purchase_status"]
      }
      search_stories: {
        Args: {
          p_category_id?: string
          p_completion?: string
          p_free_only?: boolean
          p_limit?: number
          p_offset?: number
          p_query?: string
          p_sort?: string
        }
        Returns: {
          author_id: string
          category_id: string | null
          completion: Database["public"]["Enums"]["story_completion"]
          cover_url: string | null
          created_at: string
          id: string
          is_featured: boolean
          is_free: boolean
          published_at: string | null
          rating_avg: number
          rating_count: number
          reads_count: number
          slug: string
          status: Database["public"]["Enums"]["story_status"]
          synopsis: string
          title: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "stories"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      notification_type: "system" | "chapter" | "comment" | "promotion"
      purchase_kind: "story" | "chapter"
      purchase_status: "pending" | "completed" | "refunded" | "failed"
      report_status: "open" | "reviewing" | "resolved" | "dismissed"
      report_target: "story" | "chapter" | "comment"
      story_completion: "ongoing" | "complete"
      story_status: "draft" | "pending" | "published" | "rejected"
      transaction_type: "topup" | "unlock" | "refund" | "earning" | "withdrawal"
      user_role: "reader" | "author" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      notification_type: ["system", "chapter", "comment", "promotion"],
      purchase_kind: ["story", "chapter"],
      purchase_status: ["pending", "completed", "refunded", "failed"],
      report_status: ["open", "reviewing", "resolved", "dismissed"],
      report_target: ["story", "chapter", "comment"],
      story_completion: ["ongoing", "complete"],
      story_status: ["draft", "pending", "published", "rejected"],
      transaction_type: ["topup", "unlock", "refund", "earning", "withdrawal"],
      user_role: ["reader", "author", "admin"],
    },
  },
} as const
