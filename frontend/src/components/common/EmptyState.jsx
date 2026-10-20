import { FileCode2 } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  message = 'There is nothing to display here yet.',
  icon: Icon = FileCode2,
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center text-slate-300 ${className}`}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-200 tracking-tight">
        {title}
      </h4>
      <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">
        {message}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
