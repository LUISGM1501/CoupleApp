import { differenceInDays, differenceInMonths, format, parseISO, addYears } from 'date-fns'
import { es } from 'date-fns/locale'

export function daysTogether(startDate: string | Date): number {
  const d = typeof startDate === 'string' ? parseISO(startDate) : startDate
  return Math.max(0, differenceInDays(new Date(), d))
}

export function monthsTogether(startDate: string | Date): number {
  const d = typeof startDate === 'string' ? parseISO(startDate) : startDate
  return Math.max(0, differenceInMonths(new Date(), d))
}

export function nextAnniversary(startDate: string | Date): { date: Date; daysLeft: number; yearsTurning: number } {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const now = new Date()
  const years = now.getFullYear() - start.getFullYear()
  let next = addYears(start, Math.max(1, years))
  if (next <= now) next = addYears(start, years + 1)
  return {
    date: next,
    daysLeft: differenceInDays(next, now),
    yearsTurning: next.getFullYear() - start.getFullYear(),
  }
}

export function prettyDate(d: string | Date): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return format(date, "d 'de' MMMM, yyyy", { locale: es })
}

export function shortDate(d: string | Date): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return format(date, "d MMM", { locale: es })
}

export function relativeAgo(d: string | Date): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'hace un momento'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
  if (diff < 86400 * 7) return `hace ${Math.floor(diff / 86400)} d`
  return format(date, "d MMM", { locale: es })
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}
