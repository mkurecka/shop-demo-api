-- Migration for ticket/support system
-- Created: 2025-07-28

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number TEXT UNIQUE NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'technical', 'billing', 'shipping', 'product', 'complaint')),
    assigned_to INTEGER,
    chatbot_session_id TEXT,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    closed_at DATETIME,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (chatbot_session_id) REFERENCES chatbot_sessions(session_id)
);

-- Ticket messages/comments table
CREATE TABLE IF NOT EXISTS ticket_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    message_type TEXT CHECK (message_type IN ('customer', 'agent', 'system')) NOT NULL,
    sender_name TEXT,
    sender_email TEXT,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    attachments TEXT,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_email ON tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_number ON tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_tickets_chatbot_session ON tickets(chatbot_session_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_tickets_updated_at 
    AFTER UPDATE ON tickets
    FOR EACH ROW
    BEGIN
        UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Link existing chatbot sessions to tickets (optional relationship)
ALTER TABLE chatbot_sessions ADD COLUMN ticket_id INTEGER REFERENCES tickets(id);