create table if not exists public.publish_jobs (
  id uuid primary key default gen_random_uuid(),
  design_id uuid not null references public.designs(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  channel text not null check (channel in ('linkedin', 'facebook', 'instagram')),
  caption text not null default '',
  scheduled_for timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'processing', 'published', 'failed', 'cancelled')),
  external_id text,
  error_message text,
  requested_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists publish_jobs_set_updated_at on public.publish_jobs;
create trigger publish_jobs_set_updated_at
before update on public.publish_jobs
for each row execute function public.set_updated_at();

alter table public.publish_jobs enable row level security;

drop policy if exists "publish_jobs_select_members" on public.publish_jobs;
create policy "publish_jobs_select_members"
on public.publish_jobs for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "publish_jobs_insert_members" on public.publish_jobs;
create policy "publish_jobs_insert_members"
on public.publish_jobs for insert
to authenticated
with check (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "publish_jobs_update_members" on public.publish_jobs;
create policy "publish_jobs_update_members"
on public.publish_jobs for update
to authenticated
using (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "publish_jobs_delete_members" on public.publish_jobs;
create policy "publish_jobs_delete_members"
on public.publish_jobs for delete
to authenticated
using (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);