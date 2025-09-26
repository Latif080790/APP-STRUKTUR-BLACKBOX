import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimpleTestSystem from './components/SimpleTestSystem'
import './index-simple.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleTestSystem />
  </StrictMode>,
)