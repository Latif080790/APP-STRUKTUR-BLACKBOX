// =====================================
// 🚨 SNI-COMPLIANT INPUT FORM
// Professional Structural Analysis Interface
// Zero Error Tolerance Implementation
// =====================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Separator } from '../../ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  MapPin,
  Building,
  Hammer,
  Layers,
  Zap,
  Mountain
} from 'lucide-react';

// Import interfaces and validation
import {
  ProjectInfo,
  Geometry,
  MaterialProperties,
  Loads,
  SeismicParameters,
  SoilData,
  ValidationError,
  CodeViolation
} from '../interfaces';

import {
  validateCompleteSystem,
  validateSeismicParameters,
  validateMaterialProperties,
  validateSoilData,
  validateGeometry,
  validateLoads,
  getValidationSummary,
  getMustFixIssues,
  ValidationResult
} from '../calculations/validation-system';

import { LIVE_LOADS_BY_OCCUPANCY } from '../calculations/load-library';

// INTERFACES
interface InputFormProps {
  projectInfo: ProjectInfo;
  geometry: Geometry;
  materials: MaterialProperties;
  loads: Loads;
  seismicParams: SeismicParameters;
  soilData: SoilData;
  onUpdate: (section: string, data: any) => void;
  onValidationChange: (validation: ValidationResult) => void;
  isAnalyzing?: boolean;
}

interface ValidationDisplayProps {
  validation: ValidationResult;
}

// VALIDATION DISPLAY COMPONENT
const ValidationDisplay: React.FC<ValidationDisplayProps> = ({ validation }) => {
  const criticalCount = validation.codeViolations.filter(v => v.severity === 'critical').length;
  const majorCount = validation.codeViolations.filter(v => v.severity === 'major').length;
  const errorCount = validation.errors.length;
  const warningCount = validation.warnings.length;
  
  const mustFixIssues = getMustFixIssues(validation);
  
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {validation.isValid ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          Status Validasi Sistem
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status Keseluruhan:</span>
          <Badge 
            variant={validation.isValid ? 'success' : 'destructive'}
            className="text-xs"
          >
            {validation.isValid ? 'VALID' : 'TIDAK VALID'}
          </Badge>
        </div>
        
        {/* Professional Review Indicator */}
        {validation.professionalReviewRequired && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Review Profesional Diperlukan</strong><br />
              Proyek ini memerlukan pemeriksaan oleh ahli struktur berlisensi.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Issue Counts */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span>Pelanggaran Kritis:</span>
            <Badge variant={criticalCount > 0 ? 'destructive' : 'secondary'}>
              {criticalCount}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Pelanggaran Major:</span>
            <Badge variant={majorCount > 0 ? 'warning' : 'secondary'}>
              {majorCount}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Errors:</span>
            <Badge variant={errorCount > 0 ? 'destructive' : 'secondary'}>
              {errorCount}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Warnings:</span>
            <Badge variant={warningCount > 0 ? 'warning' : 'secondary'}>
              {warningCount}
            </Badge>
          </div>
        </div>
        
        {/* Must Fix Issues */}
        {mustFixIssues.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-600 mb-2">Harus Diperbaiki:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {mustFixIssues.map((issue, index) => (
                <Alert key={index} className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-sm">
                    {'violation' in issue ? (
                      <>
                        <strong>{issue.code} {issue.section}:</strong> {issue.violation}
                        <br />
                        <em className="text-xs">{issue.recommendation}</em>
                      </>
                    ) : (
                      <>
                        <strong>{issue.field}:</strong> {issue.message}
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
        
        {/* Summary */}
        <div className="text-xs text-gray-600 italic">
          {getValidationSummary(validation)}
        </div>
      </CardContent>
    </Card>
  );
};

// MAIN INPUT FORM COMPONENT
export const InputForm: React.FC<InputFormProps> = ({
  projectInfo,
  geometry,
  materials,
  loads,
  seismicParams,
  soilData,
  onUpdate,
  onValidationChange,
  isAnalyzing = false
}) => {
  // Validation state
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [validationLoading, setValidationLoading] = useState(false);
  
  // Form sections state
  const [activeTab, setActiveTab] = useState('project');
  
  // Validate complete system whenever inputs change
  const runValidation = useCallback(async () => {
    setValidationLoading(true);
    try {
      const result = validateCompleteSystem(
        geometry,
        loads,
        materials,
        soilData,
        seismicParams,
        projectInfo
      );
      setValidation(result);
      onValidationChange(result);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setValidationLoading(false);
    }
  }, [geometry, loads, materials, soilData, seismicParams, projectInfo, onValidationChange]);
  
  // Auto-validate when data changes
  useEffect(() => {
    const debounceTimeout = setTimeout(runValidation, 1000);
    return () => clearTimeout(debounceTimeout);
  }, [runValidation]);
  
  // Generate occupancy options from load library
  const occupancyOptions = useMemo(() => {
    return Object.keys(LIVE_LOADS_BY_OCCUPANCY).map(key => ({
      value: key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
    }));
  }, []);
  
  // Form field components with validation feedback
  const FormField: React.FC<{
    label: string;
    error?: string;
    warning?: string;
    children: React.ReactNode;
  }> = ({ label, error, warning, children }) => (
    <div className="space-y-2">
      <Label className={error ? 'text-red-600' : ''}>{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {warning && !error && (
        <p className="text-xs text-yellow-600 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {warning}
        </p>
      )}
    </div>
  );
  
  return (
    <div className="space-y-6">
      {/* Validation Status */}
      {validation && <ValidationDisplay validation={validation} />}
      
      {/* Progress Indicator */}
      {validationLoading && (
        <div className="flex items-center gap-2">
          <Progress value={70} className="flex-1" />
          <span className="text-xs text-gray-500">Validating...</span>
        </div>
      )}
      
      {/* Input Forms */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Input Sistem Struktur</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="project" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Proyek
              </TabsTrigger>
              <TabsTrigger value="geometry" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                Geometri
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex items-center gap-1">
                <Hammer className="h-4 w-4" />
                Material
              </TabsTrigger>
              <TabsTrigger value="loads" className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                Beban
              </TabsTrigger>
              <TabsTrigger value="seismic" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Seismik
              </TabsTrigger>
              <TabsTrigger value="soil" className="flex items-center gap-1">
                <Mountain className="h-4 w-4" />
                Tanah
              </TabsTrigger>
            </TabsList>
            
            {/* PROJECT INFO TAB */}
            <TabsContent value="project" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Nama Proyek">
                  <Input
                    value={projectInfo.name}
                    onChange={(e) => onUpdate('project', { ...projectInfo, name: e.target.value })}
                    placeholder="Nama proyek struktur"
                  />
                </FormField>
                
                <FormField label="Lokasi">
                  <Input
                    value={projectInfo.location}
                    onChange={(e) => onUpdate('project', { ...projectInfo, location: e.target.value })}
                    placeholder="Kota, Provinsi"
                  />
                </FormField>
                
                <FormField label="Fungsi Bangunan">
                  <Select
                    value={projectInfo.buildingFunction}
                    onValueChange={(value) => onUpdate('project', { ...projectInfo, buildingFunction: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {occupancyOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField label="Kategori Risiko">
                  <Select
                    value={projectInfo.riskCategory}
                    onValueChange={(value) => onUpdate('project', { ...projectInfo, riskCategory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I">I - Risiko Rendah</SelectItem>
                      <SelectItem value="II">II - Risiko Standard</SelectItem>
                      <SelectItem value="III">III - Risiko Menengah</SelectItem>
                      <SelectItem value="IV">IV - Risiko Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Latitude">
                  <Input
                    type="number"
                    step="0.000001"
                    value={projectInfo.latitude || ''}
                    onChange={(e) => onUpdate('project', { ...projectInfo, latitude: parseFloat(e.target.value) })}
                    placeholder="-6.200000 (Jakarta)"
                  />
                </FormField>
                
                <FormField label="Longitude">
                  <Input
                    type="number"
                    step="0.000001"
                    value={projectInfo.longitude || ''}
                    onChange={(e) => onUpdate('project', { ...projectInfo, longitude: parseFloat(e.target.value) })}
                    placeholder="106.816666 (Jakarta)"
                  />
                </FormField>
              </div>
            </TabsContent>
            
            {/* GEOMETRY TAB */}
            <TabsContent value="geometry" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Panjang Bangunan (m)">
                  <Input
                    type="number"
                    value={geometry.length}
                    onChange={(e) => onUpdate('geometry', { ...geometry, length: parseFloat(e.target.value) })}
                  />
                </FormField>
                
                <FormField label="Lebar Bangunan (m)">
                  <Input
                    type="number"
                    value={geometry.width}
                    onChange={(e) => onUpdate('geometry', { ...geometry, width: parseFloat(e.target.value) })}
                  />
                </FormField>
                
                <FormField label="Jumlah Lantai">
                  <Input
                    type="number"
                    value={geometry.numberOfFloors}
                    onChange={(e) => onUpdate('geometry', { ...geometry, numberOfFloors: parseInt(e.target.value) })}
                  />
                </FormField>
                
                <FormField label="Tinggi per Lantai (m)">
                  <Input
                    type="number"
                    step="0.1"
                    value={geometry.heightPerFloor}
                    onChange={(e) => onUpdate('geometry', { ...geometry, heightPerFloor: parseFloat(e.target.value) })}
                  />
                </FormField>
                
                <FormField label="Bentang Kolom X (m)">
                  <Input
                    type="number"
                    step="0.5"
                    value={geometry.baySpacingX}
                    onChange={(e) => onUpdate('geometry', { ...geometry, baySpacingX: parseFloat(e.target.value) })}
                  />
                </FormField>
                
                <FormField label="Bentang Kolom Y (m)">
                  <Input
                    type="number"
                    step="0.5"
                    value={geometry.baySpacingY}
                    onChange={(e) => onUpdate('geometry', { ...geometry, baySpacingY: parseFloat(e.target.value) })}
                  />
                </FormField>
              </div>
            </TabsContent>
            
            {/* MATERIALS TAB */}
            <TabsContent value="materials" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Mutu Beton fc' (MPa)">
                  <Select
                    value={materials.fc.toString()}
                    onValueChange={(value) => onUpdate('materials', { ...materials, fc: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[17, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70].map(fc => (
                        <SelectItem key={fc} value={fc.toString()}>
                          fc' = {fc} MPa
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField label="Mutu Baja fy (MPa)">
                  <Select
                    value={materials.fy.toString()}
                    onValueChange={(value) => onUpdate('materials', { ...materials, fy: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="240">BjTP-24 (240 MPa)</SelectItem>
                      <SelectItem value="400">BjTS-40 (400 MPa)</SelectItem>
                      <SelectItem value="500">BjTS-50 (500 MPa)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </TabsContent>
            
            {/* LOADS TAB */}
            <TabsContent value="loads" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Beban Mati (kN/m²)">
                  <Input
                    type="number"
                    step="0.1"
                    value={loads.deadLoad}
                    onChange={(e) => onUpdate('loads', { ...loads, deadLoad: parseFloat(e.target.value) })}
                  />
                </FormField>
                
                <FormField label="Beban Hidup (kN/m²)">
                  <Input
                    type="number"
                    step="0.1"
                    value={loads.liveLoad}
                    onChange={(e) => onUpdate('loads', { ...loads, liveLoad: parseFloat(e.target.value) })}
                  />
                </FormField>
                
                <FormField label="Kecepatan Angin (m/s)">
                  <Input
                    type="number"
                    value={loads.windSpeed}
                    onChange={(e) => onUpdate('loads', { ...loads, windSpeed: parseFloat(e.target.value) })}
                  />
                </FormField>
              </div>
            </TabsContent>
            
            {/* SEISMIC TAB */}
            <TabsContent value="seismic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Parameter Ss (g)">
                  <Input
                    type="number"
                    step="0.01"
                    value={seismicParams.ss}
                    onChange={(e) => onUpdate('seismic', { ...seismicParams, ss: parseFloat(e.target.value) })}
                    placeholder="0.4 - 1.5"
                  />
                </FormField>
                
                <FormField label="Parameter S1 (g)">
                  <Input
                    type="number"
                    step="0.01"
                    value={seismicParams.s1}
                    onChange={(e) => onUpdate('seismic', { ...seismicParams, s1: parseFloat(e.target.value) })}
                    placeholder="0.1 - 0.6"
                  />
                </FormField>
                
                <FormField label="Kelas Situs">
                  <Select
                    value={seismicParams.siteClass}
                    onValueChange={(value) => onUpdate('seismic', { ...seismicParams, siteClass: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SA">SA - Batuan Keras</SelectItem>
                      <SelectItem value="SB">SB - Batuan</SelectItem>
                      <SelectItem value="SC">SC - Tanah Keras</SelectItem>
                      <SelectItem value="SD">SD - Tanah Sedang</SelectItem>
                      <SelectItem value="SE">SE - Tanah Lunak</SelectItem>
                      <SelectItem value="SF">SF - Tanah Khusus</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </TabsContent>
            
            {/* SOIL TAB */}
            <TabsContent value="soil" className="space-y-4">
              <div className="space-y-4">
                <FormField label="Nilai N-SPT (pisahkan dengan koma)">
                  <Input
                    value={soilData.nspt?.join(', ') || ''}
                    onChange={(e) => {
                      const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                      onUpdate('soil', { ...soilData, nspt: values });
                    }}
                    placeholder="10, 15, 20, 25, 30"
                  />
                </FormField>
                
                <FormField label="Kedalaman (m, pisahkan dengan koma)">
                  <Input
                    value={soilData.depth?.join(', ') || ''}
                    onChange={(e) => {
                      const values = e.target.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
                      onUpdate('soil', { ...soilData, depth: values });
                    }}
                    placeholder="2, 4, 6, 8, 10"
                  />
                </FormField>
                
                <FormField label="Muka Air Tanah (m)">
                  <Input
                    type="number"
                    step="0.5"
                    value={soilData.groundwaterDepth || ''}
                    onChange={(e) => onUpdate('soil', { ...soilData, groundwaterDepth: parseFloat(e.target.value) })}
                    placeholder="Kedalaman dari permukaan"
                  />
                </FormField>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Action Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => runValidation()}
          disabled={isAnalyzing || validationLoading}
          className="min-w-32"
        >
          {validationLoading ? 'Memvalidasi...' : 'Validasi Ulang'}
        </Button>
      </div>
    </div>
  );
};

export default InputForm;