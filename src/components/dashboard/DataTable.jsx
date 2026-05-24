import '../../styles/dashboardBase.css';

export default function DataTable({ title, columns, rows, actionLabel = 'View All' }) {
  return (
    <article className="sf-table-card">
      <div className="sf-card-head">
        <h2>{title}</h2>
        <button type="button">{actionLabel}</button>
      </div>
      <div className="sf-table-wrap">
        <table>
          <thead>
            <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
