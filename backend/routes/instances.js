import { Router } from "express";
import {
  listInstances,
  startInstance,
  stopInstance,
  rebootInstance,
  terminateInstance,
} from "../services/ec2Service.js";
import { getCpuUtilization } from "../services/cloudwatchService.js";
import { addLog, getLogs } from "../services/logService.js";
import { estimateRunningCost } from "../services/costService.js";

const router = Router();

// GET /api/instances - daftar semua instance
router.get("/", async (req, res) => {
  try {
    const instances = await listInstances();
    res.json({ instances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/instances/cost - estimasi biaya instance yang sedang running
router.get("/cost", async (req, res) => {
  try {
    const instances = await listInstances();
    const cost = estimateRunningCost(instances);
    res.json(cost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/instances/logs - riwayat aksi
router.get("/logs", (req, res) => {
  const limit = Number(req.query.limit) || 50;
  res.json({ logs: getLogs(limit) });
});

// GET /api/instances/:id/metrics - data CPU utilization
router.get("/:id/metrics", async (req, res) => {
  try {
    const minutes = Number(req.query.minutes) || 60;
    const points = await getCpuUtilization(req.params.id, minutes);
    res.json({ points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper generik untuk aksi start/stop/reboot/terminate + logging
async function handleAction(req, res, action, fn) {
  const { id } = req.params;
  const { name } = req.body || {};
  try {
    await fn(id);
    const entry = addLog({
      instanceId: id,
      instanceName: name || id,
      action,
      status: "success",
    });
    res.json({ ok: true, log: entry });
  } catch (err) {
    const entry = addLog({
      instanceId: id,
      instanceName: name || id,
      action,
      status: "error",
      message: err.message,
    });
    res.status(500).json({ ok: false, error: err.message, log: entry });
  }
}

router.post("/:id/start", (req, res) => handleAction(req, res, "start", startInstance));
router.post("/:id/stop", (req, res) => handleAction(req, res, "stop", stopInstance));
router.post("/:id/reboot", (req, res) => handleAction(req, res, "reboot", rebootInstance));
router.post("/:id/terminate", (req, res) =>
  handleAction(req, res, "terminate", terminateInstance)
);

export default router;
