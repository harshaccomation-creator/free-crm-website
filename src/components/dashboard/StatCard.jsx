import '../../styles/dashboardBase.css';

export default function StatCard({ icon, label, value, change, danger }) {
  return (
    <article className="sf-stat-card">
      <span className="sf-stat-icon">{icon}</span>
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
        {change && <small className={danger ? 'danger' : ''}>{danger ? '↓' : '↑'} {change}</small>}
      </div>
    </article>
  );
}
