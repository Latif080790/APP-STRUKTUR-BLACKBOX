/**
 * Enhanced Export Manager Component
 * Provides comprehensive export functionality with PDF reports, CSV data export, and project backup
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Download, 
  FileText, 
  Table, 
  Save, 
  Settings,
  Building,
  BarChart3,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { StructuralExporter, ExportOptions } from '../../utils/exportUtils';
import { AnalysisResult } from '../../utils/structuralAnalysis';

interface ExportManagerProps {
  analysisResults?: AnalysisResult | null;
  className?: string;
}

export const ExportManager: React.FC<ExportManagerProps> = ({
  analysisResults = null,
  className = ''
}) => {
  const { currentProject } = useProjectStore();
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [showDialog, setShowDialog] = useState(false);
  
  // PDF Export Options
  const [pdfOptions, setPdfOptions] = useState<ExportOptions>({
    includeCharts: true,
    includeCalculations: true,
    includeRecommendations: true,
  });
  
  // Company info for PDF reports
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const [csvType, setCsvType] = useState<'summary' | 'detailed' | 'forces'>('summary');

  // Handle PDF export
  const handlePdfExport = async () => {
    if (!currentProject) return;
    
    setIsExporting(true);
    try {
      const options: ExportOptions = {
        ...pdfOptions,
        companyInfo: companyInfo.name ? companyInfo : undefined
      };
      
      await StructuralExporter.exportToPDF(currentProject, analysisResults, options);
      setShowDialog(false);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle CSV export
  const handleCsvExport = () => {
    if (!currentProject) return;
    
    setIsExporting(true);
    try {
      StructuralExporter.exportToCSV(currentProject, analysisResults, csvType);
      setShowDialog(false);
    } catch (error) {
      console.error('CSV export failed:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle JSON export
  const handleJsonExport = () => {
    if (!currentProject) return;
    
    setIsExporting(true);
    try {
      StructuralExporter.exportProjectJSON(currentProject);
      setShowDialog(false);
    } catch (error) {
      console.error('JSON export failed:', error);
      alert('Failed to export project backup. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Quick export functions
  const quickPdfExport = async () => {
    if (!currentProject) return;
    
    setIsExporting(true);
    try {
      await StructuralExporter.exportToPDF(currentProject, analysisResults, {
        includeCharts: true,
        includeCalculations: true,
        includeRecommendations: true
      });
    } catch (error) {
      console.error('Quick PDF export failed:', error);
      alert('Failed to export PDF report.');
    } finally {
      setIsExporting(false);
    }
  };

  const quickCsvExport = () => {
    if (!currentProject) return;
    
    setIsExporting(true);
    try {
      StructuralExporter.exportToCSV(currentProject, analysisResults, 'summary');
    } catch (error) {
      console.error('Quick CSV export failed:', error);
      alert('Failed to export CSV data.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!currentProject) {
    return (
      <Alert className={className}>
        <Building className="h-4 w-4" />
        <AlertDescription>
          Load a project to enable export functionality.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      {/* Quick Export Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={quickPdfExport}
          disabled={isExporting}
          size="sm"
          variant="outline"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Quick PDF Report
        </Button>
        
        <Button
          onClick={quickCsvExport}
          disabled={isExporting}
          size="sm"
          variant="outline"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-4 w-4 mr-2" />
          )}
          Quick CSV Export
        </Button>

        {/* Advanced Export Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Export
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Export Options</DialogTitle>
            </DialogHeader>

            <Tabs value={exportType} onValueChange={(value) => setExportType(value as any)} defaultValue="pdf">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pdf">PDF Report</TabsTrigger>
                <TabsTrigger value="csv">CSV Data</TabsTrigger>
                <TabsTrigger value="json">Project Backup</TabsTrigger>
              </TabsList>

              {/* PDF Export Tab */}
              <TabsContent value="pdf" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      PDF Report Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Report Content Options */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Report Content</Label>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeCharts"
                          checked={pdfOptions.includeCharts}
                          onCheckedChange={(checked: boolean) => 
                            setPdfOptions(prev => ({ ...prev, includeCharts: checked }))
                          }
                        />
                        <Label htmlFor="includeCharts" className="text-sm">
                          Include charts and diagrams
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeCalculations"
                          checked={pdfOptions.includeCalculations}
                          onCheckedChange={(checked: boolean) => 
                            setPdfOptions(prev => ({ ...prev, includeCalculations: checked }))
                          }
                        />
                        <Label htmlFor="includeCalculations" className="text-sm">
                          Include detailed calculations
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeRecommendations"
                          checked={pdfOptions.includeRecommendations}
                          onCheckedChange={(checked: boolean) => 
                            setPdfOptions(prev => ({ ...prev, includeRecommendations: checked }))
                          }
                        />
                        <Label htmlFor="includeRecommendations" className="text-sm">
                          Include design recommendations
                        </Label>
                      </div>
                    </div>

                    {/* Company Information */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Company Information (Optional)</Label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="companyName" className="text-xs">Company Name</Label>
                          <Input
                            id="companyName"
                            placeholder="Your Company Name"
                            value={companyInfo.name}
                            onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-xs">Phone</Label>
                          <Input
                            id="phone"
                            placeholder="+1234567890"
                            value={companyInfo.phone}
                            onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-xs">Email</Label>
                          <Input
                            id="email"
                            placeholder="contact@company.com"
                            value={companyInfo.email}
                            onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address" className="text-xs">Address</Label>
                          <Input
                            id="address"
                            placeholder="Company Address"
                            value={companyInfo.address}
                            onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handlePdfExport} 
                      disabled={isExporting}
                      className="w-full"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export PDF Report
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CSV Export Tab */}
              <TabsContent value="csv" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Table className="h-5 w-5 mr-2" />
                      CSV Data Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Export Type</Label>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="summary"
                            name="csvType"
                            value="summary"
                            checked={csvType === 'summary'}
                            onChange={(e) => setCsvType(e.target.value as any)}
                          />
                          <Label htmlFor="summary" className="text-sm">
                            Summary Data - Key project parameters and results
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="detailed"
                            name="csvType"
                            value="detailed"
                            checked={csvType === 'detailed'}
                            onChange={(e) => setCsvType(e.target.value as any)}
                          />
                          <Label htmlFor="detailed" className="text-sm">
                            Detailed Data - Complete project configuration
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="forces"
                            name="csvType"
                            value="forces"
                            checked={csvType === 'forces'}
                            onChange={(e) => setCsvType(e.target.value as any)}
                          />
                          <Label htmlFor="forces" className="text-sm">
                            Member Forces - Detailed force analysis results
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleCsvExport} 
                      disabled={isExporting}
                      className="w-full"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Exporting CSV...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export CSV Data
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* JSON Backup Tab */}
              <TabsContent value="json" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Save className="h-5 w-5 mr-2" />
                      Project Backup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Export complete project data as JSON backup. This includes all project 
                      settings, geometry, materials, loads, and analysis results. The backup 
                      can be imported later to restore the complete project state.
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg text-sm">
                      <strong>Project:</strong> {currentProject.name}<br />
                      <strong>Created:</strong> {new Date(currentProject.createdAt).toLocaleDateString()}<br />
                      <strong>Last Modified:</strong> {new Date(currentProject.lastModified || currentProject.createdAt).toLocaleDateString()}
                    </div>

                    <Button 
                      onClick={handleJsonExport} 
                      disabled={isExporting}
                      className="w-full"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Backup...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export Project Backup
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Export Status */}
      {analysisResults && !analysisResults.success && (
        <Alert variant="destructive" className="mt-2">
          <BarChart3 className="h-4 w-4" />
          <AlertDescription>
            Analysis results contain errors. Exported reports may be incomplete.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ExportManager;