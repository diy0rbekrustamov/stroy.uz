-- Speed up paginated product queries and category/brand filtering.
CREATE INDEX IF NOT EXISTS listings_catalog_price_idx
  ON listings (price, id) WHERE kind='product' AND published=true;
CREATE INDEX IF NOT EXISTS listings_catalog_category_idx
  ON listings ((data->>'categoryId')) WHERE kind='product' AND published=true;
CREATE INDEX IF NOT EXISTS listings_catalog_brand_idx
  ON listings ((data->>'brand')) WHERE kind='product' AND published=true;
