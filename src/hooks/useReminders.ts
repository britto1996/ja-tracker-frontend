'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { isPastDue } from '@/lib/dates';
import { applicationsActions } from '@/store/slices/applications.slice';

export function useReminders() {
  const dispatch = useDispatch();
  const apps = useSelector((s: RootState) => s.applications.items);
  const loading = useSelector((s: RootState) => s.applications.loading);
  
  useEffect(() => {
    // Track which applications have already been processed to avoid duplicate requests
    const processedApps = new Set<string>();
    
    function compute() {
      // Don't run while the application state is loading to avoid race conditions
      if (loading) return;
      
      const now = new Date();
      for (const app of apps) {
        // Only process applications that:
        // 1. Are not already archived
        // 2. Are past due
        // 3. Haven't been processed yet in this session
        if (
          app.status !== 'archived' && 
          isPastDue(app.deadline, now) && 
          !processedApps.has(app.id)
        ) {
          // Mark as processed to prevent duplicate requests
          processedApps.add(app.id);
          // Auto-archive immediately once deadline passes
          dispatch(applicationsActions.updateStatus.request({ id: app.id, status: 'archived' }));
        }
      }
    }
    
    compute();
    const id = setInterval(compute, 60_000); // Reduced frequency to every minute instead of 5 seconds
    return () => clearInterval(id);
  }, [apps, dispatch, loading]);
}
