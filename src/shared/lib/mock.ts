// Modo preview: con VITE_MOCK=true, la app arranca con datos falsos
// sin necesidad de Supabase real. Perfecto para iterar diseño.
//
// La "base de datos" es un objeto mutable en memoria. Las mutaciones
// modifican mockDB directamente y luego invalidamos el cache de React Query,
// así los cambios aparecen en la UI durante la sesión.

import type { Profile, Couple, Memory, Comment, MoodKey } from '@/types/database'
import type { Session } from '@supabase/supabase-js'

export const MOCK = import.meta.env.VITE_MOCK === 'true'

const yearAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 420).toISOString().slice(0, 10)

export const MOCK_ME_ID = 'mock-me-0000-0000-000000000001'
export const MOCK_PARTNER_ID = 'mock-you-0000-0000-000000000002'
export const MOCK_COUPLE_ID = 'mock-cpl-0000-0000-000000000001'

// Placeholders livianos (data URIs) — no dependen de red
const ph = (hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${hue},70%,75%)'/><stop offset='1' stop-color='hsl(${hue + 40},70%,60%)'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/><text x='50%' y='52%' font-family='serif' font-size='56' fill='white' text-anchor='middle' opacity='0.8'>💕</text></svg>`,
  )}`

function initialMe(): Profile {
  return {
    id: MOCK_ME_ID,
    email: 'tu@demo.com',
    display_name: 'Luis',
    photo_url: null,
    couple_id: MOCK_COUPLE_ID,
    couple_code: 'AMOR12',
    mood: 'enamorado',
    mood_message: 'Pensando en vos 💕',
    mood_updated_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    created_at: yearAgo,
  }
}

function initialPartner(): Profile {
  return {
    id: MOCK_PARTNER_ID,
    email: 'ella@demo.com',
    display_name: 'Sofi',
    photo_url: null,
    couple_id: MOCK_COUPLE_ID,
    couple_code: 'AMOR12',
    mood: 'feliz',
    mood_message: 'Qué lindo día hoy 🌞',
    mood_updated_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    created_at: yearAgo,
  }
}

function initialCouple(): Couple {
  return {
    id: MOCK_COUPLE_ID,
    user1_id: MOCK_ME_ID,
    user2_id: MOCK_PARTNER_ID,
    user1_name: 'Luis',
    user2_name: 'Sofi',
    start_date: yearAgo,
    couple_code: 'AMOR12',
    created_at: yearAgo,
  }
}

function initialMemories(): Memory[] {
  return [
    {
      id: 'mem-1', couple_id: MOCK_COUPLE_ID, created_by: MOCK_ME_ID,
      title: 'Nuestro primer viaje juntos',
      description: 'Manuel Antonio, fin de semana largo. Nos quedamos hasta que bajó el sol en la playa y todavía no queríamos volver al hotel.',
      location: 'Manuel Antonio, CR',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
      photos: [ph(340), ph(10), ph(40), ph(200)],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    },
    {
      id: 'mem-2', couple_id: MOCK_COUPLE_ID, created_by: MOCK_PARTNER_ID,
      title: 'Brunch de domingo 🥐',
      description: 'Ese café nuevo de Escazú. Nos pedimos todo lo del menú prácticamente.',
      location: 'Escazú',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
      photos: [ph(30), ph(60)],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
      id: 'mem-3', couple_id: MOCK_COUPLE_ID, created_by: MOCK_ME_ID,
      title: 'La noche que no dormimos hablando',
      description: 'De todo y de nada. Hasta las 5 am. Mejor insomnio de mi vida.',
      location: null,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString().slice(0, 10),
      photos: [ph(280)],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    },
    {
      id: 'mem-4', couple_id: MOCK_COUPLE_ID, created_by: MOCK_PARTNER_ID,
      title: 'Primer cumple juntos',
      description: 'Sorpresa con sus amigas. Lloré un poquito (no le digan).',
      location: 'San José',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString().slice(0, 10),
      photos: [ph(0), ph(320), ph(180)],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
    },
    {
      id: 'mem-5', couple_id: MOCK_COUPLE_ID, created_by: MOCK_ME_ID,
      title: 'El día que nos vimos por primera vez',
      description: 'Café en Barrio Escalante. Llegué 15 minutos temprano de los nervios.',
      location: 'Barrio Escalante',
      date: yearAgo,
      photos: [ph(150), ph(340)],
      created_at: yearAgo,
      updated_at: yearAgo,
    },
  ]
}

function initialComments(): Comment[] {
  return [
    {
      id: 'c-1', memory_id: 'mem-1', author_id: MOCK_PARTNER_ID,
      author_name: 'Sofi', author_photo_url: null,
      text: 'Amo esa foto 💕',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
    },
    {
      id: 'c-2', memory_id: 'mem-1', author_id: MOCK_ME_ID,
      author_name: 'Luis', author_photo_url: null,
      text: 'Ya tengo ganas de volver 🌊',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    },
  ]
}

// =================================================================
//  BASE DE DATOS EN MEMORIA — mutable durante la sesión
// =================================================================
export const mockDB = {
  me:        initialMe(),
  partner:   initialPartner(),
  couple:    initialCouple(),
  memories:  initialMemories(),
  comments:  initialComments(),
}

export const MOCK_SESSION = {
  user: { id: MOCK_ME_ID, email: mockDB.me.email },
  access_token: 'mock', refresh_token: 'mock',
  token_type: 'bearer', expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
} as unknown as Session

// =================================================================
//  HELPERS para mutaciones (cada feature los usa en su hook)
// =================================================================

function fileToDataUrl(f: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = () => reject(new Error('No se pudo leer la foto'))
    r.readAsDataURL(f)
  })
}

async function filesToUrls(files: File[]): Promise<string[]> {
  return Promise.all(files.map(fileToDataUrl))
}

let idCounter = 1000

export const mockActions = {
  async createMemory(input: {
    title: string; description?: string | null; location?: string | null;
    date: string; photos: File[]
  }): Promise<Memory> {
    const urls = await filesToUrls(input.photos)
    const now = new Date().toISOString()
    const m: Memory = {
      id: `mem-new-${++idCounter}`,
      couple_id: MOCK_COUPLE_ID,
      created_by: MOCK_ME_ID,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      location: input.location?.trim() || null,
      date: input.date,
      photos: urls,
      created_at: now,
      updated_at: now,
    }
    mockDB.memories = [m, ...mockDB.memories]
    return m
  },

  async updateMemory(input: {
    id: string;
    title?: string; description?: string | null; location?: string | null; date?: string;
    keepPhotos?: string[]; newPhotos?: File[];
  }): Promise<Memory> {
    const idx = mockDB.memories.findIndex((m) => m.id === input.id)
    if (idx < 0) throw new Error('No encontrado')
    const current = mockDB.memories[idx]
    const keep = input.keepPhotos ?? current.photos
    const newUrls = input.newPhotos?.length ? await filesToUrls(input.newPhotos) : []
    const updated: Memory = {
      ...current,
      ...(input.title !== undefined       && { title: input.title.trim() }),
      ...(input.description !== undefined && { description: input.description?.trim() || null }),
      ...(input.location !== undefined    && { location: input.location?.trim() || null }),
      ...(input.date !== undefined        && { date: input.date }),
      photos: [...keep, ...newUrls],
      updated_at: new Date().toISOString(),
    }
    mockDB.memories[idx] = updated
    return updated
  },

  async deleteMemory(id: string): Promise<void> {
    mockDB.memories = mockDB.memories.filter((m) => m.id !== id)
    mockDB.comments = mockDB.comments.filter((c) => c.memory_id !== id)
  },

  async setMood(mood: MoodKey, message: string | null): Promise<void> {
    mockDB.me = { ...mockDB.me, mood, mood_message: message, mood_updated_at: new Date().toISOString() }
  },

  async updateProfile(patch: { display_name?: string; photo_url?: string | null }): Promise<Profile> {
    mockDB.me = { ...mockDB.me, ...patch }
    return mockDB.me
  },

  async uploadAvatar(file: File): Promise<string> {
    return fileToDataUrl(file)
  },

  async addComment(memoryId: string, text: string): Promise<Comment> {
    const c: Comment = {
      id: `c-new-${++idCounter}`,
      memory_id: memoryId,
      author_id: MOCK_ME_ID,
      author_name: mockDB.me.display_name,
      author_photo_url: mockDB.me.photo_url,
      text: text.trim(),
      created_at: new Date().toISOString(),
    }
    mockDB.comments = [...mockDB.comments, c]
    return c
  },

  async deleteComment(id: string): Promise<void> {
    mockDB.comments = mockDB.comments.filter((c) => c.id !== id)
  },
}
