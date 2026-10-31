-- Supabase SQL düzenleyicisinde bir kez çalıştır.
create table if not exists letters (
  id uuid primary key,
  sender_name text not null,
  sender_email text not null,
  recipient_name text not null,
  recipient_email text not null,
  body text not null,
  route_id text not null,
  reverse boolean not null default false,
  sent_at timestamptz not null,
  arrives_at timestamptz not null,
  sender_token text not null unique,
  recipient_token text not null unique,
  arrival_notified_at timestamptz,
  opened_at timestamptz,
  reply_to uuid references letters(id) unique
);

create index if not exists letters_due_idx on letters (arrives_at) where arrival_notified_at is null;

-- Uygulama yalnızca sunucudaki service role anahtarıyla erişir; tarayıcıdan doğrudan erişim kapalı.
alter table letters enable row level security;
