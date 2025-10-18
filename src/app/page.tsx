import ApplicationListSSR from '@/components/applications/ApplicationListSSR';
import ApplicationFilters from '@/components/applications/ApplicationFilters';
import RemindersPanel from '../components/applications/RemindersPanel';
import { LeftRail } from '@/components/layout/RailPortal';

export default function Page() {
  // Server renders list; client islands mount into rails
  return (
    <div className="space-y-4">
      {/* Rails */}
      <LeftRail>
        <ApplicationFilters />
        <RemindersPanel />
      </LeftRail>
      {/* Inject filters and reminders via client components in layout rails */}
      {/* Main list */}
      <ApplicationListSSR />
    </div>
  );
}
