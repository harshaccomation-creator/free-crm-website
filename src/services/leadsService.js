import { supabase } from '../lib/supabaseClient.js';

export async function fetchLeads() {
  if (!supabase) return { data: null, error: null };
  return supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function createLead(payload) {
  if (!supabase) return { data: null, error: new Error('Backend not configured') };
  return supabase
    .from('leads')
    .insert(payload)
    .select('*')
    .single();
}

export async function updateLead(id, payload) {
  if (!supabase) return { data: null, error: new Error('Backend not configured') };
  return supabase
    .from('leads')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
}

export async function fetchLeadActivities(leadId) {
  if (!supabase) return { data: null, error: null };
  return supabase
    .from('lead_activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('activity_at', { ascending: false });
}

export async function createLeadActivity(payload) {
  if (!supabase) return { data: null, error: new Error('Backend not configured') };
  return supabase
    .from('lead_activities')
    .insert(payload)
    .select('*')
    .single();
}

export async function updateLeadActivity(id, payload) {
  if (!supabase) return { data: null, error: new Error('Backend not configured') };
  return supabase
    .from('lead_activities')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
}

export async function fetchTasks() {
  if (!supabase) return { data: null, error: null };
  return supabase
    .from('tasks')
    .select('*')
    .order('due_at', { ascending: true });
}

export async function createTask(payload) {
  if (!supabase) return { data: null, error: new Error('Backend not configured') };
  return supabase
    .from('tasks')
    .insert(payload)
    .select('*')
    .single();
}

export async function updateTask(id, payload) {
  if (!supabase) return { data: null, error: new Error('Backend not configured') };
  return supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
}
