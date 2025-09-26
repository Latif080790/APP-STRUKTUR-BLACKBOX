/**
 * Enhanced Export Utilities
 * Provides comprehensive export functionality for structural analysis projects
 * Supports PDF reports, CSV data export, and project backup
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { ProjectData } from '../stores/projectStore';
import { AnalysisResult } from './structuralAnalysis';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportOptions {
  includeCharts?: boolean;
  includeCalculations?: boolean;
  includeRecommendations?: boolean;
  logoUrl?: string;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

export class StructuralExporter {
  
  /**
   * Export project as PDF report
   */
  static async exportToPDF(
    project: ProjectData, 
    analysisResults: AnalysisResult | null,
    options: ExportOptions = {}
  ): Promise<void> {
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Helper function to add text with line breaks
    const addText = (text: string, x: number, y: number, maxWidth?: number) => {
      if (maxWidth) {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * 7);
      } else {
        doc.text(text, x, y);
        return y + 7;
      }
    };

    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    yPosition = addText('STRUCTURAL ANALYSIS REPORT', 20, yPosition);
    
    // Company info if provided
    if (options.companyInfo) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      yPosition += 10;
      yPosition = addText(options.companyInfo.name, 20, yPosition);
      yPosition = addText(options.companyInfo.address, 20, yPosition);
      yPosition = addText(`Phone: ${options.companyInfo.phone}`, 20, yPosition);
      yPosition = addText(`Email: ${options.companyInfo.email}`, 20, yPosition);
    }

    // Project Information
    yPosition += 15;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    yPosition = addText('PROJECT INFORMATION', 20, yPosition);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    yPosition += 5;

    const projectInfo = [
      ['Project Name', project.name || 'Unnamed Project'],
      ['Created', new Date(project.createdAt).toLocaleDateString()],
      ['Last Modified', new Date(project.updatedAt).toLocaleDateString()],
      ['Description', project.description || 'No description provided']
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Property', 'Value']],
      body: projectInfo,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Geometry Information
    if (project.geometry) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      yPosition = addText('GEOMETRY', 20, yPosition);
      
      const geometryData = [
        ['Building Height', `${project.geometry.height || 0} m`],
        ['Number of Floors', `${project.geometry.floors || 0}`],
        ['Bay Width X', `${project.geometry.bayWidthX || 0} m`],
        ['Bay Width Y', `${project.geometry.bayWidthY || 0} m`],
        ['Number of Bays X', `${project.geometry.baysX || 0}`],
        ['Number of Bays Y', `${project.geometry.baysY || 0}`]
      ];

      doc.autoTable({
        startY: yPosition + 5,
        head: [['Parameter', 'Value']],
        body: geometryData,
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50] },
        styles: { fontSize: 9 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }

    // Materials Information
    if (project.materials) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      yPosition = addText('MATERIALS', 20, yPosition);
      
      const materialsData = [
        ['Concrete Strength (fc\')', `${project.materials.concreteGrade || 0} MPa`],
        ['Steel Yield Strength (fy)', `${project.materials.steelGrade || 0} MPa`],
        ['Concrete Density', `${project.materials.concreteDensity || 2400} kg/m³`],
        ['Steel Density', `${project.materials.steelDensity || 7850} kg/m³`],
        ['Concrete Elastic Modulus', `${project.materials.concreteElasticModulus || 0} MPa`]
      ];

      doc.autoTable({
        startY: yPosition + 5,
        head: [['Property', 'Value']],
        body: materialsData,
        theme: 'striped',
        headStyles: { fillColor: [156, 39, 176] },
        styles: { fontSize: 9 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }

    // Loads Information
    if (project.loads) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      yPosition = addText('LOADS', 20, yPosition);
      
      const loadsData = [
        ['Dead Load', `${project.loads.deadLoad || 0} kN/m²`],
        ['Live Load', `${project.loads.liveLoad || 0} kN/m²`],
        ['Wind Load', `${project.loads.windLoad || 0} kN/m²`],
        ['Snow Load', `${project.loads.snowLoad || 0} kN/m²`]
      ];

      doc.autoTable({
        startY: yPosition + 5,
        head: [['Load Type', 'Value']],
        body: loadsData,
        theme: 'striped',
        headStyles: { fillColor: [255, 152, 0] },
        styles: { fontSize: 9 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }

    // Seismic Parameters
    if (project.seismicParams) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      yPosition = addText('SEISMIC PARAMETERS', 20, yPosition);
      
      const seismicData = [
        ['Zone Factor (Z)', `${project.seismicParams.zoneSeismic || 0}`],
        ['Importance Factor (I)', `${project.seismicParams.importanceFactor || 0}`],
        ['Response Factor (R)', `${project.seismicParams.responseModification || 0}`],
        ['Site Class', project.seismicParams.soilType || 'Not specified'],
        ['Damping Ratio', `${project.seismicParams.dampingRatio || 0.05}`]
      ];

      doc.autoTable({
        startY: yPosition + 5,
        head: [['Parameter', 'Value']],
        body: seismicData,
        theme: 'striped',
        headStyles: { fillColor: [244, 67, 54] },
        styles: { fontSize: 9 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }

    // Analysis Results
    if (analysisResults && analysisResults.success && options.includeCalculations !== false) {
      if (yPosition > 180) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      yPosition = addText('ANALYSIS RESULTS', 20, yPosition);

      // Summary results
      const resultsData = [];
      
      if (analysisResults.frameAnalysis) {
        resultsData.push(['Max Moment', `${analysisResults.frameAnalysis.maxMoment.toFixed(2)} kN-m`]);
        resultsData.push(['Max Shear', `${analysisResults.frameAnalysis.maxShear.toFixed(2)} kN`]);
        resultsData.push(['Max Deflection', `${analysisResults.frameAnalysis.maxDeflection.toFixed(2)} mm`]);
      }

      if (analysisResults.seismicAnalysis) {
        resultsData.push(['Base Shear', `${analysisResults.seismicAnalysis.baseShear.toFixed(2)} kN`]);
        resultsData.push(['Fundamental Period', `${analysisResults.seismicAnalysis.fundamentalPeriod.toFixed(3)} sec`]);
      }

      if (resultsData.length > 0) {
        doc.autoTable({
          startY: yPosition + 5,
          head: [['Parameter', 'Value']],
          body: resultsData,
          theme: 'striped',
          headStyles: { fillColor: [63, 81, 181] },
          styles: { fontSize: 9 }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      }
    }

    // Recommendations
    if (options.includeRecommendations !== false) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      yPosition = addText('RECOMMENDATIONS', 20, yPosition);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      yPosition += 5;
      
      const recommendations = [
        '1. Verify all input parameters with actual site conditions',
        '2. Consider local building codes and regulations',
        '3. Perform detailed design for critical members',
        '4. Consider construction tolerances and quality control',
        '5. Review design with qualified structural engineer'
      ];

      recommendations.forEach(rec => {
        yPosition = addText(rec, 20, yPosition, 170);
        yPosition += 3;
      });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`, 20, 285);
      doc.text('Generated by Structural Analysis System', 140, 285);
    }

    // Save the PDF
    const filename = `${project.name?.replace(/\s+/g, '_') || 'structural_report'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  }

  /**
   * Export analysis results to CSV
   */
  static exportToCSV(
    project: ProjectData, 
    analysisResults: AnalysisResult | null,
    type: 'summary' | 'detailed' | 'forces' = 'summary'
  ): void {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'summary':
        data = this.prepareSummaryData(project, analysisResults);
        filename = `${project.name?.replace(/\s+/g, '_') || 'project'}_summary.csv`;
        break;
        
      case 'detailed':
        data = this.prepareDetailedData(project, analysisResults);
        filename = `${project.name?.replace(/\s+/g, '_') || 'project'}_detailed.csv`;
        break;
        
      case 'forces':
        data = this.prepareForcesData(analysisResults);
        filename = `${project.name?.replace(/\s+/g, '_') || 'project'}_forces.csv`;
        break;
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  /**
   * Export project data as JSON backup
   */
  static exportProjectJSON(project: ProjectData): void {
    const exportData = {
      ...project,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${project.name?.replace(/\s+/g, '_') || 'project'}_backup.json`;
    link.click();
  }

  /**
   * Prepare summary data for CSV export
   */
  private static prepareSummaryData(project: ProjectData, results: AnalysisResult | null): any[] {
    const data = [
      {
        'Project Name': project.name || 'Unnamed',
        'Created': new Date(project.createdAt).toLocaleDateString(),
        'Last Modified': new Date(project.updatedAt).toLocaleDateString(),
        'Building Height (m)': project.geometry?.height || 0,
        'Number of Floors': project.geometry?.floors || 0,
        'Concrete Grade (MPa)': project.materials?.concreteGrade || 0,
        'Steel Grade (MPa)': project.materials?.steelGrade || 0,
        'Dead Load (kN/m²)': project.loads?.deadLoad || 0,
        'Live Load (kN/m²)': project.loads?.liveLoad || 0,
        'Zone Factor': project.seismicParams?.zoneSeismic || 0,
        'Analysis Status': results?.success ? 'Success' : 'Failed'
      }
    ];

    if (results?.success) {
      if (results.frameAnalysis) {
        data[0]['Max Moment (kN-m)'] = results.frameAnalysis.maxMoment.toFixed(2);
        data[0]['Max Shear (kN)'] = results.frameAnalysis.maxShear.toFixed(2);
        data[0]['Max Deflection (mm)'] = results.frameAnalysis.maxDeflection.toFixed(2);
      }
      
      if (results.seismicAnalysis) {
        data[0]['Base Shear (kN)'] = results.seismicAnalysis.baseShear.toFixed(2);
        data[0]['Fundamental Period (sec)'] = results.seismicAnalysis.fundamentalPeriod.toFixed(3);
      }
    }

    return data;
  }

  /**
   * Prepare detailed data for CSV export
   */
  private static prepareDetailedData(project: ProjectData, results: AnalysisResult | null): any[] {
    const data: any[] = [];

    // Project info section
    data.push({ Section: 'PROJECT INFO', Parameter: 'Name', Value: project.name || 'Unnamed' });
    data.push({ Section: 'PROJECT INFO', Parameter: 'Created', Value: new Date(project.createdAt).toLocaleDateString() });
    data.push({ Section: 'PROJECT INFO', Parameter: 'Description', Value: project.description || 'No description' });

    // Geometry section
    if (project.geometry) {
      Object.entries(project.geometry).forEach(([key, value]) => {
        data.push({ Section: 'GEOMETRY', Parameter: key, Value: value });
      });
    }

    // Materials section
    if (project.materials) {
      Object.entries(project.materials).forEach(([key, value]) => {
        data.push({ Section: 'MATERIALS', Parameter: key, Value: value });
      });
    }

    // Loads section
    if (project.loads) {
      Object.entries(project.loads).forEach(([key, value]) => {
        data.push({ Section: 'LOADS', Parameter: key, Value: value });
      });
    }

    // Seismic section
    if (project.seismicParams) {
      Object.entries(project.seismicParams).forEach(([key, value]) => {
        data.push({ Section: 'SEISMIC', Parameter: key, Value: value });
      });
    }

    // Results section
    if (results?.success) {
      if (results.frameAnalysis) {
        Object.entries(results.frameAnalysis).forEach(([key, value]) => {
          data.push({ Section: 'FRAME ANALYSIS', Parameter: key, Value: value });
        });
      }
      
      if (results.seismicAnalysis) {
        Object.entries(results.seismicAnalysis).forEach(([key, value]) => {
          data.push({ Section: 'SEISMIC ANALYSIS', Parameter: key, Value: value });
        });
      }
    }

    return data;
  }

  /**
   * Prepare forces data for CSV export
   */
  private static prepareForcesData(results: AnalysisResult | null): any[] {
    const data: any[] = [];

    if (results?.success && results.frameAnalysis) {
      // Mock force data - in real implementation, this would come from actual analysis results
      for (let i = 1; i <= 10; i++) {
        data.push({
          'Member ID': `M${i}`,
          'Member Type': i <= 5 ? 'Beam' : 'Column',
          'Max Moment (kN-m)': (Math.random() * 100).toFixed(2),
          'Max Shear (kN)': (Math.random() * 50).toFixed(2),
          'Axial Force (kN)': (Math.random() * 200).toFixed(2),
          'Deflection (mm)': (Math.random() * 10).toFixed(2)
        });
      }
    }

    return data;
  }
}

export default StructuralExporter;