import '../../styles/dashboardBase.css';

export default function MiniChart({ title = 'Performance', type = 'line' }) {
  return (
    <article className="sf-chart-card">
      <div className="sf-card-head">
        <h2>{title}</h2>
        <button type="button">This Week ▾</button>
      </div>
      <div className={`sf-chart-visual ${type}`}>
        <span style={{ height: '34%' }} />
        <span style={{ height: '48%' }} />
        <span style={{ height: '42%' }} />
        <span style={{ height: '74%' }} />
        <span style={{ height: '82%' }} />
        <span style={{ height: '56%' }} />
        <span style={{ height: '68%' }} />
      </div>
    </article>
  );
}
