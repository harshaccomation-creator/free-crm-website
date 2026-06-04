import { notifications } from "@/data/dummy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, CreditCard, UserPlus, AlertCircle, Activity, Check } from "lucide-react";

export default function Notifications() {
  const getIcon = (type: string) => {
    switch(type) {
      case 'reminder': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'payment': return <CreditCard className="h-5 w-5 text-emerald-600" />;
      case 'assignment': return <UserPlus className="h-5 w-5 text-indigo-600" />;
      case 'alert': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'task': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'activity': return <Activity className="h-5 w-5 text-purple-600" />;
      default: return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getBg = (type: string) => {
    switch(type) {
      case 'reminder': return "bg-blue-50 border-blue-100";
      case 'payment': return "bg-emerald-50 border-emerald-100";
      case 'assignment': return "bg-indigo-50 border-indigo-100";
      case 'alert': return "bg-orange-50 border-orange-100";
      case 'task': return "bg-red-50 border-red-100";
      case 'activity': return "bg-purple-50 border-purple-100";
      default: return "bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Your Notifications</h2>
            <p className="text-sm text-muted-foreground">You have 5 unread messages</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Check className="h-4 w-4" /> Mark all as read
        </Button>
      </div>

      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {notifications.map((notif, i) => (
              <div key={notif.id} className={`p-4 flex gap-4 transition-colors hover:bg-gray-50/50 ${i < 5 ? 'bg-blue-50/20' : ''}`}>
                <div className={`mt-1 p-2.5 rounded-full border ${getBg(notif.type)} shrink-0`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-slate-900 text-sm">{notif.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{notif.description}</p>
                </div>
                {i < 5 && (
                  <div className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
