import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, ShieldCheck, Trophy } from "lucide-react";
import { getCurrentProfile, getCompanyUsers, listLeads } from "../../services/crmApi.js";

function initials(name = "U