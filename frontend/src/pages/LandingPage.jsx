import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Terminal,
  Cpu,
  CheckCircle2,
  Bug,
  Lock,
  Gauge,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import SeverityBadge from '../components/common/SeverityBadge';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 font-sans antialiased selection:bg-violet-500/30 selection:text-violet-200">
      {/* Public Navbar (No Sidebar) */}
      <Navbar isAppLayout={false} />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
          {/* Subtle Ambient Background Gradients */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 right-10 -z-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span>Next-Gen AI Code Reviewer</span>
              </div>

              {/* Main Heading */}
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-100">
                Automated Code Reviews with{' '}
                <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Engineering Precision
                </span>
              </h1>

              {/* Subheading */}
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-400">
                DevLens AI analyzes your source code synchronously via GroqCloud LLM models,
                detecting security vulnerabilities, performance bottlenecks, bugs, and maintainability issues with actionable suggestions.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/reviews/new">
                  <Button variant="primary" size="lg" icon={Sparkles}>
                    Start Code Review
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="secondary" size="lg" icon={ArrowRight}>
                    Open Dashboard
                  </Button>
                </Link>
              </div>

              {/* Tech Stack Meta Pill */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-violet-400" /> GroqCloud LLM
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" /> Django REST Framework
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> PostgreSQL Persistence
                </span>
              </div>
            </div>

            {/* Feature Cards Showcase */}
            <div className="mt-16 sm:mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card
                title="Bugs & Vulnerability Detection"
                subtitle="High-precision AST & semantic code evaluation"
                className="bg-slate-900/40"
              >
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pinpoint logic bugs, buffer leaks, and edge-case exceptions before they reach staging or production branches.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SeverityBadge severity="critical" />
                  <SeverityBadge severity="high" />
                </div>
              </Card>

              <Card
                title="Synchronous GroqCloud Analysis"
                subtitle="Low latency sub-second inference"
                className="bg-slate-900/40"
              >
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct synchronous communication guarantees immediate code review feedback without complex queue latency.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge status="completed" />
                  <StatusBadge status="processing" />
                </div>
              </Card>

              <Card
                title="Comprehensive Code Scoring"
                subtitle="Detailed metrics & line-by-line feedback"
                className="bg-slate-900/40"
              >
                <p className="text-xs text-slate-400 leading-relaxed">
                  Receive an overall code health score (0–100), key architectural strengths, line-referenced issues, and improved code.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SeverityBadge severity="medium" />
                  <SeverityBadge severity="low" />
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  );
}
