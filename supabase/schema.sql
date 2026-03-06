create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'customer')),
  created_at timestamp default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  base_price numeric not null,
  created_at timestamp default now()
);

create table add_ons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  service_id uuid references services(id),
  appointment_date date not null,
  appointment_time time not null,
  notes text,
  status text default 'pending',
  created_at timestamp default now()
);

create index idx_appointments_user on appointments(user_id);

create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  appointment_id uuid references appointments(id),
  amount numeric not null,
  status text,
  stripe_session_id text,
  created_at timestamp default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references users(id),
  receiver_id uuid references users(id),
  content text,
  created_at timestamp default now()
);