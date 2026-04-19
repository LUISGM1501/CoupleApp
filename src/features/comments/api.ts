import { supabase } from '@/shared/lib/supabase'
import { withTimeout } from '@/shared/lib/async'
import type { Comment, Profile } from '@/types/database'

export async function listComments(memoryId: string): Promise<Comment[]> {
  const { data, error } = await withTimeout(
    supabase.from('comments')
      .select('*').eq('memory_id', memoryId)
      .order('created_at', { ascending: true }),
    10_000, 'carga de comentarios',
  )
  if (error) throw error
  return (data ?? []) as Comment[]
}

interface CreateCommentInput {
  memoryId: string
  text: string
  author: Pick<Profile, 'id' | 'display_name' | 'photo_url'>
}

export async function createComment(input: CreateCommentInput): Promise<Comment> {
  const { data, error } = await withTimeout(
    supabase.from('comments').insert({
      memory_id: input.memoryId,
      author_id: input.author.id,
      author_name: input.author.display_name,
      author_photo_url: input.author.photo_url,
      text: input.text.trim(),
    }).select().single(),
    10_000, 'envío de comentario',
  )
  if (error) throw error
  return data as Comment
}

export async function deleteComment(id: string) {
  const { error } = await withTimeout(
    supabase.from('comments').delete().eq('id', id),
    10_000, 'eliminación',
  )
  if (error) throw error
}
