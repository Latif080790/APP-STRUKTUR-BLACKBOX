import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultsDisplayProps {
  results: any;
  onReset?: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onReset }) => {
  if (!results) {
    return (
      <div className="text-center p-4">
        <p>Belum ada hasil analisis yang tersedia.</p>
        {onReset && (
          <button 
            onClick={onReset}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Kembali ke Editor
          </button>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hasil Analisis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="border-b pb-2">
              <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <pre className="text-sm mt-1 p-2 bg-gray-50 rounded">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>
        
        {onReset && (
          <div className="mt-6 text-right">
            <button
              onClick={onReset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Kembali ke Editor
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
