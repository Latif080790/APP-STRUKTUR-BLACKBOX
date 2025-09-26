/**
 * Structural Analysis Web Worker
 * Performs heavy structural calculations in a separate thread to prevent UI blocking
 */

import { performStructuralAnalysis } from '../utils/structuralAnalysis';

// Types for worker messages
interface AnalysisWorkerMessage {
  type: 'ANALYZE' | 'PROGRESS' | 'COMPLETE' | 'ERROR';
  data: any;
  id?: string;
}

// Worker message handler
self.onmessage = async function(e: MessageEvent<AnalysisWorkerMessage>) {
  const { type, data, id } = e.data;

  try {
    switch (type) {
      case 'ANALYZE':
        // Perform structural analysis
        const { projectInfo, geometry, materials, loads, seismicParams } = data;
        
        // Send progress updates
        self.postMessage({ 
          type: 'PROGRESS', 
          data: { progress: 10, message: 'Validating inputs...' },
          id 
        });

        // Simulate progressive calculation steps
        const steps = [
          { progress: 20, message: 'Building structural model...' },
          { progress: 40, message: 'Calculating member forces...' },
          { progress: 60, message: 'Performing seismic analysis...' },
          { progress: 80, message: 'Computing displacements...' },
          { progress: 90, message: 'Generating results...' }
        ];

        // Send progress updates with delays to simulate heavy computation
        for (const step of steps) {
          await new Promise(resolve => setTimeout(resolve, 100)); // Simulate work
          self.postMessage({ 
            type: 'PROGRESS', 
            data: step,
            id 
          });
        }

        // Perform actual analysis
        const result = await performStructuralAnalysis({
          projectInfo,
          geometry, 
          materials,
          loads,
          seismicParams
        });

        // Send completion
        self.postMessage({ 
          type: 'COMPLETE', 
          data: result,
          id 
        });
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    // Send error
    self.postMessage({ 
      type: 'ERROR', 
      data: { 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      id 
    });
  }
};

export {}; // Make this a module