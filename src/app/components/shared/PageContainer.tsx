import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showLanguage?: boolean;
  showNotifications?: boolean;
  showBottomNav?: boolean;
  headerActions?: ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  title,
  showBack = false,
  showLogo = false,
  showLanguage = false,
  showNotifications = false,
  showBottomNav = true,
  headerActions,
  className = '',
}: PageContainerProps) {
  return (
    <div className="flex flex-col h-full">
      <Header
        title={title}
        showBack={showBack}
        showLogo={showLogo}
        showLanguage={showLanguage}
        showNotifications={showNotifications}
        actions={headerActions}
      />
      
      <main className={`flex-1 overflow-y-auto ${showBottomNav ? 'pb-16' : ''} ${className}`}>
        {children}
      </main>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
}
