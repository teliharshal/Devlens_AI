import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while processing your request.',
  onRetry,
  retryLabel = 'Try again',
  className = '',
}) {
  return (
    <div
      className={`rounded-xl border border-rose-900/40 bg-rose-950/20 p-6 text-center text-slate-200 ${className}`}
      role="alert"
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h4 className="text-sm font-semibold text-rose-200 tracking-tight">
        {title}
      </h4>
      <p className="mx-auto mt-1 max-w-md text-xs text-slate-400 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            icon={RotateCcw}
            className="border-rose-900/50 hover:bg-rose-950/30 text-rose-200"
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
