import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import EnhancedAdvancedStructuralAnalysisSystem from './components/structural-analysis/EnhancedAdvancedStructuralAnalysisSystem'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnhancedAdvancedStructuralAnalysisSystem />
  </StrictMode>,
)