export default function Stats({ stats }) {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-value">{parseFloat(stats.total).toFixed(4)}</div>
        <div className="stat-label">ETH Tipped Total</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.count}</div>
        <div className="stat-label">Tips Sent</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{parseFloat(stats.balance).toFixed(4)}</div>
        <div className="stat-label">ETH in Jar</div>
      </div>
    </div>
  );
}
