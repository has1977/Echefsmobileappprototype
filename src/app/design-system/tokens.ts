/**
 * eChefs Design System v2.0
 * Enterprise-grade design tokens inspired by Airbnb, Uber, and Stripe
 * 
 * Design Principles:
 * 1. Hierarchy - Clear visual hierarchy through typography and spacing
 * 2. Consistency - Unified experience across all touchpoints
 * 3. Accessibility - WCAG AA compliant, minimum 44px touch targets
 * 4. Motion - Purposeful animations that enhance UX
 * 5. Scalability - Token-based system for easy theming
 */

export const designTokens = {
  // ==========================================
  // COLORS - Strategic brand palette
  // ==========================================
  colors: {
    // Primary - Brand identity
    primary: {
      50: '#F3F7F3',
      100: '#E7EFE7',
      200: '#CFE3CA',
      300: '#B7D7AC',
      400: '#9FB49A',
      500: '#667C67',  // Base
      600: '#546352',
      700: '#394739',
      800: '#2D372D',
      900: '#1F271F',
    },
    
    // Accent - Warm highlights
    accent: {
      50: '#FBF8F4',
      100: '#F7F1E9',
      200: '#F0E7D7',
      300: '#E8DCC5',
      400: '#E4DBC4',  // Base
      500: '#D4C9A8',
      600: '#C7B99F',
      700: '#B5A88D',
      800: '#9A8F7A',
      900: '#7A7160',
    },
    
    // Semantic - Status and feedback
    semantic: {
      success: {
        base: '#16A34A',
        light: '#DCFCE7',
        dark: '#0F8B3A',
      },
      warning: {
        base: '#F59E0B',
        light: '#FEF3C7',
        dark: '#B76B00',
      },
      error: {
        base: '#DC2626',
        light: '#FEE2E2',
        dark: '#9B1A1A',
      },
      info: {
        base: '#2563EB',
        light: '#DBEAFE',
        dark: '#184FC5',
      },
    },
    
    // Neutrals - UI foundation
    neutral: {
      0: '#FFFFFF',
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      950: '#0F1720',
    },
    
    // Dark mode - KDS & staff interfaces
    dark: {
      bg: '#2F3134',
      surface: '#3A3D40',
      border: '#4A4D50',
      text: '#F9FAFB',
      textMuted: '#9CA3AF',
    },
  },

  // ==========================================
  // TYPOGRAPHY - Hierarchical scale
  // ==========================================
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
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
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // ==========================================
  // SPACING - 8pt grid system
  // ==========================================
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    7: '1.75rem',   // 28px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // ==========================================
  // RADIUS - Modern, rounded aesthetic
  // ==========================================
  radius: {
    none: '0',
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    full: '9999px',
  },

  // ==========================================
  // SHADOWS - Depth and elevation
  // ==========================================
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    
    // Brand-specific shadows with primary color
    brand: {
      sm: '0 1px 3px 0 rgba(102, 124, 103, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
      md: '0 4px 8px -2px rgba(102, 124, 103, 0.12), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
      lg: '0 12px 24px -4px rgba(102, 124, 103, 0.14), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 32px -8px rgba(102, 124, 103, 0.16), 0 8px 12px -4px rgba(0, 0, 0, 0.08)',
    },
  },

  // ==========================================
  // ANIMATION - Smooth, purposeful motion
  // ==========================================
  animation: {
    duration: {
      instant: '100ms',
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // ==========================================
  // Z-INDEX - Stacking context
  // ==========================================
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    toast: 1070,
  },

  // ==========================================
  // BREAKPOINTS - Responsive design
  // ==========================================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// ==========================================
// COMPONENT PRESETS
// ==========================================
export const componentPresets = {
  button: {
    height: {
      sm: '2.25rem',   // 36px
      md: '2.75rem',   // 44px
      lg: '3.25rem',   // 52px
      xl: '3.75rem',   // 60px
    },
    padding: {
      sm: '0.75rem 1rem',
      md: '1rem 1.5rem',
      lg: '1.25rem 2rem',
      xl: '1.5rem 2.5rem',
    },
  },
  
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
    },
  },
  
  input: {
    height: {
      sm: '2.25rem',   // 36px
      md: '2.75rem',   // 44px - iOS standard
      lg: '3.25rem',   // 52px
    },
  },
  
  // Minimum touch target for accessibility
  minTouchTarget: '44px',
} as const;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
export const utils = {
  /**
   * Get color with opacity
   */
  withOpacity: (color: string, opacity: number) => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  },
  
  /**
   * Get responsive value
   */
  responsive: <T,>(mobile: T, tablet?: T, desktop?: T) => ({
    mobile,
    tablet: tablet ?? mobile,
    desktop: desktop ?? tablet ?? mobile,
  }),
} as const;

export type DesignTokens = typeof designTokens;
export type ComponentPresets = typeof componentPresets;
