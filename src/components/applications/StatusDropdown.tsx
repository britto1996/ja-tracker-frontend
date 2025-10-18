'use client';
import { useDispatch } from 'react-redux';
import { applicationsActions } from '@/store/slices/applications.slice';
import { ApplicationStatus } from '@/types';

const STATUSES: ApplicationStatus[] = [
  'applied',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
  'archived',
];

export default function StatusDropdown({ id, value }: { id: string; value: ApplicationStatus }) {
  const dispatch = useDispatch();
  return (
    <select
      value={value}
      onChange={(e) =>
        dispatch(applicationsActions.updateStatus.request({ id, status: e.target.value as ApplicationStatus }))
      }
      className="rounded-md border px-2 py-1 text-sm"
      aria-label="Update status"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
