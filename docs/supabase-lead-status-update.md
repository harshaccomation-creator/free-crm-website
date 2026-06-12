# Lead status constraint update

Run this in Supabase SQL Editor before enabling full activity statuses:

```sql
alter table public.leads drop constraint if exists leads_status_check;

alter table public.leads add constraint leads_status_check check (
  status in (
    'New',
    'Contacted',
    'In Progress',
    'Qualified',
    'Proposal Sent',
    'Converted',
    'Won',
    'Lost',
    'Not Connected',
    'Demo Scheduled',
    'Demo Done',
    'Follow-up',
    'Post Demo Follow Up',
    'Junk',
    'Overdue'
  )
);
```
