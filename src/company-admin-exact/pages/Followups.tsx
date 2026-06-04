import { useEffect, useMemo, useState } from "react";
import { followups as dummyFollowups } from "@/data/dummy";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Check, Phone, MessageCircle, Calendar } from "lucide-react";
import { listTasks, updateTask } from "../../services/crmApi.js";

const filterTabs = ["Today", "Upcoming", "Overdue", "Completed", "All"];

function isCompleted(status: any) {
  return String(status || "").toLowerCase() === "completed";
}

function isToday(value: any) {
  if (!value) return false;
  const d = new Date(value);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isOverdue(value: any, status: any) {
  return value && !isCompleted(status) && new Date(value).getTime() < Date.now() && !isToday(value);
}

function isUpcoming(value: any, status: any) {
  return value && !isCompleted(status) && new Date(value).getTime() > Date.now() && !isToday(value);
}

function dateLabel(value: any, status: any) {
  if (!value) return "—";
  if (isOverdue(value, status)) return "Overdue";
  if (isToday(value)) return "Today";
  try { return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); } catch { return "—"; }
}

function timeLabel(value: any) {
  if (!value) return "—";
  try { return new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); } catch { return "—"; }
}

function normalizeTask(task: any) {
  return {
    id: task.id,
    leadName: task.lead?.name || task.leadName || task.title || "Follow-up",
    assignedTo: task.owner?.full_name || task.assignedTo || "Unassigned",
    followUpDate: task.followUpDate || dateLabel(task.due_at, task.status),
    followUpTime: task.followUpTime || timeLabel(task.due_at),
    status: task.status || "Pending",
    phone: task.lead?.phone || task.phone || "-",
    dueAt: task.due_at,
    raw: task,
  };
}

export default function Followups() {
  const [activeFilter, setActiveFilter] = useState("Today");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function loadFollowups() {
    setLoading(true);
    try {
      const tasks = await listTasks({ limit: 1000 });
      setRows((tasks || []).map(normalizeTask));
      setLoadError("");
    } catch (error: any) {
      setRows([]);
      setLoadError(error?.message || "Unable to load live follow-ups");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFollowups(); }, []);

  const sourceRows = rows.length ? rows : dummyFollowups.map(normalizeTask);

  const filtered = useMemo(() => sourceRows.filter((f: any) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Today") return f.followUpDate === "Today";
    if (activeFilter === "Upcoming") return isUpcoming(f.dueAt, f.status) || f.followUpDate === "Tomorrow";
    if (activeFilter === "Overdue") return f.followUpDate === "Overdue";
    if (activeFilter === "Completed") return isCompleted(f.status);
    return true;
  }), [sourceRows, activeFilter]);

  async function markCompleted(id: string) {
    try {
      await updateTask(id, { status: "Completed" });
      await loadFollowups();
    } catch (error: any) {
      alert(error?.message || "Unable to complete follow-up");
    }
  }

  function call(phone: string) {
    if (!phone || phone === "-") return;
    window.location.href = `tel:${phone}`;
  }

  function whatsapp(phone: string) {
    if (!phone || phone === "-") return;
    const clean = String(phone).replace(/\D/g, "");
    window.open(`https://wa.me/91${clean.slice(-10)}`, "_blank");
  }

  return (
    <div className="space-y-6">
      {loadError && <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">Live follow-ups load nahi hue, fallback data dikha rahe hain: {loadError}</div>}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filterTabs.map(tab => (
          <button key={tab} onClick={() => setActiveFilter(tab)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === tab ? "bg-primary text-primary-foreground shadow-sm" : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"}`}>
            {tab}
          </button>
        ))}
      </div>

      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">{loading ? "Loading" : filtered.length} follow-ups</span>
          <span className="text-xs text-muted-foreground">Showing {filtered.length} of {sourceRows.length}</span>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Lead Name</TableHead><TableHead>Assigned To</TableHead><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead><TableHead>Phone</TableHead><TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f: any) => (
                <TableRow key={f.id} className={`hover:bg-gray-50/50 ${f.followUpDate === 'Overdue' ? 'bg-orange-50/30' : ''}`}>
                  <TableCell className="font-medium text-slate-900">{f.leadName}</TableCell>
                  <TableCell className="text-sm text-slate-600">{f.assignedTo}</TableCell>
                  <TableCell className="text-sm font-medium"><span className={f.followUpDate === 'Overdue' ? 'text-orange-600' : 'text-slate-700'}>{f.followUpDate}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{f.followUpTime}</TableCell>
                  <TableCell><StatusBadge status={f.status} /></TableCell>
                  <TableCell className="text-sm text-slate-600"><div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-muted-foreground" /> {f.phone}</div></TableCell>
                  <TableCell className="text-right"><div className="flex items-center justify-end gap-2">
                    <Button onClick={() => markCompleted(f.id)} variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"><Check className="h-4 w-4" /></Button>
                    <Button onClick={() => call(f.phone)} variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"><Phone className="h-4 w-4" /></Button>
                    <Button onClick={() => whatsapp(f.phone)} variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"><MessageCircle className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700"><Calendar className="h-4 w-4" /></Button>
                  </div></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No follow-ups found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
