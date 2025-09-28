/**
 * Enhanced Technical Drawing Generator for Design Module
 * Professional CAD-style drawings with proper dimensioning and annotations
 */

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  FileText, Download, Printer, ZoomIn, ZoomOut, 
  Ruler, Grid3X3, Layers, Move, RotateCcw,
  AlertTriangle, CheckCircle, Info
} from 'lucide-react';

// Enhanced Technical Drawing Interfaces
interface TechnicalDrawingStandards {
  lineWeights: {
    outlineHeavy: number;    // 0.7mm - Outer boundaries
    outline: number;         // 0.5mm - Object outlines
    visible: number;         // 0.35mm - Visible edges
    hidden: number;          // 0.25mm - Hidden edges
    center: number;          // 0.25mm - Center lines
    dimension: number;       // 0.25mm - Dimension lines
    hatch: number;          // 0.18mm - Hatching lines
    construction: number;    // 0.18mm - Construction lines
  };
  textSizes: {
    title: number;          // 7mm - Drawing title
    subtitle: number;       // 5mm - Subtitles
    dimension: number;      // 3.5mm - Dimensions
    annotation: number;     // 2.5mm - Notes and labels
    specification: number;  // 2mm - Specifications
  };
  colors: {
    structure: string;      // Black - Main structure
    reinforcement: string;  // Blue - Reinforcement
    dimensions: string;     // Red - Dimensions
    annotations: string;    // Green - Annotations
    hatching: string;       // Gray - Section hatching
    grid: string;          // Light gray - Grid
  };
  spacing: {
    dimensionOffset: number;  // 10mm from object
    dimensionGap: number;     // 5mm between dimension lines
    textHeight: number;       // 7mm standard text height
    arrowSize: number;        // 2.5mm arrow size
  };
}

interface EnhancedDrawingElement {
  id: string;
  type: 'beam' | 'column' | 'slab' | 'footing' | 'wall';
  geometry: {
    width: number;
    height: number;
    length: number;
    thickness?: number;
  };
  reinforcement: {
    main: {
      diameter: number;
      count: number;
      spacing?: number;
      grade: string;
      cover: number;
    };
    secondary?: {
      diameter: number;
      spacing: number;
      grade: string;
    };
    shear?: {
      diameter: number;
      spacing: number;
      legs: number;
      grade: string;
    };
    skin?: {
      diameter: number;
      spacing: number;
      grade: string;
    };
  };
  materials: {
    concrete: {
      grade: string;
      fc: number;
    };
    steel: {
      grade: string;
      fy: number;
    };
  };
  loads: {
    dead: number;
    live: number;
    seismic?: number;
    wind?: number;
  };
  designResults: {
    utilization: number;
    capacity: number;
    safetyFactor: number;
    checks: Array<{
      name: string;
      requirement: number;
      actual: number;
      status: 'pass' | 'fail' | 'warning';
    }>;
  };
}

interface DrawingView {
  name: string;
  type: 'plan' | 'elevation' | 'section' | 'detail' | '3d';
  scale: string;
  description: string;
}

interface EnhancedTechnicalDrawingProps {
  element: EnhancedDrawingElement;
  projectInfo?: {
    name: string;
    location: string;
    engineer: string;
    checker: string;
    date: string;
    revision: string;
  };
  standards: 'SNI' | 'ACI' | 'AISC';
  onExport?: (format: 'PDF' | 'DWG' | 'SVG') => void;
  onPrint?: () => void;
}

// Standard Drawing Specifications
const DRAWING_STANDARDS: TechnicalDrawingStandards = {
  lineWeights: {
    outlineHeavy: 0.7,
    outline: 0.5,
    visible: 0.35,
    hidden: 0.25,
    center: 0.25,
    dimension: 0.25,
    hatch: 0.18,
    construction: 0.18
  },
  textSizes: {
    title: 7,
    subtitle: 5,
    dimension: 3.5,
    annotation: 2.5,
    specification: 2
  },
  colors: {
    structure: '#000000',
    reinforcement: '#0066CC',
    dimensions: '#CC0000',
    annotations: '#006600',
    hatching: '#808080',
    grid: '#CCCCCC'
  },
  spacing: {
    dimensionOffset: 10,
    dimensionGap: 5,
    textHeight: 7,
    arrowSize: 2.5
  }
};

// Enhanced Technical Drawing Component
const EnhancedTechnicalDrawing: React.FC<EnhancedTechnicalDrawingProps> = ({
  element,
  projectInfo,
  standards = 'SNI',
  onExport,
  onPrint
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeView, setActiveView] = useState<DrawingView>({
    name: 'Plan View',
    type: 'plan',
    scale: '1:50',
    description: 'Top view showing reinforcement layout'
  });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showReinforcement, setShowReinforcement] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);

  // Available drawing views based on element type
  const getAvailableViews = (): DrawingView[] => {
    const baseViews: DrawingView[] = [
      { name: 'Plan View', type: 'plan', scale: '1:50', description: 'Top view showing layout' },
      { name: 'Elevation', type: 'elevation', scale: '1:50', description: 'Side view' },
      { name: 'Cross Section', type: 'section', scale: '1:20', description: 'Detailed cross-section' }
    ];

    if (['beam', 'column'].includes(element.type)) {
      baseViews.push(
        { name: 'Reinforcement Detail', type: 'detail', scale: '1:10', description: 'Reinforcement details' },
        { name: 'Connection Detail', type: 'detail', scale: '1:5', description: 'Connection details' }
      );
    }

    return baseViews;
  };

  // Drawing generation functions
  const generatePlanView = (ctx: CanvasRenderingContext2D, scale: number) => {
    const { width, height } = element.geometry;
    const drawWidth = width * scale / 1000;
    const drawHeight = height * scale / 1000;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // Draw main outline (heavy line)
    ctx.strokeStyle = DRAWING_STANDARDS.colors.structure;
    ctx.lineWidth = DRAWING_STANDARDS.lineWeights.outlineHeavy * zoom;
    ctx.strokeRect(
      centerX - drawWidth / 2,
      centerY - drawHeight / 2,
      drawWidth,
      drawHeight
    );

    // Draw reinforcement if enabled
    if (showReinforcement && element.reinforcement.main) {
      ctx.strokeStyle = DRAWING_STANDARDS.colors.reinforcement;
      ctx.lineWidth = DRAWING_STANDARDS.lineWeights.visible * zoom;
      
      const { diameter, count, cover } = element.reinforcement.main;
      const effectiveWidth = width - 2 * cover;
      const barSpacing = effectiveWidth / (count - 1);
      
      // Draw main reinforcement bars
      for (let i = 0; i < count; i++) {
        const barX = centerX - drawWidth / 2 + (cover * scale / 1000) + (i * barSpacing * scale / 1000);
        
        // Draw bar symbol (circle)
        ctx.beginPath();
        ctx.arc(barX, centerY, diameter * scale / 2000, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Bar label
        ctx.fillStyle = DRAWING_STANDARDS.colors.reinforcement;
        ctx.font = `${DRAWING_STANDARDS.textSizes.annotation * zoom}px Arial`;
        ctx.fillText(`Ø${diameter}`, barX - 8, centerY + 20);
      }

      // Draw stirrups/ties if available
      if (element.reinforcement.shear) {
        ctx.setLineDash([5, 5]);
        const stirrupSpacing = element.reinforcement.shear.spacing * scale / 1000;
        const stirrupCount = Math.floor(drawHeight / stirrupSpacing);
        
        for (let i = 1; i < stirrupCount; i++) {
          const stirrupY = centerY - drawHeight / 2 + i * stirrupSpacing;
          ctx.beginPath();
          ctx.moveTo(centerX - drawWidth / 2 + 5, stirrupY);
          ctx.lineTo(centerX + drawWidth / 2 - 5, stirrupY);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
    }

    // Draw dimensions if enabled
    if (showDimensions) {
      drawDimensions(ctx, centerX, centerY, drawWidth, drawHeight, scale);
    }

    // Draw annotations if enabled
    if (showAnnotations) {
      drawAnnotations(ctx, centerX, centerY, drawWidth, drawHeight);
    }
  };

  const generateElevationView = (ctx: CanvasRenderingContext2D, scale: number) => {
    const { width, height, length } = element.geometry;
    const drawWidth = length * scale / 1000;
    const drawHeight = height * scale / 1000;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // Draw main outline
    ctx.strokeStyle = DRAWING_STANDARDS.colors.structure;
    ctx.lineWidth = DRAWING_STANDARDS.lineWeights.outline * zoom;
    ctx.strokeRect(
      centerX - drawWidth / 2,
      centerY - drawHeight / 2,
      drawWidth,
      drawHeight
    );

    // Draw reinforcement layout (elevation view)
    if (showReinforcement) {
      ctx.strokeStyle = DRAWING_STANDARDS.colors.reinforcement;
      ctx.lineWidth = DRAWING_STANDARDS.lineWeights.visible * zoom;

      // Main reinforcement (bottom and top)
      const { cover } = element.reinforcement.main;
      const coverDraw = cover * scale / 1000;

      // Bottom bars
      ctx.beginPath();
      ctx.moveTo(centerX - drawWidth / 2 + coverDraw, centerY + drawHeight / 2 - coverDraw);
      ctx.lineTo(centerX + drawWidth / 2 - coverDraw, centerY + drawHeight / 2 - coverDraw);
      ctx.stroke();

      // Top bars (if any)
      ctx.beginPath();
      ctx.moveTo(centerX - drawWidth / 2 + coverDraw, centerY - drawHeight / 2 + coverDraw);
      ctx.lineTo(centerX + drawWidth / 2 - coverDraw, centerY - drawHeight / 2 + coverDraw);
      ctx.stroke();

      // Stirrups/ties
      if (element.reinforcement.shear) {
        const stirrupSpacing = element.reinforcement.shear.spacing * scale / 1000;
        const stirrupCount = Math.floor(drawWidth / stirrupSpacing);
        
        ctx.setLineDash([3, 3]);
        for (let i = 1; i < stirrupCount; i++) {
          const stirrupX = centerX - drawWidth / 2 + i * stirrupSpacing;
          ctx.beginPath();
          ctx.moveTo(stirrupX, centerY - drawHeight / 2 + coverDraw);
          ctx.lineTo(stirrupX, centerY + drawHeight / 2 - coverDraw);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
    }

    // Add elevation-specific dimensions
    if (showDimensions) {
      drawElevationDimensions(ctx, centerX, centerY, drawWidth, drawHeight, scale);
    }
  };

  const generateSectionView = (ctx: CanvasRenderingContext2D, scale: number) => {
    const { width, height } = element.geometry;
    const drawWidth = width * scale / 1000;
    const drawHeight = height * scale / 1000;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // Draw section outline with hatching
    ctx.fillStyle = DRAWING_STANDARDS.colors.hatching;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(
      centerX - drawWidth / 2,
      centerY - drawHeight / 2,
      drawWidth,
      drawHeight
    );
    ctx.globalAlpha = 1.0;

    // Draw section hatching pattern
    ctx.strokeStyle = DRAWING_STANDARDS.colors.hatching;
    ctx.lineWidth = DRAWING_STANDARDS.lineWeights.hatch * zoom;
    
    const hatchSpacing = 3;
    for (let i = -drawWidth; i < drawWidth + drawHeight; i += hatchSpacing) {
      ctx.beginPath();
      ctx.moveTo(centerX - drawWidth / 2 + i, centerY - drawHeight / 2);
      ctx.lineTo(centerX - drawWidth / 2 + i + drawHeight, centerY + drawHeight / 2);
      ctx.stroke();
    }

    // Draw outline
    ctx.strokeStyle = DRAWING_STANDARDS.colors.structure;
    ctx.lineWidth = DRAWING_STANDARDS.lineWeights.outlineHeavy * zoom;
    ctx.strokeRect(
      centerX - drawWidth / 2,
      centerY - drawHeight / 2,
      drawWidth,
      drawHeight
    );

    // Draw reinforcement cross-section
    if (showReinforcement) {
      drawReinforcementSection(ctx, centerX, centerY, drawWidth, drawHeight, scale);
    }
  };

  const drawDimensions = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    drawWidth: number, 
    drawHeight: number, 
    scale: number
  ) => {
    ctx.strokeStyle = DRAWING_STANDARDS.colors.dimensions;
    ctx.lineWidth = DRAWING_STANDARDS.lineWeights.dimension * zoom;
    ctx.fillStyle = DRAWING_STANDARDS.colors.dimensions;
    ctx.font = `${DRAWING_STANDARDS.textSizes.dimension * zoom}px Arial`;

    const offset = DRAWING_STANDARDS.spacing.dimensionOffset * zoom;
    
    // Width dimension (bottom)
    const bottomY = centerY + drawHeight / 2 + offset;
    ctx.beginPath();
    ctx.moveTo(centerX - drawWidth / 2, bottomY);
    ctx.lineTo(centerX + drawWidth / 2, bottomY);
    ctx.stroke();

    // Dimension arrows
    drawDimensionArrow(ctx, centerX - drawWidth / 2, bottomY, 'right');
    drawDimensionArrow(ctx, centerX + drawWidth / 2, bottomY, 'left');

    // Dimension text
    ctx.textAlign = 'center';
    ctx.fillText(`${element.geometry.width}`, centerX, bottomY - 5);

    // Height dimension (right)
    const rightX = centerX + drawWidth / 2 + offset;
    ctx.beginPath();
    ctx.moveTo(rightX, centerY - drawHeight / 2);
    ctx.lineTo(rightX, centerY + drawHeight / 2);
    ctx.stroke();

    // Dimension arrows
    drawDimensionArrow(ctx, rightX, centerY - drawHeight / 2, 'down');
    drawDimensionArrow(ctx, rightX, centerY + drawHeight / 2, 'up');

    // Dimension text (rotated)
    ctx.save();
    ctx.translate(rightX + 15, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${element.geometry.height}`, 0, 0);
    ctx.restore();
  };

  const drawElevationDimensions = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    drawWidth: number,
    drawHeight: number,
    scale: number
  ) => {
    ctx.strokeStyle = DRAWING_STANDARDS.colors.dimensions;
    ctx.lineWidth = DRAWING_STANDARDS.lineWeights.dimension * zoom;
    ctx.fillStyle = DRAWING_STANDARDS.colors.dimensions;
    ctx.font = `${DRAWING_STANDARDS.textSizes.dimension * zoom}px Arial`;

    const offset = DRAWING_STANDARDS.spacing.dimensionOffset * zoom;

    // Length dimension (bottom)
    const bottomY = centerY + drawHeight / 2 + offset;
    ctx.beginPath();
    ctx.moveTo(centerX - drawWidth / 2, bottomY);
    ctx.lineTo(centerX + drawWidth / 2, bottomY);
    ctx.stroke();

    drawDimensionArrow(ctx, centerX - drawWidth / 2, bottomY, 'right');
    drawDimensionArrow(ctx, centerX + drawWidth / 2, bottomY, 'left');

    ctx.textAlign = 'center';
    ctx.fillText(`${element.geometry.length}`, centerX, bottomY - 5);

    // Height dimension (left)
    const leftX = centerX - drawWidth / 2 - offset;
    ctx.beginPath();
    ctx.moveTo(leftX, centerY - drawHeight / 2);
    ctx.lineTo(leftX, centerY + drawHeight / 2);
    ctx.stroke();

    drawDimensionArrow(ctx, leftX, centerY - drawHeight / 2, 'down');
    drawDimensionArrow(ctx, leftX, centerY + drawHeight / 2, 'up');

    ctx.save();
    ctx.translate(leftX - 15, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${element.geometry.height}`, 0, 0);
    ctx.restore();
  };

  const drawDimensionArrow = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => {
    const size = DRAWING_STANDARDS.spacing.arrowSize * zoom;
    
    ctx.beginPath();
    switch (direction) {
      case 'right':
        ctx.moveTo(x, y);
        ctx.lineTo(x - size, y - size / 2);
        ctx.lineTo(x - size, y + size / 2);
        break;
      case 'left':
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y - size / 2);
        ctx.lineTo(x + size, y + size / 2);
        break;
      case 'up':
        ctx.moveTo(x, y);
        ctx.lineTo(x - size / 2, y + size);
        ctx.lineTo(x + size / 2, y + size);
        break;
      case 'down':
        ctx.moveTo(x, y);
        ctx.lineTo(x - size / 2, y - size);
        ctx.lineTo(x + size / 2, y - size);
        break;
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawReinforcementSection = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    drawWidth: number,
    drawHeight: number,
    scale: number
  ) => {
    ctx.fillStyle = DRAWING_STANDARDS.colors.reinforcement;
    
    const { main, shear } = element.reinforcement;
    const barRadius = main.diameter * scale / 2000;
    const cover = main.cover * scale / 1000;

    // Draw main reinforcement bars
    const effectiveWidth = drawWidth - 2 * cover;
    const barSpacing = effectiveWidth / (main.count - 1);

    // Bottom bars
    for (let i = 0; i < main.count; i++) {
      const barX = centerX - drawWidth / 2 + cover + i * barSpacing;
      const barY = centerY + drawHeight / 2 - cover;
      
      ctx.beginPath();
      ctx.arc(barX, barY, barRadius, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Top bars (if any - typically 25% of main reinforcement)
    const topBarCount = Math.ceil(main.count * 0.25);
    for (let i = 0; i < topBarCount; i++) {
      const barX = centerX - drawWidth / 2 + cover + i * barSpacing * 2;
      const barY = centerY - drawHeight / 2 + cover;
      
      ctx.beginPath();
      ctx.arc(barX, barY, barRadius * 0.8, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw stirrups/ties outline
    if (shear) {
      ctx.strokeStyle = DRAWING_STANDARDS.colors.reinforcement;
      ctx.lineWidth = DRAWING_STANDARDS.lineWeights.visible * zoom;
      ctx.setLineDash([2, 2]);
      
      ctx.strokeRect(
        centerX - drawWidth / 2 + cover,
        centerY - drawHeight / 2 + cover,
        drawWidth - 2 * cover,
        drawHeight - 2 * cover
      );
      
      ctx.setLineDash([]);
    }
  };

  const drawAnnotations = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    drawWidth: number,
    drawHeight: number
  ) => {
    ctx.fillStyle = DRAWING_STANDARDS.colors.annotations;
    ctx.font = `${DRAWING_STANDARDS.textSizes.annotation * zoom}px Arial`;

    // Material specifications
    const annotations = [
      `Concrete: ${element.materials.concrete.grade} (f'c = ${element.materials.concrete.fc} MPa)`,
      `Steel: ${element.materials.steel.grade} (fy = ${element.materials.steel.fy} MPa)`,
      `Main Reinf: ${element.reinforcement.main.count}Ø${element.reinforcement.main.diameter} - ${element.reinforcement.main.grade}`,
    ];

    if (element.reinforcement.shear) {
      annotations.push(
        `Stirrups: Ø${element.reinforcement.shear.diameter}-${element.reinforcement.shear.spacing} - ${element.reinforcement.shear.grade}`
      );
    }

    // Draw annotations in bottom-left corner
    const startX = centerX - drawWidth / 2;
    const startY = centerY + drawHeight / 2 + 50;

    annotations.forEach((annotation, index) => {
      ctx.fillText(annotation, startX, startY + index * 20);
    });
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    ctx.strokeStyle = DRAWING_STANDARDS.colors.grid;
    ctx.lineWidth = DRAWING_STANDARDS.lineWeights.construction * zoom;
    ctx.setLineDash([1, 3]);

    const gridSpacing = 20 * zoom; // 20mm grid
    const { width, height } = ctx.canvas;

    // Vertical lines
    for (let x = gridSpacing; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = gridSpacing; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  };

  const drawTitleBlock = (ctx: CanvasRenderingContext2D) => {
    const blockWidth = 200;
    const blockHeight = 100;
    const x = ctx.canvas.width - blockWidth - 20;
    const y = ctx.canvas.height - blockHeight - 20;

    // Title block border
    ctx.strokeStyle = DRAWING_STANDARDS.colors.structure;
    ctx.lineWidth = DRAWING_STANDARDS.lineWeights.outline * zoom;
    ctx.strokeRect(x, y, blockWidth, blockHeight);

    // Title block content
    ctx.fillStyle = DRAWING_STANDARDS.colors.structure;
    ctx.font = `${DRAWING_STANDARDS.textSizes.subtitle * zoom}px Arial Black`;
    ctx.textAlign = 'center';
    ctx.fillText(
      `${element.type.toUpperCase()} DETAIL`,
      x + blockWidth / 2,
      y + 20
    );

    ctx.font = `${DRAWING_STANDARDS.textSizes.annotation * zoom}px Arial`;
    ctx.textAlign = 'left';
    
    const details = [
      `Scale: ${activeView.scale}`,
      `Standard: ${standards}`,
      `Date: ${projectInfo?.date || new Date().toLocaleDateString()}`,
      `Engineer: ${projectInfo?.engineer || 'N/A'}`,
      `Utilization: ${(element.designResults.utilization * 100).toFixed(1)}%`
    ];

    details.forEach((detail, index) => {
      ctx.fillText(detail, x + 5, y + 40 + index * 12);
    });
  };

  // Main drawing function
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw grid
    drawGrid(ctx);

    // Draw main view based on active view type
    const scale = parseFloat(activeView.scale.split(':')[1]);
    
    switch (activeView.type) {
      case 'plan':
        generatePlanView(ctx, scale);
        break;
      case 'elevation':
        generateElevationView(ctx, scale);
        break;
      case 'section':
        generateSectionView(ctx, scale);
        break;
      case 'detail':
        generateSectionView(ctx, scale * 2); // Larger scale for details
        break;
    }

    ctx.restore();

    // Draw title block (not affected by zoom/pan)
    drawTitleBlock(ctx);
  };

  // Export functions
  const handleExport = (format: 'PDF' | 'DWG' | 'SVG') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    switch (format) {
      case 'PDF':
        // Convert canvas to PDF
        const pdf = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${element.type}_detail_${activeView.name.replace(' ', '_')}.png`;
        link.href = pdf;
        link.click();
        break;
      case 'SVG':
        // Export as SVG (would need additional implementation)
        console.log('SVG export not implemented yet');
        break;
      case 'DWG':
        // Export as DWG (would need additional implementation)
        console.log('DWG export not implemented yet');
        break;
    }
    
    onExport?.(format);
  };

  // Effects
  useEffect(() => {
    drawCanvas();
  }, [activeView, zoom, pan, showGrid, showDimensions, showReinforcement, showAnnotations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span>Technical Drawing - {element.type.toUpperCase()}</span>
              <Badge variant="outline">{standards} Standard</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={element.designResults.utilization > 0.8 ? 'destructive' : 'default'}>
                {(element.designResults.utilization * 100).toFixed(1)}% Utilized
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Drawing Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Control Panel */}
        <div className="space-y-4">
          {/* View Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Drawing Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getAvailableViews().map((view) => (
                  <button
                    key={view.name}
                    onClick={() => setActiveView(view)}
                    className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                      activeView.name === view.name
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{view.name}</div>
                    <div className="text-xs text-gray-500">{view.scale} - {view.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Display Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Display Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Grid</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showDimensions}
                    onChange={(e) => setShowDimensions(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Dimensions</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showReinforcement}
                    onChange={(e) => setShowReinforcement(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Reinforcement</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showAnnotations}
                    onChange={(e) => setShowAnnotations(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Annotations</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Zoom Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">View Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setZoom(z => Math.max(z * 0.8, 0.1))}
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-mono">{(zoom * 100).toFixed(0)}%</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setZoom(z => Math.min(z * 1.25, 5))}
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                    className="flex-1"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport('PDF')}
                  className="w-full"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPrint?.()}
                  className="w-full"
                >
                  <Printer className="h-3 w-3 mr-1" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Drawing Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{activeView.name} - {activeView.scale}</span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Ruler className="h-4 w-4" />
                  <span>{activeView.description}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-auto cursor-move"
                  onMouseDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const startX = e.clientX - rect.left;
                    const startY = e.clientY - rect.top;
                    
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const newX = moveEvent.clientX - rect.left;
                      const newY = moveEvent.clientY - rect.top;
                      setPan(prev => ({
                        x: prev.x + (newX - startX) / zoom,
                        y: prev.y + (newY - startY) / zoom
                      }));
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Design Check Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Design Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {element.designResults.checks.map((check, index) => (
                  <div key={index} className="text-center">
                    <div className={`flex items-center justify-center mb-1 ${
                      check.status === 'pass' ? 'text-green-600' :
                      check.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {check.status === 'pass' ? <CheckCircle className="h-4 w-4" /> :
                       check.status === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                       <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <div className="text-xs font-medium">{check.name}</div>
                    <div className="text-xs text-gray-500">
                      {check.actual.toFixed(2)} / {check.requirement.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTechnicalDrawing;