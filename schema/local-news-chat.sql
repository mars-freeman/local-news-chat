create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamp with time zone default now()
);

alter table messages enable row level security;

create policy "Allow all insert" on messages
  for insert using (true);

create policy "Allow all select" on messages
  for select using (true);