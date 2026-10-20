import React from 'react';
import { Info, Cpu, Database, Layout, ShieldCheck, Terminal, Server } from 'lucide-react';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            About DevLens AI
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Architecture, tech stack, and module foundation details.
        </p>
      </div>

      {/* Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Frontend Architecture" subtitle="React 19 + Tailwind CSS v4">
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <Layout className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100">Vite + React:</strong> Ultra-fast developer experience with ES modules and client-side routing via React Router.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Terminal className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100">Tailwind CSS v4:</strong> Modern CSS-first configuration using standard dark slate surfaces and violet accents.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Server className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100">Axios Client:</strong> Centralized API client configured with fallback to <code className="text-slate-400">http://127.0.0.1:8000/api</code>.
              </div>
            </li>
          </ul>
        </Card>

        <Card title="Backend & AI Engine" subtitle="Django REST Framework + GroqCloud">
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <Cpu className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100">GroqCloud LLM:</strong> Fast synchronous inference for parsing code, analyzing bugs, and suggesting fixes.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Database className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100">PostgreSQL Database:</strong> Stores <code className="text-slate-400">CodeReview</code> records and relational <code className="text-slate-400">ReviewIssue</code> items.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100">Security:</strong> No API keys exposed to the client; all LLM credentials remain securely on the backend.
              </div>
            </li>
          </ul>
        </Card>
      </div>

      {/* API Reference Card */}
      <Card title="REST API Endpoints" subtitle="Direct integration with Django backend">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-2.5 pr-4">Method</th>
                <th className="py-2.5 px-4">Endpoint</th>
                <th className="py-2.5 pl-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-2.5 pr-4 text-emerald-400">GET</td>
                <td className="py-2.5 px-4 text-slate-200">/api/reviews/</td>
                <td className="py-2.5 pl-4 font-sans text-slate-400">List all submitted reviews</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-violet-400">POST</td>
                <td className="py-2.5 px-4 text-slate-200">/api/reviews/</td>
                <td className="py-2.5 pl-4 font-sans text-slate-400">Submit code snippet for synchronous review</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-emerald-400">GET</td>
                <td className="py-2.5 px-4 text-slate-200">/api/reviews/:id/</td>
                <td className="py-2.5 pl-4 font-sans text-slate-400">Retrieve detailed review with nested issues</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
