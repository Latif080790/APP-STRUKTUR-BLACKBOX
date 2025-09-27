# 🏗️ Workflow Sistem Analisis Struktural

## Overview
Sistem Analisis Struktural APP-STRUKTUR-BLACKBOX adalah platform komprehensif untuk analisis dan desain struktur bangunan dengan teknologi React + TypeScript yang terintegrasi dengan visualisasi 3D.

---

## 📋 Table of Contents
- [1. Persiapan Sistem](#1-persiapan-sistem)
- [2. Input Data Proyek](#2-input-data-proyek)
- [3. Konfigurasi Geometri](#3-konfigurasi-geometri)
- [4. Pemilihan Material](#4-pemilihan-material)
- [5. Analisis Beban](#5-analisis-beban)
- [6. Pengaturan Seismik](#6-pengaturan-seismik)
- [7. Eksekusi Analisis](#7-eksekusi-analisis)
- [8. Visualisasi 3D](#8-visualisasi-3d)
- [9. Hasil & Laporan](#9-hasil--laporan)
- [10. Export & Documentation](#10-export--documentation)

---

## 1. Persiapan Sistem

### 1.1 Installation & Setup
```bash
# Clone repository
git clone https://github.com/Latif080790/APP-STRUKTUR-BLACKBOX.git
cd APP-STRUKTUR-BLACKBOX

# Install dependencies
npm install

# Start development server
npm run dev
```

### 1.2 System Requirements
- **Node.js**: v16.0.0 atau lebih tinggi
- **NPM**: v8.0.0 atau lebih tinggi
- **Browser**: Chrome, Firefox, Safari (WebGL support)
- **Memory**: Minimum 8GB RAM untuk analisis kompleks
- **Storage**: 2GB free space untuk cache dan reports

### 1.3 Pre-Analysis Checklist
- [ ] Verifikasi koneksi internet untuk library dependencies
- [ ] Pastikan browser mendukung WebGL untuk 3D visualization
- [ ] Siapkan data teknis proyek (drawings, specifications)
- [ ] Review standar dan regulasi yang berlaku

---

## 2. Input Data Proyek

### 2.1 Informasi Dasar Proyek
**Tab: Project Info**

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| Project Name | Nama proyek | "Gedung Perkantoran ABC" | ✅ |
| Location | Lokasi proyek | "Jakarta Selatan, DKI Jakarta" | ✅ |
| Engineer | Engineer penanggung jawab | "John Doe, ST, MT" | ✅ |
| Date | Tanggal analisis | "2025-09-27" | ✅ |
| Description | Deskripsi proyek | "Bangunan komersial 15 lantai" | ⭕ |

### 2.2 Best Practices
- Gunakan naming convention yang konsisten
- Sertakan informasi koordinat GPS jika tersedia
- Dokumentasikan revisi dan perubahan
- Backup data input secara berkala

---

## 3. Konfigurasi Geometri

### 3.1 Dimensi Bangunan
**Tab: Geometry**

```
🏢 Building Dimensions:
┌─────────────────────┐
│ Length (m): 30.0    │
│ Width (m): 20.0     │ 
│ Height/Floor: 3.5   │
│ Floors: 10          │
└─────────────────────┘
```

### 3.2 Grid System Configuration

| Parameter | Range | Recommended | Impact |
|-----------|-------|-------------|--------|
| Bay Spacing X | 3.0 - 8.0m | 6.0m | Structural efficiency |
| Bay Spacing Y | 3.0 - 8.0m | 6.0m | Column layout |
| Column Grid X | 3 - 10 | 5 | Analysis precision |
| Column Grid Y | 3 - 10 | 4 | Computational load |

### 3.3 Geometric Validation Rules
- **Aspect Ratio**: Length/Width tidak melebihi 3:1
- **Slenderness**: Height/Width tidak melebihi 5:1
- **Bay Spacing**: Konsisten untuk optimasi struktural
- **Floor Height**: Minimum 2.5m, maksimum 5.0m

---

## 4. Pemilihan Material

### 4.1 Material Selection Matrix
**Tab: Material Selection**

| Building Type | Floors | Recommended Material | Foundation |
|---------------|--------|---------------------|------------|
| Residential | 1-5 | Concrete | Shallow/Pile |
| Commercial | 6-15 | Concrete-Steel | Pile Cap |
| High-rise | 16+ | Steel-Composite | Deep Foundation |

### 4.2 Advanced Material Configuration

#### 4.2.1 Concrete Properties
```
Primary Structure: Concrete
├── f'c: 25-35 MPa
├── fy: 400 MPa (rebar)
├── Density: 2400 kg/m³
└── Applications: Low-mid rise, cost effective
```

#### 4.2.2 Steel Properties
```
Primary Structure: Steel
├── Fy: 250-400 MPa
├── Fu: 370-550 MPa
├── Density: 7850 kg/m³
└── Applications: High-rise, long spans
```

### 4.3 Foundation Selection Logic

#### 4.3.1 Bored Pile Criteria
**Dipilih jika:**
- Tanah lunak/berair (`poor`, `very-poor`)
- Bangunan tinggi (≥8 lantai)
- Area sensitif getaran
- Fleksibilitas diameter/kedalaman

```
Bored Pile Specifications:
├── Diameter: 0.5 - 0.8m
├── Length: 20 - 30m  
├── Material: Concrete K-300
└── Installation: Low vibration
```

#### 4.3.2 Driven Pile Criteria
**Dipilih jika:**
- Tanah keras (`good`)
- Beban struktural tinggi (>150 kN/m²)
- Bangunan ≤6 lantai
- Instalasi cepat diperlukan

```
Driven Pile Specifications:
├── Diameter: 0.4m (standard)
├── Length: 15m
├── Material: Concrete K-350
└── Installation: Fast, economical
```

---

## 5. Analisis Beban

### 5.1 Load Categories
**Tab: Loads**

#### 5.1.1 Dead Load (Beban Mati)
| Component | Load Range | Typical Value |
|-----------|------------|---------------|
| Structure | 3.0 - 6.0 kN/m² | 4.5 kN/m² |
| Floor Finish | 0.5 - 2.0 kN/m² | 1.0 kN/m² |
| Ceiling/MEP | 0.3 - 1.0 kN/m² | 0.5 kN/m² |
| Partitions | 0.5 - 2.0 kN/m² | 1.0 kN/m² |

#### 5.1.2 Live Load (Beban Hidup)
| Occupancy | Live Load | Roof Live Load |
|-----------|-----------|----------------|
| Residential | 2.0 kN/m² | 1.0 kN/m² |
| Office | 2.5 kN/m² | 1.0 kN/m² |
| Commercial | 4.0 kN/m² | 1.5 kN/m² |
| Storage | 5.0 kN/m² | 1.5 kN/m² |

### 5.2 Environmental Loads

#### 5.2.1 Wind Load
```
Wind Analysis:
├── Basic Wind Speed: 25-40 m/s
├── Exposure Category: B (Urban)
├── Importance Factor: 1.0-1.15
└── Directionality: X & Y directions
```

#### 5.2.2 Seismic Load
```
Seismic Parameters:
├── Zone Factor (Z): 0.1-0.4
├── Site Class: SC (Medium soil)
├── Response Modifier (R): 8.0
└── Importance Factor: 1.0-1.25
```

---

## 6. Pengaturan Seismik

### 6.1 Seismic Zone Classification
**Tab: Seismic Parameters**

| Zone | PGA | Risk Level | Design Requirements |
|------|-----|------------|-------------------|
| 1-2 | <0.15g | Low | Basic seismic design |
| 3-4 | 0.15-0.3g | Moderate | Enhanced detailing |
| 5-6 | >0.3g | High | Special provisions |

### 6.2 Site Classification Effects

#### 6.2.1 Soil Condition Impact
```
Soil Condition Assessment:
├── Good (Hard Rock/Dense Soil)
│   ├── Site Amplification: Low
│   ├── Foundation: Shallow possible
│   └── Seismic Response: Minimal
├── Medium (Stiff Soil)  
│   ├── Site Amplification: Moderate
│   ├── Foundation: Pile recommended
│   └── Seismic Response: Standard
├── Poor (Soft Clay)
│   ├── Site Amplification: High
│   ├── Foundation: Deep pile required
│   └── Seismic Response: Critical
└── Very Poor (Organic/Loose)
    ├── Site Amplification: Very High
    ├── Foundation: Special design
    └── Seismic Response: Extreme care
```

---

## 7. Eksekusi Analisis

### 7.1 Analysis Workflow
**Tab: Analysis**

```
📊 Analysis Progress:
[████████████████████████████████████████] 100%

Phase 1: Input Validation     ✅ Complete
Phase 2: Model Generation     ✅ Complete  
Phase 3: Load Combinations    ✅ Complete
Phase 4: Matrix Assembly      ✅ Complete
Phase 5: Solution Process     ✅ Complete
Phase 6: Results Processing   ✅ Complete
```

### 7.2 Analysis Steps Detail

#### 7.2.1 Pre-Processing
1. **Input Validation**
   - Geometric consistency check
   - Material property validation
   - Load magnitude verification
   - Code compliance review

2. **Model Generation**
   - Node coordinate calculation
   - Element connectivity matrix
   - Support condition assignment
   - Constraint application

#### 7.2.2 Processing
3. **Load Case Assembly**
   - Dead load calculation
   - Live load distribution
   - Wind load analysis
   - Seismic load evaluation

4. **Structural Analysis**
   - Stiffness matrix formulation
   - Linear elastic analysis
   - Dynamic analysis (if required)
   - Stability check

#### 7.2.3 Post-Processing
5. **Results Calculation**
   - Displacement computation
   - Force/moment extraction
   - Stress analysis
   - Deflection check

6. **Design Verification**
   - Code compliance check
   - Safety factor validation
   - Serviceability verification
   - Optimization suggestions

### 7.3 Analysis Validation

#### 7.3.1 Convergence Criteria
- **Displacement**: Tolerance < 0.1mm
- **Force**: Tolerance < 0.1%
- **Energy**: Tolerance < 0.01%
- **Iteration**: Maximum 1000 cycles

#### 7.3.2 Quality Assurance
- Mass participation > 90% (seismic)
- Period check (T1 = 0.1n for concrete)
- Drift limitation < H/500
- Foundation pressure < allowable

---

## 8. Visualisasi 3D

### 8.1 3D Viewer Features
**Tab: 3D Visualization**

#### 8.1.1 View Controls
```
🎮 Navigation Controls:
├── Rotate: Left Mouse + Drag
├── Pan: Right Mouse + Drag
├── Zoom: Mouse Wheel
└── Reset: Double Click
```

#### 8.1.2 Display Options
| Feature | Description | Toggle |
|---------|-------------|--------|
| Wireframe | Structure outline | W |
| Solid | Filled elements | S |
| Transparency | See-through mode | T |
| Annotations | Label display | A |

### 8.2 Material Visualization

#### 8.2.1 Visual Material Properties
```
Material Rendering:
├── Concrete: Gray/Solid appearance
├── Steel: Metallic/Reflective surface  
├── Composite: Mixed texture
└── Foundation: Earth-tone colors
```

#### 8.2.2 Foundation Elements
```
Foundation 3D Representation:
├── Pile Caps: Rectangular blocks at base
├── Bored Piles: Cylindrical elements (Ø0.5-0.8m)
├── Driven Piles: Standard cylinders (Ø0.4m)
└── Pedestals: Tapered connection elements
```

### 8.3 Analysis Results Overlay

#### 8.3.1 Deformation Display
- **Scale Factor**: Adjustable (1x - 1000x)
- **Color Coding**: Rainbow spectrum
- **Animation**: Time-history playback
- **Contour Lines**: Iso-displacement curves

#### 8.3.2 Force Diagrams
- **Moment Diagrams**: Bending moment visualization
- **Shear Diagrams**: Shear force distribution
- **Axial Forces**: Compression/tension display
- **Stress Contours**: Element stress levels

---

## 9. Hasil & Laporan

### 9.1 Results Summary
**Tab: Results**

#### 9.1.1 Key Performance Indicators
```
📊 Structural Performance Summary:
┌─────────────────────────────────────┐
│ Maximum Displacement: 12.5mm (OK)  │
│ Maximum Drift Ratio: 1/850 (OK)    │
│ Base Shear: 2,450 kN              │
│ Maximum Column Force: 1,250 kN     │
│ Foundation Pressure: 180 kN/m²     │
│ Natural Period T1: 1.2 sec         │
└─────────────────────────────────────┘
```

#### 9.1.2 Code Compliance Check
| Criteria | Limit | Actual | Status |
|----------|-------|--------|--------|
| Drift Ratio | H/500 | H/850 | ✅ PASS |
| Displacement | 25mm | 12.5mm | ✅ PASS |
| Foundation Pressure | 200 kN/m² | 180 kN/m² | ✅ PASS |
| Column Utilization | 0.9 | 0.75 | ✅ PASS |

### 9.2 Detailed Results

#### 9.2.1 Node Displacements
```csv
Node ID, X-Disp(mm), Y-Disp(mm), Z-Disp(mm), Max-Disp(mm)
N001, 0.50, -12.5, 0.20, 12.51
N002, 0.45, -11.8, 0.18, 11.82
N003, 0.40, -10.9, 0.15, 10.91
...
```

#### 9.2.2 Element Forces
```csv
Element ID, Axial(kN), Shear-Y(kN), Shear-Z(kN), Moment-Y(kNm), Moment-Z(kNm)
COL001, -1250, 25, 18, 45, 32
COL002, -1180, 22, 16, 42, 28
BEAM001, -50, 85, 0, 120, 0
...
```

### 9.3 Foundation Analysis Results

#### 9.3.1 Pile Load Distribution
```
Foundation Summary:
├── Total Building Load: 15,680 kN
├── Number of Piles: 64
├── Load per Pile: 245 kN (avg)
├── Maximum Pile Load: 325 kN
├── Pile Efficiency: 85%
└── Factor of Safety: 2.8
```

#### 9.3.2 Settlement Analysis
```
Settlement Prediction:
├── Immediate Settlement: 5mm
├── Consolidation Settlement: 15mm
├── Total Settlement: 20mm
├── Differential Settlement: <10mm
└── Time to 90% Consolidation: 2.5 years
```

---

## 10. Export & Documentation

### 10.1 Report Generation
**Tab: Reports**

#### 10.1.1 Report Types
| Report Type | Content | Format | Use Case |
|-------------|---------|--------|----------|
| Executive Summary | Key findings, conclusions | PDF | Management review |
| Technical Report | Detailed analysis, calculations | PDF | Engineering review |
| Calculation Sheets | Step-by-step calculations | PDF | Code compliance |
| 3D Visualization | Rendered images, animations | PNG/GIF | Presentations |

#### 10.1.2 Report Structure
```
📋 Comprehensive Structural Report:
├── 1. Project Information
├── 2. Design Criteria & Codes
├── 3. Material Properties
├── 4. Geometry & Loading
├── 5. Analysis Methodology  
├── 6. Results & Discussion
├── 7. Code Compliance Check
├── 8. Recommendations
├── 9. Appendices
└── 10. References
```

### 10.2 Data Export Options

#### 10.2.1 Formats Available
```
Export Options:
├── PDF Reports: Complete documentation
├── CSV Data: Numerical results
├── DXF/DWG: CAD integration  
├── JSON: Data interchange
├── Excel: Spreadsheet analysis
└── Images: Visualizations (PNG/JPG)
```

#### 10.2.2 Integration Capabilities
- **CAD Software**: AutoCAD, Tekla, ETABS
- **BIM Platforms**: Revit, Bentley
- **Documentation**: Word, LaTeX
- **Databases**: SQL, MongoDB
- **Cloud Storage**: Google Drive, Dropbox

### 10.3 Quality Control Checklist

#### 10.3.1 Pre-Export Validation
- [ ] All input data verified
- [ ] Analysis convergence achieved
- [ ] Results within expected ranges
- [ ] Code compliance confirmed
- [ ] Peer review completed
- [ ] Client requirements met

#### 10.3.2 Documentation Standards
- [ ] Professional formatting applied
- [ ] Technical language consistent
- [ ] Units clearly specified
- [ ] Assumptions documented
- [ ] Limitations stated
- [ ] References cited

---

## 🔄 Workflow Optimization Tips

### Performance Enhancement
1. **Model Complexity**: Start simple, add detail incrementally
2. **Mesh Density**: Balance accuracy vs computation time
3. **Load Cases**: Combine similar loading conditions
4. **Convergence**: Use appropriate tolerance settings

### Error Prevention
1. **Input Validation**: Double-check all parameters
2. **Unit Consistency**: Maintain consistent unit system
3. **Range Checking**: Verify values within realistic bounds
4. **Save Frequently**: Backup work at each major step

### Collaboration Best Practices
1. **Version Control**: Use systematic file naming
2. **Documentation**: Record all assumptions and changes  
3. **Review Process**: Implement peer review workflow
4. **Communication**: Maintain clear project communication

---

## 📞 Support & Resources

### Technical Support
- **Documentation**: Complete user manual available
- **Video Tutorials**: Step-by-step guided workflows
- **FAQ**: Common questions and solutions
- **Community Forum**: User discussion and help

### Professional Services
- **Training Programs**: Comprehensive system training
- **Consultation**: Expert engineering advice
- **Custom Development**: Specialized feature development
- **Integration Support**: System integration assistance

---

**🏗️ APP-STRUKTUR-BLACKBOX - Advanced Structural Analysis Platform**
*Empowering Engineers with Intelligent Design Solutions*

Version: 2.0.0 | Last Updated: September 2025