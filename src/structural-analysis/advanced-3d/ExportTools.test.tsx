import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ExportTools } from './ExportTools';
import { Structure3D } from '@/types/structural';

describe('ExportTools', () => {
  // Mock the downloadFile function to avoid actual file downloads
  const mockDownloadFile = vi.spyOn(require('./ExportTools'), 'downloadFile').mockImplementation(() => {});
  
  const mockStructure: Structure3D = {
    nodes: [
      { id: 1, x: 0, y: 0, z: 0 },
      { id: 2, x: 5, y: 0, z: 0 },
      { id: 3, x: 0, y: 3, z: 0 }
    ],
    elements: [
      { 
        id: 1, 
        type: 'beam', 
        nodes: [1, 2],
        material: {
          id: 'mat1',
          name: 'Concrete',
          type: 'concrete',
          density: 2400,
          elasticModulus: 30e9
        },
        section: {
          id: 'sec1',
          name: 'Rectangular',
          type: 'rectangular',
          width: 0.3,
          height: 0.5
        }
      },
      { 
        id: 2, 
        type: 'column', 
        nodes: [1, 3],
        material: {
          id: 'mat2',
          name: 'Steel',
          type: 'steel',
          density: 7850,
          elasticModulus: 200e9
        },
        section: {
          id: 'sec2',
          name: 'I-Section',
          type: 'i-section',
          width: 0.2,
          height: 0.4
        }
      }
    ]
  };

  const mockAnalysisResults = {
    displacements: [
      {
        nodeId: 1,
        ux: 0,
        uy: 0,
        uz: 0,
        rx: 0,
        ry: 0,
        rz: 0
      },
      {
        nodeId: 2,
        ux: 0.001,
        uy: -0.005,
        uz: 0,
        rx: 0,
        ry: 0,
        rz: 0
      }
    ],
    forces: [
      {
        elementId: 1,
        nx: 0,
        vy: 0,
        vz: 0,
        tx: 0,
        my: 0,
        mz: -12500
      }
    ],
    isValid: true,
    maxDisplacement: 0.005,
    maxStress: 0.75
  };

  it('renders without crashing when no structure is provided', () => {
    render(<ExportTools structure={null} />);
    
    // Check that the export tools are rendered
    expect(screen.getByText('Export Tools')).toBeInTheDocument();
  });

  it('renders without crashing when structure is provided', () => {
    render(<ExportTools structure={mockStructure} />);
    
    // Check that the export tools are rendered
    expect(screen.getByText('Export Tools')).toBeInTheDocument();
  });

  it('disables export buttons when no data is available', () => {
    render(<ExportTools structure={null} />);
    
    // Check that export buttons are disabled
    expect(screen.getByText('JSON')).toBeDisabled();
    expect(screen.getByText('CSV')).toBeDisabled();
  });

  it('enables export buttons when structure data is available', () => {
    render(<ExportTools structure={mockStructure} />);
    
    // Check that export buttons are enabled
    expect(screen.getByText('JSON')).not.toBeDisabled();
    expect(screen.getByText('CSV')).not.toBeDisabled();
  });

  it('calls export functions when buttons are clicked', () => {
    const onExportStart = vi.fn();
    const onExportComplete = vi.fn();
    const onExportError = vi.fn();
    
    render(
      <ExportTools 
        structure={mockStructure} 
        analysisResults={mockAnalysisResults}
        onExportStart={onExportStart}
        onExportComplete={onExportComplete}
        onExportError={onExportError}
      />
    );
    
    // Click JSON export button
    fireEvent.click(screen.getByText('JSON'));
    expect(onExportStart).toHaveBeenCalled();
    expect(mockDownloadFile).toHaveBeenCalled();
    expect(onExportComplete).toHaveBeenCalled();
    
    // Reset mocks
    onExportStart.mockClear();
    onExportComplete.mockClear();
    mockDownloadFile.mockClear();
    
    // Click CSV export button
    fireEvent.click(screen.getByText('CSV'));
    expect(onExportStart).toHaveBeenCalled();
    expect(mockDownloadFile).toHaveBeenCalled();
    expect(onExportComplete).toHaveBeenCalled();
  });

  it('exports structure data as JSON correctly', () => {
    render(<ExportTools structure={mockStructure} />);
    
    // Click JSON export button
    fireEvent.click(screen.getByText('JSON'));
    
    // Check that downloadFile was called with correct parameters
    expect(mockDownloadFile).toHaveBeenCalledWith(
      expect.stringContaining('"nodes":'),
      'structure.json',
      'application/json'
    );
  });

  it('exports structure data as CSV correctly', () => {
    render(<ExportTools structure={mockStructure} />);
    
    // Click CSV export button
    fireEvent.click(screen.getByText('CSV'));
    
    // Check that downloadFile was called with correct parameters
    expect(mockDownloadFile).toHaveBeenCalledWith(
      expect.stringContaining('Nodes'),
      'structure.csv',
      'text/csv'
    );
  });

  it('exports analysis results as CSV correctly', () => {
    render(<ExportTools structure={mockStructure} analysisResults={mockAnalysisResults} />);
    
    // Click results export button
    fireEvent.click(screen.getByText('Export Results (CSV)'));
    
    // Check that downloadFile was called with correct parameters
    expect(mockDownloadFile).toHaveBeenCalledWith(
      expect.stringContaining('Analysis Results'),
      'analysis_results.csv',
      'text/csv'
    );
  });

  it('exports combined data as JSON correctly', () => {
    render(<ExportTools structure={mockStructure} analysisResults={mockAnalysisResults} />);
    
    // Click combined export button
    fireEvent.click(screen.getByText('Export All (JSON)'));
    
    // Check that downloadFile was called with correct parameters
    expect(mockDownloadFile).toHaveBeenCalledWith(
      expect.stringContaining('"structure":'),
      'structural_analysis_data.json',
      'application/json'
    );
  });
});