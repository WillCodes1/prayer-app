# Sacred Space Prayer App - Design Specification

## Overview
Sacred Space is a luxury Christian prayer application with a modern, dark-themed mobile design. The app provides a peaceful, premium experience for users to share their thoughts and receive AI-generated personalized prayers.

## Design Philosophy
- **Premium & Luxurious**: High-end, Apple-inspired design with glassy effects and glowing elements
- **Peaceful & Sacred**: Calming dark theme with gentle gradients and soft lighting effects
- **Mobile-First**: Optimized for mobile devices with responsive design principles
- **Modern Tech Startup**: Clean, minimalist interface with sophisticated animations

## Color Palette

### Primary Gradients
- **Purple to Pink**: `from-purple-500 to-pink-500` (primary actions)
- **Purple to Pink Hover**: `from-purple-600 to-pink-600` (hover states)

### Background Colors
- **Main Background**: `bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`
- **Card Background**: `bg-slate-800/50` with `backdrop-blur-xl`
- **Disabled State**: `from-slate-600 to-slate-600`

### Text Colors
- **Primary Text**: `text-white`
- **Secondary Text**: `text-slate-400`
- **Gradient Text**: `bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent`

### Border & Effects
- **Glass Border**: `border-white/10`
- **Glow Effects**: Various opacity levels of purple/pink gradients with blur
- **Shadow Effects**: `shadow-purple-500/25` and `shadow-purple-500/30`

## Typography

### Hierarchy
- **Main Title (H1)**: `text-4xl font-bold` with gradient text effect
- **Section Title (H2)**: `text-2xl font-semibold text-white`
- **Subtitle (H3)**: `text-xl font-semibold text-white`
- **Body Text**: `text-lg leading-relaxed` for descriptions
- **Base Text**: `text-base leading-relaxed` for content
- **Small Text**: `text-sm` for secondary information

### Font Weights
- **Bold**: Main titles and important headings
- **Semibold**: Section titles and button text
- **Normal**: Body text and form inputs

## Layout Structure

### Container System
- **Main Container**: `max-w-md mx-auto w-full` (mobile-optimized width)
- **Padding**: `px-6 py-8` for main container
- **Full Height**: `min-h-screen` with flexbox layout

### Spacing System
- **Large Spacing**: `space-y-8` for major sections
- **Medium Spacing**: `space-y-6` for content blocks
- **Small Spacing**: `space-y-4` for related elements
- **Micro Spacing**: `space-y-2` for tightly coupled content

## Component Design

### Buttons

#### Primary Button
```css
w-full bg-gradient-to-r from-purple-500 to-pink-500 
hover:from-purple-600 hover:to-pink-600 
text-white font-semibold py-4 rounded-2xl 
shadow-lg shadow-purple-500/25 backdrop-blur-sm 
border border-white/10 transition-all duration-300 
hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30
```

#### Ghost Button
```css
w-full text-slate-400 hover:text-white hover:bg-white/5 
py-3 rounded-xl transition-all duration-300
```

#### Disabled State
```css
disabled:from-slate-600 disabled:to-slate-600 
disabled:hover:scale-100 disabled:shadow-lg
```

### Form Elements

#### Textarea
```css
min-h-[300px] bg-transparent border-none resize-none 
text-white placeholder-slate-400 text-base leading-relaxed 
focus:ring-0 p-6 rounded-3xl
```

#### Container for Textarea
```css
bg-slate-800/50 backdrop-blur-xl rounded-3xl 
border border-white/10 p-1
```

### Glass Cards
```css
bg-slate-800/50 backdrop-blur-xl rounded-3xl 
border border-white/10 p-6
```

### Glow Effects

#### Icon Glow Background
```css
absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 
rounded-full blur-xl opacity-30 scale-110
```

#### Card Glow Background
```css
absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 
rounded-3xl blur-xl
```

## Animation System

### Page Transitions (AnimatePresence)
- **Mode**: `wait` (one animation completes before next begins)
- **Exit animations**: Elements animate out before new ones animate in

### Motion Variants

#### Welcome Screen
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
```

#### Input Screen
```javascript
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
```

#### Prayer Screen
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
```

### Staggered Animations

#### Icon Animation
```javascript
initial={{ scale: 0.8 }}
animate={{ scale: 1 }}
transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
```

#### Text Fade-ins
- **Title**: `transition={{ delay: 0.4 }}`
- **Subtitle**: `transition={{ delay: 0.6 }}`
- **Button**: `transition={{ delay: 0.8 }}`

#### Loading Spinner
```javascript
animate={{ rotate: 360 }}
transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
```

### Hover Effects
```css
hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30
transition-all duration-300
```

## Three-Screen User Flow

### 1. Welcome Screen
- **Purpose**: App introduction and brand presentation
- **Key Elements**:
  - Glowing heart icon with rotating background effect
  - "Sacred Space" gradient title
  - Descriptive subtitle
  - Primary call-to-action button
- **Layout**: Centered vertical stack with equal spacing

### 2. Input Screen
- **Purpose**: User input collection
- **Key Elements**:
  - "Share Your Heart" header
  - Large textarea with glass effect
  - Primary submit button (disabled when empty)
  - Back navigation button
- **Layout**: Form-focused with prominent textarea

### 3. Prayer Screen
- **Purpose**: Display generated prayer or loading state
- **Key Elements**:
  - Loading state with rotating sparkles icon
  - Prayer display in glass card
  - Reset button to start over
- **Layout**: Content-focused with prayer as hero element

## Interactive States

### Button States
1. **Default**: Gradient background with glow
2. **Hover**: Darker gradient + scale up + enhanced glow
3. **Disabled**: Gray gradient + no hover effects
4. **Active**: Maintains hover state appearance

### Input States
1. **Empty**: Placeholder text visible
2. **Focused**: No visual change (transparent focus ring)
3. **Filled**: User content visible

### Loading States
1. **Generating**: Rotating icon with descriptive text
2. **Complete**: Smooth transition to prayer display

## Technical Implementation

### Dependencies
- **React**: Core framework with hooks
- **Framer Motion**: Animation library
- **Lucide React**: Icon library (Heart, Sparkles, Send icons)
- **Tailwind CSS**: Utility-first styling
- **ShadCN UI**: Component library (Button, Textarea)

### State Management
```javascript
const [currentView, setCurrentView] = useState<'welcome' | 'input' | 'prayer'>('welcome');
const [userInput, setUserInput] = useState('');
const [generatedPrayer, setGeneratedPrayer] = useState('');
const [isGenerating, setIsGenerating] = useState(false);
```

### API Integration
- **Google Generative AI**: Gemini model for prayer generation
- **Safety Checks**: Content filtering for self-harm keywords
- **Error Handling**: Graceful fallback for API failures
- **Prompt Engineering**: Specific Christian prayer formatting

### Performance Considerations
- **Backdrop Blur**: Used sparingly for glass effects
- **Gradient Optimization**: CSS gradients over image gradients
- **Animation Optimization**: Transform-based animations for 60fps
- **Lazy Loading**: API calls only when needed

## Responsive Design

### Mobile-First Approach
- **Container**: `max-w-md` ensures mobile optimization
- **Touch Targets**: Minimum 44px for all interactive elements
- **Spacing**: Adequate padding for thumb navigation
- **Text Size**: Readable without zooming

### Breakpoint Considerations
- **Small Screens**: Full-width design
- **Medium Screens**: Centered with max-width constraint
- **Large Screens**: Maintains mobile layout for consistency

## Accessibility

### Color Contrast
- White text on dark backgrounds meets WCAG AA standards
- Purple/pink gradients maintain sufficient contrast ratios

### Interactive Elements
- Clear focus states (though minimal for aesthetic)
- Adequate touch targets for mobile devices
- Semantic HTML structure

### Content Accessibility
- Descriptive button text
- Clear navigation flow
- Loading state feedback

## Brand Voice & Messaging

### App Name
"Sacred Space" - Conveys peace, spirituality, and personal sanctuary

### Tone
- Peaceful and calming
- Respectful and reverent
- Supportive and caring
- Professional yet warm

### Messaging
- Welcome: "A peaceful place to share your heart and receive personalized prayers"
- Input: "Share Your Heart" and "What's on your mind today?"
- Loading: "Crafting Your Prayer" and "Creating something beautiful just for you"
- Result: "Your Personal Prayer" and "Crafted with love and intention"

## Implementation Notes

### Critical Design Elements
1. **Dark Theme**: Essential for the peaceful, premium feel
2. **Gradient Effects**: Core to the modern, tech startup aesthetic
3. **Glass Morphism**: Key for the luxury appearance
4. **Smooth Animations**: Critical for premium user experience
5. **Mobile Layout**: Optimized for primary use case

### Performance Requirements
- Smooth 60fps animations
- Fast API response handling
- Minimal loading states
- Responsive touch interactions

### Future Considerations
- Prayer history functionality
- Sharing capabilities
- Prayer categories
- User accounts and preferences
