/**
 * Professional UI Theme System
 * Based on modern glassmorphism design with consistent color palette
 */

export const theme = {
  // Primary Color Palette (Blue-Purple Gradient)
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',  // Main blue
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',  // Main purple
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    accent: {
      green: '#10b981',
      emerald: '#059669',
      orange: '#f59e0b',
      red: '#ef4444',
      yellow: '#fbbf24',
      pink: '#ec4899',
      cyan: '#06b6d4',
      teal: '#14b8a6',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    dark: {
      50: '#1e293b',
      100: '#334155',
      200: '#475569',
      300: '#64748b',
      400: '#94a3b8',
      500: '#cbd5e1',
      600: '#e2e8f0',
      700: '#f1f5f9',
      800: '#f8fafc',
      900: '#ffffff',
    }
  },

  // Glassmorphism Effects
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    heavy: 'rgba(255, 255, 255, 0.25)',
    blur: {
      sm: 'blur(4px)',
      md: 'blur(8px)',
      lg: 'blur(12px)',
      xl: 'blur(16px)',
    }
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)',
    primaryReverse: 'linear-gradient(135deg, #a855f7 0%, #0ea5e9 100%)',
    dark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    darkBlue: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    danger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    info: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  },

  // Shadow System
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(14, 165, 233, 0.15)',
    glowPurple: '0 0 20px rgba(168, 85, 247, 0.15)',
  },

  // Border Radius
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  // Spacing
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },

  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }
};

// CSS Custom Properties Generator
export const generateCSSVariables = () => {
  const vars: Record<string, string> = {};
  
  // Colors
  Object.entries(theme.colors).forEach(([category, shades]) => {
    if (typeof shades === 'object') {
      Object.entries(shades).forEach(([shade, value]) => {
        vars[`--color-${category}-${shade}`] = value as string;
      });
    }
  });

  // Gradients
  Object.entries(theme.gradients).forEach(([name, value]) => {
    vars[`--gradient-${name}`] = value;
  });

  return vars;
};

// Utility Classes
export const getGlassStyle = (opacity: 'light' | 'medium' | 'heavy' = 'medium') => ({
  background: theme.glass[opacity],
  backdropFilter: theme.glass.blur.md,
  border: `1px solid ${theme.glass.light}`,
});

export const getGradientStyle = (gradient: keyof typeof theme.gradients) => ({
  background: theme.gradients[gradient],
});

export const getShadowStyle = (shadow: keyof typeof theme.shadows) => ({
  boxShadow: theme.shadows[shadow],
});

export default theme;