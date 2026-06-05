export default function LeadDetailPage({ leadId }) {
  const page = {
    minHeight: '100vh',
    background: '#f5f8fc',
    padding: '28px',
    boxSizing: 'border-box',
  };

  const card = {
    background: '#ffffff',
    border: '1px solid #dbeafe',
    borderRadius: '22px',
    padding: '22px',
    boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
  };

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)',
    gap: '18px',
    marginTop: '18px',
  };

  const stat = {
    background: '#f8fbff',
    border: '1px solid #e2e8f0',
    borderRadius: '18px',
    padding: '16px',
  };

  const timelineItem = {
    display: 'grid',
    gridTemplateColumns: '44px minmax(0, 1fr)',
    gap: '12px',
    padding: '14px 0',
    borderBottom: '1px solid #eef2f7',
  };

  return (
    <main style={page}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ marginBottom: 16, color: '#64748b', fontWeight: 700 }}>
          Leads › Lead Details
        </div>

        <section style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: 24,
                fontWeight: 900,
              }}
            >
              L
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: 30, color: '#0f172a' }}>
                  Lead Details
                </h1>
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '6px 12px',
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  Active
                </span>
              </div>
              <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 15 }}>
                Lead ID: {leadId || 'N/A'} · SalesFlow CRM
              </p>
            </div>
          </div>
        </section>

        <div style={grid}>
          <section style={card}>
            <h2 style={{ margin: '0 0 14px', color: '#0f172a' }}>
              Activity Timeline
            </h2>

            {[
              ['📞', 'Call scheduled', 'Follow-up call planned with this lead.', 'Today'],
              ['✅', 'Lead created', 'Lead was added to SalesFlow pipeline.', 'Recently'],
              ['📝', 'Note added', 'Initial lead details are ready for review.', 'Recently'],
            ].map((item, index) => (
              <div style={timelineItem} key={index}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 15,
                    background: '#eff6ff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 20,
                  }}
                >
                  {item[0]}
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <strong style={{ color: '#0f172a' }}>{item[1]}</strong>
                    <small style={{ color: '#64748b', fontWeight: 700 }}>
                      {item[3]}
                    </small>
                  </div>
                  <p style={{ margin: '6px 0 0', color: '#64748b' }}>
                    {item[2]}
                  </p>
                </div>
              </div>
            ))}
          </section>

          <aside style={{ display: 'grid', gap: 14 }}>
            <div style={stat}>
              <small style={{ color: '#64748b', fontWeight: 800 }}>
                Lead Score
              </small>
              <h3 style={{ margin: '8px 0 0', fontSize: 26 }}>72%</h3>
            </div>

            <div style={stat}>
              <small style={{ color: '#64748b', fontWeight: 800 }}>
                Next Follow-up
              </small>
              <h3 style={{ margin: '8px 0 0', fontSize: 22 }}>Pending</h3>
            </div>

            <div style={card}>
              <h3 style={{ margin: '0 0 12px' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                <button style={buttonStyle('#2563eb')}>Call Lead</button>
                <button style={buttonStyle('#16a34a')}>WhatsApp</button>
                <button style={buttonStyle('#f97316')}>Add Activity</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function buttonStyle(bg) {
  return {
    height: 42,
    border: 0,
    borderRadius: 13,
    background: bg,
    color: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
  };
}
