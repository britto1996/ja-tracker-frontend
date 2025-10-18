"use client";
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Application } from '@/types';
import { isDueSoon, daysUntil } from '@/lib/dates';
import Link from 'next/link';

const WINDOW_DAYS = 3;

export default function SoonDeadlinesList() {
  const storeItems = useSelector((s: RootState) => s.applications.items);
  const items = useMemo(() => {
    const now = new Date();
    const arr = storeItems.filter((a: Application) => isDueSoon(a.deadline, WINDOW_DAYS, now) && a.status !== 'archived');
    return arr.sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 20);
  }, [storeItems]);

  if (!items.length) {
    return (
      <div className="rounded-lg border bg-white p-3 text-sm text-muted-foreground">No upcoming deadlines</div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="mb-2 text-sm font-medium">Due soon (next {WINDOW_DAYS} days)</div>
      <ul className="space-y-2 text-sm">
        {items.map((a) => {
          const d = daysUntil(a.deadline);
          return (
            <li key={a.id} className="flex items-center justify-between">
              <span className="truncate pr-2">
                {a.company} — {a.role}
              </span>
              <span title={new Date(a.deadline).toLocaleString()} className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                D-{d}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 text-right text-xs text-muted-foreground">
        Automatically archived after deadline
      </div>
    </div>
  );
}
