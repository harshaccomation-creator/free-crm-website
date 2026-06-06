import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import './EmployeePages.css';
import './EmployeePagesLayoutFix.css';

const SIDEBAR_WIDTH = 300;

const activities = [
  ['Lead Created', 'Rohan Mehta captured from website form.', '20 May 2025, 10:30 AM'],
  ['Contacted', 'Call completed with Priya Sharma.', '19 May 2025, 03:15 PM'],
  ['Proposal', 'Proposal sent to Amit Verma.', '18 May 2025, 11:45 AM'],
  ['Negotiation', 'Budget discussion with Neha Singh.', '17 May 2025, 04:20 PM'],
  ['Won', 'Deepak Kumar converted successfully.', '16 May 2025, 12:10 PM']
];

export default function EmployeeActivitiesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f8fc' }}>
      <DashboardSidebar role="employee" />

      <main
        style={{
          marginLeft: SIDEBAR_WIDTH,
          width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
          minHeight: '100vh',
          boxSizing: 'border-box',
          padding: '22px 28px 36px',
          overflowX: 'hidden'
        }}
      >
        <header style={{ marginBottom: 18 }}>
          <span style={{ color: '#2563eb', fontWeight: 800, fontSize: 12 }}>
            Employee Workspace
          </span>
          <h1 style={{ margin: '6px 0 4px', fontSize: 30, color: '#0f172a' }}>
            Activities
          </h1>
          <p style={{ margin: 0, color: '#64748b' }}>
            Track your lead journey and recent CRM activity.
          </p>
        </header>

        <section
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 22,
            padding: 22,
            boxShadow: '0 18px 40px rgba(15,23,42,.06)'
          }}
        >
          <h2 style={{ margin: '0 0 14px', color: '#0f172a' }}>
            Activity Timeline
          </h2>

          {activities.map((item, index) => (
            <div
              key={item[0]}
              style={{
                display: 'grid',
                gridTemplateColumns: '54px minmax(0,1fr) 160px',
                gap: 16,
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: index === activities.length - 1 ? 0 : '1px solid #edf2f7'
              }}
            >
              <span
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  display: 'grid',
                  placeItems: 'center',
                  background: '#dbeafe',
                  color: '#0f172a',
                  fontWeight: 900
                }}
              >
                •
              </span>

              <div>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: 4 }}>
                  {item[0]}
                </strong>
                <p style={{ margin: 0, color: '#64748b' }}>{item[1]}</p>
              </div>

              <small style={{ color: '#64748b', textAlign: 'right', fontWeight: 700 }}>
                {item[2]}
              </small>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
