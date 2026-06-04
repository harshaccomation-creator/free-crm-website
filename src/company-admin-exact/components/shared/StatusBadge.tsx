import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "assigned":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "demo done":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "won":
      case "completed":
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "lost":
      case "overdue":
      case "inactive":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "junk":
        return "bg-slate-100 text-slate-800 hover:bg-slate-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge variant="outline" className={`border-0 rounded-full px-2.5 py-0.5 font-medium text-xs ${getBadgeVariant(status)}`}>
      {status}
    </Badge>
  );
}
