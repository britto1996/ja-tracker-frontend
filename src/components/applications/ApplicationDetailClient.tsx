'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Application } from '@/types';
import { applicationsActions } from '@/store/slices/applications.slice';
import CoverLetterEditor from './CoverLetterEditor';
import ResumePreview from '@/components/applications/ResumePreview';

export default function ApplicationDetailClient({ app }: { app: Application }) {
  const dispatch = useDispatch();
  useEffect(() => {
    // Do not overwrite the entire list with a single item.
    // Keep selection in store and optionally refresh this application from API.
    dispatch(applicationsActions.setSelected(app.id));
    dispatch(applicationsActions.fetchApplicationById.request(app.id));
  }, [app, dispatch]);
  return (
    <div className="space-y-4">
      {/* Status change UI removed as requested */}
      <ResumePreview app={app} />
      <CoverLetterEditor applicationId={app.id} />
    </div>
  );
}
