// =====================================
// 🚨 SNI-COMPLIANT RESULTS DISPLAY
// Professional Structural Analysis Results
// Zero Error Tolerance Implementation
// =====================================

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  AlertCircle, 
  FileText, 
  Calculator,
  BarChart3,
  ShieldCheck,
  Building2,
  Zap,
  Mountain,
  Download
} from 'lucide-react';

import { ValidationResult } from '../calculations/validation-system';

interface AnalysisResults {
  // Foundation Analysis
  foundation: {
    type: 'shallow' | 'pile' | 'mat';
    capacity: number;
    safetyFactor: number;
    recommendations: string[];
  };
  
  // Seismic Analysis  
  seismic: {
    baseShear: number;
    naturalPeriod: number;
    responseSpectrum: { period: number; acceleration: number }[];
    driftRatio: number;
    isCompliant: boolean;
  };
  
  // Material Analysis
  materials: {
    concreteVolume: number;
    steelWeight: number;
    reinforcementRatio: number;
    cost: {
      concrete: number;
      steel: number;
      total: number;
    };
  };
  
  // Structural Analysis
  structural: {
    maxMoment: number;
    maxShear: number;
    maxDeflection: number;
    utilityRatio: number;
    isAdequate: boolean;
  };
  
  // Code Compliance
  compliance: {
    sni1726: boolean;
    sni2847: boolean;
    sni1727: boolean;
    overallCompliance: boolean;
    violations: string[];
  };
}

interface ResultsDisplayProps {
  results: AnalysisResults | null;
  validation: ValidationResult | null;
  isLoading?: boolean;
  onReset?: () => void;
  onExportReport?: () => void;
}

// COMPLIANCE INDICATOR COMPONENT
const ComplianceIndicator: React.FC<{
  title: string;
  isCompliant: boolean;
  violations?: string[];
}> = ({ title, isCompliant, violations = [] }) => (
  <div className="flex items-center justify-between p-3 border rounded">
    <div className="flex items-center gap-2">
      {isCompliant ? (
        <CheckCircle className="h-5 w-5 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600" />
      )}
      <span className="font-medium">{title}</span>
    </div>
    <Badge variant={isCompliant ? 'success' : 'destructive'}>
      {isCompliant ? 'SESUAI' : 'TIDAK SESUAI'}
    </Badge>
    {violations.length > 0 && (
      <div className="text-xs text-red-600 mt-1">
        {violations.join(', ')}
      </div>
    )}
  </div>
);

// RESULT METRIC COMPONENT
const ResultMetric: React.FC<{
  label: string;
  value: number;
  unit: string;
  limit?: number;
  precision?: number;
  isGood?: (value: number, limit?: number) => boolean;
}> = ({ 
  label, 
  value, 
  unit, 
  limit, 
  precision = 2,
  isGood = (v, l) => !l || v <= l
}) => {
  const status = limit ? (isGood(value, limit) ? 'good' : 'bad') : 'neutral';
  
  return (
    <div className="bg-gray-50 p-3 rounded">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className={`text-lg font-bold ${
        status === 'good' ? 'text-green-600' : 
        status === 'bad' ? 'text-red-600' : 'text-gray-900'
      }`}>
        {value.toFixed(precision)} {unit}
      </div>
      {limit && (
        <div className="text-xs text-gray-500">
          Batas: {limit.toFixed(precision)} {unit}
        </div>
      )}
    </div>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  results, 
  validation,
  isLoading = false,
  onReset, 
  onExportReport 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 animate-spin" />
            Memproses Analisis Struktur...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={75} className="w-full" />
            <p className="text-sm text-gray-600 text-center">
              Menjalankan perhitungan SNI dan validasi keamanan struktur
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // No results state
  if (!results) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Hasil Analisis Struktur</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Belum ada hasil analisis yang tersedia.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Lengkapi data input dan jalankan analisis untuk melihat hasil.
          </p>
          {onReset && (
            <Button onClick={onReset} variant="outline">
              Kembali ke Input
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Calculate overall safety status
  const overallSafety = useMemo(() => {
    if (!results) return 'unknown';
    
    const checks = [
      results.foundation.safetyFactor >= 2.5,
      results.seismic.isCompliant,
      results.structural.isAdequate,
      results.compliance.overallCompliance,
      validation?.isValid !== false
    ];
    
    const passed = checks.filter(Boolean).length;
    const total = checks.length;
    
    if (passed === total) return 'safe';
    if (passed >= total * 0.8) return 'caution';
    return 'unsafe';
  }, [results, validation]);
  
  return (
    <div className="space-y-6">
      {/* Overall Safety Status */}
      <Alert className={`border-l-4 ${
        overallSafety === 'safe' ? 'border-l-green-500 bg-green-50' :
        overallSafety === 'caution' ? 'border-l-yellow-500 bg-yellow-50' :
        'border-l-red-500 bg-red-50'
      }`}>
        <div className="flex items-center gap-2">
          {overallSafety === 'safe' && <ShieldCheck className="h-5 w-5 text-green-600" />}
          {overallSafety === 'caution' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
          {overallSafety === 'unsafe' && <AlertCircle className="h-5 w-5 text-red-600" />}
          <AlertDescription>
            <strong>Status Keamanan Struktur: </strong>
            <span className={`font-bold ${
              overallSafety === 'safe' ? 'text-green-700' :
              overallSafety === 'caution' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {overallSafety === 'safe' ? 'AMAN' :
               overallSafety === 'caution' ? 'PERLU PERHATIAN' :
               'TIDAK AMAN'}
            </span>
            <br />
            <span className="text-sm">
              {overallSafety === 'safe' && 'Struktur memenuhi semua persyaratan SNI dan faktor keamanan.'}
              {overallSafety === 'caution' && 'Struktur sebagian besar aman namun ada beberapa aspek yang perlu diperhatikan.'}
              {overallSafety === 'unsafe' && 'Struktur tidak memenuhi persyaratan keamanan. Review profesional WAJIB.'}
            </span>
          </AlertDescription>
        </div>
      </Alert>
      
      {/* Main Results Display */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Hasil Analisis Struktur
          </CardTitle>
          <div className="flex gap-2">
            {onExportReport && (
              <Button onClick={onExportReport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Laporan
              </Button>
            )}
            {onReset && (
              <Button onClick={onReset} variant="outline" size="sm">
                Kembali ke Input
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">
                <FileText className="h-4 w-4 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="foundation">
                <Mountain className="h-4 w-4 mr-1" />
                Pondasi
              </TabsTrigger>
              <TabsTrigger value="structural">
                <Building2 className="h-4 w-4 mr-1" />
                Struktur
              </TabsTrigger>
              <TabsTrigger value="seismic">
                <Zap className="h-4 w-4 mr-1" />
                Seismik
              </TabsTrigger>
              <TabsTrigger value="compliance">
                <ShieldCheck className="h-4 w-4 mr-1" />
                Kepatuhan
              </TabsTrigger>
            </TabsList>
            
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ResultMetric
                  label="Faktor Keamanan Pondasi"
                  value={results.foundation.safetyFactor}
                  unit=""
                  limit={2.5}
                  isGood={(v, l) => v >= (l || 0)}
                />
                <ResultMetric
                  label="Gaya Geser Dasar"
                  value={results.seismic.baseShear}
                  unit="kN"
                />
                <ResultMetric
                  label="Rasio Utilitas Struktur"
                  value={results.structural.utilityRatio}
                  unit=""
                  limit={0.9}
                  isGood={(v, l) => v <= (l || 1)}
                />
                <ResultMetric
                  label="Drift Ratio"
                  value={results.seismic.driftRatio * 100}
                  unit="%"
                  limit={2.0}
                  isGood={(v, l) => v <= (l || 100)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Ringkasan Perhitungan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium">Material</h5>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Volume Beton: {results.materials.concreteVolume.toFixed(2)} m³</li>
                      <li>• Berat Baja: {results.materials.steelWeight.toFixed(0)} kg</li>
                      <li>• Rasio Tulangan: {(results.materials.reinforcementRatio * 100).toFixed(2)}%</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium">Estimasi Biaya</h5>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Beton: Rp {results.materials.cost.concrete.toLocaleString('id-ID')}</li>
                      <li>• Baja: Rp {results.materials.cost.steel.toLocaleString('id-ID')}</li>
                      <li><strong>• Total: Rp {results.materials.cost.total.toLocaleString('id-ID')}</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* FOUNDATION TAB */}
            <TabsContent value="foundation" className="space-y-4">
              <div className="space-y-4">
                <ComplianceIndicator
                  title={`Sistem Pondasi ${results.foundation.type.toUpperCase()}`}
                  isCompliant={results.foundation.safetyFactor >= 2.5}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <ResultMetric
                    label="Daya Dukung"
                    value={results.foundation.capacity}
                    unit="kN"
                  />
                  <ResultMetric
                    label="Faktor Keamanan"
                    value={results.foundation.safetyFactor}
                    unit=""
                    limit={2.5}
                    isGood={(v, l) => v >= (l || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Rekomendasi:</h4>
                  <ul className="space-y-1">
                    {results.foundation.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            {/* STRUCTURAL TAB */}
            <TabsContent value="structural" className="space-y-4">
              <ComplianceIndicator
                title="Kekuatan Struktur"
                isCompliant={results.structural.isAdequate}
              />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ResultMetric
                  label="Momen Maksimum"
                  value={results.structural.maxMoment}
                  unit="kN·m"
                />
                <ResultMetric
                  label="Gaya Geser Maksimum"
                  value={results.structural.maxShear}
                  unit="kN"
                />
                <ResultMetric
                  label="Defleksi Maksimum"
                  value={results.structural.maxDeflection}
                  unit="mm"
                />
              </div>
              
              <ResultMetric
                label="Rasio Utilitas"
                value={results.structural.utilityRatio}
                unit=""
                limit={0.9}
                precision={3}
                isGood={(v, l) => v <= (l || 1)}
              />
            </TabsContent>
            
            {/* SEISMIC TAB */}
            <TabsContent value="seismic" className="space-y-4">
              <ComplianceIndicator
                title="Ketahanan Gempa (SNI 1726:2019)"
                isCompliant={results.seismic.isCompliant}
              />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ResultMetric
                  label="Periode Natural"
                  value={results.seismic.naturalPeriod}
                  unit="detik"
                />
                <ResultMetric
                  label="Gaya Geser Dasar"
                  value={results.seismic.baseShear}
                  unit="kN"
                />
                <ResultMetric
                  label="Drift Ratio"
                  value={results.seismic.driftRatio * 100}
                  unit="%"
                  limit={2.0}
                  isGood={(v, l) => v <= (l || 100)}
                />
              </div>
            </TabsContent>
            
            {/* COMPLIANCE TAB */}
            <TabsContent value="compliance" className="space-y-4">
              <div className="space-y-3">
                <ComplianceIndicator
                  title="SNI 1726:2019 - Gempa"
                  isCompliant={results.compliance.sni1726}
                />
                <ComplianceIndicator
                  title="SNI 2847:2019 - Beton"
                  isCompliant={results.compliance.sni2847}
                />
                <ComplianceIndicator
                  title="SNI 1727:2020 - Beban"
                  isCompliant={results.compliance.sni1727}
                />
              </div>
              
              <Separator />
              
              <div className={`p-4 rounded border-l-4 ${
                results.compliance.overallCompliance 
                  ? 'border-l-green-500 bg-green-50' 
                  : 'border-l-red-500 bg-red-50'
              }`}>
                <h4 className="font-semibold mb-2">
                  Kepatuhan Keseluruhan: {
                    results.compliance.overallCompliance ? 'SESUAI SNI' : 'TIDAK SESUAI SNI'
                  }
                </h4>
                
                {results.compliance.violations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-2">Pelanggaran:</p>
                    <ul className="space-y-1">
                      {results.compliance.violations.map((violation, index) => (
                        <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          {violation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {results.compliance.overallCompliance && (
                  <p className="text-sm text-green-700">
                    ✓ Semua perhitungan struktur telah sesuai dengan standar SNI yang berlaku.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
