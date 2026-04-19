import { supabase } from '@/shared/lib/supabase'
import { withTimeout } from '@/shared/lib/async'
import { slug } from '@/shared/lib/utils'
import type { Couple, Profile } from '@/types/database'

export async function fetchCouple(coupleId: string): Promise<Couple> {
  const { data, error } = await withTimeout(
    supabase.from('couples').select('*').eq('id', coupleId).single(),
    10_000, 'carga de pareja',
  )
  if (error) throw error
  return data as Couple
}

export async function fetchCoupleMembers(coupleId: string): Promise<Profile[]> {
  const { data, error } = await withTimeout(
    supabase.from('profiles').select('*').eq('couple_id', coupleId),
    10_000, 'carga de miembros',
  )
  if (error) throw error
  return (data ?? []) as Profile[]
}

export async function updateMyProfile(updates: Partial<Pick<Profile, 'display_name' | 'photo_url'>>) {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) throw new Error('no_auth')
  const { data, error } = await withTimeout(
    supabase.from('profiles').update(updates).eq('id', u.user.id).select().single(),
    10_000, 'actualización de perfil',
  )
  if (error) throw error
  return data as Profile
}

export async function uploadAvatar(file: File): Promise<string> {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) throw new Error('no_auth')
  const path = `${u.user.id}/${Date.now()}-${slug(file.name)}.jpg`
  const { error: upErr } = await withTimeout(
    supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type }),
    30_000, 'subida de avatar',
  )
  if (upErr) throw upErr
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}
