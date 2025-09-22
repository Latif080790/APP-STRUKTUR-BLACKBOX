import { MaterialProperties, ReinforcementDetail, ServiceabilityCheck } from '../interfaces';

export const designColumnReinforcement = (Pu: number, Mu: number, dimension: number, materials: MaterialProperties): Partial<ReinforcementDetail['columnLongitudinal'] & { transverse: ReinforcementDetail['columnTransverse'] }> => {
    const b = dimension;
    const h = dimension;
    const cover = 40;
    const stirrupDia = 10;
    const d = h - cover - stirrupDia - 12; // Assuming D25

    const rhoMin = 0.01;
    let rho = Math.max(rhoMin, Math.min(0.02, Pu / (0.85 * materials.fc * b * h)));
    const Ag = b * h;
    const Ast = rho * Ag;
    const barDia = 25;
    const numberOfBars = Math.ceil(Ast / (Math.PI * barDia * barDia / 4));

    return {
        diameter: barDia,
        count: numberOfBars,
        ratio: Ast / Ag,
        arrangement: `${numberOfBars}D${barDia}`,
        transverse: {
            diameter: stirrupDia,
            spacing: [100, 200],
            confinementZone: Math.max(h, 600)
        }
    };
};

export const designBeamReinforcement = (Mu: number, Vu: number, b: number, h: number, materials: MaterialProperties): Partial<ReinforcementDetail> => {
    const d = h - 60;
    const { fc, fy } = materials;
    const Rn = Mu * 1e6 / (0.9 * b * d * d);
    let rho = 0.85 * fc / fy * (1 - Math.sqrt(1 - 2 * Rn / (0.85 * fc)));
    const AsTension = rho * b * d;
    const tensionBarCount = Math.ceil(AsTension / (Math.PI * 20 * 20 / 4));

    return {
        beamTension: { diameter: 20, count: tensionBarCount, layers: 1, area: AsTension },
        beamCompression: { diameter: 16, count: 2, area: 2 * Math.PI * 16*16/4 },
        beamShear: { diameter: 10, spacing: [150, 300], legs: 2 }
    };
};

export const designSlabReinforcement = (Mu: number, thickness: number, materials: MaterialProperties): Partial<ReinforcementDetail> => {
    const d = thickness - 25;
    const { fc, fy } = materials;
    const Rn = Mu * 1e6 / (0.9 * 1000 * d * d);
    let rho = 0.85 * fc / fy * (1 - Math.sqrt(1 - 2 * Rn / (0.85 * fc)));
    const As = Math.max(0.0018, rho) * 1000 * d;
    const spacing = Math.floor(Math.PI * 10 * 10 / 4 * 1000 / As);

    return {
        slabMain: { diameter: 10, spacing: Math.min(spacing, 200), area: As },
        slabDistribution: { diameter: 8, spacing: 250, area: 0.0018 * 1000 * thickness }
    };
};

export const checkDeflection = (span: number, load: number, I: number, materials: MaterialProperties): ServiceabilityCheck['deflection'] => {
    const E = materials.ec;
    const deltaImmediate = (5 * load * Math.pow(span * 1000, 4)) / (384 * E * I);
    const deltaLongTerm = deltaImmediate * 2.0;
    const allowable = span * 1000 / 240;
    return {
        immediate: deltaImmediate,
        longTerm: deltaLongTerm,
        allowable: allowable,
        ratio: deltaLongTerm / allowable,
        status: deltaLongTerm <= allowable ? 'OK' : 'NOT OK'
    };
};

export const checkCrackWidth = (fs: number, dc: number, A: number, materials: MaterialProperties): ServiceabilityCheck['crack'] => {
    const w = 11 * 1.2 * fs / materials.es * Math.pow(dc * A, 1/3) * 1e-3;
    const allowable = 0.3;
    return { width: w, allowable, status: w <= allowable ? 'OK' : 'NOT OK' };
};

export const checkVibration = (mass: number, stiffness: number): ServiceabilityCheck['vibration'] => {
    const frequency = Math.sqrt(stiffness / mass) / (2 * Math.PI);
    const acceleration = 0.5; // Simplified
    const minFrequency = 3;
    return {
        frequency,
        acceleration,
        status: frequency >= minFrequency ? 'OK' : 'NOT OK'
    };
};
