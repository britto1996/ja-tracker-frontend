"use client";
import { useEffect, useMemo, useState } from 'react';
import { Application } from '@/types';
import { toast } from 'sonner';

// Simple markdown to HTML for headings, lists, bold/italic and links
function mdToHtml(md: string) {
  let html = md
    .replace(/^###\s(.+)$/gim, '<h3>$1</h3>')
    .replace(/^##\s(.+)$/gim, '<h2>$1</h2>')
    .replace(/^#\s(.+)$/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1<\/a>')
    .replace(/^\s*[-*]\s+(.+)$/gim, '<li>$1</li>')
    .replace(/\n\s*\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  // wrap consecutive lis into a ul
  html = html.replace(/(<li>.*?<\/li>)(?:<br\/>)*(?=(<li>|$))/gims, '$1');
  html = html.replace(/(?:<(?:br\/)?>)*(<li>.*?<\/li>)+/gims, (block) => {
    const lis = block.match(/<li>.*?<\/li>/gim)?.join('') ?? block;
    return `<ul class="list-disc pl-5 space-y-1">${lis}<\/ul>`;
  });
  return html;
}

export default function ResumePreview({ app }: { app: Application }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resume, setResume] = useState<string>('');

  useEffect(() => {
    let ignore = false;
    async function run() {
      try {
        setError(null);
        setLoading(true);
        // Try to use existing resume if present on item (resumeUrl may contain text)
        if (app.resumeUrl && typeof app.resumeUrl === 'string' && app.resumeUrl.length > 50) {
          setResume(String(app.resumeUrl));
          return;
        }
        const res = await fetch('/api/generate-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobDescription: app.jobDescription, candidate: { company: app.company, role: app.role } }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || 'Failed to generate resume');
        }
        const data = await res.json();
        const text: string = data?.resume || '';
        if (!ignore) setResume(text);
      } catch (e: any) {
        if (!ignore) {
          setError(e?.message || 'Could not generate resume');
          toast.error(e?.message || 'Could not generate resume');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [app.company, app.role, app.jobDescription, app.resumeUrl]);

  const html = useMemo(() => mdToHtml(resume), [resume]);

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="font-semibold">AI Resume</div>
          <p className="text-xs text-muted-foreground">Tailored preview based on the job description.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
            onClick={() => {
              const blob = new Blob([resume], { type: 'text/markdown;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${app.company}-${app.role}-resume.md`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            disabled={!resume || loading}
          >
            Download MD
          </button>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-9/12 animate-pulse rounded bg-muted" />
          <div className="h-48 w-full animate-pulse rounded bg-muted" />
        </div>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : resume ? (
        <div
          className="prose prose-sm max-w-none rounded-md border bg-muted/20 p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="text-sm text-muted-foreground">No resume available.</div>
      )}
    </div>
  );
}
