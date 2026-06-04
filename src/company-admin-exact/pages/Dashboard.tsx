import { useEffect, useMemo, useState } from "react";
import { dashboardStats, monthlyRevenue, followups, leads, payments, teamMembers } from "@/data/dummy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, PhoneCall, AlertCircle, CheckCircle2, XCircle, CreditCard, CheckSquare, Users2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCompanyAdminSummary, getAdminReportsData } from "../../services/crmModulesApi.js";

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444'];

function safeNumber(value: any) {
  return Number(value || 0) || 0;
}

function formatCurrency(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatDate(value: any) {
  if (!value) return '-';
  try { return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }); } catch { return '-'; }
}

function initials(name = 'User') {
  return String(name || 'User').split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase();
}

function isToday(value: any) {
  if (!value) return false;
  const d = new Date(value);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isOverdue(value: any, status: any) {
  if (!value) return false;
  return String(status || '').toLowerCase() !== 'completed' && new Date(value).getTime() < Date.now();
}

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [summaryData, reportsData] = await Promise.all([
          getCompanyAdminSummary(),
          getAdminReportsData(),
        ]);
        if (!active) return;
        setSummary(summaryData);
        setReports(reportsData);
        setLoadError('');
      } catch (error: any) {
        if (!active) return;
        setLoadError(error?.message || 'Unable to load live CRM data');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const liveLeads = summary?.leads || [];
  const liveTasks = summary?.tasks || [];
  const liveUsers = summary?.users || [];
  const revenue = safeNumber(reports?.revenue || liveLeads.reduce((sum: number, lead: any) => sum + safeNumber(lead.value), 0));
  const wonLeads = liveLeads.filter((l: any) => ['won', 'converted', 'demo done'].includes(String(l.status || '').toLowerCase())).length;
  const lostLeads = liveLeads.filter((l: any) => String(l.status || '').toLowerCase().includes('lost')).length;
  const activeLeads = liveLeads.filter((l: any) => !['won', 'lost', 'junk'].includes(String(l.status || '').toLowerCase())).length;
  const todayFollowUps = liveTasks.filter((t: any) => isToday(t.due_at)).length;
  const overdueCount = liveTasks.filter((t: any) => isOverdue(t.due_at, t.status)).length;

  const statCards = [
    { title: "Total Leads", value: liveLeads.length || dashboardStats.totalLeads, icon: Users, color: "text-blue-600", trend: "+12%" },
    { title: "Active Leads", value: liveLeads.length ? activeLeads : dashboardStats.activeLeads, icon: UserCheck, color: "text-purple-600", trend: "+5%" },
    { title: "Today Follow-ups", value: summary ? todayFollowUps : dashboardStats.todayFollowUps, icon: PhoneCall, color: "text-blue-500", trend: todayFollowUps ? "+0%" : "0%" },
    { title: "Overdue Leads", value: summary ? overdueCount : dashboardStats.overdueLeads, icon: AlertCircle, color: "text-orange-500", trend: overdueCount ? "+8%" : "0%" },
    { title: "Won Leads", value: summary ? wonLeads : dashboardStats.wonLeads, icon: CheckCircle2, color: "text-green-600", trend: "+15%" },
    { title: "Lost Leads", value: summary ? lostLeads : dashboardStats.lostLeads, icon: XCircle, color: "text-red-500", trend: lostLeads ? "-4%" : "0%" },
    { title: "Total Payments", value: summary ? formatCurrency(revenue) : dashboardStats.totalPayments, icon: CreditCard, color: "text-indigo-600", trend: "+20%" },
    { title: "Pending Tasks", value: summary ? liveTasks.filter((t: any) => String(t.status || '').toLowerCase() !== 'completed').length : dashboardStats.pendingTasks, icon: CheckSquare, color: "text-amber-500", trend: "-1%" },
    { title: "Team Members", value: summary ? liveUsers.length : dashboardStats.teamMembers, icon: Users2, color: "text-slate-600", trend: "0%" },
  ];

  const pieData = useMemo(() => {
    if (!summary) {
      return [
        { name: 'New', value: 400 },
        { name: 'Assigned', value: 300 },
        { name: 'Demo Done', value: 300 },
        { name: 'Won', value: 200 },
        { name: 'Lost', value: 100 },
      ];
    }
    const statuses = ['New', 'Assigned', 'Demo Done', 'Won', 'Lost'];
    return statuses.map((status) => ({
      name: status,
      value: liveLeads.filter((lead: any) => String(lead.status || 'New').toLowerCase() === status.toLowerCase()).length,
    }));
  }, [summary, liveLeads]);

  const liveFollowups = summary
    ? liveTasks.slice(0, 5).map((task: any) => ({
        id: task.id,
        leadName: task.lead?.name || task.title || 'Task',
        followUpTime: task.due_at ? new Date(task.due_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-',
        status: task.status || 'Pending',
        assignedTo: task.owner?.full_name || 'Unassigned',
        phone: task.lead?.phone || '-',
      }))
    : followups.slice(0, 5);

  const overdueAlerts = summary
    ? liveTasks.filter((task: any) => isOverdue(task.due_at, task.status)).slice(0, 4).map((task: any) => ({
        id: task.id,
        leadName: task.lead?.name || task.title || 'Overdue Task',
        followUpTime: task.due_at ? formatDate(task.due_at) : '-',
        assignedTo: task.owner?.full_name || 'Unassigned',
        phone: task.lead?.phone || '-',
      }))
    : followups.filter(f => f.status === 'Overdue').slice(0, 4);

  const recentLeads = summary
    ? liveLeads.slice(0, 5).map((lead: any) => ({
        id: lead.id,
        name: lead.name || 'Unnamed Lead',
        company: lead.company || '-',
        status: lead.status || 'New',
        createdDate: formatDate(lead.created_at),
      }))
    : leads.slice(0, 5);

  const performers = summary
    ? liveUsers.slice(0, 3).map((member: any) => ({
        id: member.id,
        name: member.full_name || member.email || 'Team Member',
        initials: initials(member.full_name || member.email),
        wonLeads: liveLeads.filter((lead: any) => lead.owner?.id === member.id && ['won', 'converted', 'demo done'].includes(String(lead.status || '').toLowerCase())).length,
      }))
    : teamMembers.slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {loadError && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          Live CRM data load nahi hua, fallback data dikha rahe hain: {loadError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="rounded-xl border-gray-100 shadow-sm" data-testid={`card-stat-${stat.title.toLowerCase().replace(" ", "-")}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{loading ? '...' : stat.value}</h3>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className={String(stat.trend).startsWith("+") ? "text-green-600 font-medium" : stat.trend === "0%" ? "text-slate-500 font-medium" : "text-red-600 font-medium"}>
                  {stat.trend}
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue & Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                  <Area type="monotone" dataKey="collections" stroke="#f97316" fillOpacity={1} fill="url(#colorCollections)" name="Collections" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Lead Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-xs">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                  <span className="text-muted-foreground">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-lg font-semibold">Today's Follow-ups</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveFollowups.map((f: any) => (
                  <TableRow key={f.id} className="hover:bg-gray-50/50 cursor-pointer">
                    <TableCell className="font-medium">{f.leadName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{f.followUpTime}</TableCell>
                    <TableCell><StatusBadge status={f.status} /></TableCell>
                    <TableCell className="text-sm">{f.assignedTo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-lg font-semibold">Overdue Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {overdueAlerts.map((f: any) => (
                <div key={f.id} className="p-4 flex items-center justify-between hover:bg-orange-50/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-orange-100 p-1">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{f.leadName}</p>
                      <p className="text-xs text-orange-600 font-medium">{f.followUpTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{f.assignedTo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-gray-100">
          <CardHeader className="py-4">
            <CardTitle className="text-lg font-semibold">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((l: any) => (
                  <TableRow key={l.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{l.company}</TableCell>
                    <TableCell><StatusBadge status={l.status} /></TableCell>
                    <TableCell className="text-sm">{l.createdDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader className="py-4">
            <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performers.map((member: any, i: number) => (
                <div key={member.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100">
                      <AvatarFallback className={i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-200 text-slate-700" : "bg-orange-100 text-orange-700"}>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.wonLeads} Won Leads</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">₹{safeNumber(member.wonLeads) * 1.5}L</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
