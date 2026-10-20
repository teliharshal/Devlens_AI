import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-slate-100 font-sans selection:bg-violet-500/30 selection:text-violet-200">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-violet-400">
          <FileQuestion className="h-8 w-8" />
        </div>

        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-mono font-semibold text-violet-300">
          HTTP 404
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          The requested route does not exist or has been relocated within the DevLens AI platform.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button variant="secondary" icon={Home}>
              Return Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="primary" icon={ArrowLeft}>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
