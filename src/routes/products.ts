import { Hono } from 'hono';
import type { Env, Product, ProductWithVariants, ProductVariant, ApiResponse } from '../types';
import { getProductVariants, getProductAvailableAttributes } from '../utils/variant-helpers';

export const productsRouter = new Hono<{ Bindings: Env }>();

// Pomocná funkce pro generování product URL
function addProductUrl(product: any, baseUrl: string): any {
  return {
    ...product,
    product_url: `${baseUrl}/api/products/${product.id}`,
    shop_url: `${baseUrl}/#/product/${product.id}`,
    direct_link: `${baseUrl}/products/${product.id}`
  };
}

// Pomocná funkce pro zpracování produktů s odkazy
function processProductsWithUrls(products: any[], baseUrl: string): any[] {
  return products.map(product => addProductUrl(product, baseUrl));
}

// GET /api/products - Seznam všech produktů s pokročilým filtrováním
productsRouter.get('/', async (c) => {
  try {
    const query = c.req.query('q') || '';
    const category = c.req.query('category') || '';
    const minPrice = parseFloat(c.req.query('min_price') || '0');
    const maxPrice = parseFloat(c.req.query('max_price') || '999999');
    const color = c.req.query('color') || '';
    const size = c.req.query('size') || '';
    const memory = c.req.query('memory') || '';
    const material = c.req.query('material') || '';
    const inStock = c.req.query('in_stock') === 'true';
    const sortBy = c.req.query('sort_by') || 'created_at';
    const sortOrder = c.req.query('sort_order') || 'DESC';
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    // Build the base query with joins for variant filtering
    let sql = `
      SELECT DISTINCT
        p.id, p.name, p.description, p.price, p.category, p.stock, p.image_url, 
        p.created_at, p.updated_at,
        COUNT(pv.id) as variant_count,
        MIN(p.price + COALESCE(pv.price_adjustment, 0)) as min_price,
        MAX(p.price + COALESCE(pv.price_adjustment, 0)) as max_price
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN product_variant_attributes pva ON pv.id = pva.variant_id
      LEFT JOIN product_attributes pa ON pva.attribute_id = pa.id
      LEFT JOIN product_attribute_values pav ON pva.attribute_value_id = pav.id
      WHERE 1=1
    `;
    const params = [];

    // Stock filter
    if (inStock) {
      sql += ` AND (p.stock > 0 OR pv.stock > 0)`;
    }

    // Text search
    if (query) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`);
    }

    // Category filter
    if (category) {
      sql += ` AND p.category = ?`;
      params.push(category);
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 999999) {
      sql += ` AND (p.price >= ? AND p.price <= ?)`;
      params.push(minPrice, maxPrice);
    }

    // Variant attribute filters
    const attributeFilters = [];
    if (color) {
      attributeFilters.push({ attribute: 'color', value: color });
    }
    if (size) {
      attributeFilters.push({ attribute: 'size', value: size });
    }
    if (memory) {
      attributeFilters.push({ attribute: 'memory', value: memory });
    }
    if (material) {
      attributeFilters.push({ attribute: 'material', value: material });
    }

    // Apply attribute filters
    if (attributeFilters.length > 0) {
      const attributeConditions = attributeFilters.map(() => 
        `(pa.name = ? AND pav.value = ?)`
      ).join(' OR ');
      
      sql += ` AND p.id IN (
        SELECT DISTINCT pv2.product_id 
        FROM product_variants pv2
        JOIN product_variant_attributes pva2 ON pv2.id = pva2.variant_id
        JOIN product_attributes pa2 ON pva2.attribute_id = pa2.id
        JOIN product_attribute_values pav2 ON pva2.attribute_value_id = pav2.id
        WHERE ${attributeConditions}
      )`;
      
      attributeFilters.forEach(filter => {
        params.push(filter.attribute, filter.value);
      });
    }

    // Group by product
    sql += ` GROUP BY p.id, p.name, p.description, p.price, p.category, p.stock, p.image_url, p.created_at, p.updated_at`;

    // Sorting
    const allowedSortFields = ['name', 'price', 'created_at', 'category', 'stock'];
    const allowedSortOrders = ['ASC', 'DESC'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
    
    sql += ` ORDER BY p.${validSortBy} ${validSortOrder}`;

    // Pagination
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const { results } = await c.env.DB.prepare(sql).bind(...params).all();

    // Get total count for pagination
    let countSql = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN product_variant_attributes pva ON pv.id = pva.variant_id
      LEFT JOIN product_attributes pa ON pva.attribute_id = pa.id
      LEFT JOIN product_attribute_values pav ON pva.attribute_value_id = pav.id
      WHERE 1=1
    `;
    const countParams = [];

    // Apply same filters for count
    if (inStock) {
      countSql += ` AND (p.stock > 0 OR pv.stock > 0)`;
    }
    if (query) {
      countSql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      countParams.push(`%${query}%`, `%${query}%`);
    }
    if (category) {
      countSql += ` AND p.category = ?`;
      countParams.push(category);
    }
    if (minPrice > 0 || maxPrice < 999999) {
      countSql += ` AND (p.price >= ? AND p.price <= ?)`;
      countParams.push(minPrice, maxPrice);
    }
    if (attributeFilters.length > 0) {
      const attributeConditions = attributeFilters.map(() => 
        `(pa.name = ? AND pav.value = ?)`
      ).join(' OR ');
      
      countSql += ` AND p.id IN (
        SELECT DISTINCT pv2.product_id 
        FROM product_variants pv2
        JOIN product_variant_attributes pva2 ON pv2.id = pva2.variant_id
        JOIN product_attributes pa2 ON pva2.attribute_id = pa2.id
        JOIN product_attribute_values pav2 ON pva2.attribute_value_id = pav2.id
        WHERE ${attributeConditions}
      )`;
      
      attributeFilters.forEach(filter => {
        countParams.push(filter.attribute, filter.value);
      });
    }

    const { results: countResults } = await c.env.DB.prepare(countSql).bind(...countParams).all();
    const totalCount = (countResults[0] as any)?.total || 0;

    // Add URLs to products
    const baseUrl = `https://${c.req.header('host') || 'shop-demo-api.kureckamichal.workers.dev'}`;
    const productsWithUrls = processProductsWithUrls(results as any[], baseUrl);

    return c.json({
      success: true,
      data: productsWithUrls,
      pagination: {
        total: totalCount,
        limit,
        offset,
        has_more: offset + limit < totalCount
      },
      filters: {
        query,
        category,
        min_price: minPrice,
        max_price: maxPrice,
        color,
        size,
        memory,
        material,
        in_stock: inStock,
        sort_by: validSortBy,
        sort_order: validSortOrder
      },
      message: `Nalezeno ${results.length} produktů z celkem ${totalCount}`
    } as ApiResponse<Product[]>);
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání produktů'
      }
    } as ApiResponse<never>, 500);
  }
});

// GET /api/products/filters - Získání dostupných filtrů
productsRouter.get('/filters', async (c) => {
  try {
    // Get all categories
    const { results: categoryResults } = await c.env.DB.prepare(`
      SELECT DISTINCT category FROM products ORDER BY category
    `).all();

    // Get price range
    const { results: priceResults } = await c.env.DB.prepare(`
      SELECT 
        MIN(price) as min_price, 
        MAX(price) as max_price 
      FROM products
    `).all();

    // Get all available attribute options
    const { results: attributeResults } = await c.env.DB.prepare(`
      SELECT 
        pa.name as attribute_name,
        pa.display_name,
        pa.attribute_type,
        pav.value,
        pav.display_value,
        pav.hex_color,
        pav.sort_order,
        COUNT(DISTINCT pv.product_id) as product_count
      FROM product_attributes pa
      JOIN product_attribute_values pav ON pa.id = pav.attribute_id
      JOIN product_variant_attributes pva ON pav.id = pva.attribute_value_id
      JOIN product_variants pv ON pva.variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
      WHERE p.stock > 0 OR pv.stock > 0
      GROUP BY pa.id, pav.id
      ORDER BY pa.name, pav.sort_order
    `).all();

    // Group attributes by type
    const attributes: any = {};
    attributeResults.forEach((attr: any) => {
      if (!attributes[attr.attribute_name]) {
        attributes[attr.attribute_name] = {
          name: attr.attribute_name,
          display_name: attr.display_name,
          attribute_type: attr.attribute_type,
          options: []
        };
      }
      
      attributes[attr.attribute_name].options.push({
        value: attr.value,
        display_value: attr.display_value,
        hex_color: attr.hex_color,
        product_count: attr.product_count
      });
    });

    const priceRange = priceResults[0] as any;
    
    return c.json({
      success: true,
      data: {
        categories: categoryResults.map((c: any) => c.category),
        price_range: {
          min: priceRange?.min_price || 0,
          max: priceRange?.max_price || 0
        },
        attributes: Object.values(attributes)
      },
      message: 'Filtry úspěšně načteny'
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání filtrů'
      }
    } as ApiResponse<never>, 500);
  }
});

// GET /api/products/search - Vyhledávání produktů
productsRouter.get('/search', async (c) => {
  try {
    const query = c.req.query('q') || '';
    const category = c.req.query('category') || '';
    const limit = parseInt(c.req.query('limit') || '10');

    let sql = `
      SELECT * FROM products 
      WHERE stock > 0
    `;
    const params = [];

    if (query) {
      sql += ` AND (name LIKE ? OR description LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`);
    }

    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }

    sql += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(limit);

    const { results } = await c.env.DB.prepare(sql).bind(...params).all();

    // Přidání URL k produktům
    const baseUrl = `https://${c.req.header('host') || 'shop-demo-api.kureckamichal.workers.dev'}`;
    const productsWithUrls = processProductsWithUrls(results as any[], baseUrl);

    return c.json({
      success: true,
      data: productsWithUrls,
      message: `Nalezeno ${results.length} produktů`,
      search_params: { query, category, limit }
    } as ApiResponse<Product[]>);
  } catch (error) {
    console.error('Error searching products:', error);
    return c.json({
      success: false,
      error: {
        code: 'SEARCH_ERROR',
        message: 'Chyba při vyhledávání produktů'
      }
    } as ApiResponse<never>, 500);
  }
});

// GET /api/products/:id - Detail produktu s variantami
productsRouter.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const includeVariants = c.req.query('variants') === 'true';
    
    if (isNaN(id)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Neplatné ID produktu'
        }
      } as ApiResponse<never>, 400);
    }

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM products WHERE id = ?
    `).bind(id).all();

    if (results.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Produkt nebyl nalezen'
        }
      } as ApiResponse<never>, 404);
    }

    const baseUrl = `https://${c.req.header('host') || 'shop-demo-api.kureckamichal.workers.dev'}`;
    let productData: Product | ProductWithVariants = addProductUrl(results[0], baseUrl);

    // Pokud jsou požadovány varianty, načti je
    if (includeVariants) {
      const variants = await getProductVariants(c.env.DB, id);
      const availableAttributes = await getProductAvailableAttributes(c.env.DB, id);
      
      productData = {
        ...productData,
        variants,
        available_attributes: availableAttributes
      } as ProductWithVariants;
    }

    return c.json({
      success: true,
      data: productData,
      message: 'Produkt úspěšně načten'
    } as ApiResponse<Product | ProductWithVariants>);
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání produktu'
      }
    } as ApiResponse<never>, 500);
  }
});

// POST /api/products - Vytvoření produktu (admin)
productsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { name, description, price, category, stock, image_url } = body;

    // Validace
    if (!name || !price || !category) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Název, cena a kategorie jsou povinné'
        }
      } as ApiResponse<never>, 400);
    }

    const { results } = await c.env.DB.prepare(`
      INSERT INTO products (name, description, price, category, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(name, description || '', price, category, stock || 0, image_url || null).all();

    // Přidání URL k novému produktu
    const baseUrl = `https://${c.req.header('host') || 'shop-demo-api.kureckamichal.workers.dev'}`;
    const productWithUrl = addProductUrl(results[0], baseUrl);

    return c.json({
      success: true,
      data: productWithUrl,
      message: 'Produkt úspěšně vytvořen'
    } as ApiResponse<Product>, 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Chyba při vytváření produktu'
      }
    } as ApiResponse<never>, 500);
  }
});

// PUT /api/products/:id - Aktualizace produktu
productsRouter.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { name, description, price, category, stock, image_url } = body;

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Neplatné ID produktu'
        }
      } as ApiResponse<never>, 400);
    }

    const { results } = await c.env.DB.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, category = ?, stock = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING *
    `).bind(name, description, price, category, stock, image_url, id).all();

    if (results.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Produkt nebyl nalezen'
        }
      } as ApiResponse<never>, 404);
    }

    // Přidání URL k aktualizovanému produktu
    const baseUrl = `https://${c.req.header('host') || 'shop-demo-api.kureckamichal.workers.dev'}`;
    const productWithUrl = addProductUrl(results[0], baseUrl);

    return c.json({
      success: true,
      data: productWithUrl,
      message: 'Produkt úspěšně aktualizován'
    } as ApiResponse<Product>);
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Chyba při aktualizaci produktu'
      }
    } as ApiResponse<never>, 500);
  }
});

// GET /api/products/:id/variants - Seznam variant produktu
productsRouter.get('/:id/variants', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    if (isNaN(id)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Neplatné ID produktu'
        }
      } as ApiResponse<never>, 400);
    }

    // Ověř, že produkt existuje
    const { results: productResults } = await c.env.DB.prepare(`
      SELECT id FROM products WHERE id = ?
    `).bind(id).all();

    if (productResults.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Produkt nebyl nalezen'
        }
      } as ApiResponse<never>, 404);
    }

    const variants = await getProductVariants(c.env.DB, id);
    const availableAttributes = await getProductAvailableAttributes(c.env.DB, id);

    return c.json({
      success: true,
      data: {
        variants,
        available_attributes: availableAttributes
      },
      message: 'Varianty produktu úspěšně načteny'
    } as ApiResponse<{ variants: ProductVariant[], available_attributes: any }>);
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání variant produktu'
      }
    } as ApiResponse<never>, 500);
  }
});

// GET /api/products/:id/variants/:variantId - Detail konkrétní varianty
productsRouter.get('/:id/variants/:variantId', async (c) => {
  try {
    const productId = parseInt(c.req.param('id'));
    const variantId = parseInt(c.req.param('variantId'));
    
    if (isNaN(productId) || isNaN(variantId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Neplatné ID produktu nebo varianty'
        }
      } as ApiResponse<never>, 400);
    }

    const { results } = await c.env.DB.prepare(`
      SELECT 
        pv.*,
        p.name as product_name,
        p.description as product_description,
        p.category as product_category,
        p.image_url as product_image_url,
        (p.price + pv.price_adjustment) as final_price
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      WHERE pv.id = ? AND pv.product_id = ?
    `).bind(variantId, productId).all();

    if (results.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'VARIANT_NOT_FOUND',
          message: 'Varianta nebyla nalezena'
        }
      } as ApiResponse<never>, 404);
    }

    const variantData = results[0] as any;
    
    // Načti atributy této varianty
    const { results: attributeResults } = await c.env.DB.prepare(`
      SELECT 
        pa.name as attribute_name,
        pa.display_name as attribute_display_name,
        pa.attribute_type,
        pav.value,
        pav.display_value,
        pav.hex_color
      FROM product_variant_attributes pva
      JOIN product_attributes pa ON pva.attribute_id = pa.id
      JOIN product_attribute_values pav ON pva.attribute_value_id = pav.id
      WHERE pva.variant_id = ?
    `).bind(variantId).all();

    const attributes = attributeResults.map((attr: any) => ({
      attribute_name: attr.attribute_name,
      attribute_display_name: attr.attribute_display_name,
      attribute_type: attr.attribute_type,
      value: attr.value,
      display_value: attr.display_value,
      hex_color: attr.hex_color
    }));

    return c.json({
      success: true,
      data: {
        id: variantData.id,
        product_id: variantData.product_id,
        product_name: variantData.product_name,
        product_description: variantData.product_description,
        product_category: variantData.product_category,
        sku: variantData.sku,
        price_adjustment: variantData.price_adjustment,
        final_price: variantData.final_price,
        stock: variantData.stock,
        image_url: variantData.image_url || variantData.product_image_url,
        is_default: variantData.is_default,
        attributes,
        created_at: variantData.created_at,
        updated_at: variantData.updated_at
      },
      message: 'Varianta úspěšně načtena'
    });
  } catch (error) {
    console.error('Error fetching variant:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání varianty'
      }
    } as ApiResponse<never>, 500);
  }
});
