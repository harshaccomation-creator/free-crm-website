import '../../styles/dashboardBase.css';

export default function DashboardTopbar({ title, subtitle, userName, roleLabel, searchPlaceholder }) {
  return (
    <header className="sf-topbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="sf-top-actions">
        <label className="sf-search-box">
          <span>⌕</span>
          <input placeholder={searchPlaceholder || 'Search...'} />
          <kbd>⌘ K</kbd>
        </label>
        <button className="sf-bell" type="button">🔔<i>5</i></button>
        <button className="sf-user-menu" type="button">
          <span className="sf-avatar">{userName?.slice(0, 1) || 'S'}</span>
          <span><strong>{userName}</strong><small>{roleLabel}</small></span>
          <b>⌄</b>
        </button>
      </div>
    </header>
  );
}
