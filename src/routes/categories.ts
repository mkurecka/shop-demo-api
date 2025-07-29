import { Hono } from 'hono';
import type { Env, ApiResponse } from '../types';

export const categoriesRouter = new Hono<{ Bindings: Env }>();

// Category metadata with Czech names, descriptions, and icons
const CATEGORY_METADATA = {
  elektronika: {
    id: 'elektronika',
    name: 'Elektronika',
    description: 'Nejnovější elektronické zařízení, počítače, telefony a příslušenství',
    icon: '📱',
    color: '#667eea',
    keywords: ['telefon', 'počítač', 'elektronika', 'gadget', 'tech']
  },
  obleceni: {
    id: 'obleceni',
    name: 'Oblečení',
    description: 'Módní oblečení pro muže a ženy všech věkových kategorií',
    icon: '👕',
    color: '#48bb78',
    keywords: ['oblečení', 'móda', 'tričko', 'kalhoty', 'bunda']
  },
  domacnost: {
    id: 'domacnost',
    name: 'Domácnost',
    description: 'Spotřebiče a vybavení pro domácnost a kuchyň',
    icon: '🏠',
    color: '#ed8936',
    keywords: ['domácnost', 'kuchyň', 'spotřebič', 'nábytek', 'vybavení']
  },
  sport: {
    id: 'sport',
    name: 'Sport a volný čas',
    description: 'Sportovní potřeby, fitness vybavení a outdoorové aktivity',
    icon: '⚽',
    color: '#38b2ac',
    keywords: ['sport', 'fitness', 'outdoor', 'cvičení', 'aktivita']
  }
};

// GET /api/categories - List all categories with metadata
categoriesRouter.get('/', async (c) => {
  try {
    // Get product counts for each category
    const { results } = await c.env.DB.prepare(`
      SELECT category, COUNT(*) as product_count
      FROM products 
      WHERE stock > 0
      GROUP BY category
      ORDER BY category
    `).all();

    const categoryStats = new Map();
    for (const row of results as any[]) {
      categoryStats.set(row.category, row.product_count);
    }

    // Combine metadata with product counts
    const categories = Object.values(CATEGORY_METADATA).map(category => ({
      ...category,
      product_count: categoryStats.get(category.id) || 0
    }));

    return c.json({
      success: true,
      data: categories,
      message: 'Kategorie úspěšně načteny'
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání kategorií'
      }
    } as ApiResponse<never>, 500);
  }
});

// GET /api/categories/:categoryId - Get category details with products
categoriesRouter.get('/:categoryId', async (c) => {
  try {
    const categoryId = c.req.param('categoryId');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');
    const sortBy = c.req.query('sort') || 'created_at';
    const sortOrder = c.req.query('order') || 'DESC';

    // Validate category exists in metadata
    const categoryMeta = CATEGORY_METADATA[categoryId as keyof typeof CATEGORY_METADATA];
    if (!categoryMeta) {
      return c.json({
        success: false,
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: 'Kategorie nebyla nalezena'
        }
      } as ApiResponse<never>, 404);
    }

    // Validate sort parameters
    const allowedSortFields = ['created_at', 'name', 'price', 'stock'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Get products in category with pagination
    const { results: products } = await c.env.DB.prepare(`
      SELECT * FROM products 
      WHERE category = ? AND stock > 0
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT ? OFFSET ?
    `).bind(categoryId, limit, offset).all();

    // Get total count for pagination
    const { results: countResult } = await c.env.DB.prepare(`
      SELECT COUNT(*) as total FROM products 
      WHERE category = ? AND stock > 0
    `).bind(categoryId).all();

    const total = (countResult[0] as any)?.total || 0;

    // Add product URLs
    const baseUrl = `https://${c.req.header('host') || 'shop-demo-api.kureckamichal.workers.dev'}`;
    const productsWithUrls = (products as any[]).map(product => ({
      ...product,
      product_url: `${baseUrl}/api/products/${product.id}`,
      shop_url: `${baseUrl}/#/product/${product.id}`,
      direct_link: `${baseUrl}/products/${product.id}`
    }));

    return c.json({
      success: true,
      data: {
        category: categoryMeta,
        products: productsWithUrls,
        pagination: {
          total,
          limit,
          offset,
          has_more: offset + limit < total,
          page: Math.floor(offset / limit) + 1,
          total_pages: Math.ceil(total / limit)
        },
        sorting: {
          sort_by: validSortBy,
          sort_order: validSortOrder
        }
      },
      message: `Produkty v kategorii ${categoryMeta.name} úspěšně načteny`
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error fetching category products:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání produktů kategorie'
      }
    } as ApiResponse<never>, 500);
  }
});

// GET /api/categories/:categoryId/stats - Get category statistics
categoriesRouter.get('/:categoryId/stats', async (c) => {
  try {
    const categoryId = c.req.param('categoryId');

    // Validate category exists
    const categoryMeta = CATEGORY_METADATA[categoryId as keyof typeof CATEGORY_METADATA];
    if (!categoryMeta) {
      return c.json({
        success: false,
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: 'Kategorie nebyla nalezena'
        }
      } as ApiResponse<never>, 404);
    }

    // Get comprehensive category statistics
    const { results: stats } = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN stock > 0 THEN 1 END) as in_stock_products,
        COUNT(CASE WHEN stock = 0 THEN 1 END) as out_of_stock_products,
        AVG(price) as average_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        SUM(stock) as total_stock
      FROM products 
      WHERE category = ?
    `).bind(categoryId).all();

    const categoryStats = stats[0] as any;

    return c.json({
      success: true,
      data: {
        category: categoryMeta,
        statistics: {
          total_products: categoryStats.total_products,
          in_stock_products: categoryStats.in_stock_products,
          out_of_stock_products: categoryStats.out_of_stock_products,
          average_price: Math.round(categoryStats.average_price || 0),
          min_price: categoryStats.min_price || 0,
          max_price: categoryStats.max_price || 0,
          total_stock: categoryStats.total_stock || 0
        }
      },
      message: `Statistiky kategorie ${categoryMeta.name} úspěšně načteny`
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání statistik kategorie'
      }
    } as ApiResponse<never>, 500);
  }
});

// GET /api/categories/search - Search categories by name or keywords
categoriesRouter.get('/search', async (c) => {
  try {
    const query = c.req.query('q') || '';
    
    if (!query.trim()) {
      return c.json({
        success: false,
        error: {
          code: 'MISSING_QUERY',
          message: 'Vyhledávací dotaz je povinný'
        }
      } as ApiResponse<never>, 400);
    }

    const searchTerm = query.toLowerCase();
    
    // Search categories by name, description, or keywords
    const matchingCategories = Object.values(CATEGORY_METADATA).filter(category => 
      category.name.toLowerCase().includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm) ||
      category.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );

    // Get product counts for matching categories
    const categoryIds = matchingCategories.map(cat => cat.id);
    
    if (categoryIds.length > 0) {
      const placeholders = categoryIds.map(() => '?').join(',');
      const { results } = await c.env.DB.prepare(`
        SELECT category, COUNT(*) as product_count
        FROM products 
        WHERE category IN (${placeholders}) AND stock > 0
        GROUP BY category
      `).bind(...categoryIds).all();

      const categoryStats = new Map();
      for (const row of results as any[]) {
        categoryStats.set(row.category, row.product_count);
      }

      const categoriesWithCounts = matchingCategories.map(category => ({
        ...category,
        product_count: categoryStats.get(category.id) || 0
      }));

      return c.json({
        success: true,
        data: categoriesWithCounts,
        message: `Nalezeno ${categoriesWithCounts.length} kategorií pro "${query}"`
      } as ApiResponse<any>);
    } else {
      return c.json({
        success: true,
        data: [],
        message: `Žádné kategorie nenalezeny pro "${query}"`
      } as ApiResponse<any>);
    }
  } catch (error) {
    console.error('Error searching categories:', error);
    return c.json({
      success: false,
      error: {
        code: 'SEARCH_ERROR',
        message: 'Chyba při vyhledávání kategorií'
      }
    } as ApiResponse<never>, 500);
  }
});