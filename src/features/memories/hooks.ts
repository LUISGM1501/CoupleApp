import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { Memory } from '@/types/database'
import { useRealtime } from '@/shared/hooks/useRealtime'

export function useMemories(coupleId: string | null | undefined) {
  return useQuery({
    enabled: !!coupleId,
    queryKey: ['memories', coupleId],
    queryFn: () => api.listMemories(coupleId!),
  })
}

export function useMemory(id: string | null | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: ['memory', id],
    queryFn: () => api.getMemory(id!),
  })
}

export function useMemoriesRealtime(coupleId: string | null | undefined) {
  const qc = useQueryClient()
  useRealtime<Memory>({
    table: 'memories',
    filter: coupleId ? `couple_id=eq.${coupleId}` : undefined,
    enabled: !!coupleId,
    onChange: () => qc.invalidateQueries({ queryKey: ['memories', coupleId] }),
  })
}

export function useCreateMemory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createMemory,
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ['memories', v.coupleId] }),
  })
}

export function useUpdateMemory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.updateMemory,
    onSuccess: (m) => {
      qc.invalidateQueries({ queryKey: ['memories', m.couple_id] })
      qc.invalidateQueries({ queryKey: ['memory', m.id] })
    },
  })
}

export function useDeleteMemory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.deleteMemory,
    onSuccess: (_, m) => qc.invalidateQueries({ queryKey: ['memories', m.couple_id] }),
  })
}
