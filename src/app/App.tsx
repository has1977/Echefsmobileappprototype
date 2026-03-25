import { RouterProvider } from "react-router";
import { router } from "./routes";
import "./lib/i18n";
import { useEffect } from "react";
import { initializeCacheManagement } from "./utils/cacheManager";

/**
 * App Component - Entry Point
 * Providers now in RootLayout to fix context availability
 * Updated: March 25, 2026 - Build 3.3.5
 * Last update: Added cache management
 */
export default function App() {
  console.log("🔵 App.tsx rendering - Build 3.3.5");
  
  // Initialize cache management on app load
  useEffect(() => {
    initializeCacheManagement().catch(error => {
      console.error('Failed to initialize cache management:', error);
    });
  }, []);
  
  return <RouterProvider router={router} />;
}