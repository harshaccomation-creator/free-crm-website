import { teamMembers } from "@/data/dummy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus, Users, UserCheck, Shield, UserX } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Team() {
  const stats = [
    { title: "Total Members", value: teamMembers.length