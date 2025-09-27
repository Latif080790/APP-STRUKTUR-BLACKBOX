import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SNIStructuralAnalysisSystem from './components/structural-analysis/SNIStructuralAnalysisSystem'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SNIStructuralAnalysisSystem />
  </StrictMode>,
)