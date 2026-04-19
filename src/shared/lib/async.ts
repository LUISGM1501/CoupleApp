// Utilidades async. Regla de oro v2: toda operación async tiene timeout.

export class TimeoutError extends Error {
  constructor(msg = 'Esto está tardando mucho. Intentá de nuevo.') {
    super(msg)
    this.name = 'TimeoutError'
  }
}

export function withTimeout<T>(promise: Promise<T> | PromiseLike<T>, ms = 30_000, label = 'operación'): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(`La ${label} tardó más de lo esperado.`)), ms)
  })
  return Promise.race([Promise.resolve(promise), timeout]).finally(() => clearTimeout(timer))
}

export async function retry<T>(
  fn: () => Promise<T>,
  { attempts = 3, baseMs = 400 }: { attempts?: number; baseMs?: number } = {},
): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseMs * 2 ** i))
      }
    }
  }
  throw lastErr
}

export function toHumanError(e: unknown): string {
  if (e instanceof TimeoutError) return e.message
  if (e instanceof Error) {
    const m = e.message.toLowerCase()
    if (m.includes('invalid login')) return 'Email o contraseña incorrectos.'
    if (m.includes('user already registered')) return 'Ese email ya está registrado.'
    if (m.includes('network')) return 'Sin conexión. Revisá tu internet.'
    if (m.includes('already_in_couple')) return 'Ya estás en una pareja.'
    if (m.includes('already_full')) return 'Esa pareja ya tiene dos miembros.'
    if (m.includes('invalid_code')) return 'Código no válido. Pedíle a tu pareja que te lo reenvíe.'
    if (m.includes('cannot_join_own_couple')) return 'No podés unirte a tu propia pareja.'
    return e.message
  }
  return 'Algo salió mal. Intentá de nuevo.'
}
