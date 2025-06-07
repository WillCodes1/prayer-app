# Project Architecture

This document provides an overview of the Prayer App's architecture and design decisions.

## Overall Architecture

The application follows a modern React architecture with a focus on:
- Component-based UI development
- Type safety with TypeScript
- Utility-first CSS with Tailwind
- Responsive design principles
- Accessibility best practices

## Core Technologies

### Frontend
- **React 18**: UI library with hooks
- **TypeScript**: Static type checking
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives
- **Framer Motion**: Animation library
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Styling
- **Tailwind CSS**: For utility-first styling
- **CSS Variables**: For theming and dynamic styles
- **PostCSS**: For processing CSS

## Directory Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # Radix UI based components
│   └── shared/    # Application-specific shared components
├── lib/           # Utility functions and API clients
├── styles/        # Global styles and CSS variables
├── App.tsx        # Root component
└── main.tsx       # Application entry point
```

## State Management

The application uses React's built-in state management with `useState` and `useReducer` hooks. For global state, we leverage React Context when needed.

## API Integration

### Google Gemini API
- Used for AI-powered prayer generation
- API key is stored in environment variables
- API calls are made from the `lib/api.ts` module

## Performance Considerations

- Code splitting with React.lazy and Suspense
- Optimized assets with Vite
- Efficient re-renders with React.memo and useCallback
- Lazy loading for non-critical components

## Security

- Environment variables for sensitive data
- Input sanitization
- CORS configuration
- Secure HTTP headers (via Vite plugins if needed)
