/**
 * Enhanced Input Form with comprehensive Zod validation and real-time feedback
 * Provides type-safe form validation with sanitization and error handling
 */

import React, { useState, useCallback, useEffect } from 'react';
import { geometrySchema, materialPropertiesSchema, seismicAnalysisSchema, analysisOptionsSchema, type GeometryFormData, type MaterialFormData, type SeismicAnalysisFormData, type AnalysisOptionsFormData } from '../validation/schemas';
import { useEnhancedForm, useFieldValidation } from '../validation/useEnhancedForm';
import { Geometry, MaterialProperties, SeismicParameters, AnalysisOptions } from '../interfaces';

interface EnhancedInputFormProps {
  onAnalyze: (data: {
    geometry: Geometry;
    material: MaterialProperties;
    seismic?: SeismicParameters;
    options?: AnalysisOptions;
  }) => void;
  onError?: (errors: string[]) => void;
  initialValues?: {
    geometry?: Partial<Geometry>;
    material?: Partial<MaterialProperties>;
    seismic?: Partial<SeismicParameters>;
    options?: Partial<AnalysisOptions>;
  };
  loading?: boolean;
  disabled?: boolean;
}

interface FormValidationErrors {
  geometry: string[];
  material: string[];
  seismic: string[];
  options: string[];
  general: string[];
}

const EnhancedInputForm: React.FC<EnhancedInputFormProps> = ({
  onAnalyze,
  onError,
  initialValues,
  loading = false,
  disabled = false
}) => {
  // Form state management
  const [activeTab, setActiveTab] = useState<'geometry' | 'material' | 'seismic' | 'options'>('geometry');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<FormValidationErrors>({
    geometry: [],
    material: [],
    seismic: [],
    options: [],
    general: []
  });

  // Individual form instances for each tab
  const geometryForm = useEnhancedForm({
    schema: geometrySchema,
    defaultValues: {
      length: initialValues?.geometry?.length || 20,
      width: initialValues?.geometry?.width || 15,
      heightPerFloor: initialValues?.geometry?.heightPerFloor || 3.5,
      numberOfFloors: initialValues?.geometry?.numberOfFloors || 3,
      columnGridX: initialValues?.geometry?.columnGridX || 5,
      columnGridY: initialValues?.geometry?.columnGridY || 5,
      foundationDepth: initialValues?.geometry?.foundationDepth || 2,
    },
    realTimeValidation: true,
    debounceMs: 500,
    sanitizeOnChange: true,
    onValidationChange: (result) => {
      setValidationErrors(prev => ({
        ...prev,
        geometry: result.errors.map(e => e.message)
      }));
    }
  });

  const materialForm = useEnhancedForm({
    schema: materialPropertiesSchema,
    defaultValues: {
      fc: initialValues?.material?.fc || 25,
      fy: initialValues?.material?.fy || 400,
      elasticModulus: initialValues?.material?.elasticModulus || 25000,
      poissonRatio: initialValues?.material?.poissonRatio || 0.2,
      density: initialValues?.material?.density || 2400,
    },
    realTimeValidation: true,
    debounceMs: 500,
    sanitizeOnChange: true,
    onValidationChange: (result) => {
      setValidationErrors(prev => ({
        ...prev,
        material: result.errors.map(e => e.message)
      }));
    }
  });

  const seismicForm = useEnhancedForm({
    schema: seismicAnalysisSchema,
    defaultValues: {
      designCategory: initialValues?.seismic?.designCategory || 'C',
      siteClass: initialValues?.seismic?.siteClass || 'C',
      ss: initialValues?.seismic?.ss || 0.8,
      s1: initialValues?.seismic?.s1 || 0.4,
      importance: initialValues?.seismic?.importance || 1.0,
      dampingRatio: initialValues?.seismic?.dampingRatio || 5,
      responseModification: initialValues?.seismic?.responseModification || 3,
      overstrengthFactor: initialValues?.seismic?.overstrengthFactor || 2.5,
      deflectionAmplificationFactor: initialValues?.seismic?.deflectionAmplificationFactor || 3,
    },
    realTimeValidation: true,
    debounceMs: 500,
    sanitizeOnChange: true,
    onValidationChange: (result) => {
      setValidationErrors(prev => ({
        ...prev,
        seismic: result.errors.map(e => e.message)
      }));
    }
  });

  const optionsForm = useEnhancedForm({
    schema: analysisOptionsSchema,
    defaultValues: {
      analysisType: initialValues?.options?.analysisType || 'static',
      includeNonlinear: initialValues?.options?.includeNonlinear || false,
      includeSecondOrder: initialValues?.options?.includeSecondOrder || false,
      convergenceTolerance: initialValues?.options?.convergenceTolerance || 1e-6,
      maxIterations: initialValues?.options?.maxIterations || 100,
      numberOfModes: initialValues?.options?.numberOfModes || 10,
    },
    realTimeValidation: true,
    debounceMs: 500,
    sanitizeOnChange: true,
    onValidationChange: (result) => {
      setValidationErrors(prev => ({
        ...prev,
        options: result.errors.map(e => e.message)
      }));
    }
  });

  // Field validation hooks
  const geometryValidation = {
    length: useFieldValidation(geometryForm, 'length'),
    width: useFieldValidation(geometryForm, 'width'),
    heightPerFloor: useFieldValidation(geometryForm, 'heightPerFloor'),
    numberOfFloors: useFieldValidation(geometryForm, 'numberOfFloors'),
    columnGridX: useFieldValidation(geometryForm, 'columnGridX'),
    columnGridY: useFieldValidation(geometryForm, 'columnGridY'),
  };

  const materialValidation = {
    fc: useFieldValidation(materialForm, 'fc'),
    fy: useFieldValidation(materialForm, 'fy'),
    elasticModulus: useFieldValidation(materialForm, 'elasticModulus'),
    poissonRatio: useFieldValidation(materialForm, 'poissonRatio'),
  };

  // Check overall form validity
  const isFormValid = useCallback(() => {
    return geometryForm.isValid && materialForm.isValid && seismicForm.isValid && optionsForm.isValid;
  }, [geometryForm.isValid, materialForm.isValid, seismicForm.isValid, optionsForm.isValid]);

  // Get total error count
  const totalErrors = Object.values(validationErrors).reduce((total, errors) => total + errors.length, 0);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    setSubmitAttempted(true);
    
    try {
      // Validate all forms
      const [geometryResult, materialResult, seismicResult, optionsResult] = await Promise.all([
        geometryForm.validateAll(),
        materialForm.validateAll(),
        seismicForm.validateAll(),
        optionsForm.validateAll()
      ]);

      // Check if all forms are valid
      if (!geometryResult.isValid || !materialResult.isValid || !seismicResult.isValid || !optionsResult.isValid) {
        const allErrors = [
          ...geometryResult.errors.map(e => `Geometri: ${e.message}`),
          ...materialResult.errors.map(e => `Material: ${e.message}`),
          ...seismicResult.errors.map(e => `Seismik: ${e.message}`),
          ...optionsResult.errors.map(e => `Opsi Analisis: ${e.message}`)
        ];
        
        if (onError) {
          onError(allErrors);
        }
        
        // Focus on first tab with errors
        if (!geometryResult.isValid) setActiveTab('geometry');
        else if (!materialResult.isValid) setActiveTab('material');
        else if (!seismicResult.isValid) setActiveTab('seismic');
        else if (!optionsResult.isValid) setActiveTab('options');
        
        return;
      }

      // Extract clean data
      const cleanData = {
        geometry: geometryResult.data!,
        material: materialResult.data!,
        seismic: seismicResult.data,
        options: optionsResult.data
      };

      onAnalyze(cleanData);
    } catch (error) {
      console.error('Form submission error:', error);
      if (onError) {
        onError([error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses form']);
      }
    }
  }, [geometryForm, materialForm, seismicForm, optionsForm, onAnalyze, onError]);

  // Input component with validation
  const ValidatedNumberInput: React.FC<{
    label: string;
    name: string;
    value: number;
    onChange: (value: number) => void;
    validation: ReturnType<typeof useFieldValidation>;
    unit?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
  }> = ({ label, name, value, onChange, validation, unit, placeholder, min, max, step = 0.1 }) => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {unit && <span className="text-gray-500">({unit})</span>}
      </label>
      <input
        id={name}
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          validation.hasError
            ? 'border-red-500 focus:ring-red-200 bg-red-50'
            : validation.isValid && validation.isTouched
            ? 'border-green-500 focus:ring-green-200 bg-green-50'
            : 'border-gray-300 focus:ring-blue-200'
        }`}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        {...validation.getValidationProps()}
      />
      {validation.hasError && (
        <p className="text-sm text-red-600" id={`${name}-error`}>
          {validation.errorMessage}
        </p>
      )}
    </div>
  );

  // Tab navigation component
  const TabNavigation = () => {
    const tabs = [
      { id: 'geometry', label: 'Geometri', errors: validationErrors.geometry.length },
      { id: 'material', label: 'Material', errors: validationErrors.material.length },
      { id: 'seismic', label: 'Seismik', errors: validationErrors.seismic.length },
      { id: 'options', label: 'Opsi', errors: validationErrors.options.length }
    ];

    return (
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm relative ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.errors > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {tab.errors}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Parameter Analisis Struktur</h2>
        <p className="text-gray-600">
          Masukkan parameter untuk analisis struktur. Semua field akan divalidasi secara real-time.
        </p>
        {totalErrors > 0 && (
          <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            <p className="font-medium">Terdapat {totalErrors} error yang perlu diperbaiki</p>
          </div>
        )}
      </div>

      <TabNavigation />

      <div className="mt-6">
        {/* Geometry Tab */}
        {activeTab === 'geometry' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Geometri Bangunan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ValidatedNumberInput
                label="Panjang Bangunan"
                name="length"
                value={geometryForm.watch('length')}
                onChange={(value) => geometryForm.setValue('length', value)}
                validation={geometryValidation.length}
                unit="m"
                min={3}
                max={200}
              />
              <ValidatedNumberInput
                label="Lebar Bangunan"
                name="width"
                value={geometryForm.watch('width')}
                onChange={(value) => geometryForm.setValue('width', value)}
                validation={geometryValidation.width}
                unit="m"
                min={3}
                max={200}
              />
              <ValidatedNumberInput
                label="Tinggi per Lantai"
                name="heightPerFloor"
                value={geometryForm.watch('heightPerFloor')}
                onChange={(value) => geometryForm.setValue('heightPerFloor', value)}
                validation={geometryValidation.heightPerFloor}
                unit="m"
                min={2.4}
                max={10}
              />
              <ValidatedNumberInput
                label="Jumlah Lantai"
                name="numberOfFloors"
                value={geometryForm.watch('numberOfFloors')}
                onChange={(value) => geometryForm.setValue('numberOfFloors', Math.round(value))}
                validation={geometryValidation.numberOfFloors}
                unit="lantai"
                min={1}
                max={100}
                step={1}
              />
              <ValidatedNumberInput
                label="Grid Kolom X"
                name="columnGridX"
                value={geometryForm.watch('columnGridX')}
                onChange={(value) => geometryForm.setValue('columnGridX', value)}
                validation={geometryValidation.columnGridX}
                unit="m"
                min={3}
                max={20}
              />
              <ValidatedNumberInput
                label="Grid Kolom Y"
                name="columnGridY"
                value={geometryForm.watch('columnGridY')}
                onChange={(value) => geometryForm.setValue('columnGridY', value)}
                validation={geometryValidation.columnGridY}
                unit="m"
                min={3}
                max={20}
              />
            </div>
          </div>
        )}

        {/* Material Tab */}
        {activeTab === 'material' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Properti Material</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ValidatedNumberInput
                label="Kuat Tekan Beton (f'c)"
                name="fc"
                value={materialForm.watch('fc')}
                onChange={(value) => materialForm.setValue('fc', value)}
                validation={materialValidation.fc}
                unit="MPa"
                min={10}
                max={80}
              />
              <ValidatedNumberInput
                label="Kuat Leleh Baja (fy)"
                name="fy"
                value={materialForm.watch('fy')}
                onChange={(value) => materialForm.setValue('fy', value)}
                validation={materialValidation.fy}
                unit="MPa"
                min={200}
                max={800}
              />
              <ValidatedNumberInput
                label="Modulus Elastisitas"
                name="elasticModulus"
                value={materialForm.watch('elasticModulus')}
                onChange={(value) => materialForm.setValue('elasticModulus', value)}
                validation={materialValidation.elasticModulus}
                unit="MPa"
                min={15000}
                max={50000}
                step={1000}
              />
              <ValidatedNumberInput
                label="Rasio Poisson"
                name="poissonRatio"
                value={materialForm.watch('poissonRatio')}
                onChange={(value) => materialForm.setValue('poissonRatio', value)}
                validation={materialValidation.poissonRatio}
                min={0.1}
                max={0.5}
                step={0.05}
              />
            </div>
          </div>
        )}

        {/* Seismic Tab */}
        {activeTab === 'seismic' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Parameter Seismik</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Kategori Desain Seismik</label>
                <select
                  value={seismicForm.watch('designCategory')}
                  onChange={(e) => seismicForm.setValue('designCategory', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={disabled}
                >
                  {['A', 'B', 'C', 'D', 'E', 'F'].map(cat => (
                    <option key={cat} value={cat}>Kategori {cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Kelas Situs</label>
                <select
                  value={seismicForm.watch('siteClass')}
                  onChange={(e) => seismicForm.setValue('siteClass', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={disabled}
                >
                  {['A', 'B', 'C', 'D', 'E', 'F'].map(cls => (
                    <option key={cls} value={cls}>Kelas {cls}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Options Tab */}
        {activeTab === 'options' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Opsi Analisis</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Analisis</label>
                <select
                  value={optionsForm.watch('analysisType')}
                  onChange={(e) => optionsForm.setValue('analysisType', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={disabled}
                >
                  <option value="static">Analisis Statis</option>
                  <option value="modal">Analisis Modal</option>
                  <option value="response-spectrum">Spektrum Respons</option>
                  <option value="time-history">Riwayat Waktu</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={optionsForm.watch('includeNonlinear')}
                    onChange={(e) => optionsForm.setValue('includeNonlinear', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                    disabled={disabled}
                  />
                  <label className="ml-2 text-sm text-gray-700">Analisis Nonlinear</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={optionsForm.watch('includeSecondOrder')}
                    onChange={(e) => optionsForm.setValue('includeSecondOrder', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                    disabled={disabled}
                  />
                  <label className="ml-2 text-sm text-gray-700">Efek Orde Kedua</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {isFormValid() ? (
            <span className="text-green-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Semua data valid
            </span>
          ) : (
            <span className="text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {totalErrors} error perlu diperbaiki
            </span>
          )}
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={disabled || loading || !isFormValid()}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            disabled || loading || !isFormValid()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menganalisis...
            </span>
          ) : (
            'Analisis Struktur'
          )}
        </button>
      </div>
    </div>
  );
};

export default EnhancedInputForm;