import { tasks } from "@/data/dummy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus, CheckCircle2, Clock, AlertTriangle, CheckSquare } from "lucide-react";

export default function Tasks() {
  const stats = [
    { title: "Total Tasks", value: 45, icon: CheckSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pending", value: 18, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Completed", value: 24, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { title: "Overdue", value: 3, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
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
              {tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-slate-900">{task.title}</TableCell>
                  <TableCell className="text-sm text-slate-600">{task.assignedTo}</TableCell>
                  <TableCell className="text-sm text-primary hover:underline cursor-pointer">{task.relatedLead}</TableCell>
                  <TableCell>
                    <StatusBadge status={task.priority} />
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    <span className={task.dueDate.includes('Overdue') ? 'text-red-600' : 'text-slate-700'}>
                      {task.dueDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50">
                      Mark Complete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
