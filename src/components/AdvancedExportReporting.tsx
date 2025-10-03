/**
 * Advanced Export and Reporting System
 * Comprehensive reporting with performance metrics integration and custom templates
 * Following user preferences: English UI, prominent features, consolidated interface
 */

import React, { useState, useCallback } from 'react';
import { 
  FileText, Download, Eye, Settings, Calendar, 
  BarChart3, Users, Clock, Cpu, Target, CheckCircle,
  Filter, Layout, Palette, FileDown, Printer,
  Globe, Mail, Share2, Archive, Star
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'analysis' | 'performance' | 'compliance' | 'custom';
  sections: string[];
  estimatedSize: string;
  generateTime: string;
  popularity: number;
}

interface ExportOptions {
  format: 'pdf' | 'excel' | 'word' | 'csv' | 'json';
  template: string;
  timeRange: '1h' | '24h' | '7d' | '30d' | 'custom';
  includeCharts: boolean;
  includeRawData: boolean;
  includePerformanceMetrics: boolean;
  customSections: string[];
  branding: boolean;
  watermark: boolean;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'comprehensive-analysis',
    name: 'Comprehensive Analysis Report',
    description: 'Complete structural analysis with SNI compliance, performance metrics, and recommendations',
    category: 'analysis',
    sections: ['Executive Summary', 'Analysis Results', 'SNI Compliance', 'Performance Metrics', 'Recommendations'],
    estimatedSize: '2.5 MB',
    generateTime: '30-45 sec',
    popularity: 95
  },
  {
    id: 'performance-dashboard',
    name: 'Performance Analytics Report',
    description: 'Detailed performance metrics, user behavior analysis, and system health monitoring',
    category: 'performance',
    sections: ['Performance Overview', 'User Analytics', 'System Health', 'Trend Analysis', 'Optimization Recommendations'],
    estimatedSize: '1.8 MB',
    generateTime: '20-30 sec',
    popularity: 87
  },
  {
    id: 'sni-compliance',
    name: 'SNI Compliance Report',
    description: 'Comprehensive compliance check against Indonesian National Standards with detailed documentation',
    category: 'compliance',
    sections: ['Compliance Summary', 'Standard References', 'Validation Results', 'Non-compliance Issues', 'Corrective Actions'],
    estimatedSize: '3.2 MB',
    generateTime: '45-60 sec',
    popularity: 76
  },
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level overview for stakeholders with key findings and recommendations',
    category: 'analysis',
    sections: ['Project Overview', 'Key Findings', 'Risk Assessment', 'Recommendations', 'Next Steps'],
    estimatedSize: '800 KB',
    generateTime: '10-15 sec',
    popularity: 92
  },
  {
    id: 'technical-detail',
    name: 'Technical Analysis Detail',
    description: 'In-depth technical analysis with calculations, formulas, and detailed engineering data',
    category: 'analysis',
    sections: ['Calculation Details', 'Engineering Formulas', 'Material Properties', 'Load Analysis', 'Design Verification'],
    estimatedSize: '4.1 MB',
    generateTime: '60-90 sec',
    popularity: 68
  },
  {
    id: 'custom-template',
    name: 'Custom Report Template',
    description: 'Build your own report with selected sections and custom formatting',
    category: 'custom',
    sections: ['Custom Sections'],
    estimatedSize: 'Variable',
    generateTime: 'Variable',
    popularity: 84
  }
];

export const AdvancedExportReporting: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('comprehensive-analysis');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    template: 'comprehensive-analysis',
    timeRange: '24h',
    includeCharts: true,
    includeRawData: false,
    includePerformanceMetrics: true,
    customSections: [],
    branding: true,
    watermark: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'templates' | 'options' | 'preview'>('templates');

  const handleGenerateReport = useCallback(async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate report generation with progress
    const template = reportTemplates.find(t => t.id === selectedTemplate);
    const estimatedTime = template ? parseInt(template.generateTime.split('-')[1]) : 30;
    
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, (estimatedTime * 1000) / 20));
      setGenerationProgress(i);
    }

    // Simulate download
    const blob = new Blob(['Generated report content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
    setGenerationProgress(0);
  }, [selectedTemplate, exportOptions]);

  const updateExportOption = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analysis': return BarChart3;
      case 'performance': return Cpu;
      case 'compliance': return CheckCircle;
      case 'custom': return Settings;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analysis': return 'blue';
      case 'performance': return 'green';
      case 'compliance': return 'purple';
      case 'custom': return 'orange';
      default: return 'gray';
    }
  };

  const renderTemplateCard = (template: ReportTemplate) => {
    const Icon = getCategoryIcon(template.category);
    const color = getCategoryColor(template.category);
    const isSelected = selectedTemplate === template.id;

    return (
      <div
        key={template.id}
        onClick={() => setSelectedTemplate(template.id)}
        className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
          isSelected
            ? `border-${color}-500 bg-${color}-50 shadow-lg`
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Icon className={`w-6 h-6 mr-3 text-${color}-600`} />
            <div>
              <h3 className={`font-semibold text-lg ${isSelected ? `text-${color}-900` : 'text-gray-900'}`}>
                {template.name}
              </h3>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded text-xs font-medium bg-${color}-100 text-${color}-700`}>
                  {template.category.toUpperCase()}
                </span>
                <div className="flex items-center ml-2">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">{template.popularity}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{template.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap gap-1">
            {template.sections.slice(0, 3).map((section, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {section}
              </span>
            ))}
            {template.sections.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{template.sections.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <FileDown className="w-4 h-4 mr-1" />
            {template.estimatedSize}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {template.generateTime}
          </div>
        </div>
      </div>
    );
  };

  const renderOptionsPanel = () => (
    <div className="space-y-6">
      {/* Export Format */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { format: 'pdf', label: 'PDF', icon: FileText, description: 'Professional document' },
            { format: 'excel', label: 'Excel', icon: BarChart3, description: 'Data analysis' },
            { format: 'word', label: 'Word', icon: FileText, description: 'Editable document' },
            { format: 'csv', label: 'CSV', icon: Target, description: 'Raw data' },
            { format: 'json', label: 'JSON', icon: Settings, description: 'API format' }
          ].map(({ format, label, icon: Icon, description }) => (
            <button
              key={format}
              onClick={() => updateExportOption('format', format as any)}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportOptions.format === format
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs opacity-75">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Options */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeCharts}
                onChange={(e) => updateExportOption('includeCharts', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <div>
                <span className="font-medium text-gray-900">Include Charts & Graphs</span>
                <p className="text-sm text-gray-600">Visual representations of data and analysis</p>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeRawData}
                onChange={(e) => updateExportOption('includeRawData', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <div>
                <span className="font-medium text-gray-900">Include Raw Data</span>
                <p className="text-sm text-gray-600">Detailed calculation data and input parameters</p>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includePerformanceMetrics}
                onChange={(e) => updateExportOption('includePerformanceMetrics', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <div>
                <span className="font-medium text-gray-900">Include Performance Metrics</span>
                <p className="text-sm text-gray-600">System performance and optimization data</p>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.branding}
                onChange={(e) => updateExportOption('branding', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <div>
                <span className="font-medium text-gray-900">Include Branding</span>
                <p className="text-sm text-gray-600">Company logo and professional styling</p>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.watermark}
                onChange={(e) => updateExportOption('watermark', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <div>
                <span className="font-medium text-gray-900">Add Watermark</span>
                <p className="text-sm text-gray-600">Security watermark for document protection</p>
              </div>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={exportOptions.timeRange}
                onChange={(e) => updateExportOption('timeRange', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sharing Options */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sharing & Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Mail className="w-5 h-5 text-blue-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Email Report</div>
              <div className="text-sm text-gray-600">Send directly to recipients</div>
            </div>
          </button>

          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-5 h-5 text-green-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Share Link</div>
              <div className="text-sm text-gray-600">Generate secure sharing link</div>
            </div>
          </button>

          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Archive className="w-5 h-5 text-purple-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Archive Report</div>
              <div className="text-sm text-gray-600">Save to project archive</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    const template = reportTemplates.find(t => t.id === selectedTemplate);
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Preview</h3>
        
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{template?.name}</h1>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">Format: {exportOptions.format.toUpperCase()}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">Time Range: {exportOptions.timeRange}</span>
            </div>
          </div>

          <div className="space-y-4">
            {template?.sections.map((section, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">{section}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  This section will contain detailed {section.toLowerCase()} information and analysis.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Included Features</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {exportOptions.includeCharts && <div className="flex items-center text-blue-700"><CheckCircle className="w-4 h-4 mr-1" />Charts & Graphs</div>}
              {exportOptions.includeRawData && <div className="flex items-center text-blue-700"><CheckCircle className="w-4 h-4 mr-1" />Raw Data</div>}
              {exportOptions.includePerformanceMetrics && <div className="flex items-center text-blue-700"><CheckCircle className="w-4 h-4 mr-1" />Performance Metrics</div>}
              {exportOptions.branding && <div className="flex items-center text-blue-700"><CheckCircle className="w-4 h-4 mr-1" />Company Branding</div>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-blue-600" />
                Advanced Export & Reporting
              </h1>
              <p className="text-gray-600 mt-1">
                Generate comprehensive reports with performance metrics and custom formatting
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className={`flex items-center px-6 py-2 rounded-lg font-semibold transition-all ${
                  isGenerating
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Settings className="w-4 h-4 mr-2 animate-spin" />
                    Generating... {generationProgress}%
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Generating your report... This may take a few moments.
              </p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'templates', label: 'Report Templates', icon: Layout },
                { id: 'options', label: 'Export Options', icon: Settings },
                { id: 'preview', label: 'Preview', icon: Eye }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'templates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTemplates.map(renderTemplateCard)}
              </div>
            )}

            {activeTab === 'options' && renderOptionsPanel()}

            {activeTab === 'preview' && renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedExportReporting;