import Dashboard from '@/components/dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - SAK Attorney Management System',
  description: 'View your practice overview and key metrics'
};

export default async function Page() {
  return <Dashboard />;
}
