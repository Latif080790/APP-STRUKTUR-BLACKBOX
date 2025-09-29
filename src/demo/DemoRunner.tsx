import React from 'react';
import { StructuralAnalysisSystem } from '../structural-analysis';

/**
 * Demo Runner
 * Simple component to demonstrate the structural analysis system
 */
export const DemoRunner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Structural Analysis System Demo
          </h1>
          <p className="mt-2 text-gray-600">
            Design, visualize, and analyze building structures
          </p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <StructuralAnalysisSystem />
        </div>
      </main>
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            Structural Analysis System - Demo Version
          </p>
        </div>
      </footer>
    </div>
  );
};