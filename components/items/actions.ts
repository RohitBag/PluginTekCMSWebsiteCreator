'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBookmark(itemId: number) {
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Check if exists
    const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .single()

    if (existing) {
        // Delete
        await supabase.from('bookmarks').delete().eq('id', existing.id)
        revalidatePath('/', 'layout')
        return { action: 'removed' }
    } else {
        // Create
        // Note: user.id from auth.users needs to exist in profiles. 
        // Our trigger ensures profiles exist.
        const { error } = await supabase.from('bookmarks').insert({
            user_id: user.id,
            item_id: itemId
        })

        if (error) return { error: error.message }
        revalidatePath('/', 'layout')
        return { action: 'added' }
    }
}
