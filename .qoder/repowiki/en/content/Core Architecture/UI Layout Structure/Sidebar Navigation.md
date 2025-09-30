# Sidebar Navigation

<cite>
**Referenced Files in This Document**   
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx)
- [ModuleRouter.tsx](file://src/components/routing/ModuleRouter.tsx)
- [MobileWrapper.tsx](file://src/components/ui/MobileWrapper.tsx)
- [BeamDesignModule.tsx](file://src/structural-analysis/design/BeamDesignModule.tsx)
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx)
- [SlabDesignModule.tsx](file://src/structural-analysis/design/SlabDesignModule.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Components](#core-components)
3. [State Management](#state-management)
4. [Module Integration](#module-integration)
5. [UI/UX Design](#uiux-design)
6. [Accessibility Features](#accessibility-features)
7. [Customization and Troubleshooting](#customization-and-troubleshooting)

## Introduction
The ModernSidebar component serves as the primary navigation interface for the structural analysis application, providing access to various design modules and analysis tools. This documentation details its implementation, integration with the ModuleRouter system, and responsive design features that ensure usability across desktop and mobile devices.

**Section sources**
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx#L1-L316)

## Core Components
The ModernSidebar component is implemented as a React functional component that manages navigation state and renders module access points. It integrates with the NavigationItem component for consistent styling of navigation elements and uses the moduleDefinitions from ModuleRouter to dynamically generate module categories.

The sidebar supports both expanded and collapsed states, adapting its layout based on user preference. In expanded mode, it displays hierarchical module categories with collapsible sections, while the collapsed mode provides quick access to primary categories through icon-only buttons.

```mermaid
classDiagram
class ModernSidebar {
+isCollapsed : boolean
+expandedCategories : string[]
+currentView : string
+onNavigate(view : string) : void
+toggleCategory(category : string) : void
}
class ModuleRouter {
+currentModule : ModuleKey
+onNavigate : (view : string) => void
+moduleDefinitions : ModuleDefinition[]
}
class MobileWrapper {
+isMobile : boolean
+enableTouchGestures : boolean
+enableSwipeNavigation : boolean
}
ModernSidebar --> ModuleRouter : "uses moduleDefinitions"
ModernSidebar --> MobileWrapper : "adapts to mobile"
```

**Diagram sources **
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx#L45-L316)
- [ModuleRouter.tsx](file://src/components/routing/ModuleRouter.tsx#L372-L407)
- [MobileWrapper.tsx](file://src/components/ui/MobileWrapper.tsx#L25-L169)

**Section sources**
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx#L45-L316)
- [ModuleRouter.tsx](file://src/components/routing/ModuleRouter.tsx#L372-L407)

## State Management
The ModernSidebar component utilizes React's useState hook to manage two primary state variables: isCollapsed for controlling the sidebar's width and expandedCategories for tracking which module categories are currently expanded. The isCollapsed state toggles between a compact 16px width and a full 80px width, while expandedCategories maintains an array of category names that should display their module lists.

The component's state management ensures that category expansion state persists across navigation events, providing a consistent user experience. When a category header is clicked, the toggleCategory function updates the expandedCategories state by either adding or removing the category from the array.

```mermaid
sequenceDiagram
participant User
participant ModernSidebar
participant ModuleRouter
User->>ModernSidebar : Clicks category header
ModernSidebar->>ModernSidebar : toggleCategory(category)
ModernSidebar->>ModernSidebar : Update expandedCategories state
ModernSidebar->>ModernSidebar : Re-render with updated category state
User->>ModernSidebar : Clicks module item
ModernSidebar->>ModuleRouter : onNavigate(module.key)
ModuleRouter->>ModuleRouter : Load requested module
ModuleRouter-->>ModernSidebar : Update currentModule
ModernSidebar->>ModernSidebar : Update active state
```

**Diagram sources **
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx#L45-L316)
- [ModuleRouter.tsx](file://src/components/routing/ModuleRouter.tsx#L372-L407)

**Section sources**
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx#L45-L316)

## Module Integration
The ModernSidebar integrates with the ModuleRouter system to enable dynamic module loading based on user selection. It accesses the moduleDefinitions array from ModuleRouter to group modules by category and render them in the sidebar interface. Each module in the system is defined with a key, title, description, icon, category, and component reference.

When a user selects a module from the sidebar, the onNavigate callback is triggered with the module's key, which the parent component passes to ModuleRouter to load the appropriate module. The ModuleRouter uses React's Suspense and lazy loading to dynamically import and render the selected module, ensuring optimal performance.

The integration supports various module categories including analysis, design, 3D visualization, and system tools, with specific modules for beam, column, and slab design accessible through the design category.

```mermaid
flowchart TD
A[ModernSidebar] --> B{User Selection}
B --> C[Beam Design]
B --> D[Column Design]
B --> E[Slab Design]
B --> F[3D Visualization]
C --> G[ModuleRouter]
D --> G
E --> G
F --> G
G --> H[Dynamic Import]
H --> I[Lazy Load Component]
I --> J[Render Module]
```

**Diagram sources **
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx#L45-L316)
- [ModuleRouter.tsx](file://src/components/routing/ModuleRouter.tsx#L372-L407)

**Section sources**
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx#L45-L316)
- [ModuleRouter.tsx](file://src/components/routing/ModuleRouter.tsx#L32-L34)
- [BeamDesignModule.tsx](file://src/structural-analysis/design/BeamDesignModule.tsx#L158-L627)
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx#L158-L611)
- [SlabDesignModule.tsx](file://src/structural-analysis/design/SlabDesignModule.tsx#L158-L584)

## UI/UX Design
The ModernSidebar implements a glassmorphism design aesthetic with backdrop blur effects and subtle gradients to create a modern, professional appearance. The UI design incorporates several key elements:

- **Icon Placement**: Icons are consistently positioned to the left of text labels in the expanded state, with appropriate spacing to ensure readability. In the collapsed state, only icons are displayed with tooltips on hover.
- **Hover Effects**: Navigation items feature smooth hover transitions with background color changes and subtle scaling effects to provide visual feedback.
- **Mobile Adaptation**: The MobileWrapper component enables touch-friendly interactions, including swipe navigation and pinch-to-zoom gestures, ensuring the sidebar remains usable on mobile devices.
- **Visual Hierarchy**: Category headers use capitalization and font weighting to distinguish them from module items, while badge indicators show the number of modules in each category.

The design also includes a quick access section with frequently used modules like Dashboard, Structural Analysis, Marketplace, and Educational resources, positioned at the top of the sidebar for easy access.

**Section sources**
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx#L45-L316)
- [MobileWrapper.tsx](file://src/components/ui/MobileWrapper.tsx#L25-L169)

## Accessibility Features
The ModernSidebar component incorporates several accessibility features to ensure usability for all users:

- **Keyboard Navigation**: All interactive elements are focusable and can be operated using keyboard inputs, with logical tab order following the visual layout.
- **ARIA Labels**: Navigation items include appropriate ARIA attributes to provide context for screen readers, with descriptive labels for all icons and controls.
- **Screen Reader Support**: The component uses semantic HTML elements and ARIA roles to convey the hierarchical structure of the navigation menu to assistive technologies.
- **Color Contrast**: The design maintains sufficient color contrast between text and background elements to meet accessibility standards.
- **Focus Indicators**: Visible focus rings are provided for keyboard navigation, ensuring users can track their position within the interface.

The sidebar also includes proper labeling for all interactive elements, with descriptive titles for icon-only buttons in the collapsed state, ensuring that all functionality is clearly communicated to users of assistive technologies.

**Section sources**
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx#L45-L316)
- [MobileWrapper.tsx](file://src/components/ui/MobileWrapper.tsx#L25-L169)

## Customization and Troubleshooting
The ModernSidebar component can be customized for new modules by adding entries to the moduleDefinitions array in ModuleRouter. Each new module should specify its key, title, description, icon, category, and component reference. The sidebar automatically groups modules by category and renders them in the appropriate section.

Common issues and their solutions include:

- **State Desynchronization**: If the sidebar's active state doesn't match the currently displayed module, ensure that the currentView prop is properly synchronized between the sidebar and the parent component. This typically occurs when navigation occurs outside the sidebar.
- **Rendering Delays**: For modules with heavy computational requirements, ensure that lazy loading is properly implemented in ModuleRouter to prevent blocking the main thread during module loading.
- **Mobile Responsiveness**: If touch gestures are not working properly, verify that the MobileWrapper component is properly configured with enableTouchGestures and enableSwipeNavigation set to true.
- **Accessibility Issues**: Ensure that all new modules include proper ARIA labels and keyboard navigation support to maintain accessibility standards.

When adding new design modules like Beam, Column, or Slab design, ensure that the module's component is properly exported and imported in ModuleRouter, and that the category is included in the categoryIcons mapping in ModernSidebar for proper icon display.

**Section sources**
- [ModernSidebar.tsx](file://src/components/ModernSidebar.tsx#L45-L316)
- [ModuleRouter.tsx](file://src/components/routing/ModuleRouter.tsx#L372-L407)
- [BeamDesignModule.tsx](file://src/structural-analysis/design/BeamDesignModule.tsx#L158-L627)
- [ColumnDesignModule.tsx](file://src/structural-analysis/design/ColumnDesignModule.tsx#L158-L611)
- [SlabDesignModule.tsx](file://src/structural-analysis/design/SlabDesignModule.tsx#L158-L584)