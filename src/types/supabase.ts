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
      players: {
        Row: {
          id: string
          user_id: string
          name: string
          level: number
          max_level: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          level?: number
          max_level: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          level?: number
          max_level?: number
          created_at?: string
        }
      }
      player_stats: {
        Row: {
          player_id: string
          endurance: number
          strength: number
          agility: number
          speed: number
          explosiveness: number
          injury_prevention: number
          smash: number
          defense: number
          serve: number
          stick: number
          slice: number
          drop: number
        }
        Insert: {
          player_id: string
          endurance?: number
          strength?: number
          agility?: number
          speed?: number
          explosiveness?: number
          injury_prevention?: number
          smash?: number
          defense?: number
          serve?: number
          stick?: number
          slice?: number
          drop?: number
        }
        Update: {
          player_id?: string
          endurance?: number
          strength?: number
          agility?: number
          speed?: number
          explosiveness?: number
          injury_prevention?: number
          smash?: number
          defense?: number
          serve?: number
          stick?: number
          slice?: number
          drop?: number
        }
      }
      player_equipment: {
        Row: {
          player_id: string
          equipment_type: string
          equipment_id: string
        }
        Insert: {
          player_id: string
          equipment_type: string
          equipment_id: string
        }
        Update: {
          player_id?: string
          equipment_type?: string
          equipment_id?: string
        }
      }
      facilities: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          level: number
          production_rate: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          level?: number
          production_rate?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          level?: number
          production_rate?: number
          created_at?: string
        }
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
  }
}