const STATES = [
  { value: "all", label: "Semua" },
  { value: "running", label: "Berjalan" },
  { value: "stopped", label: "Berhenti" },
  { value: "pending", label: "Memulai" },
  { value: "stopping", label: "Menghentikan" },
];

export default function Filters({ search, onSearchChange, stateFilter, onStateFilterChange, onRefresh, refreshing }) {
  return (
    <div className="filters">
      <input
        type="text"
        className="filters-search"
        placeholder="Cari nama atau instance ID…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="filters-states" role="tablist" aria-label="Filter status instance">
        {STATES.map((s) => (
          <button
            key={s.value}
            role="tab"
            aria-selected={stateFilter === s.value}
            className={`filter-chip ${stateFilter === s.value ? "active" : ""}`}
            onClick={() => onStateFilterChange(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <button className="btn btn-refresh" onClick={onRefresh} disabled={refreshing}>
        {refreshing ? "Menyegarkan…" : "Segarkan"}
      </button>
    </div>
  );
}
