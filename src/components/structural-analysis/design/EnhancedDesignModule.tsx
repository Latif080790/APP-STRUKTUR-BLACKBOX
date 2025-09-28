/**
 * Enhanced Design Module with Input Validation and Error Handling
 * Features comprehensive validation, alerts, and educational feedback
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Calculator, 
  FileText, 
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Book,
  Wrench
} from 'lucide-react';
import StructuralDesignEngine, { DesignInput, DesignResults } from './StructuralDesignEngine';
import { EducationalStructuralDesignEngine, ValidationResult } from './StructuralDesignEngineEducational';
import { EnhancedEducationalDesignEngine } from './EnhancedEducationalDesignEngine';

interface ValidationError {
  field: string;
  message: string;
  solution: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
}

interface DesignFormData {
  elementId: string;
  elementType: 'beam' | 'column' | 'slab';
  geometry: {
    width: number;
    height: number;
    length: number;
    clearCover: number;
  };
  materials: {
    fc: number;
    fy: number;
  };
  loads: {
    deadLoad: number;
    liveLoad: number;
    windLoad: number;
    seismicLoad: number;
  };
  forces: {
    momentX: number;
    momentY: number;
    shearX: number;
    shearY: number;
    axial: number;
    torsion: number;
  };
  constraints: {
    deflectionLimit: number;
    crackWidth: number;
    fireRating: number;
    exposureCondition: 'mild' | 'moderate' | 'severe' | 'very_severe' | 'extreme';
  };
}

interface EnhancedDesignModuleProps {
  onResultsUpdate?: (results: DesignResults) => void;
}

const EnhancedDesignModule: React.FC<EnhancedDesignModuleProps> = ({
  onResultsUpdate
}) => {
  const [formData, setFormData] = useState<DesignFormData>({
    elementId: 'B-1',
    elementType: 'beam',
    geometry: {
      width: 300,
      height: 500,
      length: 6000,
      clearCover: 40
    },
    materials: {
      fc: 25,
      fy: 400
    },
    loads: {
      deadLoad: 15,
      liveLoad: 25,
      windLoad: 5,
      seismicLoad: 8
    },
    forces: {
      momentX: 180,
      momentY: 0,
      shearX: 120,
      shearY: 0,
      axial: 0,
      torsion: 0
    },
    constraints: {
      deflectionLimit: 250,
      crackWidth: 0.4,
      fireRating: 2,
      exposureCondition: 'moderate'
    }
  });

  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
    recommendations: []
  });

  const [designResults, setDesignResults] = useState<DesignResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'validation' | 'results'>('input');
  const [showHelp, setShowHelp] = useState(false);

  // Real-time validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateInput();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const validateInput = useCallback(() => {
    try {
      const designInput: DesignInput = {
        elementType: formData.elementType,
        geometry: formData.geometry,
        materials: formData.materials,
        loads: formData.loads,
        forces: formData.forces,
        constraints: formData.constraints
      };

      const educationalEngine = new EducationalStructuralDesignEngine(designInput);
      const validationResult = educationalEngine.validateInput();
      
      setValidation(validationResult);
    } catch (error) {
      console.error('Validation error:', error);
      setValidation({
        isValid: false,
        errors: [{
          field: 'general',
          message: 'Terjadi kesalahan dalam validasi',
          reason: 'System error occurred during validation',
          correctRange: '',
          example: ''
        }],
        warnings: [],
        recommendations: ['Silakan refresh halaman dan coba lagi']
      });
    }
  }, [formData]);

  const handleInputChange = (section: keyof DesignFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const performDesign = async () => {
    if (!validation.isValid) {
      showValidationAlert();
      return;
    }

    setIsCalculating(true);
    setActiveTab('results');

    try {
      const designInput: DesignInput = {
        elementType: formData.elementType,
        geometry: formData.geometry,
        materials: formData.materials,
        loads: formData.loads,
        forces: formData.forces,
        constraints: formData.constraints
      };

      // Use enhanced educational engine for better feedback
      const enhancedEngine = new EnhancedEducationalDesignEngine(designInput);
      const results = enhancedEngine.performEducationalDesign(formData.elementType);

      setDesignResults(results);
      onResultsUpdate?.(results);

      // Show success message
      showAlert('success', 'Desain berhasil!', `Elemen ${formData.elementId} telah berhasil didesain sesuai SNI 2847.`);

    } catch (error) {
      console.error('Design calculation error:', error);
      showAlert('error', 'Kesalahan Perhitungan', 'Terjadi kesalahan dalam perhitungan desain. Silakan periksa input dan coba lagi.');
    } finally {
      setIsCalculating(false);
    }
  };

  const showValidationAlert = () => {
    const errorCount = validation.errors.length;
    const warningCount = validation.warnings.length;
    
    let message = 'Silakan perbaiki kesalahan berikut:\n\n';
    
    validation.errors.forEach((error, index) => {
      message += `${index + 1}. ${error.message}\n`;
      message += `   Solusi: ${error.reason}\n`;
      if (error.correctRange) {
        message += `   Rentang yang benar: ${error.correctRange}\n`;
      }
      message += '\n';
    });

    if (warningCount > 0) {
      message += '\nPeringatan:\n';
      validation.warnings.forEach((warning, index) => {
        message += `• ${warning.message}\n`;
      });
    }

    alert(message);
  };

  const showAlert = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    // This could be enhanced with a proper toast/notification system
    alert(`${title}\n\n${message}`);
  };

  const getValidationSummary = () => {
    const errorCount = validation.errors.length;
    const warningCount = validation.warnings.length;

    if (errorCount === 0 && warningCount === 0) {
      return { status: 'valid', message: 'Input valid dan siap untuk perhitungan' };
    } else if (errorCount > 0) {
      return { status: 'error', message: `${errorCount} kesalahan perlu diperbaiki` };
    } else {
      return { status: 'warning', message: `${warningCount} peringatan ditemukan` };
    }
  };

  const renderInputForm = () => (
    <div className="space-y-6">
      {/* Element Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Elemen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ID Elemen</label>
              <input
                type="text"
                value={formData.elementId}
                onChange={(e) => handleInputChange('elementId' as any, '', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipe Elemen</label>
              <select
                value={formData.elementType}
                onChange={(e) => handleInputChange('elementType' as any, '', e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="beam">Balok</option>
                <option value="column">Kolom</option>
                <option value="slab">Pelat</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geometry */}
      <Card>
        <CardHeader>
          <CardTitle>Dimensi (mm)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Lebar</label>
              <input
                type="number"
                value={formData.geometry.width}
                onChange={(e) => handleInputChange('geometry', 'width', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tinggi</label>
              <input
                type="number"
                value={formData.geometry.height}
                onChange={(e) => handleInputChange('geometry', 'height', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Panjang</label>
              <input
                type="number"
                value={formData.geometry.length}
                onChange={(e) => handleInputChange('geometry', 'length', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Selimut Beton</label>
              <input
                type="number"
                value={formData.geometry.clearCover}
                onChange={(e) => handleInputChange('geometry', 'clearCover', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Material</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">f'c (MPa)</label>
              <input
                type="number"
                value={formData.materials.fc}
                onChange={(e) => handleInputChange('materials', 'fc', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">fy (MPa)</label>
              <input
                type="number"
                value={formData.materials.fy}
                onChange={(e) => handleInputChange('materials', 'fy', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loads */}
      <Card>
        <CardHeader>
          <CardTitle>Beban (kN/m)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Beban Mati</label>
              <input
                type="number"
                value={formData.loads.deadLoad}
                onChange={(e) => handleInputChange('loads', 'deadLoad', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Beban Hidup</label>
              <input
                type="number"
                value={formData.loads.liveLoad}
                onChange={(e) => handleInputChange('loads', 'liveLoad', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Beban Angin</label>
              <input
                type="number"
                value={formData.loads.windLoad}
                onChange={(e) => handleInputChange('loads', 'windLoad', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Beban Gempa</label>
              <input
                type="number"
                value={formData.loads.seismicLoad}
                onChange={(e) => handleInputChange('loads', 'seismicLoad', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forces */}
      <Card>
        <CardHeader>
          <CardTitle>Gaya Internal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mx (kN.m)</label>
              <input
                type="number"
                value={formData.forces.momentX}
                onChange={(e) => handleInputChange('forces', 'momentX', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vx (kN)</label>
              <input
                type="number"
                value={formData.forces.shearX}
                onChange={(e) => handleInputChange('forces', 'shearX', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">N (kN)</label>
              <input
                type="number"
                value={formData.forces.axial}
                onChange={(e) => handleInputChange('forces', 'axial', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderValidationPanel = () => {
    const summary = getValidationSummary();
    
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {summary.status === 'valid' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {summary.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
              {summary.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
              <span>Status Validasi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`font-medium ${
              summary.status === 'valid' ? 'text-green-700' :
              summary.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {summary.message}
            </p>
          </CardContent>
        </Card>

        {validation.errors.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center space-x-2">
                <XCircle className="w-5 h-5" />
                <span>Kesalahan Input ({validation.errors.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {validation.errors.map((error, index) => (
                <Alert key={index} className="border-red-200 bg-red-50">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold text-red-800">{error.message}</p>
                      <p className="text-sm text-red-700">
                        <strong>Mengapa salah:</strong> {error.reason}
                      </p>
                      {error.correctRange && (
                        <p className="text-sm text-red-700">
                          <strong>Rentang yang benar:</strong> {error.correctRange}
                        </p>
                      )}
                      {error.example && (
                        <p className="text-sm text-red-700">
                          <strong>Contoh:</strong> {error.example}
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}

        {validation.warnings.length > 0 && (
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-700 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Peringatan ({validation.warnings.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {validation.warnings.map((warning, index) => (
                <Alert key={index} className="border-yellow-200 bg-yellow-50">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <AlertDescription>
                    <p className="text-yellow-800">{warning.message}</p>
                    <p className="text-sm text-yellow-700 mt-1">{warning.suggestion}</p>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}

        {validation.recommendations.length > 0 && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center space-x-2">
                <Book className="w-5 h-5" />
                <span>Rekomendasi Pembelajaran</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {validation.recommendations.map((rec, index) => (
                  <p key={index} className="text-blue-700">{rec}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderResults = () => {
    if (!designResults) {
      return (
        <Card>
          <CardContent className="text-center py-8">
            <Calculator className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Belum ada hasil perhitungan</p>
            <p className="text-sm text-gray-400">Lakukan perhitungan desain untuk melihat hasil</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {designResults.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span>Hasil Desain - {formData.elementId}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Dimensi Elemen</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lebar:</span>
                    <span className="font-mono">{designResults.element.dimensions.width} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tinggi:</span>
                    <span className="font-mono">{designResults.element.dimensions.height} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mutu Beton:</span>
                    <span className="font-mono">{designResults.element.concreteGrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mutu Baja:</span>
                    <span className="font-mono">{designResults.element.steelGrade}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Tulangan</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tulangan Utama:</span>
                    <span className="font-mono">{designResults.reinforcement.main.count}D{designResults.reinforcement.main.diameter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sengkang:</span>
                    <span className="font-mono">D{designResults.reinforcement.shear.diameter}-{designResults.reinforcement.shear.spacing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Luas Tulangan:</span>
                    <span className="font-mono">{designResults.reinforcement.main.area} mm²</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Design Checks */}
        <Card>
          <CardHeader>
            <CardTitle>Kontrol Desain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Kekuatan Lentur</span>
                  <div className="text-sm text-gray-600">
                    φMn = {designResults.checks.flexuralStrength.provided.toFixed(1)} kN.m ≥ 
                    Mu = {designResults.checks.flexuralStrength.required.toFixed(1)} kN.m
                  </div>
                </div>
                <Badge className={
                  designResults.checks.flexuralStrength.status === 'pass' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }>
                  {designResults.checks.flexuralStrength.status === 'pass' ? 'OK' : 'NG'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Kekuatan Geser</span>
                  <div className="text-sm text-gray-600">
                    φVn = {designResults.checks.shearStrength.provided.toFixed(1)} kN ≥ 
                    Vu = {designResults.checks.shearStrength.required.toFixed(1)} kN
                  </div>
                </div>
                <Badge className={
                  designResults.checks.shearStrength.status === 'pass' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }>
                  {designResults.checks.shearStrength.status === 'pass' ? 'OK' : 'NG'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Lendutan</span>
                  <div className="text-sm text-gray-600">
                    δ = {designResults.checks.deflection.provided.toFixed(2)} mm ≤ 
                    δ_izin = {designResults.checks.deflection.required.toFixed(2)} mm
                  </div>
                </div>
                <Badge className={
                  designResults.checks.deflection.status === 'pass' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }>
                  {designResults.checks.deflection.status === 'pass' ? 'OK' : 'NG'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations from design */}
        {designResults.recommendations && designResults.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>Rekomendasi Desain</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {designResults.recommendations.map((rec, index) => (
                  <p key={index} className="text-sm text-blue-700">• {rec}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Enhanced Design Module</h1>
            <p className="mt-2 opacity-90">Desain Elemen Struktur dengan Validasi Lengkap dan Edukasi</p>
          </div>
          <div className="text-6xl opacity-20">
            <Wrench />
          </div>
        </div>
      </div>

      {/* Validation Status Bar */}
      <Card className={`border-2 ${
        validation.isValid 
          ? 'border-green-200 bg-green-50' 
          : validation.errors.length > 0
            ? 'border-red-200 bg-red-50'
            : 'border-yellow-200 bg-yellow-50'
      }`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {validation.isValid ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : validation.errors.length > 0 ? (
                <XCircle className="w-6 h-6 text-red-500" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              )}
              <div>
                <p className="font-medium">{getValidationSummary().message}</p>
                <p className="text-sm text-gray-600">
                  {validation.errors.length} kesalahan, {validation.warnings.length} peringatan
                </p>
              </div>
            </div>
            <Button
              onClick={performDesign}
              disabled={!validation.isValid || isCalculating}
              className={
                validation.isValid 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menghitung...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Hitung Desain
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'input', label: 'Input Data', icon: FileText },
          { id: 'validation', label: 'Validasi', icon: AlertTriangle },
          { id: 'results', label: 'Hasil', icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
              activeTab === id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {id === 'validation' && validation.errors.length > 0 && (
              <Badge className="bg-red-500 text-white text-xs ml-1">
                {validation.errors.length}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'input' && renderInputForm()}
        {activeTab === 'validation' && renderValidationPanel()}
        {activeTab === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default EnhancedDesignModule;