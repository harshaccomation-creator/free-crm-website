import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save, Key, Shield } from "lucide-react";

export default function Profile() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Profile</h2>
      
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl font-semibold">
                    AS
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  Company Admin
                </span>
              </div>
            </div>
            
            <div className="flex-1 w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Arjun Sharma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="arjun@salesflow.in" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-muted-foreground">Company</Label>
                  <Input id="company" defaultValue="TechCorp Solutions" disabled className="bg-gray-50" />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button className="gap-2 bg-primary">
                  <Save className="h-4 w-4" /> Update Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="border-b border-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5 text-slate-500" /> Password
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input id="new" type="password" />
            </div>
            <Button variant="outline" className="w-full mt-2">Change Password</Button>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="border-b border-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-slate-500" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-1">
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
              <Button variant="outline" size="sm" className="mt-3">Enable 2FA</Button>
            </div>
            <div className="space-y-1 pt-4 border-t border-gray-50">
              <h4 className="font-medium">Active Sessions</h4>
              <p className="text-sm text-muted-foreground">You are currently logged in from Mumbai, IN (IP: 103.45.*.*)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
