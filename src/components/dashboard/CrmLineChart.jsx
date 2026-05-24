export default function CrmLineChart({ type = 'employee' }) {
  const isAdmin = type === 'admin';
  const primary = isAdmin
    ? 'M54 172 C118 132 172 146 230 106 C294 66 356 132 424 88 C494 46 558 72 640 34'
    : 'M54 168 C112 128 176 138 238 96 C300 62 354 136 418 94 C492 50 554 82 640 48';
  const secondary = isAdmin
    ? 'M54 136 C112 154 174 110 232 126 C294 146 356 94 422 118 C494 146 558 102 640 108'
    : 'M54 144 C112 156 178 112 240 130 C300 146 354 96 418 116 C492 138 554 92 640 102';
  const dots = isAdmin
    ? [[54,172],[140,132],[230,106],[330,128],[424,88],[532,72],[640,34]]
    : [[54,168],[170,138],[238,96],[340,136],[418,94],[532,82],[640,48]];
  const months = isAdmin ? ['01 May', '05 May', '10 May', '15 May', '20 May', '25 May', '31 May'] : ['1 May', '6 May', '11 May', '16 May', '21 May'];

  return (
    <div style={{ padding: '14px 18px 18px', background: '#fff' }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', margin: '0 0 8px 8px', color: '#52637f', fontSize: 12, fontWeight: 800 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><i style={{ width: 9, height: 9, borderRadius: 99, background: '#0b63f6', display: 'inline-block' }} />{isAdmin ? 'Leads' : 'Leads Created'}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><i style={{ width: 9, height: 9, borderRadius: 99, background: '#66b7ff', display: 'inline-block' }} />{isAdmin ? 'Deals' : 'Deals Closed'}</span>
      </div>
      <svg viewBox="0 0 700 260" role="img" aria-label="Sales performance chart" style={{ width: '100%', height: 250, display: 'block' }}>
        <defs>
          <linearGradient id={`chartFill-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b63f6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0b63f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[40, 80, 120, 160, 200].map((y) => <line key={y} x1="44" y1={y} x2="660" y2={y} stroke="#e8eef7" strokeWidth="1.4" />)}
        <line x1="44" y1="22" x2="44" y2="218" stroke="#dfe8f4" strokeWidth="1.4" />
        <line x1="44" y1="218" x2="660" y2="218" stroke="#dfe8f4" strokeWidth="1.4" />
        <path d={`${primary} L640 218 L54 218 Z`} fill={`url(#chartFill-${type})`} />
        <path d={secondary} fill="none" stroke="#66b7ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 8" />
        <path d={primary} fill="none" stroke="#0b63f6" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        {dots.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5.7" fill="#0b63f6" stroke="#fff" strokeWidth="3" />)}
        {months.map((m, i) => <text key={m} x={60 + i * (580 / (months.length - 1))} y="248" fill="#60708f" fontSize="12" fontWeight="700" textAnchor="middle">{m}</text>)}
        {[0,25,50,75,100].map((v, i) => <text key={v} x="12" y={222 - i * 40} fill="#60708f" fontSize="12" fontWeight="700">{v}</text>)}
      </svg>
    </div>
  );
}
