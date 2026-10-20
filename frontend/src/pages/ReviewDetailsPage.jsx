import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Clock,
  AlertOctagon,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import SeverityBadge from '../components/common/SeverityBadge';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { getReviewById } from '../services/reviewService';
import { formatDate, formatLanguage } from '../utils/formatters';

export default function ReviewDetailsPage() {
  const { id } = useParams();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);

  const fetchReview = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getReviewById(id);
      setReview(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Review #${id} was not found in the database.`);
      } else {
        setError(err.userMessage || `Failed to fetch details for review #${id}.`);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const handleCopy = (text, section) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (loading) {
    return (
      <LoadingState
        size="lg"
        message={`Loading Review #${id}...`}
        description="Fetching AI analysis report, issues, and improved code..."
        className="py-20"
      />
    );
  }

  if (error || !review) {
    return (
      <div className="space-y-6">
        <Link to="/reviews">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            All Reviews
          </Button>
        </Link>
        <ErrorState
          title={error?.includes('404') || error?.includes('not found') ? 'Review Not Found' : 'Error Loading Review'}
          message={error || 'The requested code review could not be loaded.'}
          onRetry={fetchReview}
          retryLabel="Retry"
        />
      </div>
    );
  }

  const issues = Array.isArray(review.issues) ? review.issues : [];
  const strengths = Array.isArray(review.strengths) ? review.strengths : [];
  const score = typeof review.score === 'number' ? review.score : null;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/reviews">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              All Reviews
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                {review.title || `Review #${review.id}`}
              </h1>
              <span className="rounded bg-slate-800 px-2.5 py-0.5 text-xs font-mono text-slate-300 uppercase">
                {formatLanguage(review.language)}
              </span>
              <StatusBadge status={review.status} />
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>Submitted {formatDate(review.created_at)}</span>
              {review.updated_at && review.updated_at !== review.created_at && (
                <>
                  <span>•</span>
                  <span>Updated {formatDate(review.updated_at)}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={fetchReview}
            title="Refresh review"
          >
            Refresh
          </Button>
          <Link to="/reviews/new">
            <Button variant="primary" size="sm" icon={Sparkles}>
              Review Another Snippet
            </Button>
          </Link>
        </div>
      </div>

      {/* Warning if review status is failed */}
      {review.status === 'failed' && (
        <div className="rounded-xl border border-rose-900/50 bg-rose-950/30 p-4 text-xs text-rose-300 flex items-start gap-3">
          <AlertOctagon className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-rose-200">AI Analysis Incomplete:</strong>{' '}
            The AI service encountered an issue while reviewing this code snippet. Summary and metrics may be partial or missing.
          </div>
        </div>
      )}

      {/* Overview Grid: Score & Summary + Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score & Summary Card */}
        <Card title="Score & Summary" className="md:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-black ${
                score === null
                  ? 'border-slate-700 bg-slate-800/60 text-slate-400'
                  : score >= 80
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : score >= 60
                  ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                  : 'border-rose-500/40 bg-rose-950/40 text-rose-300'
              }`}
            >
              {score !== null ? score : '--'}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">
                {score === null
                  ? 'Pending or Unscored'
                  : score >= 85
                  ? 'Excellent Code Quality'
                  : score >= 70
                  ? 'Good Code Quality'
                  : score >= 50
                  ? 'Needs Improvement'
                  : 'Significant Refactoring Required'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated by GroqCloud AI synchronous analysis engine.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-lg border border-slate-800/80">
            {review.summary || 'No summary was generated for this review.'}
          </div>
        </Card>

        {/* Strengths Card */}
        <Card title="Identified Strengths">
          {strengths.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              No specific strengths were documented for this submission.
            </p>
          ) : (
            <ul className="space-y-2.5 text-xs text-slate-300">
              {strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Issues Section */}
      <Card
        title={`Detected Issues (${issues.length})`}
        subtitle="Actionable line-referenced suggestions and vulnerability findings"
      >
        {issues.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
            <h4 className="text-sm font-semibold text-slate-200">No issues detected</h4>
            <p className="text-xs text-slate-400 mt-1">
              No bugs, vulnerabilities, or maintainability violations were found in this code snippet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition-colors hover:border-slate-700/80"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={issue.severity} />
                    <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-400 uppercase">
                      {issue.issue_type}
                    </span>
                    <span className="text-sm font-semibold text-slate-200">
                      {issue.title}
                    </span>
                  </div>

                  {issue.line_number && (
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0 self-start sm:self-auto">
                      Line {issue.line_number}
                    </span>
                  )}
                </div>

                {issue.explanation && (
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {issue.explanation}
                  </p>
                )}

                {issue.suggestion && (
                  <div className="mt-3 rounded-lg bg-slate-900/90 border border-slate-800 p-3 text-xs font-mono text-emerald-400 leading-relaxed">
                    <span className="text-slate-400 font-sans font-medium block mb-1 text-[11px]">
                      Recommended Fix:
                    </span>
                    {issue.suggestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Submitted Code */}
      <Card
        title="Original Submitted Code"
        subtitle={`Language: ${formatLanguage(review.language)}`}
        action={
          <Button
            variant="ghost"
            size="sm"
            icon={copiedSection === 'original' ? Check : Copy}
            onClick={() => handleCopy(review.code, 'original')}
          >
            {copiedSection === 'original' ? 'Copied' : 'Copy Code'}
          </Button>
        }
      >
        <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs font-mono text-slate-200 leading-relaxed border border-slate-800/80">
          <code>{review.code || '// No code recorded'}</code>
        </pre>
      </Card>

      {/* Improved Code (if provided by AI) */}
      {review.improved_code && (
        <Card
          title="AI Suggested Improved Code"
          subtitle="Refactored version incorporating recommended optimizations and fixes"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={copiedSection === 'improved' ? Check : Copy}
              onClick={() => handleCopy(review.improved_code, 'improved')}
            >
              {copiedSection === 'improved' ? 'Copied' : 'Copy Improved Code'}
            </Button>
          }
        >
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs font-mono text-emerald-300 leading-relaxed border border-slate-800/80">
            <code>{review.improved_code}</code>
          </pre>
        </Card>
      )}
    </div>
  );
}
