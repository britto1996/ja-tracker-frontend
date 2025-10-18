'use client';
import { ApplicationStatus } from '@/types';

const colors: Record<ApplicationStatus, string> = {
  applied: 'bg-gray-100 text-gray-800',
  interview: 'bg-blue-100 text-blue-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-neutral-200 text-neutral-700',
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}
