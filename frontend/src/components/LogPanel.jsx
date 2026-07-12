const ACTION_LABELS = {
  start: "Start",
  stop: "Stop",
  reboot: "Reboot",
  terminate: "Terminate",
};

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LogPanel({ logs }) {
  return (
    <section className="panel log-panel">
      <h2 className="panel-title">Aktivitas Terbaru</h2>
      {logs.length === 0 ? (
        <p className="panel-empty">Belum ada aksi yang dilakukan pada sesi ini.</p>
      ) : (
        <ul className="log-list">
          {logs.map((log) => (
            <li key={log.id} className={`log-item log-${log.status}`}>
              <span className="log-dot" aria-hidden="true" />
              <div className="log-body">
                <p className="log-text">
                  <strong>{ACTION_LABELS[log.action] || log.action}</strong> — {log.instanceName}
                </p>
                {log.status === "error" && <p className="log-error">{log.message}</p>}
                <time className="log-time">{formatTime(log.timestamp)}</time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
