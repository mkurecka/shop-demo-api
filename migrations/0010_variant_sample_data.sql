-- Sample data for product variants

-- Create variants for iPhone 15 Pro (product_id = 1)
-- Different memory options with price adjustments
INSERT INTO product_variants (product_id, sku, price_adjustment, stock, is_default) VALUES
(1, 'IPHONE15PRO-128GB-BLACK', 0, 5, TRUE), -- Base price
(1, 'IPHONE15PRO-256GB-BLACK', 4000, 3, FALSE), -- +4000 CZK for 256GB
(1, 'IPHONE15PRO-512GB-BLACK', 8000, 2, FALSE); -- +8000 CZK for 512GB

-- Add memory attributes to iPhone variants
INSERT INTO product_variant_attributes (variant_id, attribute_id, attribute_value_id) VALUES
-- iPhone 128GB variant
((SELECT id FROM product_variants WHERE sku = 'IPHONE15PRO-128GB-BLACK'), 
 (SELECT id FROM product_attributes WHERE name = 'memory'), 
 (SELECT id FROM product_attribute_values WHERE value = '128GB' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'memory'))),

-- iPhone 256GB variant  
((SELECT id FROM product_variants WHERE sku = 'IPHONE15PRO-256GB-BLACK'), 
 (SELECT id FROM product_attributes WHERE name = 'memory'), 
 (SELECT id FROM product_attribute_values WHERE value = '256GB' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'memory'))),

-- iPhone 512GB variant
((SELECT id FROM product_variants WHERE sku = 'IPHONE15PRO-512GB-BLACK'), 
 (SELECT id FROM product_attributes WHERE name = 'memory'), 
 (SELECT id FROM product_attribute_values WHERE value = '512GB' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'memory')));

-- Create variants for Pánské tričko Basic (product_id = 9)
-- Different sizes and colors
INSERT INTO product_variants (product_id, sku, price_adjustment, stock, is_default) VALUES
(9, 'TRICKO-BASIC-S-BLACK', 0, 15, TRUE), -- Base: S, Black
(9, 'TRICKO-BASIC-M-BLACK', 0, 20, FALSE), -- M, Black
(9, 'TRICKO-BASIC-L-BLACK', 0, 18, FALSE), -- L, Black
(9, 'TRICKO-BASIC-S-WHITE', 0, 12, FALSE), -- S, White
(9, 'TRICKO-BASIC-M-WHITE', 0, 25, FALSE), -- M, White
(9, 'TRICKO-BASIC-L-WHITE', 0, 22, FALSE), -- L, White
(9, 'TRICKO-BASIC-S-RED', 50, 8, FALSE), -- S, Red (+50 CZK)
(9, 'TRICKO-BASIC-M-RED', 50, 10, FALSE), -- M, Red (+50 CZK)
(9, 'TRICKO-BASIC-L-RED', 50, 12, FALSE); -- L, Red (+50 CZK)

-- Add size and color attributes to t-shirt variants
-- Black t-shirts
INSERT INTO product_variant_attributes (variant_id, attribute_id, attribute_value_id) VALUES
-- S Black
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-S-BLACK'), 
 (SELECT id FROM product_attributes WHERE name = 'size'), 
 (SELECT id FROM product_attribute_values WHERE value = 'S' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'size'))),
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-S-BLACK'), 
 (SELECT id FROM product_attributes WHERE name = 'color'), 
 (SELECT id FROM product_attribute_values WHERE value = 'black' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'color'))),

-- M Black
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-M-BLACK'), 
 (SELECT id FROM product_attributes WHERE name = 'size'), 
 (SELECT id FROM product_attribute_values WHERE value = 'M' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'size'))),
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-M-BLACK'), 
 (SELECT id FROM product_attributes WHERE name = 'color'), 
 (SELECT id FROM product_attribute_values WHERE value = 'black' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'color'))),

-- L Black
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-L-BLACK'), 
 (SELECT id FROM product_attributes WHERE name = 'size'), 
 (SELECT id FROM product_attribute_values WHERE value = 'L' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'size'))),
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-L-BLACK'), 
 (SELECT id FROM product_attributes WHERE name = 'color'), 
 (SELECT id FROM product_attribute_values WHERE value = 'black' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'color'))),

-- S White
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-S-WHITE'), 
 (SELECT id FROM product_attributes WHERE name = 'size'), 
 (SELECT id FROM product_attribute_values WHERE value = 'S' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'size'))),
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-S-WHITE'), 
 (SELECT id FROM product_attributes WHERE name = 'color'), 
 (SELECT id FROM product_attribute_values WHERE value = 'white' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'color'))),

-- M White
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-M-WHITE'), 
 (SELECT id FROM product_attributes WHERE name = 'size'), 
 (SELECT id FROM product_attribute_values WHERE value = 'M' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'size'))),
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-M-WHITE'), 
 (SELECT id FROM product_attributes WHERE name = 'color'), 
 (SELECT id FROM product_attribute_values WHERE value = 'white' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'color'))),

-- L White
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-L-WHITE'), 
 (SELECT id FROM product_attributes WHERE name = 'size'), 
 (SELECT id FROM product_attribute_values WHERE value = 'L' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'size'))),
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-L-WHITE'), 
 (SELECT id FROM product_attributes WHERE name = 'color'), 
 (SELECT id FROM product_attribute_values WHERE value = 'white' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'color'))),

-- S Red
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-S-RED'), 
 (SELECT id FROM product_attributes WHERE name = 'size'), 
 (SELECT id FROM product_attribute_values WHERE value = 'S' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'size'))),
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-S-RED'), 
 (SELECT id FROM product_attributes WHERE name = 'color'), 
 (SELECT id FROM product_attribute_values WHERE value = 'red' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'color'))),

-- M Red
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-M-RED'), 
 (SELECT id FROM product_attributes WHERE name = 'size'), 
 (SELECT id FROM product_attribute_values WHERE value = 'M' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'size'))),
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-M-RED'), 
 (SELECT id FROM product_attributes WHERE name = 'color'), 
 (SELECT id FROM product_attribute_values WHERE value = 'red' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'color'))),

-- L Red
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-L-RED'), 
 (SELECT id FROM product_attributes WHERE name = 'size'), 
 (SELECT id FROM product_attribute_values WHERE value = 'L' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'size'))),
((SELECT id FROM product_variants WHERE sku = 'TRICKO-BASIC-L-RED'), 
 (SELECT id FROM product_attributes WHERE name = 'color'), 
 (SELECT id FROM product_attribute_values WHERE value = 'red' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'color')));

-- Create variants for MacBook Air M3 (product_id = 3)
-- Different storage options
INSERT INTO product_variants (product_id, sku, price_adjustment, stock, is_default) VALUES
(3, 'MACBOOK-AIR-M3-256GB', 0, 3, TRUE), -- Base storage
(3, 'MACBOOK-AIR-M3-512GB', 6000, 2, FALSE), -- +6000 CZK for 512GB
(3, 'MACBOOK-AIR-M3-1TB', 12000, 1, FALSE); -- +12000 CZK for 1TB

-- Add storage attributes to MacBook variants
INSERT INTO product_variant_attributes (variant_id, attribute_id, attribute_value_id) VALUES
-- MacBook 256GB variant
((SELECT id FROM product_variants WHERE sku = 'MACBOOK-AIR-M3-256GB'), 
 (SELECT id FROM product_attributes WHERE name = 'storage'), 
 (SELECT id FROM product_attribute_values WHERE value = '256GB' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'storage'))),

-- MacBook 512GB variant  
((SELECT id FROM product_variants WHERE sku = 'MACBOOK-AIR-M3-512GB'), 
 (SELECT id FROM product_attributes WHERE name = 'storage'), 
 (SELECT id FROM product_attribute_values WHERE value = '512GB' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'storage'))),

-- MacBook 1TB variant
((SELECT id FROM product_variants WHERE sku = 'MACBOOK-AIR-M3-1TB'), 
 (SELECT id FROM product_attributes WHERE name = 'storage'), 
 (SELECT id FROM product_attribute_values WHERE value = '1TB' AND attribute_id = (SELECT id FROM product_attributes WHERE name = 'storage')));