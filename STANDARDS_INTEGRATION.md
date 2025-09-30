# Standards Integration Documentation

## Overview

This document describes the implementation of structural design standards integration in the Structural Analysis System. The system now supports multiple international and Indonesian standards for structural design.

## Implemented Standards

### Indonesian Standards (SNI)

1. **SNI 1726:2019** - Tata cara perencanaan ketahanan gempa untuk struktur bangunan gedung dan kegunaan lain
   - Seismic zone mapping based on Indonesian seismic hazard map
   - Soil type classification and amplification factors
   - Building category importance factors
   - Seismic response coefficient calculation

2. **SNI 1727:2020** - Beban minimum untuk perencanaan bangunan gedung dan struktur lain
   - Load types and classifications
   - Basic and special load combinations
   - Factored load calculation

3. **SNI 2847:2019** - Persyaratan beton struktural untuk bangunan gedung
   - Concrete material properties
   - Reinforcement material properties
   - Beta factor for stress block
   - Minimum and maximum reinforcement ratios
   - Nominal moment capacity calculation

4. **SNI 1729:2020** - Spesifikasi untuk bangunan gedung baja struktural
   - Steel material properties
   - Steel section properties
   - Slenderness limits
   - Safety factors
   - Critical buckling stress calculation

### International Standards

1. **ACI 318-19** - Building Code Requirements for Structural Concrete
   - Concrete material properties
   - Reinforcement material properties
   - Beta factor for stress block
   - Minimum and maximum reinforcement ratios
   - Nominal moment capacity calculation

2. **AISC 360-16** - Specification for Structural Steel Buildings
   - Steel material properties
   - Slenderness limits
   - Safety factors
   - Critical buckling stress calculation

3. **Eurocode 2 (EN 1992)** - Design of concrete structures
   - Concrete material properties
   - Reinforcement material properties
   - Partial safety factors
   - Design strength calculation

4. **Eurocode 3 (EN 1993)** - Design of steel structures
   - Steel material properties
   - Partial safety factors

5. **ASCE 7-16** - Minimum Design Loads and Associated Criteria
   - Load types and classifications
   - Load combinations
   - Site class classification
   - Risk category importance factors
   - Seismic response coefficient calculation

## Implementation Details

### Directory Structure

```
src/
├── standards/
│   ├── sni/
│   │   ├── SNI_1726_Gempa.ts
│   │   ├── SNI_1727_Beban.ts
│   │   ├── SNI_2847_Beton.ts
│   │   └── SNI_1729_Baja.ts
│   ├── international/
│   │   ├── ACI_318_Beton.ts
│   │   ├── AISC_Baja.ts
│   │   ├── Eurocode.ts
│   │   └── ASCE_7_Gempa.ts
│   ├── StandardIntegration.tsx
│   └── index.ts
```

### Key Components

#### 1. Standard Data Models

Each standard is implemented with appropriate data models:

- **Seismic Parameters**: Zone, soil type, building category
- **Load Types**: Dead, live, wind, earthquake, etc.
- **Load Combinations**: Basic and special combinations
- **Material Properties**: Concrete, steel, reinforcement
- **Section Properties**: Geometric properties of structural sections

#### 2. Calculation Functions

Implementation of key calculation functions:

- **Seismic Coefficient Calculation**: Based on zone, soil, and building category
- **Factored Load Calculation**: Applying load factors to basic loads
- **Moment Capacity Calculation**: For reinforced concrete sections
- **Buckling Stress Calculation**: For steel compression members
- **Design Strength Calculation**: Applying safety factors

#### 3. Standard Integration Component

A React component that provides a user interface for:

- Selecting design standards
- Configuring standard parameters
- Viewing material properties
- Calculating standard-based values

## Usage Examples

### 1. Accessing SNI Standards

```typescript
import { 
  SEISMIC_ZONES, 
  SOIL_TYPES, 
  BUILDING_CATEGORIES,
  getSeismicZone,
  getSoilType,
  getBuildingCategory
} from '@/standards';

// Get seismic zone 2
const zone2 = getSeismicZone(2);

// Get soil type ZC
const soilC = getSoilType('ZC');

// Get building category II
const category2 = getBuildingCategory('II');
```

### 2. Calculating Seismic Coefficient

```typescript
import { calculateSeismicCoefficient } from '@/standards/sni/SNI_1726_Gempa';

const coefficient = calculateSeismicCoefficient(
  seismicZone,  // Seismic zone object
  soilType,     // Soil type object
  buildingCategory, // Building category object
  1.0           // Structure period in seconds
);
```

### 3. Working with Materials

```typescript
import { 
  SNI_CONCRETE_MATERIALS, 
  getConcreteMaterial 
} from '@/standards';

// Get K-25 concrete
const concreteK25 = getConcreteMaterial('k25');

// Access properties
console.log(concreteK25.strength); // 25 MPa
console.log(concreteK25.modulusOfElasticity); // 25000 MPa
```

## Standard Integration UI

The Standard Integration component provides:

1. **Standard Selection**: Choose between SNI, ACI, AISC, Eurocode, and ASCE
2. **Parameter Configuration**: Set seismic zone, soil type, building category, etc.
3. **Material Selection**: Choose concrete, steel, and reinforcement materials
4. **Load Combination Selection**: Select appropriate load combinations
5. **Calculation Results**: View calculated values based on selected standards

## Future Enhancements

### Planned Features

1. **Complete SNI Implementation**:
   - SNI 2847 detailing requirements
   - SNI 1729 connection design
   - SNI load combination automation

2. **Extended International Standards**:
   - Full Eurocode implementation
   - Canadian standards (CSA)
   - Australian standards (AS)

3. **Advanced Features**:
   - Automatic code checking
   - Design optimization based on standards
   - Compliance reporting

4. **User Interface Improvements**:
   - Standard-specific configuration panels
   - Interactive code reference
   - Compliance status dashboard

## Testing and Validation

### Unit Tests

Each standard implementation includes unit tests for:

- Data model validation
- Calculation function accuracy
- Edge case handling
- Standard compliance verification

### Validation Examples

- Comparison with published examples from standards
- Verification against known solutions
- Cross-checking between different standard implementations

## Integration with Analysis Engine

The standards implementation integrates with the structural analysis engine by:

1. **Material Properties**: Providing material properties for analysis
2. **Load Combinations**: Generating factored loads for analysis
3. **Design Checks**: Using analysis results for code compliance
4. **Optimization**: Applying standard requirements for design optimization

## Conclusion

The standards integration provides a comprehensive framework for applying various structural design standards in the analysis system. The modular implementation allows for easy extension to additional standards and ensures compliance with international and Indonesian building codes.

This implementation enables engineers to:
- Apply appropriate design standards for their projects
- Ensure code compliance in their designs
- Compare results between different standards
- Generate compliant design documentation