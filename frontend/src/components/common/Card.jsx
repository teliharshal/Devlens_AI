
export default function Card({
  children,
  title,
  subtitle,
  action,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...props
}) {
  const hasHeader = title || subtitle || action;

  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5 text-slate-100 shadow-sm transition-colors ${className}`}
      {...props}
    >
      {hasHeader && (
        <div className={`mb-4 flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3 ${headerClassName}`}>
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-100 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={bodyClassName}>{children}</div>

      {footer && (
        <div className={`mt-4 border-t border-slate-800/80 pt-3 text-xs text-slate-400 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
