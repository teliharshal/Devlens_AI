import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, GitBranch, Cpu, ShieldCheck } from 'lucide-react';

export default function Footer({ className = '' }) {
  return (
    <footer className={`border-t border-slate-800/80 bg-slate-950/80 text-slate-400 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand & Mission */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 text-slate-200">
              <Code2 className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-semibold tracking-tight">DevLens AI</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                v0.1.0
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 text-center sm:text-left">
              Professional AI-assisted automated code reviews with Django & GroqCloud.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <Link to="/" className="hover:text-slate-200 transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-slate-200 transition-colors">
              Dashboard
            </Link>
            <Link to="/reviews/new" className="hover:text-slate-200 transition-colors">
              New Review
            </Link>
            <Link to="/reviews" className="hover:text-slate-200 transition-colors">
              History
            </Link>
            <Link to="/about" className="hover:text-slate-200 transition-colors">
              About
            </Link>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>API Synchronous Engine</span>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-900 pt-6 text-center text-[11px] text-slate-600">
          &copy; {new Date().getFullYear()} DevLens AI. Built with React, Tailwind CSS v4, Django REST Framework, and PostgreSQL.
        </div>
      </div>
    </footer>
  );
}
