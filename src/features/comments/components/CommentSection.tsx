import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send, Trash2 } from 'lucide-react'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useComments, useCommentsRealtime, useCreateComment, useDeleteComment } from '../hooks'
import { relativeAgo } from '@/shared/lib/dates'
import { toHumanError } from '@/shared/lib/async'
import type { Profile } from '@/types/database'

interface Props {
  memoryId: string
  me: Profile
}

export function CommentSection({ memoryId, me }: Props) {
  const { data: comments, isLoading } = useComments(memoryId)
  useCommentsRealtime(memoryId)
  const create = useCreateComment()
  const del = useDeleteComment()
  const [text, setText] = useState('')

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    try {
      await create.mutateAsync({
        memoryId,
        text: t,
        author: { id: me.id, display_name: me.display_name, photo_url: me.photo_url },
      })
      setText('')
    } catch (err) {
      console.error('comment error', err)
      toast.error(toHumanError(err))
    }
  }

  async function remove(id: string) {
    try {
      await del.mutateAsync({ id, memoryId })
    } catch (err) {
      console.error('delete comment error', err)
      toast.error(toHumanError(err))
    }
  }

  return (
    <section className="space-y-4">
      <h3 className="font-serif font-semibold text-lg text-dark">Comentarios</h3>

      {isLoading ? (
        <>
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </>
      ) : comments && comments.length > 0 ? (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3 bg-white rounded-3xl p-3 shadow-card border border-primary/5">
              <Avatar src={c.author_photo_url} name={c.author_name} size={36} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-sm text-dark">{c.author_name}</span>
                  <span className="text-[11px] text-dark/40">{relativeAgo(c.created_at)}</span>
                </div>
                <p className="text-sm text-dark/80 whitespace-pre-wrap break-words">{c.text}</p>
              </div>
              {c.author_id === me.id && (
                <button
                  onClick={() => remove(c.id)}
                  className="text-dark/40 hover:text-primary self-start p-1"
                  aria-label="Eliminar"
                ><Trash2 size={14} /></button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-dark/50 italic">Todavía no hay comentarios. Sé el primero 💌</p>
      )}

      <form onSubmit={send} className="flex gap-2 items-end">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="Escribí algo bonito…"
          rows={2}
          className="flex-1 rounded-3xl bg-white border border-primary/10 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button type="submit" loading={create.isPending} size="md" className="!px-4">
          <Send size={16} />
        </Button>
      </form>
    </section>
  )
}
