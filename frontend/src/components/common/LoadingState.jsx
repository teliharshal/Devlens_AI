import { Loader2 } from 'lucide-react';

export default function LoadingState({
  message = 'Loading...',
  description,
  className = '',
  size = 'md',
}) {
  const spinnerSizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center text-slate-300 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-3 flex items-center justify-center">
        <div className="absolute h-10 w-10 rounded-full bg-violet-500/10 blur-sm" />
        <Loader2 className={`animate-spin text-violet-400 ${spinnerSizes[size] || spinnerSizes.md}`} />
      </div>
      <p className="text-sm font-medium text-slate-200">{message}</p>
      {description && (
        <p className="mt-1 text-xs text-slate-400 max-w-sm">{description}</p>
      )}
    </div>
  );
}
