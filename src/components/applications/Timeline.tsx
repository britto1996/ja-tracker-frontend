import { Application } from '@/types';

export default function Timeline({ app }: { app: Application }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="font-medium mb-2">Timeline</div>
      <ul className="text-sm text-muted-foreground list-disc pl-5">
        <li>Created at {new Date(app.createdAt ?? app.updatedAt ?? Date.now()).toLocaleString()}</li>
        <li>Current status: {app.status}</li>
      </ul>
    </div>
  );
}
