import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { Comment } from '@/types/database'
import { useRealtime } from '@/shared/hooks/useRealtime'

export function useComments(memoryId: string | null | undefined) {
  return useQuery({
    enabled: !!memoryId,
    queryKey: ['comments', memoryId],
    queryFn: () => api.listComments(memoryId!),
  })
}

export function useCommentsRealtime(memoryId: string | null | undefined) {
  const qc = useQueryClient()
  useRealtime<Comment>({
    table: 'comments',
    filter: memoryId ? `memory_id=eq.${memoryId}` : undefined,
    enabled: !!memoryId,
    onChange: () => qc.invalidateQueries({ queryKey: ['comments', memoryId] }),
  })
}

export function useCreateComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createComment,
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ['comments', v.memoryId] }),
  })
}

export function useDeleteComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id: string; memoryId: string }) => api.deleteComment(v.id),
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ['comments', v.memoryId] }),
  })
}
