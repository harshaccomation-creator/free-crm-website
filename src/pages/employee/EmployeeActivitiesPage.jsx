import EmployeeShell from '../../components/employee/EmployeeShell.jsx';

const stats = [
  ['Total Activities', '128', 'All employee updates'],
  ['Contacted', '42', 'Calls and WhatsApp'],
  ['Proposal/Demo', '18', 'Qualified movement'],
  ['Won', '9', 'Closed successfully'],
];

const timeline = [
  ['Lead Created', 'Rohan Mehta captured from website form.', 'Today, 10:30 AM', 'New'],
  ['Contacted', 'Call completed with Priya Sharma.', 'Yesterday, 03:15 PM', 'Call'],
  ['Proposal Sent', 'Proposal shared with Amit Verma.', '18 May, 11:45 AM', 'Proposal'],
  ['Negotiation', 'Budget discussion with Neha Singh.', '17 May, 04:20 PM', 'Deal'],
  ['Won', 'Deepak Kumar converted successfully.', '16 May, 12:10 PM', 'Won'],
];

export default function EmployeeActivitiesPage() {
  return (
    <EmployeeShell
      title="Activities"
      subtitle="Track your lead journey and recent CRM activity."
    >
      <div className="sf-kpi-grid">
        {stats.map((item) => (
          <article className="sf-card sf-kpi" key={item[0]}>
            <small>{item[0]}</small>
            <strong>{item[1]}</strong>
            <p>{item[2]}</p>
          </article>
        ))}
      </div>

      <section className="sf-card" style={{ padding: 22 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: '#0f172a' }}>Activity Timeline</h2>
            <p style={{ margin: '5px 0 0', color: '#64748b' }}>
              Latest lead and task movement.
            </p>
          </div>

          <button
            type="button"
            style={{
              height: 40,
              border: 0,
              borderRadius: 14,
              background: 'linear-gradient(135deg,#2563eb,#f97316)',
              color: '#fff',
              padding: '0 16px',
              fontWeight: 850,
              cursor: 'pointer',
            }}
          >
            Add Activity
          </button>
        </div>

        {timeline.map((item, index) => (
          <div
            key={item[0]}
            style={{
              display: 'grid',
              gridTemplateColumns: '52px minmax(0,1fr) 120px',
              gap: 14,
              alignItems: 'center',
              padding: '16px 0',
              borderBottom:
                index === timeline.length - 1 ? 0 : '1px solid #edf2f7',
            }}
          >
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                display: 'grid',
                placeItems: 'center',
                background: '#eff6ff',
                color: '#2563eb',
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              •
            </span>

            <div>
              <strong style={{ color: '#0f172a' }}>{item[0]}</strong>
              <p style={{ margin: '5px 0 0', color: '#64748b' }}>{item[1]}</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <small style={{ display: 'block', color: '#64748b' }}>
                {item[2]}
              </small>
              <b
                style={{
                  display: 'inline-block',
                  marginTop: 6,
                  background: '#e0f2fe',
                  color: '#0369a1',
                  borderRadius: 999,
                  padding: '4px 9px',
                  fontSize: 11,
                }}
              >
                {item[3]}
              </b>
            </div>
          </div>
        ))}
      </section>
    </EmployeeShell>
  );
}
