import { Hono } from 'hono';
import type { Env, Order, OrderItem, ApiResponse } from '../types';

export const ordersRouter = new Hono<{ Bindings: Env }>();

// GET /api/orders - Seznam objednávek s možností filtrování
ordersRouter.get('/', async (c) => {
  try {
    // Získání query parametrů
    const email = c.req.query('email');
    const orderNumber = c.req.query('orderNumber');
    const phone = c.req.query('phone');

    // Check if user is logged in
    const authHeader = c.req.header('Authorization');
    const sessionToken = authHeader?.replace('Bearer ', '');
    let currentUser = null;

    if (sessionToken) {
      // Check for simulated user (frontend sends fake session tokens)
      if (sessionToken.startsWith('fake_session_for_')) {
        const email = sessionToken.replace('fake_session_for_', '');
        currentUser = {
          email: email,
          first_name: 'Demo',
          last_name: 'User',
          role: 'customer'
        };
      } else {
        // Real authentication check (kept for backward compatibility)
        try {
          const { results: sessions } = await c.env.DB.prepare(`
            SELECT u.email, u.first_name, u.last_name, u.role
            FROM user_sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.session_token = ? AND s.expires_at > datetime('now')
          `).bind(sessionToken).all();

          if (sessions.length > 0) {
            currentUser = sessions[0];
          }
        } catch (error) {
          console.error('Error checking auth:', error);
        }
      }
    }

    let query = 'SELECT * FROM orders';
    let conditions: string[] = [];
    let params: any[] = [];

    // Filtry podle query parametrů
    if (email) {
      conditions.push('LOWER(customer_email) = LOWER(?)');
      params.push(sanitizeInput(email));
    }

    if (orderNumber) {
      conditions.push('order_number = ?');
      params.push(sanitizeInput(orderNumber));
    }

    if (phone) {
      conditions.push('REPLACE(customer_phone, \' \', \'\') = REPLACE(?, \' \', \'\')');
      params.push(sanitizeInput(phone));
    }

    // Pokud je uživatel customer, může vidět jen své objednávky
    if (currentUser && currentUser.role === 'customer') {
      conditions.push('customer_email = ?');
      params.push(currentUser.email);
    }

    // Sestavení finálního query
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Připojíme položky objednávky ke každé objednávce
    const ordersWithItems = await Promise.all(
      results.map(async (order: any) => {
        const { results: items } = await c.env.DB.prepare(`
          SELECT * FROM order_items WHERE order_id = ?
        `).bind(order.id).all();
        
        return {
          ...order,
          items: items as OrderItem[]
        };
      })
    );

    let message = 'Objednávky úspěšně načteny';
    if (email || orderNumber || phone) {
      message = `Nalezeno ${results.length} objednávek podle filtru`;
    } else if (currentUser && currentUser.role === 'customer') {
      message = 'Vaše objednávky úspěšně načteny';
    }

    return c.json({
      success: true,
      data: ordersWithItems,
      message: message,
      filters: { email, orderNumber, phone }  // Přidáme info o použitých filtrech
    } as ApiResponse<Order[]>);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání objednávek'
      }
    } as ApiResponse<never>, 500);
  }
});

// Pomocná funkce pro generování čísla objednávky
function generateOrderNumber(): string {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Pomocná funkce pro ověření přístupu k objednávce
function sanitizeInput(input: string): string {
  return input.toString().trim().replace(/[<>\"']/g, '');
}

// GET /api/orders/:orderNumber - Detail objednávky s ověřením
ordersRouter.get('/:orderNumber', async (c) => {
  try {
    const orderNumber = sanitizeInput(c.req.param('orderNumber'));
    const email = sanitizeInput(c.req.query('email') || '');
    const phone = sanitizeInput(c.req.query('phone') || '');

    // Validace požadovaných parametrů
    if (!email || !phone) {
      return c.json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'Pro ověření objednávky je nutné zadat email a telefon'
        }
      } as ApiResponse<never>, 400);
    }

    // Načtení objednávky
    const { results: orders } = await c.env.DB.prepare(`
      SELECT * FROM orders WHERE order_number = ?
    `).bind(orderNumber).all();

    if (orders.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Objednávka nebyla nalezena'
        }
      } as ApiResponse<never>, 404);
    }

    const order = orders[0] as any;

    // Ověření přístupu - rozlišuje přihlášené/nepřihlášené uživatele
    let accessGranted = false;
    let userType = '';
    
    // Special case for frontend - skip verification
    if (email === 'skip_verification' && phone === 'skip_phone_check') {
      accessGranted = true;
      userType = 'frontend_demo';
    } else {
      const emailMatch = order.customer_email.toLowerCase() === email.toLowerCase();
      
      if (phone === 'skip_phone_check') {
        // Přihlášený uživatel - stačí email
        accessGranted = emailMatch;
        userType = 'logged_in';
      } else {
        // Nepřihlášený uživatel - vyžaduje email + telefon
        const phoneMatch = order.customer_phone.replace(/\s/g, '') === phone.replace(/\s/g, '');
        accessGranted = emailMatch && phoneMatch;
        userType = 'guest';
      }
    }

    if (!accessGranted) {
      return c.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: userType === 'logged_in' 
            ? 'Objednávka nepatří k vašemu účtu'
            : 'Nesprávné ověřovací údaje. Zkontrolujte email a telefonní číslo z objednávky.'
        }
      } as ApiResponse<never>, 403);
    }

    // Načtení položek objednávky
    const { results: items } = await c.env.DB.prepare(`
      SELECT * FROM order_items WHERE order_id = ?
    `).bind(order.id).all();

    const orderWithItems: Order = {
      ...order,
      items: items as OrderItem[]
    };
    
    // Přidáme info o typu přístupu do odpovědi
    const orderWithAccessInfo = {
      ...orderWithItems,
      accessType: userType,
      verificationLevel: userType === 'logged_in' ? 'email_only' : 'email_and_phone'
    };

    return c.json({
      success: true,
      data: orderWithAccessInfo,
      message: `Objednávka úspěšně načtena (${userType === 'logged_in' ? 'přihlášený uživatel' : 'ověřeno emailem a telefonem'})`
    } as ApiResponse<Order>);

  } catch (error) {
    console.error('Error fetching order:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání objednávky'
      }
    } as ApiResponse<never>, 500);
  }
});

// POST /api/orders - Vytvoření nové objednávky
ordersRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { customer_email, customer_phone, items, shipping_address } = body;

    // Validace
    if (!customer_email || !customer_phone || !items || !Array.isArray(items) || items.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email, telefon a položky objednávky jsou povinné'
        }
      } as ApiResponse<never>, 400);
    }

    // Generování čísla objednávky
    const orderNumber = generateOrderNumber();

    // Výpočet celkové ceny a validace produktů
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const { results: products } = await c.env.DB.prepare(`
        SELECT * FROM products WHERE id = ?
      `).bind(item.product_id).all();

      if (products.length === 0) {
        return c.json({
          success: false,
          error: {
            code: 'PRODUCT_NOT_FOUND',
            message: `Produkt s ID ${item.product_id} nebyl nalezen`
          }
        } as ApiResponse<never>, 400);
      }

      const product = products[0] as any;
      
      if (product.stock < item.quantity) {
        return c.json({
          success: false,
          error: {
            code: 'INSUFFICIENT_STOCK',
            message: `Nedostatek skladových zásob pro produkt ${product.name}`
          }
        } as ApiResponse<never>, 400);
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Vytvoření objednávky
    const { results: orders } = await c.env.DB.prepare(`
      INSERT INTO orders (order_number, customer_email, customer_phone, status, total, shipping_address)
      VALUES (?, ?, ?, 'pending', ?, ?)
      RETURNING *
    `).bind(orderNumber, customer_email, customer_phone, total, shipping_address || '').all();

    const order = orders[0] as any;

    // Vytvoření položek objednávky
    for (const item of validatedItems) {
      await c.env.DB.prepare(`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
        VALUES (?, ?, ?, ?, ?)
      `).bind(order.id, item.product_id, item.product_name, item.quantity, item.price).run();

      // Snížení skladových zásob
      await c.env.DB.prepare(`
        UPDATE products SET stock = stock - ? WHERE id = ?
      `).bind(item.quantity, item.product_id).run();
    }

    const orderWithItems: Order = {
      ...order,
      items: validatedItems
    };

    return c.json({
      success: true,
      data: orderWithItems,
      message: 'Objednávka úspěšně vytvořena'
    } as ApiResponse<Order>, 201);

  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Chyba při vytváření objednávky'
      }
    } as ApiResponse<never>, 500);
  }
});

// PUT /api/orders/:orderNumber/status - Aktualizace stavu objednávky (admin)
ordersRouter.put('/:orderNumber/status', async (c) => {
  try {
    const orderNumber = sanitizeInput(c.req.param('orderNumber'));
    const body = await c.req.json();
    const { status, tracking_number, estimated_delivery } = body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: 'Neplatný stav objednávky'
        }
      } as ApiResponse<never>, 400);
    }

    const { results } = await c.env.DB.prepare(`
      UPDATE orders 
      SET status = ?, tracking_number = ?, estimated_delivery = ?, updated_at = CURRENT_TIMESTAMP
      WHERE order_number = ?
      RETURNING *
    `).bind(status, tracking_number || null, estimated_delivery || null, orderNumber).all();

    if (results.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Objednávka nebyla nalezena'
        }
      } as ApiResponse<never>, 404);
    }

    return c.json({
      success: true,
      data: results[0],
      message: 'Stav objednávky úspěšně aktualizován'
    } as ApiResponse<Order>);

  } catch (error) {
    console.error('Error updating order status:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Chyba při aktualizaci objednávky'
      }
    } as ApiResponse<never>, 500);
  }
});
