'use client';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Application } from '@/types';
import { RootState } from '@/store';
import ApplicationCard from './ApplicationCard';
import { applicationsActions } from '@/store/slices/applications.slice';
import { uiActions } from '@/store/slices/ui.slice';

export default function ApplicationListClient({ initialItems }: { initialItems: Application[] }) {
  const dispatch = useDispatch();
  const { filterStatus, sortOrder, page, pageSize } = useSelector((s: RootState) => s.ui);
  const storeItems = useSelector((s: RootState) => s.applications.items);
  useEffect(() => {
    if (storeItems.length === 0 && initialItems.length > 0) {
      dispatch(applicationsActions.hydrate(initialItems));
    }
  }, [dispatch, initialItems, storeItems.length]);
  const items = useMemo(() => {
    // Merge SSR items with client store items so the list is complete and up-to-date
    const map = new Map<string, Application>();
    for (const it of initialItems) map.set(it.id, it);
    for (const it of storeItems) map.set(it.id, it); // prefer store version
    let arr = Array.from(map.values());
    if (filterStatus.length) {
      arr = arr.filter((a) => filterStatus.includes(a.status));
    }
    if (sortOrder === 'deadline-asc') arr = [...arr].sort((a, b) => a.deadline.localeCompare(b.deadline));
    if (sortOrder === 'deadline-desc') arr = [...arr].sort((a, b) => b.deadline.localeCompare(a.deadline));
    return arr;
  }, [storeItems, initialItems, filterStatus, sortOrder]);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return (
    <div className="space-y-3">
      {pageItems.map((a) => (
        <ApplicationCard key={a.id} app={a} />
      ))}
      <div className="mt-4 flex items-center justify-between rounded-md border bg-white p-2 text-sm">
        <div>
          Page {currentPage} of {totalPages} • {total} total
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border px-2 py-1 disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => dispatch(uiActions.setPage(currentPage - 1))}
          >
            Prev
          </button>
          <button
            className="rounded-md border px-2 py-1 disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => dispatch(uiActions.setPage(currentPage + 1))}
          >
            Next
          </button>
          <select
            className="rounded-md border px-2 py-1"
            value={pageSize}
            onChange={(e) => dispatch(uiActions.setPageSize(Number(e.target.value)))}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
