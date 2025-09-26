/**
 * Custom Hook for Web Worker Analysis
 * Provides easy interface for running structural analysis in Web Worker
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface WorkerProgress {
  progress: number;
  message: string;
}

interface WorkerResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface UseAnalysisWorkerReturn {
  analyze: (data: any) => Promise<WorkerResult>;
  isAnalyzing: boolean;
  progress: WorkerProgress | null;
  cancel: () => void;
}

export const useAnalysisWorker = (): UseAnalysisWorkerReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<WorkerProgress | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const currentRequestRef = useRef<string | null>(null);

  // Initialize worker
  useEffect(() => {
    // Create worker from the analysis worker file
    try {
      workerRef.current = new Worker(
        new URL('../workers/analysisWorker.ts', import.meta.url),
        { type: 'module' }
      );
    } catch (error) {
      console.warn('Web Worker not supported, falling back to main thread');
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Analyze function
  const analyze = useCallback(async (data: any): Promise<WorkerResult> => {
    if (!workerRef.current) {
      // Fallback to main thread if worker not available
      try {
        const { performStructuralAnalysis } = await import('../utils/structuralAnalysis');
        const result = await performStructuralAnalysis(data);
        return { success: true, data: result };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Analysis failed' 
        };
      }
    }

    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve({ success: false, error: 'Worker not available' });
        return;
      }

      const requestId = Math.random().toString(36).substr(2, 9);
      currentRequestRef.current = requestId;
      
      setIsAnalyzing(true);
      setProgress({ progress: 0, message: 'Starting analysis...' });

      const handleMessage = (e: MessageEvent) => {
        const { type, data: responseData, id } = e.data;

        // Only handle messages for current request
        if (id !== requestId) return;

        switch (type) {
          case 'PROGRESS':
            setProgress(responseData);
            break;

          case 'COMPLETE':
            setIsAnalyzing(false);
            setProgress(null);
            currentRequestRef.current = null;
            workerRef.current?.removeEventListener('message', handleMessage);
            resolve({ success: true, data: responseData });
            break;

          case 'ERROR':
            setIsAnalyzing(false);
            setProgress(null);
            currentRequestRef.current = null;
            workerRef.current?.removeEventListener('message', handleMessage);
            resolve({ success: false, error: responseData.message });
            break;
        }
      };

      workerRef.current.addEventListener('message', handleMessage);

      // Send analysis request
      workerRef.current.postMessage({
        type: 'ANALYZE',
        data,
        id: requestId
      });
    });
  }, []);

  // Cancel function
  const cancel = useCallback(() => {
    if (workerRef.current && currentRequestRef.current) {
      // Terminate current worker and create new one
      workerRef.current.terminate();
      try {
        workerRef.current = new Worker(
          new URL('../workers/analysisWorker.ts', import.meta.url),
          { type: 'module' }
        );
      } catch (error) {
        console.warn('Failed to recreate worker');
      }
      
      setIsAnalyzing(false);
      setProgress(null);
      currentRequestRef.current = null;
    }
  }, []);

  return {
    analyze,
    isAnalyzing,
    progress,
    cancel
  };
};

export default useAnalysisWorker;