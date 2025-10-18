'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { uiActions } from '@/store/slices/ui.slice';
import { applicationsActions } from '@/store/slices/applications.slice';

export default function ReminderPanel() {
  const dispatch = useDispatch();
  const reminders = useSelector((s: RootState) => s.ui.reminders);
  const autoArchiveEnabled = useSelector((s: RootState) => s.ui.autoArchiveEnabled);
  if (!reminders.length) return (
    <div className="rounded-lg border bg-white p-3 text-sm text-muted-foreground">No reminders</div>
  );
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Reminders</div>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={autoArchiveEnabled}
            onChange={(e) => dispatch(uiActions.setAutoArchiveEnabled(e.target.checked))}
          />
          Auto-archive past due (grace {7}d)
        </label>
      </div>
      {reminders.map((r) => (
        <div key={r.id} className="flex items-center justify-between rounded-lg border bg-white p-3 text-sm">
          <div>{r.message}</div>
          {r.type === 'auto-archive' && (
            <button
              onClick={() => {
                const appId = r.id.replace('-archive', '').replace(/^(.*?)-archive$/, '$1');
                // Safe fallback: split on '-archive'
                const id = r.id.split('-archive')[0];
                dispatch(applicationsActions.updateStatus.request({ id, status: 'archived' }));
              }}
              className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
            >
              Archive Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
