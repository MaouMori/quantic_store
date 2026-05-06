create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

create table if not exists public.help_topics (
  id text primary key,
  title text not null,
  answer text not null,
  sort_order integer not null default 1,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;
alter table public.help_topics enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Authenticated can manage site settings" on public.site_settings;
create policy "Authenticated can manage site settings"
  on public.site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public can read help topics" on public.help_topics;
create policy "Public can read help topics"
  on public.help_topics for select
  using (true);

drop policy if exists "Authenticated can manage help topics" on public.help_topics;
create policy "Authenticated can manage help topics"
  on public.help_topics for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into public.site_settings (key, value)
values ('discord_url', 'https://discord.gg/quanticstore')
on conflict (key) do nothing;

insert into public.help_topics (id, title, answer, sort_order, active)
values
  ('faq', 'Perguntas Frequentes', 'Aqui voce encontra respostas para as principais duvidas sobre produtos, pedidos, entrega e suporte.', 1, true),
  ('como-comprar', 'Como comprar', 'Escolha os produtos, finalize o pedido pelo Pix, envie o comprovante e informe seu Discord para receber os arquivos.', 2, true),
  ('trocas-devolucoes', 'Trocas e Devolucoes', 'Como os produtos sao digitais, trocas e ajustes sao avaliados pelo suporte quando houver problema no arquivo entregue.', 3, true),
  ('fale-conosco', 'Fale Conosco', 'O atendimento acontece pelo Discord oficial da loja. Entre no servidor e abra um chamado para falar com a equipe.', 4, true)
on conflict (id) do nothing;
