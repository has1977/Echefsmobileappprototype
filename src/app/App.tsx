import { RouterProvider } from 'react-router';
import { router } from './routes';
import './lib/i18n';

/**
 * App Component - Entry Point
 * Providers now in RootLayout to fix context availability
 * Updated: March 19, 2026 - Build 3.3.2
 */
export default function App() {
  console.log('🔵 App.tsx rendering - providers in RootLayout');
  return <RouterProvider router={router} />;
}