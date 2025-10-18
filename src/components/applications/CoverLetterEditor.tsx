'use client';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coverLettersActions } from '@/store/slices/coverLetters.slice';
import { RootState } from '@/store';

export default function CoverLetterEditor({ applicationId }: { applicationId: string }) {
  const dispatch = useDispatch();
  const letter = useSelector((s: RootState) => s.coverLetters.byId[applicationId]);
  const generating = useSelector((s: RootState) => s.coverLetters.generatingById[applicationId]);
  const saving = useSelector((s: RootState) => s.coverLetters.saving);
  const [preview, setPreview] = useState(true);
  const [note, setNote] = useState('');
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setDraft(letter?.content ?? '');
  }, [letter?.content]);

  const previewHtml = useMemo(() => {
    const text = letter?.content || '';
    // Minimal markdown-ish preview (bold/italics/line breaks)
    const withBreaks = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
    return withBreaks;
  }, [letter?.content]);

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="font-semibold">Cover Letter</div>
          <p className="text-xs text-muted-foreground">Generate and edit. Preview shows formatting.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={generating}
            onClick={() => dispatch(coverLettersActions.generateCoverLetter.request(applicationId))}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
          >
            {generating && (
              <span
                className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em]"
                aria-hidden="true"
              />
            )}
            {generating ? 'Generating…' : letter ? 'Regenerate' : 'Generate'}
          </button>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
          {letter && (
            <button
              type="button"
              disabled={saving || !draft.trim()}
              onClick={() =>
                draft &&
                dispatch(
                  coverLettersActions.editCoverLetter.request({
                    applicationId,
                    content: draft,
                    mode: 'replace',
                    note: note || undefined,
                  }),
                )
              }
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </div>
      {letter ? (
        preview ? (
          <div
            className="prose prose-sm max-w-none rounded-md border bg-muted/30 p-3"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <textarea
            className="h-64 w-full rounded-md border p-2 text-sm"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        )
      ) : (
        <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">
          No letter yet. Click Generate to create a tailored cover letter.
        </div>
      )}
      <div className="mt-3">
        <label className="block text-xs font-medium text-muted-foreground">Note (optional)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="E.g., Refined tone"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
