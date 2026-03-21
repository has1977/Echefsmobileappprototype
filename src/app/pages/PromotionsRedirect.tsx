import { useEffect } from 'react';
import { useNavigate } from 'react-router';

// Simple redirect component for old /promotions route
export function PromotionsRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/branch-selection', { replace: true });
  }, [navigate]);

  return null;
}
