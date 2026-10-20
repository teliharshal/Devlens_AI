import { AlertOctagon, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    bg: 'bg-rose-950/60',
    border: 'border-rose-800/60',
    text: 'text-rose-300',
    icon: AlertOctagon,
  },
  high: {
    label: 'High',
    bg: 'bg-orange-950/60',
    border: 'border-orange-800/60',
    text: 'text-orange-300',
    icon: ShieldAlert,
  },
  medium: {
    label: 'Medium',
    bg: 'bg-amber-950/60',
    border: 'border-amber-800/60',
    text: 'text-amber-300',
    icon: AlertTriangle,
  },
  low: {
    label: 'Low',
    bg: 'bg-sky-950/60',
    border: 'border-sky-800/60',
    text: 'text-sky-300',
    icon: Info,
  },
};

export default function SeverityBadge({
  severity = 'low',
  showIcon = true,
  className = '',
}) {
  const normalized = (severity || '').toLowerCase().trim();
  const config = SEVERITY_CONFIG[normalized] || {
    label: severity || 'Unknown',
    bg: 'bg-slate-900',
    border: 'border-slate-800',
    text: 'text-slate-400',
    icon: Info,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider select-none ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      {showIcon && Icon && <Icon className="h-3 w-3 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}
