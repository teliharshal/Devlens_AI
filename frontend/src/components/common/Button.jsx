import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-950/50 border border-violet-500/30 focus-visible:ring-violet-500',
  secondary:
    'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 focus-visible:ring-slate-500',
  danger:
    'bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-500/40 shadow-sm shadow-rose-950/40 focus-visible:ring-rose-500',
  ghost:
    'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent focus-visible:ring-slate-500',
};

const SIZES = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2 rounded-xl gap-2',
  lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  icon: Icon,
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="h-4 w-4 text-current" />
      ) : null}
      {children}
    </button>
  );
}
