# Column Design Module

<cite>
**Referenced Files in This Document**   
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx)
- [ColumnProperties.ts](file://src/structural-analysis/design/ColumnProperties.ts)
- [structural.ts](file://src/types/structural.ts)
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts)
- [AISC_Baja.ts](file://src/standards/international/AISC_Baja.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Column Calculator Implementation](#column-calculator-implementation)
3. [Section Property Calculations](#section-property-calculations)
4. [Support Conditions and Effective Length](#support-conditions-and-effective-length)
5. [Material-Specific Allowable Stresses](#material-specific-allowable-stresses)
6. [Structural Safety Evaluation](#structural-safety-evaluation)
7. [Integration with Main System](#integration-with-main-system)
8. [UI Components and Layout](#ui-components-and-layout)
9. [Practical Examples and Design Recommendations](#practical-examples-and-design-recommendations)
10. [Potential Enhancements](#potential-enhancements)

## Introduction
The Column Design Module in APP-STRUKTUR-BLACKBOX provides a comprehensive solution for structural column design, integrating engineering calculations with an intuitive user interface. This module enables engineers to perform detailed column analysis considering axial loads, bending moments, slenderness ratios, and material properties. The implementation follows standard structural engineering principles while providing practical design recommendations based on safety criteria. The module supports multiple section types and materials, allowing for flexible design options in structural projects.

## Column Calculator Implementation
The column calculator implementation performs comprehensive structural analysis by calculating axial stress, bending stresses, and slenderness ratios. The core calculation function processes input parameters including column height, axial load, bending moments in both X and Y directions, end conditions, material type, and section dimensions. The calculator converts units appropriately, transforming kN to N and mm² to m² for consistent stress calculations. For bending stress calculations, the module converts kN·m to N·mm and mm⁴ to m⁴ to maintain dimensional consistency. The implementation evaluates combined stress by summing axial stress with absolute values of bending stresses in both directions, providing a conservative estimate of the total stress state in the column.

**Section sources**
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx#L217-L258)

## Section Property Calculations
The module calculates section properties for three primary section types: rectangular, circular, and I-sections. For rectangular sections, the area is calculated as width multiplied by depth, while the moment of inertia about the X-axis is computed as (width × depth³)/12 and about the Y-axis as (depth × width³)/12. The radius of gyration is derived as the square root of the moment of inertia divided by the area. For circular sections, the area is calculated using π × (diameter/2)², and the moment of inertia is determined by (π × diameter⁴)/64, with the radius of gyration being diameter/4. I-section properties use a simplified approach with predefined flange and web dimensions, calculating area as the sum of flange and web areas, and moments of inertia using standard formulas for composite sections.

**Section sources**
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx#L178-L203)
- [ColumnProperties.ts](file://src/structural-analysis/design/ColumnProperties.ts#L46-L102)

## Support Conditions and Effective Length
The module accounts for different support conditions that significantly impact column behavior and effective length. Two primary end conditions are supported: pinned and fixed. For pinned-pinned conditions, the effective length factor is 1.0, meaning the effective length equals the actual column height. For fixed-fixed conditions, the effective length factor is 0.8, reducing the effective length to 80% of the actual height. This difference reflects the increased stability provided by fixed connections, which restrict both translation and rotation at the ends. The slenderness ratio calculation uses the effective length (actual height multiplied by the effective length factor) divided by the radius of gyration. The implementation follows standard engineering practice where fixed connections provide greater resistance to buckling compared to pinned connections.

**Section sources**
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx#L240-L243)
- [ColumnProperties.ts](file://src/structural-analysis/design/ColumnProperties.ts#L151-L226)

## Material-Specific Allowable Stresses
The module implements material-specific allowable stress criteria for both concrete and steel columns. For concrete columns, the allowable stress is set at 40% of the concrete strength (25 MPa), resulting in an allowable stress of 10 MPa. For steel columns, the allowable stress is established at 60% of the steel yield strength (250 MPa), yielding an allowable stress of 150 MPa. These factors of safety account for uncertainties in material properties, construction quality, and loading conditions. The material properties are defined with appropriate density values (2400 kg/m³ for concrete and 7850 kg/m³ for steel) and elastic moduli (25 GPa for concrete and 200 GPa for steel). The implementation ensures that combined stress (axial plus bending) remains below these allowable limits for a safe design.

**Section sources**
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx#L245-L250)
- [ColumnProperties.ts](file://src/structural-analysis/design/ColumnProperties.ts#L0-L49)

## Structural Safety Evaluation
The module evaluates structural safety based on two primary criteria: stress limits and slenderness ratios. A design is considered safe only if both conditions are satisfied simultaneously. The first criterion checks that the combined stress (sum of axial stress and absolute values of bending stresses) remains below the material-specific allowable stress. The second criterion ensures the slenderness ratio stays below 200, which is a common limit in structural design codes to prevent excessive slenderness that could lead to buckling failure. When either criterion is violated, the module provides specific failure messages: "Combined stress exceeds allowable limit" for stress failures, and "Column is too slender" for slenderness failures. These diagnostic messages guide users toward appropriate design modifications, such as increasing section size, using stronger materials, or reducing column height.

**Section sources**
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx#L251-L267)

## Integration with Main System
The Column Design Module integrates with the main system through the onDesignComplete callback mechanism and Element object creation. When a safe design is achieved, the createColumnElement function generates a properly structured Element object that conforms to the system's data model. This object includes all necessary properties: a unique ID, element type ('column'), node references, material properties, section properties, and calculated stress values. The material object contains comprehensive properties including density, elastic modulus, yield strength, and visual color coding. The section object includes dimensional properties and type information. The integration ensures seamless data transfer to the main structural analysis system, where the column element can be incorporated into larger structural models for comprehensive analysis and visualization.

**Section sources**
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx#L276-L304)
- [structural.ts](file://src/types/structural.ts#L51-L78)

## UI Components and Layout
The user interface features a responsive layout with organized form controls for intuitive column design. The interface is divided into logical sections: basic parameters (height, axial load, moments, end condition) and material & section properties (material type, section type, dimensions). Input controls include sliders for continuous parameter adjustment with numeric input fields for precise values, dropdown selects for categorical choices, and conditional rendering of section-specific dimension inputs. The layout adapts to different screen sizes using a grid system that switches from two columns on larger screens to single column on mobile devices. Advanced options are hidden by default behind a toggle switch, maintaining interface simplicity while providing access to additional parameters. Results are displayed in a clear card format with color-coded safety indicators (green for safe, red for unsafe) and organized data presentation in a responsive grid.

**Section sources**
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx#L342-L611)

## Practical Examples and Design Recommendations
Practical examples demonstrate typical column design scenarios. For a concrete column with 500 kN axial load and 20 kN·m moment, a 400×400 mm rectangular section with pinned ends at 3.5 m height typically results in a safe design. Failure modes include stress failure (insufficient section capacity) and slenderness failure (excessive height-to-thickness ratio). Design recommendations include: increasing section dimensions for stress failures, reducing column height or changing to fixed end conditions for slenderness failures, and selecting higher-strength materials when space is constrained. The module suggests specific modifications in its failure messages, guiding users toward viable solutions. For optimal performance, designers should balance section size, material selection, and support conditions to achieve efficient, safe designs that meet architectural requirements.

**Section sources**
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx#L260-L267)

## Potential Enhancements
Potential enhancements to the Column Design Module include advanced buckling analysis and interaction diagrams. Buckling analysis could implement Euler's formula for critical buckling load, considering different end conditions and material properties, with reference to standards like SNI 1729 and AISC 360. Interaction diagrams would provide a more sophisticated assessment of column capacity by plotting the relationship between axial load and bending moment capacity, allowing designers to evaluate performance under combined loading conditions. Additional improvements could include code-compliant design checks according to specific standards (SNI 2847 for concrete, SNI 1729 for steel), automated section optimization, and detailed reinforcement detailing for concrete columns. These enhancements would transform the module from a basic calculator to a comprehensive design assistant capable of handling complex structural engineering challenges.

**Section sources**
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts#L151-L195)
- [AISC_Baja.ts](file://src/standards/international/AISC_Baja.ts#L98-L140)