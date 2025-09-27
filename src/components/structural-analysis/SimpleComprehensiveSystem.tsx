/**
 * Simplified Comprehensive Structural System
 * Working version with basic module navigation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calculator, 
  Home, 
  FileText, 
  BarChart, 
  Settings,
  Layers,
  Target
} from 'lucide-react';

const SimpleComprehensiveSystem = () => {
  const [activeModule, setActiveModule] = useState('overview');

  const modules = [
    {
      id: 'overview',
      name: 'System Overview',
      description: 'Comprehensive system dashboard',
      icon: Target,
      status: 'active'
    },
    {
      id: 'structural',
      name: 'Structural Analysis',
      description: 'Complete structural analysis system',
      icon: Calculator,
      status: 'good'
    },
    {
      id: 'design',
      name: 'Design Module',
      description: 'Advanced design with manual input capabilities',
      icon: Settings,
      status: 'excellent'
    },
    {
      id: 'foundation',
      name: 'Foundation Design',
      description: 'Comprehensive foundation analysis and design',
      icon: Home,
      status: 'good'
    },
    {
      id: 'drawing',
      name: 'Technical Drawings',
      description: 'Professional CAD-style construction drawings',
      icon: FileText,
      status: 'good'
    },
    {
      id: 'evaluation',
      name: 'System Evaluation',
      description: 'Performance metrics and AI-powered optimization',
      icon: BarChart,
      status: 'excellent'
    },
    {
      id: 'materials',
      name: 'Material Properties',
      description: 'Enhanced material properties with validation',
      icon: Layers,
      status: 'excellent'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'active': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Comprehensive Structural Analysis System
              </h1>
              <p className="text-gray-600 mt-1">
                Advanced professional structural engineering platform
              </p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              System Operational
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeModule} onValueChange={setActiveModule}>
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-7 mb-6">
            {modules.map((module) => (
              <TabsTrigger 
                key={module.id} 
                value={module.id}
                className="flex items-center space-x-1"
              >
                <module.icon className="h-4 w-4" />
                <span className="hidden md:inline">{module.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.filter(m => m.id !== 'overview').map((module) => (
                <Card key={module.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <module.icon className="h-8 w-8 text-blue-600" />
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(module.status)}`} />
                    </div>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                    <Button 
                      onClick={() => setActiveModule(module.id)}
                      className="w-full"
                      variant="outline"
                    >
                      Open Module
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Individual Module Tabs */}
          {modules.filter(m => m.id !== 'overview').map((module) => (
            <TabsContent key={module.id} value={module.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <module.icon className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle>{module.name}</CardTitle>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <module.icon className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                    <h3 className="text-lg font-medium text-blue-900 mb-2">
                      {module.name} Module
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Advanced {module.name.toLowerCase()} functionality is available here.
                      This module provides comprehensive tools for professional structural engineering.
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
                      <span className="text-sm text-blue-600 capitalize">{module.status} Status</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SimpleComprehensiveSystem;