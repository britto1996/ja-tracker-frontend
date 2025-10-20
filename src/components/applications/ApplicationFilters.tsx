'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { uiActions, SortOrder } from '@/store/slices/ui.slice';

const STATUSES = ['applied', 'interview', 'offer', 'rejected', 'withdrawn', 'archived'];
const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'created-desc', label: 'Newest First' },
  { value: 'created-asc', label: 'Oldest First' },
  { value: 'deadline-asc', label: 'Deadline: Earliest' },
  { value: 'deadline-desc', label: 'Deadline: Latest' },
];

export default function ApplicationFilters() {
  const dispatch = useDispatch();
  const { filterStatus, sortOrder } = useSelector((s: RootState) => s.ui);
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
        <div className="mb-2 text-sm font-medium">Sort By</div>
        <select
          value={sortOrder}
          onChange={(e) => dispatch(uiActions.setSortOrder(e.target.value as SortOrder))}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
