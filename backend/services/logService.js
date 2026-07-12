import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE = path.join(__dirname, "..", "data", "logs.json");

function readLogs() {
  try {
    const raw = fs.readFileSync(LOG_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLogs(logs) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

export function addLog({ instanceId, instanceName, action, status, message }) {
  const logs = readLogs();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    timestamp: new Date().toISOString(),
    instanceId,
    instanceName,
    action,
    status, // "success" | "error"
    message: message || "",
  };
  logs.unshift(entry); // terbaru di atas
  writeLogs(logs.slice(0, 200)); // simpan maksimal 200 entri
  return entry;
}

export function getLogs(limit = 50) {
  return readLogs().slice(0, limit);
}
