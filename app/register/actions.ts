'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const full_name = formData.get('full_name') as string;
    const phone = formData.get('phone') as string; // Standard Auth metadata usually doesn't store phone easily unless we map it.

    // We store extended data in raw_user_meta_data so our trigger can read it
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: full_name,
                phone: phone, // Pass custom data here
            }
        }
    })

    if (error) {
        return { error: error.message }
    }

    // Note: If email confirmation is enabled, we show success message.
    // If disabled, user acts as logged in. We handle "success" state in UI.
}
