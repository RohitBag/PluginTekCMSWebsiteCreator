'use server'

import { getBaseUrl } from '@/utils/get-url'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function resetUserPassword(email: string) {
    const supabase = await createClient()
    const baseUrl = getBaseUrl()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}auth/callback?next=/profile/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }
    return { success: true }
}

export async function deleteUser(userId: string) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        return { error: "Server Error: Missing SUPABASE_SERVICE_ROLE_KEY. Cannot delete user from Auth." };
    }

    // Use pure supabase-js for admin tasks
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    // Delete from Auth (cascades to profiles if configured, but better to be safe)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}
