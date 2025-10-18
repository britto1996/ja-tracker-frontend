import { ENDPOINTS } from '@/constants/endpoints';
import { adapters } from '@/lib/axios';
import { Application } from '@/types';
import EmptyState from './EmptyState';
import ApplicationListClient from './ApplicationListClient';

// Server Component
export default async function ApplicationListSSR() {
  try {
    const res = await fetch(ENDPOINTS.listApplications, { next: { revalidate: 30 } });
    const data = await res.json();
    const items: Application[] = Array.isArray(data)
      ? data.map(adapters.normalizeApplication)
      : Array.isArray(data?.data)
      ? data.data.map(adapters.normalizeApplication)
      : [];
    if (!items.length) return <EmptyState />;
    return <ApplicationListClient initialItems={items} />;
  } catch {
    return <EmptyState />;
  }
}
