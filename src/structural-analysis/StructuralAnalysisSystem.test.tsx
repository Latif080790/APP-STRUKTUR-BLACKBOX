import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StructuralAnalysisSystem } from './StructuralAnalysisSystem';

describe('StructuralAnalysisSystem', () => {
  it('renders without crashing', () => {
    render(<StructuralAnalysisSystem />);
    
    // Check that the main title is rendered
    expect(screen.getByText('Structural Analysis System')).toBeInTheDocument();
  });
});