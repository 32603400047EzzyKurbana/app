const WIDTH = 240;
const HEIGHT = 56;

export default function MetricSparkline({ points, loading }) {
  if (loading) {
    return <div className="sparkline sparkline-loading">Memuat data CPU…</div>;
  }

  if (!points || points.length === 0) {
    return (
      <div className="sparkline sparkline-empty">
        Belum ada data metrik (CloudWatch belum mencatat, atau instance baru saja aktif)
      </div>
    );
  }

  const values = points.map((p) => p.value);
  const max = Math.max(...values, 10);
  const min = 0;
  const stepX = WIDTH / Math.max(points.length - 1, 1);

  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = HEIGHT - ((p.value - min) / (max - min || 1)) * HEIGHT;
    return [x, y];
  });

  const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;

  const latest = values[values.length - 1];

  return (
    <div className="sparkline">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="sparkline-svg">
        <path d={areaPath} className="sparkline-area" />
        <path d={linePath} className="sparkline-line" />
      </svg>
      <div className="sparkline-readout">
        <span className="sparkline-value">{latest.toFixed(1)}%</span>
        <span className="sparkline-label">CPU saat ini</span>
      </div>
    </div>
  );
}
