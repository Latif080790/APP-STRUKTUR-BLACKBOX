import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Building2, 
  Share, 
  Database, 
  Layers,
  FileImage,
  Download,
  Upload,
  Zap,
  CheckCircle,
  AlertTriangle,
  Globe,
  Monitor,
  Users,
  Clock,
  RefreshCw
} from 'lucide-react';

interface BIMIntegrationSystemProps {
  geometry: {
    length: number;
    width: number;
    heightPerFloor: number;
    numberOfFloors: number;
    baySpacingX: number;
    baySpacingY: number;
  };
  materials: {
    fc: number;
    fy: number;
    ec: number;
    densityConcrete: number;
  };
  analysisResults?: any;
  costResults?: any;
  onBIMUpdate?: (bimData: any) => void;
}

// BIM Software Integration Endpoints
const BIM_INTEGRATIONS = {
  autodesk: {
    name: 'Autodesk Revit',
    icon: '🏗️',
    formats: ['RVT', 'DWG', 'IFC'],
    status: 'available',
    features: ['Structural Model Export', '3D Visualization', 'Family Creation']
  },
  tekla: {
    name: 'Tekla Structures',
    icon: '🔧',
    formats: ['IFC', 'CIS/2', 'SDNF'],
    status: 'available', 
    features: ['Detailed Modeling', 'Steel Connections', 'Drawings']
  },
  sap: {
    name: 'SAP2000',
    icon: '📊',
    formats: ['S2K', 'SDB', 'IFC'],
    status: 'available',
    features: ['Analysis Results', 'Load Cases', 'Member Forces']
  },
  etabs: {
    name: 'ETABS',
    icon: '🏢',
    formats: ['EDB', 'E2K', 'IFC'],
    status: 'available',
    features: ['Building Analysis', 'Seismic Design', 'Wind Analysis']
  }
};

export const BIMIntegrationSystem: React.FC<BIMIntegrationSystemProps> = ({
  geometry,
  materials,
  analysisResults,
  costResults,
  onBIMUpdate
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<'IFC' | 'DWG' | 'RVT' | 'S2K'>('IFC');
  const [bimResults, setBimResults] = useState<any>(null);
  const [collaborationData, setCollaborationData] = useState<any>(null);

  // Generate BIM Model Data
  const bimModelData = useMemo(() => {
    const totalElements = Math.ceil(geometry.length / geometry.baySpacingX + 1) * 
                          Math.ceil(geometry.width / geometry.baySpacingY + 1) * 
                          geometry.numberOfFloors;
    
    const totalNodes = Math.ceil(geometry.length / geometry.baySpacingX + 1) * 
                       Math.ceil(geometry.width / geometry.baySpacingY + 1) * 
                       (geometry.numberOfFloors + 1);

    return {
      modelInfo: {
        name: `Structural Model ${Date.now()}`,
        version: '1.0',
        created: new Date().toISOString(),
        software: 'Structural Analysis System',
        units: 'Metric',
        coordSystem: 'Global'
      },
      geometry: {
        buildings: 1,
        floors: geometry.numberOfFloors,
        totalElements,
        totalNodes,
        boundingBox: {
          min: [0, 0, 0],
          max: [geometry.length, geometry.width, geometry.numberOfFloors * geometry.heightPerFloor]
        }
      },
      materials: [
        {
          id: 'concrete',
          name: `Concrete fc'=${materials.fc} MPa`,
          type: 'concrete',
          properties: materials
        },
        {
          id: 'steel',
          name: `Steel fy=${materials.fy} MPa`,
          type: 'steel',
          properties: { fy: materials.fy, es: 200000 }
        }
      ],
      loadCases: analysisResults ? Object.keys(analysisResults.loads || {}) : ['Dead', 'Live', 'Seismic'],
      analysisData: analysisResults ? {
        solved: true,
        results: analysisResults,
        timestamp: new Date().toISOString()
      } : { solved: false }
    };
  }, [geometry, materials, analysisResults]);

  const runBIMExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    const exportSteps = [
      'Preparing model data...',
      'Converting geometry...',
      'Processing materials...',
      'Including analysis results...',
      'Generating BIM file...',
      'Finalizing export...'
    ];

    for (let i = 0; i < exportSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setExportProgress(((i + 1) / exportSteps.length) * 100);
    }

    const exportData = {
      timestamp: new Date().toISOString(),
      format: selectedFormat,
      modelData: bimModelData,
      exportSettings: {
        includeAnalysis: !!analysisResults,
        includeCost: !!costResults,
        detailLevel: 'Medium',
        precision: 3
      },
      fileSize: `${(Math.random() * 50 + 10).toFixed(1)} MB`,
      compatibility: getBIMCompatibility(selectedFormat)
    };

    setBimResults(exportData);
    if (onBIMUpdate) {
      onBIMUpdate(exportData);
    }
    
    setIsExporting(false);
  };

  const getBIMCompatibility = (format: string) => {
    const compatibility: Record<string, string[]> = {
      'IFC': ['Revit', 'ArchiCAD', 'Tekla', 'SAP2000', 'ETABS', 'SketchUp'],
      'DWG': ['AutoCAD', 'Revit', 'MicroStation', 'BricsCAD'],
      'RVT': ['Revit', 'Navisworks', 'Dynamo'],
      'S2K': ['SAP2000', 'SAFE', 'ETABS']
    };
    return compatibility[format] || ['Generic BIM Software'];
  };

  const startCollaboration = async () => {
    setCollaborationData({
      projectId: `PROJ-${Date.now()}`,
      status: 'active',
      participants: [
        { role: 'Structural Engineer', name: 'Current User', status: 'online' },
        { role: 'Architect', name: 'Team Member', status: 'away' },
        { role: 'MEP Engineer', name: 'Team Member', status: 'offline' }
      ],
      sharedModels: [
        { name: 'Architectural Model', version: '2.1', lastUpdate: '2 hours ago' },
        { name: 'Structural Analysis', version: '1.0', lastUpdate: 'just now' },
        { name: 'MEP Systems', version: '1.5', lastUpdate: '1 day ago' }
      ],
      conflicts: [
        {
          type: 'geometry',
          severity: 'medium',
          description: 'Beam level conflict with HVAC duct',
          location: 'Grid B-3, Level 2'
        }
      ]
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            BIM Integration & Collaboration System
          </CardTitle>
          <div className="flex gap-2 items-center">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              BIM Ready
            </Badge>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as any)}
              className="px-3 py-1 border rounded text-sm"
              disabled={isExporting}
            >
              <option value="IFC">IFC (Industry Foundation Classes)</option>
              <option value="DWG">DWG (AutoCAD Format)</option>
              <option value="RVT">RVT (Revit Native)</option>
              <option value="S2K">S2K (SAP2000 Format)</option>
            </select>
            <Button 
              onClick={runBIMExport} 
              disabled={isExporting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Share className="w-4 h-4 mr-2" />}
              {isExporting ? 'Exporting...' : 'Export BIM'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="export">Model Export</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="quality">Quality Check</TabsTrigger>
          </TabsList>

          {/* Export Tab */}
          <TabsContent value="export">
            {/* Export Progress */}
            {isExporting && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">
                    Exporting BIM Model...
                  </span>
                  <span className="text-sm text-blue-600">{exportProgress.toFixed(0)}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}

            {/* Model Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-600" />
                    Model Data Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Buildings:</span>
                      <span className="font-semibold">{bimModelData.geometry.buildings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Floors:</span>
                      <span className="font-semibold">{bimModelData.geometry.floors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Elements:</span>
                      <span className="font-semibold">{bimModelData.geometry.totalElements.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Nodes:</span>
                      <span className="font-semibold">{bimModelData.geometry.totalNodes.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span>Model Status:</span>
                        <Badge variant={bimModelData.analysisData.solved ? "default" : "secondary"}>
                          {bimModelData.analysisData.solved ? "Analyzed" : "Geometry Only"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-600" />
                    Export Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Include Analysis Results</label>
                      <input type="checkbox" defaultChecked={!!analysisResults} className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Include Cost Data</label>
                      <input type="checkbox" defaultChecked={!!costResults} className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Detail Level</label>
                      <select className="px-2 py-1 border rounded text-sm">
                        <option>Low</option>
                        <option selected>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Coordinate Precision</label>
                      <select className="px-2 py-1 border rounded text-sm">
                        <option>1 mm</option>
                        <option>0.1 mm</option>
                        <option selected>0.01 mm</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Export Results */}
            {bimResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Export Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-green-50 rounded">
                      <div className="text-sm font-medium text-green-700">File Format</div>
                      <div className="text-lg font-bold text-green-900">{bimResults.format}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="text-sm font-medium text-blue-700">File Size</div>
                      <div className="text-lg font-bold text-blue-900">{bimResults.fileSize}</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="text-sm font-medium text-purple-700">Compatible Software</div>
                      <div className="text-lg font-bold text-purple-900">{bimResults.compatibility.length}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Compatible BIM Software:</div>
                    <div className="flex flex-wrap gap-2">
                      {bimResults.compatibility.map((software: string, index: number) => (
                        <Badge key={index} variant="outline">{software}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        // Simulate file download
                        const element = document.createElement('a');
                        const file = new Blob([JSON.stringify(bimResults.modelData, null, 2)], { type: 'application/json' });
                        element.href = URL.createObjectURL(file);
                        element.download = `structural-model.${selectedFormat.toLowerCase()}`;
                        element.click();
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download {selectedFormat} File
                    </Button>
                    <Button variant="outline">
                      <FileImage className="w-4 h-4 mr-2" />
                      Generate Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(BIM_INTEGRATIONS).map(([key, integration]) => (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{integration.icon}</span>
                      {integration.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <Badge variant={integration.status === 'available' ? 'default' : 'secondary'}>
                          {integration.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-1">Supported Formats:</div>
                        <div className="flex flex-wrap gap-1">
                          {integration.formats.map((format, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">Features:</div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {integration.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button variant="outline" className="w-full">
                        <Zap className="w-4 h-4 mr-2" />
                        Connect to {integration.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration">
            <div className="space-y-6">
              {!collaborationData && (
                <div className="text-center py-8">
                  <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Start Team Collaboration</p>
                  <p className="text-gray-600 mb-4">
                    Connect with architects, MEP engineers, and other team members
                  </p>
                  <Button onClick={startCollaboration} className="bg-blue-600 hover:bg-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Start Collaboration Session
                  </Button>
                </div>
              )}

              {collaborationData && (
                <>
                  {/* Project Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-blue-600" />
                        Project Collaboration - {collaborationData.projectId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-green-50 rounded">
                          <div className="text-sm font-medium text-green-700">Status</div>
                          <div className="text-lg font-bold text-green-900 capitalize">
                            {collaborationData.status}
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded">
                          <div className="text-sm font-medium text-blue-700">Participants</div>
                          <div className="text-lg font-bold text-blue-900">
                            {collaborationData.participants.length}
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded">
                          <div className="text-sm font-medium text-purple-700">Shared Models</div>
                          <div className="text-lg font-bold text-purple-900">
                            {collaborationData.sharedModels.length}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team Members */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-600" />
                          Team Members
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {collaborationData.participants.map((participant: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <div className="font-medium">{participant.name}</div>
                                <div className="text-sm text-gray-600">{participant.role}</div>
                              </div>
                              <Badge 
                                variant={
                                  participant.status === 'online' ? 'default' : 
                                  participant.status === 'away' ? 'secondary' : 'outline'
                                }
                              >
                                {participant.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-blue-600" />
                          Shared Models
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {collaborationData.sharedModels.map((model: any, index: number) => (
                            <div key={index} className="p-2 border rounded">
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-medium">{model.name}</div>
                                <Badge variant="outline">v{model.version}</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Clock className="w-3 h-3" />
                                {model.lastUpdate}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Conflicts */}
                  {collaborationData.conflicts.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          Model Conflicts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {collaborationData.conflicts.map((conflict: any, index: number) => (
                          <Alert key={index} className="mb-3">
                            <AlertTriangle className="w-4 h-4" />
                            <AlertDescription>
                              <div className="flex items-center justify-between">
                                <div>
                                  <strong>{conflict.description}</strong>
                                  <div className="text-sm text-gray-600">Location: {conflict.location}</div>
                                </div>
                                <Badge variant={conflict.severity === 'high' ? 'destructive' : 'secondary'}>
                                  {conflict.severity}
                                </Badge>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Quality Check Tab */}
          <TabsContent value="quality">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    BIM Quality Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Geometry Validation</span>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <Progress value={100} className="h-2 mb-2" />
                        <p className="text-sm text-green-700">All elements properly connected</p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Material Assignment</span>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <Progress value={100} className="h-2 mb-2" />
                        <p className="text-sm text-green-700">All materials defined correctly</p>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Load Case Validation</span>
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <Progress value={85} className="h-2 mb-2" />
                        <p className="text-sm text-yellow-700">Some load combinations need review</p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Code Compliance</span>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <Progress value={95} className="h-2 mb-2" />
                        <p className="text-sm text-green-700">SNI standards compliance verified</p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">Quality Score: 95/100</h4>
                      <p className="text-sm text-blue-700">
                        Your BIM model meets industry standards and is ready for export. 
                        Minor improvements in load case definitions recommended.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BIMIntegrationSystem;