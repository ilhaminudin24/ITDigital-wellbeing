/**
 * Supabase Client Exports
 * Central export point for all Supabase utilities
 */

// Client exports
export { createClient } from './client'
export { createClient as createServerClient } from './server'
export { createMiddlewareClient, updateResponseWithCookies } from './middleware'

// Type exports
export type {
    Database,
    UserProfile,
    UserProfileInsert,
    UserProfileUpdate,
    Activity,
    ActivityInsert,
    ActivityUpdate,
    Gender,
    Tables,
    TablesInsert,
    TablesUpdate,
    Json,
} from './types'
