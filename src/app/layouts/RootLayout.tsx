import { Outlet } from 'react-router';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { OfflineIndicator } from '../components/shared/OfflineIndicator';
import { SettingsOnboarding } from '../components/SettingsOnboarding';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { CheckInProvider } from '../contexts/CheckInContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

/**
 * RootLayout - Top-level layout for all routes
 * Updated: March 25, 2026 - Build 3.3.5 - Fixed import cache issues
 */
export function RootLayout() {
  console.log('🟡 RootLayout rendering with providers - Build 3.3.5');
  
  // Set viewport meta tag for mobile responsiveness
  useEffect(() => {
    // Ensure viewport meta tag exists
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    
    // Set mobile-optimized body styles
    document.body.style.touchAction = 'manipulation';
    document.body.style.webkitTextSizeAdjust = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <FavoritesProvider>
          <CheckInProvider>
            <div className="fixed inset-0 overflow-hidden">
              <main className="h-full w-full overflow-y-auto overflow-x-hidden">
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              </main>
              <Toaster position="top-center" richColors />
              <OfflineIndicator />
              <SettingsOnboarding />
            </div>
          </CheckInProvider>
        </FavoritesProvider>
      </AppProvider>
    </AuthProvider>
  );
}