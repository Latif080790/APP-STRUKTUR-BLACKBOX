/**
 * Beam Design Module
 * Flexural, Shear, Deflection, Crack Control (SNI 2847:2019)
 */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';

export interface BeamDesignInput {
  span: number; // m
  width: number; // m
  height: number; // m
  concreteGrade: string;
  fc: number; // MPa
  steelGrade: string;
  fy: number; // MPa
  deadLoad: number; // kN/m
  liveLoad: number; // kN/m
  cover: number; // mm
}

export interface BeamDesignResult {
  Mu: number; // Ultimate moment (kNm)
  Vu: number; // Ultimate shear (kN)
  As: number; // Area of steel (mm2)
  deflection: number; // mm
  crackWidth: number; // mm
  status: string;
}

function calculateBeamDesign(input: BeamDesignInput): BeamDesignResult {
  // Flexural design (simple span, ultimate)
  const wu = 1.2 * input.deadLoad + 1.6 * input.liveLoad; // kN/m
  const Mu = wu * Math.pow(input.span, 2) / 8; // kNm
  // Shear design
  const Vu = wu * input.span / 2; // kN
  // Steel area (As, simplified)
  const d = input.height * 1000 - input.cover; // mm
  const phi = 0.7; // SNI reduction factor
  const As = (Mu * 1e6) / (phi * d * 0.87 * input.fy); // mm2
  // Deflection (simplified)
  const E = 4700 * Math.sqrt(input.fc); // MPa
  const I = (input.width * 1000) * Math.pow(input.height * 1000, 3) / 12; // mm4
  const deflection = (5 * wu * Math.pow(input.span * 1000, 4)) / (384 * E * I); // mm
  // Crack width (very simplified)
  const crackWidth = 0.001 * Mu / (input.width * input.height); // mm
  // Status
  let status = 'OK';
  if (deflection > input.span * 1000 / 250) status = 'Lendutan Berlebih';
  if (crackWidth > 0.3) status = 'Retak Berlebih';
  return { Mu, Vu, As, deflection, crackWidth, status };
}

const BeamDesignModule: React.FC = () => {
  const [input, setInput] = useState<BeamDesignInput>({
    span: 6,
    width: 0.25,
    height: 0.5,
    concreteGrade: 'K-300',
    fc: 25,
    steelGrade: 'BJ-41',
    fy: 410,
    deadLoad: 5,
    liveLoad: 2,
    cover: 30
  });
  const result = calculateBeamDesign(input);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Beam Design Module (SNI 2847:2019)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Span (m)</label>
            <input type="number" value={input.span} onChange={e => setInput({ ...input, span: parseFloat(e.target.value) })} />
            <label>Width (m)</label>
            <input type="number" value={input.width} onChange={e => setInput({ ...input, width: parseFloat(e.target.value) })} />
            <label>Height (m)</label>
            <input type="number" value={input.height} onChange={e => setInput({ ...input, height: parseFloat(e.target.value) })} />
            <label>Concrete Grade</label>
            <input type="text" value={input.concreteGrade} onChange={e => setInput({ ...input, concreteGrade: e.target.value })} />
            <label>fc (MPa)</label>
            <input type="number" value={input.fc} onChange={e => setInput({ ...input, fc: parseFloat(e.target.value) })} />
            <label>Steel Grade</label>
            <input type="text" value={input.steelGrade} onChange={e => setInput({ ...input, steelGrade: e.target.value })} />
            <label>fy (MPa)</label>
            <input type="number" value={input.fy} onChange={e => setInput({ ...input, fy: parseFloat(e.target.value) })} />
            <label>Dead Load (kN/m)</label>
            <input type="number" value={input.deadLoad} onChange={e => setInput({ ...input, deadLoad: parseFloat(e.target.value) })} />
            <label>Live Load (kN/m)</label>
            <input type="number" value={input.liveLoad} onChange={e => setInput({ ...input, liveLoad: parseFloat(e.target.value) })} />
            <label>Cover (mm)</label>
            <input type="number" value={input.cover} onChange={e => setInput({ ...input, cover: parseFloat(e.target.value) })} />
          </div>
          <div>
            <h4>Result</h4>
            <div>Ultimate Moment (Mu): {result.Mu.toFixed(2)} kNm</div>
            <div>Ultimate Shear (Vu): {result.Vu.toFixed(2)} kN</div>
            <div>Required As: {result.As.toFixed(2)} mm²</div>
            <div>Deflection: {result.deflection.toFixed(2)} mm</div>
            <div>Crack Width: {result.crackWidth.toFixed(3)} mm</div>
            <div>Status: <b>{result.status}</b></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeamDesignModule;
