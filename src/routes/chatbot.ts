import { Hono } from 'hono';
import type { Env, ApiResponse } from '../types';
import { requireAuth } from './auth';

export const chatbotRouter = new Hono<{ Bindings: Env }>();

// Pomocná funkce pro sanitizaci vstupu
function sanitizeInput(input: string): string {
  return input.toString().trim().replace(/[<>\"']/g, '');
}

// Pomocná funkce pro generování session ID
function generateSessionId(): string {
  return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

// POST /api/chatbot/sessions - Vytvoření nové chatbot session
chatbotRouter.post('/sessions', async (c) => {
  try {
    const body = await c.req.json();
    const { customer_email, customer_phone, metadata } = body;

    const sessionId = generateSessionId();

    // Vytvoření nové session
    const { results } = await c.env.DB.prepare(`
      INSERT INTO chatbot_sessions (session_id, customer_email, customer_phone, metadata)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `).bind(
      sessionId,
      customer_email || null,
      customer_phone || null,
      metadata ? JSON.stringify(metadata) : null
    ).all();

    return c.json({
      success: true,
      data: results[0],
      message: 'Chatbot session úspěšně vytvořena'
    } satisfies ApiResponse<any>, 201);

  } catch (error) {
    console.error('Error creating chatbot session:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Chyba při vytváření chatbot session'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// GET /api/chatbot/sessions/:sessionId - Detail chatbot session
chatbotRouter.get('/sessions/:sessionId', async (c) => {
  try {
    const sessionId = sanitizeInput(c.req.param('sessionId'));

    // Načtení session
    const { results: sessions } = await c.env.DB.prepare(`
      SELECT * FROM chatbot_sessions WHERE session_id = ?
    `).bind(sessionId).all();

    if (sessions.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Chatbot session nebyla nalezena'
        }
      } satisfies ApiResponse<never>, 404);
    }

    const session = sessions[0] as any;

    // Načtení zpráv session
    const { results: messages } = await c.env.DB.prepare(`
      SELECT * FROM chatbot_messages WHERE session_id = ? ORDER BY created_at ASC
    `).bind(sessionId).all();

    return c.json({
      success: true,
      data: {
        ...session,
        messages: messages,
        metadata: session.metadata ? JSON.parse(session.metadata) : null
      },
      message: 'Chatbot session úspěšně načtena'
    } satisfies ApiResponse<any>);

  } catch (error) {
    console.error('Error fetching chatbot session:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání chatbot session'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// POST /api/chatbot/sessions/:sessionId/messages - Přidání zprávy do session
chatbotRouter.post('/sessions/:sessionId/messages', async (c) => {
  try {
    const sessionId = sanitizeInput(c.req.param('sessionId'));
    const body = await c.req.json();
    const { 
      message_type, 
      content, 
      token_count = 0,
      cost = 0.0,
      response_time_ms = 0,
      model_used,
      metadata 
    } = body;

    // Validace
    if (!message_type || !content) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'message_type a content jsou povinné'
        }
      } satisfies ApiResponse<never>, 400);
    }

    if (!['user', 'assistant'].includes(message_type)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_MESSAGE_TYPE',
          message: 'message_type musí být "user" nebo "assistant"'
        }
      } satisfies ApiResponse<never>, 400);
    }

    // Kontrola existence session
    const { results: sessions } = await c.env.DB.prepare(`
      SELECT * FROM chatbot_sessions WHERE session_id = ?
    `).bind(sessionId).all();

    if (sessions.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Chatbot session nebyla nalezena'
        }
      } satisfies ApiResponse<never>, 404);
    }

    // Vložení zprávy
    const { results: messageResults } = await c.env.DB.prepare(`
      INSERT INTO chatbot_messages (session_id, message_type, content, token_count, cost, response_time_ms, model_used, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      sessionId,
      message_type,
      content,
      token_count,
      cost,
      response_time_ms,
      model_used || null,
      metadata ? JSON.stringify(metadata) : null
    ).all();

    // Aktualizace session statistik
    await c.env.DB.prepare(`
      UPDATE chatbot_sessions 
      SET total_messages = total_messages + 1,
          total_cost = total_cost + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE session_id = ?
    `).bind(cost, sessionId).run();

    const message = messageResults[0] as any;

    return c.json({
      success: true,
      data: {
        ...message,
        metadata: message.metadata ? JSON.parse(message.metadata) : null
      },
      message: 'Zpráva úspěšně přidána'
    } satisfies ApiResponse<any>, 201);

  } catch (error) {
    console.error('Error adding message to session:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Chyba při přidávání zprávy'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// GET /api/chatbot/sessions - Seznam chatbot sessions (personalized)
chatbotRouter.get('/sessions', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    const status = c.req.query('status');

    // Check if user is logged in
    const authHeader = c.req.header('Authorization');
    const sessionToken = authHeader?.replace('Bearer ', '');
    let currentUser = null;

    if (sessionToken) {
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

    let query = 'SELECT * FROM chatbot_sessions';
    let params: any[] = [];
    let whereClause = '';

    if (currentUser && currentUser.role === 'customer') {
      // Logged-in customer: show only their chat sessions
      whereClause = ' WHERE customer_email = ?';
      params.push(currentUser.email);
    }

    if (status) {
      if (whereClause) {
        whereClause += ' AND status = ?';
      } else {
        whereClause = ' WHERE status = ?';
      }
      params.push(status);
    }

    query += whereClause + ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Pro každou session načteme počet zpráv
    const sessionsWithCounts = await Promise.all(
      results.map(async (session: any) => {
        const { results: messageCount } = await c.env.DB.prepare(`
          SELECT COUNT(*) as count FROM chatbot_messages WHERE session_id = ?
        `).bind(session.session_id).all();

        return {
          ...session,
          message_count: messageCount[0]?.count || 0,
          metadata: session.metadata ? JSON.parse(session.metadata) : null
        };
      })
    );

    return c.json({
      success: true,
      data: sessionsWithCounts,
      message: 'Chatbot sessions úspěšně načteny'
    } satisfies ApiResponse<any[]>);

  } catch (error) {
    console.error('Error fetching chatbot sessions:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání chatbot sessions'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// PUT /api/chatbot/sessions/:sessionId - Aktualizace chatbot session
chatbotRouter.put('/sessions/:sessionId', async (c) => {
  try {
    const sessionId = sanitizeInput(c.req.param('sessionId'));
    const body = await c.req.json();
    const { status, customer_email, customer_phone, metadata } = body;

    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (customer_email !== undefined) {
      updates.push('customer_email = ?');
      params.push(customer_email);
    }

    if (customer_phone !== undefined) {
      updates.push('customer_phone = ?');
      params.push(customer_phone);
    }

    if (metadata !== undefined) {
      updates.push('metadata = ?');
      params.push(metadata ? JSON.stringify(metadata) : null);
    }

    if (updates.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'NO_UPDATES',
          message: 'Žádné údaje k aktualizaci'
        }
      } satisfies ApiResponse<never>, 400);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(sessionId);

    const { results } = await c.env.DB.prepare(`
      UPDATE chatbot_sessions 
      SET ${updates.join(', ')}
      WHERE session_id = ?
      RETURNING *
    `).bind(...params).all();

    if (results.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Chatbot session nebyla nalezena'
        }
      } satisfies ApiResponse<never>, 404);
    }

    const session = results[0] as any;

    return c.json({
      success: true,
      data: {
        ...session,
        metadata: session.metadata ? JSON.parse(session.metadata) : null
      },
      message: 'Chatbot session úspěšně aktualizována'
    } satisfies ApiResponse<any>);

  } catch (error) {
    console.error('Error updating chatbot session:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Chyba při aktualizaci chatbot session'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// GET /api/chatbot/analytics - Analytika chatbot sessions
chatbotRouter.get('/analytics', async (c) => {
  try {
    // Celkové statistiky
    const { results: totalStats } = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(total_messages) as total_messages,
        SUM(total_cost) as total_cost,
        AVG(total_messages) as avg_messages_per_session,
        AVG(total_cost) as avg_cost_per_session
      FROM chatbot_sessions
    `).all();

    // Statistiky podle statusu
    const { results: statusStats } = await c.env.DB.prepare(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(total_cost) as total_cost
      FROM chatbot_sessions
      GROUP BY status
    `).all();

    // Denní statistiky (posledních 30 dní)
    const { results: dailyStats } = await c.env.DB.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as sessions_count,
        SUM(total_messages) as messages_count,
        SUM(total_cost) as total_cost
      FROM chatbot_sessions
      WHERE created_at >= DATE('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `).all();

    // Top zákazníci podle počtu sessions
    const { results: topCustomers } = await c.env.DB.prepare(`
      SELECT 
        customer_email,
        COUNT(*) as session_count,
        SUM(total_messages) as total_messages,
        SUM(total_cost) as total_cost
      FROM chatbot_sessions
      WHERE customer_email IS NOT NULL
      GROUP BY customer_email
      ORDER BY session_count DESC
      LIMIT 10
    `).all();

    return c.json({
      success: true,
      data: {
        overview: totalStats[0],
        by_status: statusStats,
        daily_stats: dailyStats,
        top_customers: topCustomers
      },
      message: 'Analytika úspěšně načtena'
    } satisfies ApiResponse<any>);

  } catch (error) {
    console.error('Error fetching chatbot analytics:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání analytiky'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// DELETE /api/chatbot/sessions/:sessionId - Smazání chatbot session
chatbotRouter.delete('/sessions/:sessionId', async (c) => {
  try {
    const sessionId = sanitizeInput(c.req.param('sessionId'));

    // Nejprve smažeme zprávy
    await c.env.DB.prepare(`
      DELETE FROM chatbot_messages WHERE session_id = ?
    `).bind(sessionId).run();

    // Pak smažeme session
    const { results } = await c.env.DB.prepare(`
      DELETE FROM chatbot_sessions WHERE session_id = ?
      RETURNING *
    `).bind(sessionId).all();

    if (results.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Chatbot session nebyla nalezena'
        }
      } satisfies ApiResponse<never>, 404);
    }

    return c.json({
      success: true,
      message: 'Chatbot session úspěšně smazána'
    } satisfies ApiResponse<never>);

  } catch (error) {
    console.error('Error deleting chatbot session:', error);
    return c.json({
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Chyba při mazání chatbot session'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// POST /api/chatbot/mock - Mock webhook pro testování
chatbotRouter.post('/mock', async (c) => {
  try {
    const body = await c.req.json();
    // Handle both direct message and webhook data format
    const message = body.message || body.data?.message || 'Test message';

    // Simulace chatbot odpovedi s ruznymi formaty
    const responses = [
      { message: 'Ahoj! Rozumim, ze se ptate na: "' + message + '". Jak vam mohu pomoci?' },
      { response: 'Dekuji za vasi zpravu: "' + message + '". Jaka je vase dalsi otazka?' },
      { text: 'Slysel jsem: "' + message + '". Chtel byste se dozvedet vice?' },
      { content: 'Vase zprava "' + message + '" byla zpracovana. Mohu vam s necim pomoci?' },
      { timestamp: new Date().toISOString(), status: "success" }
    ];

    // Vybere nahodnou odpoved
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return c.json(randomResponse);

  } catch (error) {
    console.error('Mock webhook error:', error);
    return c.json({
      error: 'Chyba v mock webhook',
      timestamp: new Date().toISOString(),
      status: 'error'
    }, 500);
  }
});

// POST /api/chatbot/webhook - Odeslání zprávy do n8n webhook
chatbotRouter.post('/webhook', async (c) => {
  try {
    const body = await c.req.json();
    const { message, webhookUrl } = body;

    if (!message) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Zpráva je povinná'
        }
      } satisfies ApiResponse<never>, 400);
    }

    // Zjistíme, zda je uživatel přihlášen
    let isLoggedIn = false;
    let customerEmail = null;
    let simulatedUser = body.simulatedUser; // Pro simulaci uživatele z frontendu

    // Zkusíme získat auth token z headeru
    const authHeader = c.req.header('Authorization');
    const sessionToken = authHeader?.replace('Bearer ', '');

    // Check for simulated user (frontend sends fake session tokens)
    if (sessionToken && sessionToken.startsWith('fake_session_for_')) {
      isLoggedIn = true;
      customerEmail = sessionToken.replace('fake_session_for_', '');
    } else if (sessionToken) {
      // Real authentication check (kept for backward compatibility)
      try {
        const { results: sessions } = await c.env.DB.prepare(`
          SELECT u.email, u.first_name, u.last_name, u.role
          FROM user_sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.session_token = ? AND s.expires_at > datetime('now')
        `).bind(sessionToken).all();

        if (sessions.length > 0) {
          isLoggedIn = true;
          customerEmail = sessions[0].email;
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    }

    // Vygenerujeme nebo získáme session ID pro chatbot
    let chatSessionId = body.sessionId; // Může být poslané z frontendu
    
    if (!chatSessionId) {
      chatSessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    // Připravíme data pro webhook
    const webhookData = {
      message: sanitizeInput(message),
      isLoggedIn,
      customerEmail,
      sessionId: chatSessionId,
      timestamp: new Date().toISOString(),
      userAgent: c.req.header('User-Agent') || '',
      ipAddress: c.req.header('CF-Connecting-IP') || '',
      simulatedUser: simulatedUser || null
    };

    // Odešleme data do n8n webhook
    const finalWebhookUrl = webhookUrl || 'https://n8n.2d2.cz/webhook/demo-test-chatbot';
    
    const webhookResponse = await fetch(finalWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    if (!webhookResponse.ok) {
      console.error('Webhook error:', webhookResponse.status, await webhookResponse.text());
      return c.json({
        success: false,
        error: {
          code: 'WEBHOOK_ERROR',
          message: 'Chyba při komunikaci s chatbotem'
        }
      } satisfies ApiResponse<never>, 500);
    }

    let webhookResult;
    try {
      const responseText = await webhookResponse.text();
      webhookResult = responseText ? JSON.parse(responseText) : { message: 'Empty response' };
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      webhookResult = { message: 'Invalid JSON response from webhook' };
    }

    // Zkontrolujeme, zda session již existuje
    const { results: existingSession } = await c.env.DB.prepare(`
      SELECT id FROM chatbot_sessions WHERE session_id = ?
    `).bind(chatSessionId).all();

    // Pokud session neexistuje, vytvoříme novou
    if (existingSession.length === 0) {
      await c.env.DB.prepare(`
        INSERT INTO chatbot_sessions (session_id, customer_email, customer_phone, metadata)
        VALUES (?, ?, ?, ?)
      `).bind(
        chatSessionId,
        customerEmail,
        null, // phone bude null pro web chat
        JSON.stringify({ 
          isLoggedIn,
          userAgent: c.req.header('User-Agent') || '',
          ipAddress: c.req.header('CF-Connecting-IP') || '',
          created_via: 'web_chat'
        })
      ).run();
    }

    // Uložíme user message
    await c.env.DB.prepare(`
      INSERT INTO chatbot_messages (session_id, message_type, content, metadata)
      VALUES (?, ?, ?, ?)
    `).bind(
      chatSessionId,
      'user',
      message,
      JSON.stringify({ 
        isLoggedIn,
        customerEmail,
        timestamp: new Date().toISOString()
      })
    ).run();

    // Uložíme bot response
    await c.env.DB.prepare(`
      INSERT INTO chatbot_messages (session_id, message_type, content, metadata)
      VALUES (?, ?, ?, ?)
    `).bind(
      chatSessionId,
      'assistant',
      JSON.stringify(webhookResult),
      JSON.stringify({ 
        webhook_url: finalWebhookUrl,
        timestamp: new Date().toISOString()
      })
    ).run();

    return c.json({
      success: true,
      data: {
        session_id: chatSessionId,
        user_message: message,
        bot_response: webhookResult,
        user_context: {
          isLoggedIn,
          customerEmail
        },
        timestamp: new Date().toISOString()
      },
      message: 'Zpráva úspěšně odeslána do chatbotu'
    } satisfies ApiResponse<any>);

  } catch (error) {
    console.error('Error sending message to webhook:', error);
    return c.json({
      success: false,
      error: {
        code: 'WEBHOOK_ERROR',
        message: 'Chyba při odesílání zprávy do chatbotu'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// GET /api/chatbot/sessions/:sessionId/history - Historie konverzace pro session
chatbotRouter.get('/sessions/:sessionId/history', async (c) => {
  try {
    const sessionId = sanitizeInput(c.req.param('sessionId'));

    // Načteme session a její zprávy
    const { results: session } = await c.env.DB.prepare(`
      SELECT * FROM chatbot_sessions WHERE session_id = ?
    `).bind(sessionId).all();

    if (session.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Chat session nebyla nalezena'
        }
      } satisfies ApiResponse<never>, 404);
    }

    // Načteme všechny zprávy pro tuto session
    const { results: messages } = await c.env.DB.prepare(`
      SELECT * FROM chatbot_messages 
      WHERE session_id = ? 
      ORDER BY created_at ASC
    `).bind(sessionId).all();

    return c.json({
      success: true,
      data: {
        session: {
          ...session[0],
          metadata: session[0].metadata ? JSON.parse(session[0].metadata) : null
        },
        messages: messages.map((msg: any) => ({
          ...msg,
          metadata: msg.metadata ? JSON.parse(msg.metadata) : null
        }))
      },
      message: 'Historie konverzace úspěšně načtena'
    } satisfies ApiResponse<any>);

  } catch (error) {
    console.error('Error fetching chat history:', error);
    return c.json({
      success: false,
      error: {
        code: 'HISTORY_ERROR',
        message: 'Chyba při načítání historie konverzace'
      }
    } satisfies ApiResponse<never>, 500);
  }
});