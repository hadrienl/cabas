INSERT INTO public.producer (name, description, photo) VALUES
('Braxéenne', 'Brasseur artisanal de Pujaudran', 'https://ggvfxzrbqunjpfvjfqct.supabase.in/storage/v1/object/public/images/braxeenne.png'),
('Ferme L''Bufala', 'Implantée près de Lectoure, l''exploitation familiale réalise l’élevage en pré de buffles. https://www.lbufala-ferme.fr/bufala-ferme-lectoure/', '');

INSERT INTO public.tag (slug, name) VALUES
('boisson', 'Boisson'),
('fromage', 'Fromage');

INSERT INTO public.product (name, description, photo, unit, price, fk_producer, fk_tag) VALUES
(
  'La Franine',
  'Bière Blonde aux arômes fruitées

 * Amertume : 14 IBU
 * Degustation : 8-10°C
 * Degrés : 5,5%
',
  'https://ggvfxzrbqunjpfvjfqct.supabase.in/storage/v1/object/public/images/franine.png',
  1, 2.7, 1, 1
),
(
  'L''espintous',
  'Bière Blonde de type Pils (Allemande). Bière basse fermentation.

 * Amertume : 30 IBU
 * Degustation : 6-8°C
 * Degrés : 5 %
',
  'https://ggvfxzrbqunjpfvjfqct.supabase.in/storage/v1/object/public/images/espintous.png',
  1, 2.7, 1, 1
),
(
  'César',
  'Fromage lactique type crottins frais au lait de Bufflonnes',
  'https://ggvfxzrbqunjpfvjfqct.supabase.in/storage/v1/object/public/images/cesar.png',
  1, 2.5, 2, 2
),
(
  'Mozzarella au lait de Bufflonnes',
  'en boule',
  'https://ggvfxzrbqunjpfvjfqct.supabase.in/storage/v1/object/public/images/mozarelle.png',
  1, 8, 2, 2
);

INSERT INTO public.distribution (start_at, close_at, ship_at) VALUES
('2021-09-01 00:00:00 +02:00', '2021-10-01 00:00:00 +02:00', '2021-10-05 18:00:00 +02:00'),
('2021-10-15 00:00:00 +02:00', '2021-11-01 00:00:00 +02:00', '2021-11-05 18:00:00 +02:00');

INSERT INTO public.product_in_distribution (fk_distribution, fk_product, price) VALUES
(1, 1, 2.5),
(1, 2, 2.5),
(1, 4, 8),
(2, 1, 2.5),
(2, 2, 2.5),
(2, 3, 2.5),
(2, 4, 8);
