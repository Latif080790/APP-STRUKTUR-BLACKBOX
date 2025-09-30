/**
 * Educational Portal
 * Main educational interface for students and professors
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Calendar,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import TutorialGuide from './TutorialGuide';
import StructuralTheory from './StructuralTheory';
import ExampleProblems from './ExampleProblems';

const EducationalPortal: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'tutorial' | 'theory' | 'examples' | 'assignments' | 'resources'>('tutorial');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'tutorial', label: 'Tutorial Guide', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'theory', label: 'Structural Theory', icon: <FileText className="h-5 w-5" /> },
    { id: 'examples', label: 'Example Problems', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="h-5 w-5" /> },
    { id: 'resources', label: 'Resources', icon: <Settings className="h-5 w-5" /> }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'tutorial':
        return <TutorialGuide />;
      case 'theory':
        return <StructuralTheory />;
      case 'examples':
        return <ExampleProblems />;
      case 'assignments':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Assignments Portal</h3>
                <p className="mt-2 text-gray-500">
                  Access course assignments and submit your work
                </p>
                <div className="mt-6">
                  <Button>
                    View Assignments
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'resources':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Educational Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-10 w-10 mx-auto text-blue-500" />
                    <h3 className="font-semibold mt-4">Textbooks</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Recommended textbooks and reference materials
                    </p>
                    <Button variant="outline" className="mt-4" size="sm">
                      Browse
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-10 w-10 mx-auto text-green-500" />
                    <h3 className="font-semibold mt-4">Discussion Forum</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Connect with peers and instructors
                    </p>
                    <Button variant="outline" className="mt-4" size="sm">
                      Join Forum
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <HelpCircle className="h-10 w-10 mx-auto text-purple-500" />
                    <h3 className="font-semibold mt-4">Help Center</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Get help with using the software
                    </p>
                    <Button variant="outline" className="mt-4" size="sm">
                      Get Help
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <TutorialGuide />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Structural Analysis Educational Portal
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="secondary">For Students & Professors</Badge>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Course Calendar
              </Button>
            </div>
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className={`lg:w-64 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Center</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setActiveSection(item.id as any);
                        setIsMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completed Topics</span>
                      <span>3/12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Assignments</span>
                      <span>1/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderActiveSection()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Educational Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Theory Reference</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Video Tutorials</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Practice Problems</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Feedback</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                For Professors
              </h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Course Management</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Grading Tools</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Curriculum Resources</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2025 Structural Analysis Educational Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EducationalPortal;