import designSystem from '../config/designSystem'

// Utility function to generate CSS custom properties from design system
export const generateCSSVariables = () => {
  const cssVariables: string[] = []
  
  // Colors
  Object.entries(designSystem.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      cssVariables.push(`--color-${key}: ${value};`)
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        cssVariables.push(`--color-${key}-${subKey}: ${subValue};`)
      })
    }
  })
  
  // Typography
  Object.entries(designSystem.typography.fontSize).forEach(([key, value]) => {
    cssVariables.push(`--font-size-${key}: ${value};`)
  })
  
  Object.entries(designSystem.typography.fontWeight).forEach(([key, value]) => {
    cssVariables.push(`--font-weight-${key}: ${value};`)
  })
  
  // Spacing
  Object.entries(designSystem.spacing).forEach(([key, value]) => {
    cssVariables.push(`--spacing-${key}: ${value};`)
  })
  
  // Border Radius
  Object.entries(designSystem.borderRadius).forEach(([key, value]) => {
    cssVariables.push(`--border-radius-${key}: ${value};`)
  })
  
  // Shadows
  Object.entries(designSystem.shadows).forEach(([key, value]) => {
    cssVariables.push(`--shadow-${key}: ${value};`)
  })
  
  return cssVariables.join('\n')
}

// Helper function to get CSS variable name
export const getCSSVar = (category: string, key: string, subKey?: string) => {
  if (subKey) {
    return `var(--${category}-${key}-${subKey})`
  }
  return `var(--${category}-${key})`
}

// Helper function to get color
export const getColor = (key: string, subKey?: string) => {
  return getCSSVar('color', key, subKey)
}

// Helper function to get spacing
export const getSpacing = (key: string) => {
  return getCSSVar('spacing', key)
}

// Helper function to get font size
export const getFontSize = (key: string) => {
  return getCSSVar('font-size', key)
}

// Helper function to get shadow
export const getShadow = (key: string) => {
  return getCSSVar('shadow', key)
}

export default designSystem
