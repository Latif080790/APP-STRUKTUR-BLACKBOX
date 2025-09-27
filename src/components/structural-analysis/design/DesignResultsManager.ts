/**
 * Design Results Manager - Manages and processes design results
 * Provides unified interface for design output management
 */

import { DesignResults } from './StructuralDesignEngine';

export interface DesignSummary {
  projectInfo: {
    name: string;
    date: string;
    engineer: string;
    checker: string;
  };
  elements: Array<{
    id: string;
    type: 'beam' | 'column' | 'slab' | 'wall';
    results: DesignResults;
    status: 'pass' | 'fail' | 'warning';
  }>;
  overallStatus: {
    totalElements: number;
    passedElements: number;
    failedElements: number;
    warningElements: number;
    overallRating: number; // 0-100
  };
  costs: {
    totalConcrete: number;
    totalSteel: number;
    totalLabor: number;
    grandTotal: number;
    breakdown: Array<{
      element: string;
      cost: number;
      percentage: number;
    }>;
  };
  recommendations: string[];
}

export interface DesignOptimization {
  element: string;
  currentCost: number;
  optimizedDesign: DesignResults;
  savings: {
    concrete: number;
    steel: number;
    total: number;
    percentage: number;
  };
  changes: string[];
}

export class DesignResultsManager {
  private designResults: Map<string, DesignResults> = new Map();
  private projectInfo: any = {};

  constructor(projectInfo?: any) {
    this.projectInfo = projectInfo || {
      name: 'Structural Design Project',
      date: new Date().toLocaleDateString('id-ID'),
      engineer: 'Design Engineer',
      checker: 'Checking Engineer'
    };
  }

  /**
   * Add design result for an element
   */
  public addDesignResult(elementId: string, result: DesignResults): void {
    this.designResults.set(elementId, result);
  }

  /**
   * Get design result for specific element
   */
  public getDesignResult(elementId: string): DesignResults | undefined {
    return this.designResults.get(elementId);
  }

  /**
   * Get all design results
   */
  public getAllResults(): Map<string, DesignResults> {
    return new Map(this.designResults);
  }

  /**
   * Generate comprehensive design summary
   */
  public generateSummary(): DesignSummary {
    const elements = Array.from(this.designResults.entries()).map(([id, result]) => ({
      id,
      type: result.element.type,
      results: result,
      status: this.determineElementStatus(result)
    }));

    const overallStatus = this.calculateOverallStatus(elements);
    const costs = this.calculateCosts(elements);
    const recommendations = this.generateRecommendations(elements);

    return {
      projectInfo: this.projectInfo,
      elements,
      overallStatus,
      costs,
      recommendations
    };
  }

  /**
   * Determine element status based on checks
   */
  private determineElementStatus(result: DesignResults): 'pass' | 'fail' | 'warning' {
    const checks = Object.values(result.checks);
    const failedChecks = checks.filter(check => check.status === 'fail');
    
    if (failedChecks.length > 0) {
      return 'fail';
    }

    // Check for warnings (high utilization ratios)
    const highUtilization = checks.some(check => 
      ('ratio' in check) && typeof check.ratio === 'number' && check.ratio > 0.85
    );

    return highUtilization ? 'warning' : 'pass';
  }

  /**
   * Calculate overall project status
   */
  private calculateOverallStatus(elements: any[]): any {
    const totalElements = elements.length;
    const passedElements = elements.filter(e => e.status === 'pass').length;
    const failedElements = elements.filter(e => e.status === 'fail').length;
    const warningElements = elements.filter(e => e.status === 'warning').length;

    let overallRating = 0;
    if (totalElements > 0) {
      overallRating = Math.round(
        (passedElements * 100 + warningElements * 70 + failedElements * 0) / totalElements
      );
    }

    return {
      totalElements,
      passedElements,
      failedElements,
      warningElements,
      overallRating
    };
  }

  /**
   * Calculate project costs
   */
  private calculateCosts(elements: any[]): any {
    const costs = elements.reduce((acc, element) => {
      acc.totalConcrete += element.results.cost.concrete;
      acc.totalSteel += element.results.cost.steel;
      acc.totalLabor += element.results.cost.labor;
      return acc;
    }, { totalConcrete: 0, totalSteel: 0, totalLabor: 0 });

    const grandTotal = costs.totalConcrete + costs.totalSteel + costs.totalLabor;

    const breakdown = elements.map(element => ({
      element: element.id,
      cost: element.results.cost.total,
      percentage: grandTotal > 0 ? Math.round((element.results.cost.total / grandTotal) * 100) : 0
    }));

    return {
      ...costs,
      grandTotal,
      breakdown
    };
  }

  /**
   * Generate design recommendations
   */
  private generateRecommendations(elements: any[]): string[] {
    const recommendations: string[] = [];

    // Check for failed elements
    const failedElements = elements.filter(e => e.status === 'fail');
    if (failedElements.length > 0) {
      recommendations.push(
        `⚠️ ${failedElements.length} elemen gagal memenuhi persyaratan dan perlu didesain ulang`
      );
    }

    // Check for high cost elements
    const highCostElements = elements.filter(e => e.results.cost.total > 10000000);
    if (highCostElements.length > 0) {
      recommendations.push(
        `💰 Pertimbangkan optimasi untuk ${highCostElements.length} elemen dengan biaya tinggi`
      );
    }

    // Check reinforcement efficiency
    const inefficientElements = elements.filter(e => {
      const checks = e.results.checks;
      return checks.flexuralStrength && checks.flexuralStrength.ratio < 0.5;
    });

    if (inefficientElements.length > 0) {
      recommendations.push(
        `📏 ${inefficientElements.length} elemen memiliki tulangan berlebih, dapat dioptimasi`
      );
    }

    // General recommendations
    recommendations.push(
      '✅ Pastikan semua detail tulangan sesuai dengan SNI 2847',
      '🔍 Lakukan review ulang untuk elemen dengan status warning',
      '📋 Siapkan gambar detail untuk pelaksanaan konstruksi'
    );

    return recommendations;
  }

  /**
   * Optimize design for cost reduction
   */
  public optimizeDesign(elementId: string): DesignOptimization | null {
    const currentResult = this.designResults.get(elementId);
    if (!currentResult) return null;

    // Simple optimization: reduce reinforcement if over-designed
    const currentCost = currentResult.cost.total;
    
    // Create optimized version (simplified logic)
    const optimizedResult = { ...currentResult };
    let savings = 0;

    // Check if flexural strength is over-designed
    if (currentResult.checks.flexuralStrength.ratio < 0.7) {
      // Reduce reinforcement by 10%
      const reduction = 0.1;
      optimizedResult.cost.steel *= (1 - reduction);
      optimizedResult.cost.total = optimizedResult.cost.concrete + 
                                   optimizedResult.cost.steel + 
                                   optimizedResult.cost.labor;
      savings = currentCost - optimizedResult.cost.total;
    }

    if (savings > 0) {
      return {
        element: elementId,
        currentCost,
        optimizedDesign: optimizedResult,
        savings: {
          concrete: 0,
          steel: currentResult.cost.steel - optimizedResult.cost.steel,
          total: savings,
          percentage: Math.round((savings / currentCost) * 100)
        },
        changes: [
          'Optimasi tulangan lentur',
          'Pengurangan diameter tulangan',
          'Penyesuaian spasi tulangan'
        ]
      };
    }

    return null;
  }

  /**
   * Generate design report in HTML format
   */
  public generateReport(): string {
    const summary = this.generateSummary();
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Laporan Desain Struktur</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .element { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
        .pass { border-left: 5px solid #4CAF50; }
        .fail { border-left: 5px solid #f44336; }
        .warning { border-left: 5px solid #FF9800; }
        .cost-table { width: 100%; border-collapse: collapse; }
        .cost-table th, .cost-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>LAPORAN DESAIN STRUKTUR</h1>
        <p><strong>Proyek:</strong> ${summary.projectInfo.name}</p>
        <p><strong>Tanggal:</strong> ${summary.projectInfo.date}</p>
        <p><strong>Engineer:</strong> ${summary.projectInfo.engineer}</p>
      </div>

      <div class="section">
        <h2>RINGKASAN PROYEK</h2>
        <p>Total Elemen: ${summary.overallStatus.totalElements}</p>
        <p>Status Keseluruhan: ${summary.overallStatus.overallRating}%</p>
        <p>Biaya Total: Rp ${summary.costs.grandTotal.toLocaleString('id-ID')}</p>
      </div>

      <div class="section">
        <h2>DETAIL ELEMEN</h2>
        ${summary.elements.map(element => `
          <div class="element ${element.status}">
            <h3>${element.id} (${element.type})</h3>
            <p>${element.results.summary}</p>
            <p><strong>Status:</strong> ${element.status.toUpperCase()}</p>
            <p><strong>Biaya:</strong> Rp ${element.results.cost.total.toLocaleString('id-ID')}</p>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2>REKOMENDASI</h2>
        <ul>
          ${summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Export results to JSON
   */
  public exportToJSON(): string {
    const summary = this.generateSummary();
    return JSON.stringify(summary, null, 2);
  }

  /**
   * Clear all results
   */
  public clearResults(): void {
    this.designResults.clear();
  }

  /**
   * Get design statistics
   */
  public getStatistics(): any {
    const summary = this.generateSummary();
    
    return {
      elementCount: {
        beams: summary.elements.filter(e => e.type === 'beam').length,
        columns: summary.elements.filter(e => e.type === 'column').length,
        slabs: summary.elements.filter(e => e.type === 'slab').length
      },
      statusDistribution: {
        pass: summary.overallStatus.passedElements,
        fail: summary.overallStatus.failedElements,
        warning: summary.overallStatus.warningElements
      },
      costBreakdown: {
        concrete: summary.costs.totalConcrete,
        steel: summary.costs.totalSteel,
        labor: summary.costs.totalLabor
      },
      averageUtilization: this.calculateAverageUtilization(),
      materialEfficiency: this.calculateMaterialEfficiency()
    };
  }

  /**
   * Calculate average utilization ratio
   */
  private calculateAverageUtilization(): number {
    const results = Array.from(this.designResults.values());
    if (results.length === 0) return 0;

    const totalUtilization = results.reduce((sum, result) => {
      const flexRatio = result.checks.flexuralStrength.ratio;
      return sum + (typeof flexRatio === 'number' ? flexRatio : 0);
    }, 0);

    return Math.round((totalUtilization / results.length) * 100);
  }

  /**
   * Calculate material efficiency
   */
  private calculateMaterialEfficiency(): number {
    const results = Array.from(this.designResults.values());
    if (results.length === 0) return 0;

    const efficientElements = results.filter(result => {
      const flexRatio = result.checks.flexuralStrength.ratio;
      return typeof flexRatio === 'number' && flexRatio >= 0.6 && flexRatio <= 0.9;
    });

    return Math.round((efficientElements.length / results.length) * 100);
  }
}

export default DesignResultsManager;