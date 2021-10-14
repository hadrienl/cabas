drop function if exists add_product_to_basket cascade;
create function add_product_to_basket(product_id int8, quantity int8)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  distribution_id int8;
  distribution_price float;
  basket_id int8;
begin
  select distribution.id as id, product_in_distribution.price as price
    from distribution
    into distribution_id, distribution_price
    left join product_in_distribution on product_in_distribution.fk_distribution = distribution.id
    where
      product_in_distribution.id = product_id and
      distribution.start_at < CURRENT_DATE and
      distribution.close_at > CURRENT_DATE
    fetch first row only;

  if (distribution_id is null)
  then
    return false;
  end if;

  select basket.id, distribution.start_at
    from basket
    into basket_id
    left join product_in_basket on product_in_basket.fk_basket = basket.id
    left join product_in_distribution on product_in_basket.fk_product = product_in_distribution.id
    left join distribution on product_in_distribution.fk_distribution = distribution.id
    where
          basket.fk_customer = auth.uid()
      and distribution.start_at < CURRENT_DATE
      and distribution.close_at > CURRENT_DATE;
  
  if (basket_id is null)
  then
    insert into basket (fk_customer, status)
      values (auth.uid(), 0)
      returning basket.id into basket_id;
  end if;
  
  insert into product_in_basket (fk_basket, fk_product, unit_price, quantity)
    values (basket_id, product_id, distribution_price, quantity);

  return true;
end;
$$;
