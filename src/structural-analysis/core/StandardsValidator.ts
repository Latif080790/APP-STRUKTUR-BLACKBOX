/**
 * Standards Validator
 * Validator untuk multiple standards compliance (SNI, ACI, AISC, Eurocode)
 * Memastikan design memenuhi standar engineering profesional
 */

export interface ValidationResult {
  isValid: boolean;
  standard: string;
  category: string;
  parameter: string;
  actualValue: number;
  limitValue: number;
  ratio: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export class StandardsValidator {
  private standards: string[];
  
  constructor(standards: string[]) {
    this.standards = standards;
  }

  /**
   * Validate project information
   */
  async validateProjectInfo(projectInfo: any): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    // Basic validation
    if (!projectInfo.nama || projectInfo.nama.trim() === '') {
      results.push({
        isValid: false,
        standard: 'General',
        category: 'Project Info',
        parameter: 'Project Name',
        actualValue: 0,
        limitValue: 1,
        ratio: 0,
        message: 'Nama proyek harus diisi',
        severity: 'error'
      });
    }
    
    if (!projectInfo.engineer || projectInfo.engineer.trim() === '') {
      results.push({
        isValid: false,
        standard: 'Professional Requirements',
        category: 'Project Info',
        parameter: 'Licensed Engineer',
        actualValue: 0,
        limitValue: 1,
        ratio: 0,
        message: 'Engineer penanggung jawab harus diisi dan berlisensi',
        severity: 'error'
      });
    }
    
    return results;
  }

  /**
   * Validate geometry parameters
   */
  async validateGeometry(geometry: any): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    // Building height limitations (SNI)
    if (this.standards.includes('SNI-1726-2019')) {
      const totalHeight = geometry.jumlahLantai * geometry.tinggiPerLantai;
      const aspectRatio = totalHeight / Math.min(geometry.panjang, geometry.lebar);
      
      if (aspectRatio > 5.0) {
        results.push({
          isValid: false,
          standard: 'SNI-1726-2019',
          category: 'Geometry',
          parameter: 'Aspect Ratio',
          actualValue: aspectRatio,
          limitValue: 5.0,
          ratio: aspectRatio / 5.0,
          message: 'Rasio tinggi terhadap lebar bangunan melebihi batas SNI (H/B ≤ 5)',
          severity: 'error'
        });
      }
      
      // Floor height validation
      if (geometry.tinggiPerLantai < 2.5) {
        results.push({
          isValid: false,
          standard: 'SNI-General',
          category: 'Geometry',
          parameter: 'Floor Height',
          actualValue: geometry.tinggiPerLantai,
          limitValue: 2.5,
          ratio: geometry.tinggiPerLantai / 2.5,
          message: 'Tinggi lantai minimum 2.5m untuk kenyamanan okupansi',
          severity: 'error'
        });
      }
      
      if (geometry.tinggiPerLantai > 6.0) {
        results.push({
          isValid: false,
          standard: 'SNI-General',
          category: 'Geometry',
          parameter: 'Floor Height',
          actualValue: geometry.tinggiPerLantai,
          limitValue: 6.0,
          ratio: geometry.tinggiPerLantai / 6.0,
          message: 'Tinggi lantai berlebihan, periksa efisiensi struktural',
          severity: 'warning'
        });
      }
    }
    
    // Span limitations
    const maxSpan = Math.max(geometry.bentangX, geometry.bentangY);
    if (maxSpan > 15.0) {
      results.push({
        isValid: true,
        standard: 'Engineering Practice',
        category: 'Geometry',
        parameter: 'Span Length',
        actualValue: maxSpan,
        limitValue: 15.0,
        ratio: maxSpan / 15.0,
        message: 'Bentang besar memerlukan perhatian khusus pada defleksi',
        severity: 'info'
      });
    }
    
    return results;
  }

  /**
   * Validate material properties sesuai standards
   */
  async validateMaterials(materials: any): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    // SNI 2847:2019 - Concrete strength validation
    if (this.standards.includes('SNI-2847-2019')) {
      if (materials.fcBeton < 17) {
        results.push({
          isValid: false,
          standard: 'SNI-2847-2019',
          category: 'Materials',
          parameter: 'Concrete Strength',
          actualValue: materials.fcBeton,
          limitValue: 17,
          ratio: materials.fcBeton / 17,
          message: "f'c minimum 17 MPa sesuai SNI 2847:2019",
          severity: 'error'
        });
      }
      
      if (materials.fcBeton > 80) {
        results.push({
          isValid: false,
          standard: 'SNI-2847-2019',
          category: 'Materials',
          parameter: 'Concrete Strength',
          actualValue: materials.fcBeton,
          limitValue: 80,
          ratio: materials.fcBeton / 80,
          message: "f'c maksimum 80 MPa untuk aplikasi umum",
          severity: 'warning'
        });
      }
      
      // Steel strength validation
      if (materials.fyBaja < 240) {
        results.push({
          isValid: false,
          standard: 'SNI-2847-2019',
          category: 'Materials',
          parameter: 'Steel Yield Strength',
          actualValue: materials.fyBaja,
          limitValue: 240,
          ratio: materials.fyBaja / 240,
          message: 'fy minimum 240 MPa untuk baja tulangan',
          severity: 'error'
        });
      }
      
      if (materials.fyBaja > 550) {
        results.push({
          isValid: false,
          standard: 'SNI-2847-2019',
          category: 'Materials',
          parameter: 'Steel Yield Strength',
          actualValue: materials.fyBaja,
          limitValue: 550,
          ratio: materials.fyBaja / 550,
          message: 'fy maksimum 550 MPa untuk aplikasi umum',
          severity: 'warning'
        });
      }
      
      // Safety factors validation
      if (materials.phiBeton < 0.65) {
        results.push({
          isValid: false,
          standard: 'SNI-2847-2019',
          category: 'Materials',
          parameter: 'Concrete Safety Factor',
          actualValue: materials.phiBeton,
          limitValue: 0.65,
          ratio: materials.phiBeton / 0.65,
          message: 'Faktor reduksi beton minimum φ = 0.65 untuk compression',
          severity: 'error'
        });
      }
    }
    
    // ACI 318 validation (if selected)
    if (this.standards.includes('ACI-318')) {
      if (materials.fcBeton < 21) {
        results.push({
          isValid: false,
          standard: 'ACI-318',
          category: 'Materials',
          parameter: 'Concrete Strength',
          actualValue: materials.fcBeton,
          limitValue: 21,
          ratio: materials.fcBeton / 21,
          message: "f'c minimum 21 MPa (3000 psi) sesuai ACI 318",
          severity: 'error'
        });
      }
    }
    
    return results;
  }

  /**
   * Validate loads sesuai PPIUG dan international standards
   */
  async validateLoads(loads: any): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    // Dead load validation (PPIUG 1983)
    if (loads.bebanMati < 3.0) {
      results.push({
        isValid: false,
        standard: 'PPIUG-1983',
        category: 'Loads',
        parameter: 'Dead Load',
        actualValue: loads.bebanMati,
        limitValue: 3.0,
        ratio: loads.bebanMati / 3.0,
        message: 'Beban mati minimum 3.0 kN/m² termasuk finishing',
        severity: 'warning'
      });
    }
    
    if (loads.bebanMati > 10.0) {
      results.push({
        isValid: true,
        standard: 'PPIUG-1983',
        category: 'Loads',
        parameter: 'Dead Load',
        actualValue: loads.bebanMati,
        limitValue: 10.0,
        ratio: loads.bebanMati / 10.0,
        message: 'Beban mati tinggi, periksa spesifikasi material dan finishing',
        severity: 'info'
      });
    }
    
    // Live load validation untuk occupancy type
    const minLiveLoads = {
      'residential': 2.0,
      'office': 2.5,
      'commercial': 4.0,
      'industrial': 5.0,
      'parking': 2.4
    };
    
    // Assume office if not specified
    const minLiveLoad = minLiveLoads['office'] || 2.5;
    if (loads.bebanHidup < minLiveLoad) {
      results.push({
        isValid: false,
        standard: 'PPIUG-1983',
        category: 'Loads',
        parameter: 'Live Load',
        actualValue: loads.bebanHidup,
        limitValue: minLiveLoad,
        ratio: loads.bebanHidup / minLiveLoad,
        message: `Beban hidup minimum ${minLiveLoad} kN/m² untuk fungsi perkantoran`,
        severity: 'error'
      });
    }
    
    // Wind load validation
    if (loads.kecepatanAngin < 25) {
      results.push({
        isValid: false,
        standard: 'SNI-1727-2020',
        category: 'Loads',
        parameter: 'Wind Speed',
        actualValue: loads.kecepatanAngin,
        limitValue: 25,
        ratio: loads.kecepatanAngin / 25,
        message: 'Kecepatan angin minimum 25 m/s untuk Indonesia',
        severity: 'error'
      });
    }
    
    return results;
  }

  /**
   * Validate seismic parameters sesuai SNI 1726:2019
   */
  async validateSeismic(seismic: any): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    if (this.standards.includes('SNI-1726-2019')) {
      // Ss validation (short period spectral acceleration)
      if (seismic.ss > 2.0) {
        results.push({
          isValid: false,
          standard: 'SNI-1726-2019',
          category: 'Seismic',
          parameter: 'Ss Parameter',
          actualValue: seismic.ss,
          limitValue: 2.0,
          ratio: seismic.ss / 2.0,
          message: 'Parameter Ss melebihi batas untuk design biasa, perlu special seismic design',
          severity: 'error'
        });
      }
      
      // S1 validation (1-second period spectral acceleration)
      if (seismic.s1 > 1.5) {
        results.push({
          isValid: false,
          standard: 'SNI-1726-2019',
          category: 'Seismic',
          parameter: 'S1 Parameter',
          actualValue: seismic.s1,
          limitValue: 1.5,
          ratio: seismic.s1 / 1.5,
          message: 'Parameter S1 melebihi batas untuk design biasa',
          severity: 'error'
        });
      }
      
      // Response modification factor validation
      const maxR = {
        'SRPMK': 8.0,  // Special Moment Resisting Frame
        'SRPMM': 5.0,  // Intermediate Moment Resisting Frame
        'SRPB': 3.0    // Ordinary Moment Resisting Frame
      };
      
      if (seismic.faktorModifikasi > 8.0) {
        results.push({
          isValid: false,
          standard: 'SNI-1726-2019',
          category: 'Seismic',
          parameter: 'Response Modification Factor',
          actualValue: seismic.faktorModifikasi,
          limitValue: 8.0,
          ratio: seismic.faktorModifikasi / 8.0,
          message: 'Faktor modifikasi respons maksimum R = 8.0 untuk SRPMK',
          severity: 'error'
        });
      }
      
      // Site class validation
      const validSiteClasses = ['SA', 'SB', 'SC', 'SD', 'SE', 'SF'];
      if (!validSiteClasses.includes(seismic.kelasTransisi)) {
        results.push({
          isValid: false,
          standard: 'SNI-1726-2019',
          category: 'Seismic',
          parameter: 'Site Class',
          actualValue: 0,
          limitValue: 1,
          ratio: 0,
          message: 'Kelas situs harus SA, SB, SC, SD, SE, atau SF',
          severity: 'error'
        });
      }
    }
    
    return results;
  }

  /**
   * Check overall compliance dengan results dari analysis
   */
  async checkCompliance(analysisData: any): Promise<any> {
    const complianceResults = {
      overall: true,
      standards: this.standards,
      checks: [] as any[],
      summary: {
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
    
    const { geometry, materials, forces, moments, displacements } = analysisData;
    
    // Drift ratio check (SNI 1726:2019)
    if (this.standards.includes('SNI-1726-2019')) {
      const maxDrift = Math.max(...displacements.map((d: number) => Math.abs(d)));
      const heightLimit = geometry.tinggiPerLantai / 500; // H/500 limit
      
      const driftCheck = {
        parameter: 'Inter-story Drift',
        standard: 'SNI-1726-2019',
        actual: maxDrift,
        limit: heightLimit,
        ratio: maxDrift / heightLimit,
        passed: maxDrift <= heightLimit,
        message: maxDrift <= heightLimit ? 
          'Drift ratio memenuhi batas SNI (Δ ≤ H/500)' : 
          'Drift ratio melebihi batas SNI, perkuat sistem struktur'
      };
      
      complianceResults.checks.push(driftCheck);
      if (driftCheck.passed) {
        complianceResults.summary.passed++;
      } else {
        complianceResults.summary.failed++;
        complianceResults.overall = false;
      }
    }
    
    // Strength check untuk elements
    forces.forEach((force: number, index: number) => {
      const utilizationRatio = Math.abs(force) / (materials.fcBeton * 1e6); // Simplified
      
      const strengthCheck = {
        parameter: `Element ${index + 1} Strength`,
        standard: 'SNI-2847-2019',
        actual: utilizationRatio,
        limit: 1.0,
        ratio: utilizationRatio,
        passed: utilizationRatio <= 1.0,
        message: utilizationRatio <= 1.0 ? 
          'Kekuatan elemen memadai' : 
          'Elemen overstressed, perbesar dimensi atau tingkatkan mutu material'
      };
      
      complianceResults.checks.push(strengthCheck);
      if (strengthCheck.passed) {
        complianceResults.summary.passed++;
      } else {
        complianceResults.summary.failed++;
        complianceResults.overall = false;
      }
    });
    
    return complianceResults;
  }

  /**
   * Get validation summary
   */
  getValidationSummary(validationResults: ValidationResult[]): any {
    const summary = {
      total: validationResults.length,
      passed: validationResults.filter(r => r.isValid).length,
      failed: validationResults.filter(r => !r.isValid && r.severity === 'error').length,
      warnings: validationResults.filter(r => r.severity === 'warning').length,
      info: validationResults.filter(r => r.severity === 'info').length,
      overallValid: validationResults.every(r => r.isValid || r.severity !== 'error')
    };
    
    return summary;
  }
}

export default StandardsValidator;