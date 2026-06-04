import { useEffect, useMemo, useState } from "react";
import { tasks as dummyTasks } from "@/data/dummy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus, CheckCircle2, Clock, AlertTriangle, CheckSquare } from "lucide-react";
import { listTasks, updateTask } from "../../services/crmApi.js";

function isCompleted(task: any) {
  return String(task.status || "").toLowerCase() === "completed" || Boolean(task.completed_at);
}

function isOverdue(task: any) {
  return !isCompleted(task) && task.due_at && new Date(task.due_at).getTime() < Date.now();
}

function formatDate(value: any, status: any) {
  if (!value) return "—";
  const overdue = String(status || "").toLowerCase() !== "completed" && new Date(value).getTime() < Date.now();
  try {
    const text = new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    return overdue ? `Overdue · ${text}` : text;
  } catch {
    return "—";
  }
}

function normalizeTask(task: any) {
  return {
    id: task.id,
    title: task.title || "Untitled Task",
    assignedTo: task.owner?.full_name || task.assignedTo || "Unassigned",
    relatedLead: task.lead?.name || task.relatedLead || "—",
    priority: task.priority || task.type || task.task_type || "Medium",
    dueDate: task.dueDate || formatDate(task.due_at, task.status),
    status: task.status || "Pending",
    raw: task,
  };
}

export default function Tasks() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await listTasks({ limit: 1000 });
      setRows((data || []).map(normalizeTask));
      setLoadError("");
    } catch (error: any) {
      setRows([]);
      setLoadError(error?.message || "Unable to load live tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  const sourceTasks = rows.length ? rows : dummyTasks.map(normalizeTask);

  const stats = useMemo(() => {
    const total = sourceTasks.length;
    const completed = sourceTasks.filter((task: any) => String(task.status || "").toLowerCase() === "completed").length;
    const overdue = sourceTasks.filter((task: any) => String(task.dueDate || "").toLowerCase().includes("overdue") && String(task.status || "").toLowerCase() !== "completed").length;
    const pending = total - completed;
    return [
      { title: "Total Tasks", value: total, icon: CheckSquare, color: "text-blue-600", bg: "bg-blue-50" },
      { title: "Pending", value: pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
      { title: "Completed", value: completed, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
      { title: "Overdue", value: overdue, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    ];
  }, [sourceTasks]);

  async function markComplete(taskId: string) {
    try {
      await updateTask(taskId, { status: "Completed" });
      await loadTasks();
    } catch (error: any) {
      alert(error?.message || "Unable to complete task");
    }
  }

  return (
    <div className="space-y-6">
      {loadError && <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">Live tasks load nahi hue, fallback data dikha rahe hain: {loadError}</div>}
      <div className="flex justify-between items-center gap-3">
        <div className="text-sm text-muted-foreground">{loading ? "Loading tasks..." : `Showing ${sourceTasks.length} tasks`}</div>
        <Button className="gap-2 bg-primary">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-gray-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Task Title</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Related Lead</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sourceTasks.map((task: any) => (
                <TableRow key={task.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-slate-900">{task.title}</TableCell>
                  <TableCell className="text-sm text-slate-600">{task.assignedTo}</TableCell>
                  <TableCell className="text-sm text-primary hover:underline cursor-pointer">{task.relatedLead}</TableCell>
                  <TableCell><StatusBadge status={task.priority} /></TableCell>
                  <TableCell className="text-sm font-medium">
                    <span className={String(task.dueDate).includes('Overdue') ? 'text-red-600' : 'text-slate-700'}>{task.dueDate}</span>
                  </TableCell>
                  <TableCell><StatusBadge status={task.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => markComplete(task.id)} disabled={String(task.status || '').toLowerCase() === 'completed'} variant="ghost" size="sm" className="text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 disabled:opacity-40">
                      {String(task.status || '').toLowerCase() === 'completed' ? 'Completed' : 'Mark Complete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {sourceTasks.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No tasks found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
