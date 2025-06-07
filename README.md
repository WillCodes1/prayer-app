# Prayer App

A modern, responsive web application for generating and managing prayers using Google's Gemini AI. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Generate prayers using AI
- Modern, responsive UI with dark/light mode
- Smooth animations with Framer Motion
- Built with accessibility in mind
- Mobile-first design

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom theming
- **UI Components**: Radix UI Primitives
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Linting/Formatting**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository
   ```bash
   git clone [repository-url]
   cd prayer-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── lib/           # Utility functions and API clients
├── styles/        # Global styles and CSS variables
└── App.tsx       # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Gemini API](https://ai.google.dev/)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
