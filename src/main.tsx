import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/index.css'
import '@fontsource-variable/hanken-grotesk/index.css'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/features/theme/ThemeProvider'
import { AuthProvider } from '@/features/auth/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
