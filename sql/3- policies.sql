DROP POLICY IF EXISTS "Customer" ON customer;
CREATE POLICY "Customer"
  ON customer
  FOR ALL
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Basket" ON customer;
CREATE POLICY "Basket"
  ON basket
  FOR ALL
  USING (auth.uid() = fk_customer);
