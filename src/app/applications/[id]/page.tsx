import { ENDPOINTS } from '@/constants/endpoints';
import { adapters } from '@/lib/axios';
import { Application } from '@/types';
import Timeline from '@/components/applications/Timeline';
import ApplicationDetailClient from '@/components/applications/ApplicationDetailClient';

interface Props {
  params: { id: string };
}

export default async function ApplicationDetail({ params }: Props) {
  const res = await fetch(ENDPOINTS.getApplication(params.id), { cache: 'no-store' });
  const data = await res.json();
  const app: Application = adapters.normalizeApplication(data);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-6">
        <div className="text-sm text-muted-foreground">{app.company}</div>
        <div className="text-xl font-semibold">{app.role}</div>
        <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
          {app.jobDescription}
        </div>
      </div>
      <Timeline app={app} />
      <ApplicationDetailClient app={app} />
    </div>
  );
}
