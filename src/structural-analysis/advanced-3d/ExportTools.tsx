/**
 * Export Tools for 3D Viewer
 * Provides export capabilities for 3D models and images
 */

import React, { useState, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
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

// Helper function to export 3D scene as image
const export3DSceneAsImage = async (canvas: HTMLCanvasElement | null, filename: string) => {
  if (!canvas) {
    throw new Error('Canvas not found');
  }
  
  // Create a higher resolution canvas for better quality export
  const highResCanvas = document.createElement('canvas');
  const scale = 2; // 2x resolution
  highResCanvas.width = canvas.width * scale;
  highResCanvas.height = canvas.height * scale;
  
  const ctx = highResCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D context');
  }
  
  // Scale the context
  ctx.scale(scale, scale);
  
  // Draw the original canvas onto the high-res canvas
  ctx.drawImage(canvas, 0, 0);
  
  // Convert to data URL and download
  const dataUrl = highResCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  
  // Export screenshot
  const exportScreenshot = useCallback(() => {
    try {
      onExportStart?.();
      setIsExporting(true);
      
      // Try to find the canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        throw new Error('3D canvas not found');
      }
      
      // Export the canvas as PNG
      export3DSceneAsImage(canvas, '3d_structure_view.png');
      
      onExportComplete?.();
    } catch (error) {
      onExportError?.('Failed to export screenshot: ' + (error as Error).message);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [onExportStart, onExportComplete, onExportError]);
  
  // Export high resolution render
  const exportHighResRender = useCallback(() => {
    try {
      onExportStart?.();
      setIsExporting(true);
      
      // Try to find the canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        throw new Error('3D canvas not found');
      }
      
      // Export the canvas as high-res PNG
      export3DSceneAsImage(canvas, '3d_structure_render.png');
      
      onExportComplete?.();
    } catch (error) {
      onExportError?.('Failed to export high resolution render: ' + (error as Error).message);
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
              onClick={exportHighResRender}
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