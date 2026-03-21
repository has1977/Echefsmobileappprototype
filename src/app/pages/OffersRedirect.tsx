import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

// Redirect old /branch/:branchId/offers route to new /branch/:branchId/promotions
export function OffersRedirect() {
  const navigate = useNavigate();
  const { branchId } = useParams<{ branchId: string }>();

  useEffect(() => {
    if (branchId) {
      navigate(`/branch/${branchId}/promotions`, { replace: true });
    } else {
      navigate('/branch-selection', { replace: true });
    }
  }, [navigate, branchId]);

  return null;
}
