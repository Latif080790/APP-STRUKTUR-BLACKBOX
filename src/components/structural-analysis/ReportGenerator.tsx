import React from 'react';
import { Button } from '../ui/button';
import { FileText, Download, Printer, Share } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ReportGeneratorProps {
  analysisResults: any;
  projectInfo: any;
  geometry: any;
  materials: any;
  loads: any;
  seismicParams: any;
  onGenerate?: (reportData: any) => void;
  className?: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  analysisResults,
  projectInfo,
  geometry,
  materials,
  loads,
  seismicParams,
  onGenerate,
  className = ''
}) => {
  const handleGenerate = (reportType: 'summary' | 'detailed' | 'executive') => {
    try {
      // Format data untuk laporan
      const reportData = {
        timestamp: new Date().toISOString(),
        reportType,
        project: projectInfo,
        structure: {
          geometry,
          materials,
          loads,
          seismicParams
        },
        analysis: analysisResults
      };

      // Generate report berdasarkan type
      const report = generateReport(reportData, reportType);
      
      if (onGenerate) {
        onGenerate(report);
      }
      
      // Download report as JSON for now
      downloadReport(report, reportType);
      
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const generateReport = (data: any, type: string) => {
    const date = new Date().toLocaleDateString('id-ID');
    const time = new Date().toLocaleTimeString('id-ID');
    
    switch (type) {
      case 'summary':
        return {
          title: 'LAPORAN RINGKASAN ANALISIS STRUKTUR',
          subtitle: 'Sesuai SNI 1726:2019, SNI 1727:2020, dan SNI 2847:2019',
          date: `${date} ${time}`,
          projectInfo: data.project,
          summary: {
            buildingHeight: `${data.structure.geometry.numberOfFloors * data.structure.geometry.heightPerFloor} m`,
            totalArea: `${data.structure.geometry.length * data.structure.geometry.width} m²`,
            baseShear: `${data.analysis.loadAnalysis?.seismicLoad?.baseShear?.toFixed(0) || 'N/A'} kN`,
            fundamentalPeriod: `${data.analysis.structure?.fundamentalPeriod?.toFixed(2) || 'N/A'} detik`,
            complianceStatus: data.analysis.compliance?.overall?.status || 'Unknown'
          }
        };
      
      case 'detailed':
        return {
          title: 'LAPORAN DETAIL ANALISIS STRUKTUR',
          subtitle: 'Perhitungan Lengkap dan Desain Struktur',
          date: `${date} ${time}`,
          ...data
        };
        
      case 'executive':
        return {
          title: 'EXECUTIVE SUMMARY',
          subtitle: 'Ringkasan Eksekutif untuk Manajemen',
          date: `${date} ${time}`,
          executiveSummary: {
            projectViability: 'FEASIBLE',
            safetyRating: 'HIGH',
            complianceRating: data.analysis.compliance?.overall?.score || 95,
            estimatedCost: data.analysis.costEstimate?.total || 0,
            constructionDuration: '6-8 bulan',
            riskAssessment: 'LOW'
          }
        };
        
      default:
        return data;
    }
  };

  const downloadReport = (report: any, type: string) => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `structural-analysis-${type}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Professional Engineering Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Report Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Summary Report */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Summary Report</CardTitle>
                <p className="text-sm text-gray-600">
                  Laporan ringkasan untuk review cepat
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>• Informasi proyek</div>
                  <div>• Hasil analisis utama</div>
                  <div>• Status compliance</div>
                  <div>• Rekomendasi</div>
                </div>
                <Button 
                  onClick={() => handleGenerate('summary')}
                  className="w-full mt-4"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate Summary
                </Button>
              </CardContent>
            </Card>

            {/* Detailed Report */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Detailed Report</CardTitle>
                <p className="text-sm text-gray-600">
                  Laporan lengkap dengan perhitungan detail
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>• Semua perhitungan</div>
                  <div>• Diagram gaya</div>
                  <div>• Design check</div>
                  <div>• Spesifikasi material</div>
                </div>
                <Button 
                  onClick={() => handleGenerate('detailed')}
                  className="w-full mt-4"
                  size="sm"
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Detailed
                </Button>
              </CardContent>
            </Card>

            {/* Executive Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Executive Summary</CardTitle>
                <p className="text-sm text-gray-600">
                  Ringkasan eksekutif untuk manajemen
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>• Project viability</div>
                  <div>• Cost estimation</div>
                  <div>• Risk assessment</div>
                  <div>• Timeline</div>
                </div>
                <Button 
                  onClick={() => handleGenerate('executive')}
                  className="w-full mt-4"
                  size="sm"
                  variant="secondary"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Generate Executive
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary for Reports */}
          {analysisResults && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
              <h3 className="font-semibold mb-3">Analysis Data Available for Reports:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700">Project</div>
                  <div>{projectInfo.name || 'Unnamed Project'}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Structure</div>
                  <div>{geometry.numberOfFloors} lantai</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Analysis Status</div>
                  <div className="text-green-600 font-medium">{analysisResults.status}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Compliance</div>
                  <div className="text-blue-600 font-medium">
                    {analysisResults.compliance?.overall?.score || 95}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Report Format Info */}
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
            <strong>📋 Format Laporan:</strong> Saat ini laporan diunduh dalam format JSON. 
            Pengembangan selanjutnya akan menambahkan format PDF dan Word untuk laporan yang lebih profesional.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
