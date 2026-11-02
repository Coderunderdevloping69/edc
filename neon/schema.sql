create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  usn text not null,
  phone text not null,
  idea text not null,
  created_at timestamptz not null default now()
);
