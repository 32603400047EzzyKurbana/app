const STATE_LABELS = {
  running: "Berjalan",
  stopped: "Berhenti",
  pending: "Memulai",
  stopping: "Menghentikan",
  "shutting-down": "Mematikan",
  terminated: "Diterminasi",
};

export default function StatusBadge({ state }) {
  const label = STATE_LABELS[state] || state;
  return (
    <span className={`status-badge state-${state}`}>
      <span className="pulse-dot" aria-hidden="true">
        <span className="pulse-dot-core" />
        <span className="pulse-dot-ring" />
      </span>
      {label}
    </span>
  );
}
