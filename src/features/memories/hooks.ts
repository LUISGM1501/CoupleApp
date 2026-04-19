import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { Memory } from '@/types/database'
import { useRealtime } from '@/shared/hooks/useRealtime'
import { MOCK, mockDB, mockActions } from '@/shared/lib/mock'

export function useMemories(coupleId: string | null | undefined) {
  return useQuery({
    enabled: !!coupleId,
    queryKey: ['memories', coupleId],
    queryFn: async () => (MOCK ? [...mockDB.memories] : api.listMemories(coupleId!)),
  })
}

export function useMemory(id: string | null | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: ['memory', id],
    queryFn: async () => {
      if (MOCK) {
        const m = mockDB.memories.find((x) => x.id === id)
        if (!m) throw new Error('not_found')
        return m
      }
      return api.getMemory(id!)
    },
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
    mutationFn: async (input: Parameters<typeof api.createMemory>[0]) => {
      if (MOCK) return mockActions.createMemory(input)
      return api.createMemory(input)
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ['memories', v.coupleId] }),
  })
}

export function useUpdateMemory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Parameters<typeof api.updateMemory>[0]) => {
      if (MOCK) return mockActions.updateMemory(input)
      return api.updateMemory(input)
    },
    onSuccess: (m) => {
      qc.invalidateQueries({ queryKey: ['memories', m.couple_id] })
      qc.invalidateQueries({ queryKey: ['memory', m.id] })
    },
  })
}

export function useDeleteMemory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (memory: Memory) => {
      if (MOCK) return mockActions.deleteMemory(memory.id)
      return api.deleteMemory(memory)
    },
    onSuccess: (_, m) => qc.invalidateQueries({ queryKey: ['memories', m.couple_id] }),
  })
}
