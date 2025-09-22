import { ProjectInfo, Geometry, MaterialProperties, SeismicParameters } from './interfaces';

export class InputValidator {
  static validateProjectInfo(project: ProjectInfo): string[] {
    const errors: string[] = [];
    
    if (!project.name || project.name.trim().length < 3) {
      errors.push('Nama proyek minimal 3 karakter');
    }
    
    if (!project.location) {
      errors.push('Lokasi proyek harus diisi');
    }
    
    if (!project.buildingFunction) {
      errors.push('Fungsi bangunan harus diisi');
    }
    
    if (!project.riskCategory) {
      errors.push('Kategori risiko harus diisi');
    }
    
    return errors;
  }

  static validateGeometry(geometry: Geometry): string[] {
    const errors: string[] = [];
    
    if (geometry.length <= 0 || geometry.length > 1000) {
      errors.push('Panjang bangunan harus antara 1-1000 m');
    }
    
    if (geometry.width <= 0 || geometry.width > 1000) {
      errors.push('Lebar bangunan harus antara 1-1000 m');
    }
    
    if (geometry.heightPerFloor < 2.5 || geometry.heightPerFloor > 10) {
      errors.push('Tinggi per lantai harus antara 2.5-10 m');
    }
    
    if (geometry.numberOfFloors < 1 || geometry.numberOfFloors > 200) {
      errors.push('Jumlah lantai harus antara 1-200');
    }
    
    return errors;
  }

  static validateMaterial(material: MaterialProperties): string[] {
    const errors: string[] = [];
    
    if (material.fc < 17 || material.fc > 100) {
      errors.push('Kuat tekan beton (fc\') harus antara 17-100 MPa');
    }
    
    if (material.fy < 240 || material.fy > 550) {
      errors.push('Tegangan leleh baja (fy) harus antara 240-550 MPa');
    }
    
    if (material.densityConcrete < 2200 || material.densityConcrete > 2500) {
      errors.push('Massa jenis beton harus antara 2200-2500 kg/m³');
    }
    
    return errors;
  }

  static validateSeismicParams(params: SeismicParameters): string[] {
    const errors: string[] = [];
    
    if (params.ss <= 0 || params.ss > 3) {
      errors.push('Parameter percepatan batuan dasar (Ss) tidak valid');
    }
    
    if (params.s1 <= 0 || params.s1 > 1.5) {
      errors.push('Parameter percepatan batuan dasar (S1) tidak valid');
    }
    
    if (!['SA', 'SB', 'SC', 'SD', 'SE', 'SF'].includes(params.siteClass)) {
      errors.push('Kelas situs tidak valid');
    }
    
    if (params.importance < 0.8 || params.importance > 1.5) {
      errors.push('Faktor keutamaan harus antara 0.8-1.5');
    }
    
    return errors;
  }

  static validateAllInputs(
    project: ProjectInfo,
    geometry: Geometry,
    material: MaterialProperties,
    seismic: SeismicParameters
  ): { isValid: boolean; errors: string[] } {
    const errors = [
      ...this.validateProjectInfo(project).map(e => `Proyek: ${e}`),
      ...this.validateGeometry(geometry).map(e => `Geometri: ${e}`),
      ...this.validateMaterial(material).map(e => `Material: ${e}`),
      ...this.validateSeismicParams(seismic).map(e => `Gempa: ${e}`)
    ];
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
