-- ================================================
-- MIGRATION: Add membership_dues and check-in tracking
-- Date: 2026-01-27
-- ================================================

-- 1) Enum para estado de pago (si no existe)
do $$ begin
  create type public.payment_status as enum ('pending', 'paid', 'waived');
exception when duplicate_object then null;
end $$;

-- 2) Tabla de mensualidades
create table if not exists public.membership_dues (
  id uuid primary key default gen_random_uuid(),

  profile_id uuid not null references public.profiles(id) on delete cascade,

  -- representa el mes (usa día 1 siempre)
  period_month date not null,

  amount_cents int not null default 5000,
  currency text not null default 'EUR',

  status public.payment_status not null default 'pending',

  paid_at timestamptz null,
  marked_by uuid null references public.profiles(id) on delete set null,
  note text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint membership_dues_unique unique (profile_id, period_month)
);

create index if not exists membership_dues_profile_idx on public.membership_dues(profile_id);
create index if not exists membership_dues_period_idx on public.membership_dues(period_month);

-- Trigger updated_at (usa tu función existente set_updated_at())
drop trigger if exists trg_membership_dues_updated_at on public.membership_dues;
create trigger trg_membership_dues_updated_at
before update on public.membership_dues
for each row execute function public.set_updated_at();

-- 3) Añadir check-in a reservas (asistencias)
alter table public.class_bookings
add column if not exists checked_in_at timestamptz null;

create index if not exists class_bookings_checked_in_idx
on public.class_bookings(profile_id, checked_in_at);

-- (Opcional) si quieres filtrar rápido por clase y check-in
create index if not exists class_bookings_class_checked_in_idx
on public.class_bookings(class_id, checked_in_at);

-- ================================================
-- VERIFICATION QUERIES (run these after migration)
-- ================================================

-- Check if membership_dues table was created
-- SELECT EXISTS (
--   SELECT FROM information_schema.tables 
--   WHERE table_name = 'membership_dues'
-- );

-- Check if checked_in_at column was added
-- SELECT column_name 
-- FROM information_schema.columns 
-- WHERE table_name = 'class_bookings' 
-- AND column_name = 'checked_in_at';

-- ================================================
-- SAMPLE QUERIES (for development/testing)
-- ================================================

-- Get last 6 months dues for a user
-- SELECT * FROM membership_dues
-- WHERE profile_id = 'USER_UUID'
-- ORDER BY period_month DESC
-- LIMIT 6;

-- Get attendance count for a user
-- SELECT COUNT(*) as attendance_count
-- FROM class_bookings
-- WHERE profile_id = 'USER_UUID'
--   AND checked_in_at IS NOT NULL
--   AND cancelled_at IS NULL
--   AND removed_at IS NULL;

-- Get active future bookings count
-- SELECT COUNT(*) as active_bookings
-- FROM class_bookings cb
-- JOIN classes c ON c.id = cb.class_id
-- WHERE cb.profile_id = 'USER_UUID'
--   AND cb.cancelled_at IS NULL
--   AND cb.removed_at IS NULL
--   AND c.starts_at >= NOW()
--   AND c.status = 'active';
