# Styling System

This document outlines the styling approach and design system used in the Prayer App.

## Overview

The application uses a utility-first CSS approach with Tailwind CSS, combined with CSS variables for theming and dynamic styles.

## Design Tokens

### Colors

Colors are defined as CSS variables in `src/index.css` and can be accessed using Tailwind's utility classes.

#### Primary Colors
- `--primary`: Main brand color
- `--primary-foreground`: Text color on primary background

#### Semantic Colors
- `--destructive`: For error states and destructive actions
- `--success`: For success states
- `--warning`: For warning states
- `--info`: For informational states

#### Background Colors
- `--background`: Main background color
- `--foreground`: Main text color
- `--muted`: Muted background color
- `--muted-foreground`: Muted text color

### Typography

#### Font Family
- System font stack for optimal performance
- Custom font loading can be added in `index.html`

#### Font Sizes
- Uses a modular scale for consistent typography
- Responsive typography using CSS variables

### Spacing

Uses Tailwind's default spacing scale:
- `0`: 0px
- `px`: 1px
- `0.5`: 0.125rem (2px)
- `1`: 0.25rem (4px)
- `1.5`: 0.375rem (6px)
- `2`: 0.5rem (8px)
- `2.5`: 0.625rem (10px)
- `3`: 0.75rem (12px)
- `3.5`: 0.875rem (14px)
- `4`: 1rem (16px)
- ...and so on

### Border Radius

- `--radius-sm`: 0.25rem (4px)
- `--radius`: 0.5rem (8px)
- `--radius-md`: 0.625rem (10px)
- `--radius-lg`: 1rem (16px)
- `--radius-xl`: 1.5rem (24px)
- `--radius-2xl`: 2rem (32px)
- `--radius-3xl`: 3rem (48px)
- `--radius-full`: 9999px

## Utility Classes

The application leverages Tailwind's utility classes for styling. Some commonly used utilities include:

### Layout
- `container`: Centers content and sets max-width
- `flex`, `grid`: For layout
- `w-*`, `h-*`: For width and height
- `p-*`, `m-*`: For padding and margin

### Typography
- `text-*`: For font size
- `font-*`: For font weight
- `leading-*`: For line height
- `tracking-*`: For letter spacing

### Colors
- `bg-*`: For background colors
- `text-*`: For text colors
- `border-*`: For border colors

## Dark Mode

Dark mode is supported using the `dark:` variant in Tailwind. The theme is toggled using a theme provider.

### Example

```jsx
<div className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-50">
  {/* Content */}
</div>
```

## Custom Utilities

Custom utilities can be added in the `tailwind.config.js` file under the `theme.extend` object.

## Responsive Design

The application uses a mobile-first approach with the following breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Example

```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content */}
</div>
```

## Animations

Animations are handled using Framer Motion. Common animations include:

- Fade in/out
- Slide in/out
- Scale
- Rotate

### Example

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

## Best Practices

1. **Use Utility Classes**
   Prefer Tailwind's utility classes over custom CSS

2. **Extract Reusable Components**
   Create React components for UI elements used in multiple places

3. **Use CSS Variables for Theming**
   Define colors and other design tokens as CSS variables

4. **Keep Custom CSS Minimal**
   Only write custom CSS when absolutely necessary

5. **Responsive Design**
   Always consider mobile-first and responsive design principles
