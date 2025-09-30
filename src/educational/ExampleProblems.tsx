/**
 * Example Problems Component
 * Educational component with pre-built structural analysis examples
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  Play,
  Download,
  FileText,
  Calculator,
  Waves
} from 'lucide-react';
import { Structure3D } from '@/types/structural';
import { sampleStructures } from '../tests/sample-structures';

interface ExampleProblem {
  id: string;
  title: string;
  description: string;
  structure: Structure3D;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: string[];
  solutionNotes: string;
}

const ExampleProblems: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const exampleProblems: ExampleProblem[] = [
    {
      id: 'simple-beam',
      title: 'Simply Supported Beam',
      description: 'A basic beam with uniform load to demonstrate bending and shear concepts',
      structure: sampleStructures.simpleBeam,
      difficulty: 'beginner',
      concepts: ['Bending Moment', 'Shear Force', 'Deflection'],
      solutionNotes: 'The maximum moment occurs at midspan (wL²/8) and maximum shear at supports (wL/2).'
    },
    {
      id: 'portal-frame',
      title: 'Portal Frame',
      description: 'A simple 2D frame to demonstrate frame behavior and joint effects',
      structure: sampleStructures.simplePortal,
      difficulty: 'beginner',
      concepts: ['Frame Analysis', 'Joint Moments', 'Axial Forces'],
      solutionNotes: 'Portal frames develop moments at joints due to continuity. Column moments transfer to beams.'
    },
    {
      id: '3d-frame',
      title: '3D Building Frame',
      description: 'A multi-story 3D frame to demonstrate spatial structural behavior',
      structure: sampleStructures.simple3DFrame,
      difficulty: 'intermediate',
      concepts: ['3D Analysis', 'Torsion', 'Mode Shapes'],
      solutionNotes: '3D frames require consideration of all six degrees of freedom. Torsion effects become important.'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedProblem = exampleProblems.find(p => p.id === selectedExample) || exampleProblems[0];

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Structural Analysis Examples
          </CardTitle>
          <Badge variant="secondary">Educational Problems</Badge>
        </div>
        <p className="text-sm text-gray-600">
          Pre-built examples for learning structural analysis concepts
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Example List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-semibold">Example Problems</h3>
            <div className="space-y-3">
              {exampleProblems.map((problem) => (
                <Card 
                  key={problem.id}
                  className={`cursor-pointer transition-colors ${
                    selectedExample === problem.id ? 'border-2 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedExample(problem.id);
                    setShowSolution(false);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{problem.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{problem.description}</p>
                      </div>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {problem.concepts.slice(0, 3).map((concept, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Example Detail */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedProblem.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Load Problem
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Solution
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{selectedProblem.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Problem Details */}
                  <div>
                    <h4 className="font-semibold mb-2">Problem Description</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium">Structure Details</h5>
                          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                            <li>Nodes: {selectedProblem.structure.nodes.length}</li>
                            <li>Elements: {selectedProblem.structure.elements.length}</li>
                            <li>Materials: {selectedProblem.structure.materials?.length || selectedProblem.structure.elements.filter(e => e.material).length}</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium">Analysis Concepts</h5>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {selectedProblem.concepts.map((concept, index) => (
                              <Badge key={index} variant="secondary">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Solution Section */}
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Solution Approach</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowSolution(!showSolution)}
                      >
                        {showSolution ? 'Hide Solution' : 'Show Solution'}
                      </Button>
                    </div>
                    {showSolution && (
                      <div className="mt-3 bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-800">Key Solution Points</h5>
                        <p className="text-sm text-blue-700 mt-2">
                          {selectedProblem.solutionNotes}
                        </p>
                        <div className="mt-3">
                          <h6 className="font-medium text-blue-800">Analysis Steps:</h6>
                          <ol className="list-decimal list-inside text-sm space-y-1 mt-2 text-blue-700">
                            <li>Define structure geometry and properties</li>
                            <li>Apply boundary conditions and loads</li>
                            <li>Perform structural analysis</li>
                            <li>Check results for reasonableness</li>
                            <li>Verify with analytical solutions</li>
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Educational Objectives */}
                  <div>
                    <h4 className="font-semibold mb-2">Educational Objectives</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h5 className="font-medium mb-2">Learning Outcomes</h5>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Understand structural behavior under load</li>
                            <li>Apply structural analysis methods</li>
                            <li>Interpret analysis results correctly</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h5 className="font-medium mb-2">Professor Notes</h5>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Use this example to demonstrate basic concepts</li>
                            <li>Compare software results with analytical solutions</li>
                            <li>Discuss assumptions and limitations</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Run Static Analysis
                    </Button>
                    <Button variant="outline">
                      <Waves className="h-4 w-4 mr-2" />
                      Run Dynamic Analysis
                    </Button>
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Load in Designer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExampleProblems;