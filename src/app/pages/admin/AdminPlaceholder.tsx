import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ArrowLeft, Construction } from 'lucide-react';

interface AdminPlaceholderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function AdminPlaceholder({ title, description, icon: Icon = Construction }: AdminPlaceholderProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6">
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-[#667c67]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Icon className="w-12 h-12 text-[#667c67]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {title} - Coming Soon
            </h2>
            <p className="text-gray-500 mb-6">
              This feature is currently under development. Check back soon for updates!
            </p>
            <Button
              onClick={() => navigate('/admin')}
              className="bg-[#667c67] hover:bg-[#526250]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
