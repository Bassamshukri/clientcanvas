create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text not null default '',
  logo_url text,
  primary_color text default '#6d5efc',
  secondary_color text default '#111827',
  accent_color text default '#19c29b',
  font_family text default 'Inter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null default 'Untitled design',
  status text not null default 'draft' check (status in ('draft', 'in_review', 'needs_changes', 'approved')),
  width integer not null default 1080,
  height integer not null default 1080,
  canvas_json jsonb,
  thumbnail_url text,
  built_in_template text,
  custom_template_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  design_id uuid not null references public.designs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text,
  body text not null,
  x numeric,
  y numeric,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.review_links (
  id uuid primary key default gen_random_uuid(),
  design_id uuid not null references public.designs(id) on delete cascade,
  token text not null unique,
  status text not null default 'active' check (status in ('active', 'revoked', 'expired')),
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.review_decisions (
  id uuid primary key default gen_random_uuid(),
  review_link_id uuid not null references public.review_links(id) on delete cascade,
  decision text not null check (decision in ('approved', 'needs_changes')),
  reviewer_name text,
  reviewer_email text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  type text not null default 'image',
  file_url text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.export_archives (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  requested_by uuid references auth.users(id) on delete set null,
  status text not null default 'queued' check (status in ('queued', 'processing', 'ready', 'failed')),
  file_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_owner(target_workspace_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.workspaces w
    where w.id = target_workspace_id
      and w.owner_id = auth.uid()
  );
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists workspaces_set_updated_at on public.workspaces;
create trigger workspaces_set_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists designs_set_updated_at on public.designs;
create trigger designs_set_updated_at
before update on public.designs
for each row execute function public.set_updated_at();

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

drop trigger if exists review_links_set_updated_at on public.review_links;
create trigger review_links_set_updated_at
before update on public.review_links
for each row execute function public.set_updated_at();

drop trigger if exists export_archives_set_updated_at on public.export_archives;
create trigger export_archives_set_updated_at
before update on public.export_archives
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.designs enable row level security;
alter table public.comments enable row level security;
alter table public.review_links enable row level security;
alter table public.review_decisions enable row level security;
alter table public.assets enable row level security;
alter table public.export_archives enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own"
on public.profiles for all
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "workspaces_select_members" on public.workspaces;
create policy "workspaces_select_members"
on public.workspaces for select
to authenticated
using (
  owner_id = auth.uid()
  or public.is_workspace_member(id)
);

drop policy if exists "workspaces_insert_owner" on public.workspaces;
create policy "workspaces_insert_owner"
on public.workspaces for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "workspaces_update_owner" on public.workspaces;
create policy "workspaces_update_owner"
on public.workspaces for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "workspace_members_select_members" on public.workspace_members;
create policy "workspace_members_select_members"
on public.workspace_members for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "workspace_members_manage_owner" on public.workspace_members;
create policy "workspace_members_manage_owner"
on public.workspace_members for all
to authenticated
using (public.is_workspace_owner(workspace_id))
with check (public.is_workspace_owner(workspace_id));

drop policy if exists "designs_select_members" on public.designs;
create policy "designs_select_members"
on public.designs for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "designs_insert_members" on public.designs;
create policy "designs_insert_members"
on public.designs for insert
to authenticated
with check (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "designs_update_members" on public.designs;
create policy "designs_update_members"
on public.designs for update
to authenticated
using (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "designs_delete_members" on public.designs;
create policy "designs_delete_members"
on public.designs for delete
to authenticated
using (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "comments_select_members" on public.comments;
create policy "comments_select_members"
on public.comments for select
to authenticated
using (
  exists (
    select 1 from public.designs d
    where d.id = comments.design_id
      and (
        public.is_workspace_member(d.workspace_id)
        or public.is_workspace_owner(d.workspace_id)
      )
  )
);

drop policy if exists "comments_insert_members" on public.comments;
create policy "comments_insert_members"
on public.comments for insert
to authenticated
with check (
  exists (
    select 1 from public.designs d
    where d.id = comments.design_id
      and (
        public.is_workspace_member(d.workspace_id)
        or public.is_workspace_owner(d.workspace_id)
      )
  )
);

drop policy if exists "comments_update_members" on public.comments;
create policy "comments_update_members"
on public.comments for update
to authenticated
using (
  exists (
    select 1 from public.designs d
    where d.id = comments.design_id
      and (
        public.is_workspace_member(d.workspace_id)
        or public.is_workspace_owner(d.workspace_id)
      )
  )
)
with check (
  exists (
    select 1 from public.designs d
    where d.id = comments.design_id
      and (
        public.is_workspace_member(d.workspace_id)
        or public.is_workspace_owner(d.workspace_id)
      )
  )
);

drop policy if exists "review_links_select_members" on public.review_links;
create policy "review_links_select_members"
on public.review_links for select
to authenticated
using (
  exists (
    select 1 from public.designs d
    where d.id = review_links.design_id
      and (
        public.is_workspace_member(d.workspace_id)
        or public.is_workspace_owner(d.workspace_id)
      )
  )
);

drop policy if exists "review_links_manage_members" on public.review_links;
create policy "review_links_manage_members"
on public.review_links for all
to authenticated
using (
  exists (
    select 1 from public.designs d
    where d.id = review_links.design_id
      and (
        public.is_workspace_member(d.workspace_id)
        or public.is_workspace_owner(d.workspace_id)
      )
  )
)
with check (
  exists (
    select 1 from public.designs d
    where d.id = review_links.design_id
      and (
        public.is_workspace_member(d.workspace_id)
        or public.is_workspace_owner(d.workspace_id)
      )
  )
);

drop policy if exists "review_decisions_select_members" on public.review_decisions;
create policy "review_decisions_select_members"
on public.review_decisions for select
to authenticated
using (
  exists (
    select 1
    from public.review_links rl
    join public.designs d on d.id = rl.design_id
    where rl.id = review_decisions.review_link_id
      and (
        public.is_workspace_member(d.workspace_id)
        or public.is_workspace_owner(d.workspace_id)
      )
  )
);

drop policy if exists "assets_select_members" on public.assets;
create policy "assets_select_members"
on public.assets for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "assets_manage_members" on public.assets;
create policy "assets_manage_members"
on public.assets for all
to authenticated
using (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "export_archives_select_members" on public.export_archives;
create policy "export_archives_select_members"
on public.export_archives for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

drop policy if exists "export_archives_manage_members" on public.export_archives;
create policy "export_archives_manage_members"
on public.export_archives for all
to authenticated
using (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
  or public.is_workspace_owner(workspace_id)
);

insert into storage.buckets (id, name, public)
values ('workspace-assets', 'workspace-assets', true)
on conflict (id) do nothing;