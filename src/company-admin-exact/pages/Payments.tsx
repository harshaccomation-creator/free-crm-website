import { useEffect, useMemo, useState } from "react";
import { payments as dummyPayments } from "@/data/dummy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus, CreditCard, ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react";
import { getCurrentProfile, listLeads, supabase } from "../../services/crmApi.js";

function safeNumber(value: any) {
  return Number(value || 0) || 0;
}

function currency(value: any) {
  const n = safeNumber(value);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(value: any) {
  if (!value) return "—";
  try { return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); } catch { return "—"; }
}

function isThisMonth(value: any) {
  if (!value) return false;
  const d = new Date(value);
  const n = new Date();
  return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}

function normalizePayment(payment: any) {
  const lead = payment.lead || payment.leads || {};
  const collector = payment.collector || payment.user || payment.owner || {};
  return {
    id: payment.id,
    leadName: payment.leadName || lead.name || payment.lead_name || payment.customer_name || "Payment",
    amount: safeNumber(payment.amount || payment.value || payment.payment_amount),
    status: payment.status || payment.payment_status || "Paid",
    paymentDate: payment.paymentDate || formatDate(payment.payment_date || payment.paid_at || payment.created_at),
    collectedBy: payment.collectedBy || collector.full_name || collector.email || payment.collected_by_name || "—",
    createdDate: payment.createdDate || formatDate(payment.created_at || payment.payment_date || payment.paid_at),
    rawDate: payment.payment_date || payment.paid_at || payment.created_at,
  };
}

function paymentFromLead(lead: any) {
  return {
    id: `lead-${lead.id}`,
    leadName: lead.name || "Lead Payment",
    amount: safeNumber(lead.value || lead.amount),
    status: ["won", "converted", "demo done"].includes(String(lead.status || "").toLowerCase()) ? "Paid" : "Pending",
    paymentDate: formatDate(lead.updated_at || lead.created_at),
    collectedBy: lead.owner?.full_name || "—",
    createdDate: formatDate(lead.created_at),
    rawDate: lead.updated_at || lead.created_at,
  };
}

export default function Payments() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function loadPayments() {
    setLoading(true);
    try {
      const profile = await getCurrentProfile();
      let paymentRows: any[] = [];

      if (supabase && profile?.company_id) {
        const { data, error } = await supabase
          .from("payments")
          .select("*, lead:leads(id, name, company), collector:profiles(id, full_name, email)")
          .eq("company_id", profile.company_id)
          .order("created_at", { ascending: false })
          .limit(1000);
        if (!error && data) paymentRows = data.map(normalizePayment);
      }

      if (!paymentRows.length) {
        const leadRows = await listLeads({ limit: 1000 });
        paymentRows = (leadRows || [])
          .filter((lead: any) => safeNumber(lead.value || lead.amount) > 0)
          .map(paymentFromLead);
      }

      setRows(paymentRows);
      setLoadError("");
    } catch (error: any) {
      setRows([]);
      setLoadError(error?.message || "Unable to load live payments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPayments(); }, []);

  const sourcePayments = rows.length ? rows : dummyPayments.map(normalizePayment);

  const stats = useMemo(() => {
    const total = sourcePayments.reduce((sum: number, p: any) => sum + safeNumber(p.amount), 0);
    const month = sourcePayments.filter((p: any) => isThisMonth(p.rawDate)).reduce((sum: number, p: any) => sum + safeNumber(p.amount), 0);
    const pending = sourcePayments.filter((p: any) => String(p.status || "").toLowerCase().includes("pending")).reduce((sum: number, p: any) => sum + safeNumber(p.amount), 0);
    const completed = total - pending;
    return [
      { title: "Total Payments", value: currency(total), icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
      { title: "This Month", value: currency(month), icon: ArrowUpRight, color: "text-green-600", bg: "bg-green-50" },
      { title: "Pending", value: currency(pending), icon: ArrowDownRight, color: "text-amber-600", bg: "bg-amber-50" },
      { title: "Completed", value: currency(completed), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];
  }, [sourcePayments]);

  return (
    <div className="space-y-6">
      {loadError && <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">Live payments load nahi hue, fallback data dikha rahe hain: {loadError}</div>}
      <div className="flex justify-between items-center gap-3">
        <div className="text-sm text-muted-foreground">{loading ? "Loading payments..." : `Showing ${sourcePayments.length} payments`}</div>
        <Button className="gap-2 bg-primary">
          <Plus className="h-4 w-4" /> Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-gray-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
              <div><p className="text-sm font-medium text-muted-foreground">{stat.title}</p><p className="text-2xl font-bold text-slate-900">{stat.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Lead Name</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Payment Date</TableHead><TableHead>Collected By</TableHead><TableHead>Created Date</TableHead><TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sourcePayments.map((payment: any) => (
                <TableRow key={payment.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-primary hover:underline cursor-pointer">{payment.leadName}</TableCell>
                  <TableCell className="font-bold text-slate-900">{currency(payment.amount)}</TableCell>
                  <TableCell><StatusBadge status={payment.status} /></TableCell>
                  <TableCell className="text-sm text-slate-700">{payment.paymentDate}</TableCell>
                  <TableCell className="text-sm text-slate-600">{payment.collectedBy}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{payment.createdDate}</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50">View Receipt</Button></TableCell>
                </TableRow>
              ))}
              {sourcePayments.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No payments found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
