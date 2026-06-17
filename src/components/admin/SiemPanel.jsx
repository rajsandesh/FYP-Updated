export default function SiemPanel({
  title,
  subtitle,
  headerRight,
  children,
  className = "",
  dense = false,
}) {
  return (
    <section
      className={`siem-panel flex flex-col min-h-0 ${dense ? "siem-panel--dense" : ""} ${className}`}
    >
      {(title || headerRight) && (
        <header className="siem-panel__header shrink-0">
          <div className="min-w-0">
            {title && <h3 className="siem-panel__title">{title}</h3>}
            {subtitle && <p className="siem-panel__subtitle">{subtitle}</p>}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </header>
      )}
      <div className="siem-panel__body flex-1 min-h-0">{children}</div>
    </section>
  );
}
