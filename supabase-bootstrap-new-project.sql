-- =====================================================
-- Soro Boxing Club - Bootstrap completo para Supabase nuevo
-- =====================================================
-- Uso:
-- 1. Crea el proyecto Supabase nuevo en la cuenta/usuario del cliente.
-- 2. Abre Supabase Dashboard > SQL Editor.
-- 3. Ejecuta este archivo completo.
-- 4. Actualiza .env.local con SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY nuevos.
--
-- Este script crea estructura vacia. No migra datos.
-- =====================================================

create extension if not exists "pgcrypto";

do $$
begin
  create type public.payment_status as enum ('pending', 'paid', 'waived');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('admin', 'client')),
  dni text not null unique,
  first_name text,
  last_name text,
  email text,
  phone text,
  pin_hash text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz,
  last_login_at timestamptz
);

create index if not exists idx_profiles_dni on public.profiles(dni);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_deleted_at on public.profiles(deleted_at);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  token_hash text unique not null,
  created_at timestamptz default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create index if not exists idx_sessions_profile_id on public.sessions(profile_id);
create index if not exists idx_sessions_token_hash on public.sessions(token_hash);
create index if not exists idx_sessions_expires_at on public.sessions(expires_at);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  professor text not null,
  starts_at timestamptz not null,
  duration_minutes integer not null default 60,
  capacity integer not null default 20,
  status text not null check (status in ('active', 'cancelled')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_classes_starts_at on public.classes(starts_at);
create index if not exists idx_classes_status on public.classes(status);

create table if not exists public.class_bookings (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  cancelled_at timestamptz,
  removed_at timestamptz,
  removed_by uuid references public.profiles(id),
  removed_reason text,
  checked_in_at timestamptz,
  unique(class_id, profile_id)
);

create index if not exists idx_bookings_class_id on public.class_bookings(class_id);
create index if not exists idx_bookings_profile_id on public.class_bookings(profile_id);
create index if not exists idx_bookings_cancelled_at on public.class_bookings(cancelled_at);
create index if not exists class_bookings_checked_in_idx on public.class_bookings(profile_id, checked_in_at);
create index if not exists class_bookings_class_checked_in_idx on public.class_bookings(class_id, checked_in_at);

create table if not exists public.membership_dues (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  period_month date not null,
  amount_cents int not null default 5000,
  currency text not null default 'EUR',
  status public.payment_status not null default 'pending',
  paid_at timestamptz,
  marked_by uuid references public.profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint membership_dues_unique unique (profile_id, period_month)
);

create index if not exists membership_dues_profile_idx on public.membership_dues(profile_id);
create index if not exists membership_dues_period_idx on public.membership_dues(period_month);

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Compatibilidad con supabase-migrations.sql antiguo, que llamaba a set_updated_at().
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_classes_updated_at on public.classes;
create trigger update_classes_updated_at
  before update on public.classes
  for each row execute function public.update_updated_at_column();

drop trigger if exists trg_membership_dues_updated_at on public.membership_dues;
create trigger trg_membership_dues_updated_at
  before update on public.membership_dues
  for each row execute function public.update_updated_at_column();

create or replace function public.cleanup_expired_sessions()
returns void as $$
begin
  delete from public.sessions
  where expires_at < now()
    and revoked_at is null;
end;
$$ language plpgsql;

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.classes enable row level security;
alter table public.class_bookings enable row level security;
alter table public.membership_dues enable row level security;

drop policy if exists "Service role has full access" on public.profiles;
create policy "Service role has full access" on public.profiles
  for all to service_role using (true) with check (true);

drop policy if exists "Service role has full access" on public.sessions;
create policy "Service role has full access" on public.sessions
  for all to service_role using (true) with check (true);

drop policy if exists "Service role has full access" on public.classes;
create policy "Service role has full access" on public.classes
  for all to service_role using (true) with check (true);

drop policy if exists "Service role has full access" on public.class_bookings;
create policy "Service role has full access" on public.class_bookings
  for all to service_role using (true) with check (true);

drop policy if exists "Service role has full access" on public.membership_dues;
create policy "Service role has full access" on public.membership_dues
  for all to service_role using (true) with check (true);

comment on table public.profiles is 'Usuarios propios de Soro Boxing Club, con rol admin/client y PIN hasheado';
comment on table public.sessions is 'Sesiones propias de la app, no Supabase Auth';
comment on table public.classes is 'Clases disponibles para reserva';
comment on table public.class_bookings is 'Reservas, cancelaciones, bajas manuales y check-ins';
comment on table public.membership_dues is 'Mensualidades por usuario y mes';

notify pgrst, 'reload schema';
