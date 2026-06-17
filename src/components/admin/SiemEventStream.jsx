import { useEffect, useRef } from "react";

const SEVERITY_META = {
  critical: { label: "CRIT", className: "siem-sev--critical" },
  warning: { label: "WARN", className: "siem-sev--warning" },
  stable: { label: "INFO", className: "siem-sev--stable" },
};

export default function SiemEventStream({ events = [], className = "" }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);

  return (
    <div className={`siem-event-stream ${className}`}>
      <div className="siem-event-stream__head">
        <span className="siem-event-stream__head-col">TIME</span>
        <span className="siem-event-stream__head-col">SEV</span>
        <span className="siem-event-stream__head-col">SOURCE</span>
        <span className="siem-event-stream__head-col siem-event-stream__head-col--msg">EVENT</span>
      </div>
      <div ref={scrollRef} className="siem-event-stream__body">
        {events.length === 0 && (
          <p className="siem-event-stream__empty">Pipeline idle — awaiting agent telemetry.</p>
        )}
        {events.map((evt) => {
          const sev = SEVERITY_META[evt.severity] || SEVERITY_META.stable;
          return (
            <div key={evt.id} className="siem-event-row">
              <span className="siem-event-row__time">{evt.time}</span>
              <span className={`siem-sev-badge ${sev.className}`}>{sev.label}</span>
              <span className="siem-event-row__source">{evt.source}</span>
              <span className="siem-event-row__message">{evt.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
