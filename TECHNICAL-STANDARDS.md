# 📐 TECHNICAL STANDARDS REFERENCE - SNI COMPLIANCE

**⚠️ CRITICAL ENGINEERING STANDARDS - NO TOLERANCE FOR ERRORS**

*Dokumen ini berisi parameter teknis yang HARUS dipatuhi sesuai standar Indonesia dan internasional untuk memastikan keselamatan struktur.*

---

## 🚨 DISCLAIMER KESELAMATAN

**PERINGATAN:** Parameter dalam dokumen ini berdasarkan standar resmi Indonesia (SNI) dan standar internasional. Setiap penyimpangan dari parameter ini dapat mengakibatkan:
- Kegagalan struktural 
- Bahaya keselamatan jiwa
- Ketidakpatuhan terhadap building code
- Masalah legal dan professional liability

---

## 📊 1. SEISMIC PARAMETERS (SNI 1726:2019)

### ❌ SISTEM LAMA (SALAH):
```
Seismic Zone 1-6 (Sudah tidak digunakan sejak 2019)
```

### ✅ SISTEM BARU (SNI 1726:2019):

#### A. PARAMETER PERCEPATAN GEMPA
```
PARAMETER DASAR (MCE - Maximum Considered Earthquake):
├── Ss (Short period spectral acceleration): 0.4 - 1.5g
├── S1 (1-second spectral acceleration): 0.1 - 0.6g
├── PGA (Peak Ground Acceleration): 0.1 - 0.8g
└── CRS (Coefficient for Risk Category): 1.0 - 1.5

SITE COEFFICIENTS (Berdasarkan Site Class):
Site Class SA (Hard Rock):     Fa = 0.8,  Fv = 0.8
Site Class SB (Rock):          Fa = 1.0,  Fv = 1.0  
Site Class SC (Very Dense):    Fa = 1.2,  Fv = 1.8
Site Class SD (Stiff Soil):    Fa = 1.6,  Fv = 2.4
Site Class SE (Soft Clay):     Fa = 2.5,  Fv = 3.5
Site Class SF (Special Study)
```

#### B. DESIGN SPECTRUM PARAMETERS
```
SDS = (2/3) × Fa × Ss  (Design short period acceleration)
SD1 = (2/3) × Fv × S1  (Design 1-second acceleration)

THRESHOLDS (SNI 1726:2019 Tabel 7):
├── SDS < 0.167g: Kategori Risiko Seismik A
├── SDS < 0.33g:  Kategori Risiko Seismik B
├── SDS < 0.50g:  Kategori Risiko Seismik C  
└── SDS ≥ 0.50g:  Kategori Risiko Seismik D
```

#### C. STRUCTURAL SYSTEM PARAMETERS
```
RESPONSE MODIFICATION FACTOR (R):
├── SRPMK (Special RC Moment Frame): R = 8.0
├── SRPMM (Intermediate RC Frame): R = 5.0
├── SRPMB (Ordinary RC Frame): R = 3.0
├── SRBK (Special RC Shear Wall): R = 5.0
├── SPBK (Special Steel Moment Frame): R = 8.0
└── SPBM (Intermediate Steel Frame): R = 4.5

DEFLECTION AMPLIFICATION (Cd):
├── Special Moment Frame: Cd = 5.5
├── Intermediate Frame: Cd = 4.5  
├── Ordinary Frame: Cd = 2.5
└── Shear Wall System: Cd = 4.0

OVERSTRENGTH FACTOR (Ω0):
├── Special Moment Frame: Ω0 = 3.0
├── Intermediate Frame: Ω0 = 2.5
└── Ordinary Frame: Ω0 = 2.5
```

---

## 🏗️ 2. MATERIAL PROPERTIES (SNI 2847:2019 & SNI 1729:2020)

### A. CONCRETE SPECIFICATIONS

#### STRENGTH REQUIREMENTS:
```
MINIMUM COMPRESSIVE STRENGTH:
├── Non-structural: fc' ≥ 17 MPa
├── Structural (Normal): fc' = 20, 25, 30, 35 MPa
├── High Strength: fc' = 40, 45, 50 MPa
└── Ultra High: fc' > 50 MPa (Special provisions)

MODULUS OF ELASTICITY:
Ec = 4700√(fc') MPa (Normal weight concrete)

DENSITY:
├── Normal weight: 2200-2400 kg/m³
├── Lightweight: 1400-1800 kg/m³
└── Heavyweight: 2400-3200 kg/m³
```

#### REINFORCEMENT STEEL:
```
REBAR GRADES (SNI 2052:2017):
├── BjTP-24: fy = 240 MPa, fu = 370 MPa
├── BjTS-40: fy = 400 MPa, fu = 560 MPa  
└── BjTS-50: fy = 500 MPa, fu = 650 MPa

MODULUS OF ELASTICITY:
Es = 200,000 MPa (All grades)
```

### B. STRUCTURAL STEEL (SNI 1729:2020)

#### STEEL GRADES:
```
CARBON STEEL:
├── BJ-34: fy = 210 MPa, fu = 340 MPa
├── BJ-37: fy = 240 MPa, fu = 370 MPa
├── BJ-41: fy = 250 MPa, fu = 410 MPa
└── BJ-50: fy = 290 MPa, fu = 500 MPa

HIGH STRENGTH STEEL:
├── A572 Gr.50: fy = 345 MPa, fu = 450 MPa
└── A992: fy = 345 MPa, fu = 450 MPa

MODULUS OF ELASTICITY:
E = 200,000 MPa (All steel grades)
```

---

## ⚖️ 3. LOAD CLASSIFICATIONS (SNI 1727:2020)

### A. DEAD LOADS (BEBAN MATI)

#### STRUCTURAL MATERIALS:
```
UNIT WEIGHTS (kN/m³):
├── Reinforced Concrete: 24.0 kN/m³
├── Plain Concrete: 22.0 kN/m³
├── Structural Steel: 78.5 kN/m³
├── Aluminum: 27.0 kN/m³
├── Masonry (Hollow): 14.0 kN/m³
├── Masonry (Solid): 22.0 kN/m³
├── Timber (Hardwood): 8.0 kN/m³
└── Timber (Softwood): 5.0 kN/m³
```

#### ARCHITECTURAL COMPONENTS:
```
FLOOR FINISHES (kN/m²):
├── Ceramic tile + mortar (2cm): 0.44 kN/m²
├── Terrazzo + mortar (3cm): 0.67 kN/m²
├── Marble + mortar (3cm): 0.78 kN/m²
├── Hardwood flooring (2cm): 0.16 kN/m²
├── Carpet + padding: 0.05 kN/m²
└── Vinyl flooring: 0.02 kN/m²

CEILING SYSTEMS:
├── Suspended acoustic tile: 0.10 kN/m²
├── Gypsum board (1.2cm): 0.10 kN/m²
├── Plaster on lath: 0.34 kN/m²
└── Suspended grid system: 0.05 kN/m²

PARTITIONS:
├── Drywall partition (10cm): 0.48 kN/m²
├── Masonry partition (10cm): 1.90 kN/m²
├── Masonry partition (15cm): 2.80 kN/m²
└── Glazed partition: 0.38 kN/m²

MEP SYSTEMS:
├── HVAC ducting: 0.15-0.25 kN/m²
├── Electrical systems: 0.05-0.10 kN/m²
├── Plumbing (typical): 0.05-0.15 kN/m²
└── Fire protection: 0.05-0.10 kN/m²
```

### B. LIVE LOADS (BEBAN HIDUP)

#### BY OCCUPANCY TYPE (SNI 1727:2020 Table 4-1):
```
RESIDENTIAL:
├── Apartments/Hotels: 1.9 kN/m²
├── Dormitories: 1.9 kN/m²  
├── Single family: 1.9 kN/m²
└── Balconies: 2.9 kN/m²

OFFICE BUILDINGS:
├── Office spaces: 2.4 kN/m²
├── Computer rooms: 2.4 kN/m²
├── File rooms: 4.8 kN/m²
└── Lobbies: 4.8 kN/m²

EDUCATIONAL:
├── Classrooms: 2.9 kN/m²
├── Corridors/stairs: 4.8 kN/m²
├── Libraries - reading: 2.9 kN/m²
├── Libraries - stack: 7.2 kN/m²
└── Gymnasiums: 4.8 kN/m²

COMMERCIAL:
├── Retail stores: 4.8 kN/m²
├── Shopping centers: 4.8 kN/m²
├── Restaurants: 4.8 kN/m²
├── Theaters - fixed seats: 2.9 kN/m²
└── Theaters - movable seats: 4.8 kN/m²

INDUSTRIAL:
├── Light manufacturing: 6.0 kN/m²
├── Heavy manufacturing: 12.0 kN/m²
├── Warehouses - light: 6.0 kN/m²
└── Warehouses - heavy: 12.0 kN/m²

SPECIAL OCCUPANCY:
├── Parking garages - cars: 2.4 kN/m²
├── Parking garages - trucks: 11.0 kN/m²
├── Hospitals: 2.9 kN/m²
└── Jails/prisons: 2.9 kN/m²
```

#### ROOF LIVE LOADS:
```
ROOF SLOPES:
├── Slope < 4°: 1.0 kN/m²
├── Slope 4°-20°: Interpolate linearly
├── Slope > 20°: 0.6 kN/m²
└── Snow loads: Per local climate data

REDUCTIONS:
├── At = Tributary area for member
├── Lr = L0 × R1 × R2 (Reduced roof live load)
├── R1 = 1.0 - 0.001At (≥ 0.6)
└── R2 = 1.2 - 0.05F (F = rise/span ratio)
```

### C. WIND LOADS (SNI 1727:2020)

#### BASIC PARAMETERS:
```
BASIC WIND SPEEDS (3-second gust):
├── Jakarta/Coastal: 35-40 m/s
├── Inland cities: 30-35 m/s
├── Mountainous: 35-45 m/s
└── Special locations: Site-specific study

EXPOSURE CATEGORIES:
├── Exposure A (Center of cities): Rarely used
├── Exposure B (Urban/suburban): Most common
├── Exposure C (Open terrain): Rural areas
└── Exposure D (Flat coastal): Waterfront

IMPORTANCE FACTORS:
├── Category I: Ie = 0.87 (Agricultural, minor)
├── Category II: Ie = 1.00 (Normal occupancy)
├── Category III: Ie = 1.15 (Assembly, schools)
└── Category IV: Ie = 1.15 (Essential facilities)
```

---

## 🏗️ 4. FOUNDATION PARAMETERS

### A. SOIL INVESTIGATION REQUIREMENTS

#### SPT (STANDARD PENETRATION TEST) VALUES:
```
CONSISTENCY/DENSITY CLASSIFICATION:
├── N-SPT = 0-4: Very loose/soft (Require deep foundation)
├── N-SPT = 4-10: Loose/soft (Deep foundation recommended)  
├── N-SPT = 10-30: Medium dense/firm (Shallow/pile options)
├── N-SPT = 30-50: Dense/hard (Shallow foundation suitable)
└── N-SPT > 50: Very dense/hard (Shallow preferred)

ALLOWABLE BEARING CAPACITY (Terzaghi):
qa = (N/8) × (B+0.3)²/B² × Df/B (For B ≤ 1.2m)
qa = (N/12) × (B+0.3)²/B² × Df/B (For B > 1.2m)
```

### B. PILE FOUNDATION STANDARDS

#### STANDARD PILE SIZES:
```
BORED PILES (Diameter):
├── Small: 30, 40, 50 cm
├── Medium: 60, 80 cm
├── Large: 100, 120, 150 cm
└── Special: 200+ cm (with special design)

DRIVEN PILES (Square/Circular):
├── Precast concrete: 25×25, 30×30, 35×35, 40×40 cm
├── Steel H-piles: HP200×200, HP250×250, HP300×300
├── Steel pipe: Ø30, Ø35, Ø40, Ø50 cm
└── Prestressed concrete: Ø30, Ø40, Ø50 cm

MICRO PILES:
├── Diameter: 10, 15, 20, 25 cm
├── Steel casing + grout
└── For limited access/low headroom
```

#### CAPACITY CALCULATIONS:
```
ULTIMATE CAPACITY:
Qu = Qp + Qs = Ap×qp + As×qs

SKIN FRICTION (Clay):
qs = α × Su (α = adhesion factor)

SKIN FRICTION (Sand):  
qs = β × σ'v (β = 0.15-0.4)

END BEARING:
qp = Nc × Su (Clay)
qp = Nq × σ'v (Sand)

ALLOWABLE CAPACITY:
Qa = Qu / FS (FS = 2.0-3.0)
```

### C. FOUNDATION SELECTION CRITERIA

#### TECHNICAL DECISION MATRIX:
```
SELECT SHALLOW FOUNDATION IF:
├── N-SPT > 30 at foundation depth
├── Bearing capacity > Required load × 3.0
├── Settlement < 25mm total, <20mm differential
├── No soft layers within 3B depth
└── Groundwater below foundation level

SELECT DEEP FOUNDATION IF:
├── N-SPT < 10 in bearing layer
├── Soft clay layers present
├── High building loads (>500 kN/m²)
├── Settlement > 25mm predicted
└── Liquefaction potential exists

BORED PILE SELECTION:
├── N-SPT < 15 and high building loads
├── Vibration-sensitive adjacent structures
├── Variable pile lengths needed
├── Large diameter requirements (>60cm)
└── Rock socket connections needed

DRIVEN PILE SELECTION:
├── N-SPT > 15 with dense bearing layer
├── Rapid installation required
├── Standard lengths acceptable
├── Cost optimization priority
└── Proven local experience
```

---

## 📐 5. SAFETY FACTORS (SNI 2847:2019)

### A. STRENGTH REDUCTION FACTORS (φ)

#### CONCRETE ELEMENTS:
```
FLEXURAL MEMBERS:
├── φ = 0.90 (Tension controlled, εt ≥ 0.005)
├── φ = 0.75-0.90 (Transition zone)
└── φ = 0.65 (Compression controlled, εt ≤ 0.002)

COMPRESSION MEMBERS:
├── φ = 0.75 (Spiral reinforced)
├── φ = 0.65 (Tied reinforced)  
└── φ = 0.65 (Cast-in-place composite)

SHEAR AND TORSION:
├── φ = 0.75 (Normal weight concrete)
├── φ = 0.70 (Lightweight concrete - all sand)
└── φ = 0.65 (Lightweight concrete - all lightweight)

BEARING ON CONCRETE:
├── φ = 0.65 (On loaded area)
├── φ = 0.65 (On supporting area)
└── φ = 0.65 (Post-tensioned anchorage zones)

STRUT-AND-TIE MODELS:
├── φ = 0.75 (Nodal zones, struts, ties)
├── φ = 0.90 (Steel yielding in ties)
└── φ = 0.75 (Concrete crushing in struts)
```

### B. LOAD FACTORS (LRFD METHOD)

#### LOAD COMBINATIONS (SNI 1727:2020):
```
STRENGTH DESIGN:
1. U = 1.4D
2. U = 1.2D + 1.6L + 0.5(Lr or S or R)
3. U = 1.2D + 1.6(Lr or S or R) + (0.5L or 0.8W)
4. U = 1.2D ± 1.0E + 0.5L + 0.2S
5. U = 0.9D ± 1.0E
6. U = 1.2D + 1.0W + 0.5L + 0.5(Lr or S or R)
7. U = 0.9D + 1.0W

NOTATION:
D = Dead Load, L = Live Load
Lr = Roof Live, S = Snow, R = Rain
E = Earthquake, W = Wind
```

---

## 🏢 6. STRUCTURAL SYSTEMS CLASSIFICATION

### A. MOMENT FRAME SYSTEMS

#### REINFORCED CONCRETE:
```
SRPMK (Special RC Moment Frame):
├── R = 8.0, Cd = 5.5, Ω0 = 3.0
├── Seismic Design Category D, E, F
├── Special detailing requirements
├── Beam-column joint shear reinforcement
├── Closely spaced transverse reinforcement
└── Strong column-weak beam design

SRPMM (Intermediate RC Frame):
├── R = 5.0, Cd = 4.5, Ω0 = 2.5  
├── Seismic Design Category B, C
├── Moderate detailing requirements
├── Standard joint reinforcement
└── Standard transverse reinforcement

SRPMB (Ordinary RC Frame):
├── R = 3.0, Cd = 2.5, Ω0 = 2.5
├── Seismic Design Category A, B
├── Minimum detailing requirements
└── Standard building code provisions
```

### B. SHEAR WALL SYSTEMS

#### REINFORCED CONCRETE:
```
SRBK (Special RC Shear Wall):
├── R = 5.0-6.0, Cd = 4.0-5.0
├── Special boundary elements
├── Confined boundary regions
├── Distributed reinforcement requirements
└── Coupling beam special detailing

SRBM (Intermediate RC Shear Wall):
├── R = 4.0, Cd = 4.0
├── Standard reinforcement
└── Limited ductility design

SRBB (Ordinary RC Shear Wall):
├── R = 2.5, Cd = 2.5
├── Minimum reinforcement ratio
└── Elastic design approach
```

---

## 🔍 7. QUALITY CONTROL REQUIREMENTS

### A. CONCRETE QUALITY

#### TESTING REQUIREMENTS:
```
COMPRESSIVE STRENGTH:
├── Minimum 2 specimens per 100m³
├── Minimum 2 specimens per day
├── Test at 7, 28 days (standard)
├── Additional tests at 3, 56, 91 days if required
└── Core testing if strength deficient

SLUMP TEST:
├── Each truck load
├── Beginning, middle, end of pour
├── Target slump ± 25mm
└── Reject if outside specification

TEMPERATURE:
├── Concrete temperature: 10-32°C
├── Ambient temperature: >5°C
├── No freezing for 48 hours minimum
└── Hot weather precautions >30°C
```

### B. STEEL QUALITY

#### MILL CERTIFICATES:
```
REQUIRED DATA:
├── Chemical composition
├── Mechanical properties (fy, fu, elongation)  
├── Heat treatment details
├── Dimensional tolerances
└── Test method compliance

FIELD TESTING:
├── Tensile test (random sampling)
├── Bend test for ductility
├── Chemical analysis if questioned
└── Dimensional verification
```

---

## ⚠️ CRITICAL COMPLIANCE NOTES

### 1. NO INTERPOLATION ALLOWED
- Use exact values from tables
- No rounding of safety-critical parameters
- Conservative approach for intermediate values

### 2. PROFESSIONAL OVERSIGHT REQUIRED
- Licensed engineer review mandatory
- Peer review for critical structures
- Building official approval required
- Professional liability insurance

### 3. DOCUMENTATION REQUIREMENTS
- Complete design calculations
- Material specifications and test reports
- Construction drawings with details
- Quality assurance/quality control plans
- As-built documentation

### 4. PERIODIC UPDATES
- Monitor code changes annually
- Update parameters immediately when codes revised
- Professional development for new standards
- System validation with latest requirements

---

**📋 REFERENCE STANDARDS:**
- SNI 1726:2019 - Tata cara perencanaan ketahanan gempa
- SNI 1727:2020 - Beban desain minimum untuk bangunan gedung
- SNI 2847:2019 - Persyaratan beton struktural untuk bangunan gedung
- SNI 1729:2020 - Spesifikasi untuk bangunan gedung baja struktural
- ACI 318-19 - Building Code Requirements for Structural Concrete
- AISC 360-16 - Specification for Structural Steel Buildings

**⚖️ LEGAL DISCLAIMER:**
This document provides technical guidance based on current standards. Professional engineering judgment and local authority approval are required for all structural design applications. Users assume full responsibility for proper implementation and compliance.

---

*Document prepared in accordance with Indonesian National Standards (SNI) and International Engineering Standards. Last updated: September 2025.*