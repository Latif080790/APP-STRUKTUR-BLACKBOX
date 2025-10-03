/**
 * Consolidated Analysis Guide Component
 * Single interface for all help content per user preference for consolidated help system
 * Follows Progress Bar Requirement and UI Submenu Organization specifications
 */
import React, { useState } from 'react';
import { 
  BookOpen, ChevronDown, ChevronRight, Calculator, 
  Settings, Database, BarChart3, Zap, Wind, Activity,
  CheckCircle, AlertTriangle, Info, FileText, PlayCircle,
  Users, Clock, TrendingUp
} from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  category: 'getting-started' | 'analysis-types' | 'materials' | 'loads' | 'results' | 'compliance' | 'execution';
}

const ConsolidatedAnalysisGuide: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('getting-started');
  const [expandedSections, setExpandedSections] = useState<string[]>(['workflow']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const guideSections: GuideSection[] = [
    {
      id: 'workflow',
      title: 'Analysis Workflow',
      icon: BarChart3,
      category: 'getting-started',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Step-by-Step Process</h4>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li><strong>Define Building Geometry:</strong> Set dimensions, stories, and grid system</li>
              <li><strong>Select Materials:</strong> Choose appropriate concrete and steel grades per SNI standards</li>
              <li><strong>Configure Loads:</strong> Input dead, live, wind, and seismic loads</li>
              <li><strong>Choose Analysis Type:</strong> Select static, dynamic, linear, or nonlinear analysis</li>
              <li><strong>Run Analysis:</strong> Execute structural calculations with real engine</li>
              <li><strong>Review Results:</strong> Check compliance, safety factors, and recommendations</li>
            </ol>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Quick Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-green-800">
              <li>Use the 3D Viewer to visualize your structural model</li>
              <li>Check material compliance before running analysis</li>
              <li>Review load combinations for SNI compliance</li>
              <li>Export results for documentation and reporting</li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
              <PlayCircle className="w-4 h-4 mr-2" />
              Progress Tracking
            </h4>
            <p className="text-amber-800 text-sm">
              All analysis executions include real-time progress bars to track calculation status. 
              Monitor convergence, iterations, and completion percentage during analysis runs.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'execution-control',
      title: 'Analysis Execution Control',
      icon: PlayCircle,
      category: 'execution',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Control and monitor analysis execution with real-time feedback and progress tracking.</p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-2">Progress Bar Requirements</h4>
            <ul className="list-disc list-inside space-y-1 text-indigo-800">
              <li>Real-time progress indication during analysis execution</li>
              <li>Convergence status and iteration count display</li>
              <li>Estimated time remaining for completion</li>
              <li>Pause/resume functionality for long analyses</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Execution States</h4>
            <ul className="list-disc list-inside space-y-1 text-purple-800">
              <li><strong>Preparing:</strong> Model validation and setup</li>
              <li><strong>Solving:</strong> Matrix assembly and solution</li>
              <li><strong>Processing:</strong> Results calculation and verification</li>
              <li><strong>Completed:</strong> Analysis finished successfully</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'submenu-organization',
      title: 'Interface Organization',
      icon: Settings,
      category: 'execution',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Clear separation of analysis functions into dedicated submenus for better organization.</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Separate Submenus</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-1">Load Combinations</h5>
                <p className="text-sm text-gray-600">Dedicated interface for managing SNI-compliant load combinations</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-1">Analysis Execution</h5>
                <p className="text-sm text-gray-600">Run and monitor analysis processes with progress tracking</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-1">Analysis Reports</h5>
                <p className="text-sm text-gray-600">Generate and view comprehensive analysis reports</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'static-analysis',
      title: 'Static Analysis',
      icon: Calculator,
      category: 'analysis-types',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Linear static analysis for gravity and lateral loads using equilibrium equations.</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">When to Use</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Standard building structures under service loads</li>
              <li>Preliminary design and code compliance checking</li>
              <li>Linear elastic material behavior assumed</li>
              <li>Small displacement theory applies</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Key Assumptions</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Linear elastic material properties</li>
              <li>Small deformations (geometric linearity)</li>
              <li>No P-Δ effects considered</li>
              <li>Superposition principle applies</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'dynamic-analysis',
      title: 'Dynamic Analysis',
      icon: Activity,
      category: 'analysis-types',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Modal analysis and dynamic response for vibration and resonance studies.</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Applications</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Natural frequency determination</li>
              <li>Mode shape analysis</li>
              <li>Vibration serviceability checks</li>
              <li>Dynamic loading scenarios</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Progress Monitoring</h4>
            <p className="text-green-800 text-sm">
              Dynamic analysis includes eigenvalue solution progress tracking with mode convergence indicators.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'seismic-analysis',
      title: 'Seismic Analysis',
      icon: Zap,
      category: 'analysis-types',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Earthquake resistance design per SNI 1726:2019 standards.</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">SNI 1726:2019 Requirements</h4>
            <ul className="list-disc list-inside space-y-1 text-red-800">
              <li>Site-specific seismic parameters</li>
              <li>Seismic design category determination</li>
              <li>Response modification factors (R)</li>
              <li>Drift limitations and P-delta effects</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'wind-analysis',
      title: 'Wind Analysis',
      icon: Wind,
      category: 'analysis-types',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Wind load analysis per SNI 1727:2020 minimum design loads.</p>
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-900 mb-2">Wind Load Factors</h4>
            <ul className="list-disc list-inside space-y-1 text-cyan-800">
              <li>Basic wind speed determination</li>
              <li>Exposure category classification</li>
              <li>Building height effects</li>
              <li>Directional and gust factors</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'material-selection',
      title: 'Material Selection',
      icon: Database,
      category: 'materials',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Concrete Grades (SNI 2847:2019)</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li><strong>K-25:</strong> fc' = 25 MPa - General construction</li>
                <li><strong>K-30:</strong> fc' = 30 MPa - Structural members</li>
                <li><strong>K-35:</strong> fc' = 35 MPa - High-rise buildings</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Steel Grades (SNI 1729:2020)</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li><strong>BJ-37:</strong> fy = 240 MPa - Mild steel</li>
                <li><strong>BJ-41:</strong> fy = 280 MPa - Medium strength</li>
                <li><strong>BJ-50:</strong> fy = 410 MPa - High strength</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Material Properties Validation</h4>
            <p className="text-blue-800 text-sm">
              All material selections are automatically validated against SNI standards with 
              real-time compliance checking and engineering limit verification.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'load-combinations',
      title: 'Load Combinations',
      icon: Settings,
      category: 'loads',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">SNI-compliant load combinations for ultimate and serviceability limit states.</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Standard Combinations (SNI 1727:2020)</h4>
            <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
              <li><strong>1.4D:</strong> Dead load only</li>
              <li><strong>1.2D + 1.6L:</strong> Dead + live loads</li>
              <li><strong>1.2D + 1.0L + 1.0E:</strong> Dead + live + earthquake</li>
              <li><strong>1.2D + 1.0L + 1.0W:</strong> Dead + live + wind</li>
              <li><strong>0.9D ± 1.0E:</strong> Minimum dead + earthquake</li>
            </ul>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-2">Dynamic Data Refresh</h4>
            <p className="text-orange-800 text-sm">
              Load combinations are refreshed in real-time with visible loading states and 
              timestamps to indicate data freshness per system requirements.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'result-interpretation',
      title: 'Result Interpretation',
      icon: FileText,
      category: 'results',
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Visibility Rules
            </h4>
            <p className="text-amber-800 text-sm">
              Analysis results are only displayed when the analysis status is explicitly 'completed'. 
              Results are not visible in 'not-run' or 'running' states to prevent misleading data presentation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Acceptance Criteria</h4>
              <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                <li><strong>Displacement:</strong> L/300 (typical)</li>
                <li><strong>Stress Ratio:</strong> ≤ 0.9 for ultimate</li>
                <li><strong>Safety Factor:</strong> ≥ 2.0 minimum</li>
                <li><strong>Drift:</strong> Per SNI 1726 limits</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Warning Signs</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                <li><strong>High utilization:</strong> &gt; 90% capacity</li>
                <li><strong>Excessive drift:</strong> &gt; H/400</li>
                <li><strong>Low safety factor:</strong> &lt; 1.5</li>
                <li><strong>Non-convergence:</strong> Analysis issues</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'enhanced-results',
      title: 'Enhanced Result Interface',
      icon: TrendingUp,
      category: 'results',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Comprehensive analysis results with advanced properties and safety checks.</p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Advanced Properties</h4>
            <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm">
              <li><strong>Compliance:</strong> Automatic SNI standards verification</li>
              <li><strong>Safety Check:</strong> Multi-level safety factor analysis</li>
              <li><strong>Performance:</strong> Analysis metrics and optimization data</li>
              <li><strong>Design Optimization:</strong> Recommendations for improvement</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'sni-compliance',
      title: 'SNI Compliance',
      icon: CheckCircle,
      category: 'compliance',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Indonesian Standards (SNI)</h4>
            <ul className="list-disc list-inside space-y-1 text-green-800">
              <li><strong>SNI 1726:2019:</strong> Earthquake Resistance Design</li>
              <li><strong>SNI 1727:2020:</strong> Minimum Design Loads</li>
              <li><strong>SNI 2847:2019:</strong> Concrete Structure Design</li>
              <li><strong>SNI 1729:2020:</strong> Steel Structure Design</li>
            </ul>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-2">Compliance Checking</h4>
            <p className="text-orange-800 text-sm">
              The system automatically verifies compliance with applicable SNI standards based on 
              analysis type, material selection, and load combinations. Review all compliance 
              checks before finalizing your design.
            </p>
          </div>
        </div>
      )
    }
  ];

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
    { id: 'analysis-types', name: 'Analysis Types', icon: Calculator },
    { id: 'execution', name: 'Execution Control', icon: PlayCircle },
    { id: 'materials', name: 'Materials', icon: Database },
    { id: 'loads', name: 'Loads', icon: Settings },
    { id: 'results', name: 'Results', icon: BarChart3 },
    { id: 'compliance', name: 'SNI Compliance', icon: CheckCircle }
  ];

  const filteredSections = guideSections.filter(section => section.category === activeCategory);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Structural Analysis Guide</h2>
            <p className="text-blue-100 mt-1">Complete help and documentation in one consolidated place</p>
          </div>
        </div>
      </div>

      <div className="flex h-[32rem]">
        {/* Category Sidebar and Content Area */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">CATEGORIES</h3>
            <nav className="space-y-1">
              {categories.map(category => {
                const IconComponent = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm ${ 
                      isActive 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {categories.find(cat => cat.id === activeCategory)?.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <div className="space-y-4">
              {filteredSections.map(section => {
                const IconComponent = section.icon;
                const isExpanded = expandedSections.includes(section.id);
                
                return (
                  <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">{section.title}</h4>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        {section.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedAnalysisGuide;