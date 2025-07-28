import { Hono } from 'hono';
import type { Env, Customer, ApiResponse } from '../types';

export const customersRouter = new Hono<{ Bindings: Env }>();

// GET /api/customers - Seznam zákazníků  
customersRouter.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM customers ORDER BY created_at DESC
    `).all();

    return c.json({
      success: true,
      data: results,
      message: 'Zákazníci úspěšně načteni'
    } as ApiResponse<Customer[]>);

  } catch (error) {
    console.error('Error fetching customers:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání zákazníků'
      }
    } as ApiResponse<never>, 500);
  }
});

// POST /api/customers - Registrace zákazníka
customersRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { email, first_name, last_name, phone, address, city, postal_code } = body;

    // Validace
    if (!email || !first_name || !last_name || !phone) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email, jméno, příjmení a telefon jsou povinné'
        }
      } as ApiResponse<never>, 400);
    }

    // Kontrola, zda email již neexistuje
    const { results: existing } = await c.env.DB.prepare(`
      SELECT id FROM customers WHERE email = ?
    `).bind(email).all();

    if (existing.length > 0) {
      return c.json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Zákazník s tímto emailem již existuje'
        }
      } as ApiResponse<never>, 409);
    }

    // Vytvoření nového zákazníka
    const { results } = await c.env.DB.prepare(`
      INSERT INTO customers (email, first_name, last_name, phone, address, city, postal_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(email, first_name, last_name, phone, address || '', city || '', postal_code || '').all();

    return c.json({
      success: true,
      data: results[0],
      message: 'Zákazník úspěšně registrován'
    } as ApiResponse<Customer>, 201);

  } catch (error) {
    console.error('Error creating customer:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Chyba při registraci zákazníka'
      }
    } as ApiResponse<never>, 500);
  }
});

// GET /api/customers/:id - Profil zákazníka
customersRouter.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    if (isNaN(id)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Neplatné ID zákazníka'
        }
      } as ApiResponse<never>, 400);
    }

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM customers WHERE id = ?
    `).bind(id).all();

    if (results.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'CUSTOMER_NOT_FOUND',
          message: 'Zákazník nebyl nalezen'
        }
      } as ApiResponse<never>, 404);
    }

    return c.json({
      success: true,
      data: results[0],
      message: 'Profil zákazníka úspěšně načten'
    } as ApiResponse<Customer>);

  } catch (error) {
    console.error('Error fetching customer:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání profilu zákazníka'
      }
    } as ApiResponse<never>, 500);
  }
});

// PUT /api/customers/:id - Aktualizace profilu zákazníka
customersRouter.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { first_name, last_name, phone, address, city, postal_code } = body;

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Neplatné ID zákazníka'
        }
      } as ApiResponse<never>, 400);
    }

    const { results } = await c.env.DB.prepare(`
      UPDATE customers 
      SET first_name = ?, last_name = ?, phone = ?, address = ?, city = ?, postal_code = ?
      WHERE id = ?
      RETURNING *
    `).bind(first_name, last_name, phone, address, city, postal_code, id).all();

    if (results.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'CUSTOMER_NOT_FOUND',
          message: 'Zákazník nebyl nalezen'
        }
      } as ApiResponse<never>, 404);
    }

    return c.json({
      success: true,
      data: results[0],
      message: 'Profil zákazníka úspěšně aktualizován'
    } as ApiResponse<Customer>);

  } catch (error) {
    console.error('Error updating customer:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Chyba při aktualizaci profilu zákazníka'
      }
    } as ApiResponse<never>, 500);
  }
});
