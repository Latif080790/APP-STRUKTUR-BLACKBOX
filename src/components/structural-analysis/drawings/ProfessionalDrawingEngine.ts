/**
 * Professional Drawing Integration System
 * CAD-quality technical drawings with automated reinforcement detailing
 */

import { Canvas, Path, Group, Text, Line, Rectangle, Circle, Polygon } from 'fabric';

export interface DrawingScale {
  ratio: number; // 1:100, 1:50, etc.
  unit: 'mm' | 'cm' | 'm';
  displayUnit: string; // "1:100"
}

export interface DrawingSheet {
  size: 'A0' | 'A1' | 'A2' | 'A3' | 'A4';
  orientation: 'portrait' | 'landscape';
  width: number; // mm
  height: number; // mm
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  titleBlock: {
    width: number;
    height: number;
    position: 'bottom-right' | 'bottom-left';
  };
}

export interface DrawingAnnotation {
  id: string;
  type: 'dimension' | 'label' | 'note' | 'symbol' | 'elevation' | 'section';
  position: { x: number; y: number };
  text: string;
  style: {
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor?: string;
    border?: boolean;
  };
  leader?: {
    points: Array<{ x: number; y: number }>;
    arrowType: 'filled' | 'open' | 'dot';
  };
}

export interface ReinforcementDetail {
  barSize: string; // D10, D12, D16, etc.
  spacing: number; // mm
  length: number; // mm
  quantity: number;
  position: 'top' | 'bottom' | 'side' | 'stirrup';
  hookType?: 'standard' | '90deg' | '180deg';
  development: {
    length: number;
    type: 'straight' | 'hooked' | 'mechanical';
  };
  bending: Array<{
    angle: number;
    radius: number;
    position: number; // distance from start
  }>;
  coating?: 'epoxy' | 'galvanized' | 'stainless';
  grade: 'BJTP280' | 'BJTP320' | 'BJTP400' | 'BJTP500';
}

export interface StructuralElement {
  id: string;
  type: 'beam' | 'column' | 'slab' | 'footing' | 'wall' | 'foundation';
  geometry: {
    width: number;
    height: number;
    length: number;
    shape: 'rectangular' | 'circular' | 'T' | 'L' | 'I';
  };
  material: {
    concrete: {
      grade: string; // fc25, fc30, etc.
      density: number;
      cover: number; // mm
    };
    steel: {
      main: ReinforcementDetail[];
      secondary: ReinforcementDetail[];
      stirrups: ReinforcementDetail[];
    };
  };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  connections: Array<{
    elementId: string;
    type: 'rigid' | 'pinned' | 'fixed';
    location: 'start' | 'end' | 'center';
  }>;
}

export interface ConstructionSequence {
  phase: number;
  description: string;
  duration: number; // days
  elements: string[]; // element IDs
  prerequisites: number[]; // phase numbers
  criticalPath: boolean;
  resources: {
    labor: number;
    equipment: string[];
    materials: Array<{
      type: string;
      quantity: number;
      unit: string;
    }>;
  };
  safety: {
    hazards: string[];
    measures: string[];
    inspections: string[];
  };
  quality: {
    checkpoints: string[];
    tests: string[];
    acceptance: string[];
  };
}

export interface BIMIntegration {
  ifc: {
    version: string;
    schema: string;
    entities: Array<{
      id: string;
      type: string;
      properties: Record<string, any>;
      relationships: Array<{
        type: string;
        relatedId: string;
      }>;
    }>;
  };
  metadata: {
    project: {
      name: string;
      location: string;
      owner: string;
      architect: string;
      engineer: string;
      contractor: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
      elevation: number;
      datum: string;
    };
    levels: Array<{
      id: string;
      name: string;
      elevation: number;
      height: number;
    }>;
  };
  export: {
    formats: Array<'ifc' | 'dwg' | 'pdf' | 'obj' | 'fbx'>;
    options: {
      includeGeometry: boolean;
      includeMaterials: boolean;
      includeSchedules: boolean;
      includeAnalysis: boolean;
    };
  };
}

export class ProfessionalDrawingEngine {
  private canvas: Canvas;
  private currentSheet: DrawingSheet;
  private currentScale: DrawingScale;
  private elements: Map<string, StructuralElement> = new Map();
  private annotations: Map<string, DrawingAnnotation> = new Map();
  private layers: Map<string, { visible: boolean; color: string; lineWeight: number }> = new Map();

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new Canvas(canvasElement);
    this.currentSheet = this.getStandardSheet('A1', 'landscape');
    this.currentScale = { ratio: 100, unit: 'mm', displayUnit: '1:100' };
    this.initializeLayers();
    this.setupCanvas();
  }

  /**
   * Initialize standard CAD layers
   */
  private initializeLayers(): void {
    this.layers.set('STRUCTURE', { visible: true, color: '#000000', lineWeight: 2 });
    this.layers.set('REINFORCEMENT', { visible: true, color: '#FF0000', lineWeight: 1 });
    this.layers.set('DIMENSIONS', { visible: true, color: '#0000FF', lineWeight: 0.5 });
    this.layers.set('TEXT', { visible: true, color: '#000000', lineWeight: 0.5 });
    this.layers.set('GRID', { visible: true, color: '#CCCCCC', lineWeight: 0.25 });
    this.layers.set('SYMBOLS', { visible: true, color: '#00AA00', lineWeight: 1 });
    this.layers.set('CONSTRUCTION', { visible: false, color: '#FF8800', lineWeight: 1 });
    this.layers.set('ANALYSIS', { visible: false, color: '#AA00AA', lineWeight: 1.5 });
  }

  /**
   * Setup canvas with sheet size and drawing area
   */
  private setupCanvas(): void {
    this.canvas.setWidth(this.currentSheet.width);
    this.canvas.setHeight(this.currentSheet.height);
    this.drawTitleBlock();
    this.drawBorder();
    this.drawGrid();
  }

  /**
   * Get standard sheet sizes
   */
  private getStandardSheet(size: string, orientation: string): DrawingSheet {
    const sizes = {
      A0: { width: 1189, height: 841 },
      A1: { width: 841, height: 594 },
      A2: { width: 594, height: 420 },
      A3: { width: 420, height: 297 },
      A4: { width: 297, height: 210 }
    };

    const dimensions = sizes[size as keyof typeof sizes];
    const isLandscape = orientation === 'landscape';

    return {
      size: size as any,
      orientation: orientation as any,
      width: isLandscape ? dimensions.width : dimensions.height,
      height: isLandscape ? dimensions.height : dimensions.width,
      margins: { top: 20, right: 20, bottom: 50, left: 20 },
      titleBlock: { width: 200, height: 30, position: 'bottom-right' }
    };
  }

  /**
   * Draw title block with project information
   */
  private drawTitleBlock(): void {
    const { width, height, margins, titleBlock } = this.currentSheet;
    const x = width - margins.right - titleBlock.width;
    const y = height - margins.bottom;

    // Main title block rectangle
    const titleRect = new Rectangle({
      left: x,
      top: y - titleBlock.height,
      width: titleBlock.width,
      height: titleBlock.height,
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1
    });

    // Title block grid
    const dividers = [
      new Line([x + 120, y - titleBlock.height, x + 120, y], { stroke: '#000000', strokeWidth: 0.5 }),
      new Line([x + 160, y - titleBlock.height, x + 160, y], { stroke: '#000000', strokeWidth: 0.5 }),
      new Line([x, y - 15, x + titleBlock.width, y - 15], { stroke: '#000000', strokeWidth: 0.5 })
    ];

    // Title block text
    const projectText = new Text('STRUCTURAL DRAWING', {
      left: x + 5,
      top: y - titleBlock.height + 3,
      fontSize: 8,
      fontFamily: 'Arial',
      fill: '#000000'
    });

    const scaleText = new Text(`SCALE: ${this.currentScale.displayUnit}`, {
      left: x + 125,
      top: y - titleBlock.height + 3,
      fontSize: 6,
      fontFamily: 'Arial',
      fill: '#000000'
    });

    const dateText = new Text(`DATE: ${new Date().toLocaleDateString()}`, {
      left: x + 125,
      top: y - 8,
      fontSize: 6,
      fontFamily: 'Arial',
      fill: '#000000'
    });

    [titleRect, ...dividers, projectText, scaleText, dateText].forEach(obj => {
      this.canvas.add(obj);
    });
  }

  /**
   * Draw sheet border
   */
  private drawBorder(): void {
    const { width, height, margins } = this.currentSheet;
    
    const border = new Rectangle({
      left: margins.left,
      top: margins.top,
      width: width - margins.left - margins.right,
      height: height - margins.top - margins.bottom,
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 2
    });

    this.canvas.add(border);
  }

  /**
   * Draw construction grid
   */
  private drawGrid(): void {
    if (!this.layers.get('GRID')?.visible) return;

    const { width, height, margins } = this.currentSheet;
    const gridSpacing = this.scaleToDrawing(1000); // 1m grid
    const color = this.layers.get('GRID')!.color;
    const strokeWidth = this.layers.get('GRID')!.lineWeight;

    // Vertical grid lines
    for (let x = margins.left; x <= width - margins.right; x += gridSpacing) {
      const line = new Line([x, margins.top, x, height - margins.bottom], {
        stroke: color,
        strokeWidth: strokeWidth,
        strokeDashArray: [2, 2]
      });
      this.canvas.add(line);
    }

    // Horizontal grid lines
    for (let y = margins.top; y <= height - margins.bottom; y += gridSpacing) {
      const line = new Line([margins.left, y, width - margins.right, y], {
        stroke: color,
        strokeWidth: strokeWidth,
        strokeDashArray: [2, 2]
      });
      this.canvas.add(line);
    }
  }

  /**
   * Convert real-world dimensions to drawing scale
   */
  private scaleToDrawing(realSize: number): number {
    return realSize / this.currentScale.ratio;
  }

  /**
   * Convert drawing dimensions to real-world scale
   */
  private scaleToReal(drawingSize: number): number {
    return drawingSize * this.currentScale.ratio;
  }

  /**
   * Draw structural plan view
   */
  public drawStructuralPlan(elements: StructuralElement[]): void {
    elements.forEach(element => {
      this.elements.set(element.id, element);
      this.drawElement(element, 'plan');
    });

    this.drawDimensions();
    this.drawGrid();
  }

  /**
   * Draw individual structural element
   */
  private drawElement(element: StructuralElement, view: 'plan' | 'elevation' | 'section'): void {
    const layer = this.layers.get('STRUCTURE')!;
    const x = this.scaleToDrawing(element.position.x) + this.currentSheet.margins.left;
    const y = this.scaleToDrawing(element.position.y) + this.currentSheet.margins.top;
    const width = this.scaleToDrawing(element.geometry.width);
    const height = this.scaleToDrawing(element.geometry.length);

    let shape;
    switch (element.geometry.shape) {
      case 'rectangular':
        shape = new Rectangle({
          left: x,
          top: y,
          width: width,
          height: height,
          fill: 'transparent',
          stroke: layer.color,
          strokeWidth: layer.lineWeight
        });
        break;

      case 'circular':
        shape = new Circle({
          left: x,
          top: y,
          radius: width / 2,
          fill: 'transparent',
          stroke: layer.color,
          strokeWidth: layer.lineWeight
        });
        break;

      case 'I':
        shape = this.drawISection(x, y, width, height, layer);
        break;

      default:
        shape = new Rectangle({
          left: x,
          top: y,
          width: width,
          height: height,
          fill: 'transparent',
          stroke: layer.color,
          strokeWidth: layer.lineWeight
        });
    }

    this.canvas.add(shape);

    // Add element label
    const label = new Text(element.id, {
      left: x + width / 2,
      top: y + height / 2,
      fontSize: 8,
      fontFamily: 'Arial',
      fill: '#000000',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });

    this.canvas.add(label);

    // Draw reinforcement if enabled
    if (this.layers.get('REINFORCEMENT')?.visible) {
      this.drawReinforcement(element, x, y, width, height);
    }
  }

  /**
   * Draw I-section shape
   */
  private drawISection(x: number, y: number, width: number, height: number, layer: any): Group {
    const flangeThickness = height * 0.1;
    const webThickness = width * 0.1;

    const topFlange = new Rectangle({
      left: x,
      top: y,
      width: width,
      height: flangeThickness,
      fill: 'transparent',
      stroke: layer.color,
      strokeWidth: layer.lineWeight
    });

    const web = new Rectangle({
      left: x + (width - webThickness) / 2,
      top: y + flangeThickness,
      width: webThickness,
      height: height - 2 * flangeThickness,
      fill: 'transparent',
      stroke: layer.color,
      strokeWidth: layer.lineWeight
    });

    const bottomFlange = new Rectangle({
      left: x,
      top: y + height - flangeThickness,
      width: width,
      height: flangeThickness,
      fill: 'transparent',
      stroke: layer.color,
      strokeWidth: layer.lineWeight
    });

    return new Group([topFlange, web, bottomFlange]);
  }

  /**
   * Draw reinforcement details
   */
  private drawReinforcement(element: StructuralElement, x: number, y: number, width: number, height: number): void {
    const reinforcementLayer = this.layers.get('REINFORCEMENT')!;
    
    // Draw main reinforcement
    element.material.steel.main.forEach((rebar, index) => {
      const spacing = this.scaleToDrawing(rebar.spacing);
      const startY = y + this.scaleToDrawing(element.material.concrete.cover);
      
      for (let i = 0; i * spacing < height; i++) {
        const rebarY = startY + i * spacing;
        if (rebarY > y + height - this.scaleToDrawing(element.material.concrete.cover)) break;

        const rebarLine = new Line([x + 5, rebarY, x + width - 5, rebarY], {
          stroke: reinforcementLayer.color,
          strokeWidth: reinforcementLayer.lineWeight
        });

        // Draw rebar symbol
        const symbol = new Circle({
          left: x + 2,
          top: rebarY - 1,
          radius: 1,
          fill: reinforcementLayer.color,
          stroke: reinforcementLayer.color
        });

        this.canvas.add(rebarLine);
        this.canvas.add(symbol);
      }
    });

    // Draw stirrups
    element.material.steel.stirrups.forEach((stirrup, index) => {
      const spacing = this.scaleToDrawing(stirrup.spacing);
      const startX = x + this.scaleToDrawing(element.material.concrete.cover);
      
      for (let i = 0; i * spacing < width; i++) {
        const stirrupX = startX + i * spacing;
        if (stirrupX > x + width - this.scaleToDrawing(element.material.concrete.cover)) break;

        const stirrupRect = new Rectangle({
          left: stirrupX - 0.5,
          top: y + 2,
          width: 1,
          height: height - 4,
          fill: 'transparent',
          stroke: reinforcementLayer.color,
          strokeWidth: reinforcementLayer.lineWeight,
          strokeDashArray: [3, 2]
        });

        this.canvas.add(stirrupRect);
      }
    });
  }

  /**
   * Draw dimensions and annotations
   */
  private drawDimensions(): void {
    if (!this.layers.get('DIMENSIONS')?.visible) return;

    const layer = this.layers.get('DIMENSIONS')!;
    
    this.elements.forEach((element, id) => {
      const x = this.scaleToDrawing(element.position.x) + this.currentSheet.margins.left;
      const y = this.scaleToDrawing(element.position.y) + this.currentSheet.margins.top;
      const width = this.scaleToDrawing(element.geometry.width);
      const height = this.scaleToDrawing(element.geometry.length);

      // Width dimension
      this.drawLinearDimension(
        { x: x, y: y - 15 },
        { x: x + width, y: y - 15 },
        element.geometry.width,
        layer
      );

      // Height dimension
      this.drawLinearDimension(
        { x: x - 15, y: y },
        { x: x - 15, y: y + height },
        element.geometry.length,
        layer,
        'vertical'
      );
    });
  }

  /**
   * Draw linear dimension
   */
  private drawLinearDimension(
    start: { x: number; y: number },
    end: { x: number; y: number },
    value: number,
    layer: any,
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ): void {
    // Dimension line
    const dimLine = new Line([start.x, start.y, end.x, end.y], {
      stroke: layer.color,
      strokeWidth: layer.lineWeight
    });

    // Extension lines
    const extLength = 8;
    const ext1 = orientation === 'horizontal' 
      ? new Line([start.x, start.y - extLength, start.x, start.y + extLength], {
          stroke: layer.color,
          strokeWidth: layer.lineWeight
        })
      : new Line([start.x - extLength, start.y, start.x + extLength, start.y], {
          stroke: layer.color,
          strokeWidth: layer.lineWeight
        });

    const ext2 = orientation === 'horizontal'
      ? new Line([end.x, end.y - extLength, end.x, end.y + extLength], {
          stroke: layer.color,
          strokeWidth: layer.lineWeight
        })
      : new Line([end.x - extLength, end.y, end.x + extLength, end.y], {
          stroke: layer.color,
          strokeWidth: layer.lineWeight
        });

    // Arrows
    const arrowSize = 3;
    const arrow1 = this.createArrow(start, end, arrowSize, layer.color);
    const arrow2 = this.createArrow(end, start, arrowSize, layer.color);

    // Dimension text
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const text = new Text(`${value}`, {
      left: midX,
      top: midY - 5,
      fontSize: 6,
      fontFamily: 'Arial',
      fill: layer.color,
      textAlign: 'center',
      originX: 'center',
      backgroundColor: '#FFFFFF'
    });

    [dimLine, ext1, ext2, arrow1, arrow2, text].forEach(obj => {
      this.canvas.add(obj);
    });
  }

  /**
   * Create dimension arrow
   */
  private createArrow(from: { x: number; y: number }, to: { x: number; y: number }, size: number, color: string): Polygon {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const points = [
      { x: from.x, y: from.y },
      { 
        x: from.x - size * Math.cos(angle - Math.PI / 6), 
        y: from.y - size * Math.sin(angle - Math.PI / 6) 
      },
      { 
        x: from.x - size * Math.cos(angle + Math.PI / 6), 
        y: from.y - size * Math.sin(angle + Math.PI / 6) 
      }
    ];

    return new Polygon(points, {
      fill: color,
      stroke: color,
      strokeWidth: 0
    });
  }

  /**
   * Generate reinforcement schedule
   */
  public generateReinforcementSchedule(elements: StructuralElement[]): string {
    let schedule = "REINFORCEMENT SCHEDULE\n";
    schedule += "=" .repeat(80) + "\n";
    schedule += "Mark | Bar Size | Length | Quantity | Shape | Total Length | Weight\n";
    schedule += "-".repeat(80) + "\n";

    let totalWeight = 0;
    let mark = 1;

    elements.forEach(element => {
      const allRebars = [
        ...element.material.steel.main,
        ...element.material.steel.secondary,
        ...element.material.steel.stirrups
      ];

      allRebars.forEach(rebar => {
        const diameter = parseInt(rebar.barSize.substring(1)); // D12 -> 12
        const area = Math.PI * Math.pow(diameter / 2, 2); // mm²
        const density = 7.85e-6; // kg/mm³ for steel
        const weight = rebar.length * area * density * rebar.quantity;
        totalWeight += weight;

        schedule += `${mark.toString().padStart(4)} | `;
        schedule += `${rebar.barSize.padEnd(8)} | `;
        schedule += `${rebar.length.toString().padStart(6)} | `;
        schedule += `${rebar.quantity.toString().padStart(8)} | `;
        schedule += `${'Straight'.padEnd(5)} | `;
        schedule += `${(rebar.length * rebar.quantity).toString().padStart(12)} | `;
        schedule += `${weight.toFixed(1).padStart(6)}\n`;

        mark++;
      });
    });

    schedule += "-".repeat(80) + "\n";
    schedule += `TOTAL WEIGHT: ${totalWeight.toFixed(1)} kg\n`;

    return schedule;
  }

  /**
   * Generate construction sequence drawings
   */
  public generateConstructionSequence(sequence: ConstructionSequence[]): void {
    sequence.forEach((phase, index) => {
      // Create new sheet for each phase
      const phaseCanvas = new Canvas(null);
      phaseCanvas.setWidth(this.currentSheet.width);
      phaseCanvas.setHeight(this.currentSheet.height);

      // Draw elements for this phase
      phase.elements.forEach(elementId => {
        const element = this.elements.get(elementId);
        if (element) {
          // Highlight elements in this phase
          this.drawElement(element, 'plan');
        }
      });

      // Add phase information
      const phaseTitle = new Text(`CONSTRUCTION PHASE ${phase.phase}: ${phase.description}`, {
        left: 50,
        top: 30,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#000000',
        fontWeight: 'bold'
      });

      phaseCanvas.add(phaseTitle);

      // Add sequence notes
      const notes = [
        `Duration: ${phase.duration} days`,
        `Critical Path: ${phase.criticalPath ? 'Yes' : 'No'}`,
        `Safety Requirements: ${phase.safety.hazards.join(', ')}`,
        `Quality Checkpoints: ${phase.quality.checkpoints.join(', ')}`
      ];

      notes.forEach((note, noteIndex) => {
        const noteText = new Text(note, {
          left: 50,
          top: 50 + noteIndex * 15,
          fontSize: 8,
          fontFamily: 'Arial',
          fill: '#000000'
        });
        phaseCanvas.add(noteText);
      });
    });
  }

  /**
   * Export to BIM format
   */
  public exportToBIM(elements: StructuralElement[]): BIMIntegration {
    const entities = elements.map(element => ({
      id: element.id,
      type: `IFC${element.type.toUpperCase()}`,
      properties: {
        Name: element.id,
        Description: `${element.type} element`,
        ObjectType: element.type,
        Material: element.material.concrete.grade,
        Dimensions: element.geometry,
        Position: element.position,
        Rotation: element.rotation
      },
      relationships: element.connections.map(conn => ({
        type: 'IFCRELCONNECTS',
        relatedId: conn.elementId
      }))
    }));

    return {
      ifc: {
        version: '4.0',
        schema: 'IFC4',
        entities
      },
      metadata: {
        project: {
          name: 'Structural Analysis Project',
          location: 'Indonesia',
          owner: 'Project Owner',
          architect: 'Project Architect',
          engineer: 'Structural Engineer',
          contractor: 'Main Contractor'
        },
        coordinates: {
          latitude: -6.2088,
          longitude: 106.8456,
          elevation: 0,
          datum: 'WGS84'
        },
        levels: [
          { id: 'L1', name: 'Ground Floor', elevation: 0, height: 3000 },
          { id: 'L2', name: 'First Floor', elevation: 3000, height: 3000 }
        ]
      },
      export: {
        formats: ['ifc', 'dwg', 'pdf'],
        options: {
          includeGeometry: true,
          includeMaterials: true,
          includeSchedules: true,
          includeAnalysis: true
        }
      }
    };
  }

  /**
   * Export drawing to various formats
   */
  public exportDrawing(format: 'pdf' | 'dwg' | 'svg' | 'png', filename: string): string {
    switch (format) {
      case 'svg':
        return this.canvas.toSVG();
      case 'png':
        return this.canvas.toDataURL('image/png');
      case 'pdf':
        // Convert to PDF using canvas data
        return this.canvas.toDataURL('image/png'); // Simplified
      default:
        return this.canvas.toJSON();
    }
  }

  /**
   * Set drawing scale
   */
  public setScale(ratio: number): void {
    this.currentScale = {
      ratio,
      unit: 'mm',
      displayUnit: `1:${ratio}`
    };
    this.redrawAll();
  }

  /**
   * Toggle layer visibility
   */
  public toggleLayer(layerName: string, visible: boolean): void {
    const layer = this.layers.get(layerName);
    if (layer) {
      layer.visible = visible;
      this.redrawAll();
    }
  }

  /**
   * Redraw all elements
   */
  private redrawAll(): void {
    this.canvas.clear();
    this.setupCanvas();
    this.elements.forEach(element => this.drawElement(element, 'plan'));
    this.drawDimensions();
  }

  /**
   * Add annotation
   */
  public addAnnotation(annotation: DrawingAnnotation): void {
    this.annotations.set(annotation.id, annotation);
    
    const text = new Text(annotation.text, {
      left: annotation.position.x,
      top: annotation.position.y,
      fontSize: annotation.style.fontSize,
      fontFamily: annotation.style.fontFamily,
      fill: annotation.style.color,
      backgroundColor: annotation.style.backgroundColor
    });

    if (annotation.leader) {
      const leader = new Line([
        annotation.leader.points[0].x,
        annotation.leader.points[0].y,
        annotation.position.x,
        annotation.position.y
      ], {
        stroke: annotation.style.color,
        strokeWidth: 0.5
      });
      this.canvas.add(leader);
    }

    this.canvas.add(text);
  }

  /**
   * Get current canvas as data URL
   */
  public getCanvasDataURL(format: string = 'image/png'): string {
    return this.canvas.toDataURL(format);
  }
}

export default ProfessionalDrawingEngine;