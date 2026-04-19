import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from './providers'
import { AppRoutes } from './routes'

const basename = (import.meta.env.VITE_BASE_PATH || '/').replace(/\/$/, '') || '/'

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter basename={basename}>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  )
}
