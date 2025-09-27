/**
 * Design Visualization Component
 * Interactive visualization for structural design results
 */

import React, { useState } from 'react';
import { DesignResults, ReinforcementDetail } from './StructuralDesignEngine';
import { DesignSummary } from './DesignResultsManager';

interface DesignVisualizationProps {
  results: DesignResults;
  elementId: string;
}

interface DesignDashboardProps {
  summary: DesignSummary;
  onElementSelect: (elementId: string) => void;
}

export const DesignVisualization: React.FC<DesignVisualizationProps> = ({ 
  results, 
  elementId 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'drawings' | 'cost'>('overview');

  const getStatusColor = (status: 'pass' | 'fail'): string => {
    return status === 'pass' ? '#4CAF50' : '#f44336';
  };

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {results.element.type.toUpperCase()} - {elementId}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {results.element.dimensions.width}
            </div>
            <div className="text-sm text-gray-600">Lebar (mm)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {results.element.dimensions.height}
            </div>
            <div className="text-sm text-gray-600">Tinggi (mm)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {results.element.concreteGrade}
            </div>
            <div className="text-sm text-gray-600">Mutu Beton</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {results.element.steelGrade}
            </div>
            <div className="text-sm text-gray-600">Mutu Baja</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-3">Status Validasi</h4>
          <div className="space-y-2">
            <div className={`flex items-center justify-between p-2 rounded ${
              results.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <span>Status Keseluruhan</span>
              <span className="font-semibold">
                {results.isValid ? '✅ LULUS' : '❌ TIDAK LULUS'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-3">Ringkasan Tulangan</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tulangan Utama:</span>
              <span className="font-mono text-sm">
                {results.reinforcement.mainReinforcement.topBars[0]?.quantity || 0}D
                {results.reinforcement.mainReinforcement.topBars[0]?.diameter || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sengkang:</span>
              <span className="font-mono text-sm">
                D{results.reinforcement.shearReinforcement.stirrups.diameter}-
                {results.reinforcement.shearReinforcement.stirrups.spacing}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailChecks = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Pemeriksaan Detail</h4>
      
      {Object.entries(results.checks).map(([checkName, check]) => (
        <div key={checkName} className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium capitalize">
              {checkName.replace(/([A-Z])/g, ' $1').trim()}
            </h5>
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                check.status === 'pass' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {check.status === 'pass' ? 'LULUS' : 'TIDAK LULUS'}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            {('required' in check) && typeof check.required !== 'undefined' && (
              <div>
                <span className="text-gray-600">Diperlukan:</span>
                <div className="font-medium">{check.required.toFixed(2)}</div>
              </div>
            )}
            {('provided' in check) && typeof check.provided !== 'undefined' && (
              <div>
                <span className="text-gray-600">Tersedia:</span>
                <div className="font-medium">{check.provided.toFixed(2)}</div>
              </div>
            )}
            {('ratio' in check) && typeof check.ratio !== 'undefined' && (
              <div>
                <span className="text-gray-600">Rasio:</span>
                <div className="font-medium">
                  {(check.ratio * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>

          {/* Progress bar for ratio */}
          {('ratio' in check) && typeof check.ratio !== 'undefined' && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    check.status === 'pass' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(check.ratio * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDrawings = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Gambar Teknis</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h5 className="font-medium mb-3">Tampak Samping</h5>
          <div className="bg-gray-50 p-4 rounded text-center">
            <div dangerouslySetInnerHTML={{ __html: results.drawings.elevation }} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <h5 className="font-medium mb-3">Potongan</h5>
          <div className="bg-gray-50 p-4 rounded text-center">
            <div dangerouslySetInnerHTML={{ __html: results.drawings.section }} />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <h5 className="font-medium mb-3">Detail Tulangan</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Panjang Penyaluran:</span>
            <div className="font-medium">{results.reinforcement.detailing.anchorageLength}mm</div>
          </div>
          <div>
            <span className="text-gray-600">Panjang Sambungan:</span>
            <div className="font-medium">{results.reinforcement.detailing.lapLength}mm</div>
          </div>
          <div>
            <span className="text-gray-600">Panjang Kait:</span>
            <div className="font-medium">{results.reinforcement.detailing.hookLength}mm</div>
          </div>
          <div>
            <span className="text-gray-600">Jarak Minimum:</span>
            <div className="font-medium">{results.reinforcement.detailing.minimumSpacing}mm</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCostAnalysis = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Analisis Biaya</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h5 className="font-medium mb-3">Rincian Biaya</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Beton:</span>
              <span className="font-medium">
                Rp {results.cost.concrete.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Baja Tulangan:</span>
              <span className="font-medium">
                Rp {results.cost.steel.toLocaleString('id-ID')}
              </span>
            </div>
            {results.cost.formwork && (
              <div className="flex justify-between">
                <span>Bekisting:</span>
                <span className="font-medium">
                  Rp {results.cost.formwork.toLocaleString('id-ID')}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tenaga Kerja:</span>
              <span className="font-medium">
                Rp {results.cost.labor.toLocaleString('id-ID')}
              </span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">
                Rp {results.cost.total.toLocaleString('id-ID')}
              </span>
            </div>
            {results.cost.breakdown && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  <div>Rasio Baja: {results.cost.breakdown.steelRatio?.toFixed(1)} kg/m³</div>
                  <div>Biaya Material: Rp {results.cost.breakdown.materialCost?.toLocaleString('id-ID')}</div>
                  <div>Biaya Konstruksi: Rp {results.cost.breakdown.constructionCost?.toLocaleString('id-ID')}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h5 className="font-medium mb-3">Distribusi Biaya</h5>
          <CostChart cost={results.cost} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg">
        {[
          { key: 'overview', label: 'Ringkasan' },
          { key: 'details', label: 'Detail Cek' },
          { key: 'drawings', label: 'Gambar' },
          { key: 'cost', label: 'Biaya' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'details' && renderDetailChecks()}
        {activeTab === 'drawings' && renderDrawings()}
        {activeTab === 'cost' && renderCostAnalysis()}
      </div>
    </div>
  );
};

export const DesignDashboard: React.FC<DesignDashboardProps> = ({ 
  summary, 
  onElementSelect 
}) => {
  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{summary.projectInfo.name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{summary.overallStatus.totalElements}</div>
            <div className="text-sm opacity-90">Total Elemen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-300">
              {summary.overallStatus.passedElements}
            </div>
            <div className="text-sm opacity-90">Lulus</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-300">
              {summary.overallStatus.warningElements}
            </div>
            <div className="text-sm opacity-90">Warning</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-300">
              {summary.overallStatus.failedElements}
            </div>
            <div className="text-sm opacity-90">Gagal</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span>Rating Keseluruhan</span>
            <span className="font-bold">{summary.overallStatus.overallRating}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${summary.overallStatus.overallRating}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summary.elements.map((element) => (
          <div
            key={element.id}
            onClick={() => onElementSelect(element.id)}
            className={`bg-white p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
              element.status === 'pass' 
                ? 'border-green-500' 
                : element.status === 'warning'
                ? 'border-yellow-500'
                : 'border-red-500'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{element.id}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                element.status === 'pass'
                  ? 'bg-green-100 text-green-800'
                  : element.status === 'warning'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {element.status.toUpperCase()}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
            </div>
            
            <div className="text-xs text-gray-500">
              {element.results.summary}
            </div>
            
            <div className="mt-3 text-sm font-medium text-gray-800">
              Rp {element.results.cost.total.toLocaleString('id-ID')}
            </div>
          </div>
        ))}
      </div>

      {/* Cost Summary */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Ringkasan Biaya</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              Rp {(summary.costs.totalConcrete / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Beton</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">
              Rp {(summary.costs.totalSteel / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Baja Tulangan</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              Rp {(summary.costs.totalLabor / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Tenaga Kerja</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">
              Rp {(summary.costs.grandTotal / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Rekomendasi</h3>
        <ul className="space-y-2">
          {summary.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Simple cost chart component
const CostChart: React.FC<{ cost: any }> = ({ cost }) => {
  const total = cost.total;
  const concretePercent = (cost.concrete / total) * 100;
  const steelPercent = (cost.steel / total) * 100;
  const laborPercent = (cost.labor / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
        <span className="text-sm">Beton ({concretePercent.toFixed(1)}%)</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
        <span className="text-sm">Baja ({steelPercent.toFixed(1)}%)</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
        <span className="text-sm">Tenaga Kerja ({laborPercent.toFixed(1)}%)</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
        <div className="flex h-4 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500" 
            style={{ width: `${concretePercent}%` }}
          ></div>
          <div 
            className="bg-orange-500" 
            style={{ width: `${steelPercent}%` }}
          ></div>
          <div 
            className="bg-green-500" 
            style={{ width: `${laborPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DesignVisualization;