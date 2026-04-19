import { supabase } from '@/shared/lib/supabase'
import { withTimeout } from '@/shared/lib/async'
import type { MoodKey } from '@/types/database'

export async function updateMyMood(mood: MoodKey, message?: string | null) {
  const { error } = await withTimeout(
    supabase.rpc('update_my_mood', { p_mood: mood, p_message: message ?? null }),
    10_000, 'cambio de mood',
  )
  if (error) throw error
}
