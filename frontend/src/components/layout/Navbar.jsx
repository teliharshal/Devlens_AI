import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Menu, PlusCircle, Sparkles, Terminal } from 'lucide-react';
import Button from '../common/Button';

export default function Navbar({ onToggleSidebar, isAppLayout = false }) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {isAppLayout && onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:hidden focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link
            to={isAppLayout ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-sm shadow-violet-950/50 text-white">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                DevLens <span className="text-violet-400">AI</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase -mt-1">
                Code Review Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right Navigation depending on layout context */}
        {!isAppLayout ? (
          /* Public Navigation for Landing Page */
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-5 sm:flex">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'text-violet-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/about'
                    ? 'text-violet-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                About & Architecture
              </Link>
              <Link
                to="/reviews"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/reviews')
                    ? 'text-violet-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                History
              </Link>
            </nav>

            <div className="flex items-center gap-2.5">
              <Link to="/dashboard">
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link to="/reviews/new">
                <Button variant="primary" size="sm" icon={Sparkles}>
                  Start Review
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Application Shell Top Right Actions */
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-400">
              <Terminal className="h-3.5 w-3.5 text-violet-400" />
              <span>GroqCloud LLaMA-3</span>
            </div>

            <Link to="/reviews/new">
              <Button variant="primary" size="sm" icon={PlusCircle}>
                New Review
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
