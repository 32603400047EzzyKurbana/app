import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import MetricSparkline from "./MetricSparkline.jsx";
import { fetchMetrics } from "../api.js";

const ACTIONS = [
  { key: "start", label: "Start", applicableWhen: (s) => s === "stopped" },
  { key: "stop", label: "Stop", applicableWhen: (s) => s === "running" },
  { key: "reboot", label: "Reboot", applicableWhen: (s) => s === "running" },
  { key: "terminate", label: "Terminate", applicableWhen: () => true, danger: true },
];

export default function InstanceCard({ instance, onAction, busyAction }) {
  const [points, setPoints] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingMetrics(true);
    fetchMetrics(instance.id, 60)
      .then((pts) => {
        if (!cancelled) setPoints(pts);
      })
      .catch(() => {
        if (!cancelled) setPoints([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMetrics(false);
      });
    return () => {
      cancelled = true;
    };
  }, [instance.id, instance.state]);

  return (
    <article className={`instance-card state-${instance.state}`}>
      <header className="instance-card-header">
        <div>
          <h3 className="instance-name">{instance.name}</h3>
          <p className="instance-id">{instance.id}</p>
        </div>
        <StatusBadge state={instance.state} />
      </header>

      <dl className="instance-meta">
        <div>
          <dt>Tipe</dt>
          <dd>{instance.type}</dd>
        </div>
        <div>
          <dt>Zona</dt>
          <dd>{instance.az}</dd>
        </div>
        <div>
          <dt>IP Publik</dt>
          <dd>{instance.publicIp || "—"}</dd>
        </div>
        <div>
          <dt>IP Privat</dt>
          <dd>{instance.privateIp || "—"}</dd>
        </div>
      </dl>

      <MetricSparkline points={points} loading={loadingMetrics} />

      <footer className="instance-actions">
        {ACTIONS.filter((a) => a.applicableWhen(instance.state)).map((a) => (
          <button
            key={a.key}
            className={`btn ${a.danger ? "btn-danger" : "btn-secondary"}`}
            disabled={busyAction === a.key}
            onClick={() => onAction(instance, a.key)}
          >
            {busyAction === a.key ? "Memproses…" : a.label}
          </button>
        ))}
      </footer>
    </article>
  );
}
