import { useState, useCallback } from 'react';
import { Node, Element, Structure3D } from '@/types/structural';

interface StructureState extends Structure3D {
  selectedElement: Element | null;
  selectedNode: Node | null;
  showLabels: boolean;
  showStress: boolean;
  viewMode: 'solid' | 'wireframe' | 'both';
}

type StructureAction =
  | { type: 'SET_STRUCTURE'; payload: Structure3D }
  | { type: 'SET_SELECTED_ELEMENT'; payload: Element | null }
  | { type: 'SET_SELECTED_NODE'; payload: Node | null }
  | { type: 'TOGGLE_LABELS' }
  | { type: 'TOGGLE_STRESS' }
  | { type: 'SET_VIEW_MODE'; payload: 'solid' | 'wireframe' | 'both' };

const structureReducer = (state: StructureState, action: StructureAction): StructureState => {
  switch (action.type) {
    case 'SET_STRUCTURE':
      return { ...state, ...action.payload };
    case 'SET_SELECTED_ELEMENT':
      return { ...state, selectedElement: action.payload };
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNode: action.payload };
    case 'TOGGLE_LABELS':
      return { ...state, showLabels: !state.showLabels };
    case 'TOGGLE_STRESS':
      return { ...state, showStress: !state.showStress };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    default:
      return state;
  }
};

export const useStructureState = (initialStructure: Structure3D) => {
  const [state, dispatch] = useState(structureReducer, {
    nodes: initialStructure.nodes || [],
    elements: initialStructure.elements || [],
    selectedElement: null,
    selectedNode: null,
    showLabels: true,
    showStress: false,
    viewMode: 'solid' as const,
  });

  const setStructure = useCallback((structure: Structure3D) => {
    dispatch({ type: 'SET_STRUCTURE', payload: structure });
  }, []);

  const setSelectedElement = useCallback((element: Element | null) => {
    dispatch({ type: 'SET_SELECTED_ELEMENT', payload: element });
  }, []);

  const setSelectedNode = useCallback((node: Node | null) => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: node });
  }, []);

  const toggleLabels = useCallback(() => {
    dispatch({ type: 'TOGGLE_LABELS' });
  }, []);

  const toggleStress = useCallback(() => {
    dispatch({ type: 'TOGGLE_STRESS' });
  }, []);

  const setViewMode = useCallback((mode: 'solid' | 'wireframe' | 'both') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  return {
    ...state,
    setStructure,
    setSelectedElement,
    setSelectedNode,
    toggleLabels,
    toggleStress,
    setViewMode,
  };
};
