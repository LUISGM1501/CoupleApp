import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { Comment } from '@/types/database'
import { useRealtime } from '@/shared/hooks/useRealtime'
import { MOCK, mockDB, mockActions } from '@/shared/lib/mock'

export function useComments(memoryId: string | null | undefined) {
  return useQuery({
    enabled: !!memoryId,
    queryKey: ['comments', memoryId],
    queryFn: async () =>
      MOCK ? mockDB.comments.filter((c) => c.memory_id === memoryId) : api.listComments(memoryId!),
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
    mutationFn: async (v: Parameters<typeof api.createComment>[0]) => {
      if (MOCK) return mockActions.addComment(v.memoryId, v.text)
      return api.createComment(v)
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ['comments', v.memoryId] }),
  })
}

export function useDeleteComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (v: { id: string; memoryId: string }) => {
      if (MOCK) return mockActions.deleteComment(v.id)
      return api.deleteComment(v.id)
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ['comments', v.memoryId] }),
  })
}
