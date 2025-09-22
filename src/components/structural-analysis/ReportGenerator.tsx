import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ReportGeneratorProps {
  data: any;
  onGenerate?: (reportData: any) => void;
  className?: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  data,
  onGenerate,
  className = ''
}) => {
  const handleGenerate = () => {
    try {
      // Format data untuk laporan
      const reportData = {
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(data)) // Deep clone
      };

      if (onGenerate) {
        onGenerate(reportData);
      } else {
        // Default behavior: log to console and show alert
        console.log('Generating report with data:', reportData);
        alert('Laporan berhasil dibuat! Lihat di konsol untuk detail.');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Terjadi kesalahan saat membuat laporan.');
    }
  };

  return (
    <Button 
      onClick={handleGenerate}
      className={`flex items-center gap-2 ${className}`}
    >
      <FileText className="h-4 w-4" />
      Generate Laporan
    </Button>
  );
};

export default ReportGenerator;
