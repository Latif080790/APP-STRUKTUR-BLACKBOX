
# Standards Integration

<cite>
**Referenced Files in This Document**   
- [StandardIntegration.tsx](file://src/standards/StandardIntegration.tsx)
- [SNI_1726_Gempa.ts](file://src/standards/sni/SNI_1726_Gempa.ts)
- [SNI_1727_Beban.ts](file://src/standards/sni/SNI_1727_Beban.ts)
- [SNI_2847_Beton.ts](file://src/standards/sni/SNI_2847_Beton.ts)
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts)
- [ACI_318_Beton.ts](file://src/standards/international/ACI_318_Beton.ts)
- [AISC_Baja.ts](file://src/standards/international/AISC_Baja.ts)
- [ASCE_7_Gempa.ts](file://src/standards/international/ASCE_7_Gempa.ts)
- [Eurocode.ts](file://src/standards/international/Eurocode.ts)
- [index.ts](file://src/standards/index.ts)
</cite>

## Table of Contents
1. [Standards Integration Overview](#standards-integration-overview)
2. [StandardIntegration.tsx Component](#standardintegrationtsx-component)
3. [SNI Standards Implementation](#sni-standards-implementation)
4. [International Standards Implementation](#international-standards-implementation)
5. [Data Model for Standards Parameters](#data-model-for-standards-parameters)
6. [Compliance Checking Workflows](#compliance-checking-workflows)
7. [Error Handling and Validation Rules](#error-handling-and-validation-rules)
8. [Extensibility of Standards System](#extensibility-of-standards-system)
9. [Technical Challenges of International Standards](#technical-challenges-of-international-standards)

## Standards Integration Overview

The APP-STRUKTUR-BLACKBOX application implements a comprehensive structural design standards integration system that supports both Indonesian SNI standards and major international standards including ACI, AISC, ASCE, and Eurocode. The system provides a unified interface for structural engineers to apply different design codes for concrete, steel, seismic, and load calculations. The implementation follows a modular architecture where each standard is implemented in separate files with consistent interfaces, allowing for easy extension and maintenance. The standards integration covers critical aspects of structural design including material properties, load combinations, seismic design parameters, and structural element design calculations.

**Section sources**
- [StandardIntegration.tsx](file://src/standards/StandardIntegration.tsx#L1-L514)
- [index.ts](file://src/standards/index.ts#L1-L100)

## StandardIntegration.tsx Component

The StandardIntegration.tsx component serves as the primary interface for standards compliance checking in the APP-STRUKTUR-BLACKBOX application. This React component provides a user-friendly interface for selecting and configuring different structural design standards. The component manages the state for various standard parameters including design code selection, seismic zone, soil type, building category, load combinations, and material properties for concrete, reinforcement, and steel. When the user clicks the "Calculate Values" button, the component retrieves the selected standard parameters and performs calculations to determine compliance metrics such as seismic coefficient and material properties.

The component supports five different design codes: SNI Indonesia, ACI 318 (Concrete), AISC (Steel), Eurocode, and ASCE 7 (Loads). For SNI standards, the interface displays specific configuration options including seismic zone (1-4), soil type (ZA-ZE), building category (I-IV), load combination, concrete material, reinforcement material, and steel material. The results are displayed in a structured format showing the selected standard configuration and calculated values. The component also includes a compliance status section that indicates which SNI standards have been implemented in the system.

```mermaid
classDiagram
class StandardIntegration {
+settings : StandardSettings
+calculatedValues : any
+handleSettingChange(field : keyof StandardSettings, value : string | number) : void
+calculateValues() : void
+getCodeIcon(code : string) : JSX.Element
+getCodeName(code : string) : string
}
class StandardSettings {
+code : 'sni' | 'aci' | 'aisc' | 'eurocode' | 'asce'
+seismicZone : number
+soilType : string
+buildingCategory : string
+loadCombination : string
+concreteMaterial : string
+reinforcementMaterial : string
+steelMaterial : string
}
StandardIntegration --> StandardSettings : "uses"
StandardIntegration --> "SNI_1726_Gempa" : "imports"
StandardIntegration --> "SNI_1727_Beban" : "imports"
StandardIntegration --> "SNI_2847_Beton" : "imports"
StandardIntegration --> "SNI_1729_Baja" : "imports"
StandardIntegration --> "ACI_318_Beton" : "imports"
StandardIntegration --> "AISC_Baja" : "imports"
StandardIntegration --> "ASCE_7_Gempa" : "imports"
StandardIntegration --> "Eurocode" : "imports"
```

**Diagram sources**
- [StandardIntegration.tsx](file://src/standards/StandardIntegration.tsx#L96-L511)

**Section sources**
- [StandardIntegration.tsx](file://src/standards/StandardIntegration.tsx#L1-L514)

## SNI Standards Implementation

The application implements several key Indonesian SNI standards for structural design, including SNI 1726:2019 for seismic design, SNI 1727:2020 for load requirements, SNI 2847:2019 for reinforced concrete design, and SNI 1729:2020 for structural steel design. Each standard is implemented in a separate TypeScript file with specific data structures and calculation methods.

For seismic design (SNI 1726:2019), the implementation includes seismic zones 1-4 with corresponding peak ground acceleration values from 0.1g to 0.4g, five soil types (ZA-ZE) with amplification factors from 1.0 to 1.8, and four building categories (I-IV) with importance factors from 1.0 to 2.0. The seismic coefficient is calculated using the formula: Cs = Z × I × S, where Z is the seismic zone acceleration, I is the building importance factor, and S is the soil amplification factor. The calculation also includes period-dependent modifications and minimum coefficient requirements.

For load requirements (SNI 1727:2020), the implementation includes five basic load combinations and two special load combinations. The basic combinations include dead load (D), live load (L), wind load (W), and earthquake load (E) with appropriate load factors. For example, Combination 1 uses 1.4D + 1.7L for structures without wind or seismic loads, while Combination 3 uses 1.2D + 1.0L + 1.0E for structures in seismic zones.

For reinforced concrete design (SNI 2847:2019), the implementation includes five concrete quality levels (K-20 to K-40) with compressive strengths from 20 to 40 MPa, and three reinforcement steel grades (BJTP 240, BJTD 400, BJTD 500) with yield strengths from 240 to 500 MPa. The design calculations include the beta factor for the stress block, minimum and maximum reinforcement ratios, and nominal moment capacity calculations for reinforced concrete beams.

For structural steel design (SNI 1729:2020), the implementation includes four steel grades (BJ 37, BJ 41, BJ 50, BJ 55) with yield strengths from 240 to 410 MPa, and three common wide flange sections. The calculations include critical buckling stress, nominal compressive strength, nominal flexural strength, and slenderness ratio checks with limits of 200 for compression members and 300 for tension members.

```mermaid
classDiagram
class SNI_1726_Gempa {
+SEISMIC_ZONES : SeismicZone[]
+SOIL_TYPES : SoilType[]
+BUILDING_CATEGORIES : BuildingCategory[]
+calculateSeismicCoefficient(zone : SeismicZone, soilType : SoilType, buildingCategory : BuildingCategory, period : number) : number
+calculateDesignSpectralAcceleration(zone : SeismicZone, soilType : SoilType, buildingCategory : BuildingCategory, period : number) : number
}
class SNI_1727_Beban {
+LOAD_TYPES : LoadType[]
+BASIC_LOAD_COMBINATIONS : LoadCombination[]
+SPECIAL_LOAD_COMBINATIONS : LoadCombination[]
+calculateFactoredLoad(loadType : string, loadValue : number, combination : LoadCombination) : number
+getLoadCombination(id : string) : LoadCombination | undefined
}
class SNI_2847_Beton {
+CONCRETE_MATERIALS : ConcreteMaterial[]
+REINFORCEMENT_MATERIALS : ReinforcementMaterial[]
+getBetaFactor(concreteStrength : number) : number
+getMinReinforcementRatio(concreteStrength : number, steelStrength : number) : number
+getMaxReinforcementRatio(concreteStrength : number, steelStrength : number) : number
+calculateNominalMomentCapacity(section : ConcreteSection) : number
+checkMinReinforcement(section : ConcreteSection) : boolean
+checkMaxReinforcement(section : ConcreteSection) : boolean
}
class SNI_1729_Baja {
+STEEL_MATERIALS : SteelMaterial[]
+STEEL_SECTIONS : SteelSection[]
+SLENDERNESS_LIMITS : { tensionMembers : 300, compressionMembers : 200, flexuralMembers : 250, connectionElements : 300 }
+calculateCriticalBucklingStress(section : SteelSection, length : number, endCondition : number) : number
+calculateNominalCompressiveStrength(section : SteelSection, length : number, endCondition : number) : number
+calculateNominalFlexuralStrength(section : SteelSection, laterallySupported : boolean) : number
+checkSlenderness(section : SteelSection, length : number, endCondition : number, memberType : keyof typeof SLENDERNESS_LIMITS) : boolean
}
SNI_1726_Gempa --> "SeismicZone" : defines
SNI_1726_Gempa --> "SoilType" : defines
SNI_1726_Gempa --> "BuildingCategory" : defines
SNI_1727_Beban --> "LoadType" : defines
SNI_1727_Beban --> "LoadCombination" : defines
SNI_2847_Beton --> "ConcreteMaterial" : defines
SNI_2847_Beton --> "ReinforcementMaterial" : defines
SNI_2847_Beton --> "ConcreteSection" : defines
SNI_1729_Baja --> "SteelMaterial" : defines
SNI_1729_Baja --> "SteelSection" : defines
```

**Diagram sources**
- [SNI_1726_Gempa.ts](file://src/standards/sni/SNI_1726_Gempa.ts#L25-L30)
- [SNI_1726_Gempa.ts](file://src/standards/sni/SNI_1726_Gempa.ts#L33-L39)
- [SNI_1726_Gempa.ts](file://src/standards/sni/SNI_1726_Gempa.ts#L42-L47)
- [SNI_1726_Gempa.ts](file://src/standards/sni/SNI_1726_Gempa.ts#L57-L78)
- [SNI_1726_Gempa.ts](file://src/standards/sni/SNI_1726_Gempa.ts#L115-L123)
- [SNI_1727_Beban.ts](file://src/standards/sni/SNI_1727_Beban.ts#L33-L43)
- [SNI_1727_Beban.ts](file://src/standards/sni/SNI_1727_Beban.ts#L46-L104)
- [SNI_1727_Beban.ts](file://src/standards/sni/SNI_1727_Beban.ts#L107-L132)
- [SNI_1727_Beban.ts](file://src/standards/sni/SNI_1727_Beban.ts#L141-L148)
- [SNI_1727_Beban.ts](file://src/standards/sni/SNI_1727_Beban.ts#L155-L160)
- [SNI_2847_Beton.ts](file://src/standards/sni/SNI_2847_Beton.ts#L39-L85)
- [SNI_2847_Beton.ts](file://src/standards/sni/SNI_2847_Beton.ts#L88-L116)
- [SNI_2847_Beton.ts](file://src/standards/sni/SNI_2847_Beton.ts#L119-L127)
- [SNI_2847_Beton.ts](file://src/standards/sni/SNI_2847_Beton.ts#L130-L132)
- [SNI_2847_Beton.ts](file://src/standards/sni/SNI_2847_Beton.ts#L135-L138)
- [SNI_2847_Beton.ts](file://src/standards/sni/SNI_2847_Beton.ts#L145-L165)
- [SNI_2847_Beton.ts](file://src/standards/sni/SNI_2847_Beton.ts#L172-L186)
- [SNI_2847_Beton.ts](file://src/standards/sni/SNI_2847_Beton.ts#L193-L207)
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts#L26-L74)
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts#L77-L104)
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts#L107-L114)
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts#L117-L138)
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts#L141-L165)
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts#L168-L194)
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts#L197-L218)
- [SNI_1729_Baja.ts](file://src/standards/sni/SNI_1729_Baja.ts#L221-L232)

**Section sources**
- [SNI_1726_Gempa.ts](file://src/standards/sni/SNI_1726_Gempa.ts#L1-L135)
- [SNI_1727_Beban.ts](file://src/standards/sni/SNI_1727_Beban.ts#L1-L181)
- [SNI_2847_Beton.ts](file://src/standards/sni/SNI_2847_Beton.ts#L1-L239)
- [SNI_1729_Baja.ts](file://src/standards