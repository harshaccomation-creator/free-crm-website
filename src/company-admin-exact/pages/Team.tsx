import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, ShieldCheck, Plus, Mail, Phone, CheckCircle2 } from "lucide-react";
import { getCurrentProfile, getCompanyUsers, listLeads } from "../../services/crmApi.js";

function getInitials(name: string) {
  return String(name || "User").split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();
}

function roleLabel(role: string) {
  const value = String(role || "employee").replace(/_/g, " ");
  return value.replace(/\b\w/g, (m) => m.toUpperCase());
}

function isWon(status: string) {
  return ["won", "converted", "demo done"].includes(String(status || "").toLowerCase());
}

function formatDate(value: any) {
  if (!value) return "—";
  try { return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); } catch { return "—"; }
}

export default function Team() {
  const [members, setMembers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  use