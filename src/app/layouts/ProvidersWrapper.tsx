import { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';
import '../lib/i18n';

interface ProvidersWrapperProps {
  children: ReactNode;
}

export function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthProvider>
  );
}
