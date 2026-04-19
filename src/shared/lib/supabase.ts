import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
const mock = import.meta.env.VITE_MOCK === 'true'

if (!mock && (!url || !anon)) {
  console.error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local')
}

// En modo mock no se usa, pero createClient necesita strings válidos
export const supabase = createClient(
  url || 'https://mock.supabase.co',
  anon || 'mock-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'nosotros-auth',
    },
    realtime: { params: { eventsPerSecond: 5 } },
  },
)
