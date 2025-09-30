/**
 * Structural Theory Component
 * Educational component to explain structural analysis theory and concepts
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronDown,
  Calculator,
  Waves,
  Eye
} from 'lucide-react';

interface TheoryTopic {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  category: 'static' | 'dynamic' | 'material' | 'design';
}

const StructuralTheory: React.FC = () => {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<'all' | 'static' | 'dynamic' | 'material' | 'design'>('all');

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const theoryTopics: TheoryTopic[] = [
    {
      id: 'stiffness-method',
      title: 'Stiffness Matrix Method',
      description: 'Fundamental method used for structural analysis',
      category: 'static',
      content: (
        <div className="space-y-3">
          <p>
            The stiffness matrix method (also known as the displacement method or matrix structural analysis) 
            is a systematic approach to analyze structures by relating nodal displacements to applied forces.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Key Equation</h4>
            <p className="font-mono mt-2">[K]&#123;u&#125; = &#123;F&#125;</p>
            <p className="text-sm mt-2">
              Where [K] is the global stiffness matrix, &#123;u&#125; is the displacement vector, and &#123;F&#125; is the force vector.
            </p>
          </div>
          <h4 className="font-semibold">Steps:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Discretize structure into elements and nodes</li>
            <li>Determine element stiffness matrices</li>
            <li>Assemble global stiffness matrix</li>
            <li>Apply boundary conditions</li>
            <li>Solve for displacements</li>
            <li>Calculate element forces and stresses</li>
          </ol>
        </div>
      )
    },
    {
      id: 'modal-analysis',
      title: 'Modal Analysis',
      description: 'Determining natural frequencies and mode shapes',
      category: 'dynamic',
      content: (
        <div className="space-y-3">
          <p>
            Modal analysis determines the natural frequencies and mode shapes of a structure. 
            These properties are fundamental in understanding how a structure will respond to dynamic loads.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800">Eigenvalue Problem</h4>
            <p className="font-mono mt-2">[K]&#123;φ&#125; = ω²[M]&#123;φ&#125;</p>
            <p className="text-sm mt-2">
              Where [K] is the stiffness matrix, [M] is the mass matrix, ω is the circular frequency, 
              and &#123;φ&#125; is the mode shape vector.
            </p>
          </div>
          <h4 className="font-semibold">Applications:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Seismic design - understanding building response</li>
            <li>Wind engineering - evaluating wind-induced vibrations</li>
            <li>Mechanical systems - avoiding resonance</li>
          </ul>
        </div>
      )
    },
    {
      id: 'response-spectrum',
      title: 'Response Spectrum Analysis',
      description: 'Seismic analysis using response spectra',
      category: 'dynamic',
      content: (
        <div className="space-y-3">
          <p>
            Response spectrum analysis is a linear elastic method used to estimate the maximum response 
            of a structure to seismic excitation.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800">Modal Superposition</h4>
            <p className="mt-2">
              The total response is obtained by combining the responses of individual modes:
            </p>
            <p className="font-mono mt-2">Total Response = √(Σ(Responseᵢ)²)</p>
            <p className="text-sm mt-2">
              This is the SRSS (Square Root of Sum of Squares) method for modal combination.
            </p>
          </div>
          <h4 className="font-semibold">Process:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Perform modal analysis to obtain modes</li>
            <li>Apply response spectrum to each mode</li>
            <li>Calculate modal responses</li>
            <li>Combine modal responses</li>
          </ol>
        </div>
      )
    },
    {
      id: 'material-properties',
      title: 'Material Properties',
      description: 'Understanding material behavior in structures',
      category: 'material',
      content: (
        <div className="space-y-3">
          <p>
            Material properties are crucial for accurate structural analysis. 
            Different materials exhibit different behaviors under load.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold">Concrete</h4>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Compressive strength: f'c (MPa)</li>
                <li>Tensile strength: ~0.1f'c (MPa)</li>
                <li>Elastic modulus: ~4700√f'c (MPa)</li>
                <li>Poisson's ratio: ~0.2</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold">Steel</h4>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Yield strength: fy (MPa)</li>
                <li>Ultimate strength: fu (MPa)</li>
                <li>Elastic modulus: ~200,000 MPa</li>
                <li>Poisson's ratio: ~0.3</li>
              </ul>
            </div>
          </div>
          <h4 className="font-semibold">Stress-Strain Relationship:</h4>
          <p>
            Materials follow different stress-strain relationships. Concrete shows nonlinear behavior 
            even at low stresses, while steel exhibits linear elastic behavior up to yield point.
          </p>
        </div>
      )
    },
    {
      id: 'section-properties',
      title: 'Section Properties',
      description: 'Calculating properties of structural cross-sections',
      category: 'design',
      content: (
        <div className="space-y-3">
          <p>
            Section properties determine how structural elements resist loads. 
            These properties are essential for calculating stresses and deflections.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800">Key Properties</h4>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Area (A) - resistance to axial loads</li>
              <li>Moment of Inertia (I) - resistance to bending</li>
              <li>Section Modulus (S) - maximum bending stress calculation</li>
              <li>Polar Moment (J) - resistance to torsion</li>
            </ul>
          </div>
          <h4 className="font-semibold">Rectangular Section:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Width (b) × Height (h)</p>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Area: A = b × h</li>
                <li>Iₓ = b × h³ / 12</li>
                <li>Iᵧ = h × b³ / 12</li>
                <li>Sₓ = b × h² / 6</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Example Calculation</p>
              <p className="text-sm mt-2">
                For a 300mm × 500mm beam:<br />
                A = 0.3 × 0.5 = 0.15 m²<br />
                Iₓ = 0.3 × 0.5³ / 12 = 0.003125 m⁴
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredTopics = activeCategory === 'all' 
    ? theoryTopics 
    : theoryTopics.filter(topic => topic.category === activeCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'static': return 'bg-blue-100 text-blue-800';
      case 'dynamic': return 'bg-purple-100 text-purple-800';
      case 'material': return 'bg-green-100 text-green-800';
      case 'design': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'static': return 'Static Analysis';
      case 'dynamic': return 'Dynamic Analysis';
      case 'material': return 'Material Properties';
      case 'design': return 'Design Principles';
      default: return 'General';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Structural Analysis Theory
          </CardTitle>
          <Badge variant="secondary">Educational Resource</Badge>
        </div>
        <p className="text-sm text-gray-600">
          Learn the fundamental theory behind structural analysis methods
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All Topics
            </Button>
            <Button
              variant={activeCategory === 'static' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('static')}
            >
              Static Analysis
            </Button>
            <Button
              variant={activeCategory === 'dynamic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('dynamic')}
            >
              Dynamic Analysis
            </Button>
            <Button
              variant={activeCategory === 'material' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('material')}
            >
              Materials
            </Button>
            <Button
              variant={activeCategory === 'design' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('design')}
            >
              Design
            </Button>
          </div>

          {/* Theory Topics */}
          <div className="space-y-4">
            {filteredTopics.map((topic) => (
              <Card key={topic.id} className="border-2">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleTopic(topic.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {expandedTopics[topic.id] ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                        {topic.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                    </div>
                    <Badge className={getCategoryColor(topic.category)}>
                      {getCategoryLabel(topic.category)}
                    </Badge>
                  </div>
                </CardHeader>
                {expandedTopics[topic.id] && (
                  <CardContent className="pt-0">
                    <div className="pl-7 pr-4 pb-4">
                      {topic.content}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Educational Notes */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">Educational Notes for Professors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Teaching Approach</h4>
                  <p className="text-sm text-gray-600">
                    Use this tool to demonstrate theoretical concepts with practical examples. 
                    Start with simple structures and gradually increase complexity.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Student Assignments</h4>
                  <p className="text-sm text-gray-600">
                    Assign students to analyze different structures and compare results. 
                    Have them verify analytical solutions with software results.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StructuralTheory;