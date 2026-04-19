import { supabase } from '@/shared/lib/supabase'
import { withTimeout } from '@/shared/lib/async'

export async function signIn(email: string, password: string) {
  const { data, error } = await withTimeout(
    supabase.auth.signInWithPassword({ email: email.trim(), password }),
    20_000, 'autenticación',
  )
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, displayName: string) {
  const { data, error } = await withTimeout(
    supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName.trim() } },
    }),
    20_000, 'registro',
  )
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function validateCoupleCode(code: string) {
  const { data, error } = await withTimeout(
    supabase.rpc('validate_couple_code', { p_code: code.toUpperCase().trim() }),
    10_000, 'validación',
  )
  if (error) throw error
  return data as { valid: boolean; already_full: boolean; user1_name?: string; user2_name?: string; start_date?: string }
}

export async function createCoupleAndJoin(args: { user1Name: string; user2Name: string; startDate: string }) {
  const { data, error } = await withTimeout(
    supabase.rpc('create_couple_and_join', {
      p_user1_name: args.user1Name,
      p_user2_name: args.user2Name,
      p_start_date: args.startDate,
    }),
    15_000, 'creación de pareja',
  )
  if (error) throw error
  return data as { couple_id: string; couple_code: string }
}

export async function joinCoupleByCode(code: string, myName: string) {
  const { data, error } = await withTimeout(
    supabase.rpc('join_couple_by_code', {
      p_code: code.toUpperCase().trim(),
      p_my_name: myName,
    }),
    15_000, 'unión a pareja',
  )
  if (error) throw error
  return data as { couple_id: string }
}
