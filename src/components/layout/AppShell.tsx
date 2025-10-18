import Link from 'next/link';
import { Plus, Briefcase } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="container-app flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Briefcase className="h-5 w-5" />
            <span className="font-semibold">JA Tracker</span>
          </Link>
          <Link
            href="/applications/new"
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Create Application
          </Link>
        </div>
      </header>

      {/* Body */}
      <main className="container-app py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left rail */}
          <aside className="md:col-span-3">
            <div id="left-rail" className="space-y-3" />
          </aside>
          {/* Content */}
          <section className="md:col-span-9 space-y-3">{children}</section>
        </div>
      </main>
    </div>
  );
}
