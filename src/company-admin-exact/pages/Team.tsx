import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, ShieldCheck, Plus, Mail, Phone, CheckCircle2 } from "lucide-react";
import { getCurrentProfile, getCompanyUsers, listLeads } from "../../services/crmApi.js";

function initials(name: string) {
  return String(name || "U").split(" ").map((x) => x[0]).join("").slice