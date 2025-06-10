# Prayer App

A modern, responsive web application for generating and managing prayers using Google's Gemini AI. Built with React, TypeScript, Vite, Tailwind CSS, and Firebase.

## Features

- 🔐 Secure authentication with Firebase (Email/Password, Google, Apple)
- 🌐 Real-time data sync with Firestore
- ✨ Generate prayers using AI
- 🎨 Modern, responsive UI with dark/light mode
- 🚀 Smooth animations with Framer Motion
- ♿ Built with accessibility in mind
- 📱 Mobile-first design
- ⚡ Offline support with Firestore persistence

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom theming
- **UI Components**: Radix UI Primitives
- **Animations**: Framer Motion
- **State Management**: React Hooks, React Context
- **Authentication**: Firebase Authentication
- **Database**: Firestore (NoSQL)
- **Build Tool**: Vite
- **Linting/Formatting**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key
- Firebase project with Authentication and Firestore enabled

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

3. Create a `.env.local` file in the root directory and add your API keys (use `.env.local.example` as a reference):
   ```env
   # Google Gemini
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Firebase
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # App Environment
   VITE_APP_ENV=development
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
├── contexts/      # React context providers
├── lib/           # Utility functions and API clients
│   └── firebase/  # Firebase configuration and utilities
├── screens/       # Page components
│   └── auth/      # Authentication screens
├── styles/        # Global styles and CSS variables
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
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

## Firebase Setup

1. Create a new project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password, Google, and Apple sign-in methods
3. Set up Firestore Database in production mode with the following security rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       // Add other collection rules as needed
     }
   }
   ```
4. Register your web app in Firebase Console and get your Firebase config
5. Add your Firebase config to `.env.local` as shown in the Installation section

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Gemini API](https://ai.google.dev/)
- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
