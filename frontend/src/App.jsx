import { useEffect, useMemo, useState, useCallback } from "react";
import Filters from "./components/Filters.jsx";
import Dashboard from "./components/Dashboard.jsx";
import CostSummary from "./components/CostSummary.jsx";
import LogPanel from "./components/LogPanel.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import {
  fetchInstances,
  fetchCost,
  fetchLogs,
  startInstance,
  stopInstance,
  rebootInstance,
  terminateInstance,
} from "./api.js";

const ACTION_FN = {
  start: startInstance,
  stop: stopInstance,
  reboot: rebootInstance,
  terminate: terminateInstance,
};

const CONFIRM_COPY = {
  stop: {
    title: "Hentikan instance ini?",
    confirmLabel: "Ya, hentikan",
    danger: false,
  },
  reboot: {
    title: "Reboot instance ini?",
    confirmLabel: "Ya, reboot",
    danger: false,
  },
  terminate: {
    title: "Terminate instance ini?",
    confirmLabel: "Ya, terminate",
    danger: true,
  },
};

export default function App() {
  const [instances, setInstances] = useState([]);
  const [cost, setCost] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");

  const [busyMap, setBusyMap] = useState({});
  const [pendingAction, setPendingAction] = useState(null); // { instance, action }

  const loadAll = useCallback(async () => {
    setError(null);
    try {
      const [inst, costData, logData] = await Promise.all([
        fetchInstances(),
        fetchCost(),
        fetchLogs(20),
      ]);
      setInstances(inst);
      setCost(costData);
      setLogs(logData);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadAll().finally(() => setLoading(false));
    const interval = setInterval(loadAll, 30000); // auto-refresh 30 detik
    return () => clearInterval(interval);
  }, [loadAll]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const requestAction = (instance, action) => {
    if (action === "start") {
      runAction(instance, action);
    } else {
      setPendingAction({ instance, action });
    }
  };

  const runAction = async (instance, action) => {
    setBusyMap((m) => ({ ...m, [instance.id]: action }));
    setPendingAction(null);
    try {
      await ACTION_FN[action](instance.id, instance.name);
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyMap((m) => {
        const next = { ...m };
        delete next[instance.id];
        return next;
      });
    }
  };

  const filteredInstances = useMemo(() => {
    return instances.filter((i) => {
      const matchesState = stateFilter === "all" || i.state === stateFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q);
      return matchesState && matchesSearch;
    });
  }, [instances, search, stateFilter]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-brand-mark" aria-hidden="true" />
          <div>
            <h1>InstanceWatch</h1>
            <p>Dashboard monitoring &amp; kontrol EC2 instance</p>
          </div>
        </div>
        <div className="app-header-meta">
          <span className="instance-count">
            {instances.filter((i) => i.state === "running").length} / {instances.length} berjalan
          </span>
        </div>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          <strong>Gagal memuat data:</strong> {error}
        </div>
      )}

      <main className="app-main">
        <section className="app-content">
          <Filters
            search={search}
            onSearchChange={setSearch}
            stateFilter={stateFilter}
            onStateFilterChange={setStateFilter}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />

          {loading ? (
            <div className="empty-state">
              <p className="empty-state-title">Memuat instance…</p>
              <p className="empty-state-body">Mengambil data dari AWS EC2.</p>
            </div>
          ) : (
            <Dashboard instances={filteredInstances} onAction={requestAction} busyMap={busyMap} />
          )}
        </section>

        <aside className="app-sidebar">
          <CostSummary cost={cost} />
          <LogPanel logs={logs} />
        </aside>
      </main>

      <ConfirmDialog
        open={!!pendingAction}
        title={pendingAction ? CONFIRM_COPY[pendingAction.action].title : ""}
        description={
          pendingAction
            ? `Instance "${pendingAction.instance.name}" (${pendingAction.instance.id}) akan di-${pendingAction.action}.`
            : ""
        }
        confirmLabel={pendingAction ? CONFIRM_COPY[pendingAction.action].confirmLabel : ""}
        danger={pendingAction ? CONFIRM_COPY[pendingAction.action].danger : false}
        onConfirm={() => runAction(pendingAction.instance, pendingAction.action)}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
