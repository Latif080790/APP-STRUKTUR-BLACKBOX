/**
 * Demo Page untuk Working Basic Structural Analysis System
 * Menampilkan sistem analisis struktur yang telah berfungsi
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Simple Badge component inline
const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);
import { 
  Building2, 
  Calculator, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Info,
  Star,
  Zap
} from 'lucide-react';

import WorkingBasicStructuralAnalysisSystem from './WorkingBasicStructuralAnalysisSystem';

interface DemoFeature {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'working' | 'demo';
  icon: React.ReactNode;
}

const features: DemoFeature[] = [
  {
    id: 'input',
    title: 'Input System',
    description: 'Form input untuk data proyek, geometri, material, dan beban',
    status: 'completed',
    icon: <Building2 className="w-5 h-5" />
  },
  {
    id: 'analysis',
    title: 'Basic Analysis',
    description: 'Perhitungan analisis struktur sederhana dengan progress tracking',
    status: 'working',
    icon: <Calculator className="w-5 h-5" />
  },
  {
    id: '3d',
    title: '3D Visualization',
    description: 'Visualisasi 3D struktur dengan Three.js interactive viewer',
    status: 'completed',
    icon: <Eye className="w-5 h-5" />
  },
  {
    id: 'error',
    title: 'Error Handling',
    description: 'Advanced error boundaries dengan graceful fallback UI',
    status: 'completed',
    icon: <CheckCircle className="w-5 h-5" />
  }
];

const demoProjects = [
  {
    name: 'Gedung Perkantoran 5 Lantai',
    description: 'Struktur beton bertulang dengan sistem portal',
    geometry: { length: 24, width: 18, floors: 5, baysX: 4, baysY: 3 },
    materials: { fc: 30, fy: 400 },
    loads: { deadLoad: 6.0, liveLoad: 4.0 }
  },
  {
    name: 'Apartemen 3 Lantai',
    description: 'Bangunan hunian dengan struktur sederhana',
    geometry: { length: 15, width: 12, floors: 3, baysX: 3, baysY: 2 },
    materials: { fc: 25, fy: 350 },
    loads: { deadLoad: 5.0, liveLoad: 2.5 }
  },
  {
    name: 'Warehouse 1 Lantai',
    description: 'Gudang industri dengan bentang besar',
    geometry: { length: 30, width: 20, floors: 1, baysX: 6, baysY: 4 },
    materials: { fc: 35, fy: 400 },
    loads: { deadLoad: 4.0, liveLoad: 8.0 }
  }
];

export const DemoPage = () => {
  const [activeDemo, setActiveDemo] = useState<'overview' | 'system'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'working':
        return 'bg-blue-500';
      case 'demo':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'working':
        return <Zap className="w-4 h-4" />;
      case 'demo':
        return <Star className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (activeDemo === 'system') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Working System Demo</h1>
            <p className="text-gray-600">Sistem analisis struktur yang telah berfungsi</p>
          </div>
          <Button onClick={() => setActiveDemo('overview')} variant="outline">
            ← Kembali ke Overview
          </Button>
        </div>
        
        <WorkingBasicStructuralAnalysisSystem />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Demo Sistem Analisis Struktur
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Demonstrasi sistem analisis struktur yang telah dikembangkan dengan fitur-fitur lengkap
          untuk analisis bangunan beton bertulang sesuai standar SNI.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button onClick={() => setActiveDemo('system')} size="lg" className="px-8">
            <Zap className="w-5 h-5 mr-2" />
            Coba Sistem
          </Button>
          <Button variant="outline" size="lg">
            <Info className="w-5 h-5 mr-2" />
            Dokumentasi
          </Button>
        </div>
      </div>

      {/* Status Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Status Pengembangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <Badge 
                    className={`${getStatusColor(feature.status)} text-white flex items-center gap-1`}
                  >
                    {getStatusIcon(feature.status)}
                    {feature.status}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Contoh Proyek Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoProjects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Geometri:</span>
                    <div className="text-gray-600">
                      {project.geometry.length}m × {project.geometry.width}m, {project.geometry.floors} lantai
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Material:</span>
                    <div className="text-gray-600">
                      f'c = {project.materials.fc} MPa, fy = {project.materials.fy} MPa
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Beban:</span>
                    <div className="text-gray-600">
                      DL = {project.loads.deadLoad} kN/m², LL = {project.loads.liveLoad} kN/m²
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => setActiveDemo('system')}
                >
                  Load Project
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Info */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Fitur Utama</TabsTrigger>
          <TabsTrigger value="tech">Teknologi</TabsTrigger>
          <TabsTrigger value="standards">Standar</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Input & Validasi</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Form input terstruktur untuk semua parameter</li>
                    <li>• Validasi real-time sesuai standar SNI</li>
                    <li>• Error handling yang komprehensif</li>
                    <li>• Auto-save dan restore data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Analisis & Perhitungan</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Analisis struktur portal 3D</li>
                    <li>• Perhitungan gaya dalam dan momen</li>
                    <li>• Analisis gempa sesuai SNI 1726:2019</li>
                    <li>• Progress tracking dengan feedback</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Visualisasi</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Visualisasi 3D interaktif dengan Three.js</li>
                    <li>• Tampilan elemen struktur (beam, column)</li>
                    <li>• Kontrol kamera dan zoom</li>
                    <li>• Export gambar dan model</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Output & Laporan</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Hasil analisis dalam format tabular</li>
                    <li>• Grafik dan diagram gaya</li>
                    <li>• Laporan PDF sesuai standar</li>
                    <li>• Export data ke berbagai format</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tech" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Frontend</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• React 18 dengan TypeScript</li>
                    <li>• Vite untuk build dan development</li>
                    <li>• Tailwind CSS untuk styling</li>
                    <li>• Shadcn/ui untuk komponen UI</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Visualisasi</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Three.js untuk rendering 3D</li>
                    <li>• @react-three/fiber untuk React integration</li>
                    <li>• @react-three/drei untuk helpers</li>
                    <li>• Chart.js untuk grafik 2D</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Validasi & Data</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Zod untuk schema validation</li>
                    <li>• React Hook Form untuk form handling</li>
                    <li>• LocalStorage untuk persistence</li>
                    <li>• MongoDB MCP untuk database</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Error Handling</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• React Error Boundaries</li>
                    <li>• Graceful fallback UI</li>
                    <li>• Error reporting dan logging</li>
                    <li>• Recovery mechanisms</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">SNI Gempa</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• SNI 1726:2019 - Tata cara perencanaan ketahanan gempa</li>
                    <li>• Peta hazard gempa Indonesia</li>
                    <li>• Analisis respons spektrum</li>
                    <li>• Kategori desain seismik</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">SNI Beban</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• SNI 1727:2020 - Beban desain minimum</li>
                    <li>• Beban mati dan beban hidup</li>
                    <li>• Beban angin dan beban khusus</li>
                    <li>• Kombinasi pembebanan</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">SNI Beton</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• SNI 2847:2019 - Persyaratan beton struktural</li>
                    <li>• Desain lentur dan geser</li>
                    <li>• Detailing tulangan</li>
                    <li>• Kontrol defleksi</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">SNI Baja</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• SNI 1729:2020 - Spesifikasi untuk bangunan gedung baja struktural</li>
                    <li>• Desain elemen tarik dan tekan</li>
                    <li>• Desain elemen lentur</li>
                    <li>• Sambungan baja</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default DemoPage;