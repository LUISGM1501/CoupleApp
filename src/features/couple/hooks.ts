import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMyProfile } from '@/features/auth/hooks'
import * as api from './api'
import { useRealtime } from '@/shared/hooks/useRealtime'
import type { Profile } from '@/types/database'
import { MOCK, mockDB, mockActions } from '@/shared/lib/mock'

export function useCouple() {
  const { data: me } = useMyProfile()
  const coupleId = me?.couple_id

  const couple = useQuery({
    enabled: !!coupleId,
    queryKey: ['couple', coupleId],
    queryFn: async () => (MOCK ? mockDB.couple : api.fetchCouple(coupleId!)),
  })

  const members = useQuery({
    enabled: !!coupleId,
    queryKey: ['couple-members', coupleId],
    queryFn: async () => (MOCK ? [mockDB.me, mockDB.partner] : api.fetchCoupleMembers(coupleId!)),
    staleTime: 1000 * 30,
  })

  return { coupleId, couple, members, me }
}

/** Suscripción realtime al perfil de la pareja (para mood) */
export function usePartnerRealtime(coupleId: string | null | undefined) {
  const qc = useQueryClient()
  useRealtime<Profile>({
    table: 'profiles',
    event: 'UPDATE',
    filter: coupleId ? `couple_id=eq.${coupleId}` : undefined,
    enabled: !!coupleId,
    onChange: () => {
      qc.invalidateQueries({ queryKey: ['couple-members', coupleId] })
      qc.invalidateQueries({ queryKey: ['my-profile'] })
    },
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (patch: { display_name?: string; photo_url?: string | null }) => {
      if (MOCK) return mockActions.updateProfile(patch)
      return api.updateMyProfile(patch)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-profile'] })
      qc.invalidateQueries({ queryKey: ['couple-members'] })
    },
  })
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: async (file: File) => (MOCK ? mockActions.uploadAvatar(file) : api.uploadAvatar(file)),
  })
}
