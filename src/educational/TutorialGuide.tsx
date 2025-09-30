/**
 * Tutorial Guide Component
 * Educational component to help students and professors understand how to use the Structural Analysis System
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  Info,
  Calculator,
  Waves,
  Eye
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  icon: React.ReactNode;
}

const TutorialGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'intro',
      title: 'Welcome to Structural Analysis System',
      description: 'Learn how to design and analyze structures',
      content: (
        <div className="space-y-4">
          <p>
            This educational tool helps students and professionals understand structural behavior 
            through interactive analysis and visualization.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Calculator className="h-8 w-8 mx-auto text-blue-500" />
                <h3 className="font-semibold mt-2">Static Analysis</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Analyze structures under static loads
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Waves className="h-8 w-8 mx-auto text-purple-500" />
                <h3 className="font-semibold mt-2">Dynamic Analysis</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Understand structural behavior under dynamic loads
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 mx-auto text-green-500" />
                <h3 className="font-semibold mt-2">3D Visualization</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Visualize structures and analysis results in 3D
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
      icon: <Info className="h-5 w-5" />
    },
    {
      id: 'design',
      title: 'Structural Design Modules',
      description: 'Learn how to design structural elements',
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold">Design Process</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Select the element type (Beam, Column, or Slab)</li>
            <li>Define geometry and support conditions</li>
            <li>Specify material properties</li>
            <li>Apply loads and boundary conditions</li>
            <li>Run analysis to check design</li>
          </ol>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800">Educational Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              Start with simple structures like beams and portal frames before moving to complex 3D structures.
              This helps build understanding of fundamental structural behavior.
            </p>
          </div>
        </div>
      ),
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: 'analysis',
      title: 'Structural Analysis',
      description: 'Understanding analysis results',
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold">Analysis Types</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center">
                <Calculator className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium">Static Analysis</h4>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Calculates displacements, internal forces, and stresses under static loads.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center">
                <Waves className="h-5 w-5 text-purple-500 mr-2" />
                <h4 className="font-medium">Dynamic Analysis</h4>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Determines natural frequencies and mode shapes. Evaluates seismic response.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800">Learning Objective</h4>
            <p className="text-sm text-green-700 mt-1">
              Understand how different loading conditions affect structural behavior and 
              how to interpret analysis results for design decisions.
            </p>
          </div>
        </div>
      ),
      icon: <Calculator className="h-5 w-5" />
    },
    {
      id: 'visualization',
      title: '3D Visualization',
      description: 'Visualizing structures and results',
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold">Visualization Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Interactive 3D structure view</li>
            <li>Element highlighting and selection</li>
            <li>Displacement visualization</li>
            <li>Stress and force display</li>
            <li>Animation of mode shapes</li>
          </ul>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800">Professor Tip</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Use the 3D visualization to demonstrate how structures deform under loads 
              and how different elements contribute to overall structural behavior.
            </p>
          </div>
        </div>
      ),
      icon: <Eye className="h-5 w-5" />
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetTutorial = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Educational Tutorial
          </CardTitle>
          <Badge variant="secondary">For Students & Professors</Badge>
        </div>
        <p className="text-sm text-gray-600">
          Learn how to use the Structural Analysis System for educational purposes
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tutorialSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
                    index === currentStep
                      ? 'bg-blue-500 text-white'
                      : index < currentStep
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {step.icon}
                  {step.title}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>
          </div>

          {/* Current step content */}
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{tutorialSteps[currentStep].title}</h2>
            <p className="text-gray-600 mb-4">{tutorialSteps[currentStep].description}</p>
            <div className="mt-4">
              {tutorialSteps[currentStep].content}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetTutorial}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={currentStep === tutorialSteps.length - 1}
              >
                Next
                <Play className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Additional educational resources */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">Educational Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Theory Reference</h4>
                  <p className="text-sm text-gray-600">
                    Access to structural analysis theory and formulas used in the calculations.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    View Theory
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Example Problems</h4>
                  <p className="text-sm text-gray-600">
                    Pre-built examples for common structural analysis problems.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Load Examples
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorialGuide;