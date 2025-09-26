import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimpleStructuralApp from './components/SimpleStructuralApp'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleStructuralApp />
  </StrictMode>,
)