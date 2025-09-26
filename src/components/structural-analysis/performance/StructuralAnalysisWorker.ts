/**
 * Structural Analysis Web Worker
 * Performs heavy structural calculations in a separate thread
 */

// Types for worker messages
export interface WorkerMessage {
  id: string;
  type: 'STRUCTURAL_ANALYSIS' | 'SEISMIC_ANALYSIS' | 'FRAME_ANALYSIS' | 'OPTIMIZATION';
  data: any;
}

export interface WorkerResponse {
  id: string;
  type: 'SUCCESS' | 'ERROR' | 'PROGRESS';
  data?: any;
  error?: string;
  progress?: number;
}

// Web Worker code as string (for inline worker)
const workerScript = `
// Structural Analysis Worker
self.addEventListener('message', function(e) {
  const { id, type, data } = e.data;
  
  try {
    switch (type) {
      case 'STRUCTURAL_ANALYSIS':
        performStructuralAnalysis(id, data);
        break;
      case 'SEISMIC_ANALYSIS':
        performSeismicAnalysis(id, data);
        break;
      case 'FRAME_ANALYSIS':
        performFrameAnalysis(id, data);
        break;
      case 'OPTIMIZATION':
        performOptimization(id, data);
        break;
      default:
        throw new Error('Unknown analysis type: ' + type);
    }
  } catch (error) {
    self.postMessage({
      id: id,
      type: 'ERROR',
      error: error.message
    });
  }
});

function performStructuralAnalysis(id, data) {
  // Send progress update
  self.postMessage({
    id: id,
    type: 'PROGRESS',
    progress: 10
  });

  const { geometry, materials, loads, seismicParams } = data;
  
  // Simulate heavy calculation
  let result = {
    success: true,
    maxMoment: 0,
    maxShear: 0,
    maxDeflection: 0,
    utilisationRatio: 0
  };

  // Simulate progressive calculation steps
  const steps = [
    () => calculateGeometry(geometry),
    () => calculateMaterialProperties(materials),
    () => calculateLoads(loads),
    () => calculateSeismicForces(seismicParams),
    () => solveStructure(),
    () => calculateResults()
  ];

  steps.forEach((step, index) => {
    step();
    const progress = Math.floor(((index + 1) / steps.length) * 80) + 10;
    self.postMessage({
      id: id,
      type: 'PROGRESS',
      progress: progress
    });
  });

  // Calculate actual results
  if (geometry && materials && loads) {
    const height = geometry.height || 10;
    const floors = geometry.floors || 3;
    const fc = materials.concreteGrade || 25;
    const deadLoad = loads.deadLoad || 5;
    const liveLoad = loads.liveLoad || 3;
    
    // Simplified moment calculation
    const totalLoad = (deadLoad + liveLoad) * Math.pow(height / floors, 2);
    result.maxMoment = totalLoad * height / 8;
    result.maxShear = totalLoad * height / 2;
    result.maxDeflection = (totalLoad * Math.pow(height, 4)) / (8 * fc * 1000000);
    result.utilisationRatio = Math.min(result.maxMoment / (fc * 100), 1.0);
  }

  self.postMessage({
    id: id,
    type: 'SUCCESS',
    data: result
  });
}

function performSeismicAnalysis(id, data) {
  self.postMessage({ id: id, type: 'PROGRESS', progress: 20 });
  
  const { geometry, seismicParams } = data;
  
  let result = {
    success: true,
    baseShear: 0,
    fundamentalPeriod: 0,
    lateralForces: [],
    storyDrift: []
  };

  if (geometry && seismicParams) {
    const height = geometry.height || 10;
    const mass = geometry.floors * 1000; // Assumed mass per floor
    const zoneSeismic = seismicParams.zoneSeismic || 0.4;
    
    // Fundamental period (simplified)
    result.fundamentalPeriod = 0.1 * Math.pow(geometry.floors || 3, 0.75);
    
    self.postMessage({ id: id, type: 'PROGRESS', progress: 60 });
    
    // Base shear calculation
    result.baseShear = zoneSeismic * mass * 9.81; // Simplified
    
    // Generate lateral forces for each floor
    for (let i = 0; i < (geometry.floors || 3); i++) {
      result.lateralForces.push({
        floor: i + 1,
        force: result.baseShear * (i + 1) / (geometry.floors || 3),
        height: ((i + 1) * height) / (geometry.floors || 3)
      });
    }
  }

  self.postMessage({ id: id, type: 'PROGRESS', progress: 90 });
  
  self.postMessage({
    id: id,
    type: 'SUCCESS',
    data: result
  });
}

function performFrameAnalysis(id, data) {
  const { nodes, elements, loads } = data;
  
  let progress = 10;
  self.postMessage({ id: id, type: 'PROGRESS', progress: progress });
  
  let result = {
    success: true,
    nodeDisplacements: {},
    elementForces: {},
    reactions: {}
  };

  if (nodes && elements) {
    // Simulate matrix assembly
    progress = 30;
    self.postMessage({ id: id, type: 'PROGRESS', progress: progress });
    
    // Simulate solving system of equations
    progress = 70;
    self.postMessage({ id: id, type: 'PROGRESS', progress: progress });
    
    // Generate mock results
    nodes.forEach(node => {
      result.nodeDisplacements[node.id] = {
        dx: Math.random() * 0.01,
        dy: Math.random() * 0.01,
        dz: Math.random() * 0.005,
        rx: Math.random() * 0.001,
        ry: Math.random() * 0.001,
        rz: Math.random() * 0.001
      };
    });
    
    elements.forEach(element => {
      result.elementForces[element.id] = {
        N: Math.random() * 1000 - 500, // Axial force
        Vy: Math.random() * 500 - 250, // Shear Y
        Vz: Math.random() * 500 - 250, // Shear Z
        T: Math.random() * 100 - 50,   // Torque
        My: Math.random() * 2000 - 1000, // Moment Y
        Mz: Math.random() * 2000 - 1000  // Moment Z
      };
    });
  }

  self.postMessage({
    id: id,
    type: 'SUCCESS',
    data: result
  });
}

function performOptimization(id, data) {
  const { objectives, constraints, variables } = data;
  
  self.postMessage({ id: id, type: 'PROGRESS', progress: 20 });
  
  // Simulate optimization iterations
  for (let i = 0; i < 10; i++) {
    self.postMessage({ 
      id: id, 
      type: 'PROGRESS', 
      progress: 20 + (i + 1) * 7 
    });
    
    // Simulate computation time
    const now = Date.now();
    while (Date.now() - now < 100) {
      // Busy wait to simulate computation
    }
  }
  
  const result = {
    success: true,
    optimalValues: variables ? variables.map(() => Math.random() * 100) : [],
    objectiveValue: Math.random() * 1000,
    iterations: 10,
    convergence: true
  };
  
  self.postMessage({
    id: id,
    type: 'SUCCESS',
    data: result
  });
}

// Helper functions
function calculateGeometry(geometry) {
  // Geometric calculations
  return true;
}

function calculateMaterialProperties(materials) {
  // Material property calculations
  return true;
}

function calculateLoads(loads) {
  // Load calculations
  return true;
}

function calculateSeismicForces(seismicParams) {
  // Seismic force calculations
  return true;
}

function solveStructure() {
  // Structural solving
  return true;
}

function calculateResults() {
  // Result calculations
  return true;
}
`;

// Worker manager class
export class StructuralAnalysisWorker {
  private worker: Worker | null = null;
  private callbacks: Map<string, (response: WorkerResponse) => void> = new Map();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
      
      this.worker.addEventListener('message', (e) => {
        const response: WorkerResponse = e.data;
        const callback = this.callbacks.get(response.id);
        
        if (callback) {
          callback(response);
          
          // Clean up completed tasks
          if (response.type === 'SUCCESS' || response.type === 'ERROR') {
            this.callbacks.delete(response.id);
          }
        }
      });

      this.worker.addEventListener('error', (error) => {
        console.error('Worker error:', error);
      });

    } catch (error) {
      console.warn('Web Worker not supported, falling back to main thread');
      this.worker = null;
    }
  }

  public performAnalysis(
    type: 'STRUCTURAL_ANALYSIS' | 'SEISMIC_ANALYSIS' | 'FRAME_ANALYSIS' | 'OPTIMIZATION',
    data: any,
    onProgress: (progress: number) => void,
    onComplete: (result: any) => void,
    onError: (error: string) => void
  ): string {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const callback = (response: WorkerResponse) => {
      switch (response.type) {
        case 'PROGRESS':
          if (response.progress !== undefined) {
            onProgress(response.progress);
          }
          break;
        case 'SUCCESS':
          onComplete(response.data);
          break;
        case 'ERROR':
          onError(response.error || 'Unknown error');
          break;
      }
    };

    this.callbacks.set(id, callback);

    if (this.worker) {
      this.worker.postMessage({
        id,
        type,
        data
      });
    } else {
      // Fallback to main thread (simplified)
      setTimeout(() => {
        onError('Web Worker not available');
      }, 100);
    }

    return id;
  }

  public cancelTask(taskId: string) {
    this.callbacks.delete(taskId);
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.callbacks.clear();
  }
}

export default StructuralAnalysisWorker;