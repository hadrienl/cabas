--------------------------------------------------------------------------------
-- BASKET
--------------------------------------------------------------------------------

drop function if exists get_product_price_from_distribution cascade;
create function get_product_price_from_distribution(product_id int8)
returns table(
  distribution_id int8,
  distribution_product_price float
)
language plpgsql
security definer
set search_path = public
as $$
declare
  ret RECORD;
begin
  return query select distribution.id as distribution_id, product_in_distribution.price as distribution_product_price
    from distribution
    left join product_in_distribution on product_in_distribution.fk_distribution = distribution.id
    where
      product_in_distribution.id = product_id and
      distribution.start_at < CURRENT_DATE and
      distribution.close_at > CURRENT_DATE
    fetch first row only;
end;
$$;

drop function if exists get_basket_id cascade;
create function get_basket_id(product_id int8)
returns table(
  basket_id int8
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query select indent.id as indent_id
    from indent
    left join product_in_indent on product_in_indent.fk_indent = indent.id
    left join product_in_distribution on product_in_indent.fk_product = product_in_distribution.id
    left join distribution on product_in_distribution.fk_distribution = distribution.id
    where
          indent.fk_customer = auth.uid()
      and distribution.start_at < CURRENT_DATE
      and distribution.close_at > CURRENT_DATE;
end;
$$;

drop function if exists add_product_to_basket cascade;
create function add_product_to_basket(product_id int8, quantity int8)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  d_id int8;
  d_price float;
  b_id int8;
begin
  select distribution_id, distribution_product_price
    from get_product_price_from_distribution(product_id)
    into d_id, d_price;

  if (d_id is null)
  then
    return false;
  end if;

  select basket_id
    from get_basket_id(product_id)
    into b_id;

  if (b_id is null)
  then
    insert into indent (fk_customer, fk_distribution, status)
      values (auth.uid(), d_id, 'pending')
      returning indent.id into b_id;
  end if;
  
  insert into product_in_indent (fk_indent, fk_product, unit_price, quantity)
    values (b_id, product_id, d_price, quantity);

  return true;
end;
$$;

drop function if exists update_product_from_basket cascade;
create function update_product_from_basket(product_id int8, new_quantity int8)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  d_id int8;
  b_id int8;
begin
  select distribution_id
    from get_product_price_from_distribution(product_id)
    into d_id;

  if (d_id is null)
  then
    return false;
  end if;

  select basket_id
    from get_basket_id(product_id)
    into b_id;
  
  if (b_id is null)
  then
    return false;
  end if;
  update product_in_indent
    set quantity = new_quantity
    where fk_product = product_id
      and fk_indent = b_id;

  return true;
end;
$$;

drop function if exists remove_products_from_basket cascade;
create function remove_products_from_basket(product_id int8)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  d_id int8;
  b_id int8;
begin
  select distribution_id
    from get_product_price_from_distribution(product_id)
    into d_id;

  if (d_id is null)
  then
    return false;
  end if;

  select basket_id
    from get_basket_id(product_id)
    into b_id;
  
  if (b_id is null)
  then
    return false;
  end if;
  
  delete from product_in_indent
    where product_in_indent.fk_product = product_id
      and product_in_indent.fk_indent = b_id;

  return true;
end;
$$;

drop function if exists submit_basket cascade;
create function submit_basket(basket_id int8)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update indent set status = 'submitted' where indent.id = basket_id;
  return true;
end;
$$;
