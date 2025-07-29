import type { ProductVariant, ProductVariantAttribute } from '../types';

// Pomocná funkce pro načtení variant produktu
export async function getProductVariants(db: D1Database, productId: number): Promise<ProductVariant[]> {
  const { results } = await db.prepare(`
    SELECT 
      pv.*,
      pa.name as attribute_name,
      pa.display_name as attribute_display_name,
      pa.attribute_type,
      pav.id as value_id,
      pav.value,
      pav.display_value,
      pav.hex_color
    FROM product_variants pv
    LEFT JOIN product_variant_attributes pva ON pv.id = pva.variant_id
    LEFT JOIN product_attributes pa ON pva.attribute_id = pa.id
    LEFT JOIN product_attribute_values pav ON pva.attribute_value_id = pav.id
    WHERE pv.product_id = ?
    ORDER BY pv.is_default DESC, pv.id ASC
  `).bind(productId).all();

  // Group attributes by variant
  const variantsMap = new Map<number, ProductVariant>();
  
  for (const row of results as any[]) {
    if (!variantsMap.has(row.id)) {
      variantsMap.set(row.id, {
        id: row.id,
        product_id: row.product_id,
        sku: row.sku,
        price_adjustment: row.price_adjustment,
        stock: row.stock,
        image_url: row.image_url,
        is_default: row.is_default,
        created_at: row.created_at,
        updated_at: row.updated_at,
        attributes: []
      });
    }
    
    const variant = variantsMap.get(row.id)!;
    if (row.attribute_name) {
      variant.attributes!.push({
        attribute_id: row.attribute_id,
        attribute_name: row.attribute_name,
        attribute_display_name: row.attribute_display_name,
        attribute_type: row.attribute_type,
        value_id: row.value_id,
        value: row.value,
        display_value: row.display_value,
        hex_color: row.hex_color
      });
    }
  }
  
  return Array.from(variantsMap.values());
}

// Pomocná funkce pro načtení dostupných atributů produktu
export async function getProductAvailableAttributes(db: D1Database, productId: number) {
  const { results } = await db.prepare(`
    SELECT DISTINCT
      pa.name as attribute_name,
      pa.display_name as attribute_display_name,
      pav.id as value_id,
      pav.value,
      pav.display_value,
      pav.hex_color,
      pav.sort_order
    FROM product_variants pv
    JOIN product_variant_attributes pva ON pv.id = pva.variant_id
    JOIN product_attributes pa ON pva.attribute_id = pa.id
    JOIN product_attribute_values pav ON pva.attribute_value_id = pav.id
    WHERE pv.product_id = ?
    ORDER BY pa.name, pav.sort_order
  `).bind(productId).all();

  const attributesMap: { [key: string]: any[] } = {};
  
  for (const row of results as any[]) {
    if (!attributesMap[row.attribute_name]) {
      attributesMap[row.attribute_name] = [];
    }
    attributesMap[row.attribute_name].push({
      id: row.value_id,
      value: row.value,
      display_value: row.display_value,
      hex_color: row.hex_color,
      sort_order: row.sort_order
    });
  }
  
  return attributesMap;
}