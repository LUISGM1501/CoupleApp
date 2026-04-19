import { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { isNative } from '@/shared/lib/platform'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime:    1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: { retry: 0 },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    // ajustar status bar en nativo
    if (!isNative()) return
    ;(async () => {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar')
        await StatusBar.setStyle({ style: Style.Light })
      } catch (e) {
        console.error('statusbar error', e)
      }
    })()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2800,
          style: {
            background: 'white',
            color: '#2B1E22',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: 14,
            borderRadius: 16,
            padding: '10px 16px',
            boxShadow: '0 4px 20px rgba(192,62,75,0.15)',
            border: '1px solid rgba(224,87,99,0.12)',
          },
        }}
      />
    </QueryClientProvider>
  )
}
