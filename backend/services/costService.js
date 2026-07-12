// Estimasi harga on-demand per jam (USD), region ap-southeast-1 (Singapore).
// Angka perkiraan untuk keperluan demo/tugas - sesuaikan bila perlu.
const HOURLY_RATE_USD = {
  "t2.micro": 0.014,
  "t2.small": 0.028,
  "t2.medium": 0.0568,
  "t3.micro": 0.0132,
  "t3.small": 0.0264,
  "t3.medium": 0.0528,
  "t3.large": 0.1056,
  "m5.large": 0.12,
  "m5.xlarge": 0.24,
  "c5.large": 0.107,
};

const DEFAULT_RATE = 0.05;

export function getHourlyRate(instanceType) {
  return HOURLY_RATE_USD[instanceType] ?? DEFAULT_RATE;
}

/**
 * Menghitung estimasi biaya berjalan untuk daftar instance yang statusnya "running".
 */
export function estimateRunningCost(instances) {
  const running = instances.filter((i) => i.state === "running");

  const breakdown = running.map((i) => ({
    id: i.id,
    name: i.name,
    type: i.type,
    hourlyRate: getHourlyRate(i.type),
  }));

  const totalPerHour = breakdown.reduce((sum, b) => sum + b.hourlyRate, 0);

  return {
    runningCount: running.length,
    totalPerHourUsd: Number(totalPerHour.toFixed(4)),
    totalPerDayUsd: Number((totalPerHour * 24).toFixed(2)),
    totalPerMonthUsd: Number((totalPerHour * 24 * 30).toFixed(2)),
    breakdown,
  };
}
