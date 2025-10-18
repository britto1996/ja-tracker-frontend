
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Application } from '@/types';
import StatusBadge from './StatusBadge';
import DeadlineBadge from './DeadlineBadge';
import { useDispatch, useSelector } from 'react-redux';
import { coverLettersActions } from '@/store/slices/coverLetters.slice';
import { RootState } from '@/store';

export default function ApplicationCard({ app }: { app: Application }) {
  const dispatch = useDispatch();
  const generating = useSelector((s: RootState) => s.coverLetters.generatingById[app.id]);
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-muted-foreground">{app.company}</div>
          <div className="text-lg font-semibold">{app.role}</div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={app.status} />
          <DeadlineBadge deadline={app.deadline} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <Link href={`/applications/${app.id}`} className="text-primary hover:underline">
          View
        </Link>
        <button
          className="inline-flex items-center gap-2 rounded-md border px-2 py-1 hover:bg-muted disabled:opacity-50"
          disabled={generating}
          onClick={() => dispatch(coverLettersActions.generateCoverLetter.request(app.id))}
        >
          {generating && (
            <span
              className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em]"
              aria-hidden="true"
            />
          )}
          {generating ? 'Generating…' : 'Generate Cover Letter'}
        </button>
      </div>
    </motion.div>
  );
}
