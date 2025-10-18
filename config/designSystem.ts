// Design System Configuration
// Update these values to match your Figma design exactly

export const designSystem = {
  // Colors - Update these to match your Figma color palette
  colors: {
    primary: '#2563eb',        // Main brand color
    secondary: '#1e40af',     // Secondary brand color
    accent: '#f59e0b',         // Accent color (buttons, highlights)
    success: '#10b981',        // Success states
    warning: '#f59e0b',        // Warning states
    error: '#ef4444',          // Error states
    text: {
      primary: '#1f2937',      // Main text color
      secondary: '#6b7280',    // Secondary text color
      light: '#9ca3af',        // Light text color
    },
    background: {
      primary: '#ffffff',      // Main background
      secondary: '#f9fafb',    // Secondary background
      tertiary: '#f3f4f6',     // Tertiary background
    },
    border: '#e5e7eb',         // Border color
  },

  // Typography - Update to match your Figma fonts
  typography: {
    fontFamily: {
      primary: 'Cairo',        // Main font family
      secondary: 'Arial',      // Secondary font family
    },
    fontSize: {
      xs: '0.75rem',          // 12px
      sm: '0.875rem',         // 14px
      base: '1rem',           // 16px
      lg: '1.125rem',         // 18px
      xl: '1.25rem',          // 20px
      '2xl': '1.5rem',        // 24px
      '3xl': '1.875rem',      // 30px
      '4xl': '2.25rem',       // 36px
      '5xl': '3rem',          // 48px
      '6xl': '3.75rem',       // 60px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing - Update to match your Figma spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },

  // Border Radius - Update to match your Figma border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows - Update to match your Figma shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Component specific settings
  components: {
    header: {
      height: '80px',
      backgroundColor: 'var(--primary-color)',
    },
    hero: {
      minHeight: '100vh',
      backgroundGradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    card: {
      padding: '2rem',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-lg)',
    },
    button: {
      primary: {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        borderRadius: '0.5rem',
        padding: '1rem 2rem',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: 'var(--primary-color)',
        border: '2px solid var(--primary-color)',
        borderRadius: '0.5rem',
        padding: '1rem 2rem',
      },
    },
  },
}

export default designSystem
