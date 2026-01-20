import { createClient } from '@/lib/supabase/client'

// Constants
const BUCKET_NAME = 'activity-photos'
const AVATARS_BUCKET = 'avatars'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * Storage Service
 * Handles file uploads to Supabase Storage
 */
export const storageService = {
    /**
     * Validate file type
     */
    validateFileType(file: File): boolean {
        return ALLOWED_TYPES.includes(file.type)
    },

    /**
     * Validate file size
     */
    validateFileSize(file: File): boolean {
        return file.size <= MAX_FILE_SIZE
    },

    /**
     * Validate file (type and size)
     */
    validateFile(file: File): { valid: boolean; error?: string } {
        if (!this.validateFileType(file)) {
            return {
                valid: false,
                error: `Tipe file tidak didukung. Gunakan: ${ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')}`
            }
        }
        if (!this.validateFileSize(file)) {
            return {
                valid: false,
                error: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB`
            }
        }
        return { valid: true }
    },

    /**
     * Upload a photo file
     */
    async uploadPhoto(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
        const validation = this.validateFile(file)
        if (!validation.valid) {
            return { url: null, error: validation.error! }
        }

        const supabase = createClient()
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}.${fileExt}`

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Upload error:', error)
            return { url: null, error: 'Gagal mengupload foto. Silakan coba lagi.' }
        }

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName)

        return { url: publicUrl, error: null }
    },

    /**
     * Upload a base64-encoded photo
     */
    async uploadBase64Photo(userId: string, base64: string): Promise<{ url: string | null; error: string | null }> {
        try {
            // Convert base64 to blob
            const response = await fetch(base64)
            const blob = await response.blob()

            // Check size
            if (blob.size > MAX_FILE_SIZE) {
                return {
                    url: null,
                    error: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB`
                }
            }

            const supabase = createClient()
            const fileName = `${userId}/${Date.now()}.jpg`

            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, blob, {
                    contentType: 'image/jpeg',
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                console.error('Upload error:', error)
                return { url: null, error: 'Gagal mengupload foto. Silakan coba lagi.' }
            }

            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName)

            return { url: publicUrl, error: null }
        } catch (err) {
            console.error('Base64 upload error:', err)
            return { url: null, error: 'Gagal memproses foto. Silakan coba lagi.' }
        }
    },

    /**
     * Delete a photo by URL
     */
    async deletePhoto(photoUrl: string): Promise<{ success: boolean; error: string | null }> {
        try {
            const supabase = createClient()

            // Extract path from URL
            const urlParts = photoUrl.split(`/${BUCKET_NAME}/`)
            if (urlParts.length !== 2) {
                return { success: false, error: 'URL foto tidak valid' }
            }

            const path = urlParts[1]

            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([path])

            if (error) {
                console.error('Delete error:', error)
                return { success: false, error: 'Gagal menghapus foto' }
            }

            return { success: true, error: null }
        } catch (err) {
            console.error('Delete photo error:', err)
            return { success: false, error: 'Gagal menghapus foto' }
        }
    },

    /**
     * Get public URL for a file path
     */
    getPhotoUrl(path: string): string {
        const supabase = createClient()
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(path)

        return publicUrl
    },

    /**
     * List all photos for a user
     */
    async listUserPhotos(userId: string): Promise<string[]> {
        const supabase = createClient()

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(userId)

        if (error) {
            console.error('List error:', error)
            return []
        }

        return data?.map(file => this.getPhotoUrl(`${userId}/${file.name}`)) ?? []
    },

    /**
     * Upload avatar to avatars bucket
     */
    async uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
        const validation = this.validateFile(file)
        if (!validation.valid) {
            return { url: null, error: validation.error! }
        }

        const supabase = createClient()
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}.${fileExt}`

        const { error } = await supabase.storage
            .from(AVATARS_BUCKET)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Avatar upload error:', error)
            return { url: null, error: 'Gagal mengupload avatar. Silakan coba lagi.' }
        }

        const { data: { publicUrl } } = supabase.storage
            .from(AVATARS_BUCKET)
            .getPublicUrl(fileName)

        return { url: publicUrl, error: null }
    },

    /**
     * Delete avatar by URL
     */
    async deleteAvatar(avatarUrl: string): Promise<{ success: boolean; error: string | null }> {
        try {
            const supabase = createClient()

            // Extract path from URL
            const urlParts = avatarUrl.split(`/${AVATARS_BUCKET}/`)
            if (urlParts.length !== 2) {
                return { success: false, error: 'URL avatar tidak valid' }
            }

            const path = urlParts[1]

            const { error } = await supabase.storage
                .from(AVATARS_BUCKET)
                .remove([path])

            if (error) {
                console.error('Avatar delete error:', error)
                return { success: false, error: 'Gagal menghapus avatar' }
            }

            return { success: true, error: null }
        } catch (err) {
            console.error('Delete avatar error:', err)
            return { success: false, error: 'Gagal menghapus avatar' }
        }
    }
}
