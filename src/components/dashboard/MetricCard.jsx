import SilicaPanel from "../SilicaPanel";

export default function MetricCard({ title, children, className = "" }) {
  return (
    <SilicaPanel className={`flex flex-col justify-between min-h-[120px] ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--app-text-muted)]">
        {title}
      </span>
      <div className="mt-3 flex-1 flex flex-col justify-center">{children}</div>
    </SilicaPanel>
  );
}
