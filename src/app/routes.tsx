import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSession, useMyProfile } from '@/features/auth/hooks'
import { HeartMark } from '@/shared/ui/HeartMark'

const Login        = lazy(() => import('@/pages/Login'))
const Home         = lazy(() => import('@/pages/Home'))
const Memories     = lazy(() => import('@/pages/Memories'))
const NewMemory    = lazy(() => import('@/pages/NewMemory'))
const MemoryDetail = lazy(() => import('@/pages/MemoryDetail'))
const Profile      = lazy(() => import('@/pages/Profile'))
const Widget       = lazy(() => import('@/pages/Widget'))
const WaitingPartner = lazy(() => import('@/pages/WaitingPartner'))

function FullScreenLoader() {
  return (
    <div className="h-full flex items-center justify-center">
      <HeartMark size={56} />
    </div>
  )
}

function Protected({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession()
  const { data: profile, isLoading: pLoading } = useMyProfile()

  if (loading || (session && pLoading)) return <FullScreenLoader />
  if (!session) return <Navigate to="/login" replace />
  if (!profile?.couple_id) return <Navigate to="/esperando" replace />
  return <>{children}</>
}

function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession()
  const { data: profile, isLoading: pLoading } = useMyProfile()
  if (loading || (session && pLoading)) return <FullScreenLoader />
  if (session && profile?.couple_id) return <Navigate to="/" replace />
  if (session && profile && !profile.couple_id) return <Navigate to="/esperando" replace />
  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route path="/login"    element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
        <Route path="/esperando" element={<WaitingPartner />} />
        <Route path="/widget"   element={<Widget />} />

        <Route path="/"                   element={<Protected><Home /></Protected>} />
        <Route path="/recuerdos"          element={<Protected><Memories /></Protected>} />
        <Route path="/recuerdos/nuevo"    element={<Protected><NewMemory /></Protected>} />
        <Route path="/recuerdos/:id"      element={<Protected><MemoryDetail /></Protected>} />
        <Route path="/perfil"             element={<Protected><Profile /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
