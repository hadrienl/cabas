drop view if exists distributed_products cascade;
create view distributed_products as
  select
    product.id,
    product.name,
    product.description,
    product.photo,
    product_in_distribution.id as id_in_distribution,
    product_in_distribution.price,
    product_in_distribution.unit,
    product_in_distribution.unit_label,
    product_in_distribution.per_unit,
    producer.id as producer_id,
    producer.name as producer_name,
    producer.description as producer_description,
    producer.photo as producer_photo,
    distribution.id as distribution_id,
    distribution.start_at,
    distribution.close_at,
    distribution.ship_at,
    tag.name as tag_name,
    tag.slug as tag_slug
    from product
    left join product_in_distribution on product.id = product_in_distribution.fk_product
    left join producer on product.fk_producer = producer.id
    left join distribution on product_in_distribution.fk_distribution = distribution.id
    left join tag on tag.id = product.fk_tag;

drop view if exists available_products cascade;
create view available_products as
  select
    id,
    name,
    description,
    photo,
    id_in_distribution,
    price,
    unit,
    unit_label,
    per_unit,
    distribution_id,
    producer_id,
    producer_name,
    producer_description,
    producer_photo,
    tag_name,
    tag_slug
    from distributed_products
    where start_at < CURRENT_DATE and close_at > CURRENT_DATE;

drop view if exists current_distribution cascade;
create view current_distribution as
  select
    *
    from distribution
    where start_at < CURRENT_DATE and close_at > CURRENT_DATE
    limit 1;

drop view if exists future_distributions cascade;
create view future_distributions as
  select
    *
    from distribution
    where start_at > CURRENT_DATE;

drop view if exists current_basket cascade;
create view current_basket as
  select
      indent.*,
      product_in_indent.unit_price,
      product_in_indent.quantity,
      product_in_distribution.id as id_in_distribution,
      product_in_distribution.unit_label,
      product_in_distribution.unit,
      product_in_distribution.per_unit,
      product_in_distribution.price,
      product.id as product_id,
      product.name as product_name,
      product.description as product_description,
      product.photo as product_photo,
      distribution.start_at,
      distribution.close_at
    from indent
    left join product_in_indent on product_in_indent.fk_indent = indent.id
    left join product_in_distribution on product_in_distribution.id = product_in_indent.fk_product
    left join distribution on distribution.id = product_in_distribution.fk_distribution
    left join product on product.id = product_in_distribution.fk_product
    where distribution.start_at < CURRENT_DATE and distribution.close_at > CURRENT_DATE and status = 'pending';

drop view if exists orders cascade;
create view orders as
  select
      indent.*,
      product_in_indent.unit_price,
      product_in_indent.quantity,
      product_in_distribution.id as id_in_distribution,
      product_in_distribution.unit_label,
      product_in_distribution.unit,
      product_in_distribution.per_unit,
      product_in_distribution.price,
      product.id as product_id,
      product.name as product_name,
      product.description as product_description,
      product.photo as product_photo,
      distribution.start_at,
      distribution.close_at
    from indent
    left join product_in_indent on product_in_indent.fk_indent = indent.id
    left join product_in_distribution on product_in_distribution.id = product_in_indent.fk_product
    left join distribution on distribution.id = product_in_distribution.fk_distribution
    left join product on product.id = product_in_distribution.fk_product
    where status != 'pending';
