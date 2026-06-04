import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Save, Users, Settings2, Bell } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-gray-100 h-12 p-1 shadow-sm">
          <TabsTrigger value="company" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Building2 className="h-4 w-4 mr-2" /> Company
          </TabsTrigger>
          <TabsTrigger value="crm" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Settings2 className="h-4 w-4 mr-2" /> CRM setup
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" /> Permissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-50 bg-white/50">
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>Update your company details and branding.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 font-medium text-sm">
                  Logo
                </div>
                <Button variant="outline" size="sm">Upload new logo</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="TechCorp Solutions Pvt Ltd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input id="gst" defaultValue="27AADCT4854B1Z5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Support Email</Label>
                  <Input id="email" type="email" defaultValue="support@techcorp.in" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input id="phone" defaultValue="+91 9876543210" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Registered Address</Label>
                  <Input id="address" defaultValue="402, Business Park, Andheri East, Mumbai 400053" />
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-50">
                <Button className="gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm">
          <Card className="border-gray-100 shadow-sm mb-6">
            <CardHeader className="border-b border-gray-50 bg-white/50">
              <CardTitle>Lead Statuses</CardTitle>
              <CardDescription>Customize the pipeline stages for your leads.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {['New', 'Assigned', 'Demo Done', 'Won', 'Lost', 'Junk'].map((status, i) => (
                  <div key={status} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className={`w-3 h-3 rounded-full ${i===0?'bg-blue-500':i===1?'bg-purple-500':i===2?'bg-amber-500':i===3?'bg-green-500':i===4?'bg-red-500':'bg-slate-500'}`}></div>
                    <span className="font-medium flex-1">{status}</span>
                    <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2">Edit</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed mt-2">
                  + Add New Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-50 bg-white/50">
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you get alerted.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">Email Daily Report</h4>
                  <p className="text-sm text-muted-foreground mt-1">Receive a daily digest of new leads and tasks at 9 AM.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">Follow-up Reminders</h4>
                  <p className="text-sm text-muted-foreground mt-1">Get notified 15 minutes before a scheduled follow-up.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">WhatsApp Integration</h4>
                  <p className="text-sm text-muted-foreground mt-1">Send automatic WhatsApp messages to leads on status change.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">Overdue Alerts</h4>
                  <p className="text-sm text-muted-foreground mt-1">Notify managers when a lead hasn't been touched in 48 hours.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-50 bg-white/50">
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Manage what different roles can access.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>Role permission management is available in the Enterprise plan.</p>
                <Button className="mt-4" variant="outline">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
