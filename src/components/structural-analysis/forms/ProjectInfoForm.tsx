import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { ProjectInfo } from '../interfaces';

interface ProjectInfoFormProps {
  data: ProjectInfo;
  onChange: (data: ProjectInfo) => void;
  errors?: string[];
}

export const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({ data, onChange, errors = [] }) => {
  const handleInputChange = (field: keyof ProjectInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const buildingFunctions = [
    { value: 'residential', label: 'Hunian' },
    { value: 'office', label: 'Perkantoran' },
    { value: 'warehouse', label: 'Gudang' },
    { value: 'commercial', label: 'Komersial' },
    { value: 'industrial', label: 'Industri' },
    { value: 'educational', label: 'Pendidikan' },
    { value: 'healthcare', label: 'Kesehatan' },
    { value: 'religious', label: 'Ibadah' }
  ];

  const riskCategories = [
    { value: 'I', label: 'Kategori I - Risiko Rendah' },
    { value: 'II', label: 'Kategori II - Risiko Standar' },
    { value: 'III', label: 'Kategori III - Risiko Tinggi' },
    { value: 'IV', label: 'Kategori IV - Risiko Sangat Tinggi' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Proyek</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Nama Proyek *</Label>
            <Input
              id="projectName"
              value={data.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
              placeholder="Masukkan nama proyek"
              className={errors.some(e => e.includes('Nama proyek')) ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi Proyek *</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
              placeholder="Kota, Provinsi"
              className={errors.some(e => e.includes('Lokasi')) ? 'border-red-500' : ''}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buildingFunction">Fungsi Bangunan *</Label>
            <Select value={data.buildingFunction} onValueChange={(value: string) => handleInputChange('buildingFunction', value)}>
              <SelectTrigger className={errors.some(e => e.includes('Fungsi bangunan')) ? 'border-red-500' : ''}>
                <SelectValue placeholder="Pilih fungsi bangunan" />
              </SelectTrigger>
              <SelectContent>
                {buildingFunctions.map((func) => (
                  <SelectItem key={func.value} value={func.value}>
                    {func.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskCategory">Kategori Risiko *</Label>
            <Select value={data.riskCategory} onValueChange={(value: string) => handleInputChange('riskCategory', value)}>
              <SelectTrigger className={errors.some(e => e.includes('Kategori risiko')) ? 'border-red-500' : ''}>
                <SelectValue placeholder="Pilih kategori risiko" />
              </SelectTrigger>
              <SelectContent>
                {riskCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi Proyek</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
            placeholder="Deskripsi singkat tentang proyek (opsional)"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="owner">Pemilik Proyek</Label>
            <Input
              id="owner"
              value={data.owner || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('owner', e.target.value)}
              placeholder="Nama pemilik"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="engineer">Engineer</Label>
            <Input
              id="engineer"
              value={data.engineer || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('engineer', e.target.value)}
              placeholder="Nama engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectCode">Kode Proyek</Label>
            <Input
              id="projectCode"
              value={data.projectCode || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('projectCode', e.target.value)}
              placeholder="Kode/referensi proyek"
            />
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">Kesalahan Input:</h4>
            <ul className="list-disc list-inside text-sm text-red-700">
              {errors.filter(e => e.includes('Proyek')).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};