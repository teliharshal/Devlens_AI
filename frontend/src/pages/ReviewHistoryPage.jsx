import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { History, PlusCircle, Search, RefreshCw, ExternalLink, Filter, FileCode2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { getReviews } from '../services/reviewService';
import { formatDate, formatLanguage } from '../utils/formatters';

const FILTER_LANGUAGES = ['all', 'python', 'javascript', 'typescript', 'java', 'cpp', 'other'];

export default function ReviewHistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.userMessage || 'Failed to retrieve review history from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        (review.title && review.title.toLowerCase().includes(term)) ||
        (review.language && review.language.toLowerCase().includes(term)) ||
        (review.summary && review.summary.toLowerCase().includes(term));

      const matchesLanguage =
        selectedLanguage === 'all' ||
        (review.language && review.language.toLowerCase() === selectedLanguage.toLowerCase());

      return matchesSearch && matchesLanguage;
    });
  }, [reviews, searchTerm, selectedLanguage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-violet-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Review History
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Browse and inspect all past AI code reviews stored in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            isLoading={loading}
            onClick={fetchHistory}
            title="Refresh review records"
          >
            Refresh
          </Button>
          <Link to="/reviews/new">
            <Button variant="primary" icon={PlusCircle}>
              New Review
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reviews by title, language, or summary..."
            disabled={loading || !!error}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={loading || !!error}
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50 capitalize"
          >
            {FILTER_LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-slate-900 text-slate-200">
                {lang === 'all' ? 'All Languages' : formatLanguage(lang)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews Content Area */}
      {loading ? (
        <LoadingState
          size="lg"
          message="Loading review records..."
          description="Fetching historical code analyses from backend..."
          className="py-16"
        />
      ) : error ? (
        <ErrorState
          title="Unable to load reviews"
          message={error}
          onRetry={fetchHistory}
          retryLabel="Retry"
          className="my-6"
        />
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No code reviews yet"
          message="You haven't submitted any code for review yet. Submit your first snippet to get automated AI feedback."
          action={
            <Link to="/reviews/new">
              <Button variant="primary" icon={PlusCircle}>
                Submit First Review
              </Button>
            </Link>
          }
        />
      ) : filteredReviews.length === 0 ? (
        <EmptyState
          title="No matching reviews found"
          message="No records matched your search query or language filter. Try clearing your filters."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedLanguage('all');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <Card
          title={`Saved Code Reviews (${filteredReviews.length})`}
          subtitle="Sorted by most recent"
        >
          <div className="space-y-3">
            {filteredReviews.map((review) => {
              const issueCount = Array.isArray(review.issues) ? review.issues.length : 0;
              return (
                <div
                  key={review.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-900/50 transition-colors gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/reviews/${review.id}`}
                        className="text-sm font-semibold text-slate-200 hover:text-violet-300 transition-colors"
                      >
                        {review.title || `Review #${review.id}`}
                      </Link>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 uppercase">
                        {formatLanguage(review.language)}
                      </span>
                    </div>

                    {review.summary && (
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                        {review.summary}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span>{formatDate(review.created_at)}</span>
                      <span>•</span>
                      <span>
                        {typeof review.score === 'number'
                          ? `Score: ${review.score}/100`
                          : 'Score pending'}
                      </span>
                      <span>•</span>
                      <span>
                        {issueCount} {issueCount === 1 ? 'issue' : 'issues'} found
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                    <StatusBadge status={review.status} />
                    <Link to={`/reviews/${review.id}`}>
                      <Button variant="secondary" size="sm" icon={ExternalLink}>
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
