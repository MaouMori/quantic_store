alter table public.products
  add column if not exists discount_percent numeric not null default 0,
  add column if not exists rating numeric not null default 0,
  add column if not exists rating_count integer not null default 0;

create table if not exists public.product_ratings (
  product_id integer not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (product_id, user_id)
);

alter table public.product_ratings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_ratings'
      and policyname = 'Users can read product ratings'
  ) then
    create policy "Users can read product ratings"
      on public.product_ratings
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_ratings'
      and policyname = 'Users can insert own product ratings'
  ) then
    create policy "Users can insert own product ratings"
      on public.product_ratings
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_ratings'
      and policyname = 'Users can update own product ratings'
  ) then
    create policy "Users can update own product ratings"
      on public.product_ratings
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

create or replace function public.rate_product(p_product_id integer, p_rating integer)
returns table (rating numeric, rating_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rating numeric;
  v_count integer;
begin
  if auth.uid() is null then
    raise exception 'Usuario precisa estar logado para avaliar.';
  end if;

  if p_rating < 1 or p_rating > 5 then
    raise exception 'A avaliacao precisa ser entre 1 e 5.';
  end if;

  insert into public.product_ratings (product_id, user_id, rating)
  values (p_product_id, auth.uid(), p_rating)
  on conflict (product_id, user_id)
  do update set
    rating = excluded.rating,
    updated_at = now();

  select round(avg(pr.rating)::numeric, 1), count(*)::integer
    into v_rating, v_count
  from public.product_ratings pr
  where pr.product_id = p_product_id;

  update public.products
    set rating = coalesce(v_rating, 0),
        rating_count = coalesce(v_count, 0)
  where id = p_product_id;

  return query select coalesce(v_rating, 0), coalesce(v_count, 0);
end;
$$;

grant execute on function public.rate_product(integer, integer) to authenticated;
