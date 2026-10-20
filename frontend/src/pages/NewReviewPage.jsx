import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Sparkles, ArrowLeft, AlertCircle, Code2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { createReview } from '../services/reviewService';

const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'other', label: 'Other' },
];

export default function NewReviewPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    language: 'python',
    code: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user begins typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Review title is required.';
    } else if (formData.title.trim().length > 200) {
      errors.title = 'Title must be 200 characters or fewer.';
    }

    if (!formData.language) {
      errors.language = 'Please select a programming language.';
    }

    if (!formData.code.trim()) {
      errors.code = 'Source code is required for AI analysis.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const payload = {
        title: formData.title.trim(),
        language: formData.language,
        code: formData.code,
      };

      const result = await createReview(payload);

      if (result && result.id) {
        navigate(`/reviews/${result.id}`);
      } else {
        throw new Error('Server returned an unexpected response without a review ID.');
      }
    } catch (err) {
      setApiError(
        err.userMessage ||
        err.response?.data?.error ||
        'An error occurred while submitting your code review. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" icon={ArrowLeft} disabled={isSubmitting}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <PlusCircle className="h-6 w-6 text-violet-400" />
              New Code Review
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit source code to GroqCloud AI for automated synchronous analysis.
            </p>
          </div>
        </div>
      </div>

      {/* API Error Notification */}
      {apiError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-900/50 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold text-rose-200">Submission Error:</strong>{' '}
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Code Submission Form */}
      <Card
        title="Code Submission Form"
        subtitle="POST /api/reviews/ (Synchronous AI Evaluation)"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Review Title */}
          <div>
            <label htmlFor="review-title" className="block text-xs font-medium text-slate-300 mb-1">
              Review Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="review-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Optimize user session validation logic"
              className={`w-full rounded-xl border bg-slate-950/60 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                validationErrors.title
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-slate-800 focus:border-violet-500'
              }`}
            />
            {validationErrors.title && (
              <p className="mt-1 text-xs text-rose-400">{validationErrors.title}</p>
            )}
          </div>

          {/* Programming Language */}
          <div>
            <label htmlFor="review-language" className="block text-xs font-medium text-slate-300 mb-1">
              Programming Language <span className="text-rose-400">*</span>
            </label>
            <select
              id="review-language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-slate-950/60 px-3.5 py-2 text-sm text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                validationErrors.language
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-slate-800 focus:border-violet-500'
              }`}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-slate-900 text-slate-100">
                  {lang.label}
                </option>
              ))}
            </select>
            {validationErrors.language && (
              <p className="mt-1 text-xs text-rose-400">{validationErrors.language}</p>
            )}
          </div>

          {/* Source Code */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="review-code" className="block text-xs font-medium text-slate-300">
                Source Code <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {formData.code.length} chars
              </span>
            </div>
            <textarea
              id="review-code"
              name="code"
              rows={12}
              value={formData.code}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="// Paste your code here for automated AI review..."
              className={`w-full font-mono text-xs rounded-xl border bg-slate-950/80 p-3.5 text-slate-200 placeholder:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50 leading-relaxed ${
                validationErrors.code
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-slate-800 focus:border-violet-500'
              }`}
              spellCheck="false"
            />
            {validationErrors.code && (
              <p className="mt-1 text-xs text-rose-400">{validationErrors.code}</p>
            )}
          </div>

          {/* Submission Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-500">
              Analysis is executed synchronously by GroqCloud and saved to PostgreSQL.
            </p>

            <Button
              type="submit"
              variant="primary"
              icon={Sparkles}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Analyzing Code with AI...' : 'Submit for AI Review'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
