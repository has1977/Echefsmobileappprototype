import { Crown } from 'lucide-react';
import { AdminPlaceholder } from './AdminPlaceholder';

export function AdminLoyalty() {
  return (
    <AdminPlaceholder
      title="Loyalty Program"
      description="Manage customer loyalty programs"
      icon={Crown}
    />
  );
}
