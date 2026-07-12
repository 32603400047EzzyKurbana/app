export default function CostSummary({ cost }) {
  if (!cost) {
    return (
      <section className="panel cost-summary">
        <h2 className="panel-title">Estimasi Biaya</h2>
        <p className="panel-empty">Memuat estimasi…</p>
      </section>
    );
  }

  return (
    <section className="panel cost-summary">
      <h2 className="panel-title">Estimasi Biaya</h2>
      <p className="cost-headline">
        <span className="cost-figure">${cost.totalPerHourUsd}</span>
        <span className="cost-unit">/ jam</span>
      </p>
      <div className="cost-grid">
        <div>
          <span className="cost-label">Per hari</span>
          <span className="cost-value">${cost.totalPerDayUsd}</span>
        </div>
        <div>
          <span className="cost-label">Per bulan (30 hari)</span>
          <span className="cost-value">${cost.totalPerMonthUsd}</span>
        </div>
        <div>
          <span className="cost-label">Instance berjalan</span>
          <span className="cost-value">{cost.runningCount}</span>
        </div>
      </div>
      <p className="panel-note">
        Estimasi on-demand berdasarkan tipe instance yang sedang berjalan. Bukan tagihan resmi AWS.
      </p>
    </section>
  );
}
