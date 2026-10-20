import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  History,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { getReviews } from '../services/reviewService';
import { formatDate, formatLanguage } from '../utils/formatters';

export default function DashboardPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.userMessage || 'Failed to retrieve code reviews from backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived statistics from live backend data
  const totalReviews = reviews.length;
  const scoredReviews = reviews.filter((r) => typeof r.score === 'number' && !isNaN(r.score));
  const averageScore = scoredReviews.length > 0
    ? Math.round(scoredReviews.reduce((sum, r) => sum + r.score, 0) / scoredReviews.length)
    : null;

  const totalIssues = reviews.reduce((sum, r) => {
    return sum + (Array.isArray(r.issues) ? r.issues.length : 0);
  }, 0);

  const completedCount = reviews.filter((r) => r.status === 'completed').length;

  const recentReviews = reviews.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-violet-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Dashboard
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Overview of automated AI code reviews, live metrics, and recent activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            isLoading={loading}
            onClick={fetchDashboardData}
            title="Refresh metrics from backend"
          >
            Refresh
          </Button>
          <Link to="/reviews/new">
            <Button variant="primary" icon={PlusCircle}>
              New Code Review
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState
          size="lg"
          message="Loading dashboard metrics..."
          description="Connecting to Django REST API and aggregating review data..."
          className="py-16"
        />
      ) : error ? (
        <ErrorState
          title="Unable to load dashboard data"
          message={error}
          onRetry={fetchDashboardData}
          retryLabel="Retry Connection"
          className="my-6"
        />
      ) : (
        <>
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-slate-900/50">
              <div className="text-xs font-medium text-slate-400">Total Reviews</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-100">
                  {totalReviews}
                </span>
                <span className="text-xs text-slate-500">records</span>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                {completedCount} completed successfully
              </div>
            </Card>

            <Card className="bg-slate-900/50">
              <div className="text-xs font-medium text-slate-400">Average Score</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${
                  averageScore === null
                    ? 'text-slate-500'
                    : averageScore >= 80
                    ? 'text-emerald-400'
                    : averageScore >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {averageScore !== null ? averageScore : '--'}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                {scoredReviews.length > 0 ? `Across ${scoredReviews.length} scored reviews` : 'No scores available yet'}
              </div>
            </Card>

            <Card className="bg-slate-900/50">
              <div className="text-xs font-medium text-slate-400">Issues Detected</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-rose-400">
                  {totalIssues}
                </span>
                <span className="text-xs text-slate-500">total</span>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Identified across all analyzed files
              </div>
            </Card>

            <Card className="bg-slate-900/50">
              <div className="text-xs font-medium text-slate-400">Engine Status</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-lg font-semibold text-slate-200">Synchronous</span>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                GroqCloud API connected
              </div>
            </Card>
          </div>

          {/* Recent Reviews Section */}
          <Card
            title="Recent Code Reviews"
            subtitle="Latest evaluations stored in PostgreSQL"
            action={
              totalReviews > 0 && (
                <Link to="/reviews">
                  <Button variant="secondary" size="sm" icon={History}>
                    View All ({totalReviews})
                  </Button>
                </Link>
              )
            }
          >
            {recentReviews.length === 0 ? (
              <EmptyState
                title="No code reviews yet"
                message="Submit your first code snippet to start generating AI code evaluations and metrics."
                action={
                  <Link to="/reviews/new">
                    <Button variant="primary" icon={PlusCircle}>
                      Submit First Review
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="divide-y divide-slate-800/80">
                {recentReviews.map((review) => {
                  const issueCount = Array.isArray(review.issues) ? review.issues.length : 0;
                  return (
                    <div
                      key={review.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 px-2 rounded-lg transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            to={`/reviews/${review.id}`}
                            className="text-sm font-semibold text-slate-200 hover:text-violet-300 transition-colors truncate"
                          >
                            {review.title || `Review #${review.id}`}
                          </Link>
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 uppercase">
                            {formatLanguage(review.language)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          <span>{formatDate(review.created_at)}</span>
                          <span>•</span>
                          <span>
                            {typeof review.score === 'number'
                              ? `Score: ${review.score}/100`
                              : 'No score'}
                          </span>
                          <span>•</span>
                          <span>
                            {issueCount} {issueCount === 1 ? 'issue' : 'issues'} found
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
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
            )}
          </Card>
        </>
      )}
    </div>
  );
}
