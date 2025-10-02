/**
 * System Report Module
 * Comprehensive reporting system for structural analysis results
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Share, Printer, 
  BarChart3, Calculator, Database, DollarSign,
  Calendar, Filter, Search, Settings,
  CheckCircle, AlertTriangle, Clock, Eye
} from 'lucide-react';

interface ReportsModuleProps {
  subModule: string;
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ subModule }) => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [filters, setFilters] = useState({
    dateRange: '30days',
    project: 'all',
    reportType: 'all'
  });

  // Sample report data
  const analysisReports = [
    {
      id: 1,
      name: 'Seismic Analysis Report - Building A',
      type: 'Seismic Analysis',
      project: 'High-Rise Residence',
      date: '2024-01-15',
      status: 'Completed',
      pages: 45,
      size: '2.8 MB',
      summary: {
        maxDrift: '0.85%',
        baseshear: '2850 kN',
        periods: [1.85, 0.68, 0.45],
        compliance: 'SNI 1726:2019'
      }
    },
    {
      id: 2,
      name: 'Wind Load Analysis Report',
      type: 'Wind Analysis',
      project: 'Commercial Tower',
      date: '2024-01-12',
      status: 'Completed',
      pages: 32,
      size: '1.9 MB',
      summary: {
        maxPressure: '1.45 kPa',
        windSpeed: '35 m/s',
        heightCategory: 'III',
        compliance: 'SNI 1727:2020'
      }
    },
    {
      id: 3,
      name: 'Static Analysis Summary',
      type: 'Static Analysis',
      project: 'Industrial Warehouse',
      date: '2024-01-10',
      status: 'In Progress',
      pages: 28,
      size: '1.2 MB',
      summary: {
        maxDeflection: '12.5 mm',
        maxStress: '185 MPa',
        loadCombinations: 8,
        compliance: 'Multiple SNI'
      }
    }
  ];

  const designReports = [
    {
      id: 1,
      name: 'Steel Design Report - Main Frame',
      type: 'Steel Design',
      project: 'Office Building',
      date: '2024-01-14',
      status: 'Completed',
      pages: 38,
      size: '2.1 MB',
      summary: {
        beamCount: 45,
        columnCount: 28,
        connectionCount: 89,
        materialGrade: 'BjTS-50',
        compliance: 'SNI 1729:2020'
      }
    },
    {
      id: 2,
      name: 'Concrete Design Summary',
      type: 'Concrete Design',
      project: 'Residential Complex',
      date: '2024-01-11',
      status: 'Completed',
      pages: 52,
      size: '3.4 MB',
      summary: {
        concreteGrade: 'K-350',
        reinforcement: 'fy-400',
        slabThickness: '150mm',
        beamSize: '40x60cm',
        compliance: 'SNI 2847:2019'
      }
    }
  ];

  const materialSchedules = [
    {
      id: 1,
      name: 'Steel Material Schedule',
      project: 'High-Rise Building',
      date: '2024-01-15',
      items: [
        { description: 'WF 400x200x8x13', quantity: '125 pcs', weight: '15.8 ton', unit: 'Rp 18,500,000' },
        { description: 'WF 350x175x7x11', quantity: '89 pcs', weight: '9.2 ton', unit: 'Rp 10,800,000' },
        { description: 'WF 250x125x6x9', quantity: '156 pcs', weight: '6.4 ton', unit: 'Rp 7,200,000' }
      ],
      totalWeight: '31.4 ton',
      totalCost: 'Rp 36,500,000'
    },
    {
      id: 2,
      name: 'Concrete Material Schedule',
      project: 'Commercial Complex',
      date: '2024-01-12',
      items: [
        { description: 'Concrete K-350', quantity: '450 m³', weight: '1080 ton', unit: 'Rp 67,500,000' },
        { description: 'Steel Reinforcement D19', quantity: '8.5 ton', weight: '8.5 ton', unit: 'Rp 119,000,000' },
        { description: 'Steel Reinforcement D16', quantity: '12.2 ton', weight: '12.2 ton', unit: 'Rp 171,000,000' }
      ],
      totalWeight: '1100.7 ton',
      totalCost: 'Rp 357,500,000'
    }
  ];

  const costEstimations = [
    {
      id: 1,
      name: 'Project Cost Analysis - Phase 1',
      project: 'Mixed-Use Development',
      date: '2024-01-15',
      categories: [
        { name: 'Structural Steel', cost: 'Rp 2,450,000,000', percentage: 35 },
        { name: 'Concrete & Reinforcement', cost: 'Rp 1,890,000,000', percentage: 27 },
        { name: 'Foundation Work', cost: 'Rp 1,120,000,000', percentage: 16 },
        { name: 'Labor & Installation', cost: 'Rp 980,000,000', percentage: 14 },
        { name: 'Engineering & Others', cost: 'Rp 560,000,000', percentage: 8 }
      ],
      totalCost: 'Rp 7,000,000,000',
      costPerM2: 'Rp 3,500,000'
    }
  ];

  const renderAnalysisReports = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
            Analysis Reports
          </h3>

          <div className="space-y-4">
            {analysisReports.map(report => (
              <div key={report.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white/90 font-medium text-lg">{report.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-white/70 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{report.date}</span>
                      </span>
                      <span>{report.type}</span>
                      <span>{report.project}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded text-sm ${
                      report.status === 'Completed' ? 'bg-green-600/20 text-green-400' :
                      report.status === 'In Progress' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded p-3">
                    <h5 className="text-white/80 font-medium mb-2">Report Summary</h5>
                    <div className="space-y-1 text-sm">
                      {Object.entries(report.summary).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="text-white/90">{Array.isArray(value) ? value.join(', ') : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded p-3">
                    <h5 className="text-white/80 font-medium mb-2">Document Info</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Pages:</span>
                        <span className="text-white/90">{report.pages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">File Size:</span>
                        <span className="text-white/90">{report.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Format:</span>
                        <span className="text-white/90">PDF</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Preview</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-400/20 rounded transition-all">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/20 rounded transition-all">
                    <Share className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/20 rounded transition-all">
                    <Printer className="w-4 h-4" />
                    <span className="text-sm">Print</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDesignReports = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-green-400" />
            Design Reports
          </h3>

          <div className="space-y-4">
            {designReports.map(report => (
              <div key={report.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white/90 font-medium text-lg">{report.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-white/70 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{report.date}</span>
                      </span>
                      <span>{report.type}</span>
                      <span>{report.project}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded text-sm ${
                      report.status === 'Completed' ? 'bg-green-600/20 text-green-400' :
                      'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded p-3">
                    <h5 className="text-white/80 font-medium mb-2">Design Summary</h5>
                    <div className="space-y-1 text-sm">
                      {Object.entries(report.summary).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="text-white/90">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded p-3">
                    <h5 className="text-white/80 font-medium mb-2">Document Info</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Pages:</span>
                        <span className="text-white/90">{report.pages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">File Size:</span>
                        <span className="text-white/90">{report.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Format:</span>
                        <span className="text-white/90">PDF + DWG</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Preview</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-400/20 rounded transition-all">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/20 rounded transition-all">
                    <Share className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMaterialSchedules = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Database className="w-6 h-6 mr-2 text-purple-400" />
            Material Schedules
          </h3>

          <div className="space-y-6">
            {materialSchedules.map(schedule => (
              <div key={schedule.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-white/90 font-medium text-lg">{schedule.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-white/70 mt-1">
                      <span>{schedule.project}</span>
                      <span>{schedule.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-lg">{schedule.totalCost}</div>
                    <div className="text-white/60 text-sm">{schedule.totalWeight}</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 text-white/80 font-medium">Description</th>
                        <th className="text-right py-2 text-white/80 font-medium">Quantity</th>
                        <th className="text-right py-2 text-white/80 font-medium">Weight</th>
                        <th className="text-right py-2 text-white/80 font-medium">Unit Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.items.map((item, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-2 text-white/90">{item.description}</td>
                          <td className="py-2 text-white/80 text-right">{item.quantity}</td>
                          <td className="py-2 text-white/80 text-right">{item.weight}</td>
                          <td className="py-2 text-white/80 text-right">{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <button className="flex items-center space-x-2 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-400/20 rounded transition-all">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export Excel</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Export PDF</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/20 rounded transition-all">
                    <Share className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCostEstimation = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-orange-400" />
            Cost Estimation
          </h3>

          <div className="space-y-6">
            {costEstimations.map(estimation => (
              <div key={estimation.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="text-white/90 font-medium text-lg">{estimation.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-white/70 mt-1">
                      <span>{estimation.project}</span>
                      <span>{estimation.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-xl">{estimation.totalCost}</div>
                    <div className="text-white/60 text-sm">{estimation.costPerM2}/m²</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cost Breakdown */}
                  <div>
                    <h5 className="text-white/80 font-medium mb-3">Cost Breakdown</h5>
                    <div className="space-y-3">
                      {estimation.categories.map((category, index) => (
                        <div key={index} className="bg-white/5 rounded p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white/90 font-medium">{category.name}</span>
                            <span className="text-green-400 font-bold">{category.cost}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-white/60 text-sm mt-1">{category.percentage}% of total</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cost Chart Placeholder */}
                  <div className="bg-white/5 rounded p-4">
                    <h5 className="text-white/80 font-medium mb-3">Cost Distribution</h5>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded h-64 flex items-center justify-center border border-white/10">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <div className="text-white/80">Interactive Cost Chart</div>
                        <div className="text-white/60 text-sm">Visual cost breakdown</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-6">
                  <button className="flex items-center space-x-2 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-400/20 rounded transition-all">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export Excel</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Export PDF</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/20 rounded transition-all">
                    <Share className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderExportOptions = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Download className="w-6 h-6 mr-2 text-cyan-400" />
            Export Options
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PDF Export */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="text-white/90 font-medium">PDF Reports</h4>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox bg-white/10 border-white/20 text-red-500" defaultChecked />
                  <span className="text-white/80 text-sm">Include calculations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox bg-white/10 border-white/20 text-red-500" defaultChecked />
                  <span className="text-white/80 text-sm">Include drawings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox bg-white/10 border-white/20 text-red-500" />
                  <span className="text-white/80 text-sm">Watermark</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center space-x-2 p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-400/20 rounded transition-all">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export PDF</span>
              </button>
            </div>

            {/* Excel Export */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-white/90 font-medium">Excel Spreadsheet</h4>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox bg-white/10 border-white/20 text-green-500" defaultChecked />
                  <span className="text-white/80 text-sm">Material schedules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox bg-white/10 border-white/20 text-green-500" defaultChecked />
                  <span className="text-white/80 text-sm">Cost analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox bg-white/10 border-white/20 text-green-500" />
                  <span className="text-white/80 text-sm">Raw data</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center space-x-2 p-2 bg-green-600/20 hover:bg-green-600/30 border border-green-400/20 rounded transition-all">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export Excel</span>
              </button>
            </div>

            {/* DWG Export */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calculator className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-white/90 font-medium">AutoCAD DWG</h4>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox bg-white/10 border-white/20 text-blue-500" defaultChecked />
                  <span className="text-white/80 text-sm">Structural drawings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox bg-white/10 border-white/20 text-blue-500" />
                  <span className="text-white/80 text-sm">Reinforcement details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox bg-white/10 border-white/20 text-blue-500" />
                  <span className="text-white/80 text-sm">3D model</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center space-x-2 p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export DWG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderSubModule = () => {
    switch(subModule) {
      case 'analysis-reports':
        return renderAnalysisReports();
      case 'design-reports':
        return renderDesignReports();
      case 'material-schedules':
        return renderMaterialSchedules();
      case 'cost-estimation':
        return renderCostEstimation();
      case 'technical-docs':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Technical Documentation</h3>
            <p className="text-white/60">Technical documentation module coming soon...</p>
          </div>
        );
      case 'export-options':
        return renderExportOptions();
      case 'report-templates':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Report Templates</h3>
            <p className="text-white/60">Custom report templates coming soon...</p>
          </div>
        );
      case 'automated-reports':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Automated Reports</h3>
            <p className="text-white/60">Automated report generation coming soon...</p>
          </div>
        );
      default:
        return renderAnalysisReports();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">System Report</h1>
          <p className="text-white/60">
            Comprehensive reporting system for all analysis and design results
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-white/60" />
            <select 
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value}))}
              className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-white/60" />
            <select 
              value={filters.project}
              onChange={(e) => setFilters(prev => ({...prev, project: e.target.value}))}
              className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
            >
              <option value="all">All Projects</option>
              <option value="high-rise">High-Rise Building</option>
              <option value="commercial">Commercial Tower</option>
            </select>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'analysis-reports', label: 'Analysis Reports' },
            { id: 'design-reports', label: 'Design Reports' },
            { id: 'material-schedules', label: 'Material Schedules' },
            { id: 'cost-estimation', label: 'Cost Estimation' },
            { id: 'export-options', label: 'Export Options' }
          ].map(item => (
            <button
              key={item.id}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                subModule === item.id
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-400/30'
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderSubModule()}
      </div>
    </div>
  );
};

export default ReportsModule;