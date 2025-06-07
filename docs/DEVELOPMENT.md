# Development Guide

This document provides guidelines and instructions for developing the Prayer App.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd prayer-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
- `npm test`: Run tests

## Project Structure

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

## Code Style

### Naming Conventions

- **Components**: PascalCase (e.g., `PrayerForm.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePrayerGenerator.ts`)
- **Utilities**: camelCase (e.g., `formatPrayer.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **Interfaces/Types**: PascalCase with `I` prefix for interfaces (e.g., `IPrayer`, `PrayerType`)

### File Structure

- One component per file
- Related components in the same directory
- Group by feature, not by type

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type
- Use interfaces for props and state
- Use type guards for runtime type checking

## Component Development

### Creating a New Component

1. Create a new file in the appropriate directory:
   ```bash
   touch src/components/shared/NewComponent.tsx
   ```

2. Define the component with TypeScript:
   ```tsx
   import React from 'react';
   
   interface NewComponentProps {
     // Define props here
   }
   
   export const NewComponent: React.FC<NewComponentProps> = ({ /* destructure props */ }) => {
     return (
       <div>
         {/* Component JSX */}
       </div>
     );
   };
   ```

3. Add PropTypes if needed
4. Add JSDoc comments for documentation

### Styling

- Use Tailwind CSS utility classes
- Prefer composition over inheritance
- Use `@apply` for repeated utility patterns
- Keep custom CSS minimal

## State Management

- Use React hooks for local state
- Use Context API for global state
- Consider using a state management library if needed

## Testing

### Writing Tests

- Use React Testing Library for component tests
- Write unit tests for utility functions
- Test user interactions
- Mock API calls

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run coverage
npm test -- --coverage
```

## Git Workflow

### Branch Naming

- `feature/`: New features
- `bugfix/`: Bug fixes
- `hotfix/`: Critical bug fixes
- `chore/`: Maintenance tasks
- `docs/`: Documentation updates

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

## Pull Requests

1. Create a feature branch
2. Make your changes
3. Write tests if applicable
4. Update documentation
5. Run linter and tests
6. Push your branch and create a pull request
7. Request code review
8. Address review comments
9. Get approval and merge

## Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment to Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting provider.

## Troubleshooting

### Common Issues

- **Dependency issues**: Try deleting `node_modules` and `package-lock.json`, then run `npm install`
- **Type errors**: Ensure all TypeScript types are correctly defined
- **Styling issues**: Check for conflicting utility classes

## Resources

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
