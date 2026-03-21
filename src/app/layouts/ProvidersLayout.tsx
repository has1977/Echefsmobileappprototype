import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';
import '../lib/i18n';

/**
 * ProvidersLayout wraps all routes with necessary context providers.
 * This is the root layout in the route tree that provides AuthContext and AppContext.
 */
export function ProvidersLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <Outlet />
      </AppProvider>
    </AuthProvider>
  );
}
