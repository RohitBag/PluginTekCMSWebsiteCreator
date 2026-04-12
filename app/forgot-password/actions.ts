'use server'

import { getBaseUrl } from '@/utils/get-url'
import { createClient } from '@/utils/supabase/server'

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const baseUrl = getBaseUrl()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}auth/callback?next=/profile/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
