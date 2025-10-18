'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { isPastDue } from '@/lib/dates';
import { applicationsActions } from '@/store/slices/applications.slice';

export function useReminders() {
  const dispatch = useDispatch();
  const apps = useSelector((s: RootState) => s.applications.items);
  useEffect(() => {
    function compute() {
      const now = new Date();
      for (const app of apps) {
        if (app.status !== 'archived' && isPastDue(app.deadline, now)) {
          // Auto-archive immediately once deadline passes
          dispatch(applicationsActions.updateStatus.request({ id: app.id, status: 'archived' }));
        }
      }
    }
    compute();
    const id = setInterval(compute, 5_000);
    return () => clearInterval(id);
  }, [apps, dispatch]);
}
