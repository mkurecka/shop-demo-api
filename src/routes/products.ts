import { Hono } from 'hono';
import type { Env, Product, ApiResponse } from '../types';

export const productsRouter = new Hono<{ Bindings: Env }>();

// Pomocná funkce pro generování product URL
function addProductUrl(product: any, baseUrl: string): any {
  return {
    ...product,
    product_url: `${baseUrl}/api/products/${product.id}`,
    shop_url: `${baseUrl}/#/product/${product.id}`,
    direct_link: `${baseUrl}/?product=${product.id}`
  };
}

// Pomocná funkce pro zpracování produktů s odkazy
function processProductsWithUrls(products: any[], baseUrl: string): any[] {
  return products.map(product => addProductUrl(product, baseUrl));
}

// GET /api/products - Seznam všech produktů
productsRouter.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM products 
      WHERE stock > 0 
      ORDER BY created_at DESC
    `).all();

    // Přidání URL k produktům
    const baseUrl = `https://${c.req.header('host') || 'shop-demo-api.kureckamichal.workers.dev'}`;
    const productsWithUrls = processProductsWithUrls(results as any[], baseUrl);

    return c.json({
      success: true,
      data: productsWithUrls,
      message: 'Produkty úspěšně načteny'
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

// GET /api/products/:id - Detail produktu
productsRouter.get('/:id', async (c) => {
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

    // Přidání URL k produktu
    const baseUrl = `https://${c.req.header('host') || 'shop-demo-api.kureckamichal.workers.dev'}`;
    const productWithUrl = addProductUrl(results[0], baseUrl);

    return c.json({
      success: true,
      data: productWithUrl,
      message: 'Produkt úspěšně načten'
    } as ApiResponse<Product>);
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
