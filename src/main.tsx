import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProfessionalStructuralAnalysisSystem from './components/ProfessionalStructuralAnalysisSystem'
import './index-simple.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfessionalStructuralAnalysisSystem />
  </StrictMode>,
)