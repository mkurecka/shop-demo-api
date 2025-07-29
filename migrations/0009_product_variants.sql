-- Migration to add product variants system
-- This allows products to have multiple variants (like sizes, colors, memory options, etc.)

-- Product attributes table (defines what attributes exist: size, color, memory, etc.)
CREATE TABLE IF NOT EXISTS product_attributes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE, -- 'size', 'color', 'memory', 'storage', etc.
  display_name TEXT NOT NULL, -- 'Velikost', 'Barva', 'Paměť', etc.
  attribute_type TEXT DEFAULT 'text', -- 'text', 'color', 'number'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product attribute values table (defines possible values for each attribute)
CREATE TABLE IF NOT EXISTS product_attribute_values (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attribute_id INTEGER NOT NULL,
  value TEXT NOT NULL, -- 'S', 'M', 'L', 'červená', '128GB', etc.
  display_value TEXT NOT NULL, -- Display name for frontend
  hex_color TEXT, -- For color attributes, store hex value
  sort_order INTEGER DEFAULT 0, -- For ordering values
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attribute_id) REFERENCES product_attributes (id) ON DELETE CASCADE,
  UNIQUE(attribute_id, value)
);

-- Product variants table (specific combinations of a product with attribute values)
CREATE TABLE IF NOT EXISTS product_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  sku TEXT UNIQUE, -- SKU for this specific variant (optional)
  price_adjustment REAL DEFAULT 0, -- Price difference from base product (+/- amount)
  stock INTEGER DEFAULT 0, -- Stock for this specific variant
  image_url TEXT, -- Specific image for this variant (optional)
  is_default BOOLEAN DEFAULT FALSE, -- Mark one variant as default for product
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

-- Junction table for variant attribute values (many-to-many)
CREATE TABLE IF NOT EXISTS product_variant_attributes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  variant_id INTEGER NOT NULL,
  attribute_id INTEGER NOT NULL,
  attribute_value_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (variant_id) REFERENCES product_variants (id) ON DELETE CASCADE,
  FOREIGN KEY (attribute_id) REFERENCES product_attributes (id) ON DELETE CASCADE,
  FOREIGN KEY (attribute_value_id) REFERENCES product_attribute_values (id) ON DELETE CASCADE,
  UNIQUE(variant_id, attribute_id) -- Each variant can only have one value per attribute
);

-- Update order_items to reference specific variants instead of just products
ALTER TABLE order_items ADD COLUMN variant_id INTEGER REFERENCES product_variants(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variant_attributes_variant_id ON product_variant_attributes(variant_id);
CREATE INDEX IF NOT EXISTS idx_product_variant_attributes_attribute_id ON product_variant_attributes(attribute_id);
CREATE INDEX IF NOT EXISTS idx_product_attribute_values_attribute_id ON product_attribute_values(attribute_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);

-- Insert common attributes
INSERT INTO product_attributes (name, display_name, attribute_type) VALUES
('size', 'Velikost', 'text'),
('color', 'Barva', 'color'),
('memory', 'Paměť', 'text'),
('storage', 'Úložiště', 'text'),
('material', 'Materiál', 'text'),
('capacity', 'Kapacita', 'text');

-- Insert common attribute values for sizes
INSERT INTO product_attribute_values (attribute_id, value, display_value, sort_order) VALUES
((SELECT id FROM product_attributes WHERE name = 'size'), 'XS', 'XS', 1),
((SELECT id FROM product_attributes WHERE name = 'size'), 'S', 'S', 2),
((SELECT id FROM product_attributes WHERE name = 'size'), 'M', 'M', 3),
((SELECT id FROM product_attributes WHERE name = 'size'), 'L', 'L', 4),
((SELECT id FROM product_attributes WHERE name = 'size'), 'XL', 'XL', 5),
((SELECT id FROM product_attributes WHERE name = 'size'), 'XXL', 'XXL', 6);

-- Insert common colors
INSERT INTO product_attribute_values (attribute_id, value, display_value, hex_color, sort_order) VALUES
((SELECT id FROM product_attributes WHERE name = 'color'), 'black', 'Černá', '#000000', 1),
((SELECT id FROM product_attributes WHERE name = 'color'), 'white', 'Bílá', '#FFFFFF', 2),
((SELECT id FROM product_attributes WHERE name = 'color'), 'red', 'Červená', '#FF0000', 3),
((SELECT id FROM product_attributes WHERE name = 'color'), 'blue', 'Modrá', '#0000FF', 4),
((SELECT id FROM product_attributes WHERE name = 'color'), 'green', 'Zelená', '#00FF00', 5),
((SELECT id FROM product_attributes WHERE name = 'color'), 'gray', 'Šedá', '#808080', 6);

-- Insert memory options for electronics
INSERT INTO product_attribute_values (attribute_id, value, display_value, sort_order) VALUES
((SELECT id FROM product_attributes WHERE name = 'memory'), '64GB', '64 GB', 1),
((SELECT id FROM product_attributes WHERE name = 'memory'), '128GB', '128 GB', 2),
((SELECT id FROM product_attributes WHERE name = 'memory'), '256GB', '256 GB', 3),
((SELECT id FROM product_attributes WHERE name = 'memory'), '512GB', '512 GB', 4),
((SELECT id FROM product_attributes WHERE name = 'memory'), '1TB', '1 TB', 5);

-- Insert storage options for electronics
INSERT INTO product_attribute_values (attribute_id, value, display_value, sort_order) VALUES
((SELECT id FROM product_attributes WHERE name = 'storage'), '128GB', '128 GB', 1),
((SELECT id FROM product_attributes WHERE name = 'storage'), '256GB', '256 GB', 2),
((SELECT id FROM product_attributes WHERE name = 'storage'), '512GB', '512 GB', 3),
((SELECT id FROM product_attributes WHERE name = 'storage'), '1TB', '1 TB', 4),
((SELECT id FROM product_attributes WHERE name = 'storage'), '2TB', '2 TB', 5);