/**
 * Performance Optimized Components
 * Memoized versions of heavy components for better performance
 */

import React, { memo, lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy loaded components for code splitting
export const LazyStructureViewer = lazy(() => 
  import('../3d/StructureViewer').then(module => ({ default: module.default }))
);

export const LazyEnhanced3DViewer = lazy(() => 
  import('../3d/Enhanced3DViewer').then(module => ({ default: module.Enhanced3DViewer }))
);

export const LazyReportGenerator = lazy(() => 
  import('../ReportGenerator').then(module => ({ default: module.ReportGenerator }))
);

export const LazyComprehensiveResultsDashboard = lazy(() => 
  import('../results/ComprehensiveResultsDashboard')
);

export const LazyCalculationEngineTest = lazy(() => 
  import('../../test/CalculationEngineTest')
);

export const LazyExportManager = lazy(() => 
  import('../../common/ExportManager')
);

export const LazyResponseSpectrumChart = lazy(() => 
  import('../charts/ResponseSpectrumChart').then(module => ({ default: module.ResponseSpectrumChart }))
);

export const LazyForceDiagram = lazy(() => 
  import('../charts/ForceDiagram')
);

// Loading fallback component
export const ComponentLoader: React.FC<{ message?: string }> = memo(({ message = "Loading..." }) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center space-x-3">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      <span className="text-gray-600">{message}</span>
    </div>
  </div>
));

ComponentLoader.displayName = 'ComponentLoader';

// Suspense wrapper for lazy components
export const SuspenseWrapper: React.FC<{ 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
  message?: string;
}> = memo(({ children, fallback, message = "Loading component..." }) => (
  <Suspense fallback={fallback || <ComponentLoader message={message} />}>
    {children}
  </Suspense>
));

SuspenseWrapper.displayName = 'SuspenseWrapper';

// Performance monitoring HOC
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const WrappedComponent = memo((props: P) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (renderTime > 100) { // Log slow renders > 100ms
          console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
      };
    }, []);

    return <Component {...props} />;
  });

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  return WrappedComponent;
};

export default {
  LazyStructureViewer,
  LazyEnhanced3DViewer,
  LazyReportGenerator,
  LazyComprehensiveResultsDashboard,
  LazyCalculationEngineTest,
  LazyExportManager,
  LazyResponseSpectrumChart,
  LazyForceDiagram,
  ComponentLoader,
  SuspenseWrapper,
  withPerformanceMonitoring
};