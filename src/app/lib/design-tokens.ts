/**
 * eChefs Design Tokens
 * Single source of truth for all design values
 * Based on Figma design system specification
 */

export const designTokens = {
  // Color tokens
  colors: {
    // Brand colors
    primary: '#667c67',
    accent: '#e4dbc4',
    
    // Semantic colors
    success: '#16a34a',
    warning: '#ea580c',
    error: '#dc2626',
    info: '#0284c7',
    
    // Surface colors
    surface: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      elevated: '#ffffff',
    },
    
    // Background colors
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Text colors
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      inverse: '#ffffff',
      disabled: '#d1d5db',
    },
    
    // Border colors
    border: {
      primary: '#e5e7eb',
      secondary: '#d1d5db',
      focus: '#667c67',
      error: '#dc2626',
    },
    
    // State colors (with opacity variants)
    state: {
      hover: 'rgba(102, 124, 103, 0.08)',
      pressed: 'rgba(102, 124, 103, 0.12)',
      focus: 'rgba(102, 124, 103, 0.12)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  
  // Typography tokens
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    },
    
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
    },
    
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  // Spacing tokens (8pt grid system)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },
  
  // Border radius tokens
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    full: '9999px',
  },
  
  // Shadow tokens (elevation)
  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  // Z-index tokens
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Animation tokens
  animation: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // Opacity tokens
  opacity: {
    disabled: 0.38,
    inactive: 0.54,
    secondary: 0.6,
    hint: 0.38,
    divider: 0.12,
    overlay: 0.5,
  },
  
  // Breakpoints
  breakpoints: {
    mobile: {
      sm: '360px',
      md: '375px',
      lg: '414px',
    },
    tablet: {
      sm: '768px',
      lg: '1024px',
    },
    desktop: {
      md: '1440px',
      lg: '1920px',
    },
  },
  
  // Component-specific tokens
  components: {
    button: {
      height: {
        sm: '2rem',      // 32px
        md: '2.5rem',    // 40px
        lg: '3rem',      // 48px
      },
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
      },
      minTouchTarget: '44px',
    },
    
    input: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem',
      },
    },
    
    card: {
      padding: {
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
      },
    },
    
    navbar: {
      height: '3.5rem', // 56px
    },
    
    bottomNav: {
      height: '4rem', // 64px
    },
  },
};

// Export as CSS variables for use in Tailwind config
export const cssVariables = {
  '--color-primary': designTokens.colors.primary,
  '--color-accent': designTokens.colors.accent,
  '--color-success': designTokens.colors.success,
  '--color-warning': designTokens.colors.warning,
  '--color-error': designTokens.colors.error,
  '--color-info': designTokens.colors.info,
  '--font-family-primary': designTokens.typography.fontFamily.primary,
  '--font-family-mono': designTokens.typography.fontFamily.mono,
  '--spacing-unit': '0.25rem',
  '--radius-base': designTokens.radius.md,
  '--shadow-base': designTokens.shadow.md,
  '--transition-base': `${designTokens.animation.duration.base} ${designTokens.animation.easing.inOut}`,
};

// Type exports for TypeScript
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type RadiusToken = keyof typeof designTokens.radius;
export type ShadowToken = keyof typeof designTokens.shadow;

export default designTokens;
