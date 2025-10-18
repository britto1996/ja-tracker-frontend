'use client';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { applicationsActions } from '@/store/slices/applications.slice';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { toast } from 'sonner';
// Lightweight readers for client-side extraction
// pdfjs-dist is ESM; Next.js can load it client-side. We'll lazily import to reduce bundle.
// mammoth extracts text from .docx files.

const schema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  jobDescription: z.string().min(1),
  resume: z.string().min(1, 'Resume is required'),
  deadline: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function NewApplicationPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { createApplicationSuccess } = useSelector((s: RootState) => s.applications);
  // use react-hook-form for resume field; no separate state needed
  const [generating, setGenerating] = useState(false);
  const creating = useSelector((s: RootState) => s.applications.loading);
  const { register, handleSubmit, formState, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: '',
      role: '',
      jobDescription: '',
      resume: '',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString().slice(0, 10),
    },
  });

  async function generateResume() {
    try {
      setGenerating(true);
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: values.jobDescription, candidate: { company: values.company, role: values.role } }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to generate resume');
      }
      const data = await res.json();
      const text: string = data?.resume || '';
      if (text) {
        setValue('resume', text, { shouldValidate: true, shouldDirty: true });
      }
      toast.success('Generated resume');
    } catch (e: any) {
      toast.error(e?.message || 'Could not generate resume');
    } finally {
      setGenerating(false);
    }
  }

  const routeBack = () => {
    router.replace(`/`);
  }

  const onSubmit = async (values: FormValues) => {
    const payload = {
      company: values.company,
      role: values.role,
      job_description: values.jobDescription,
      resume: (values as any).resume || undefined,
      deadline: new Date(values.deadline).toISOString(),
    } as any;
    dispatch(applicationsActions.createApplication.request(payload));
    
  };

  useEffect(() => {
    if (createApplicationSuccess) {
      routeBack();
    }
  }, [createApplicationSuccess]);

  const values = watch();
  const isSubmitDisabled = useMemo(() => {
    const errs = formState.errors;
    const hasValues = Boolean(values.company && values.role && values.jobDescription && values.deadline && (values as any).resume);
    const hasErrors = !!(errs.company || errs.role || errs.jobDescription || errs.deadline || (errs as any).resume);
    return hasErrors || !hasValues || creating;
  }, [formState.errors, values, creating]);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h1 className="mb-1 text-2xl font-semibold">Add Application</h1>
      <p className="mb-4 text-sm text-muted-foreground">Start your workflow by logging a role you applied for.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Company</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" {...register('company')} />
          {formState.errors.company && (
            <p className="text-xs text-red-600">Company is required</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" {...register('role')} />
          {formState.errors.role && <p className="text-xs text-red-600">Role is required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Job Description</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={6} {...register('jobDescription')} />
          {formState.errors.jobDescription && (
            <p className="text-xs text-red-600">Description is required</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Resume</label>
            <button
              type="button"
              className="text-xs underline text-primary disabled:opacity-50"
              onClick={generateResume}
              disabled={generating || !values.jobDescription}
            >
              {generating ? 'Generating…' : 'Generate from Job Description'}
            </button>
          </div>
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2"
            rows={10}
            value={(values as any).resume}
            onChange={(e) => setValue('resume', e.target.value, { shouldValidate: true, shouldDirty: true })}
            {...(register as any)('resume')}
          />
          {formState.errors && (formState.errors as any).resume && (
            <p className="text-xs text-red-600">Resume is required</p>
          )}
          {(values as any).resume && (
            <p className="mt-1 text-xs text-muted-foreground">{(values as any).resume.length} characters</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Deadline</label>
          <input type="date" className="mt-1 w-full rounded-md border px-3 py-2" {...register('deadline')} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
          >
            {creating ? 'Saving…' : 'Save'}
          </button>
          <span className="text-xs text-muted-foreground">You’ll be redirected to the list on success.</span>
        </div>
      </form>
    </div>
  );
}
