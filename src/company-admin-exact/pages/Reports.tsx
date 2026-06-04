import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Mail, PieChart, BarChart, TrendingUp, Users, AlertCircle, CreditCard } from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { name: 'Jan', new: 400, won: 240, lost: 100 },
  { name: 'Feb', new: 300, won: 139, lost: 80 },
  { name: 'Mar', new: 200, won: 980, lost: 120 },
  { name: 'Apr', new: 278, won: 390, lost: 90 },
  { name: 'May', new: 189, won: 480, lost: 150 },
  { name: 'Jun', new: 239, won: 380, lost: 110 },
];

export default function Reports() {
  const reports = [
    { title: "Lead Conversion Report", desc: "Detailed breakdown of leads by status and source", icon: PieChart, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Employee Performance", desc: "Performance metrics for all sales team members", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "Revenue & Payments", desc: "Collection data, pending payments and forecasting", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Follow-up Effectiveness", desc: "Analysis of follow-up timing and success rates", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50" },
    { title: "Win/Loss Analysis", desc: "Reasons for winning or losing deals", icon: BarChart, color: "text-indigo-500", bg: "bg-indigo-50" },
    { title: "Overdue & Bottlenecks", desc: "Leads stuck in pipeline and overdue tasks", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Generate Report</h2>
          <p className="text-sm text-muted-foreground">Export your data in various formats</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50" size="sm">
            <Download className="h-4 w-4" /> Export PDF
          </Button>
          <Button variant="outline" className="gap-2 border-green-200 text-green-600 hover:bg-green-50" size="sm">
            <FileText className="h-4 w-4" /> Export Excel
          </Button>
          <Button className="gap-2 bg-primary" size="sm">
            <Mail className="h-4 w-4" /> Email Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, i) => (
          <Card key={i} className="border-gray-100 shadow-sm hover:border-blue-200 transition-colors cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-lg ${report.bg} ${report.color} group-hover:scale-110 transition-transform`}>
                  <report.icon className="h-5 w-5" />
                </div>
              </div>
              <CardTitle className="text-base mt-4">{report.title}</CardTitle>
              <CardDescription>{report.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-gray-100 shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Lead Performance Sample</CardTitle>
          <CardDescription>Visual breakdown of new, won, and lost leads over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="new" name="New Leads" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="won" name="Won Deals" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="lost" name="Lost Deals" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
