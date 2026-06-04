import { payments } from "@/data/dummy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus, CreditCard, ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react";

export default function Payments() {
  const stats = [
    { title: "Total Payments", value: "₹48.2L", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "This Month", value: "₹8.4L", icon: ArrowUpRight, color: "text-green-600", bg: "bg-green-50" },
    { title: "Pending", value: "₹12.1L", icon: ArrowDownRight, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Completed", value: "₹36.1L", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="gap-2 bg-primary">
          <Plus className="h-4 w-4" /> Record Payment
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
                <TableHead>Lead Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Collected By</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-primary hover:underline cursor-pointer">
                    {payment.leadName}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">{payment.paymentDate}</TableCell>
                  <TableCell className="text-sm text-slate-600">{payment.collectedBy}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{payment.createdDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      View Receipt
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
