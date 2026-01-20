/**
 * User Provisioning CLI Script
 * 
 * This script creates users in bulk from a CSV file.
 * It creates both auth.users and user_profiles records.
 * 
 * Usage: npx ts-node scripts/provision-users.ts <csv-file>
 * 
 * CSV Format (with header):
 * nik,email,name
 * 12345678,john@ikea.com,John Doe
 * 87654321,jane@ikea.com,Jane Smith
 * 
 * Requirements:
 * - SUPABASE_URL environment variable
 * - SUPABASE_SERVICE_ROLE_KEY environment variable (NOT anon key!)
 * 
 * The script will:
 * 1. Create auth.users with temporary password "P@ssw0rd"
 * 2. Create user_profiles with password_changed=false, profile_completed=false
 * 3. Log success/failure for each user
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Configuration
const TEMPORARY_PASSWORD = 'P@ssw0rd'
const DEFAULT_WEIGHT = 70
const DEFAULT_HEIGHT = 170
const DEFAULT_AGE = 30
const DEFAULT_GENDER = 'male'

// Check for required environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
    console.error('❌ Error: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable is required')
    process.exit(1)
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required')
    console.error('   This is different from the anon key. Get it from Supabase Dashboard > Settings > API > service_role key')
    process.exit(1)
}

// Create Supabase admin client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

interface UserRecord {
    nik: string
    email: string
    name: string
}

interface ProvisionResult {
    nik: string
    email: string
    name: string
    success: boolean
    error?: string
}

/**
 * Parse CSV file into user records
 */
function parseCSV(filePath: string): UserRecord[] {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.trim().split('\n')

    if (lines.length < 2) {
        throw new Error('CSV file must have a header row and at least one data row')
    }

    // Parse header
    const header = lines[0].toLowerCase().split(',').map(h => h.trim())
    const nikIndex = header.indexOf('nik')
    const emailIndex = header.indexOf('email')
    const nameIndex = header.indexOf('name')

    if (nikIndex === -1 || emailIndex === -1 || nameIndex === -1) {
        throw new Error('CSV must have columns: nik, email, name')
    }

    // Parse data rows
    const users: UserRecord[] = []
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values = line.split(',').map(v => v.trim())

        const nik = values[nikIndex]
        const email = values[emailIndex]
        const name = values[nameIndex]

        if (!nik || !email || !name) {
            console.warn(`⚠️  Skipping line ${i + 1}: missing required fields`)
            continue
        }

        // Validate email format
        if (!email.includes('@')) {
            console.warn(`⚠️  Skipping line ${i + 1}: invalid email format "${email}"`)
            continue
        }

        users.push({ nik, email, name })
    }

    return users
}

/**
 * Provision a single user
 */
async function provisionUser(user: UserRecord): Promise<ProvisionResult> {
    const { nik, email, name } = user

    try {
        // Step 1: Create auth.users using admin API
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: TEMPORARY_PASSWORD,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                nik,
                name
            }
        })

        if (authError) {
            // Check if user already exists
            if (authError.message.includes('already been registered') || authError.message.includes('already exists')) {
                return { nik, email, name, success: false, error: 'Email already registered' }
            }
            return { nik, email, name, success: false, error: authError.message }
        }

        if (!authData.user) {
            return { nik, email, name, success: false, error: 'No user returned from auth' }
        }

        // Step 2: Create user_profiles record
        const { error: profileError } = await supabase
            .from('user_profiles')
            .upsert({
                user_id: authData.user.id,
                nik,
                email,
                name,
                weight: DEFAULT_WEIGHT,
                height: DEFAULT_HEIGHT,
                age: DEFAULT_AGE,
                gender: DEFAULT_GENDER,
                target_calories: 0,
                total_calories: 0,
                password_changed: false, // User must change password on first login
                profile_completed: false, // User must complete profile on first login
            }, { onConflict: 'user_id' })

        if (profileError) {
            console.warn(`⚠️  Auth created but profile failed for ${email}: ${profileError.message}`)
            // Don't fail the whole operation, auth user is created
        }

        return { nik, email, name, success: true }

    } catch (error) {
        return {
            nik,
            email,
            name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2)

    if (args.length === 0) {
        console.log(`
╔════════════════════════════════════════════════════════════════╗
║             User Provisioning CLI Script                       ║
╚════════════════════════════════════════════════════════════════╝

Usage: npx ts-node scripts/provision-users.ts <csv-file>

CSV Format (with header row):
  nik,email,name
  12345678,john@ikea.com,John Doe
  87654321,jane@ikea.com,Jane Smith

Example:
  npx ts-node scripts/provision-users.ts scripts/sample-users.csv

Notes:
  • Temporary password for all users: ${TEMPORARY_PASSWORD}
  • Users must change password on first login
  • Users must complete profile onboarding on first login
`)
        process.exit(0)
    }

    const csvFile = args[0]
    const csvPath = path.isAbsolute(csvFile) ? csvFile : path.join(process.cwd(), csvFile)

    // Check if file exists
    if (!fs.existsSync(csvPath)) {
        console.error(`❌ Error: File not found: ${csvPath}`)
        process.exit(1)
    }

    console.log(`
╔════════════════════════════════════════════════════════════════╗
║             User Provisioning CLI Script                       ║
╚════════════════════════════════════════════════════════════════╝
`)
    console.log(`📂 Reading CSV file: ${csvPath}`)

    // Parse CSV
    let users: UserRecord[]
    try {
        users = parseCSV(csvPath)
    } catch (error) {
        console.error(`❌ Error parsing CSV: ${error instanceof Error ? error.message : error}`)
        process.exit(1)
    }

    if (users.length === 0) {
        console.error('❌ No valid users found in CSV')
        process.exit(1)
    }

    console.log(`👥 Found ${users.length} user(s) to provision\n`)
    console.log('─'.repeat(60))

    // Provision users
    const results: ProvisionResult[] = []
    for (let i = 0; i < users.length; i++) {
        const user = users[i]
        console.log(`[${i + 1}/${users.length}] Processing: ${user.name} (${user.nik})...`)

        const result = await provisionUser(user)
        results.push(result)

        if (result.success) {
            console.log(`   ✅ Success: ${user.email}`)
        } else {
            console.log(`   ❌ Failed: ${result.error}`)
        }
    }

    // Summary
    console.log('\n' + '─'.repeat(60))
    console.log('\n📊 SUMMARY\n')

    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    console.log(`   Total:   ${results.length}`)
    console.log(`   Success: ${successful.length} ✅`)
    console.log(`   Failed:  ${failed.length} ❌`)

    if (failed.length > 0) {
        console.log('\n⚠️  Failed Users:')
        failed.forEach(f => {
            console.log(`   • ${f.name} (${f.email}): ${f.error}`)
        })
    }

    if (successful.length > 0) {
        console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ✅ Provisioned users can now login with:                     ║
║                                                                ║
║     NIK: [their NIK]                                           ║
║     Password: ${TEMPORARY_PASSWORD.padEnd(45)}║
║                                                                ║
║  They will be prompted to:                                     ║
║     1. Set a new password                                      ║
║     2. Complete their profile                                  ║
╚════════════════════════════════════════════════════════════════╝
`)
    }

    process.exit(failed.length > 0 ? 1 : 0)
}

// Run
main().catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
})
