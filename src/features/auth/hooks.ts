import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import * as api from './api'
import type { Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'
import { MOCK, MOCK_SESSION, mockDB } from '@/shared/lib/mock'

export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(
    MOCK ? MOCK_SESSION : undefined,
  )

  useEffect(() => {
    if (MOCK) return
    let alive = true
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setSession(data.session ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => setSession(s))
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return { session, loading: session === undefined, userId: session?.user?.id ?? null }
}

export function useMyProfile() {
  const { userId } = useSession()
  return useQuery({
    enabled: !!userId,
    queryKey: ['my-profile', userId],
    queryFn: async () => {
      if (MOCK) return mockDB.me
      const { data, error } = await supabase
        .from('profiles').select('*').eq('id', userId!).single()
      if (error) throw error
      return data as Profile
    },
  })
}

export function useSignIn() {
  return useMutation({ mutationFn: (v: { email: string; password: string }) => api.signIn(v.email, v.password) })
}

export function useSignUp() {
  return useMutation({
    mutationFn: (v: { email: string; password: string; displayName: string }) =>
      api.signUp(v.email, v.password, v.displayName),
  })
}

export function useSignOut() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.signOut,
    onSuccess: () => qc.clear(),
  })
}

export function useValidateCode() {
  return useMutation({ mutationFn: (code: string) => api.validateCoupleCode(code) })
}

export function useCreateCouple() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createCoupleAndJoin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-profile'] }),
  })
}

export function useJoinCouple() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { code: string; myName: string }) => api.joinCoupleByCode(v.code, v.myName),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-profile'] }),
  })
}
