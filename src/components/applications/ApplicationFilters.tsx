'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { uiActions } from '@/store/slices/ui.slice';

const STATUSES = ['applied', 'interview', 'offer', 'rejected', 'withdrawn', 'archived'];

export default function ApplicationFilters() {
  const dispatch = useDispatch();
  const { filterStatus } = useSelector((s: RootState) => s.ui);
  const reminders = useSelector((s: RootState) => s.ui.reminders);
  const toggle = (s: string) => {
    const next = filterStatus.includes(s)
      ? filterStatus.filter((x) => x !== s)
      : [...filterStatus, s];
    dispatch(uiActions.setFilterStatus(next));
  };
  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-white p-3">
        <div className="mb-2 text-sm font-medium">Status</div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => toggle(s)}
              className={`rounded-full border px-3 py-1 text-xs ${
                filterStatus.includes(s) ? 'bg-primary text-white border-primary' : 'hover:bg-muted'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
