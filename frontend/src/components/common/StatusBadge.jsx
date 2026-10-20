import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-950/50',
    border: 'border-emerald-800/50',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  pending: {
    label: 'Pending',
    bg: 'bg-amber-950/50',
    border: 'border-amber-800/50',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    icon: Clock,
  },
  processing: {
    label: 'Processing',
    bg: 'bg-violet-950/50',
    border: 'border-violet-800/50',
    text: 'text-violet-400',
    dot: 'bg-violet-400 animate-pulse',
    icon: Loader2,
    spin: true,
  },
  failed: {
    label: 'Failed',
    bg: 'bg-rose-950/50',
    border: 'border-rose-800/50',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
    icon: XCircle,
  },
};

export default function StatusBadge({
  status = 'pending',
  showIcon = true,
  className = '',
}) {
  const normalized = (status || '').toLowerCase().trim();
  const config = STATUS_CONFIG[normalized] || {
    label: status || 'Unknown',
    bg: 'bg-slate-900',
    border: 'border-slate-800',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize tracking-wide select-none ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      {showIcon && Icon && (
        <Icon className={`h-3 w-3 ${config.spin ? 'animate-spin' : ''}`} />
      )}
      {!showIcon && (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
}
