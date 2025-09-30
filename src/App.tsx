import React, { useState } from 'react';
import { DemoRunner } from './demo';
import EducationalPortal from './educational/EducationalPortal';

function App() {
  const [showEducationalPortal, setShowEducationalPortal] = useState(false);

  if (showEducationalPortal) {
    return <EducationalPortal />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Structural Analysis System
          </h1>
          <button
            onClick={() => setShowEducationalPortal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Educational Portal
          </button>
        </div>
      </header>
      <main>
        <DemoRunner />
      </main>
    </div>
  );
}

export default App;