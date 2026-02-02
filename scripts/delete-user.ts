/**
 * User Deletion CLI Script
 * 
 * This script deletes a user by email from auth.users.
 * Due to ON DELETE CASCADE settings in the schema, this will automatically
 * remove related records in public.user_profiles and public.activities.
 * 
 * Usage: npx ts-node scripts/delete-user.ts <email>
 */

import { createClient } from '@supabase/supabase-js'

// Check for required environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
    console.error('❌ Error: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable is required')
    process.exit(1)
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required')
    process.exit(1)
}

// Create Supabase admin client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function main() {
    const args = process.argv.slice(2)

    if (args.length === 0) {
        console.log(`
Usage: npx ts-node scripts/delete-user.ts <email>

Example:
  npx ts-node scripts/delete-user.ts john@example.com
`)
        process.exit(0)
    }

    const email = args[0]

    console.log(`🔍 Looking for user with email: ${email}...`)

    // 1. Find user ID by email (Admin API)
    // There isn't a direct "getUserByEmail" in admin api that returns just ID easily without list users
    // But listUsers allows filtering? No, listUsers doesn't support email filter widely.
    // However, clean way is asking auth.users via admin.

    // Actually, deleteUser requires a UID (User ID), not email.
    // So we need to find the ID first.

    // Simplest way is creating a client and using listUsers (might be slow if many users)
    // Or, we can use RPC if we had it, but we don't.
    // Wait, admin.listUsers() is fine.

    // Actually, we can assume the email is unique.

    // Alternatively, we can use the public table `user_profiles` to find the user_id if they have a profile!
    const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('email', email)
        .single()

    let userId: string | null = null;

    if (profile && profile.user_id) {
        console.log(`✅ Found user in profiles. ID: ${profile.user_id}`)
        userId = profile.user_id
    } else {
        console.log('⚠️  User not found in user_profiles. Searching in Auth users (this might take a moment)...')
        // Fallback: search all users (pagination might be needed in prod, but fine for now)
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 })

        if (listError) {
            console.error('❌ Error listing users:', listError.message)
            process.exit(1)
        }

        const foundUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase())
        if (foundUser) {
            userId = foundUser.id
            console.log(`✅ Found user in Auth. ID: ${userId}`)
        }
    }

    if (!userId) {
        console.error(`❌ User with email "${email}" not found.`)
        process.exit(1)
    }

    // 2. Delete User
    console.log(`🗑️  Deleting user ${email} (ID: ${userId})...`)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)

    if (deleteError) {
        console.error(`❌ Failed to delete user: ${deleteError.message}`)
        process.exit(1)
    }

    console.log(`✅ User ${email} deleted successfully!`)
    console.log(`   (Related data in user_profiles and activities should be automatically removed via Cascade)`)
}

main().catch(console.error)
