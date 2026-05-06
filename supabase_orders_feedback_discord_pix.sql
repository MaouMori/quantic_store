-- Run this in Supabase SQL editor before using order tracking and feedbacks in production.

alter table public.orders
  add column if not exists user_id uuid,
  add column if not exists customer_discord text,
  add column if not exists payment_method text default 'pix',
  add column if not exists payment_status text default 'pendente',
  add column if not exists coupon_code text,
  add column if not exists discount_amount numeric default 0;

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  discord text,
  rating integer not null default 5 check (rating between 1 and 5),
  text text not null,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.feedbacks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'feedbacks' and policyname = 'Feedbacks public read approved'
  ) then
    create policy "Feedbacks public read approved"
      on public.feedbacks for select
      using (approved = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'feedbacks' and policyname = 'Feedbacks public insert'
  ) then
    create policy "Feedbacks public insert"
      on public.feedbacks for insert
      with check (rating between 1 and 5 and length(trim(name)) > 0 and length(trim(text)) > 0);
  end if;
end $$;
