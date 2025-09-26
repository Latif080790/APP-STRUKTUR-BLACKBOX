import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CompleteStructuralAnalysisSystem from './components/structural-analysis/CompleteStructuralAnalysisSystem'
import './index.css'

// Test component untuk memastikan aplikasi berjalan
const App = () => {
  return (
    <div>
      <CompleteStructuralAnalysisSystem />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)