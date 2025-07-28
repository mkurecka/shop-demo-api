import { Hono } from 'hono';
import type { Env, ApiResponse } from '../types';

export const authRouter = new Hono<{ Bindings: Env }>();

// Pomocné funkce
function sanitizeInput(input: string): string {
  return input.toString().trim().replace(/[<>\"']/g, '');
}

function generateSessionToken(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
}

// Jednoduchá hash funkce (v produkci by se měl použít bcrypt)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'simple_hash_' + Math.abs(hash).toString(16);
}

function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}

// Middleware pro kontrolu přihlášení
async function requireAuth(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  const sessionToken = authHeader?.replace('Bearer ', '');

  if (!sessionToken) {
    return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Přihlášení je vyžadováno'
      }
    } satisfies ApiResponse<never>, 401);
  }

  try {
    const { results: sessions } = await c.env.DB.prepare(`
      SELECT s.*, u.id as user_id, u.email, u.first_name, u.last_name, u.role
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `).bind(sessionToken).all();

    if (sessions.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_SESSION',
          message: 'Neplatná nebo expirovaná session'
        }
      } satisfies ApiResponse<never>, 401);
    }

    // Uložení user info do context
    c.set('user', sessions[0]);
    await next();
  } catch (error) {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Chyba při ověřování'
      }
    } satisfies ApiResponse<never>, 500);
  }
}

// POST /api/auth/register - Registrace nového uživatele
authRouter.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, first_name, last_name, role = 'customer' } = body;

    // Validace
    if (!email || !password || !first_name || !last_name) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email, heslo, jméno a příjmení jsou povinné'
        }
      } satisfies ApiResponse<never>, 400);
    }

    if (password.length < 6) {
      return c.json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Heslo musí mít alespoň 6 znaků'
        }
      } satisfies ApiResponse<never>, 400);
    }

    // Kontrola existence emailu
    const { results: existing } = await c.env.DB.prepare(`
      SELECT id FROM users WHERE email = ?
    `).bind(email).all();

    if (existing.length > 0) {
      return c.json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Uživatel s tímto emailem již existuje'
        }
      } satisfies ApiResponse<never>, 409);
    }

    // Hashování hesla
    const passwordHash = simpleHash(password);

    // Vytvoření uživatele
    const { results } = await c.env.DB.prepare(`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES (?, ?, ?, ?, ?)
      RETURNING id, email, first_name, last_name, role, created_at
    `).bind(email, passwordHash, first_name, last_name, role).all();

    const user = results[0] as any;

    return c.json({
      success: true,
      data: user,
      message: 'Uživatel úspěšně registrován'
    } satisfies ApiResponse<any>, 201);

  } catch (error) {
    console.error('Error registering user:', error);
    return c.json({
      success: false,
      error: {
        code: 'REGISTER_ERROR',
        message: 'Chyba při registraci uživatele'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// POST /api/auth/login - Přihlášení uživatele
authRouter.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    // Validace
    if (!email || !password) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email a heslo jsou povinné'
        }
      } satisfies ApiResponse<never>, 400);
    }

    // Najít uživatele
    const { results: users } = await c.env.DB.prepare(`
      SELECT * FROM users WHERE email = ? AND is_active = 1
    `).bind(email).all();

    if (users.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Nesprávný email nebo heslo'
        }
      } satisfies ApiResponse<never>, 401);
    }

    const user = users[0] as any;

    // Ověřit heslo
    if (!verifyPassword(password, user.password_hash)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Nesprávný email nebo heslo'
        }
      } satisfies ApiResponse<never>, 401);
    }

    // Vytvořit session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dní

    await c.env.DB.prepare(`
      INSERT INTO user_sessions (user_id, session_token, expires_at, user_agent, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      user.id,
      sessionToken,
      expiresAt.toISOString(),
      c.req.header('User-Agent') || '',
      c.req.header('CF-Connecting-IP') || ''
    ).run();

    // Aktualizovat last_login
    await c.env.DB.prepare(`
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(user.id).run();

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        session_token: sessionToken,
        expires_at: expiresAt
      },
      message: 'Úspěšně přihlášen'
    } satisfies ApiResponse<any>);

  } catch (error) {
    console.error('Error logging in user:', error);
    return c.json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'Chyba při přihlašování'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// POST /api/auth/logout - Odhlášení uživatele
authRouter.post('/logout', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const authHeader = c.req.header('Authorization');
    const sessionToken = authHeader?.replace('Bearer ', '');

    if (sessionToken) {
      await c.env.DB.prepare(`
        DELETE FROM user_sessions WHERE session_token = ?
      `).bind(sessionToken).run();
    }

    return c.json({
      success: true,
      message: 'Úspěšně odhlášen'
    } satisfies ApiResponse<never>);

  } catch (error) {
    console.error('Error logging out user:', error);
    return c.json({
      success: false,
      error: {
        code: 'LOGOUT_ERROR',
        message: 'Chyba při odhlašování'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// GET /api/auth/me - Informace o přihlášeném uživateli
authRouter.get('/me', requireAuth, async (c) => {
  try {
    const user = c.get('user');

    return c.json({
      success: true,
      data: {
        id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        last_login: user.last_login
      },
      message: 'Informace o uživateli'
    } satisfies ApiResponse<any>);

  } catch (error) {
    console.error('Error getting user info:', error);
    return c.json({
      success: false,
      error: {
        code: 'USER_INFO_ERROR',
        message: 'Chyba při načítání informací o uživateli'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// GET /api/auth/sessions - Seznam aktivních sessions (pouze pro adminy)
authRouter.get('/sessions', requireAuth, async (c) => {
  try {
    const user = c.get('user');

    if (user.role !== 'admin') {
      return c.json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Přístup pouze pro administrátory'
        }
      } satisfies ApiResponse<never>, 403);
    }

    const { results } = await c.env.DB.prepare(`
      SELECT s.id, s.session_token, s.expires_at, s.user_agent, s.ip_address, s.created_at,
             u.email, u.first_name, u.last_name, u.role
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.expires_at > datetime('now')
      ORDER BY s.created_at DESC
    `).all();

    return c.json({
      success: true,
      data: results,
      message: 'Seznam aktivních sessions'
    } satisfies ApiResponse<any[]>);

  } catch (error) {
    console.error('Error getting sessions:', error);
    return c.json({
      success: false,
      error: {
        code: 'SESSIONS_ERROR',
        message: 'Chyba při načítání sessions'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

export { requireAuth };