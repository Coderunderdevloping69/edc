create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  usn text not null,
  phone text not null,
  idea text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

create policy "Allow anonymous contact submissions"
on public.contact_submissions
for insert
to anon
with check (true);
