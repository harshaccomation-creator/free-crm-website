import { useState } from "react";
import { followups } from "@/data/dummy";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Check, Phone, MessageCircle, Calendar } from "lucide-react";

const filterTabs = ["Today", "Upcoming", "Overdue", "Completed", "All"];

export default function Followups() {
  const [activeFilter, setActiveFilter] = useState("Today");

  const filtered = followups.filter(f => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Today") return f.followUpDate === "Today";
    if (activeFilter === "Upcoming") return f.followUpDate === "Tomorrow" || f.followUpDate.startsWith("202");
    if (activeFilter === "Overdue") return f.followUpDate === "Overdue";
    if (activeFilter === "Completed") return f.status === "Completed";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filterTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === tab 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => (
                <TableRow key={f.id} className={`hover:bg-gray-50/50 ${f.followUpDate === 'Overdue' ? 'bg-orange-50/30' : ''}`}>
                  <TableCell className="font-medium text-slate-900">{f.leadName}</TableCell>
                  <TableCell className="text-sm text-slate-600">{f.assignedTo}</TableCell>
                  <TableCell className="text-sm font-medium">
                    <span className={f.followUpDate === 'Overdue' ? 'text-orange-600' : 'text-slate-700'}>
                      {f.followUpDate}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{f.followUpTime}</TableCell>
                  <TableCell>
                    <StatusBadge status={f.status} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-muted-foreground" /> {f.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No follow-ups found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
