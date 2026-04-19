-- 0003_functions.sql
-- RPCs para operaciones que no caben bien en policies:
--   * validate_couple_code: validar código ANTES de auth (anon) → fix del v1
--   * create_couple_and_join: registrar pareja + enlazar al user1 de forma atómica
--   * join_couple_by_code: enlazar user2 a una pareja existente
--
-- Nota: usamos variables escalares en lugar de record types (public.couples).
-- PL/pgSQL a veces falla al resolver `rec.campo` dentro de jsonb_build_object
-- cuando rec es de tipo compuesto, interpretando el nombre como tabla.

-- ============================================================================
-- Generador de código de 6 chars (sin caracteres ambiguos)
-- ============================================================================
create or replace function public.generate_couple_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  i int;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(chars, 1 + floor(random() * length(chars))::int, 1);
    end loop;
    exit when not exists (select 1 from public.couples where couple_code = code);
  end loop;
  return code;
end;
$$;

-- ============================================================================
-- validate_couple_code (callable sin autenticación)
-- ============================================================================
create or replace function public.validate_couple_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user1_name text;
  v_user2_name text;
  v_start_date date;
  v_user2_id   uuid;
begin
  select user1_name, user2_name, start_date, user2_id
    into v_user1_name, v_user2_name, v_start_date, v_user2_id
    from public.couples
    where couple_code = upper(trim(p_code))
    limit 1;

  if not found then
    return jsonb_build_object('valid', false, 'already_full', false);
  end if;

  return jsonb_build_object(
    'valid', true,
    'already_full', v_user2_id is not null,
    'user1_name', v_user1_name,
    'user2_name', v_user2_name,
    'start_date', v_start_date
  );
end;
$$;

grant execute on function public.validate_couple_code(text) to anon, authenticated;

-- ============================================================================
-- create_couple_and_join: el user1 crea la pareja y queda enlazado
-- ============================================================================
create or replace function public.create_couple_and_join(
  p_user1_name text,
  p_user2_name text,
  p_start_date date
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_id   uuid;
  v_couple_code text;
  v_existing    uuid;
begin
  if auth.uid() is null then
    raise exception 'no_auth';
  end if;

  select couple_id into v_existing from public.profiles where id = auth.uid();
  if v_existing is not null then
    raise exception 'already_in_couple';
  end if;

  v_couple_code := public.generate_couple_code();

  insert into public.couples (user1_id, user1_name, user2_name, start_date, couple_code)
    values (auth.uid(), trim(p_user1_name), trim(p_user2_name), p_start_date, v_couple_code)
    returning id into v_couple_id;

  update public.profiles
    set couple_id    = v_couple_id,
        couple_code  = v_couple_code,
        display_name = coalesce(nullif(trim(p_user1_name), ''), display_name)
    where id = auth.uid();

  return jsonb_build_object(
    'couple_id',   v_couple_id,
    'couple_code', v_couple_code
  );
end;
$$;

grant execute on function public.create_couple_and_join(text, text, date) to authenticated;

-- ============================================================================
-- join_couple_by_code: el user2 se une a una pareja existente
-- ============================================================================
create or replace function public.join_couple_by_code(
  p_code text,
  p_my_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
  v_user1_id  uuid;
  v_user2_id  uuid;
  v_code      text;
  v_existing  uuid;
begin
  if auth.uid() is null then
    raise exception 'no_auth';
  end if;

  select couple_id into v_existing from public.profiles where id = auth.uid();
  if v_existing is not null then
    raise exception 'already_in_couple';
  end if;

  v_code := upper(trim(p_code));

  select id, user1_id, user2_id
    into v_couple_id, v_user1_id, v_user2_id
    from public.couples
    where couple_code = v_code
    for update;

  if not found then
    raise exception 'invalid_code';
  end if;

  if v_user2_id is not null then
    raise exception 'already_full';
  end if;

  if v_user1_id = auth.uid() then
    raise exception 'cannot_join_own_couple';
  end if;

  update public.couples
    set user2_id   = auth.uid(),
        user2_name = coalesce(nullif(trim(p_my_name), ''), user2_name)
    where id = v_couple_id;

  update public.profiles
    set couple_id    = v_couple_id,
        couple_code  = v_code,
        display_name = coalesce(nullif(trim(p_my_name), ''), display_name)
    where id = auth.uid();

  return jsonb_build_object('couple_id', v_couple_id);
end;
$$;

grant execute on function public.join_couple_by_code(text, text) to authenticated;

-- ============================================================================
-- update_my_mood: atómico, mantiene mood_updated_at coherente
-- ============================================================================
create or replace function public.update_my_mood(
  p_mood mood_key,
  p_message text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'no_auth';
  end if;

  update public.profiles
    set mood = p_mood,
        mood_message = nullif(trim(coalesce(p_message, '')), ''),
        mood_updated_at = now()
    where id = auth.uid();
end;
$$;

grant execute on function public.update_my_mood(mood_key, text) to authenticated;
