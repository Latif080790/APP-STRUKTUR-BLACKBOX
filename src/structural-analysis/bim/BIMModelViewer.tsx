/**
 * BIM Model Viewer
 * Displays imported BIM model information and conversion results
 */

import React, { useState } from 'react';
import { BIMImportResult, BIMExportResult, BIMModelInfo } from './BIMIntegrationEngine';
import { Structure3D } from '@/types/structural';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BIMModelViewerProps {
  importResult?: BIMImportResult;
  exportResult?: BIMExportResult;
  onStructureLoad?: (structure: Structure3D) => void;
  onClearResults?: () => void;
}

export const BIMModelViewer: React.FC<BIMModelViewerProps> = ({
  importResult,
  exportResult,
  onStructureLoad,
  onClearResults
}) => {
  const [activeView, setActiveView] = useState<'summary' | 'details' | 'log'>('summary');

  const renderImportSummary = () => {
    if (!importResult) return null;

    const { success, structure, modelInfo, warnings, errors } = importResult;

    return (
      <div className="space-y-4">
        {/* Status Header */}
        <div className={`p-4 rounded-lg ${success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center">
            <span className="text-2xl mr-3">{success ? '✅' : '❌'}</span>
            <div>
              <h3 className="font-semibold text-lg">
                {success ? 'Import Berhasil' : 'Import Gagal'}
              </h3>
              <p className="text-sm text-gray-600">
                {success 
                  ? 'Model BIM berhasil diimpor dan dikonversi' 
                  : 'Terjadi error saat mengimpor model BIM'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Model Information */}
        {modelInfo && (
          <Card>
            <CardHeader>
              <CardTitle>📋 Informasi Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">File Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-600">Nama File:</span> {modelInfo.fileName}</div>
                    <div><span className="text-gray-600">Format:</span> {modelInfo.format.toUpperCase()}</div>
                    <div><span className="text-gray-600">Versi:</span> {modelInfo.version}</div>
                    <div><span className="text-gray-600">Unit:</span> {modelInfo.units}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Element Count</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-600">Nodes:</span> {modelInfo.elementCount.nodes}</div>
                    <div><span className="text-gray-600">Elements:</span> {modelInfo.elementCount.elements}</div>
                    <div><span className="text-gray-600">Materials:</span> {modelInfo.elementCount.materials}</div>
                    <div><span className="text-gray-600">Sections:</span> {modelInfo.elementCount.sections}</div>
                  </div>
                </div>
              </div>

              {/* Bounding Box */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Model Dimensions</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div>
                    <strong>Min:</strong> ({modelInfo.boundingBox.min.x.toFixed(2)}, {modelInfo.boundingBox.min.y.toFixed(2)}, {modelInfo.boundingBox.min.z.toFixed(2)})
                  </div>
                  <div>
                    <strong>Max:</strong> ({modelInfo.boundingBox.max.x.toFixed(2)}, {modelInfo.boundingBox.max.y.toFixed(2)}, {modelInfo.boundingBox.max.z.toFixed(2)})
                  </div>
                  <div>
                    <strong>Size:</strong> {(modelInfo.boundingBox.max.x - modelInfo.boundingBox.min.x).toFixed(2)} × {(modelInfo.boundingBox.max.y - modelInfo.boundingBox.min.y).toFixed(2)} × {(modelInfo.boundingBox.max.z - modelInfo.boundingBox.min.z).toFixed(2)} {modelInfo.units}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warnings dan Errors */}
        {(warnings.length > 0 || errors.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>⚠️ Peringatan & Error</CardTitle>
            </CardHeader>
            <CardContent>
              {warnings.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-amber-600 mb-2">Peringatan ({warnings.length})</h4>
                  <div className="space-y-1">
                    {warnings.map((warning, index) => (
                      <div key={index} className="text-sm bg-amber-50 p-2 rounded border-l-4 border-amber-400">
                        {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Error ({errors.length})</h4>
                  <div className="space-y-1">
                    {errors.map((error, index) => (
                      <div key={index} className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-400">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {success && structure && onStructureLoad && (
          <div className="flex space-x-4">
            <Button 
              onClick={() => onStructureLoad(structure)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              📊 Load ke Analisis
            </Button>
            
            <Button 
              onClick={() => {
                const blob = new Blob([JSON.stringify(structure, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `imported_structure.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              variant="outline"
            >
              💾 Download JSON
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderExportSummary = () => {
    if (!exportResult) return null;

    const { success, fileName, fileSize, warnings, errors } = exportResult;

    return (
      <div className="space-y-4">
        {/* Status Header */}
        <div className={`p-4 rounded-lg ${success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center">
            <span className="text-2xl mr-3">{success ? '✅' : '❌'}</span>
            <div>
              <h3 className="font-semibold text-lg">
                {success ? 'Export Berhasil' : 'Export Gagal'}
              </h3>
              <p className="text-sm text-gray-600">
                {success 
                  ? `File ${fileName} berhasil diekspor (${(fileSize / 1024).toFixed(1)} KB)` 
                  : 'Terjadi error saat mengekspor file'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Export Details */}
        {success && (
          <Card>
            <CardHeader>
              <CardTitle>📤 Detail Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nama File:</span>
                  <span className="ml-2 font-medium">{fileName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Ukuran File:</span>
                  <span className="ml-2 font-medium">{(fileSize / 1024).toFixed(1)} KB</span>
                </div>
                <div>
                  <span className="text-gray-600">Format:</span>
                  <span className="ml-2 font-medium">{fileName.split('.').pop()?.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Waktu Export:</span>
                  <span className="ml-2 font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warnings dan Errors */}
        {(warnings.length > 0 || errors.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>⚠️ Catatan Export</CardTitle>
            </CardHeader>
            <CardContent>
              {warnings.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-amber-600 mb-2">Peringatan ({warnings.length})</h4>
                  <div className="space-y-1">
                    {warnings.map((warning, index) => (
                      <div key={index} className="text-sm bg-amber-50 p-2 rounded border-l-4 border-amber-400">
                        {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Error ({errors.length})</h4>
                  <div className="space-y-1">
                    {errors.map((error, index) => (
                      <div key={index} className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-400">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderDetailedView = () => {
    const result = importResult || exportResult;
    if (!result) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>🔍 Detail Lengkap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="text-xs overflow-auto max-h-96 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderConversionLog = () => {
    const result = importResult || exportResult;
    if (!result) return null;

    const logs = 'conversionLog' in result ? result.conversionLog : [];

    return (
      <Card>
        <CardHeader>
          <CardTitle>📜 Log Konversi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm max-h-96 overflow-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-400">No conversion log available</div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!importResult && !exportResult) {
    return (
      <Card className="text-center py-8 text-gray-500">
        <CardContent>
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">Tidak Ada Hasil</h3>
          <p>Lakukan import atau export untuk melihat hasilnya di sini</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      {/* Header dengan Clear Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {importResult ? '📥 Hasil Import' : '📤 Hasil Export'}
        </h2>
        {onClearResults && (
          <Button 
            onClick={onClearResults}
            variant="outline"
            size="sm"
          >
            🗑️ Clear
          </Button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveView('summary')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'summary' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📊 Ringkasan
        </button>
        <button
          onClick={() => setActiveView('details')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'details' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🔍 Detail
        </button>
        <button
          onClick={() => setActiveView('log')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'log' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📜 Log
        </button>
      </div>

      {/* Content */}
      {activeView === 'summary' && (
        importResult ? renderImportSummary() : renderExportSummary()
      )}
      {activeView === 'details' && renderDetailedView()}
      {activeView === 'log' && renderConversionLog()}
    </div>
  );
};

export default BIMModelViewer;