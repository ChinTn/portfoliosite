import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ClerkProvider } from '@clerk/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
    </ClerkProvider>
  </StrictMode>,
)
