-- Rising Without Losing Yourself — initial schema
-- Run via `supabase db push` or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

create type order_status as enum (
  'PENDING', 'PAYMENT_INITIATED', 'PAID',
  'DISPATCHED', 'DELIVERED', 'FAILED', 'CANCELLED'
);

create sequence order_seq start 1;

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text unique not null default 'RWL-' || lpad(nextval('order_seq')::text, 6, '0'),
  name text not null,
  phone text not null,
  quantity int not null default 1 check (quantity > 0 and quantity <= 50),
  location text not null,
  amount numeric not null default 1000,
  status order_status not null default 'PENDING',
  checkout_request_id text,
  merchant_request_id text,
  mpesa_receipt text,
  mpesa_code_submitted text,
  payment_method text not null default 'stk' check (payment_method in ('stk', 'till_manual')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index on orders (checkout_request_id) where checkout_request_id is not null;
create index on orders (status);
create index on orders (created_at desc);

-- Keeps updated_at current on every row change (e.g. admin status edits).
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_set_updated_at
  before update on orders
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Admin allowlist: which authenticated users may read/write `orders`.
-- There is no public signup for this table — rows are added manually by
-- a project owner (Supabase dashboard, SQL editor, or service role).
-- ---------------------------------------------------------------------
create table admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz default now()
);

alter table admins enable row level security;
-- Admins can see the allowlist only to confirm their own membership.
create policy "admins can read own row"
  on admins for select
  using (auth.uid() = user_id);

alter table orders enable row level security;

-- No policy is defined for the public/anon role, so by default it has
-- zero access to `orders` — all customer-facing reads/writes go through
-- Edge Functions using the service role key, which bypasses RLS.

create policy "admins can select orders"
  on orders for select
  using (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admins can update orders"
  on orders for update
  using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

-- Admin inserts/deletes are rarely needed (orders are created via the
-- create-order Edge Function), but included for completeness/reconciliation.
create policy "admins can insert orders"
  on orders for insert
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admins can delete orders"
  on orders for delete
  using (exists (select 1 from admins where admins.user_id = auth.uid()));

-- Enable Realtime updates for the admin dashboard's live order feed.
alter publication supabase_realtime add table orders;

-- ---------------------------------------------------------------------
-- To grant admin access after creating a user in Supabase Auth:
--   insert into admins (user_id) values ('<the user''s auth.users id>');
-- ---------------------------------------------------------------------
