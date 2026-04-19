import { supabase } from '@/shared/lib/supabase'
import { withTimeout, retry } from '@/shared/lib/async'
import { compressPhoto } from '@/shared/lib/images'
import { slug } from '@/shared/lib/utils'
import type { Memory } from '@/types/database'

const BUCKET = 'memories'

export async function listMemories(coupleId: string): Promise<Memory[]> {
  const { data, error } = await withTimeout(
    supabase.from('memories')
      .select('*').eq('couple_id', coupleId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false }),
    15_000, 'carga de recuerdos',
  )
  if (error) throw error
  return (data ?? []) as Memory[]
}

export async function getMemory(id: string): Promise<Memory> {
  const { data, error } = await withTimeout(
    supabase.from('memories').select('*').eq('id', id).single(),
    10_000, 'carga del recuerdo',
  )
  if (error) throw error
  return data as Memory
}

interface CreateMemoryInput {
  coupleId: string
  createdBy: string
  title: string
  description?: string | null
  location?: string | null
  date: string
  photos: File[]
}

export async function createMemory(input: CreateMemoryInput): Promise<Memory> {
  // 1) crear registro vacío (sin fotos todavía) para tener el id
  const { data: row, error } = await withTimeout(
    supabase.from('memories').insert({
      couple_id: input.coupleId,
      created_by: input.createdBy,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      location: input.location?.trim() || null,
      date: input.date,
      photos: [],
    }).select().single(),
    15_000, 'creación del recuerdo',
  )
  if (error) throw error
  const memory = row as Memory

  // 2) comprimir + subir fotos en paralelo (máx 4 concurrentes)
  const urls: string[] = []
  try {
    const compressed = await Promise.all(input.photos.map((f) => compressPhoto(f)))
    const uploaded = await runConcurrent(compressed, 4, async (f, idx) => {
      return retry(() => uploadMemoryPhoto(input.coupleId, memory.id, f, idx), { attempts: 3, baseMs: 500 })
    })
    urls.push(...uploaded)

    // 3) actualizar el registro con las URLs
    const { data: updated, error: upErr } = await withTimeout(
      supabase.from('memories').update({ photos: urls }).eq('id', memory.id).select().single(),
      15_000, 'guardado de fotos',
    )
    if (upErr) throw upErr
    return updated as Memory
  } catch (err) {
    // rollback: si falló, borramos el registro y cualquier foto subida
    console.error('createMemory error, rolling back', err)
    await Promise.allSettled([
      supabase.from('memories').delete().eq('id', memory.id),
      ...urls.map((u) => removeByPublicUrl(u)),
    ])
    throw err
  }
}

interface UpdateMemoryInput {
  id: string
  coupleId: string
  title?: string
  description?: string | null
  location?: string | null
  date?: string
  /** fotos existentes a conservar (subset de las originales) */
  keepPhotos?: string[]
  /** fotos nuevas a subir */
  newPhotos?: File[]
}

export async function updateMemory(input: UpdateMemoryInput): Promise<Memory> {
  const current = await getMemory(input.id)

  const keep = input.keepPhotos ?? current.photos
  const toDelete = current.photos.filter((u) => !keep.includes(u))

  let finalUrls = [...keep]
  if (input.newPhotos && input.newPhotos.length) {
    const compressed = await Promise.all(input.newPhotos.map((f) => compressPhoto(f)))
    const uploaded = await runConcurrent(compressed, 4, async (f, idx) => {
      return retry(() => uploadMemoryPhoto(input.coupleId, input.id, f, keep.length + idx), { attempts: 3, baseMs: 500 })
    })
    finalUrls = [...finalUrls, ...uploaded]
  }

  const patch: Record<string, unknown> = { photos: finalUrls }
  if (input.title !== undefined)       patch.title       = input.title.trim()
  if (input.description !== undefined) patch.description = input.description?.trim() || null
  if (input.location !== undefined)    patch.location    = input.location?.trim() || null
  if (input.date !== undefined)        patch.date        = input.date

  const { data, error } = await withTimeout(
    supabase.from('memories').update(patch).eq('id', input.id).select().single(),
    15_000, 'actualización del recuerdo',
  )
  if (error) throw error

  // borrar del storage lo removido (best effort, no bloquea)
  Promise.allSettled(toDelete.map((u) => removeByPublicUrl(u))).catch(() => { /* noop */ })

  return data as Memory
}

export async function deleteMemory(memory: Memory) {
  // 1) borrar fotos del storage
  await Promise.allSettled(memory.photos.map((u) => removeByPublicUrl(u)))
  // 2) borrar registro (RLS + cascade elimina comentarios)
  const { error } = await withTimeout(
    supabase.from('memories').delete().eq('id', memory.id),
    10_000, 'eliminación',
  )
  if (error) throw error
}

// ============================================================================
// helpers internos
// ============================================================================

async function uploadMemoryPhoto(coupleId: string, memoryId: string, file: File, idx: number): Promise<string> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const base = slug(file.name.replace(/\.[^.]+$/, ''))
  const path = `${coupleId}/${memoryId}/${Date.now()}-${idx}-${base}.${ext}`
  const { error } = await withTimeout(
    supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false }),
    60_000, 'subida de foto',
  )
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

async function removeByPublicUrl(publicUrl: string) {
  const marker = `/object/public/${BUCKET}/`
  const i = publicUrl.indexOf(marker)
  if (i < 0) return
  const path = publicUrl.slice(i + marker.length)
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) console.error('remove storage error', error)
}

async function runConcurrent<T, R>(
  items: T[], concurrency: number, fn: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const idx = cursor++
      if (idx >= items.length) break
      results[idx] = await fn(items[idx], idx)
    }
  })
  await Promise.all(workers)
  return results
}
