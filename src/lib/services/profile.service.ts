import { createClient } from '@/lib/supabase/client'
import type { UserProfile, UserProfileInsert, UserProfileUpdate } from '@/lib/supabase/types'

/**
 * Profile Service
 * Handles user profile CRUD operations and BMR calculations
 */
export const profileService = {
    /**
     * Get user profile by user ID
     */
    async getProfile(userId: string): Promise<UserProfile | null> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows returned - profile doesn't exist
                return null
            }
            throw error
        }
        return data
    },

    /**
     * Get user profile by NIK
     */
    async getProfileByNIK(nik: string): Promise<UserProfile | null> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('nik', nik.trim())
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return null
            }
            throw error
        }
        return data
    },

    /**
     * Create a new user profile
     */
    async createProfile(profile: UserProfileInsert): Promise<UserProfile> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('user_profiles')
            .insert(profile)
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Update an existing user profile
     */
    async updateProfile(userId: string, updates: UserProfileUpdate): Promise<UserProfile> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Upsert user profile (create or update)
     */
    async upsertProfile(profile: UserProfileInsert): Promise<UserProfile> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('user_profiles')
            .upsert(profile, { onConflict: 'user_id' })
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Delete user profile
     */
    async deleteProfile(userId: string): Promise<void> {
        const supabase = createClient()
        const { error } = await supabase
            .from('user_profiles')
            .delete()
            .eq('user_id', userId)

        if (error) throw error
    },

    /**
     * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
     * @returns BMR in calories per day
     */
    calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
        if (gender === 'male') {
            return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
        }
        return Math.round(10 * weight + 6.25 * height - 5 * age - 161)
    },

    /**
     * Calculate weekly calorie target (15% of BMR per session)
     */
    calculateWeeklyTarget(bmr: number): number {
        return Math.round(bmr * 0.15)
    },

    /**
     * Calculate yearly calorie target
     */
    calculateYearlyTarget(bmr: number): number {
        return Math.round(bmr * 0.15 * 52)
    },

    /**
     * Calculate monthly calorie target
     */
    calculateMonthlyTarget(yearlyTarget: number): number {
        return Math.round(yearlyTarget / 12)
    },

    /**
     * Calculate all targets from profile data
     */
    calculateAllTargets(weight: number, height: number, age: number, gender: 'male' | 'female') {
        const bmr = this.calculateBMR(weight, height, age, gender)
        const weeklyTarget = this.calculateWeeklyTarget(bmr)
        const yearlyTarget = this.calculateYearlyTarget(bmr)
        const monthlyTarget = this.calculateMonthlyTarget(yearlyTarget)

        return {
            bmr,
            weeklyTarget,
            monthlyTarget,
            yearlyTarget,
        }
    }
}
