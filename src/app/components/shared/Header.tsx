import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { User, LogIn } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showAuth?: boolean;
}

export function Header({ title = 'eChefs', showAuth = true }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="bg-[#667c67] text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        
        {showAuth && (
          <div>
            {isAuthenticated && user ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 gap-2"
                onClick={() => navigate('/profile')}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user.name}</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 gap-2"
                onClick={() => navigate('/sign-in')}
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
