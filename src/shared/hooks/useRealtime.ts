import { useEffect } from 'react'
import { supabase } from '@/shared/lib/supabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { MOCK } from '@/shared/lib/mock'

type Event = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface Options<T extends Record<string, unknown>> {
  table: string
  event?: Event
  filter?: string
  enabled?: boolean
  onChange: (payload: RealtimePostgresChangesPayload<T>) => void
}

export function useRealtime<T extends Record<string, unknown>>({
  table,
  event = '*',
  filter,
  enabled = true,
  onChange,
}: Options<T>) {
  useEffect(() => {
    if (MOCK) return
    if (!enabled) return
    const channel = supabase
      .channel(`rt-${table}-${filter ?? 'all'}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('postgres_changes' as any, { event, schema: 'public', table, filter }, onChange as any)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, event, filter, enabled])
}
