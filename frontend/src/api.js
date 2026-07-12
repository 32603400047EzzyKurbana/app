const BASE = "/api/instances";

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");
  return data;
}

export async function fetchInstances() {
  const res = await fetch(BASE);
  const data = await handle(res);
  return data.instances;
}

export async function fetchCost() {
  const res = await fetch(`${BASE}/cost`);
  return handle(res);
}

export async function fetchLogs(limit = 50) {
  const res = await fetch(`${BASE}/logs?limit=${limit}`);
  const data = await handle(res);
  return data.logs;
}

export async function fetchMetrics(instanceId, minutes = 60) {
  const res = await fetch(`${BASE}/${instanceId}/metrics?minutes=${minutes}`);
  const data = await handle(res);
  return data.points;
}

async function postAction(instanceId, action, name) {
  const res = await fetch(`${BASE}/${instanceId}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return handle(res);
}

export const startInstance = (id, name) => postAction(id, "start", name);
export const stopInstance = (id, name) => postAction(id, "stop", name);
export const rebootInstance = (id, name) => postAction(id, "reboot", name);
export const terminateInstance = (id, name) => postAction(id, "terminate", name);
