// src/lib/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
        }
      }
      couples: {
        Row: {
          id: string
          partner1_id: string
          partner2_id: string | null
          status: string
          invitation_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          partner1_id: string
          partner2_id?: string | null
          status: string
          invitation_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          partner1_id?: string
          partner2_id?: string | null
          status?: string
          invitation_code?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      // Any views in your database
    }
    Functions: {
      // Any custom functions
    }
  }
}