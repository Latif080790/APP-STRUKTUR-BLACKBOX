/**
 * Advanced Technical Drawing System
 * Professional CAD-style technical drawings generation
 */

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  FileText, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Ruler,
  Grid3X3,
  Layers,
  PenTool,
  Share
} from 'lucide-react';

// Drawing Interfaces
interface DrawingElement {
  type: 'line' | 'rectangle' | 'circle' | 'arc' | 'text' | 'dimension' | 'hatch' | 'symbol';
  id: string;
  layer: string;
  coordinates: number[];
  properties: {
    lineWeight?: number;
    lineStyle?: 'solid' | 'dashed' | 'dotted' | 'dashdot';
    color?: string;
    fillColor?: string;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    arrowType?: 'none' | 'arrow' | 'circle' | 'triangle';
  };
}

interface DrawingLayer {
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
  lineWeight: number;
}

interface DrawingSheet {
  id: string;
  name: string;
  size: 'A0' | 'A1' | 'A2' | 'A3' | 'A4';
  orientation: 'portrait' | 'landscape';
  scale: string;
  elements: DrawingElement[];
  titleBlock: {
    projectName: string;
    drawingTitle: string;
    drawingNumber: string;
    revision: string;
    drawnBy: string;
    checkedBy: string;
    approvedBy: string;
    date: string;
    scale: string;
  };
}

interface StructuralElement {
  type: 'beam' | 'column' | 'slab' | 'foundation' | 'wall';
  id: string;
  dimensions: { width: number; height: number; length: number; };
  position: { x: number; y: number; z: number; };
  reinforcement?: {
    main: { diameter: number; count: number; spacing?: number; };
    secondary?: { diameter: number; spacing: number; };
    shear?: { diameter: number; spacing: number; legs?: number; };
  };
  materials: {
    concrete: { grade: string; fc: number; };
    steel: { grade: string; fy: number; };
  };
}

// Paper sizes in mm
const PAPER_SIZES = {
  A0: { width: 841, height: 1189 },
  A1: { width: 594, height: 841 },
  A2: { width: 420, height: 594 },
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 }
};

// Standard layers
const STANDARD_LAYERS: DrawingLayer[] = [
  { name: 'Structure', visible: true, locked: false, color: '#000000', lineWeight: 0.5 },
  { name: 'Reinforcement', visible: true, locked: false, color: '#0066CC', lineWeight: 0.25 },
  { name: 'Dimensions', visible: true, locked: false, color: '#CC0000', lineWeight: 0.18 },
  { name: 'Text', visible: true, locked: false, color: '#000000', lineWeight: 0.18 },
  { name: 'Hatching', visible: true, locked: false, color: '#666666', lineWeight: 0.18 },
  { name: 'Grid', visible: false, locked: true, color: '#CCCCCC', lineWeight: 0.1 }
];

interface TechnicalDrawingSystemProps {
  structuralElements?: StructuralElement[];
  projectInfo?: {
    name: string;
    engineer: string;
    checker: string;
  };
}

const TechnicalDrawingSystem: React.FC<TechnicalDrawingSystemProps> = ({
  structuralElements = [],
  projectInfo
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawings, setDrawings] = useState<DrawingSheet[]>([]);
  const [activeDrawing, setActiveDrawing] = useState(0);
  const [layers, setLayers] = useState<DrawingLayer[]>(STANDARD_LAYERS);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string>('select');

  // Initialize sample drawings
  useEffect(() => {
    const sampleDrawings: DrawingSheet[] = [
      {
        id: '1',
        name: 'Structural Plan',
        size: 'A1',
        orientation: 'landscape',
        scale: '1:100',
        elements: [],
        titleBlock: {
          projectName: projectInfo?.name || 'Structural Analysis Project',
          drawingTitle: 'Structural Plan',
          drawingNumber: 'S-001',
          revision: 'A',
          drawnBy: projectInfo?.engineer || 'Engineer',
          checkedBy: projectInfo?.checker || 'Checker',
          approvedBy: 'Approver',
          date: new Date().toLocaleDateString('id-ID'),
          scale: '1:100'
        }
      },
      {
        id: '2',
        name: 'Foundation Plan',
        size: 'A1',
        orientation: 'landscape',
        scale: '1:50',
        elements: [],
        titleBlock: {
          projectName: projectInfo?.name || 'Structural Analysis Project',
          drawingTitle: 'Foundation Plan',
          drawingNumber: 'S-002',
          revision: 'A',
          drawnBy: projectInfo?.engineer || 'Engineer',
          checkedBy: projectInfo?.checker || 'Checker',
          approvedBy: 'Approver',
          date: new Date().toLocaleDateString('id-ID'),
          scale: '1:50'
        }
      },
      {
        id: '3',
        name: 'Beam Details',
        size: 'A2',
        orientation: 'landscape',
        scale: '1:25',
        elements: [],
        titleBlock: {
          projectName: projectInfo?.name || 'Structural Analysis Project',
          drawingTitle: 'Beam Reinforcement Details',
          drawingNumber: 'S-003',
          revision: 'A',
          drawnBy: projectInfo?.engineer || 'Engineer',
          checkedBy: projectInfo?.checker || 'Checker',
          approvedBy: 'Approver',
          date: new Date().toLocaleDateString('id-ID'),
          scale: '1:25'
        }
      }
    ];

    setDrawings(sampleDrawings);
    
    // Generate drawing elements for structural elements
    if (structuralElements.length > 0) {
      generateStructuralDrawings(structuralElements, sampleDrawings);
    }
  }, [structuralElements, projectInfo]);

  // Generate drawings from structural elements
  const generateStructuralDrawings = (elements: StructuralElement[], sheets: DrawingSheet[]) => {
    const updatedSheets = [...sheets];

    elements.forEach(element => {
      if (element.type === 'beam') {
        generateBeamDrawing(element, updatedSheets[2]); // Beam details sheet
      } else if (element.type === 'foundation') {
        generateFoundationDrawing(element, updatedSheets[1]); // Foundation plan
      }
      // Add structural plan elements
      generateStructuralPlanElement(element, updatedSheets[0]);
    });

    setDrawings(updatedSheets);
  };

  // Generate beam detail drawing
  const generateBeamDrawing = (beam: StructuralElement, sheet: DrawingSheet) => {
    const elements: DrawingElement[] = [];
    const scale = 1/25; // 1:25 scale
    const baseX = 100; // Start position
    const baseY = 200;

    // Draw beam outline - elevation view
    elements.push({
      type: 'rectangle',
      id: `beam-${beam.id}-elevation`,
      layer: 'Structure',
      coordinates: [baseX, baseY, beam.dimensions.length * scale, beam.dimensions.height * scale],
      properties: {
        lineWeight: 0.5,
        lineStyle: 'solid',
        color: '#000000'
      }
    });

    // Draw beam section
    const sectionX = baseX + beam.dimensions.length * scale + 100;
    elements.push({
      type: 'rectangle',
      id: `beam-${beam.id}-section`,
      layer: 'Structure',
      coordinates: [sectionX, baseY, beam.dimensions.width * scale, beam.dimensions.height * scale],
      properties: {
        lineWeight: 0.5,
        lineStyle: 'solid',
        color: '#000000'
      }
    });

    // Add reinforcement if available
    if (beam.reinforcement) {
      // Main reinforcement
      const mainRebar = beam.reinforcement.main;
      const rebarSpacing = (beam.dimensions.width * scale - 2 * 40 * scale) / (mainRebar.count - 1);
      
      for (let i = 0; i < mainRebar.count; i++) {
        const x = sectionX + 40 * scale + i * rebarSpacing;
        const y = baseY + beam.dimensions.height * scale - 40 * scale;
        
        elements.push({
          type: 'circle',
          id: `beam-${beam.id}-rebar-${i}`,
          layer: 'Reinforcement',
          coordinates: [x, y, mainRebar.diameter * scale / 2],
          properties: {
            lineWeight: 0.25,
            lineStyle: 'solid',
            color: '#0066CC',
            fillColor: '#0066CC'
          }
        });
      }

      // Stirrups
      if (beam.reinforcement.shear) {
        const stirrupCount = Math.floor(beam.dimensions.length / beam.reinforcement.shear.spacing);
        const stirrupSpacing = (beam.dimensions.length * scale) / stirrupCount;
        
        for (let i = 1; i < stirrupCount; i++) {
          const x = baseX + i * stirrupSpacing;
          elements.push({
            type: 'line',
            id: `beam-${beam.id}-stirrup-${i}`,
            layer: 'Reinforcement',
            coordinates: [x, baseY, x, baseY + beam.dimensions.height * scale],
            properties: {
              lineWeight: 0.25,
              lineStyle: 'dashed',
              color: '#0066CC'
            }
          });
        }
      }
    }

    // Add dimensions
    elements.push({
      type: 'dimension',
      id: `beam-${beam.id}-length-dim`,
      layer: 'Dimensions',
      coordinates: [baseX, baseY - 30, baseX + beam.dimensions.length * scale, baseY - 30],
      properties: {
        lineWeight: 0.18,
        color: '#CC0000',
        text: `${beam.dimensions.length}`,
        fontSize: 2.5,
        arrowType: 'arrow'
      }
    });

    elements.push({
      type: 'dimension',
      id: `beam-${beam.id}-height-dim`,
      layer: 'Dimensions',
      coordinates: [baseX - 30, baseY, baseX - 30, baseY + beam.dimensions.height * scale],
      properties: {
        lineWeight: 0.18,
        color: '#CC0000',
        text: `${beam.dimensions.height}`,
        fontSize: 2.5,
        arrowType: 'arrow'
      }
    });

    // Add title and specifications
    elements.push({
      type: 'text',
      id: `beam-${beam.id}-title`,
      layer: 'Text',
      coordinates: [baseX, baseY - 60],
      properties: {
        text: `BEAM B${beam.id} - ${beam.dimensions.width}x${beam.dimensions.height}`,
        fontSize: 4,
        fontFamily: 'Arial',
        color: '#000000'
      }
    });

    if (beam.reinforcement) {
      elements.push({
        type: 'text',
        id: `beam-${beam.id}-reinforcement`,
        layer: 'Text',
        coordinates: [baseX, baseY + beam.dimensions.height * scale + 30],
        properties: {
          text: `Main: ${beam.reinforcement.main.count}D${beam.reinforcement.main.diameter}`,
          fontSize: 2.5,
          fontFamily: 'Arial',
          color: '#000000'
        }
      });
    }

    sheet.elements.push(...elements);
  };

  // Generate foundation drawing
  const generateFoundationDrawing = (foundation: StructuralElement, sheet: DrawingSheet) => {
    const elements: DrawingElement[] = [];
    const scale = 1/50; // 1:50 scale
    const baseX = foundation.position.x * scale + 200;
    const baseY = foundation.position.y * scale + 200;

    // Draw foundation outline
    elements.push({
      type: 'rectangle',
      id: `foundation-${foundation.id}`,
      layer: 'Structure',
      coordinates: [baseX, baseY, foundation.dimensions.width * scale, foundation.dimensions.length * scale],
      properties: {
        lineWeight: 0.5,
        lineStyle: 'solid',
        color: '#000000',
        fillColor: 'rgba(0,0,0,0.1)'
      }
    });

    // Add reinforcement grid if available
    if (foundation.reinforcement) {
      const spacing = foundation.reinforcement.main.spacing || 200;
      const gridLines = Math.floor(foundation.dimensions.width / spacing);
      
      // Vertical grid lines
      for (let i = 1; i < gridLines; i++) {
        const x = baseX + (i * spacing * scale);
        elements.push({
          type: 'line',
          id: `foundation-${foundation.id}-grid-v-${i}`,
          layer: 'Reinforcement',
          coordinates: [x, baseY, x, baseY + foundation.dimensions.length * scale],
          properties: {
            lineWeight: 0.18,
            lineStyle: 'dotted',
            color: '#0066CC'
          }
        });
      }

      // Horizontal grid lines
      const hGridLines = Math.floor(foundation.dimensions.length / spacing);
      for (let i = 1; i < hGridLines; i++) {
        const y = baseY + (i * spacing * scale);
        elements.push({
          type: 'line',
          id: `foundation-${foundation.id}-grid-h-${i}`,
          layer: 'Reinforcement',
          coordinates: [baseX, y, baseX + foundation.dimensions.width * scale, y],
          properties: {
            lineWeight: 0.18,
            lineStyle: 'dotted',
            color: '#0066CC'
          }
        });
      }
    }

    // Add foundation label
    elements.push({
      type: 'text',
      id: `foundation-${foundation.id}-label`,
      layer: 'Text',
      coordinates: [baseX + foundation.dimensions.width * scale / 2, baseY + foundation.dimensions.length * scale / 2],
      properties: {
        text: `F${foundation.id}`,
        fontSize: 3,
        fontFamily: 'Arial',
        color: '#000000'
      }
    });

    sheet.elements.push(...elements);
  };

  // Generate structural plan element
  const generateStructuralPlanElement = (element: StructuralElement, sheet: DrawingSheet) => {
    const elements: DrawingElement[] = [];
    const scale = 1/100; // 1:100 scale
    const baseX = element.position.x * scale + 100;
    const baseY = element.position.y * scale + 100;

    if (element.type === 'beam') {
      // Draw beam as a line with width indication
      elements.push({
        type: 'rectangle',
        id: `plan-beam-${element.id}`,
        layer: 'Structure',
        coordinates: [baseX, baseY, element.dimensions.length * scale, element.dimensions.width * scale],
        properties: {
          lineWeight: 0.3,
          lineStyle: 'solid',
          color: '#000000'
        }
      });

      elements.push({
        type: 'text',
        id: `plan-beam-${element.id}-label`,
        layer: 'Text',
        coordinates: [baseX, baseY - 10],
        properties: {
          text: `B${element.id}`,
          fontSize: 2,
          fontFamily: 'Arial',
          color: '#000000'
        }
      });
    } else if (element.type === 'column') {
      // Draw column as a square
      elements.push({
        type: 'rectangle',
        id: `plan-column-${element.id}`,
        layer: 'Structure',
        coordinates: [baseX, baseY, element.dimensions.width * scale, element.dimensions.width * scale],
        properties: {
          lineWeight: 0.5,
          lineStyle: 'solid',
          color: '#000000',
          fillColor: 'rgba(0,0,0,0.2)'
        }
      });

      elements.push({
        type: 'text',
        id: `plan-column-${element.id}-label`,
        layer: 'Text',
        coordinates: [baseX + element.dimensions.width * scale / 2, baseY + element.dimensions.width * scale / 2],
        properties: {
          text: `C${element.id}`,
          fontSize: 1.5,
          fontFamily: 'Arial',
          color: '#000000'
        }
      });
    }

    sheet.elements.push(...elements);
  };

  // Canvas drawing functions
  useEffect(() => {
    drawCanvas();
  }, [activeDrawing, zoom, pan, showGrid, layers]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || drawings.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawing = drawings[activeDrawing];
    const paperSize = PAPER_SIZES[drawing.size];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up transformation
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw paper background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, paperSize.width * 2, paperSize.height * 2); // Scale up for better visibility
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, paperSize.width * 2, paperSize.height * 2);

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, paperSize.width * 2, paperSize.height * 2);
    }

    // Draw title block
    drawTitleBlock(ctx, drawing, paperSize);

    // Draw elements
    drawing.elements.forEach(element => {
      const layer = layers.find(l => l.name === element.layer);
      if (!layer || !layer.visible) return;

      drawElement(ctx, element, layer);
    });

    ctx.restore();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridLayer = layers.find(l => l.name === 'Grid');
    if (!gridLayer) return;

    ctx.strokeStyle = gridLayer.color;
    ctx.lineWidth = gridLayer.lineWeight;
    ctx.setLineDash([2, 2]);

    const spacing = 20; // 10mm grid at 1:1 scale

    // Vertical lines
    for (let x = 0; x <= width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  };

  const drawTitleBlock = (ctx: CanvasRenderingContext2D, drawing: DrawingSheet, paperSize: { width: number; height: number }) => {
    const scale = 2; // Scale factor for display
    const blockWidth = 200 * scale;
    const blockHeight = 80 * scale;
    const x = paperSize.width * scale - blockWidth - 20;
    const y = paperSize.height * scale - blockHeight - 20;

    // Draw title block border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, blockWidth, blockHeight);

    // Draw internal lines
    ctx.beginPath();
    ctx.moveTo(x, y + 20 * scale);
    ctx.lineTo(x + blockWidth, y + 20 * scale);
    ctx.moveTo(x, y + 40 * scale);
    ctx.lineTo(x + blockWidth, y + 40 * scale);
    ctx.moveTo(x + blockWidth / 2, y + 20 * scale);
    ctx.lineTo(x + blockWidth / 2, y + blockHeight);
    ctx.stroke();

    // Add text
    ctx.fillStyle = '#000000';
    ctx.font = `${8 * scale}px Arial`;
    ctx.textAlign = 'center';

    ctx.fillText(drawing.titleBlock.projectName, x + blockWidth / 2, y + 12 * scale);
    ctx.fillText(drawing.titleBlock.drawingTitle, x + blockWidth / 2, y + 32 * scale);
    
    ctx.font = `${6 * scale}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(`Drawn: ${drawing.titleBlock.drawnBy}`, x + 5, y + 50 * scale);
    ctx.fillText(`Date: ${drawing.titleBlock.date}`, x + 5, y + 62 * scale);
    ctx.fillText(`Scale: ${drawing.titleBlock.scale}`, x + 5, y + 74 * scale);
    
    ctx.textAlign = 'right';
    ctx.fillText(`Dwg: ${drawing.titleBlock.drawingNumber}`, x + blockWidth - 5, y + 50 * scale);
    ctx.fillText(`Rev: ${drawing.titleBlock.revision}`, x + blockWidth - 5, y + 62 * scale);
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawingElement, layer: DrawingLayer) => {
    ctx.strokeStyle = element.properties.color || layer.color;
    ctx.lineWidth = element.properties.lineWeight || layer.lineWeight;

    // Set line style
    switch (element.properties.lineStyle) {
      case 'dashed':
        ctx.setLineDash([5, 5]);
        break;
      case 'dotted':
        ctx.setLineDash([1, 3]);
        break;
      case 'dashdot':
        ctx.setLineDash([5, 3, 1, 3]);
        break;
      default:
        ctx.setLineDash([]);
    }

    switch (element.type) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(element.coordinates[0], element.coordinates[1]);
        ctx.lineTo(element.coordinates[2], element.coordinates[3]);
        ctx.stroke();
        break;

      case 'rectangle':
        if (element.properties.fillColor) {
          ctx.fillStyle = element.properties.fillColor;
          ctx.fillRect(element.coordinates[0], element.coordinates[1], element.coordinates[2], element.coordinates[3]);
        }
        ctx.strokeRect(element.coordinates[0], element.coordinates[1], element.coordinates[2], element.coordinates[3]);
        break;

      case 'circle':
        ctx.beginPath();
        ctx.arc(element.coordinates[0], element.coordinates[1], element.coordinates[2], 0, 2 * Math.PI);
        if (element.properties.fillColor) {
          ctx.fillStyle = element.properties.fillColor;
          ctx.fill();
        }
        ctx.stroke();
        break;

      case 'text':
        ctx.fillStyle = element.properties.color || '#000000';
        ctx.font = `${element.properties.fontSize || 3}px ${element.properties.fontFamily || 'Arial'}`;
        ctx.textAlign = 'left';
        ctx.fillText(element.properties.text || '', element.coordinates[0], element.coordinates[1]);
        break;

      case 'dimension':
        // Draw dimension line and arrows
        const x1 = element.coordinates[0];
        const y1 = element.coordinates[1];
        const x2 = element.coordinates[2];
        const y2 = element.coordinates[3];
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw arrows
        if (element.properties.arrowType === 'arrow') {
          drawArrow(ctx, x1, y1, x2, y2);
          drawArrow(ctx, x2, y2, x1, y1);
        }

        // Draw dimension text
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.fillStyle = element.properties.color || '#000000';
        ctx.font = `${element.properties.fontSize || 2.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(element.properties.text || '', midX, midY - 2);
        break;
    }

    ctx.setLineDash([]);
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const arrowLength = 3;
    const arrowAngle = Math.PI / 6;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(fromX - arrowLength * Math.cos(angle - arrowAngle), fromY - arrowLength * Math.sin(angle - arrowAngle));
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(fromX - arrowLength * Math.cos(angle + arrowAngle), fromY - arrowLength * Math.sin(angle + arrowAngle));
    ctx.stroke();
  };

  // Control functions
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleResetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const toggleLayer = (layerName: string) => {
    setLayers(prev => prev.map(layer => 
      layer.name === layerName ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const exportDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${drawings[activeDrawing]?.name || 'drawing'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const printDrawing = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 via-gray-800 to-zinc-700 text-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Technical Drawing System</h1>
            <p className="text-xl opacity-90">Professional CAD-style Construction Drawings</p>
          </div>
          <div className="text-6xl opacity-30">
            <FileText />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Drawing Sheets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="h-5 w-5" />
                <span>Drawing Sheets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {drawings.map((drawing, index) => (
                  <button
                    key={drawing.id}
                    onClick={() => setActiveDrawing(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      activeDrawing === index 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{drawing.name}</div>
                    <div className="text-sm text-gray-500">{drawing.size} - {drawing.scale}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* View Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ZoomIn className="h-5 w-5" />
                <span>View Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleZoomIn} className="flex-1">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleZoomOut} className="flex-1">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleResetView} className="flex-1">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-center">
                  <span className="text-sm text-gray-600">Zoom: {Math.round(zoom * 100)}%</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showGrid"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                  />
                  <label htmlFor="showGrid" className="text-sm">Show Grid</label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="h-5 w-5" />
                <span>Layers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {layers.map(layer => (
                  <div key={layer.name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => toggleLayer(layer.name)}
                      disabled={layer.locked}
                    />
                    <div
                      className="w-4 h-2 border"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-sm flex-1">{layer.name}</span>
                    {layer.locked && (
                      <span className="text-xs text-gray-500">🔒</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PenTool className="h-5 w-5" />
                <span>Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={exportDrawing}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="outline" onClick={printDrawing}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drawing Info */}
          {drawings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Drawing Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Number:</span>
                    <span className="font-medium">{drawings[activeDrawing].titleBlock.drawingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scale:</span>
                    <span className="font-medium">{drawings[activeDrawing].titleBlock.scale}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{drawings[activeDrawing].size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revision:</span>
                    <span className="font-medium">{drawings[activeDrawing].titleBlock.revision}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Drawing Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{drawings[activeDrawing]?.name || 'Drawing'}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{drawings[activeDrawing]?.titleBlock.drawingNumber}</Badge>
                  <Badge variant="secondary">{drawings[activeDrawing]?.titleBlock.scale}</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-gray-100">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-full cursor-crosshair"
                  style={{ minHeight: '600px' }}
                />
              </div>
              
              {drawings.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No Drawings Available</h3>
                  <p className="text-gray-500">Add structural elements to generate technical drawings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDrawingSystem;