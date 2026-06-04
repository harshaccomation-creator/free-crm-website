import { teamMembers } from "@/data/dummy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus, Users, UserCheck, Shield, UserX } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Team() {
  const stats = [
    { title: "Total Members", value: 12, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Managers", value: 3, icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Active", value: 11, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { title: "Inactive", value: 1, icon: UserX, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="gap-2 bg-primary">
          <Plus className="h-4 w-4" /> Invite Member
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Total Leads</TableHead>
                <TableHead className="text-center">Won Leads</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member, i) => (
                <TableRow key={member.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-gray-100">
                        <AvatarFallback className={i % 3 === 0 ? "bg-amber-100 text-amber-700" : i % 2 === 0 ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-900">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{member.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
                      {member.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={member.status} />
                  </TableCell>
                  <TableCell className="text-center font-medium">{member.totalLeads}</TableCell>
                  <TableCell className="text-center font-bold text-green-600">{member.wonLeads}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{member.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs font-medium">
                      Edit
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
