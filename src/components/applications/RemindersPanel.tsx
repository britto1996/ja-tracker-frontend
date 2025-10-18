"use client";
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Application } from '@/types';
import { isDueSoon, daysUntil } from '@/lib/dates';

const WINDOW_DAYS = 3;

export default function RemindersPanel() {
  const items = useSelector((s: RootState) => s.applications.items);
  const dueSoon = useMemo(() => {
    const now = new Date();
    return items
      .filter((a: Application) => a.status !== 'archived' && isDueSoon(a.deadline, WINDOW_DAYS, now))
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 20);
  }, [items]);

  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-sm font-medium">Reminders</div>
      {dueSoon.length === 0 ? (
        <div className="mt-1 text-sm text-muted-foreground">No reminders right now</div>
      ) : (
        <div className="mt-2">
          <div className="text-xs text-muted-foreground">Due soon (next {WINDOW_DAYS} days)</div>
          <ul className="mt-1 space-y-2 text-sm">
            {dueSoon.map((a) => {
              const d = daysUntil(a.deadline);
              return (
                <li key={a.id} className="flex items-center justify-between gap-3">
                  <span className="truncate pr-2">{a.company} — {a.role}</span>
                  <span
                    title={new Date(a.deadline).toLocaleString()}
                    className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800"
                  >
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
      )}
    </div>
  );
}
