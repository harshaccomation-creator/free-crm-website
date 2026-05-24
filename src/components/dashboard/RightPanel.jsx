import '../../styles/dashboardBase.css';

export default function RightPanel({ title, items = [], action = 'View All' }) {
  return (
    <article className="sf-right-card">
      <div className="sf-card-head compact">
        <h2>{title}</h2>
        <button type="button">{action}</button>
      </div>
      <div className="sf-right-list">
        {items.map((item, index) => (
          <div className="sf-right-item" key={`${item.title}-${index}`}>
            <span className="sf-right-icon">{item.icon || '•'}</span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </div>
            {item.meta && <em>{item.meta}</em>}
          </div>
        ))}
      </div>
    </article>
  );
}
