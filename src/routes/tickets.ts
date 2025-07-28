import { Hono } from 'hono';
import type { Env, ApiResponse } from '../types';
import { requireAuth } from './auth';

export const ticketsRouter = new Hono<{ Bindings: Env }>();

// Pomocná funkce pro sanitizaci vstupu
function sanitizeInput(input: string): string {
  return input.toString().trim().replace(/[<>"']/g, '');
}

// Pomocná funkce pro generování ticket number
function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `TK-${timestamp}-${random}`;
}

// POST /api/tickets - Vytvoření nového ticketu
ticketsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { 
      customer_email, 
      customer_phone, 
      subject, 
      description, 
      priority = 'medium',
      category = 'general',
      chatbot_session_id,
      metadata 
    } = body;

    // Validace
    if (!subject || !description) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Subject a description jsou povinné'
        }
      } satisfies ApiResponse<never>, 400);
    }

    const ticketNumber = generateTicketNumber();

    // Vytvoření ticketu
    const { results } = await c.env.DB.prepare(`
      INSERT INTO tickets (ticket_number, customer_email, customer_phone, subject, description, priority, category, chatbot_session_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      ticketNumber,
      customer_email || null,
      customer_phone || null,
      sanitizeInput(subject),
      sanitizeInput(description),
      priority,
      category,
      chatbot_session_id || null,
      metadata ? JSON.stringify(metadata) : null
    ).all();

    const ticket = results[0] as any;

    // Přidáme první systémovou zprávu
    await c.env.DB.prepare(`
      INSERT INTO ticket_messages (ticket_id, message_type, sender_name, content, is_internal)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      ticket.id,
      'system',
      'System',
      `Ticket ${ticketNumber} byl vytvořen.`,
      false
    ).run();

    // Pokud má chatbot_session_id, propojíme session s ticketem
    if (chatbot_session_id) {
      await c.env.DB.prepare(`
        UPDATE chatbot_sessions SET ticket_id = ? WHERE session_id = ?
      `).bind(ticket.id, chatbot_session_id).run();
    }

    return c.json({
      success: true,
      data: {
        ...ticket,
        metadata: ticket.metadata ? JSON.parse(ticket.metadata) : null
      },
      message: `Ticket ${ticketNumber} byl úspěšně vytvořen`
    } satisfies ApiResponse<any>, 201);

  } catch (error) {
    console.error('Error creating ticket:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Chyba při vytváření ticketu'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// GET /api/tickets - Seznam všech ticketů
ticketsRouter.get('/', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    const status = c.req.query('status');
    const priority = c.req.query('priority');
    const category = c.req.query('category');

    let query = 'SELECT * FROM tickets WHERE 1=1';
    let params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Pro každý ticket načteme počet zpráv
    const ticketsWithCounts = await Promise.all(
      results.map(async (ticket: any) => {
        const { results: messageCount } = await c.env.DB.prepare(`
          SELECT COUNT(*) as count FROM ticket_messages WHERE ticket_id = ?
        `).bind(ticket.id).all();

        return {
          ...ticket,
          message_count: messageCount[0]?.count || 0,
          metadata: ticket.metadata ? JSON.parse(ticket.metadata) : null
        };
      })
    );

    return c.json({
      success: true,
      data: ticketsWithCounts,
      message: 'Tickety úspěšně načteny'
    } satisfies ApiResponse<any[]>);

  } catch (error) {
    console.error('Error fetching tickets:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání ticketů'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// GET /api/tickets/:ticketId - Detail ticketu
ticketsRouter.get('/:ticketId', async (c) => {
  try {
    const ticketId = sanitizeInput(c.req.param('ticketId'));

    // Načtení ticketu (může být ID nebo ticket_number)
    let ticket;
    if (ticketId.startsWith('TK-')) {
      const { results } = await c.env.DB.prepare(`
        SELECT * FROM tickets WHERE ticket_number = ?
      `).bind(ticketId).all();
      ticket = results[0];
    } else {
      const { results } = await c.env.DB.prepare(`
        SELECT * FROM tickets WHERE id = ?
      `).bind(parseInt(ticketId)).all();
      ticket = results[0];
    }

    if (!ticket) {
      return c.json({
        success: false,
        error: {
          code: 'TICKET_NOT_FOUND',
          message: 'Ticket nebyl nalezen'
        }
      } satisfies ApiResponse<never>, 404);
    }

    // Načtení zpráv ticketu
    const { results: messages } = await c.env.DB.prepare(`
      SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC
    `).bind(ticket.id).all();

    // Načtení propojené chatbot session (pokud existuje)
    let chatbotSession = null;
    if (ticket.chatbot_session_id) {
      const { results: sessions } = await c.env.DB.prepare(`
        SELECT * FROM chatbot_sessions WHERE session_id = ?
      `).bind(ticket.chatbot_session_id).all();
      chatbotSession = sessions[0] || null;
    }

    return c.json({
      success: true,
      data: {
        ...ticket,
        metadata: ticket.metadata ? JSON.parse(ticket.metadata) : null,
        messages: messages,
        chatbot_session: chatbotSession
      },
      message: 'Ticket úspěšně načten'
    } satisfies ApiResponse<any>);

  } catch (error) {
    console.error('Error fetching ticket:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání ticketu'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// POST /api/tickets/:ticketId/messages - Přidání zprávy do ticketu
ticketsRouter.post('/:ticketId/messages', async (c) => {
  try {
    const ticketId = parseInt(c.req.param('ticketId'));
    const body = await c.req.json();
    const { 
      message_type = 'customer', 
      sender_name, 
      sender_email,
      content, 
      is_internal = false,
      attachments,
      metadata 
    } = body;

    // Validace
    if (!content) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Content je povinný'
        }
      } satisfies ApiResponse<never>, 400);
    }

    if (!['customer', 'agent', 'system'].includes(message_type)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_MESSAGE_TYPE',
          message: 'message_type musí být "customer", "agent" nebo "system"'
        }
      } satisfies ApiResponse<never>, 400);
    }

    // Kontrola existence ticketu
    const { results: tickets } = await c.env.DB.prepare(`
      SELECT * FROM tickets WHERE id = ?
    `).bind(ticketId).all();

    if (tickets.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'TICKET_NOT_FOUND',
          message: 'Ticket nebyl nalezen'
        }
      } satisfies ApiResponse<never>, 404);
    }

    // Vložení zprávy
    const { results: messageResults } = await c.env.DB.prepare(`
      INSERT INTO ticket_messages (ticket_id, message_type, sender_name, sender_email, content, is_internal, attachments, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      ticketId,
      message_type,
      sender_name || null,
      sender_email || null,
      sanitizeInput(content),
      is_internal,
      attachments ? JSON.stringify(attachments) : null,
      metadata ? JSON.stringify(metadata) : null
    ).all();

    const message = messageResults[0] as any;

    return c.json({
      success: true,
      data: {
        ...message,
        attachments: message.attachments ? JSON.parse(message.attachments) : null,
        metadata: message.metadata ? JSON.parse(message.metadata) : null
      },
      message: 'Zpráva úspěšně přidána'
    } satisfies ApiResponse<any>, 201);

  } catch (error) {
    console.error('Error adding message to ticket:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Chyba při přidávání zprávy'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// PUT /api/tickets/:ticketId - Aktualizace ticketu
ticketsRouter.put('/:ticketId', async (c) => {
  try {
    const ticketId = parseInt(c.req.param('ticketId'));
    const body = await c.req.json();
    const { status, priority, category, assigned_to, subject, description, metadata } = body;

    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
      
      // Pokud se uzavírá ticket, nastavíme čas uzavření
      if (status === 'resolved') {
        updates.push('resolved_at = CURRENT_TIMESTAMP');
      } else if (status === 'closed') {
        updates.push('closed_at = CURRENT_TIMESTAMP');
      }
    }

    if (priority) {
      updates.push('priority = ?');
      params.push(priority);
    }

    if (category) {
      updates.push('category = ?');
      params.push(category);
    }

    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assigned_to);
    }

    if (subject) {
      updates.push('subject = ?');
      params.push(sanitizeInput(subject));
    }

    if (description) {
      updates.push('description = ?');
      params.push(sanitizeInput(description));
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
    params.push(ticketId);

    const { results } = await c.env.DB.prepare(`
      UPDATE tickets 
      SET ${updates.join(', ')}
      WHERE id = ?
      RETURNING *
    `).bind(...params).all();

    if (results.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'TICKET_NOT_FOUND',
          message: 'Ticket nebyl nalezen'
        }
      } satisfies ApiResponse<never>, 404);
    }

    const ticket = results[0] as any;

    return c.json({
      success: true,
      data: {
        ...ticket,
        metadata: ticket.metadata ? JSON.parse(ticket.metadata) : null
      },
      message: 'Ticket úspěšně aktualizován'
    } satisfies ApiResponse<any>);

  } catch (error) {
    console.error('Error updating ticket:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Chyba při aktualizaci ticketu'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// GET /api/tickets/analytics - Analytika ticketů
ticketsRouter.get('/analytics', async (c) => {
  try {
    // Celkové statistiky
    const { results: totalStats } = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets
      FROM tickets
    `).all();

    // Statistiky podle priority
    const { results: priorityStats } = await c.env.DB.prepare(`
      SELECT 
        priority,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_count
      FROM tickets
      GROUP BY priority
    `).all();

    // Statistiky podle kategorie
    const { results: categoryStats } = await c.env.DB.prepare(`
      SELECT 
        category,
        COUNT(*) as count,
        AVG(CASE 
          WHEN resolved_at IS NOT NULL 
          THEN (julianday(resolved_at) - julianday(created_at)) * 24 
          ELSE NULL 
        END) as avg_resolution_hours
      FROM tickets
      GROUP BY category
    `).all();

    // Denní statistiky (posledních 30 dní)
    const { results: dailyStats } = await c.env.DB.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as tickets_created,
        COUNT(CASE WHEN resolved_at IS NOT NULL AND DATE(resolved_at) = DATE(created_at) THEN 1 END) as tickets_resolved_same_day
      FROM tickets
      WHERE created_at >= DATE('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `).all();

    return c.json({
      success: true,
      data: {
        overview: totalStats[0],
        by_priority: priorityStats,
        by_category: categoryStats,
        daily_stats: dailyStats
      },
      message: 'Analytika ticketů úspěšně načtena'
    } satisfies ApiResponse<any>);

  } catch (error) {
    console.error('Error fetching ticket analytics:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Chyba při načítání analytiky'
      }
    } satisfies ApiResponse<never>, 500);
  }
});

// DELETE /api/tickets/:ticketId - Smazání ticketu
ticketsRouter.delete('/:ticketId', async (c) => {
  try {
    const ticketId = parseInt(c.req.param('ticketId'));

    // Nejprve smažeme zprávy
    await c.env.DB.prepare(`
      DELETE FROM ticket_messages WHERE ticket_id = ?
    `).bind(ticketId).run();

    // Pak smažeme ticket
    const { results } = await c.env.DB.prepare(`
      DELETE FROM tickets WHERE id = ?
      RETURNING *
    `).bind(ticketId).all();

    if (results.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'TICKET_NOT_FOUND',
          message: 'Ticket nebyl nalezen'
        }
      } satisfies ApiResponse<never>, 404);
    }

    return c.json({
      success: true,
      message: 'Ticket úspěšně smazán'
    } satisfies ApiResponse<never>);

  } catch (error) {
    console.error('Error deleting ticket:', error);
    return c.json({
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Chyba při mazání ticketu'
      }
    } satisfies ApiResponse<never>, 500);
  }
});