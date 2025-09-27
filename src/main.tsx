import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimpleComprehensiveSystem from './components/structural-analysis/SimpleComprehensiveSystem'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleComprehensiveSystem />
  </StrictMode>,
)