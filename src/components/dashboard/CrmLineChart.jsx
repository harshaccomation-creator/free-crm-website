export default function CrmLineChart({ type = 'employee' }) {
  const isAdmin = type === 'admin';
  const primary = isAdmin
    ? 'M48 178 C112 132 172 146 230 104 C294 58 356 128 424 84 C494 38 558 72 632 30'
    : 'M48 170 C112 118 178 138 240 96 C300 56 354 136 418 92 C492 42 554 84 632 46';
  const secondary = isAdmin
    ? 'M48 132 C112 154 174 104 232 124 C294 146 356 88 422 116 C494 146 558 96 632 104'
    : 'M48 142 C112 156 178 108 240 128 C300 146 354 92 418 114 C492 138 554 88 632 98';
  const months = isAdmin ? ['01 May', '05 May', '10 May', '15 May', '20 May', '25 May', '31 May'] : ['1 May', '6 May', '11 May', '16 May', '21 May'];

  return (
    <div className="crm-chart-wrap">
      <div className="crm-chart-legend">
        <span><i /> {isAdmin ? 'Leads' : 'Leads Created'}</span>
        <span><i className="light" /> {isAdmin ? 'Deals' : 'Deals Closed'}</span>
      </div>
      <svg className="crm-svg-chart" viewBox="0 0 700 260" role="img" aria-label="Sales performance chart">
        <defs>
          <linearGradient id={`chartFill-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b63f6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0b63f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[40, 80, 120, 160, 200].map((y) => <line key={y} x1="44" y1={y} x2="660" y2={y} className="grid" />)}
        <line x1="44" y1="22" x2="44" y2="218" className="axis" />
        <line x1="44" y1="218" x2="660" y2="218" className="axis" />
        <path d={`${primary} L632 218 L48 218 Z`} fill={`url(#chartFill-${type})`} />
        <path d={secondary} className="secondary-line" />
        <path d={primary} className="primary-line" />
        {(isAdmin
          ? [[48,178],[140,132],[230,104],[330,128],[424,84],[532,72],[632,30]]
          : [[48,170],[170,138],[240,96],[340,136],[418,92],[532,84],[632,46]]
        ).map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5.5" className="dot" />)}
        {months.map((m, i) => <text key={m} x={60 + i * (580 / (months.length - 1))} y="248" className="label">{m}</text>)}
        {[0,25,50,75,100].map((v, i) => <text key={v} x="10" y={222 - i * 40} className="label">{v}</text>)}
      </svg>
    </div>
  );
}
