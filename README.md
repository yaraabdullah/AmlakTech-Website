# أملاك تك - AmlakTech Website

A modern, responsive Arabic website built with Next.js and TypeScript, designed to be easily customizable to match your Figma design exactly.

## 🎨 Customizing to Match Your Figma Design

### Quick Start - Match Your Figma Colors

1. **Open `styles/variables.css`**
2. **Update the color variables** to match your Figma design:

```css
:root {
  /* Update these colors to match your Figma design */
  --color-primary: #YOUR_PRIMARY_COLOR;
  --color-secondary: #YOUR_SECONDARY_COLOR;
  --color-accent: #YOUR_ACCENT_COLOR;
  --color-text-primary: #YOUR_TEXT_COLOR;
  --color-background-primary: #YOUR_BACKGROUND_COLOR;
}
```

### Detailed Customization Guide

#### 1. **Colors** (`styles/variables.css`)
Update these variables to match your Figma color palette:

```css
--color-primary: #2563eb;        /* Main brand color */
--color-secondary: #1e40af;      /* Secondary brand color */
--color-accent: #f59e0b;         /* Accent color (buttons, highlights) */
--color-text-primary: #1f2937;   /* Main text color */
--color-text-secondary: #6b7280; /* Secondary text color */
--color-background-primary: #ffffff; /* Main background */
--color-background-secondary: #f9fafb; /* Secondary background */
```

#### 2. **Typography** (`styles/variables.css`)
Update fonts and sizes to match your Figma design:

```css
--font-family-primary: 'Your-Font-Name', sans-serif;
--font-size-h1: 3rem;    /* Main heading size */
--font-size-h2: 2.5rem;  /* Secondary heading size */
--font-size-body: 1rem;  /* Body text size */
```

#### 3. **Spacing** (`styles/variables.css`)
Adjust spacing to match your Figma layout:

```css
--spacing-sm: 0.5rem;   /* Small spacing */
--spacing-md: 1rem;     /* Medium spacing */
--spacing-lg: 1.5rem;  /* Large spacing */
--spacing-xl: 2rem;     /* Extra large spacing */
```

#### 4. **Component-Specific Customization**

**Header** (`styles/Header.module.css`):
- Background color
- Logo styling
- Navigation layout

**Hero Section** (`styles/Hero.module.css`):
- Background gradient/color
- Text positioning
- Button styles

**Services** (`styles/Services.module.css`):
- Card layout
- Grid spacing
- Icon styling

**About Section** (`styles/About.module.css`):
- Layout direction
- Statistics styling
- Image positioning

**Contact Form** (`styles/Contact.module.css`):
- Form styling
- Input field design
- Button appearance

**Footer** (`styles/Footer.module.css`):
- Background color
- Link styling
- Social media icons

### 🛠️ Advanced Customization

#### Design System Configuration (`config/designSystem.ts`)
For advanced users, you can modify the design system configuration:

```typescript
export const designSystem = {
  colors: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR',
    // ... more colors
  },
  typography: {
    fontFamily: {
      primary: 'Your-Font',
    },
    fontSize: {
      h1: '3rem',
      // ... more sizes
    },
  },
  // ... more configurations
}
```

### 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 🌐 RTL Support

The website includes full RTL (Right-to-Left) support for Arabic text:
- All text is right-aligned
- Navigation flows right-to-left
- Form inputs are RTL-friendly

### 🚀 Deployment

1. **Vercel** (Recommended):
   - Connect your GitHub repository
   - Automatic deployment on push

2. **Other Platforms**:
   - Build: `npm run build`
   - Start: `npm start`

### 📁 Project Structure

```
├── components/          # React components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── styles/             # CSS modules
│   ├── variables.css   # Design system variables
│   ├── globals.css    # Global styles
│   └── *.module.css   # Component styles
├── config/             # Configuration files
│   └── designSystem.ts
├── utils/              # Utility functions
│   └── designUtils.ts
└── pages/              # Next.js pages
    ├── _app.tsx
    └── index.tsx
```

### 🎯 Matching Your Figma Design

To get pixel-perfect match with your Figma design:

1. **Extract colors** from Figma using the color picker
2. **Measure spacing** using Figma's measurement tools
3. **Note font sizes** and weights from Figma's typography panel
4. **Update the corresponding CSS variables**
5. **Test on different screen sizes**

### 📞 Support

If you need help customizing specific elements to match your Figma design, please provide:
- Screenshots of your Figma design
- Specific color codes
- Font names and sizes
- Any specific layout requirements

---

**Built with ❤️ for AmlakTech**