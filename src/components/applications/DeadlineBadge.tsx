'use client';
import { daysUntil, isPastDue } from '@/lib/dates';

export default function DeadlineBadge({ deadline }: { deadline: string }) {
  const du = daysUntil(deadline);
  const overdue = isPastDue(deadline);
  const label = overdue ? `D+${Math.abs(du)}` : `D-${du}`;
  return (
    <span
      title={new Date(deadline).toLocaleString()}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
        overdue ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
      }`}
    >
      {label}
    </span>
  );
}
