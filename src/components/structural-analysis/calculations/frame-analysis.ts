import { Geometry, Structure3D, FrameAnalysisResult, LateralForce, MaterialProperties } from '../interfaces';

export const generate3DStructure = (geometry: Geometry): Structure3D => {
    const nodes: Structure3D['nodes'] = [];
    const elements: Structure3D['elements'] = [];
    let nodeId = 0;
    let elementId = 0;

    const { columnGridX = 1, columnGridY = 1 } = geometry;

    const nodesPerFloor = (columnGridX + 1) * (columnGridY + 1);

    for (let floor = 0; floor <= geometry.numberOfFloors; floor++) {
        for (let y = 0; y <= columnGridY; y++) {
            for (let x = 0; x <= columnGridX; x++) {
                nodes.push({
                    id: nodeId++,
                    x: x * geometry.baySpacingX,
                    y: y * geometry.baySpacingY,
                    z: floor * geometry.heightPerFloor,
                    type: floor === 0 ? 'fixed' : 'free'
                });
            }
        }
    }

    for (let floor = 0; floor < geometry.numberOfFloors; floor++) {
        for (let i = 0; i < nodesPerFloor; i++) {
            elements.push({
                id: elementId++,
                type: 'column',
                startNode: floor * nodesPerFloor + i,
                endNode: (floor + 1) * nodesPerFloor + i,
                section: '400x400',
                material: 'C25'
            });
        }
    }

    return { nodes, elements, loads: [] };
};

export const performFrameAnalysis = (
  structure: Structure3D,
  geometry: Geometry,
  lateralForces?: LateralForce[] | null,
  materials?: MaterialProperties
): FrameAnalysisResult => {
    const nFloors = geometry.numberOfFloors;
    const h = geometry.heightPerFloor; // m

    let storyDriftsM: number[] | null = null;
    let floorDispM: number[] | null = null;

    if (lateralForces && lateralForces.length > 0 && materials) {
        // Simple shear-building model per story: k_story = sum(12 E I / h^3) over columns
        const nColumns = ((geometry.columnGridX ?? 1) + 1) * ((geometry.columnGridY ?? 1) + 1);
        // Parse section dimensions from the first column element if available, else assume 0.4 x 0.4 m
        let b = 0.4; // m
        let d = 0.4; // m
        const anyColumn = structure.elements.find(e => e.type === 'column');
        if (anyColumn && anyColumn.section) {
            const m = anyColumn.section.match(/(\d+)x(\d+)/i);
            if (m) {
                b = parseInt(m[1], 10) / 1000;
                d = parseInt(m[2], 10) / 1000;
            }
        }
        const I = (b * Math.pow(d, 3)) / 12; // m^4
        const E = materials.ec * 1000; // MPa -> kN/m^2
        const kCol = 12 * E * I / Math.pow(h, 3); // kN/m per column (fixed-fixed approx)
        const kStory = nColumns * kCol; // kN/m

        // Compute story shears (from top down)
        const forcesByFloor = new Array(nFloors + 1).fill(0);
        lateralForces.forEach(f => { if (f.floor >= 1 && f.floor <= nFloors) forcesByFloor[f.floor] += f.force; });
        const storyShear: number[] = new Array(nFloors + 1).fill(0);
        for (let i = nFloors; i >= 1; i--) {
            storyShear[i] = (storyShear[i + 1] || 0) + forcesByFloor[i];
        }

        storyDriftsM = new Array(nFloors + 1).fill(0);
        for (let i = 1; i <= nFloors; i++) {
            storyDriftsM[i] = storyShear[i] / kStory; // m
        }
        floorDispM = new Array(nFloors + 1).fill(0);
        for (let i = 1; i <= nFloors; i++) {
            floorDispM[i] = floorDispM[i - 1] + storyDriftsM[i];
        }
    }

    const displacements = structure.nodes.map(node => {
        const level = Math.round(node.z / h); // 0..nFloors
        let dx_mm = 0;
        if (floorDispM && level >= 0 && level <= nFloors) {
            dx_mm = (floorDispM[level] || 0) * 1000; // convert to mm
        } else {
            // fallback randomized small displacement
            dx_mm = Math.random() * 5 * (node.z / (nFloors * h));
        }
        return {
            node: node.id,
            dx: dx_mm,
            dy: 0,
            dz: 0,
            rotation: 0,
        };
    });

    const memberForces = structure.elements.map(element => ({
        element: element.id,
        axial: 500 + Math.random() * 500,
        shearY: 100 + Math.random() * 100,
        shearZ: 100 + Math.random() * 100,
        momentY: 150 + Math.random() * 150,
        momentZ: 150 + Math.random() * 150,
        torsion: 20 + Math.random() * 20
    }));

    const reactions = structure.nodes
        .filter(node => node.type === 'fixed')
        .map(node => ({
            node: node.id,
            fx: 200 + Math.random() * 300,
            fy: 200 + Math.random() * 300,
            fz: 1000 + Math.random() * 1000,
            mx: 50 + Math.random() * 50,
            my: 50 + Math.random() * 50,
            mz: 50 + Math.random() * 50
        }));

    let maxDrift = 0;
    if (storyDriftsM) {
        maxDrift = Math.max(...storyDriftsM.map(v => v || 0)) / h; // ratio
    } else {
        maxDrift = Math.max(...displacements.map(d => d.dx)) / (h * 1000);
    }

    return {
        displacements,
        memberForces,
        reactions,
        maxDrift,
        maxStress: 0.85 // Mock value
    };
};
