drop function if exists public.handle_new_user;
create function public.handle_new_user() 
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customer (id)
  values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
