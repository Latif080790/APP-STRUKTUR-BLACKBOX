import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimpleStructuralAnalysisSystem from './components/structural-analysis/SimpleStructuralAnalysisSystem'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleStructuralAnalysisSystem />
  </StrictMode>,
)