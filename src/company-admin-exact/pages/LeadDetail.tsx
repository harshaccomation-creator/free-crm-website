import { useParams, Link } from "wouter";
import { leads } from "@/data/dummy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  CheckSquare, 
  CreditCard, 
  RefreshCcw, 
  UserPlus, 
  Clock,
  History,
  FileText
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function LeadDetail() {
  const params = useParams();
  const leadId = params.id;
  const lead = leads.find(l => l.id === leadId) || leads[0]; // fallback to first for demo

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/leads">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
          <StatusBadge status={lead.status} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
          <Phone className="h-4 w-4" /> Call
        </Button>
        <Button size="sm" variant="outline" className="gap-2 text-green-600 border-green-200 hover:bg-green-50">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </Button>
        <Button size="sm" variant="outline" className="gap-2 bg-slate-50">
          <FileText className="h-4 w-4" /> Add Note
        </Button>
        <Button size="sm" variant="outline" className="gap-2 bg-slate-50">
          <CheckSquare className="h-4 w-4" /> Add Task
        </Button>
        <Button size="sm" variant="outline" className="gap-2 bg-slate-50">
          <CreditCard className="h-4 w-4" /> Add Payment
        </Button>
        <div className="flex-1" />
        <Button size="sm" variant="outline" className="gap-2 bg-slate-50">
          <RefreshCcw className="h-4 w-4" /> Change Status
        </Button>
        <Button size="sm" variant="outline" className="gap-2 bg-slate-50">
          <UserPlus className="h-4 w-4" /> Reassign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="py-4 border-b border-gray-50">
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 border border-gray-200">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {lead.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Building className="h-3.5 w-3.5" /> {lead.company}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{lead.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{lead.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">Mumbai, Maharashtra, India</span>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assigned To</span>
                  <span className="font-medium text-slate-900">{lead.assignedTo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created On</span>
                  <span className="font-medium text-slate-900">{lead.createdDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Source</span>
                  <span className="font-medium text-slate-900">{lead.createdBy}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="py-4 border-b border-gray-50">
              <CardTitle className="text-lg">Deal Value</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-900">₹{lead.amount.toLocaleString('en-IN')}</span>
                <span className="text-sm text-muted-foreground mb-1">Expected</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="py-4 border-b border-gray-50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
                <History className="h-4 w-4 mr-2" /> View All
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-4">
                
                <div className="relative pl-6">
                  <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="font-medium text-slate-900 text-sm">Demo Scheduled</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Today, 10:30 AM
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Product demo scheduled for tomorrow at 2 PM. Sent calendar invite.</p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">By {lead.assignedTo}</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-purple-500 ring-4 ring-purple-50" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="font-medium text-slate-900 text-sm">Status Changed</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Yesterday, 4:15 PM
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Status changed from <span className="font-medium">New</span> to <span className="font-medium">Assigned</span></p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">By Company Admin</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-gray-400 ring-4 ring-gray-50" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="font-medium text-slate-900 text-sm">Lead Created</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {lead.createdDate}, 11:00 AM
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Lead generated via {lead.createdBy}</p>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
