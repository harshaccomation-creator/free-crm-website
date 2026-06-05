import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users, UserCheck, Trophy, Mail } from "lucide-react";
import { getCurrentProfile, getCompanyUsers, listLeads } from "../../services/crmApi.js";

function initials(name = "User") {
  return String(name || "User").split(" ").map