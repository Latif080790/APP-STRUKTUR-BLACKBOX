/**
 * Calculation Parameters Panel Component
 * Panel untuk pengaturan parameter kalkulasi seperti di contoh dashboard
 */

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy,
  Play,
  Settings,
  Folder,
  FileText,
  Database
} from 'lucide-react';

interface ParametersSectionProps {
  title: string;
  children: React.ReactNode;
}

const ParametersSection: React.FC<ParametersSectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const SelectInput: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <span className="text-gray-900">{value}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NumberInput: React.FC<{
  label: string;
  value: string;
  unit?: string;
  onChange: (value: string) => void;
}> = ({ label, value, unit, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {unit && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {unit}
        </span>
      )}
    </div>
  </div>
);

const CheckboxInput: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div className="flex items-center mb-3">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <label className="ml-2 text-sm text-gray-700">{label}</label>
  </div>
);

const FileItem: React.FC<{
  name: string;
  size: string;
  icon: React.ReactNode;
  color: string;
}> = ({ name, size, icon, color }) => (
  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-900">{name}</div>
      <div className="text-xs text-gray-500">{size}</div>
    </div>
  </div>
);

export const CalculationParametersPanel: React.FC = () => {
  const [materialProperties, setMaterialProperties] = useState({
    youngModulus: 'Young Modulus',
    poissonRatio: 'Yield Strength'
  });
  
  const [goalRefine, setGoalRefine] = useState({
    value1: 'nodisso last',
    value2: 'positive lob'
  });
  
  const [boundaryConditions, setBoundaryConditions] = useState({
    pierceRespose: '854.933.job'
  });
  
  const [appliedLoads, setAppliedLoads] = useState({
    fixed: false
  });

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Calculation Parameters */}
      <ParametersSection title="Parameter Kalkulasi">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Properti Material</h4>
            <SelectInput
              label=""
              value={materialProperties.youngModulus}
              options={['Young Modulus', 'Elastic Modulus', 'Shear Modulus']}
              onChange={(value) => setMaterialProperties({...materialProperties, youngModulus: value})}
            />
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Rasio Poisson</h4>
            <SelectInput
              label=""
              value={materialProperties.poissonRatio}
              options={['Yield Strength', 'Ultimate Strength', 'Allowable Stress']}
              onChange={(value) => setMaterialProperties({...materialProperties, poissonRatio: value})}
            />
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Goal Refine</h4>
            <NumberInput
              label=""
              value={goalRefine.value1}
              onChange={(value) => setGoalRefine({...goalRefine, value1: value})}
            />
            
            <div className="mt-2">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Might-Well</h4>
              <NumberInput
                label=""
                value={goalRefine.value2}
                onChange={(value) => setGoalRefine({...goalRefine, value2: value})}
              />
            </div>
          </div>
        </div>
      </ParametersSection>

      {/* Boundary Conditions */}
      <ParametersSection title="Kondisi Batas">
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Pierce Response</h4>
          <div className="relative">
            <input
              type="text"
              value={boundaryConditions.pierceRespose}
              onChange={(e) => setBoundaryConditions({...boundaryConditions, pierceRespose: e.target.value})}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded">
              <Copy className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            Kirim File
          </button>
        </div>
      </ParametersSection>

      {/* Applied Loads */}
      <ParametersSection title="Beban Terapan">
        <div className="space-y-4">
          <CheckboxInput
            label="Fixed Load"
            checked={appliedLoads.fixed}
            onChange={(checked) => setAppliedLoads({...appliedLoads, fixed: checked})}
          />
          
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <SelectInput
                label=""
                value="Doamin"
                options={['Domain', 'Point Load', 'Distributed Load']}
                onChange={() => {}}
              />
            </div>
          </div>
          
          {/* File Items */}
          <div className="space-y-2 mt-4">
            <FileItem
              name="Documents"
              size="29 Gb"
              icon={<FileText className="w-4 h-4 text-white" />}
              color="bg-purple-500"
            />
            
            <FileItem
              name="Voller"
              size="34 Gb" 
              icon={<Database className="w-4 h-4 text-white" />}
              color="bg-teal-500"
            />
            
            <FileItem
              name="How what"
              size="8 Gb"
              icon={<Folder className="w-4 h-4 text-white" />}
              color="bg-blue-500"
            />
          </div>
        </div>
        
        {/* Run Analysis Button */}
        <div className="mt-6">
          <button className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
            <Play className="w-4 h-4" />
            <span>Jalankan Analisis</span>
          </button>
        </div>
      </ParametersSection>
    </div>
  );
};