/**
 * PDF Report Generator for Structural Analysis
 * Creates professional engineering reports with calculations and drawings
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Structure3D, AnalysisResult, Element, Node } from '@/types/structural';

export interface ReportConfig {
  title: string;
  projectName: string;
  engineerName: string;
  clientName: string;
  date: string;
  reportNumber: string;
  includeCoverPage: boolean;
  includeCalculations: boolean;
  includeDrawings: boolean;
  includeResults: boolean;
  includeStandards: boolean;
  logoUrl?: string;
  watermark?: string;
}

export interface ReportSection {
  title: string;
  content: string | any[];
  type: 'text' | 'table' | 'calculation' | 'drawing';
}

export class PDFReportGenerator {
  private doc: jsPDF;
  private pageNumber: number = 1;
  private config: ReportConfig;
  
  constructor(config: ReportConfig) {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.config = config;
    this.setupDocument();
  }

  private setupDocument(): void {
    // Set document properties
    this.doc.setProperties({
      title: this.config.title,
      subject: 'Structural Analysis Report',
      author: this.config.engineerName,
      creator: 'Structural Analysis System'
    });
  }

  private addHeader(): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    
    // Company logo placeholder
    if (this.config.logoUrl) {
      // Add logo (placeholder - would need actual implementation)
      this.doc.setFontSize(8);
      this.doc.text('LOGO', 20, 15);
    }
    
    // Header line
    this.doc.setLineWidth(0.5);
    this.doc.line(20, 25, pageWidth - 20, 25);
    
    // Document title
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.config.title, pageWidth / 2, 20, { align: 'center' });
  }

  private addFooter(): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();
    
    // Footer line
    this.doc.setLineWidth(0.5);
    this.doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
    
    // Page number
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Page ${this.pageNumber}`, pageWidth - 30, pageHeight - 15);
    
    // Date
    this.doc.text(this.config.date, 20, pageHeight - 15);
    
    // Watermark
    if (this.config.watermark) {
      this.doc.setFontSize(50);
      this.doc.setTextColor(200, 200, 200);
      this.doc.text(this.config.watermark, pageWidth / 2, pageHeight / 2, { 
        align: 'center',
        angle: 45
      });
      this.doc.setTextColor(0, 0, 0); // Reset color
    }
    
    this.pageNumber++;
  }

  private newPage(): void {
    this.doc.addPage();
    this.addHeader();
  }

  /**
   * Generate cover page
   */
  private generateCoverPage(): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();
    
    // Title
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.config.title, pageWidth / 2, 60, { align: 'center' });
    
    // Subtitle
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Structural Analysis Report', pageWidth / 2, 80, { align: 'center' });
    
    // Project details box
    const boxY = 120;
    this.doc.setLineWidth(1);
    this.doc.rect(40, boxY, pageWidth - 80, 80);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    
    let currentY = boxY + 15;
    this.doc.text('Project Name:', 50, currentY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(this.config.projectName, 90, currentY);
    
    currentY += 15;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Client:', 50, currentY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(this.config.clientName, 90, currentY);
    
    currentY += 15;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Engineer:', 50, currentY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(this.config.engineerName, 90, currentY);
    
    currentY += 15;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Report No.:', 50, currentY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(this.config.reportNumber, 90, currentY);
    
    currentY += 15;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Date:', 50, currentY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(this.config.date, 90, currentY);
    
    this.addFooter();
    this.newPage();
  }

  /**
   * Generate structure summary table
   */
  private generateStructureSummary(structure: Structure3D): void {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Structure Summary', 20, 40);
    
    // Nodes summary
    const nodeData = structure.nodes.map((node, index) => [
      `N${index + 1}`,
      node.x.toFixed(2),
      node.y.toFixed(2),
      node.z.toFixed(2),
      this.getSupportDescription(node)
    ]);
    
    autoTable(this.doc, {
      startY: 50,
      head: [['Node', 'X (m)', 'Y (m)', 'Z (m)', 'Support']],
      body: nodeData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: 20, right: 20 }
    });
    
    // Elements summary
    const elementsStartY = (this.doc as any).lastAutoTable.finalY + 20;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Elements', 20, elementsStartY);
    
    const elementData = structure.elements.map((element, index) => [
      `E${index + 1}`,
      element.type,
      element.material.type,
      element.section.type,
      `${element.section.width}×${element.section.height}`,
      this.calculateElementLength(element, structure.nodes).toFixed(2)
    ]);
    
    autoTable(this.doc, {
      startY: elementsStartY + 10,
      head: [['Element', 'Type', 'Material', 'Section', 'Dimensions (mm)', 'Length (m)']],
      body: elementData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: 20, right: 20 }
    });
    
    this.addFooter();
    this.newPage();
  }

  /**
   * Generate analysis results section
   */
  private generateAnalysisResults(analysisResult: AnalysisResult): void {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Analysis Results', 20, 40);
    
    // Summary
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    let currentY = 55;
    
    this.doc.text(`Structure Status: ${analysisResult.isValid ? 'PASS' : 'FAIL'}`, 20, currentY);
    currentY += 10;
    this.doc.text(`Maximum Displacement: ${(analysisResult.maxDisplacement * 1000).toFixed(2)} mm`, 20, currentY);
    currentY += 10;
    this.doc.text(`Maximum Stress: ${(analysisResult.maxStress / 1000000).toFixed(2)} MPa`, 20, currentY);
    currentY += 20;
    
    // Displacements table
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Node Displacements', 20, currentY);
    currentY += 10;
    
    const displacementData = analysisResult.displacements.map(disp => [
      disp.nodeId,
      (disp.ux * 1000).toFixed(3),
      (disp.uy * 1000).toFixed(3),
      (disp.uz * 1000).toFixed(3),
      (disp.rx * 1000).toFixed(3),
      (disp.ry * 1000).toFixed(3),
      (disp.rz * 1000).toFixed(3)
    ]);
    
    autoTable(this.doc, {
      startY: currentY,
      head: [['Node', 'UX (mm)', 'UY (mm)', 'UZ (mm)', 'RX (mrad)', 'RY (mrad)', 'RZ (mrad)']],
      body: displacementData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 8 }
    });
    
    // Forces table
    const forcesStartY = (this.doc as any).lastAutoTable.finalY + 20;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Element Forces', 20, forcesStartY);
    
    const forceData = analysisResult.forces.map(force => [
      force.elementId,
      force.nx.toFixed(1),
      force.vy.toFixed(1),
      force.vz.toFixed(1),
      force.tx.toFixed(1),
      force.my.toFixed(1),
      force.mz.toFixed(1)
    ]);
    
    autoTable(this.doc, {
      startY: forcesStartY + 10,
      head: [['Element', 'Nx (N)', 'Vy (N)', 'Vz (N)', 'Tx (Nm)', 'My (Nm)', 'Mz (Nm)']],
      body: forceData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 8 }
    });
    
    this.addFooter();
    this.newPage();
  }

  /**
   * Generate calculations section
   */
  private generateCalculations(structure: Structure3D, analysisResult: AnalysisResult): void {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Design Calculations', 20, 40);
    
    let currentY = 55;
    
    for (const element of structure.elements) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`Element ${element.id} - ${element.type}`, 20, currentY);
      currentY += 15;
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      
      // Material properties
      this.doc.text('Material Properties:', 25, currentY);
      currentY += 8;
      this.doc.text(`• Type: ${element.material.type}`, 30, currentY);
      currentY += 6;
      this.doc.text(`• Elastic Modulus: ${(element.material.elasticModulus / 1e9).toFixed(1)} GPa`, 30, currentY);
      currentY += 6;
      const yieldStrength = element.material.yieldStrength || 0;
      this.doc.text(`• Yield Strength: ${(yieldStrength / 1e6).toFixed(1)} MPa`, 30, currentY);
      currentY += 10;
      
      // Section properties
      this.doc.text('Section Properties:', 25, currentY);
      currentY += 8;
      this.doc.text(`• Type: ${element.section.type}`, 30, currentY);
      currentY += 6;
      this.doc.text(`• Dimensions: ${element.section.width} × ${element.section.height} mm`, 30, currentY);
      currentY += 6;
      
      const sectionProps = this.calculateSectionProperties(element);
      this.doc.text(`• Area: ${(sectionProps.area * 1e6).toFixed(0)} mm²`, 30, currentY);
      currentY += 6;
      this.doc.text(`• Moment of Inertia Y: ${(sectionProps.momentOfInertiaY * 1e12).toFixed(0)} mm⁴`, 30, currentY);
      currentY += 6;
      this.doc.text(`• Moment of Inertia Z: ${(sectionProps.momentOfInertiaZ * 1e12).toFixed(0)} mm⁴`, 30, currentY);
      currentY += 15;
      
      // Check if we need a new page
      if (currentY > 250) {
        this.addFooter();
        this.newPage();
        currentY = 40;
      }
    }
    
    this.addFooter();
    this.newPage();
  }

  /**
   * Generate the complete PDF report
   */
  public generateReport(structure: Structure3D, analysisResult: AnalysisResult): string {
    if (this.config.includeCoverPage) {
      this.generateCoverPage();
    }
    
    this.generateStructureSummary(structure);
    
    if (this.config.includeResults) {
      this.generateAnalysisResults(analysisResult);
    }
    
    if (this.config.includeCalculations) {
      this.generateCalculations(structure, analysisResult);
    }
    
    // Return base64 string
    return this.doc.output('datauristring');
  }

  /**
   * Save PDF to file
   */
  public savePDF(structure: Structure3D, analysisResult: AnalysisResult, filename?: string): void {
    this.generateReport(structure, analysisResult);
    const fileName = filename || `${this.config.projectName}_Report_${this.config.date}.pdf`;
    this.doc.save(fileName);
  }

  /**
   * Helper methods
   */
  private getSupportDescription(node: Node): string {
    const supports = node.supports || {};
    const constraints = [];
    
    if (supports.ux) constraints.push('UX');
    if (supports.uy) constraints.push('UY');
    if (supports.uz) constraints.push('UZ');
    if (supports.rx) constraints.push('RX');
    if (supports.ry) constraints.push('RY');
    if (supports.rz) constraints.push('RZ');
    
    if (constraints.length === 0) return 'Free';
    if (constraints.length === 6) return 'Fixed';
    if (constraints.length === 3 && !supports.rx && !supports.ry && !supports.rz) return 'Pinned';
    
    return constraints.join(', ');
  }

  private calculateElementLength(element: Element, nodes: Node[]): number {
    const startNode = nodes.find(n => n.id === element.nodes[0]);
    const endNode = nodes.find(n => n.id === element.nodes[1]);
    
    if (!startNode || !endNode) return 0;
    
    return Math.sqrt(
      Math.pow(endNode.x - startNode.x, 2) +
      Math.pow(endNode.y - startNode.y, 2) +
      Math.pow(endNode.z - startNode.z, 2)
    );
  }

  private calculateSectionProperties(element: Element) {
    const section = element.section;
    
    if (section.type === 'rectangular') {
      const area = section.width * section.height;
      const momentOfInertiaY = (section.width * Math.pow(section.height, 3)) / 12;
      const momentOfInertiaZ = (section.height * Math.pow(section.width, 3)) / 12;
      
      return { area, momentOfInertiaY, momentOfInertiaZ };
    } else if (section.type === 'circular') {
      const radius = section.width / 2;
      const area = Math.PI * Math.pow(radius, 2);
      const momentOfInertia = (Math.PI * Math.pow(radius, 4)) / 4;
      
      return { 
        area, 
        momentOfInertiaY: momentOfInertia, 
        momentOfInertiaZ: momentOfInertia 
      };
    } else {
      return {
        area: section.area || (section.width * section.height),
        momentOfInertiaY: section.momentOfInertiaY || 0,
        momentOfInertiaZ: section.momentOfInertiaZ || 0
      };
    }
  }
}

/**
 * Quick report generation function
 */
export const generateQuickReport = (
  structure: Structure3D,
  analysisResult: AnalysisResult,
  projectName: string = 'Structural Analysis',
  engineerName: string = 'Engineer'
): string => {
  const config: ReportConfig = {
    title: 'Structural Analysis Report',
    projectName,
    engineerName,
    clientName: 'Client',
    date: new Date().toLocaleDateString(),
    reportNumber: `SA-${Date.now()}`,
    includeCoverPage: true,
    includeCalculations: true,
    includeDrawings: false,
    includeResults: true,
    includeStandards: false
  };
  
  const generator = new PDFReportGenerator(config);
  return generator.generateReport(structure, analysisResult);
};