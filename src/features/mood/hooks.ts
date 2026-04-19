import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { Profile, MoodKey } from '@/types/database'

export function useChangeMood() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { mood: MoodKey; message?: string | null }) => api.updateMyMood(v.mood, v.message ?? null),
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: ['my-profile'] })
      const prev = qc.getQueryData<Profile>(['my-profile'])
      qc.setQueriesData<Profile | undefined>({ queryKey: ['my-profile'] }, (old) =>
        old ? { ...old, mood: v.mood, mood_message: v.message ?? null, mood_updated_at: new Date().toISOString() } : old,
      )
      return { prev }
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['my-profile'], ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['my-profile'] })
      qc.invalidateQueries({ queryKey: ['couple-members'] })
    },
  })
}
