/**
 * Measurement Tools for 3D Viewer
 * Provides distance, angle, and area measurement capabilities
 */

import React, { useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Ruler, 
  Move3D,
  Eye,
  EyeOff,
  Trash2Icon
} from 'lucide-react';

// Types for measurement tools
export type MeasurementMode = 'none' | 'distance' | 'angle' | 'area';
export type MeasurementUnit = 'm' | 'cm' | 'mm';

export interface DistanceMeasurement {
  id: string;
  type: 'distance';
  points: [THREE.Vector3, THREE.Vector3];
  distance: number;
}

export interface AngleMeasurement {
  id: string;
  type: 'angle';
  points: [THREE.Vector3, THREE.Vector3, THREE.Vector3]; // vertex, point1, point2
  angle: number; // in degrees
}

export interface AreaMeasurement {
  id: string;
  type: 'area';
  points: THREE.Vector3[];
  area: number;
}

export type Measurement = DistanceMeasurement | AngleMeasurement | AreaMeasurement;

interface MeasurementToolsProps {
  measurements: Measurement[];
  onMeasurementsChange: (measurements: Measurement[]) => void;
  measurementMode: MeasurementMode;
  onMeasurementModeChange: (mode: MeasurementMode) => void;
  measurementUnit: MeasurementUnit;
  onMeasurementUnitChange: (unit: MeasurementUnit) => void;
  showMeasurements: boolean;
  onShowMeasurementsChange: (show: boolean) => void;
  className?: string;
}

// Helper function to calculate distance between two points
const calculateDistance = (point1: THREE.Vector3, point2: THREE.Vector3): number => {
  return point1.distanceTo(point2);
};

// Helper function to calculate angle between three points (vertex, point1, point2)
const calculateAngle = (vertex: THREE.Vector3, point1: THREE.Vector3, point2: THREE.Vector3): number => {
  const vec1 = new THREE.Vector3().subVectors(point1, vertex);
  const vec2 = new THREE.Vector3().subVectors(point2, vertex);
  
  const angle = vec1.angleTo(vec2);
  return THREE.MathUtils.radToDeg(angle);
};

// Helper function to calculate area of a polygon using shoelace formula
const calculateArea = (points: THREE.Vector3[]): number => {
  if (points.length < 3) return 0;
  
  // For simplicity, we'll assume all points are in the same plane
  // and calculate the area using the cross product method
  let area = 0;
  const origin = points[0];
  
  for (let i = 1; i < points.length - 1; i++) {
    const v1 = new THREE.Vector3().subVectors(points[i], origin);
    const v2 = new THREE.Vector3().subVectors(points[i + 1], origin);
    const cross = new THREE.Vector3().crossVectors(v1, v2);
    area += cross.length() / 2;
  }
  
  return area;
};

// Helper function to format measurement values
const formatMeasurement = (value: number, unit: MeasurementUnit): string => {
  switch (unit) {
    case 'mm':
      return `${(value * 1000).toFixed(1)} mm`;
    case 'cm':
      return `${(value * 100).toFixed(2)} cm`;
    case 'm':
    default:
      return `${value.toFixed(3)} m`;
  }
};

// Main Measurement Tools Component
export const MeasurementTools: React.FC<MeasurementToolsProps> = ({
  measurements,
  onMeasurementsChange,
  measurementMode,
  onMeasurementModeChange,
  measurementUnit,
  onMeasurementUnitChange,
  showMeasurements,
  onShowMeasurementsChange,
  className = ''
}) => {
  const [tempPoints, setTempPoints] = useState<THREE.Vector3[]>([]);
  
  // Handle point selection for measurements
  const handlePointSelect = useCallback((point: THREE.Vector3) => {
    if (measurementMode === 'none') return;
    
    setTempPoints(prev => {
      const newPoints = [...prev, point];
      
      // Check if we have enough points for the current measurement mode
      if (
        (measurementMode === 'distance' && newPoints.length === 2) ||
        (measurementMode === 'angle' && newPoints.length === 3) ||
        (measurementMode === 'area' && newPoints.length >= 3)
      ) {
        // Create measurement
        let newMeasurement: Measurement | null = null;
        
        if (measurementMode === 'distance' && newPoints.length === 2) {
          const distance = calculateDistance(newPoints[0], newPoints[1]);
          newMeasurement = {
            id: `dist-${Date.now()}`,
            type: 'distance',
            points: [newPoints[0], newPoints[1]] as [THREE.Vector3, THREE.Vector3],
            distance
          };
        } else if (measurementMode === 'angle' && newPoints.length === 3) {
          const angle = calculateAngle(newPoints[1], newPoints[0], newPoints[2]);
          newMeasurement = {
            id: `angle-${Date.now()}`,
            type: 'angle',
            points: [newPoints[1], newPoints[0], newPoints[2]] as [THREE.Vector3, THREE.Vector3, THREE.Vector3],
            angle
          };
        } else if (measurementMode === 'area' && newPoints.length >= 3) {
          const area = calculateArea(newPoints);
          newMeasurement = {
            id: `area-${Date.now()}`,
            type: 'area',
            points: newPoints,
            area
          };
        }
        
        if (newMeasurement) {
          onMeasurementsChange([...measurements, newMeasurement]);
        }
        
        // Reset temp points
        return [];
      }
      
      return newPoints;
    });
  }, [measurementMode, measurements, onMeasurementsChange]);
  
  // Clear all measurements
  const clearMeasurements = useCallback(() => {
    onMeasurementsChange([]);
    setTempPoints([]);
  }, [onMeasurementsChange]);
  
  // Remove a specific measurement
  const removeMeasurement = useCallback((id: string) => {
    onMeasurementsChange(measurements.filter(m => m.id !== id));
  }, [measurements, onMeasurementsChange]);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base">
          <Ruler className="h-4 w-4 mr-2" />
          Measurement Tools
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Measurement Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Measurement Type</label>
          <div className="grid grid-cols-4 gap-1">
            <Button
              variant={measurementMode === 'none' ? "default" : "outline"}
              size="sm"
              onClick={() => onMeasurementModeChange('none')}
              className="flex flex-col items-center h-auto py-2"
            >
              <Move3D className="h-4 w-4 mb-1" />
              <span className="text-xs">None</span>
            </Button>
            
            <Button
              variant={measurementMode === 'distance' ? "default" : "outline"}
              size="sm"
              onClick={() => onMeasurementModeChange('distance')}
              className="flex flex-col items-center h-auto py-2"
            >
              <Ruler className="h-4 w-4 mb-1" />
              <span className="text-xs">Distance</span>
            </Button>
            
            <Button
              variant={measurementMode === 'angle' ? "default" : "outline"}
              size="sm"
              onClick={() => onMeasurementModeChange('angle')}
              className="flex flex-col items-center h-auto py-2"
            >
              <Move3D className="h-4 w-4 mb-1" />
              <span className="text-xs">Angle</span>
            </Button>
            
            <Button
              variant={measurementMode === 'area' ? "default" : "outline"}
              size="sm"
              onClick={() => onMeasurementModeChange('area')}
              className="flex flex-col items-center h-auto py-2"
            >
              <Move3D className="h-4 w-4 mb-1" />
              <span className="text-xs">Area</span>
            </Button>
          </div>
        </div>
        
        {/* Unit Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Units</label>
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant={measurementUnit === 'm' ? "default" : "outline"}
              size="sm"
              onClick={() => onMeasurementUnitChange('m')}
            >
              m
            </Button>
            <Button
              variant={measurementUnit === 'cm' ? "default" : "outline"}
              size="sm"
              onClick={() => onMeasurementUnitChange('cm')}
            >
              cm
            </Button>
            <Button
              variant={measurementUnit === 'mm' ? "default" : "outline"}
              size="sm"
              onClick={() => onMeasurementUnitChange('mm')}
            >
              mm
            </Button>
          </div>
        </div>
        
        {/* Visibility Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Show Measurements</label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowMeasurementsChange(!showMeasurements)}
          >
            {showMeasurements ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Clear Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={clearMeasurements}
          className="w-full"
        >
          <Trash2Icon className="h-4 w-4 mr-2" />
          Clear All
        </Button>
        
        {/* Measurements List */}
        {measurements.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Measurements</label>
            <div className="max-h-40 overflow-y-auto">
              {measurements.map(measurement => (
                <div 
                  key={measurement.id} 
                  className="flex items-center justify-between p-2 bg-gray-100 rounded"
                >
                  <div className="text-xs">
                    {measurement.type === 'distance' && (
                      <span>Distance: {formatMeasurement(measurement.distance, measurementUnit)}</span>
                    )}
                    {measurement.type === 'angle' && (
                      <span>Angle: {measurement.angle.toFixed(1)}°</span>
                    )}
                    {measurement.type === 'area' && (
                      <span>Area: {formatMeasurement(measurement.area, measurementUnit)}</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMeasurement(measurement.id)}
                  >
                    <Trash2Icon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeasurementTools;