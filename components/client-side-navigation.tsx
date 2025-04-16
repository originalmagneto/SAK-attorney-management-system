'use client';

import { useAuth } from '@/contexts/auth-context';
import Navigation from '@/components/navigation';

export default function ClientSideNavigation() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return <Navigation />;
}
