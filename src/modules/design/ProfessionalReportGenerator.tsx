import React, { useState, useCallback, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Share2,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Building,
  Stamp,
  FileCheck,
  Award,
  Settings,
  Eye,
  BarChart3,
  Layout,
  Image,
  PenTool
} from 'lucide-react';
import ConstructionDrawingSystem from './ConstructionDrawingSystem';

interface ReportTemplate {
  id: string;
  name: string;
  type: 'calculation' | 'compliance' | 'drawing' | 'summary';
  description: string;
  sections: string[];
  requiredData: string[];
  format: 'pdf' | 'dwg' | 'excel';
}

interface ReportData {
  projectInfo: {
    name: string;
    location: string;
    client: string;
    engineer: string;
    date: string;
    projectNumber: string;
  };
  designResults: any;
  optimizationResults: any;
  complianceChecks: any;
  drawings: any[];
}

interface ReportGenerationProgress {
  stage: string;
  progress: number;
  currentSection: string;
  totalSections: number;
}

const ProfessionalReportGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'drawings'>('reports');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportData, setReportData] = useState<ReportData>({
    projectInfo: {
      name: 'High-Rise Commercial Building',
      location: 'Jakarta, Indonesia',
      client: 'PT. Pembangunan Jaya',
      engineer: 'Ir. Budi Santoso, M.Eng',
      date: new Date().toLocaleDateString('en-GB'),
      projectNumber: 'PRJ-2025-001'
    },
    designResults: null,
    optimizationResults: null,
    complianceChecks: null,
    drawings: []
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<ReportGenerationProgress>({
    stage: '',
    progress: 0,
    currentSection: '',
    totalSections: 0
  });
  
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);

  // Report Templates Database
  const reportTemplates: ReportTemplate[] = useMemo(() => [
    {
      id: 'structural-calculation',
      name: 'Structural Calculation Report',
      type: 'calculation',
      description: 'Comprehensive structural design calculations following SNI standards',
      sections: [
        'Executive Summary',
        'Design Criteria & Loads',
        'Material Properties',
        'Structural Analysis',
        'Member Design',
        'Connection Design',
        'Foundation Design',
        'Seismic Analysis',
        'Deflection Check',
        'Appendices'
      ],
      requiredData: ['designResults', 'materials', 'loads', 'analysis'],
      format: 'pdf'
    },
    {
      id: 'sni-compliance',
      name: 'SNI Compliance Certificate',
      type: 'compliance',
      description: 'Official compliance documentation for Indonesian building codes',
      sections: [
        'Project Overview',
        'Applied Standards',
        'Design Verification',
        'Safety Factor Compliance',
        'Load Path Analysis',
        'Quality Assurance',
        'Professional Certification',
        'Compliance Statement'
      ],
      requiredData: ['complianceChecks', 'standards', 'safetyFactors'],
      format: 'pdf'
    },
    {
      id: 'construction-drawings',
      name: 'Construction Drawings Package',
      type: 'drawing',
      description: 'Complete set of construction drawings with details',
      sections: [
        'General Plans',
        'Foundation Plans',
        'Framing Plans',
        'Elevation Views',
        'Section Views',
        'Connection Details',
        'Reinforcement Details',
        'Specifications'
      ],
      requiredData: ['geometry', 'sections', 'connections', 'reinforcement'],
      format: 'dwg'
    },
    {
      id: 'executive-summary',
      name: 'Executive Summary Report',
      type: 'summary',
      description: 'High-level project summary for stakeholders',
      sections: [
        'Project Overview',
        'Design Approach',
        'Key Results',
        'Optimization Summary',
        'Cost Analysis',
        'Timeline',
        'Recommendations'
      ],
      requiredData: ['projectInfo', 'optimizationResults', 'costAnalysis'],
      format: 'pdf'
    }
  ], []);

  // Generate Report Function
  const generateReport = useCallback(async (template: ReportTemplate) => {
    if (!template) return;

    setIsGenerating(true);
    setGenerationProgress({
      stage: 'Initializing',
      progress: 0,
      currentSection: '',
      totalSections: template.sections.length
    });

    try {
      // Simulate report generation process
      for (let i = 0; i < template.sections.length; i++) {
        const section = template.sections[i];
        
        setGenerationProgress(prev => ({
          ...prev,
          stage: 'Generating',
          currentSection: section,
          progress: ((i + 1) / template.sections.length) * 100
        }));

        // Simulate processing time for each section
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Finalize report
      setGenerationProgress(prev => ({
        ...prev,
        stage: 'Finalizing',
        currentSection: 'Compiling document',
        progress: 100
      }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create report metadata
      const newReport = {
        id: `report-${Date.now()}`,
        template: template,
        generatedAt: new Date(),
        size: `${(Math.random() * 10 + 2).toFixed(1)}MB`,
        pages: Math.floor(Math.random() * 50 + 20),
        status: 'completed'
      };

      setGeneratedReports(prev => [newReport, ...prev]);

    } catch (error) {
      console.error('Report generation error:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress({
        stage: '',
        progress: 0,
        currentSection: '',
        totalSections: 0
      });
    }
  }, []);

  // Preview Report Function
  const previewReport = useCallback((template: ReportTemplate) => {
    // Simulate opening preview
    alert(`Opening preview for: ${template.name}\n\nThis would open a preview window showing the report layout and sample content.`);
  }, []);

  // Download Report Function
  const downloadReport = useCallback((report: any) => {
    // Simulate download
    const blob = new Blob(['Sample report content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.template.name.replace(/\s+/g, '-')}.${report.template.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <FileText className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Professional Documentation System</h2>
            <p className="text-emerald-100">Automated reports and construction drawings with SNI compliance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-emerald-100 text-sm">Available Templates</div>
            <div className="text-xl font-bold">{reportTemplates.length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-emerald-100 text-sm">Generated Reports</div>
            <div className="text-xl font-bold">{generatedReports.length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-emerald-100 text-sm">Active Module</div>
            <div className="text-xl font-bold">{activeTab === 'reports' ? 'Reports' : 'Drawings'}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-emerald-100 text-sm">Progress</div>
            <div className="text-xl font-bold">{generationProgress.progress.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 px-6 py-4 text-center transition-colors ${
              activeTab === 'reports'
                ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Report Generator</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('drawings')}
            className={`flex-1 px-6 py-4 text-center transition-colors ${
              activeTab === 'drawings'
                ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <PenTool className="w-5 h-5" />
              <span className="font-medium">Construction Drawings</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Project Information */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-emerald-600" />
              Project Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 text-sm mb-1">Project Name</label>
                <input
                  type="text"
                  value={reportData.projectInfo.name}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    projectInfo: { ...prev.projectInfo, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-slate-600 text-sm mb-1">Location</label>
                <input
                  type="text"
                  value={reportData.projectInfo.location}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    projectInfo: { ...prev.projectInfo, location: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-slate-600 text-sm mb-1">Client</label>
                <input
                  type="text"
                  value={reportData.projectInfo.client}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    projectInfo: { ...prev.projectInfo, client: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-slate-600 text-sm mb-1">Structural Engineer</label>
                <input
                  type="text"
                  value={reportData.projectInfo.engineer}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    projectInfo: { ...prev.projectInfo, engineer: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-slate-600 text-sm mb-1">Project Number</label>
                <input
                  type="text"
                  value={reportData.projectInfo.projectNumber}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    projectInfo: { ...prev.projectInfo, projectNumber: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-slate-600 text-sm mb-1">Date</label>
                <input
                  type="date"
                  value={reportData.projectInfo.date}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    projectInfo: { ...prev.projectInfo, date: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Report Templates */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Layout className="w-5 h-5 mr-2 text-emerald-600" />
              Report Templates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTemplates.map((template) => (
                <div key={template.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {template.type === 'calculation' && <BarChart3 className="w-5 h-5 text-blue-600" />}
                      {template.type === 'compliance' && <Award className="w-5 h-5 text-green-600" />}
                      {template.type === 'drawing' && <PenTool className="w-5 h-5 text-purple-600" />}
                      {template.type === 'summary' && <FileCheck className="w-5 h-5 text-orange-600" />}
                      <h4 className="font-semibold text-slate-800">{template.name}</h4>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase">
                      {template.format}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-3">{template.description}</p>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Sections ({template.sections.length})</h5>
                    <div className="flex flex-wrap gap-1">
                      {template.sections.slice(0, 3).map((section, index) => (
                        <span key={index} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                          {section}
                        </span>
                      ))}
                      {template.sections.length > 3 && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          +{template.sections.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => previewReport(template)}
                      className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                    
                    <button
                      onClick={() => generateReport(template)}
                      disabled={isGenerating}
                      className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Generate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-emerald-600 animate-spin" />
                Generating Report
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Stage: {generationProgress.stage}</span>
                  <span>{generationProgress.progress.toFixed(0)}%</span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress.progress}%` }}
                  ></div>
                </div>
                
                <div className="text-sm text-slate-600">
                  Current: {generationProgress.currentSection}
                </div>
                
                <div className="text-sm text-slate-500">
                  Section {Math.ceil((generationProgress.progress / 100) * generationProgress.totalSections)} of {generationProgress.totalSections}
                </div>
              </div>
            </div>
          )}

          {/* Generated Reports */}
          {generatedReports.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2 text-emerald-600" />
                Generated Reports
              </h3>
              
              <div className="space-y-3">
                {generatedReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{report.template.name}</h4>
                        <div className="text-sm text-slate-600">
                          Generated: {report.generatedAt.toLocaleString()} • {report.size} • {report.pages} pages
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center space-x-1 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Ready</span>
                      </span>
                      
                      <button
                        onClick={() => downloadReport(report)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm flex items-center space-x-1"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Construction Drawings Tab */}
      {activeTab === 'drawings' && (
        <ConstructionDrawingSystem />
      )}
    </div>
  );
};

export default ProfessionalReportGenerator;