/**
 * Export Tools for 3D Viewer
 * Provides export capabilities for 3D models and images
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  Image, 
  FileText, 
  Save,
  Camera,
  Monitor
} from 'lucide-react';
import { Structure3D } from '@/types/structural';

interface ExportToolsProps {
  structure: Structure3D | null;
  analysisResults?: any;
  className?: string;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: string) => void;
}

// Helper function to convert structure to JSON
const structureToJSON = (structure: Structure3D): string => {
  return JSON.stringify(structure, null, 2);
};

// Helper function to convert structure to CSV
const structureToCSV = (structure: Structure3D): string => {
  let csv = 'Nodes\n';
  csv += 'ID,X,Y,Z,Type,Label\n';
  structure.nodes.forEach(node => {
    csv += `"${node.id}",${node.x},${node.y},${node.z},"${node.type || ''}","${node.label || ''}"\n`;
  });
  
  csv += '\nElements\n';
  csv += 'ID,Type,StartNode,EndNode,Material,Section,Label\n';
  structure.elements.forEach(element => {
    csv += `"${element.id}","${element.type}","${element.nodes[0]}","${element.nodes[1]}","${element.material.name}","${element.section.name}","${element.label || ''}"\n`;
  });
  
  return csv;
};

// Helper function to convert analysis results to CSV
const resultsToCSV = (results: any): string => {
  if (!results) return '';
  
  let csv = 'Analysis Results\n';
  
  if (results.displacements) {
    csv += '\nDisplacements\n';
    csv += 'NodeID,UX,UY,UZ,RX,RY,RZ\n';
    results.displacements.forEach((disp: any) => {
      csv += `"${disp.nodeId}",${disp.ux},${disp.uy},${disp.uz},${disp.rx},${disp.ry},${disp.rz}\n`;
    });
  }
  
  if (results.forces) {
    csv += '\nElement Forces\n';
    csv += 'ElementID,NX,VY,VZ,TX,MY,MZ\n';
    results.forces.forEach((force: any) => {
      csv += `"${force.elementId}",${force.nx},${force.vy},${force.vz},${force.tx},${force.my},${force.mz}\n`;
    });
  }
  
  if (results.stresses) {
    csv += '\nElement Stresses\n';
    csv += 'ElementID,AxialStress,ShearStress,BendingStress\n';
    results.stresses.forEach((stress: any) => {
      csv += `"${stress.elementId}",${stress.axialStress},${stress.shearStress},${stress.bendingStress}\n`;
    });
  }
  
  return csv;
};

// Helper function to trigger file download
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Main Export Tools Component
export const ExportTools: React.FC<ExportToolsProps> = ({
  structure,
  analysisResults,
  className = '',
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const [isExporting, setIsExporting] = useState(false);
  
  // Export structure as JSON
  const exportStructureJSON = useCallback(() => {
    if (!structure) {
      onExportError?.('No structure data available');
      return;
    }
    
    try {
      onExportStart?.();
      setIsExporting(true);
      
      const json = structureToJSON(structure);
      downloadFile(json, 'structure.json', 'application/json');
      
      onExportComplete?.();
    } catch (error) {
      onExportError?.('Failed to export structure as JSON');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [structure, onExportStart, onExportComplete, onExportError]);
  
  // Export structure as CSV
  const exportStructureCSV = useCallback(() => {
    if (!structure) {
      onExportError?.('No structure data available');
      return;
    }
    
    try {
      onExportStart?.();
      setIsExporting(true);
      
      const csv = structureToCSV(structure);
      downloadFile(csv, 'structure.csv', 'text/csv');
      
      onExportComplete?.();
    } catch (error) {
      onExportError?.('Failed to export structure as CSV');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [structure, onExportStart, onExportComplete, onExportError]);
  
  // Export analysis results as CSV
  const exportResultsCSV = useCallback(() => {
    if (!analysisResults) {
      onExportError?.('No analysis results available');
      return;
    }
    
    try {
      onExportStart?.();
      setIsExporting(true);
      
      const csv = resultsToCSV(analysisResults);
      downloadFile(csv, 'analysis_results.csv', 'text/csv');
      
      onExportComplete?.();
    } catch (error) {
      onExportError?.('Failed to export analysis results as CSV');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [analysisResults, onExportStart, onExportComplete, onExportError]);
  
  // Export combined data as JSON
  const exportCombinedJSON = useCallback(() => {
    if (!structure) {
      onExportError?.('No structure data available');
      return;
    }
    
    try {
      onExportStart?.();
      setIsExporting(true);
      
      const combinedData = {
        structure,
        analysisResults
      };
      
      const json = JSON.stringify(combinedData, null, 2);
      downloadFile(json, 'structural_analysis_data.json', 'application/json');
      
      onExportComplete?.();
    } catch (error) {
      onExportError?.('Failed to export combined data as JSON');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [structure, analysisResults, onExportStart, onExportComplete, onExportError]);
  
  // Export screenshot (placeholder - would need integration with Three.js renderer)
  const exportScreenshot = useCallback(() => {
    try {
      onExportStart?.();
      setIsExporting(true);
      
      // In a real implementation, this would capture the Three.js canvas
      // For now, we'll just show an alert
      alert('Screenshot export would capture the current 3D view. This is a placeholder implementation.');
      
      onExportComplete?.();
    } catch (error) {
      onExportError?.('Failed to export screenshot');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [onExportStart, onExportComplete, onExportError]);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base">
          <Download className="h-4 w-4 mr-2" />
          Export Tools
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Structure Export Options */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Structure Data</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportStructureJSON}
              disabled={!structure || isExporting}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              JSON
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportStructureCSV}
              disabled={!structure || isExporting}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>
        
        {/* Analysis Results Export */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Analysis Results</label>
          <Button
            variant="outline"
            size="sm"
            onClick={exportResultsCSV}
            disabled={!analysisResults || isExporting}
            className="w-full flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export Results (CSV)
          </Button>
        </div>
        
        {/* Combined Export */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Combined Data</label>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCombinedJSON}
            disabled={!structure || isExporting}
            className="w-full flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Export All (JSON)
          </Button>
        </div>
        
        {/* Image Export */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Images</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportScreenshot}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Screenshot
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportScreenshot}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              HD Render
            </Button>
          </div>
        </div>
        
        {/* Export Status */}
        {isExporting && (
          <div className="text-center text-sm text-gray-500">
            Exporting data...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExportTools;