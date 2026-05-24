import '../../styles/pageLoader.css';

export default function PageLoader({ label = 'Loading SalesFlow page...' }) {
  return (
    <div className="page-loader-screen" role="status" aria-live="polite">
      <div className="loader-card">
        <div className="loader-logo">S</div>
        <div className="loader-rings"><span /><span /><span /></div>
        <h2>SalesFlow</h2>
        <p>{label}</p>
      </div>
    </div>
  );
}
