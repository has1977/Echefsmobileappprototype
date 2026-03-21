import { Settings } from 'lucide-react';
import { AdminPlaceholder } from './AdminPlaceholder';

export function AdminSettings() {
  return (
    <AdminPlaceholder
      title="Settings"
      description="System configuration and preferences"
      icon={Settings}
    />
  );
}
