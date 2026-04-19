import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from './providers'
import { AppRoutes } from './routes'
import { MOCK } from '@/shared/lib/mock'

const basename = (import.meta.env.VITE_BASE_PATH || '/').replace(/\/$/, '') || '/'

export default function App() {
  return (
    <AppProviders>
      {MOCK && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-accent text-dark text-[11px] font-sans font-semibold text-center py-1 shadow-sm">
          MODO PREVIEW · datos falsos, solo diseño
        </div>
      )}
      <BrowserRouter basename={basename}>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  )
}
