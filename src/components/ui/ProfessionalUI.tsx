/**
 * Professional UI Components
 * Consistent glassmorphism components with theme integration
 */

import React, { ReactNode } from 'react';
import { theme, getGlassStyle, getGradientStyle, getShadowStyle } from '../../styles/theme';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'light' | 'medium' | 'heavy';
  hover?: boolean;
  gradient?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'medium',
  hover = true,
  gradient = false
}) => {
  const baseStyle = {
    ...getGlassStyle(variant),
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing.lg,
    transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.inOut}`,
    cursor: onClick ? 'pointer' : 'default',
  };

  const hoverStyle = hover ? {
    transform: 'translateY(-2px) scale(1.02)',
    ...getShadowStyle('xl'),
  } : {};

  const gradientStyle = gradient ? {
    background: `${theme.gradients.primary}, ${getGlassStyle(variant).background}`,
    backgroundBlendMode: 'overlay',
  } : {};

  return (
    <div
      className={`glass-card ${className}`}
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          Object.assign(e.currentTarget.style, baseStyle, gradientStyle);
        }
      }}
    >
      {children}
    </div>
  );
};

interface ModernButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  icon
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.gradients.primary,
          color: 'white',
          border: 'none',
          ...getShadowStyle('md'),
        };
      case 'secondary':
        return {
          background: theme.gradients.primaryReverse,
          color: 'white',
          border: 'none',
          ...getShadowStyle('md'),
        };
      case 'success':
        return {
          background: theme.gradients.success,
          color: 'white',
          border: 'none',
          ...getShadowStyle('md'),
        };
      case 'warning':
        return {
          background: theme.gradients.warning,
          color: 'white',
          border: 'none',
          ...getShadowStyle('md'),
        };
      case 'danger':
        return {
          background: theme.gradients.danger,
          color: 'white',
          border: 'none',
          ...getShadowStyle('md'),
        };
      case 'ghost':
        return {
          ...getGlassStyle('medium'),
          color: theme.colors.neutral[100],
          border: `1px solid ${theme.colors.primary[500]}`,
        };
      default:
        return {};
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          fontSize: '0.875rem',
          borderRadius: theme.radius.md,
        };
      case 'lg':
        return {
          padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
          fontSize: '1.125rem',
          borderRadius: theme.radius.xl,
        };
      default:
        return {
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          fontSize: '1rem',
          borderRadius: theme.radius.lg,
        };
    }
  };

  const baseStyle = {
    ...getVariantStyle(),
    ...getSizeStyle(),
    fontWeight: theme.typography.fontWeight.semibold,
    transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.inOut}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  return (
    <button
      className={`modern-button ${className}`}
      style={baseStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: ReactNode;
  gradient: keyof typeof theme.gradients;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  gradient,
  onClick
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.colors.accent.green;
      case 'down':
        return theme.colors.accent.red;
      default:
        return theme.colors.neutral[400];
    }
  };

  return (
    <GlassCard onClick={onClick} hover={!!onClick}>
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: theme.gradients[gradient],
            ...getShadowStyle('md'),
          }}
        >
          <div className="text-white text-xl">{icon}</div>
        </div>
        {change && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{
              backgroundColor: `${getTrendColor()}20`,
              color: getTrendColor(),
              fontSize: '0.875rem',
              fontWeight: theme.typography.fontWeight.medium,
            }}
          >
            <span>{trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}</span>
            {change}
          </div>
        )}
      </div>
      <div className="mb-2">
        <h3
          className="font-bold text-white mb-1"
          style={{ fontSize: '1.5rem' }}
        >
          {value}
        </h3>
        <p
          className="text-blue-200"
          style={{ fontSize: '0.875rem' }}
        >
          {title}
        </p>
      </div>
    </GlassCard>
  );
};

interface NavigationItemProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  badge
}) => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.radius.xl,
    cursor: 'pointer',
    transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.inOut}`,
    fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeight.medium,
    position: 'relative' as const,
  };

  const activeStyle = isActive ? {
    background: theme.gradients.primary,
    color: 'white',
    ...getShadowStyle('md'),
  } : {
    color: theme.colors.neutral[300],
    ':hover': {
      ...getGlassStyle('light'),
      color: 'white',
    }
  };

  return (
    <div
      className="navigation-item"
      style={{ ...baseStyle, ...activeStyle }}
      onClick={onClick}
    >
      <span className="navigation-icon">{icon}</span>
      <span className="navigation-label">{label}</span>
      {badge && (
        <span
          className="navigation-badge"
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: theme.colors.accent.red,
            color: 'white',
            borderRadius: theme.radius.full,
            padding: '2px 6px',
            fontSize: '10px',
            fontWeight: theme.typography.fontWeight.bold,
            minWidth: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = theme.colors.primary[500]
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { width: '16px', height: '16px', borderWidth: '2px' };
      case 'lg':
        return { width: '32px', height: '32px', borderWidth: '3px' };
      default:
        return { width: '24px', height: '24px', borderWidth: '2px' };
    }
  };

  return (
    <div
      className="loading-spinner"
      style={{
        ...getSizeStyle(),
        border: `${getSizeStyle().borderWidth} solid transparent`,
        borderTop: `${getSizeStyle().borderWidth} solid ${color}`,
        borderRadius: theme.radius.full,
        animation: 'spin 1s linear infinite',
      }}
    />
  );
};

// Add CSS animation for spinner
const spinnerCSS = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.navigation-item:hover {
  background: ${getGlassStyle('light').background} !important;
  backdrop-filter: ${theme.glass.blur.md};
  color: white !important;
}

.glass-card:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: ${theme.shadows.xl};
}

.modern-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: ${theme.shadows.lg};
}

.modern-button:active:not(:disabled) {
  transform: translateY(0);
}
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = spinnerCSS;
  document.head.appendChild(styleElement);
}