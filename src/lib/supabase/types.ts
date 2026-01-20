/**
 * Supabase Database Types
 * Auto-generated from Supabase schema via mcp_supabase_generate_typescript_types
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            activities: {
                Row: {
                    activity_date: string
                    calories: number
                    created_at: string
                    distance: number
                    id: string
                    location: string
                    photo_url: string | null
                    user_id: string
                }
                Insert: {
                    activity_date: string
                    calories: number
                    created_at?: string
                    distance: number
                    id?: string
                    location: string
                    photo_url?: string | null
                    user_id: string
                }
                Update: {
                    activity_date?: string
                    calories?: number
                    created_at?: string
                    distance?: number
                    id?: string
                    location?: string
                    photo_url?: string | null
                    user_id?: string
                }
                Relationships: []
            }
            user_profiles: {
                Row: {
                    age: number
                    avatar_url: string | null
                    created_at: string
                    email: string | null
                    gender: string
                    height: number
                    id: string
                    name: string
                    nik: string | null
                    password_changed: boolean
                    profile_completed: boolean
                    target_calories: number
                    total_calories: number
                    updated_at: string
                    user_id: string
                    weight: number
                }
                Insert: {
                    age: number
                    avatar_url?: string | null
                    created_at?: string
                    email?: string | null
                    gender: string
                    height: number
                    id?: string
                    name: string
                    nik?: string | null
                    password_changed?: boolean
                    profile_completed?: boolean
                    target_calories?: number
                    total_calories?: number
                    updated_at?: string
                    user_id: string
                    weight: number
                }
                Update: {
                    age?: number
                    avatar_url?: string | null
                    created_at?: string
                    email?: string | null
                    gender?: string
                    height?: number
                    id?: string
                    name?: string
                    nik?: string | null
                    password_changed?: boolean
                    profile_completed?: boolean
                    target_calories?: number
                    total_calories?: number
                    updated_at?: string
                    user_id?: string
                    weight?: number
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

// ============================================================
// Convenience Types
// ============================================================

// Table Row types (for reading data)
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Activity = Database['public']['Tables']['activities']['Row']

// Table Insert types (for creating data)
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type ActivityInsert = Database['public']['Tables']['activities']['Insert']

// Table Update types (for updating data)
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
export type ActivityUpdate = Database['public']['Tables']['activities']['Update']

// Gender enum type
export type Gender = 'male' | 'female'

// Helper type for Tables utility
type PublicSchema = Database['public']

export type Tables<
    TableName extends keyof PublicSchema['Tables']
> = PublicSchema['Tables'][TableName]['Row']

export type TablesInsert<
    TableName extends keyof PublicSchema['Tables']
> = PublicSchema['Tables'][TableName]['Insert']

export type TablesUpdate<
    TableName extends keyof PublicSchema['Tables']
> = PublicSchema['Tables'][TableName]['Update']
